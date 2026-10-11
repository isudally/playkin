const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const OCCASIONS = new Set(['birthday', 'anniversary', 'thank-you', 'just-because']);
const THEMES = new Set(['golden-reunion', 'eternal-romance', 'creator-wave']);
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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
  constructor(filePath, ttlMs = DEFAULT_TTL_MS) {
    this.filePath = filePath;
    this.ttlMs = ttlMs;
    this.ensureDirectory();
  }

  ensureDirectory() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    if (!fs.existsSync(this.filePath)) this.write({ gifts: {} });
  }

  read() {
    try {
      const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      return parsed && parsed.gifts ? parsed : { gifts: {} };
    } catch {
      return { gifts: {} };
    }
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
    if (!gift || !creatorToken || !crypto.timingSafeEqual(Buffer.from(gift.creatorTokenHash), Buffer.from(hash(creatorToken)))) return null;
    return gift;
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
    const data = this.read();
    const now = Date.now();
    for (const gift of Object.values(data.gifts)) {
      if (!gift.recipientTokenHash || !this.authorizedRecipient(gift, recipientToken)) continue;
      if (Date.parse(gift.recipientTokenExpiresAt) <= now) return { expired: true };
      return { gift: this.recipientView(gift) };
    }
    return null;
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
    return { id: gift.id, recipientName: gift.recipientName, senderName: gift.senderName, message: gift.message, occasion: gift.occasion, themeId: gift.themeId, createdAt: gift.createdAt, expiresAt: gift.expiresAt, status: gift.status, completion: gift.completion };
  }

  recipientView(gift) {
    return { id: gift.id, recipientName: gift.recipientName, senderName: gift.senderName, message: gift.message, occasion: gift.occasion, themeId: gift.themeId, expiresAt: gift.recipientTokenExpiresAt, status: gift.status, progress: gift.progress, completion: gift.completion };
  }
}

module.exports = { GiftStore, DEFAULT_TTL_MS, validateGift, hash };
