const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const bundleDirectory = path.resolve(process.env.WEB_BUILD_DIRECTORY || 'web-build');
const contentTypes = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
};

function startApiServer() {
  const { server } = require('../server/index.cjs');
  const apiServer = server();
  return new Promise((resolve) => apiServer.listen(0, '127.0.0.1', () => resolve(apiServer)));
}

function proxyApi(request, response, apiPort) {
  const proxy = http.request({ hostname: '127.0.0.1', port: apiPort, path: request.url, method: request.method, headers: request.headers }, (apiResponse) => {
    response.writeHead(apiResponse.statusCode || 500, apiResponse.headers);
    apiResponse.pipe(response);
  });
  proxy.on('error', (error) => { response.writeHead(502); response.end(error.message); });
  request.pipe(proxy);
}

function startStaticServer(apiPort) {
  const server = http.createServer((request, response) => {
    if ((request.url || '').startsWith('/api/')) return proxyApi(request, response, apiPort);
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const relativePath = requestPath === '/' ? '/index.html' : requestPath;
    const candidate = path.resolve(bundleDirectory, `.${relativePath}`);
    const isInsideBundle = candidate === bundleDirectory || candidate.startsWith(`${bundleDirectory}${path.sep}`);
    const filePath = isInsideBundle && fs.existsSync(candidate) ? candidate : path.join(bundleDirectory, 'index.html');

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end('Not found');
        return;
      }
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
      });
      response.end(content);
    });
  });

  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function main() {
  if (!fs.existsSync(path.join(bundleDirectory, 'index.html'))) {
    throw new Error(`Web export is missing index.html: ${bundleDirectory}`);
  }

  process.env.PLAYKIN_DATA_FILE = path.join(bundleDirectory, '.test-gifts.json');
  const apiServer = await startApiServer();
  const apiAddress = apiServer.address();
  const server = await startStaticServer(apiAddress.port);
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  const failures = [];
  let expectingInvalidLink = false;

  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !expectingInvalidLink) failures.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(`response ${response.status()}: ${response.url()}`);
  });

  try {
    await page.goto(`${url}create`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#root > *', { timeout: 10000 });

    const expectText = async (text) => {
      await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible', timeout: 10000 });
    };
    const clickText = async (text) => {
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      await page.getByRole('button', { name: new RegExp(`^${escaped}`) }).first().click();
      await page.waitForTimeout(250);
    };

    // Direct nested route loading must be served by the SPA fallback.
    await expectText('Start with the person, not a template.');
    await clickText('Discover');
    await expectText('Make a little magic for someone you love.');
    await clickText('Create a gift');
    await expectText('Start with the person, not a template.');

    // Phase 1B creator -> server persistence -> secure link.
    await page.getByLabel('Who is this for?').fill('Ari');
    await page.getByLabel('Who is it from?').fill('Ismael');
    await page.getByLabel('A message to carry through').fill('A small world made just for you.');
    await clickText('Birthday');
    await clickText('Save gift');
    await expectText('The gift is safely stored.');
    await clickText('Generate secure link');
    await expectText('Your playable gift is ready.');
    const recipientUrl = await page.locator('.gift-link').getAttribute('href');
    if (!recipientUrl) throw new Error('Secure recipient link was not rendered.');
    await page.getByText('This creator session is recoverable after refresh in this browser tab.', { exact: false }).waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(300);
    await page.reload({ waitUntil: 'networkidle' });
    await expectText('Your playable gift is ready.');
    await page.getByText('This creator session is recoverable after refresh in this browser tab.', { exact: false }).waitFor({ state: 'visible', timeout: 10000 });

    // Open in a separate browser context to prove cross-browser delivery.
    const recipientContext = await browser.newContext();
    const recipientPage = await recipientContext.newPage();
    const recipientFailures = [];
    recipientPage.on('pageerror', (error) => recipientFailures.push(`recipient pageerror: ${error.message}`));
    recipientPage.on('console', (message) => { if (message.type() === 'error') recipientFailures.push(`recipient console: ${message.text()}`); });
    recipientPage.on('response', (response) => { if (response.status() >= 400) recipientFailures.push(`recipient response ${response.status()}: ${response.url()}`); });
    await recipientPage.setViewportSize({ width: 390, height: 844 });
    await recipientPage.goto(recipientUrl, { waitUntil: 'networkidle' });
    await recipientPage.getByText('A little world, made for Ari.', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
    await recipientPage.getByRole('button', { name: 'Begin the trail' }).click();
    await recipientPage.getByRole('button', { name: 'Birthday' }).click();
    await recipientPage.getByRole('button', { name: 'Carry the spark onward' }).click();
    await recipientPage.getByRole('button', { name: 'Ismael' }).click();
    await recipientPage.getByRole('button', { name: 'Carry the spark onward' }).click();
    await recipientPage.getByRole('button', { name: 'A little piece of this moment' }).click();
    await recipientPage.getByRole('button', { name: 'Reveal the message' }).click();
    await recipientPage.getByText('JOURNEY COMPLETE', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
    await recipientPage.reload({ waitUntil: 'networkidle' });
    await recipientPage.getByText('JOURNEY COMPLETE', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
    await recipientContext.close();
    if (recipientFailures.length > 0) throw new Error(`Recipient browser reported errors:\n${recipientFailures.join('\n')}`);

    await page.getByRole('button', { name: 'Refresh status' }).click();
    await page.getByText('Link opened', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
    await page.getByText('Trail started', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
    await page.getByText('Completed', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Delete gift' }).click();
    await page.getByRole('button', { name: 'Confirm delete' }).click();
    await expectText('The gift and its recipient link are deleted.');

    expectingInvalidLink = true;
    await page.goto(recipientUrl, { waitUntil: 'networkidle' });
    await page.getByText('This gift could not be opened.', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
    // The 404 is the expected product response for a deleted link, not a browser failure.
    for (let index = failures.length - 1; index >= 0; index -= 1) {
      if (failures[index].includes('/gift/') || failures[index].includes('/api/recipient/')) failures.splice(index, 1);
    }
    expectingInvalidLink = false;
    await clickText('Admin');
    await expectText('Operational boundary established');

    if (failures.length > 0) {
      throw new Error(`Browser boot reported errors:\n${failures.join('\n')}`);
    }
    console.log(`Phase 1C browser gift journey passed: ${url}`);
  } finally {
    await browser.close();
    server.close();
    apiServer.close();
    const testData = path.join(bundleDirectory, '.test-gifts.json');
    if (fs.existsSync(testData)) fs.unlinkSync(testData);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
