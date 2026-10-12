const fs = require('fs');
const path = require('path');

const bundleDirectory = path.resolve(process.argv[2] || 'web-build');
const forbiddenRuntimeImports = /react-native|react-navigation|\bexpo\b|\bbabylon(?:js)?\b|\bpixi(?:\.js)?\b|\baframe\b/i;
const maxJavaScriptBytes = 300_000;

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}

if (!fs.existsSync(bundleDirectory)) {
  throw new Error(`Web bundle directory does not exist: ${bundleDirectory}`);
}

const files = collectFiles(bundleDirectory);
const scripts = files.filter((filePath) => filePath.endsWith('.js'));
const javascriptBytes = scripts.reduce((total, filePath) => total + fs.statSync(filePath).size, 0);
const runtimeFindings = files.flatMap((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return forbiddenRuntimeImports.test(content) ? [path.relative(process.cwd(), filePath)] : [];
});

if (javascriptBytes > maxJavaScriptBytes) {
  throw new Error(`Initial web JavaScript bundle is ${javascriptBytes} bytes; budget is ${maxJavaScriptBytes} bytes.`);
}
if (runtimeFindings.length > 0) {
  throw new Error(`Independent web bundle contains legacy runtime references: ${runtimeFindings.join(', ')}`);
}

console.log(`Independent web bundle passed: ${javascriptBytes} JavaScript bytes across ${scripts.length} files (budget ${maxJavaScriptBytes}).`);
