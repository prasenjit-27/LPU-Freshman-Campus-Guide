import bcrypt from "bcryptjs";
import { getDb } from "../src/lib/mongodb.js";
import { defaultCampusLocations } from "../src/data/campusLocations.js";
import { defaultFaqs } from "../src/data/faqsData.js";
import { sources } from "../src/data/sources.js";

async function seed() {
  console.log("Starting LPU Freshman Guide Database Seeding...");
  const db = await getDb();

  // 1. Seed Content Sources
  console.log("Seeding Content Sources...");
  for (const s of Object.values(sources)) {
    await db.collection("contentSources").updateOne(
      { sourceUrl: s.sourceUrl },
      { $set: { ...s, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  // 2. Seed Verified Campus Locations
  console.log("Seeding Campus Locations...");
  for (const loc of defaultCampusLocations) {
    await db.collection("campusLocations").updateOne(
      { name: loc.name },
      {
        $set: {
          ...loc,
          verificationStatus: "verified",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
  }

  // 3. Seed Campus Orientation FAQs
  console.log("Seeding FAQs...");
  for (const faq of defaultFaqs) {
    await db.collection("faqs").updateOne(
      { question: faq.question },
      {
        $set: {
          ...faq,
          verificationStatus: "verified",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
  }

  // 4. Seed Campus Announcements
  console.log("Seeding Announcements...");
  const sampleAnnouncements = [
    {
      title: "Freshman Induction Week Schedule Released",
      summary: "Official reporting schedules, auditorium slots, and welcome sessions for 2026-27 freshmen.",
      content: "All newly admitted students are requested to report to Shanti Devi Mittal Auditorium as per their school allotment timeslot with admission letters and identity proofs.",
      category: "orientation",
      pinned: true,
      publishedAt: new Date(),
      sourceName: "Division of Student Welfare",
      sourceUrl: "https://www.lpu.in",
      verificationStatus: "verified",
    },
    {
      title: "Hostel Check-in & Biometric Registration Active",
      summary: "Biometric turnstiles and room allotment desks are now operating 24/7 across Boys and Girls Hostel Complexes.",
      content: "Freshmen residing in hostels BH-1 to BH-8 and GH-1 to GH-6 can collect their room keys and biometric access passes from the respective warden offices.",
      category: "hostel",
      pinned: false,
      publishedAt: new Date(),
      sourceName: "LPU Residential Services",
      sourceUrl: "https://www.lpu.in",
      verificationStatus: "verified",
    },
    {
      title: "Campus Shuttle Routes & Timings",
      summary: "Free electric campus shuttles running every 10 minutes between Gate 1, Block 34, Uni-Mall, and Hostels.",
      content: "Hop on the orange LPU eco-shuttles at designated stops across the central campus road network from 7:00 AM to 10:00 PM.",
      category: "transport",
      pinned: false,
      publishedAt: new Date(),
      sourceName: "Campus Transport Office",
      sourceUrl: "https://www.lpu.in",
      verificationStatus: "verified",
    },
  ];

  for (const ann of sampleAnnouncements) {
    await db.collection("announcements").updateOne(
      { title: ann.title },
      { $set: { ...ann, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  // 5. Seed Upcoming Campus Events
  console.log("Seeding Upcoming Events...");
  const now = new Date();
  const sampleEvents = [
    {
      title: "Freshman Induction & Welcome Address",
      description: "Grand orientation address by Vice-Chancellor & Deans at the Uni-Auditorium.",
      location: "Shanti Devi Mittal Auditorium",
      startsAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      endsAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 3 * 3600 * 1000),
      category: "orientation",
      sourceName: "Dean of Student Welfare",
      sourceUrl: "https://www.lpu.in",
      verificationStatus: "verified",
    },
    {
      title: "Guided 3D Campus Walking Tour",
      description: "Interactive tour covering central library, sports complex, robotics labs, and Uni-Mall.",
      location: "Main Gate 1 Fountain",
      startsAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      endsAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 3600 * 1000),
      category: "tour",
      sourceName: "Student Mentorship Council",
      sourceUrl: "https://www.lpu.in",
      verificationStatus: "verified",
    },
    {
      title: "Student Clubs & Sports Expo",
      description: "Discover 100+ student organizations, coding clubs, theatre societies, and athletic teams.",
      location: "Baldev Raj Mittal Unipolis",
      startsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // in 4 days
      endsAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 4 * 3600 * 1000),
      category: "campus-life",
      sourceName: "LPU Cultural Affairs",
      sourceUrl: "https://www.lpu.in",
      verificationStatus: "verified",
    },
  ];

  for (const ev of sampleEvents) {
    await db.collection("events").updateOne(
      { title: ev.title },
      { $set: { ...ev, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  // 6. Seed Default Admin & Demo Student Accounts
  console.log("Seeding Initial Users...");
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);
  const studentPasswordHash = await bcrypt.hash("Student@12345", 12);

  // Administrator Account
  await db.collection("users").updateOne(
    { email: "admin@lpu.in" },
    {
      $set: {
        name: "Campus Administrator",
        email: "admin@lpu.in",
        passwordHash: adminPasswordHash,
        role: "admin",
        status: "active",
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  // Demo Student Account (Matches Prasenjit from screenshot)
  const studentResult = await db.collection("users").updateOne(
    { email: "prasenjit@lpu.in" },
    {
      $set: {
        name: "Prasenjit",
        email: "prasenjit@lpu.in",
        passwordHash: studentPasswordHash,
        role: "student",
        status: "active",
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  const prasenjitUser = await db.collection("users").findOne({ email: "prasenjit@lpu.in" });
  if (prasenjitUser) {
    const studentId = String(prasenjitUser._id);
    // Student profile
    await db.collection("studentProfiles").updateOne(
      { userId: studentId },
      {
        $set: {
          school: "School of Computer Science & Engineering",
          programme: "B.Tech Computer Science & Engineering",
          year: "1st Year (Freshman)",
          accommodation: "hostel",
          interests: "Web Development, AI/ML, Cloud Computing, Hackathons",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
  }

  console.log("\n=======================================================");
  console.log("LPU Freshman Guide Database Seed Complete!");
  console.log("Sample Login Credentials for Testing:");
  console.log("-------------------------------------------------------");
  console.log("1. Student Account (Prasenjit):");
  console.log("   Email:    prasenjit@lpu.in");
  console.log("   Password: Student@12345");
  console.log("-------------------------------------------------------");
  console.log("2. Administrator Account:");
  console.log("   Email:    admin@lpu.in");
  console.log("   Password: Admin@12345");
  console.log("=======================================================\n");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
