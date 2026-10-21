const hits = new Map();
export function rateLimit(key, max = 10, windowMs = 60_000) {
  const now = Date.now();
  const fresh = (hits.get(key) || []).filter((t) => now - t < windowMs);
  fresh.push(now);
  hits.set(key, fresh);
  return fresh.length <= max;
}
