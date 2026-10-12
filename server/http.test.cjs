const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

function loadServer() {
  const dataFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'playkin-http-')), 'gifts.json');
  process.env.PLAYKIN_DATA_FILE = dataFile;
  delete require.cache[require.resolve('./index.cjs')];
  const service = require('./index.cjs');
  const instance = service.server();
  return new Promise((resolve) => instance.listen(0, '127.0.0.1', () => resolve({ instance, port: instance.address().port, dataFile })));
}

function request(port, options, body = '') {
  return new Promise((resolve, reject) => {
    const request = http.request({ hostname: '127.0.0.1', port, ...options }, (response) => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    });
    request.on('error', reject);
    request.end(body);
  });
}

test('rate limiting ignores spoofed forwarded IPs', { concurrency: false }, async () => {
  const service = await loadServer();
  try {
    const statuses = [];
    for (let index = 0; index < 121; index += 1) {
      statuses.push(await request(service.port, { method: 'GET', path: '/api/health', headers: { 'X-Forwarded-For': `198.51.100.${index}` } }));
    }
    assert.equal(statuses.filter((status) => status === 200).length, 120);
    assert.equal(statuses.at(-1), 429);
  } finally {
    service.instance.close();
    fs.rmSync(path.dirname(service.dataFile), { recursive: true, force: true });
  }
});

test('oversized request bodies are rejected before JSON parsing', { concurrency: false }, async () => {
  const service = await loadServer();
  try {
    const body = 'x'.repeat(32_001);
    const status = await request(service.port, { method: 'POST', path: '/api/gifts', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, body);
    assert.equal(status, 413);
  } finally {
    service.instance.close();
    fs.rmSync(path.dirname(service.dataFile), { recursive: true, force: true });
  }
});
