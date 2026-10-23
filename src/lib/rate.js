const hits = new Map();

export function rateLimit(key, max = 10, windowMs = 60_000) {
  const now = Date.now();
  
  // Periodic cleanup of stale keys if Map grows
  if (hits.size > 2000) {
    for (const [k, timestamps] of hits.entries()) {
      const active = timestamps.filter((t) => now - t < windowMs);
      if (active.length === 0) hits.delete(k);
      else hits.set(k, active);
    }
  }

  const fresh = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (fresh.length >= max) {
    return false;
  }
  fresh.push(now);
  hits.set(key, fresh);
  return true;
}
