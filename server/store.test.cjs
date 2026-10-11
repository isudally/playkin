const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { GiftStore } = require('./store.cjs');

test('persists a gift, records its first open, and makes completion first-write-wins', async () => {
  const directory = fs.mkdtempSync(path.join(process.cwd(), '.test-playkin-gift-'));
  const store = new GiftStore(path.join(directory, 'gifts.json'));
  const created = store.create({ recipientName: 'Ari', senderName: 'Ismael', message: 'A small world made for you.', occasion: 'birthday', themeId: 'golden-reunion' });
  const published = store.publish(created.gift.id, created.creatorToken);
  assert.ok(published);
  const opened = store.resolveRecipient(published.recipientToken);
  assert.equal(opened.gift.senderName, 'Ismael');
  assert.ok(opened.gift.openedAt);
  assert.equal(opened.gift.creatorToken, undefined);
  assert.ok(store.creatorView(store.authorizeCreator(created.gift.id, created.creatorToken)).openedAt);
  const completed = store.recordEvent(published.recipientToken, { type: 'completed', score: 275 });
  assert.equal(completed.gift.status, 'completed');
  const completedAt = completed.gift.completion.completedAt;
  await new Promise((resolve) => setTimeout(resolve, 5));
  const repeated = store.recordEvent(published.recipientToken, { type: 'completed', score: 999 });
  assert.equal(repeated.gift.completion.score, 275);
  assert.equal(repeated.gift.completion.completedAt, completedAt);
  assert.equal(store.delete(created.gift.id, 'wrong-token'), false);
  assert.equal(store.delete(created.gift.id, created.creatorToken), true);
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

test('purges records after the defined retention window and fails closed on corruption', () => {
  const directory = fs.mkdtempSync(path.join(process.cwd(), '.test-playkin-retention-'));
  const filePath = path.join(directory, 'gifts.json');
  const store = new GiftStore(filePath, 1, 0);
  const created = store.create({ recipientName: 'Ari', senderName: 'Ismael', message: '', occasion: 'birthday', themeId: 'golden-reunion' });
  store.publish(created.gift.id, created.creatorToken);
  assert.equal(store.purgeExpired(Date.now() + 10_000), 1);
  fs.writeFileSync(filePath, '{not-json', 'utf8');
  assert.throws(() => store.create({ recipientName: 'Ari', senderName: 'Ismael', message: '', occasion: 'birthday', themeId: 'golden-reunion' }), (error) => error.code === 'STORE_CORRUPT');
  fs.rmSync(directory, { recursive: true, force: true });
});
