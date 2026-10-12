const assert = require('node:assert/strict');
const test = require('node:test');
const { RateLimiter } = require('./rate-limit.cjs');

test('bounds rate-limit memory and rejects requests beyond the window quota', () => {
  const limiter = new RateLimiter({ limit: 2, windowMs: 100, maxKeys: 2 });
  assert.equal(limiter.allow('one', 0), true);
  assert.equal(limiter.allow('one', 1), true);
  assert.equal(limiter.allow('one', 2), false);
  limiter.allow('two', 3);
  limiter.allow('three', 4);
  assert.ok(limiter.buckets.size <= 2);
  assert.equal(limiter.allow('one', 101), true);
});
