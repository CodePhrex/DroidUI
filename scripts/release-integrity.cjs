'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    throw new Error('Unable to read valid JSON from ' + relativePath + ': ' + error.message);
  }
}

const packageJson = readJson('app/package.json');
const appJson = readJson('app/app.json');
const lockJson = readJson('app/package-lock.json');
const version = packageJson.version;
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const versions = {
  'app/package.json': version,
  'app/app.json': appJson.expo && appJson.expo.version,
  'app/package-lock.json': lockJson.version,
  'app/package-lock.json packages[""]': lockJson.packages && lockJson.packages[''] && lockJson.packages[''].version
};
const errors = [];
if (typeof version !== 'string' || !semver.test(version)) {
  errors.push('app/package.json version is not valid SemVer: ' + String(version));
}
for (const [source, value] of Object.entries(versions)) {
  if (value !== version) errors.push(source + ' version ' + String(value) + ' does not match app/package.json version ' + String(version));
}
if (!appJson.expo || typeof appJson.expo !== 'object') errors.push('app/app.json is missing its expo configuration object');
if (!lockJson.packages || !lockJson.packages['']) errors.push('app/package-lock.json is missing its root package entry');

if (errors.length) {
  console.error('DroidUI release-integrity gate FAILED:');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}

const sha = process.env.GITHUB_SHA || 'local';
const manifest = {
  schemaVersion: 1,
  product: 'DroidUI',
  version: version,
  releaseTag: 'v' + version,
  immutableBuildTag: 'droidui-v' + version + '-' + sha.slice(0, 12),
  git: {
    sha: process.env.GITHUB_SHA || null,
    ref: process.env.GITHUB_REF || null,
    branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || null,
    runId: process.env.GITHUB_RUN_ID || null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT || null
  },
  verification: {
    versionConsistency: 'passed',
    generatedAt: new Date().toISOString()
  }
};

const outputArg = process.argv.indexOf('--write-manifest');
if (outputArg !== -1) {
  const outputPath = process.argv[outputArg + 1];
  if (!outputPath) {
    console.error('Usage: node scripts/release-integrity.cjs --write-manifest <output-path>');
    process.exit(2);
  }
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log('Release integrity passed for ' + version + '; manifest written to ' + outputPath);
} else {
  console.log(JSON.stringify(manifest, null, 2));
}
