import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const g = globalThis;
export async function getDb() {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!g._mongo) g._mongo = new MongoClient(uri).connect();
  return (await g._mongo).db();
}
export async function safeFind(collection, filter = {}, limit = 100) {
  try {
    const db = await getDb();
    const docs = await db.collection(collection).find(filter).limit(limit).toArray();
    return docs.map((d) => ({ ...d, _id: String(d._id) }));
  } catch {
    return [];
  }
}
