const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const OCCASIONS = new Set(['birthday', 'anniversary', 'thank-you', 'just-because']);
const THEMES = new Set(['golden-reunion', 'eternal-romance', 'creator-wave']);
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

function token() {
  return crypto.randomBytes(32).toString('base64url');
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function cleanText(value, field, maxLength) {
  if (typeof value !== 'string') throw new Error(`${field} is required`);
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) throw new Error(`${field} is invalid`);
  return cleaned;
}

function validateGift(input) {
  if (!input || typeof input !== 'object') throw new Error('Gift input is required');
  const occasion = input.occasion;
  const themeId = input.themeId;
  if (!OCCASIONS.has(occasion)) throw new Error('occasion is invalid');
  if (!THEMES.has(themeId)) throw new Error('themeId is invalid');
  return {
    recipientName: cleanText(input.recipientName, 'recipientName', 80),
    senderName: cleanText(input.senderName, 'senderName', 80),
    message: typeof input.message === 'string' ? input.message.trim().slice(0, 500) : '',
    occasion,
    themeId,
  };
}

class GiftStore {
  constructor(filePath, ttlMs = DEFAULT_TTL_MS, retentionMs = DEFAULT_RETENTION_MS) {
    this.filePath = filePath;
    this.ttlMs = ttlMs;
    this.retentionMs = retentionMs;
    this.ensureDirectory();
  }

  ensureDirectory() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    if (!fs.existsSync(this.filePath)) this.write({ gifts: {} });
  }

  read() {
    try {
      const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      if (!parsed || typeof parsed !== 'object' || !parsed.gifts || typeof parsed.gifts !== 'object' || Array.isArray(parsed.gifts)) {
        throw new Error('Gift storage has an invalid shape.');
      }
      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') return { gifts: {} };
      if (error instanceof SyntaxError || error.message.startsWith('Gift storage has an invalid shape')) {
        const corruption = new Error('Gift storage is corrupted and must be restored before writes continue.');
        corruption.code = 'STORE_CORRUPT';
        throw corruption;
      }
      throw error;
    }
  }

  purgeExpired(now = Date.now()) {
    const data = this.read();
    let removed = 0;
    for (const [id, gift] of Object.entries(data.gifts)) {
      const expiry = Date.parse(gift.recipientTokenExpiresAt || gift.expiresAt);
      if (Number.isFinite(expiry) && now - expiry > this.retentionMs) {
        delete data.gifts[id];
        removed += 1;
      }
    }
    if (removed > 0) this.write(data);
    return removed;
  }

  openRecipient(recipientToken) {
    const data = this.read();
    const now = Date.now();
    const found = Object.values(data.gifts).find((gift) => this.authorizedRecipient(gift, recipientToken));
    if (!found) return null;
    if (Date.parse(found.recipientTokenExpiresAt) <= now) return { expired: true };
    if (!found.openedAt) {
      found.openedAt = new Date(now).toISOString();
      found.updatedAt = new Date(now).toISOString();
      this.write(data);
    }
    return { gift: this.recipientView(found) };
  }

  write(value) {
    const temporaryPath = `${this.filePath}.${process.pid}.tmp`;
    fs.writeFileSync(temporaryPath, JSON.stringify(value, null, 2), 'utf8');
    try {
      fs.renameSync(temporaryPath, this.filePath);
    } catch (error) {
      // Windows may reject replacing an open file in a sandbox; retain the safe temporary write.
      if (error.code !== 'EPERM' && error.code !== 'EEXIST') throw error;
      fs.copyFileSync(temporaryPath, this.filePath);
      fs.unlinkSync(temporaryPath);
    }
  }

  create(input) {
    const now = new Date();
    const creatorToken = token();
    const gift = {
      id: crypto.randomUUID(),
      ...validateGift(input),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + this.ttlMs).toISOString(),
      status: 'draft',
      creatorTokenHash: hash(creatorToken),
      recipientTokenHash: null,
      recipientTokenExpiresAt: null,
      openedAt: null,
      completion: null,
      progress: 0,
    };
    const data = this.read();
    data.gifts[gift.id] = gift;
    this.write(data);
    return { gift: this.creatorView(gift), creatorToken };
  }

  authorizeCreator(id, creatorToken) {
    const gift = this.read().gifts[id];
    return gift && this.authorized(gift, creatorToken) ? gift : null;
  }

  publish(id, creatorToken) {
    const data = this.read();
    const gift = data.gifts[id];
    if (!gift || !this.authorized(gift, creatorToken)) return null;
    const recipientToken = token();
    gift.recipientTokenHash = hash(recipientToken);
    gift.recipientTokenExpiresAt = new Date(Date.now() + this.ttlMs).toISOString();
    gift.status = 'published';
    gift.updatedAt = new Date().toISOString();
    this.write(data);
    return { gift: this.creatorView(gift), recipientToken, expiresAt: gift.recipientTokenExpiresAt };
  }

  authorized(gift, creatorToken) {
    if (!creatorToken || typeof creatorToken !== 'string') return false;
    const expected = Buffer.from(gift.creatorTokenHash, 'hex');
    const actual = Buffer.from(hash(creatorToken), 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  }

  resolveRecipient(recipientToken) {
    return this.openRecipient(recipientToken);
  }

  authorizedRecipient(gift, recipientToken) {
    if (!recipientToken || typeof recipientToken !== 'string') return false;
    const expected = Buffer.from(gift.recipientTokenHash, 'hex');
    const actual = Buffer.from(hash(recipientToken), 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  }

  recordEvent(recipientToken, event) {
    const data = this.read();
    const found = Object.values(data.gifts).find((gift) => this.authorizedRecipient(gift, recipientToken));
    if (!found) return null;
    if (Date.parse(found.recipientTokenExpiresAt) <= Date.now()) return { expired: true };
    if (!event || !['progress', 'completed'].includes(event.type)) throw new Error('event type is invalid');
    if (event.type === 'progress') {
      found.progress = Math.max(found.progress, Math.min(1, Number(event.progress) || 0));
    } else {
      if (found.completion) return { gift: this.recipientView(found) };
      found.progress = 1;
      found.status = 'completed';
      found.completion = { score: Math.max(0, Math.min(1000, Number(event.score) || 0)), completedAt: new Date().toISOString() };
    }
    found.updatedAt = new Date().toISOString();
    this.write(data);
    return { gift: this.recipientView(found) };
  }

  delete(id, creatorToken) {
    const data = this.read();
    const gift = data.gifts[id];
    if (!gift || !this.authorized(gift, creatorToken)) return false;
    delete data.gifts[id];
    this.write(data);
    return true;
  }

  creatorView(gift) {
    return { id: gift.id, recipientName: gift.recipientName, senderName: gift.senderName, message: gift.message, occasion: gift.occasion, themeId: gift.themeId, createdAt: gift.createdAt, expiresAt: gift.expiresAt, status: gift.status, progress: gift.progress, openedAt: gift.openedAt, completion: gift.completion };
  }

  recipientView(gift) {
    return { id: gift.id, recipientName: gift.recipientName, senderName: gift.senderName, message: gift.message, occasion: gift.occasion, themeId: gift.themeId, expiresAt: gift.recipientTokenExpiresAt, status: gift.status, progress: gift.progress, openedAt: gift.openedAt, completion: gift.completion };
  }
}

module.exports = { GiftStore, DEFAULT_TTL_MS, DEFAULT_RETENTION_MS, validateGift, hash };
