import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { adminUserUpdateSchema, adminUserQuerySchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 }) };
  }
  return { session, adminId: session.user.id };
}

// GET /api/admin/users: Paginated, searchable user directory with profile and onboarding stats
export async function GET(req) {
  const check = await verifyAdmin();
  if (check.error) return check.error;

  const { searchParams } = new URL(req.url);
  const parsed = adminUserQuerySchema.safeParse({
    q: searchParams.get("q") || "",
    role: searchParams.get("role") || "all",
    status: searchParams.get("status") || "all",
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 15,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  }

  const { q, role, status, page, limit } = parsed.data;
  const db = await getDb();
  const filter = {};

  if (role !== "all") filter.role = role;
  if (status !== "all") filter.status = status;
  if (q.trim()) {
    const rx = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: rx, $options: "i" } },
      { email: { $regex: rx, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const total = await db.collection("users").countDocuments(filter);

  // Exclude password hashes permanently from projected output
  const rawUsers = await db
    .collection("users")
    .find(filter, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Attach studentProfiles and onboarding progress for each user
  const userIds = rawUsers.map((u) => String(u._id));
  const [profiles, progressCounts] = await Promise.all([
    db.collection("studentProfiles").find({ userId: { $in: userIds } }).toArray(),
    db.collection("userTaskProgress").aggregate([
      { $match: { userId: { $in: userIds }, done: true } },
      { $group: { _id: "$userId", completedTasks: { $sum: 1 } } },
    ]).toArray(),
  ]);

  const profileMap = new Map(profiles.map((p) => [p.userId, p]));
  const progressMap = new Map(progressCounts.map((pc) => [pc._id, pc.completedTasks]));

  const users = rawUsers.map((u) => {
    const strId = String(u._id);
    const p = profileMap.get(strId) || null;
    return {
      _id: strId,
      name: u.name,
      email: u.email,
      role: u.role || "student",
      status: u.status || "active",
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt || null,
      profile: p ? {
        school: p.school || "",
        programme: p.programme || "",
        year: p.year || "",
        accommodation: p.accommodation || "",
      } : null,
      completedTasks: progressMap.get(strId) || 0,
    };
  });

  return NextResponse.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  });
}

// PATCH /api/admin/users: Update user role, status (activate/deactivate), or reset password
export async function PATCH(req) {
  const check = await verifyAdmin();
  if (check.error) return check.error;

  if (!rateLimit(`admin-user-action:${check.adminId}`, 40, 60_000)) {
    return NextResponse.json({ error: "Too many admin requests. Slow down." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = adminUserUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
  }

  const { userId, role, status, newPassword } = parsed.data;
  if (!ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const db = await getDb();
  const targetUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Prevent self-demotion or self-deactivation if this is the user's own account
  if (userId === check.adminId) {
    if (role && role !== "admin") {
      return NextResponse.json({ error: "Self-demotion is restricted to avoid admin lockout." }, { status: 400 });
    }
    if (status && status !== "active") {
      return NextResponse.json({ error: "You cannot deactivate your own administrative account." }, { status: 400 });
    }
  }

  // If demoting an admin, ensure there remains at least one other active admin
  if (role && role !== "admin" && targetUser.role === "admin") {
    const adminCount = await db.collection("users").countDocuments({ role: "admin", status: "active" });
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Cannot demote the only remaining active administrator." }, { status: 400 });
    }
  }

  const updateFields = { updatedAt: new Date() };
  const auditActions = [];

  if (role && role !== targetUser.role) {
    updateFields.role = role;
    auditActions.push(`role_change:${targetUser.role}->${role}`);
  }

  if (status && status !== targetUser.status) {
    updateFields.status = status;
    auditActions.push(`status_change:${targetUser.status || "active"}->${status}`);
  }

  if (newPassword) {
    updateFields.passwordHash = await bcrypt.hash(newPassword, 12);
    auditActions.push("password_reset_initiated");
  }

  if (auditActions.length === 0) {
    return NextResponse.json({ ok: true, message: "No changes requested." });
  }

  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateFields });

  // Record audit logs
  await db.collection("auditLogs").insertOne({
    actorId: check.adminId,
    actorEmail: check.session.user.email,
    targetUserId: userId,
    targetEmail: targetUser.email,
    actions: auditActions,
    timestamp: new Date(),
    outcome: "success",
  });

  return NextResponse.json({ ok: true, message: "User updated successfully." });
}

// DELETE /api/admin/users?id=...: Safely remove user and purge their saved data and progress
export async function DELETE(req) {
  const check = await verifyAdmin();
  if (check.error) return check.error;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  if (!ObjectId.isValid(userId || "")) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (userId === check.adminId) {
    return NextResponse.json({ error: "You cannot delete your own account from the admin portal." }, { status: 400 });
  }

  const db = await getDb();
  const targetUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (targetUser.role === "admin") {
    const adminCount = await db.collection("users").countDocuments({ role: "admin", status: "active" });
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the sole administrator account." }, { status: 400 });
    }
  }

  // Delete user record
  await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

  // Cleanup related personal data
  await Promise.all([
    db.collection("studentProfiles").deleteOne({ userId }),
    db.collection("userTaskProgress").deleteMany({ userId }),
    db.collection("savedLocations").deleteMany({ userId }),
  ]);

  // Record audit log
  await db.collection("auditLogs").insertOne({
    actorId: check.adminId,
    actorEmail: check.session.user.email,
    targetUserId: userId,
    targetEmail: targetUser.email,
    action: "user_deleted",
    timestamp: new Date(),
    outcome: "success",
  });

  return NextResponse.json({ ok: true, message: "User and associated records deleted." });
}
