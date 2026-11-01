const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require(require.resolve('typescript', { paths: [process.cwd()] }));

const loadTsModule = (relativePath) => {
  const sourcePath = path.join(process.cwd(), relativePath);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (id) => {
    if (id === '../types/schema') return {};
    return require(id);
  };
  new Function('exports', 'require', 'module', compiled)(loadedModule.exports, localRequire, loadedModule);
  return loadedModule.exports;
};

const validation = loadTsModule('src/storage/projectValidation.ts');
const { validateComponentTree, validateSplashConfig, validateI18nDictionary } = validation;

const validTree = {
  id: 'root', type: 'Container', style: {},
  children: [{ id: 'title', type: 'Text', style: {}, props: { text: 'Hello' } }],
};
assert.deepEqual(validateComponentTree(validTree), { valid: true, nodeCount: 2 });
assert.match(validateComponentTree({
  ...validTree,
  children: [{ id: 'root', type: 'Text', style: {} }],
}).error, /Duplicate component ID/);
assert.match(validateComponentTree({ id: 'root', type: 'MadeUp', style: {} }).error, /Unsupported component type/);
assert.match(validateComponentTree({ id: 'root', type: 'Container', style: {}, children: {} }).error, /children must be an array/);
assert.match(validateComponentTree({ id: 'root', type: 'Container', style: {}, children: [{ id: 'child', type: 'Text' }] }).error, /style object/);

const splash = {
  enabled: true, title: 'DroidUI', subtitle: 'Studio', logoIcon: 'D',
  backgroundColor: '#000000', titleColor: '#ffffff', durationMs: 2000,
  showSpinner: true, animationType: 'fade',
};
assert.equal(validateSplashConfig(splash), true);
assert.equal(validateSplashConfig({ ...splash, durationMs: -1 }), false);
assert.equal(validateSplashConfig({ ...splash, backgroundColor: 'red' }), false);
assert.equal(validateI18nDictionary({ greeting: { en: 'Hello', es: 'Hola' } }), true);
assert.equal(validateI18nDictionary({ greeting: { xx: 'Hello' } }), false);
assert.equal(validateI18nDictionary({ greeting: 'Hello' }), false);

const assets = loadTsModule('src/storage/assetManagement.ts');
const { buildAssetManifestFromTree, getAssetUsageCounts, getMissingAssetIds, removeAssetReferences, updateAssetReferences } = assets;
const imageData = 'data:image/jpeg;base64,ZmFrZQ==';
const assetTree = {
  id: 'root', type: 'Container', style: {}, children: [
    { id: 'image1', type: 'Image', style: {}, props: { assetId: 'asset_one', assetName: 'Hero', mimeType: 'image/jpeg', imageUri: imageData, assetWidth: 100, assetHeight: 80 } },
    { id: 'image2', type: 'Image', style: {}, props: { assetId: 'asset_one', assetName: 'Hero', mimeType: 'image/jpeg', imageUri: imageData } },
  ],
};
const manifest = buildAssetManifestFromTree(assetTree);
assert.equal(manifest.length, 1);
assert.equal(manifest[0].id, 'asset_one');
assert.equal(getAssetUsageCounts(assetTree).asset_one, 2);
assert.deepEqual(getMissingAssetIds(assetTree, []), ['asset_one']);
assert.equal(getMissingAssetIds(assetTree, manifest).length, 0);
const renamed = updateAssetReferences(assetTree, 'asset_one', { assetName: 'Renamed Hero' });
assert.equal(renamed.children[0].props.assetName, 'Renamed Hero');
assert.equal(renamed.children[1].props.assetName, 'Renamed Hero');
const removed = removeAssetReferences(assetTree, 'asset_one');
assert.equal(removed.children[0].props.assetId, undefined);
assert.equal(removed.children[0].props.imageUri, undefined);

// Phase 2C SVG import/normalization gates.
const svg = loadTsModule('src/storage/svgAsset.ts');
const { validateAndNormalizeSvg, normalizeSvgXml, svgToDataUri, exportSvgAsset } = svg;
const validSvg = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#38bdf8" d="M0 0h24v24H0z"/></svg>';
const normalized = validateAndNormalizeSvg(validSvg);
assert.equal(normalized.valid, true);
assert.match(normalized.svgXml, /^<svg\b/);
assert.equal(normalized.metadata.viewBox, '0 0 24 24');
assert.equal(validateAndNormalizeSvg('<div>not svg</div>').valid, false);
assert.equal(validateAndNormalizeSvg('<svg><script>alert(1)</script></svg>').valid, false);
assert.equal(validateAndNormalizeSvg('<svg><a href="javascript:alert(1)"><path/></a></svg>').valid, false);
assert.match(normalizeSvgXml('```svg\n' + validSvg + '\n```'), /^<svg\b/);
assert.match(svgToDataUri(validSvg), /^data:image\/svg\+xml;utf8,/);
assert.equal(exportSvgAsset(validSvg, 'My Hero Icon').filename, 'my_hero_icon.svg');

console.log('Project validation + Phase 2B/2C asset tests: 26 assertions passed.');
