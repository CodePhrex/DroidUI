const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require(require.resolve('typescript', { paths: [process.cwd()] }));

const sourcePath = path.join(process.cwd(), 'src/storage/projectValidation.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const module = { exports: {} };
new Function('exports', 'require', 'module', compiled)(module.exports, require, module);
const {
  validateComponentTree,
  validateSplashConfig,
  validateI18nDictionary,
} = module.exports;

const validTree = {
  id: 'root', type: 'Container', style: {},
  children: [{ id: 'title', type: 'Text', style: {}, props: { text: 'Hello' } }],
};
assert.deepEqual(validateComponentTree(validTree), { valid: true, nodeCount: 2 });
assert.match(validateComponentTree({
  ...validTree,
  children: [{ id: 'root', type: 'Text', style: {} }],
}).error, /Duplicate component ID/);
assert.match(validateComponentTree({
  id: 'root', type: 'MadeUp', style: {},
}).error, /Unsupported component type/);
assert.match(validateComponentTree({
  id: 'root', type: 'Container', style: {}, children: {},
}).error, /children must be an array/);
assert.match(validateComponentTree({
  id: 'root', type: 'Container', style: {},
  children: [{ id: 'child', type: 'Text' }],
}).error, /style object/);

const splash = {
  enabled: true, title: 'DroidUI', subtitle: 'Studio', logoIcon: 'D',
  backgroundColor: '#000000', titleColor: '#ffffff',
  durationMs: 2000, showSpinner: true, animationType: 'fade',
};
assert.equal(validateSplashConfig(splash), true);
assert.equal(validateSplashConfig({ ...splash, durationMs: -1 }), false);
assert.equal(validateSplashConfig({ ...splash, backgroundColor: 'red' }), false);
assert.equal(validateI18nDictionary({ greeting: { en: 'Hello', es: 'Hola' } }), true);
assert.equal(validateI18nDictionary({ greeting: { xx: 'Hello' } }), false);
assert.equal(validateI18nDictionary({ greeting: 'Hello' }), false);

console.log('Project validation tests: 10 assertions passed.');
