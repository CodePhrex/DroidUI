const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require(path.join(__dirname, '..', 'app', 'node_modules', 'typescript'));

const sourcePath = path.join(__dirname, '..', 'app', 'src', 'store', 'editorState.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const sandboxModule = { exports: {} };
new Function('require', 'module', 'exports', compiled)(require, sandboxModule, sandboxModule.exports);
const api = sandboxModule.exports;

const makeTree = () => ({
  id: 'root',
  type: 'Container',
  style: {},
  children: [
    { id: 'one', type: 'Text', props: { text: 'One' }, style: {} },
    { id: 'two', type: 'Container', style: {}, children: [
      { id: 'three', type: 'Button', props: { label: 'Three' }, style: {} },
    ] },
  ],
});

let assertions = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertions += 1;
};

let root = makeTree();
check(api.findNodeById(root, 'three').type === 'Button', 'nested node lookup');
check(api.findParentById(root, 'three').id === 'two', 'parent lookup');
check(api.getSafeSelection(root, 'three') === 'three', 'valid selection preserved');
check(api.getSafeSelection(root, 'missing') === 'root', 'invalid selection falls back to root');

const updated = api.updateNode(root, 'one', (node) => ({ ...node, props: { ...node.props, text: 'Updated' } }));
check(updated.changed, 'update reports change');
check(api.findNodeById(updated.root, 'one').props.text === 'Updated', 'update changes only target');
check(api.findNodeById(root, 'one').props.text === 'One', 'update preserves original snapshot');

const inserted = api.insertChild(updated.root, 'two', { id: 'four', type: 'Text', props: { text: 'Four' }, style: {} });
check(inserted.changed, 'insert reports change');
check(api.findParentById(inserted.root, 'four').id === 'two', 'inserted child has expected parent');

const moved = api.moveChild(inserted.root, 'root', 0, 1);
check(moved.changed, 'move reports change');
check(moved.root.children[1].id === 'one', 'move changes child order');

const removed = api.removeNode(moved.root, 'one');
check(removed.changed, 'remove reports change');
check(removed.parentId === 'root', 'remove returns previous parent');
check(!api.nodeExists(removed.root, 'one'), 'removed node no longer exists');

const history = api.recordEdit({ history: [], future: [] }, root);
const changed = updated.root;
const undone = api.undoTree(history, changed);
check(undone.rootNode.id === 'root', 'undo restores prior tree');
check(undone.future.length === 1, 'undo creates redo entry');
const redone = api.redoTree(undone, undone.rootNode);
check(redone.rootNode.id === 'root', 'redo restores forward tree');
check(api.findNodeById(redone.rootNode, 'one').props.text === 'Updated', 'redo restores edited content');

const cloned = api.regenerateNodeIds(api.findNodeById(inserted.root, 'two'));
check(cloned.id !== 'two', 'clipboard clone gets a new root id');
check(cloned.children[0].id !== 'three', 'clipboard clone regenerates descendant ids');
check(api.findNodeById(inserted.root, 'three').id === 'three', 'clipboard clone does not mutate source');

console.log(`Phase 2D editor-state gate: ${assertions} assertions passed.`);
