import { MongoClient } from "mongodb";
import { sources } from "../src/data/sources.js";
const c = await new MongoClient(process.env.MONGODB_URI).connect();
const db = c.db();
for (const s of Object.values(sources)) {
  await db.collection("contentSources").updateOne({ sourceUrl: s.sourceUrl }, { $set: { ...s, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
}
console.log("Seeded content sources (all unverified). No locations seeded: add verified ones via /admin.");
await c.close();
