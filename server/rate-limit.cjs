class RateLimiter {
  constructor({ limit = 120, windowMs = 60_000, maxKeys = 2_048 } = {}) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxKeys = maxKeys;
    this.buckets = new Map();
  }

  allow(key, now = Date.now()) {
    this.prune(now);
    let bucket = this.buckets.get(key);
    if (!bucket || now - bucket.startedAt >= this.windowMs) {
      if (!bucket && this.buckets.size >= this.maxKeys) this.buckets.delete(this.buckets.keys().next().value);
      bucket = { startedAt: now, count: 0 };
      this.buckets.set(key, bucket);
    }
    bucket.count += 1;
    return bucket.count <= this.limit;
  }

  prune(now = Date.now()) {
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.startedAt >= this.windowMs) this.buckets.delete(key);
    }
  }
}

module.exports = { RateLimiter };
