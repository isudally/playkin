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

function startStaticServer() {
  const server = http.createServer((request, response) => {
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

  const server = await startStaticServer();
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  const failures = [];

  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('#root > *', { timeout: 10000 });

    const expectText = async (text) => {
      await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible', timeout: 10000 });
    };
    const clickText = async (text) => {
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      await page.getByRole('button', { name: new RegExp(`^${escaped}`) }).first().click();
      await page.waitForTimeout(250);
    };

    // Phase 1A creator-to-recipient navigation on a mobile viewport.
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await expectText('Make a little magic for someone you love.');
    await clickText('Create a gift');
    await expectText('Start with the person, not a template.');
    await page.getByLabel('Who is this for?').fill('Ari');
    await page.getByLabel('Who is it from?').fill('Ismael');
    await page.getByLabel('A message to carry through').fill('A small world made just for you.');
    await clickText('Birthday');
    await clickText('Save local draft');
    await expectText('Your development preview is ready.');
    await clickText('Preview recipient view');
    await expectText('A little world, made for Ari.');
    await expectText('Development preview · not published · no secure recipient token issued.');
    await clickText('Back to discovery');
    await expectText('Make a little magic for someone you love.');
    await clickText('Admin');
    await expectText('Not available in Phase 1A');

    if (failures.length > 0) {
      throw new Error(`Browser boot reported errors:\n${failures.join('\n')}`);
    }
    console.log(`Browser boot and onboarding navigation passed: ${url}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
