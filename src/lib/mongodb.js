import fs from "fs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const g = globalThis;

// In-memory + file-backed JSON database engine for zero-config fallback
class LocalCollection {
  constructor(name, dbInstance) {
    this.name = name;
    this.db = dbInstance;
  }

  _getItems() {
    return this.db._data[this.name] || [];
  }

  _save() {
    this.db._persist();
  }

  _matchDoc(doc, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;

    for (const key of Object.keys(filter)) {
      if (key === "$or") {
        const orConditions = filter.$or;
        if (!Array.isArray(orConditions)) return false;
        const matched = orConditions.some((subCond) => this._matchDoc(doc, subCond));
        if (!matched) return false;
        continue;
      }

      if (key === "$and") {
        const andConditions = filter.$and;
        if (!Array.isArray(andConditions)) return false;
        const matched = andConditions.every((subCond) => this._matchDoc(doc, subCond));
        if (!matched) return false;
        continue;
      }

      const expected = filter[key];
      const actual = doc[key];

      // Handle _id comparisons (both ObjectId and String representations)
      if (key === "_id") {
        if (expected && typeof expected === "object" && "$in" in expected) {
          const expectedList = expected.$in.map((item) => String(item));
          if (!expectedList.includes(String(actual))) return false;
          continue;
        }
        if (expected != null && String(actual) !== String(expected)) {
          return false;
        }
        continue;
      }

      // Handle object operators ($gt, $gte, $lt, $lte, $in, $ne, $regex)
      if (expected && typeof expected === "object" && !(expected instanceof Date)) {
        if ("$gt" in expected) {
          const expTime = new Date(expected.$gt).getTime();
          const actTime = new Date(actual).getTime();
          if (isNaN(expTime) || isNaN(actTime) ? actual <= expected.$gt : actTime <= expTime) return false;
        }
        if ("$gte" in expected) {
          const expTime = new Date(expected.$gte).getTime();
          const actTime = new Date(actual).getTime();
          if (isNaN(expTime) || isNaN(actTime) ? actual < expected.$gte : actTime < expTime) return false;
        }
        if ("$lt" in expected) {
          const expTime = new Date(expected.$lt).getTime();
          const actTime = new Date(actual).getTime();
          if (isNaN(expTime) || isNaN(actTime) ? actual >= expected.$lt : actTime >= expTime) return false;
        }
        if ("$lte" in expected) {
          const expTime = new Date(expected.$lte).getTime();
          const actTime = new Date(actual).getTime();
          if (isNaN(expTime) || isNaN(actTime) ? actual > expected.$lte : actTime > expTime) return false;
        }
        if ("$in" in expected) {
          const list = Array.isArray(expected.$in) ? expected.$in : [];
          const strList = list.map((x) => String(x));
          if (!strList.includes(String(actual))) return false;
        }
        if ("$ne" in expected) {
          if (actual === expected.$ne || String(actual) === String(expected.$ne)) return false;
        }
        if ("$regex" in expected) {
          const flags = expected.$options || "";
          const reg = new RegExp(expected.$regex, flags);
          if (!reg.test(String(actual || ""))) return false;
        }
        continue;
      }

      // Direct value comparison
      if (expected instanceof Date) {
        if (new Date(actual).getTime() !== expected.getTime()) return false;
        continue;
      }

      if (actual !== expected) {
        // String check for IDs
        if (String(actual) !== String(expected)) return false;
      }
    }

    return true;
  }

  async findOne(filter = {}, options = {}) {
    const items = this._getItems();
    const found = items.find((doc) => this._matchDoc(doc, filter));
    if (!found) return null;
    return this._project(JSON.parse(JSON.stringify(found)), options.projection);
  }

  find(filter = {}, options = {}) {
    let items = this._getItems().filter((doc) => this._matchDoc(doc, filter));
    let sortField = null;
    let sortAsc = 1;
    let skipCount = 0;
    let limitCount = Infinity;
    const projection = options.projection;

    const cursor = {
      sort: (sortObj) => {
        if (sortObj && typeof sortObj === "object") {
          const key = Object.keys(sortObj)[0];
          if (key) {
            sortField = key;
            sortAsc = sortObj[key] >= 0 ? 1 : -1;
          }
        }
        return cursor;
      },
      skip: (n) => {
        skipCount = Number(n) || 0;
        return cursor;
      },
      limit: (n) => {
        limitCount = Number(n) || Infinity;
        return cursor;
      },
      project: (p) => {
        return cursor;
      },
      toArray: async () => {
        let results = [...items];
        if (sortField) {
          results.sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];
            if (valA == null && valB == null) return 0;
            if (valA == null) return sortAsc;
            if (valB == null) return -sortAsc;
            const timeA = new Date(valA).getTime();
            const timeB = new Date(valB).getTime();
            if (!isNaN(timeA) && !isNaN(timeB) && typeof valA !== "number" && typeof valB !== "number") {
              return (timeA - timeB) * sortAsc;
            }
            if (valA < valB) return -1 * sortAsc;
            if (valA > valB) return 1 * sortAsc;
            return 0;
          });
        }
        if (skipCount > 0) results = results.slice(skipCount);
        if (limitCount < Infinity) results = results.slice(0, limitCount);
        return results.map((d) => this._project(JSON.parse(JSON.stringify(d)), projection));
      },
    };

    return cursor;
  }

  _project(doc, projection) {
    if (!projection || typeof projection !== "object") return doc;
    const hasExclusion = Object.values(projection).some((v) => v === 0 || v === false);
    if (hasExclusion) {
      for (const [k, v] of Object.entries(projection)) {
        if (v === 0 || v === false) delete doc[k];
      }
      return doc;
    }
    const hasInclusion = Object.values(projection).some((v) => v === 1 || v === true);
    if (hasInclusion) {
      const projected = { _id: doc._id };
      for (const [k, v] of Object.entries(projection)) {
        if (v === 1 || v === true) projected[k] = doc[k];
      }
      return projected;
    }
    return doc;
  }

  async insertOne(doc) {
    if (!this.db._data[this.name]) {
      this.db._data[this.name] = [];
    }
    const toInsert = JSON.parse(JSON.stringify(doc));
    if (!toInsert._id) {
      toInsert._id = new ObjectId();
    }
    this.db._data[this.name].push(toInsert);
    this._save();
    return { insertedId: toInsert._id };
  }

  async insertMany(docs) {
    if (!this.db._data[this.name]) {
      this.db._data[this.name] = [];
    }
    const insertedIds = {};
    let idx = 0;
    for (const d of docs) {
      const toInsert = JSON.parse(JSON.stringify(d));
      if (!toInsert._id) toInsert._id = new ObjectId();
      this.db._data[this.name].push(toInsert);
      insertedIds[idx++] = toInsert._id;
    }
    this._save();
    return { insertedCount: docs.length, insertedIds };
  }

  async updateOne(filter, update, options = {}) {
    const items = this._getItems();
    const idx = items.findIndex((doc) => this._matchDoc(doc, filter));

    if (idx === -1) {
      if (options.upsert) {
        const newDoc = { _id: new ObjectId() };
        // Apply filter values
        for (const [k, v] of Object.entries(filter)) {
          if (!k.startsWith("$") && typeof v !== "object") newDoc[k] = v;
        }
        if (update.$setOnInsert) {
          Object.assign(newDoc, JSON.parse(JSON.stringify(update.$setOnInsert)));
        }
        if (update.$set) {
          Object.assign(newDoc, JSON.parse(JSON.stringify(update.$set)));
        }
        if (!this.db._data[this.name]) this.db._data[this.name] = [];
        this.db._data[this.name].push(newDoc);
        this._save();
        return { matchedCount: 0, modifiedCount: 1, upsertedId: newDoc._id };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    }

    const doc = items[idx];
    if (update.$set) {
      Object.assign(doc, JSON.parse(JSON.stringify(update.$set)));
    }
    if (update.$unset) {
      for (const k of Object.keys(update.$unset)) {
        delete doc[k];
      }
    }
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        doc[k] = (Number(doc[k]) || 0) + Number(v);
      }
    }
    this._save();
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async updateMany(filter, update, options = {}) {
    const items = this._getItems();
    let modifiedCount = 0;
    for (const doc of items) {
      if (this._matchDoc(doc, filter)) {
        if (update.$set) Object.assign(doc, JSON.parse(JSON.stringify(update.$set)));
        if (update.$unset) {
          for (const k of Object.keys(update.$unset)) delete doc[k];
        }
        modifiedCount++;
      }
    }
    if (modifiedCount > 0) this._save();
    return { matchedCount: modifiedCount, modifiedCount };
  }

  async deleteOne(filter) {
    const items = this._getItems();
    const idx = items.findIndex((doc) => this._matchDoc(doc, filter));
    if (idx !== -1) {
      items.splice(idx, 1);
      this._save();
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(filter) {
    const items = this._getItems();
    const initialLen = items.length;
    const remaining = items.filter((doc) => !this._matchDoc(doc, filter));
    this.db._data[this.name] = remaining;
    const deletedCount = initialLen - remaining.length;
    if (deletedCount > 0) this._save();
    return { deletedCount };
  }

  async countDocuments(filter = {}) {
    return this._getItems().filter((doc) => this._matchDoc(doc, filter)).length;
  }

  async createIndex() {
    return "index_ok";
  }

  aggregate(pipeline = []) {
    return {
      toArray: async () => {
        let items = this._getItems().map((d) => JSON.parse(JSON.stringify(d)));
        for (const stage of pipeline) {
          if (stage.$match) {
            items = items.filter((d) => this._matchDoc(d, stage.$match));
          }
          if (stage.$group) {
            const groupKeyField = stage.$group._id;
            const groups = new Map();
            for (const item of items) {
              let groupVal = null;
              if (typeof groupKeyField === "string" && groupKeyField.startsWith("$")) {
                groupVal = item[groupKeyField.slice(1)];
              }
              const keyStr = String(groupVal);
              if (!groups.has(keyStr)) {
                groups.set(keyStr, { _id: groupVal, items: [] });
              }
              groups.get(keyStr).items.push(item);
            }
            const groupedResults = [];
            for (const [, grp] of groups) {
              const res = { _id: grp._id };
              for (const [k, expr] of Object.entries(stage.$group)) {
                if (k === "_id") continue;
                if (expr && expr.$sum === 1) {
                  res[k] = grp.items.length;
                } else if (expr && typeof expr.$sum === "string" && expr.$sum.startsWith("$")) {
                  const sumField = expr.$sum.slice(1);
                  res[k] = grp.items.reduce((s, it) => s + (Number(it[sumField]) || 0), 0);
                }
              }
              groupedResults.push(res);
            }
            items = groupedResults;
          }
        }
        return items;
      },
    };
  }
}

class LocalDatabase {
  constructor() {
    this._dataDir = path.join(process.cwd(), ".data");
    this._filePath = path.join(this._dataDir, "db.json");
    this._data = {};
    this._load();
  }

  _load() {
    try {
      if (!fs.existsSync(this._dataDir)) {
        fs.mkdirSync(this._dataDir, { recursive: true });
      }
      if (fs.existsSync(this._filePath)) {
        const raw = fs.readFileSync(this._filePath, "utf-8");
        this._data = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("[LocalDatabase] Notice initializing storage:", e.message);
      this._data = {};
    }
  }

  _persist() {
    try {
      if (!fs.existsSync(this._dataDir)) {
        fs.mkdirSync(this._dataDir, { recursive: true });
      }
      fs.writeFileSync(this._filePath, JSON.stringify(this._data, null, 2), "utf-8");
    } catch (e) {
      console.error("[LocalDatabase] Error persisting data:", e.message);
    }
  }

  collection(name) {
    if (!this._data[name]) {
      this._data[name] = [];
    }
    return new LocalCollection(name, this);
  }
}

// Global cached database connection
export async function getDb() {
  if (g._db) return g._db;

  // Attempt real MongoDB connection if MONGODB_URI is provided
  if (uri && uri !== "mongodb://localhost:27017/lpufreshman") {
    try {
      if (!g._mongo) {
        g._mongo = new MongoClient(uri, { serverSelectionTimeoutMS: 2500 });
        await g._mongo.connect();
        console.log("[Database] Connected successfully to MongoDB Atlas/Instance.");
      }
      g._db = g._mongo.db();
      return g._db;
    } catch (err) {
      console.warn(`[Database] MongoDB connection failed (${err.message}). Falling back to local persistent store.`);
    }
  }

  // Graceful local persistent JSON fallback
  if (!g._localDb) {
    g._localDb = new LocalDatabase();
    console.log("[Database] Active: Local persistent file-backed database (.data/db.json).");
  }
  g._db = g._localDb;
  return g._db;
}

export async function safeFind(collection, filter = {}, limit = 100) {
  try {
    const db = await getDb();
    const docs = await db.collection(collection).find(filter).limit(limit).toArray();
    return docs.map((d) => ({ ...d, _id: String(d._id) }));
  } catch (err) {
    console.warn(`[safeFind] Fallback for ${collection}:`, err.message);
    return [];
  }
}
