import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { adminUserUpdateSchema, adminUserQuerySchema } from "@/lib/validation";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden: Administrative access required" }, { status: 403 }) };
  }
  return { session, adminId: session.user.id };
}

// GET /api/admin/users: Directory showing ONLY normal student users and their progress
export async function GET(req) {
  const check = await verifyAdmin();
  if (check.error) return check.error;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const db = await getDb();
  
  // Strictly filter for normal users only (role !== "admin")
  const filter = { role: { $ne: "admin" } };

  const skip = (page - 1) * limit;
  const total = await db.collection("users").countDocuments(filter);

  // Exclude password hashes
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

// PATCH /api/admin/users: Toggle account status (active <-> deactivated / blocked)
// PATCH & POST /api/admin/users: Update user role, status (activate/deactivate), or reset password
export async function PATCH(req) {
  const check = await verifyAdmin();
  if (check.error) return check.error;

  const raw = await req.json().catch(() => null);
  const parsed = adminUserUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid update payload.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { userId, status } = parsed.data;
  const db = await getDb();

  const updateFields = { updatedAt: new Date() };
  if (status) updateFields.status = status;

  const res = await db.collection("users").updateOne(
    { _id: new (require("mongodb").ObjectId)(userId) },
    { $set: updateFields }
  );

  if (res.matchedCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, message: "User status updated successfully" });
}

export const POST = PATCH;

