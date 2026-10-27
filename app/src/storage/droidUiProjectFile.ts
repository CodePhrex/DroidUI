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
    schemaVersion: 29,
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

export const parseDroidUiFile = (
  fileContent: string
): { success: boolean; data?: DroidUiProjectPackage; error?: string } => {
  try {
    const raw = JSON.parse(fileContent);

    if (!raw || typeof raw !== 'object') {
      return { success: false, error: 'Invalid file format: content is not a valid JSON object.' };
    }

    if (raw.signature !== DROID_UI_SIGNATURE && !raw.fileFormat?.startsWith('DROID_STUDIO')) {
      return {
        success: false,
        error: `Unrecognized project signature. Expected "${DROID_UI_SIGNATURE}" or ".dui" header format.`,
      };
    }

    if (!raw.workspaceState || !raw.workspaceState.rootNode) {
      return { success: false, error: 'Malformed .dui file: missing workspace AST root node.' };
    }

    return {
      success: true,
      data: raw as DroidUiProjectPackage,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to parse .dui file payload: ${err.message}`,
    };
  }
};
