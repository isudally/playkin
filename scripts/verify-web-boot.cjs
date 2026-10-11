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
  const failures = [];

  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('#root > *', { timeout: 10000 });
    if (failures.length > 0) {
      throw new Error(`Browser boot reported errors:\n${failures.join('\n')}`);
    }
    console.log(`Browser boot passed: ${url}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
