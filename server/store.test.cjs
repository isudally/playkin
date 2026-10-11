const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { GiftStore } = require('./store.cjs');

test('persists a gift, protects creator data, and records idempotent completion', () => {
  const directory = fs.mkdtempSync(path.join(process.cwd(), '.test-playkin-gift-'));
  const store = new GiftStore(path.join(directory, 'gifts.json'));
  const created = store.create({ recipientName: 'Ari', senderName: 'Ismael', message: 'A small world made for you.', occasion: 'birthday', themeId: 'golden-reunion' });
  const published = store.publish(created.gift.id, created.creatorToken);
  assert.ok(published);
  assert.equal(store.resolveRecipient(published.recipientToken).gift.senderName, 'Ismael');
  assert.equal(store.resolveRecipient(published.recipientToken).gift.creatorToken, undefined);
  const completed = store.recordEvent(published.recipientToken, { type: 'completed', score: 275 });
  assert.equal(completed.gift.status, 'completed');
  assert.equal(store.recordEvent(published.recipientToken, { type: 'completed', score: 275 }).gift.completion.score, 275);
  assert.equal(store.delete(created.gift.id, 'wrong-token'), false);
  fs.rmSync(directory, { recursive: true, force: true });
});

test('rejects expired recipient links', () => {
  const directory = fs.mkdtempSync(path.join(process.cwd(), '.test-playkin-expiry-'));
  const store = new GiftStore(path.join(directory, 'gifts.json'), 1);
  const created = store.create({ recipientName: 'Ari', senderName: 'Ismael', message: '', occasion: 'birthday', themeId: 'golden-reunion' });
  const published = store.publish(created.gift.id, created.creatorToken);
  assert.ok(published);
  return new Promise((resolve) => setTimeout(() => {
    assert.deepEqual(store.resolveRecipient(published.recipientToken), { expired: true });
    fs.rmSync(directory, { recursive: true, force: true });
    resolve();
  }, 5));
});
