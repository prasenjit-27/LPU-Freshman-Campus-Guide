import { getDb } from "../src/lib/mongodb.js";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/make-admin.mjs you@example.com");
  process.exit(1);
}

async function makeAdmin() {
  const db = await getDb();
  const r = await db.collection("users").updateOne(
    { email: email.toLowerCase().trim() },
    { $set: { role: "admin", updatedAt: new Date() } }
  );

  if (r.matchedCount) {
    console.log(`Success: User ${email} has been promoted to administrator.`);
  } else {
    console.error(`User not found: ${email}. Please ensure they have registered an account first.`);
    process.exit(1);
  }
}

makeAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to promote user:", err);
    process.exit(1);
  });
