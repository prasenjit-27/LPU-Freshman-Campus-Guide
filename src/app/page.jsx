import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";
import { getDb, safeFind } from "@/lib/mongodb";
import PublicLanding from "@/components/PublicLanding";
import StudentDashboard from "@/components/StudentDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions).catch(() => null);

  // Common public announcements and upcoming events
  const [announcements, upcomingEvents] = await Promise.all([
    safeFind("announcements", {}, 5),
    safeFind("events", { startsAt: { $gte: new Date() } }, 5),
  ]);

  // Case 1: Unauthenticated Visitor -> Render Public Landing Dashboard
  if (!session) {
    return (
      <PublicLanding 
        announcements={announcements} 
        upcomingEvents={upcomingEvents} 
      />
    );
  }

  // Case 2: Authenticated User (Student or Admin accessing /)
  // Fetch student progress, profile, and saved locations
  let completedTaskCount = 0;
  let profile = null;
  let savedLocations = [];

  try {
    const db = await getDb();
    const userId = session.user.id;

    const [tasksDone, studentProfile, savedRows] = await Promise.all([
      db.collection("userTaskProgress").countDocuments({ userId, done: true }),
      db.collection("studentProfiles").findOne({ userId }),
      db.collection("savedLocations").find({ userId }).toArray(),
    ]);

    completedTaskCount = tasksDone;
    profile = studentProfile;

    const savedLocationIds = savedRows
      .map((r) => r.locationId)
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    if (savedLocationIds.length > 0) {
      savedLocations = await db
        .collection("campusLocations")
        .find({ _id: { $in: savedLocationIds } })
        .toArray();
    }
  } catch (err) {
    console.error("Error aggregating student dashboard:", err);
  }

  return (
    <StudentDashboard
      user={session.user}
      completedTaskCount={completedTaskCount}
      profile={profile}
      savedLocations={savedLocations}
      announcements={announcements}
      upcomingEvents={upcomingEvents}
    />
  );
}
