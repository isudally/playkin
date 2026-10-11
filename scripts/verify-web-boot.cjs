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

    const expectText = async (text) => {
      await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible', timeout: 10000 });
    };
    const clickText = async (text) => {
      await page.getByText(text, { exact: true }).first().click();
      await page.waitForTimeout(250);
    };

    // First-time onboarding: exercise the typed nested-tab destination.
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await expectText('Welcome to GameForge! 🎮');
    await clickText('Get Started');
    await expectText('What do you want to build? 🎯');
    await clickText('Full Games');
    await clickText('Continue');
    await expectText('Pick your style 🎨');
    await clickText('Pixel Perfect');
    await clickText('Continue');
    await expectText("What's your experience level? 💪");
    await clickText('Beginner');
    await clickText('Start Creating!');
    await expectText('Game Templates');

    // Returning-user bypass: persisted completion opens the main shell directly.
    await page.evaluate(() => window.localStorage.setItem('onboarding_completed', 'true'));
    await page.reload({ waitUntil: 'networkidle' });
    await expectText('Create a Gift');
    await clickText('Templates');
    await expectText('Game Templates');

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
