const fs = require('fs');
const path = require('path');

const bundleDirectory = path.resolve(process.argv[2] || 'web-build');
const forbiddenPatterns = [
  /\b(?:EXPO_PUBLIC_)?(?:OPENAI|GROK)_API_KEY\b/i,
  /\bEXPO_PUBLIC_PAYTABS_SERVER_KEY\b/i,
  /api\.openai\.com/i,
  /api\.x\.ai/i,
  /\bsk-[A-Za-z0-9]{12,}\b/,
];

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}

if (!fs.existsSync(bundleDirectory)) {
  console.error(`Client bundle directory does not exist: ${bundleDirectory}`);
  process.exit(1);
}

const findings = [];
for (const filePath of collectFiles(bundleDirectory)) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      findings.push(`${path.relative(process.cwd(), filePath)} matches ${pattern}`);
    }
  }
}

if (findings.length > 0) {
  console.error('Client bundle secret scan failed:');
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log(`Client bundle secret scan passed: ${bundleDirectory}`);
