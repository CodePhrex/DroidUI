import { ComponentNode, SplashScreenConfig } from '../types/schema';
import { ThemeMode } from '../theme/themeConfig';
import { SupportedLocale, I18nDictionary } from '../types/localization';

export const DROID_UI_FILE_EXTENSION = '.dui';
export const DROID_UI_SIGNATURE = 'DROID_STUDIO_PROJECT_V30';

export interface DroidUiProjectPackage {
  signature: string;
  extension: string;
  appTitle: string;
  schemaVersion: number;
  createdAt: string;
  projectMeta: {
    id: string;
    name: string;
    nodeCount: number;
  };
  workspaceState: {
    currentTheme: ThemeMode;
    activeLocale: SupportedLocale;
    splashConfig: SplashScreenConfig;
    i18nDict: I18nDictionary;
    rootNode: ComponentNode;
  };
}

export const countNodes = (node: ComponentNode): number => {
  let count = 1;
  if (node.children) {
    node.children.forEach((c) => {
      count += countNodes(c);
    });
  }
  return count;
};

export const exportProjectToDroidUiFile = (
  projectId: string | null,
  projectName: string,
  rootNode: ComponentNode,
  currentTheme: ThemeMode,
  activeLocale: SupportedLocale,
  splashConfig: SplashScreenConfig,
  i18nDict: I18nDictionary
): { filename: string; content: string } => {
  const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
  const filename = `${sanitizedName || 'droid_project'}${DROID_UI_FILE_EXTENSION}`;

  const pkg: DroidUiProjectPackage = {
    signature: DROID_UI_SIGNATURE,
    extension: DROID_UI_FILE_EXTENSION,
    appTitle: 'Droid Mobile Studio',
    schemaVersion: 30,
    createdAt: new Date().toISOString(),
    projectMeta: {
      id: projectId || 'proj_' + Date.now(),
      name: projectName,
      nodeCount: countNodes(rootNode),
    },
    workspaceState: {
      currentTheme,
      activeLocale,
      splashConfig,
      i18nDict,
      rootNode,
    },
  };

  return {
    filename,
    content: JSON.stringify(pkg, null, 2),
  };
};

const isRecord = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const isValidComponentNode = (value: unknown, depth = 0): value is ComponentNode => {
  if (!isRecord(value) || depth > 500 ||
      typeof value.id !== 'string' || !value.id ||
      typeof value.type !== 'string' ||
      !['Container', 'Text', 'Button', 'Input', 'Card', 'Badge', 'Icon', 'Image',
        'ProgressBar', 'Graph', 'Switch', 'Slider', 'Checkbox', 'AnimatedAsset', 'SvgVector'].includes(value.type) ||
      !isRecord(value.style)) return false;
  if (value.props !== undefined && !isRecord(value.props)) return false;
  if (value.children !== undefined &&
      (!Array.isArray(value.children) || !value.children.every(child => isValidComponentNode(child, depth + 1)))) return false;
  return true;
};

export const parseDroidUiFile = (
  fileContent: string
): { success: boolean; data?: DroidUiProjectPackage; error?: string } => {
  try {
    const raw: unknown = JSON.parse(fileContent);

    if (!isRecord(raw)) {
      return { success: false, error: 'Invalid file format: content is not a valid JSON object.' };
    }

    const recognizedSignature = raw.signature === DROID_UI_SIGNATURE ||
      (typeof raw.fileFormat === 'string' && raw.fileFormat.startsWith('DROID_STUDIO'));
    if (!recognizedSignature) {
      return {
        success: false,
        error: `Unrecognized project signature. Expected "${DROID_UI_SIGNATURE}" or a supported legacy Droid Studio header.`,
      };
    }

    // Schema 29 is the legacy package version already emitted by earlier DroidUI builds.
    if (raw.schemaVersion !== 29 && raw.schemaVersion !== 30) {
      return { success: false, error: `Unsupported .dui schema version: ${String(raw.schemaVersion)}.` };
    }

    if (!isRecord(raw.projectMeta) ||
        typeof raw.projectMeta.name !== 'string' ||
        typeof raw.projectMeta.id !== 'string') {
      return { success: false, error: 'Malformed .dui file: project metadata is missing or invalid.' };
    }

    if (!isRecord(raw.workspaceState) || !isValidComponentNode(raw.workspaceState.rootNode)) {
      return { success: false, error: 'Malformed .dui file: workspace state or component tree is invalid.' };
    }

    const state = raw.workspaceState;
    const validTheme = ['dark', 'light', 'material_you', 'cyberpunk'].includes(state.currentTheme);
    const validLocale = ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(state.activeLocale);
    if (!isRecord(state.splashConfig) || !isRecord(state.i18nDict)) {
      return { success: false, error: 'Malformed .dui file: splash configuration or translation dictionary is invalid.' };
    }

    const nodeCount = (node: ComponentNode): number =>
      1 + (node.children || []).reduce((sum, child) => sum + nodeCount(child), 0);

    const normalized: DroidUiProjectPackage = {
      signature: DROID_UI_SIGNATURE,
      extension: DROID_UI_FILE_EXTENSION,
      appTitle: typeof raw.appTitle === 'string' ? raw.appTitle : 'Droid Mobile Studio',
      schemaVersion: 30,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
      projectMeta: {
        id: raw.projectMeta.id,
        name: raw.projectMeta.name,
        nodeCount: nodeCount(state.rootNode),
      },
      workspaceState: {
        currentTheme: validTheme ? state.currentTheme : 'dark',
        activeLocale: validLocale ? state.activeLocale : 'en',
        splashConfig: state.splashConfig as SplashScreenConfig,
        i18nDict: state.i18nDict as I18nDictionary,
        rootNode: state.rootNode,
      },
    };

    return { success: true, data: normalized };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Failed to parse .dui file payload: ${message}`,
    };
  }
};
