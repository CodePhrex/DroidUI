const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require(require.resolve('typescript', { paths: [process.cwd()] }));

const load = (relativePath, injected = {}) => {
  const source = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const loaded = { exports: {} };
  const localRequire = (id) => {
    if (id === '../types/schema') return {};
    if (Object.prototype.hasOwnProperty.call(injected, id)) return injected[id];
    return require(id);
  };
  new Function('exports', 'require', 'module', output)(loaded.exports, localRequire, loaded);
  return loaded.exports;
};

const exporter = load('src/compiler/androidProjectExporter.ts');
const generator = load('src/compiler/androidProjectBundle.ts', {
  './androidProjectExporter': exporter,
});
const outputDir = path.resolve(
  process.env.DROIDUI_ANDROID_OUTPUT_DIR || path.join(os.tmpdir(), 'droidui-generated-android-fixture'),
);
if (outputDir === path.parse(outputDir).root) {
  throw new Error('Refusing to write generated Android project to a filesystem root.');
}

const rootNode = {
  id: 'root',
  type: 'Container',
  style: { padding: 20, flexDirection: 'column', backgroundColor: '#FFFFFF' },
  children: [
    { id: 'title', type: 'Text', props: { text: 'DroidUI Build Verification' }, style: { fontSize: 22, color: '#111827' } },
    { id: 'description', type: 'Text', props: { text: 'Generated Compose project smoke fixture' }, style: { fontSize: 14 } },
    { id: 'toggle', type: 'Switch', props: { label: 'Enable sample setting', value: true }, style: {} },
    { id: 'slider', type: 'Slider', props: { label: 'Sample level', value: 40 }, style: {} },
    { id: 'checkbox', type: 'Checkbox', props: { label: 'Accept sample option', checked: false }, style: {} },
    { id: 'button', type: 'Button', props: { label: 'Continue' }, style: {} },
  ],
};
const config = {
  ...exporter.defaultConfig,
  appName: 'DroidUIBuildVerification',
  packageName: 'com.droidui.buildverification',
  targetSdk: 35,
  minSdk: 24,
  abiFilter: 'all',
};
const bundle = generator.generateAndroidProjectBundle(rootNode, config);
const errors = bundle.diagnostics.filter((item) => item.severity === 'error');
if (errors.length || bundle.files.length < 6) {
  throw new Error('Android fixture generation failed: ' + JSON.stringify(bundle.diagnostics));
}

fs.rmSync(outputDir, { recursive: true, force: true });
for (const file of bundle.files) {
  const destination = path.join(outputDir, file.path);
  if (!destination.startsWith(outputDir + path.sep)) {
    throw new Error('Generated file path escapes output directory: ' + file.path);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, file.content, 'utf8');
}
console.log('Generated Android project fixture at ' + outputDir);
console.log('Generated ' + bundle.files.length + ' project files.');
for (const diagnostic of bundle.diagnostics) {
  console.log('[' + diagnostic.severity.toUpperCase() + '] ' + diagnostic.code + ': ' + diagnostic.message);
}
console.log('A button action warning is expected because the editor schema does not yet bind actions.');
