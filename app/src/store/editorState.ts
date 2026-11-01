import { ComponentNode } from '../types/schema';

export const EDITOR_HISTORY_LIMIT = 100;

export interface EditorTreeSnapshot {
  rootNode: ComponentNode;
  selectedNodeId: string | null;
}

export interface EditorClipboardEntry {
  node: ComponentNode;
  sourceNodeId: string;
}

export interface EditorHistoryState {
  history: ComponentNode[];
  future: ComponentNode[];
}

export const cloneNode = <T extends ComponentNode>(node: T): T =>
  JSON.parse(JSON.stringify(node)) as T;

export const findNodeById = (root: ComponentNode, id: string | null): ComponentNode | null => {
  if (!id) return null;
  if (root.id === id) return root;
  for (const child of root.children || []) {
    const match = findNodeById(child, id);
    if (match) return match;
  }
  return null;
};

export const findParentById = (root: ComponentNode, id: string): ComponentNode | null => {
  for (const child of root.children || []) {
    if (child.id === id) return root;
    const match = findParentById(child, id);
    if (match) return match;
  }
  return null;
};

export const nodeExists = (root: ComponentNode, id: string | null): boolean =>
  id === null ? false : findNodeById(root, id) !== null;

export const getSafeSelection = (
  root: ComponentNode,
  requestedId: string | null,
  fallbackToRoot = true,
): string | null => {
  if (requestedId && nodeExists(root, requestedId)) return requestedId;
  return fallbackToRoot ? root.id : null;
};

export const pushHistory = (
  history: ComponentNode[],
  snapshot: ComponentNode,
  limit = EDITOR_HISTORY_LIMIT,
): ComponentNode[] => {
  const next = [...history, cloneNode(snapshot)];
  return next.length > limit ? next.slice(next.length - limit) : next;
};

export const recordEdit = (
  state: EditorHistoryState,
  currentRoot: ComponentNode,
): EditorHistoryState => ({
  history: pushHistory(state.history, currentRoot),
  future: [],
});

export const undoTree = (
  state: EditorHistoryState,
  currentRoot: ComponentNode,
): { history: ComponentNode[]; future: ComponentNode[]; rootNode: ComponentNode | null } => {
  if (state.history.length === 0) {
    return { ...state, rootNode: null };
  }
  const previous = cloneNode(state.history[state.history.length - 1]);
  return {
    history: state.history.slice(0, -1),
    future: [cloneNode(currentRoot), ...state.future.map(cloneNode)],
    rootNode: previous,
  };
};

export const redoTree = (
  state: EditorHistoryState,
  currentRoot: ComponentNode,
): { history: ComponentNode[]; future: ComponentNode[]; rootNode: ComponentNode | null } => {
  if (state.future.length === 0) {
    return { ...state, rootNode: null };
  }
  const next = cloneNode(state.future[0]);
  return {
    history: pushHistory(state.history, currentRoot),
    future: state.future.slice(1).map(cloneNode),
    rootNode: next,
  };
};

export const updateNode = (
  root: ComponentNode,
  id: string,
  updater: (node: ComponentNode) => ComponentNode,
): { root: ComponentNode; changed: boolean } => {
  let changed = false;
  const visit = (node: ComponentNode): ComponentNode => {
    if (node.id === id) {
      changed = true;
      return updater(node);
    }
    if (!node.children?.length) return node;
    let childChanged = false;
    const children = node.children.map((child) => {
      const result = visit(child);
      childChanged = childChanged || result !== child;
      return result;
    });
    return childChanged ? { ...node, children } : node;
  };
  return { root: visit(root), changed };
};

export const insertChild = (
  root: ComponentNode,
  parentId: string,
  child: ComponentNode,
): { root: ComponentNode; changed: boolean } =>
  updateNode(root, parentId, (parent) => ({
    ...parent,
    children: [...(parent.children || []), cloneNode(child)],
  }));

export const removeNode = (
  root: ComponentNode,
  id: string,
): { root: ComponentNode; changed: boolean; parentId: string | null } => {
  if (root.id === id) return { root, changed: false, parentId: null };
  let parentId: string | null = null;
  const visit = (node: ComponentNode): ComponentNode => {
    if (!node.children?.length) return node;
    const contains = node.children.some((child) => child.id === id);
    if (contains) {
      parentId = node.id;
      return { ...node, children: node.children.filter((child) => child.id !== id) };
    }
    let changed = false;
    const children = node.children.map((child) => {
      const result = visit(child);
      changed = changed || result !== child;
      return result;
    });
    return changed ? { ...node, children } : node;
  };
  const nextRoot = visit(root);
  return { root: nextRoot, changed: nextRoot !== root, parentId };
};

export const moveChild = (
  root: ComponentNode,
  parentId: string,
  fromIndex: number,
  toIndex: number,
): { root: ComponentNode; changed: boolean } => {
  if (fromIndex === toIndex) return { root, changed: false };
  return updateNode(root, parentId, (parent) => {
    const children = [...(parent.children || [])];
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= children.length ||
      toIndex >= children.length
    ) return parent;
    const [moved] = children.splice(fromIndex, 1);
    if (!moved) return parent;
    children.splice(toIndex, 0, moved);
    return { ...parent, children };
  });
};

export const regenerateNodeIds = (node: ComponentNode): ComponentNode => {
  const newId = `${node.type.toLowerCase()}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    ...cloneNode(node),
    id: newId,
    children: node.children?.map(regenerateNodeIds),
  };
};
