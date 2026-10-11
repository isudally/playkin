const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const baselinePath = path.resolve('quality-baseline.json');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const tscPath = path.resolve('node_modules/typescript/bin/tsc');
const result = spawnSync(process.execPath, [tscPath, '--noEmit'], {
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});
if (result.error) {
  console.error(`TypeScript process failed to start: ${result.error.message}`);
  process.exit(1);
}
const output = `${result.stdout || ''}${result.stderr || ''}`;
const errors = (output.match(/\berror TS\d+\b/g) || []).length;

console.log(output.trim());
console.log(`TypeScript diagnostics: ${errors} (baseline: ${baseline.typescriptErrors})`);

if (errors > baseline.typescriptErrors) {
  console.error('TypeScript debt increased above the tracked legacy baseline.');
  process.exit(1);
}

if (result.status !== 0 && errors === 0) {
  console.error(`TypeScript exited with status ${result.status} without parseable diagnostics.`);
  process.exit(1);
}

if (errors > 0) {
  console.warn('TypeScript check passed with tracked legacy debt. See quality-baseline.json.');
} else {
  console.log('TypeScript check passed with no diagnostics.');
}
