const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require(require.resolve('typescript', { paths: [process.cwd()] }));

const load = (relativePath) => {
  const source = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const loaded = { exports: {} };
  const localRequire = (id) => id === '../types/schema' ? {} : require(id);
  new Function('exports', 'require', 'module', output)(loaded.exports, localRequire, loaded);
  return loaded.exports;
};

const exporter = load('src/compiler/androidProjectExporter.ts');
const { defaultConfig } = exporter;
const source = fs.readFileSync(path.join(process.cwd(), 'src/compiler/androidProjectBundle.ts'), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const loaded = { exports: {} };
const localRequire = (id) => id === '../types/schema' ? {} : id === './androidProjectExporter' ? exporter : require(id);
new Function('exports', 'require', 'module', output)(loaded.exports, localRequire, loaded);
const { generateAndroidProjectBundle, serializeAndroidProjectBundle, validateAndroidExportConfig } = loaded.exports;
const tree = {
  id: 'root', type: 'Container', style: { padding: 16, flexDirection: 'column' },
  children: [
    { id: 'heading', type: 'Text', props: { text: 'Hello DroidUI' }, style: { fontSize: 22, color: '#ffffff' } },
    { id: 'toggle', type: 'Switch', props: { label: 'Enable', value: true }, style: {} },
    { id: 'slider', type: 'Slider', props: { label: 'Volume', value: 40 }, style: {} },
    { id: 'agree', type: 'Checkbox', props: { label: 'Agree', checked: false }, style: {} },
    { id: 'submit', type: 'Button', props: { label: 'Continue', action: { type: 'change_label', successLabel: 'Continued!' } }, style: {} },
  ],
};
let count = 0;
const check = (condition, message) => { assert.ok(condition, message); count += 1; };

const bundle = generateAndroidProjectBundle(tree, defaultConfig);
check(bundle.files.length >= 6, 'generates a multi-file Android project');
check(bundle.files.some((file) => file.path === 'app/src/main/AndroidManifest.xml'), 'manifest is generated');
check(bundle.files.some((file) => file.path.endsWith('/MainActivity.kt')), 'Kotlin activity is generated');
const main = bundle.files.find((file) => file.path.endsWith('/MainActivity.kt')).content;
check(main.includes('Hello DroidUI'), 'text component content is generated');
check(main.includes('mutableStateOf(true)'), 'switch state is generated');
check(main.includes('mutableFloatStateOf(0.4f)'), 'slider state is generated');
check(main.includes('mutableStateOf(false)'), 'checkbox state is generated');
check(main.includes('(sliderValue * 100).toInt()'), 'slider displays normalized value as percentage');
check(main.includes('submitClicked = true'), 'button click updates generated Compose state');
check(main.includes('Continued!'), 'button action produces visible feedback');
check(serializeAndroidProjectBundle(bundle).includes('droidui-android-project'), 'bundle serialization includes format marker');

const badPackage = { ...defaultConfig, packageName: 'not a package' };
check(validateAndroidExportConfig(badPackage).some((item) => item.code === 'INVALID_PACKAGE_NAME'), 'invalid package names are rejected');
const unsupportedFramework = { ...defaultConfig, framework: 'flutter_widget' };
check(generateAndroidProjectBundle(tree, unsupportedFramework).files.length === 0, 'unsupported frameworks cannot emit a false project');
const unsupportedNode = { ...tree, children: [...tree.children, { id: 'chart', type: 'Graph', style: {}, props: {} }] };
const rejected = generateAndroidProjectBundle(unsupportedNode, defaultConfig);
check(rejected.files.length === 0, 'unsupported components block incomplete project generation');
check(rejected.diagnostics.some((item) => item.code === 'UNSUPPORTED_COMPONENT'), 'unsupported component is identified');
check(generateAndroidProjectBundle(tree, { ...defaultConfig, targetSdk: 33, minSdk: 35 }).diagnostics.some((item) => item.code === 'SDK_RANGE_INVALID'), 'invalid SDK range is rejected');

console.log(`Phase 2E Android project generation gate: ${count} assertions passed.`);
