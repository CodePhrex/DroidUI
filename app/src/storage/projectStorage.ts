import AsyncStorage from '@react-native-async-storage/async-storage';
import { ComponentNode, ProjectMeta, SplashScreenConfig } from '../types/schema';
import { ThemeMode } from '../theme/themeConfig';
import { SupportedLocale, I18nDictionary } from '../types/localization';

const STORAGE_KEY_PREFIX = '@droid_studio_project_';
const INDEX_KEY = '@droid_studio_project_index';
export const PROJECT_STORAGE_SCHEMA_VERSION = 1;

export interface ProjectWorkspaceState {
  currentTheme: ThemeMode;
  activeLocale: SupportedLocale;
  splashConfig: SplashScreenConfig;
  i18nDict: I18nDictionary;
}

export interface StoredProject extends ProjectMeta {
  schemaVersion: number;
  workspaceState?: ProjectWorkspaceState;
}

export interface SavedProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
  nodeCount: number;
}

const DEFAULT_SPLASH: SplashScreenConfig = {
  enabled: true,
  title: 'Droid Mobile Studio',
  subtitle: 'Next-Gen Mobile UI Creator',
  logoIcon: '🚀',
  backgroundColor: '#0f172a',
  titleColor: '#ffffff',
  durationMs: 2000,
  showSpinner: true,
  animationType: 'fade',
};

const DEFAULT_DICTIONARY: I18nDictionary = {
  header_title: { en: 'Mobile Dashboard Studio', es: 'Estudio de Panel Móvil', fr: 'Studio de Tableau de Bord Mobile', de: 'Mobiler Dashboard-Studio', ja: 'モバイルダッシュボードスタジオ', zh: '移动仪表板工作室' },
  btn_explore: { en: 'Explore Components', es: 'Explorar Componentes', fr: 'Explorer les Composants', de: 'Komponenten Erkunden', ja: 'コンポーネントを探索する', zh: '探索组件' },
  btn_submit: { en: 'Submit Application', es: 'Enviar Solicitud', fr: 'Soumettre la Demande', de: 'Antrag Einreichen', ja: '申請を送信', zh: '提交申请' },
  btn_cancel: { en: 'Cancel', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', ja: 'キャンセル', zh: '取消' },
};

const isRecord = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

export const createProjectId = (): string =>
  'proj_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);

export const countNodes = (node: ComponentNode): number => {
  const visited = new Set<ComponentNode>();
  const count = (current: ComponentNode, depth: number): number => {
    if (!current || depth > 500 || visited.has(current)) {
      throw new Error('Project component tree is invalid or exceeds the maximum nesting depth.');
    }
    visited.add(current);
    if (!Array.isArray(current.children)) return 1;
    return 1 + current.children.reduce((total, child) => total + count(child, depth + 1), 0);
  };
  return count(node, 0);
};

const normalizeStoredProject = (value: unknown): StoredProject | null => {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string' ||
      typeof value.updatedAt !== 'string' || !isRecord(value.rootNode) ||
      typeof value.rootNode.id !== 'string' || typeof value.rootNode.type !== 'string' ||
      !isRecord(value.rootNode.style)) return null;

  const rootNode = value.rootNode as ComponentNode;
  let nodeCount: number;
  try {
    nodeCount = countNodes(rootNode);
  } catch {
    return null;
  }

  const workspace = isRecord(value.workspaceState) ? value.workspaceState : undefined;
  const theme = workspace?.currentTheme;
  const locale = workspace?.activeLocale;
  const workspaceState: ProjectWorkspaceState | undefined = workspace ? {
    currentTheme: ['dark', 'light', 'material_you', 'cyberpunk'].includes(theme) ? theme : 'dark',
    activeLocale: ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(locale) ? locale : 'en',
    splashConfig: isRecord(workspace.splashConfig)
      ? { ...DEFAULT_SPLASH, ...workspace.splashConfig } as SplashScreenConfig
      : DEFAULT_SPLASH,
    i18nDict: isRecord(workspace.i18nDict) ? workspace.i18nDict as I18nDictionary : DEFAULT_DICTIONARY,
  } : undefined;

  return {
    id: value.id,
    name: value.name,
    updatedAt: value.updatedAt,
    nodeCount,
    rootNode,
    schemaVersion: PROJECT_STORAGE_SCHEMA_VERSION,
    workspaceState,
  };
};

const toSummary = (project: StoredProject): SavedProjectSummary => ({
  id: project.id,
  name: project.name,
  updatedAt: project.updatedAt,
  nodeCount: project.nodeCount,
});

const rebuildProjectIndex = async (): Promise<SavedProjectSummary[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const projectKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
  if (!projectKeys.length) {
    await AsyncStorage.setItem(INDEX_KEY, '[]');
    return [];
  }

  const records = await AsyncStorage.multiGet(projectKeys);
  const projects = records
    .map(([, raw]) => {
      if (!raw) return null;
      try {
        return normalizeStoredProject(JSON.parse(raw));
      } catch {
        return null;
      }
    })
    .filter((project): project is StoredProject => project !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const summaries = projects.map(toSummary);
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(summaries));
  return summaries;
};

export const saveProjectToDevice = async (
  name: string,
  rootNode: ComponentNode,
  existingId?: string,
  workspaceState?: ProjectWorkspaceState
): Promise<StoredProject> => {
  const id = existingId || createProjectId();
  const cleanName = name.trim() || 'Untitled Project';
  const normalized = normalizeStoredProject({
    id,
    name: cleanName,
    updatedAt: new Date().toISOString(),
    nodeCount: countNodes(rootNode),
    rootNode,
    schemaVersion: PROJECT_STORAGE_SCHEMA_VERSION,
    workspaceState,
  });
  if (!normalized) throw new Error('Cannot save an invalid project tree.');

  try {
    await AsyncStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(normalized));
    const index = await rebuildProjectIndex();
    const summary = toSummary(normalized);
    const nextIndex = [summary, ...index.filter(item => item.id !== id)];
    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(nextIndex));
    return normalized;
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
};

export const listProjectsFromDevice = async (): Promise<SavedProjectSummary[]> => {
  // Rebuild from project records on every refresh so stale or incomplete indexes
  // never hide a successfully saved project.
  return rebuildProjectIndex();
};

export const loadProjectFromDevice = async (id: string): Promise<StoredProject | null> => {
  if (!id || typeof id !== 'string') return null;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (!raw) return null;
    const project = normalizeStoredProject(JSON.parse(raw));
    if (!project) throw new Error('Saved project data failed validation.');
    return project;
  } catch (error) {
    console.error('Failed to load project:', error);
    throw error;
  }
};

export const deleteProjectFromDevice = async (id: string): Promise<void> => {
  if (!id || typeof id !== 'string') throw new Error('A valid project ID is required.');
  await AsyncStorage.removeItem(STORAGE_KEY_PREFIX + id);
  await rebuildProjectIndex();
};
