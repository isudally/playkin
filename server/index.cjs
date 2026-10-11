const http = require('node:http');
const path = require('node:path');
const { GiftStore } = require('./store.cjs');

const port = Number(process.env.PLAYKIN_PORT || 8787);
const dataFile = process.env.PLAYKIN_DATA_FILE || path.join(process.cwd(), '.playkin-data', 'gifts.json');
const store = new GiftStore(dataFile);
const requestLog = new Map();

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  response.end(JSON.stringify(body));
}

function requestIp(request) {
  return request.headers['x-forwarded-for']?.split(',')[0]?.trim() || request.socket.remoteAddress || 'unknown';
}

function rateLimited(request) {
  const key = requestIp(request);
  const now = Date.now();
  const recent = (requestLog.get(key) || []).filter((stamp) => now - stamp < 60_000);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > 120;
}

function body(request) {
  return new Promise((resolve, reject) => {
    let value = '';
    request.on('data', (chunk) => {
      value += chunk;
      if (value.length > 32_000) reject(new Error('Request body is too large'));
    });
    request.on('end', () => {
      try { resolve(value ? JSON.parse(value) : {}); } catch { reject(new Error('Request body must be JSON')); }
    });
    request.on('error', reject);
  });
}

function creatorToken(request) {
  const header = request.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

function server() {
  return http.createServer(async (request, response) => {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS' });
      response.end();
      return;
    }
    if (rateLimited(request)) return json(response, 429, { error: 'Too many requests. Please try again shortly.' });
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
    const parts = url.pathname.split('/').filter(Boolean);
    try {
      if (request.method === 'GET' && url.pathname === '/api/health') return json(response, 200, { ok: true, service: 'playkin-gift-service' });
      if (request.method === 'POST' && url.pathname === '/api/gifts') {
        const result = store.create(await body(request));
        return json(response, 201, result);
      }
      if (parts[0] === 'api' && parts[1] === 'gifts' && parts[2] && parts[3] === 'publish' && request.method === 'POST') {
        const result = store.publish(parts[2], creatorToken(request));
        if (!result) return json(response, 403, { error: 'Creator authorization failed.' });
        return json(response, 200, result);
      }
      if (parts[0] === 'api' && parts[1] === 'gifts' && parts[2] && request.method === 'DELETE') {
        if (!store.delete(parts[2], creatorToken(request))) return json(response, 403, { error: 'Creator authorization failed.' });
        return json(response, 200, { deleted: true });
      }
      if (parts[0] === 'api' && parts[1] === 'recipient' && parts[2] && request.method === 'GET') {
        const result = store.resolveRecipient(parts[2]);
        if (!result) return json(response, 404, { error: 'Gift link not found.' });
        if (result.expired) return json(response, 410, { error: 'This gift link has expired.' });
        return json(response, 200, result);
      }
      if (parts[0] === 'api' && parts[1] === 'recipient' && parts[2] && parts[3] === 'events' && request.method === 'POST') {
        const result = store.recordEvent(parts[2], await body(request));
        if (!result) return json(response, 404, { error: 'Gift link not found.' });
        if (result.expired) return json(response, 410, { error: 'This gift link has expired.' });
        return json(response, 200, result);
      }
      if (request.method === 'POST' && url.pathname === '/api/ai/suggestions') return json(response, 503, { error: 'Server-side AI boundary is reserved and not configured.' });
      return json(response, 404, { error: 'Not found.' });
    } catch (error) {
      const status = /invalid|required|large|JSON/.test(error.message) ? 400 : 500;
      return json(response, status, { error: status === 400 ? error.message : 'Unexpected server error.' });
    }
  });
}

if (require.main === module) server().listen(port, '127.0.0.1', () => console.log(`Playkin gift service listening on http://127.0.0.1:${port}`));

module.exports = { server, store };
