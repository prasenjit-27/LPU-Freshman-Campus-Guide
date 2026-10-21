import { MongoClient } from "mongodb";
const email = process.argv[2];
if (!email) { console.error("Usage: npm run make-admin -- you@example.com"); process.exit(1); }
const c = await new MongoClient(process.env.MONGODB_URI).connect();
const r = await c.db().collection("users").updateOne({ email: email.toLowerCase() }, { $set: { role: "admin" } });
console.log(r.matchedCount ? "Promoted." : "User not found (sign up first).");
await c.close();
