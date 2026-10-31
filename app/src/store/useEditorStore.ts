import { create } from 'zustand';
import { ComponentNode, ComponentStyle, AnimationSpec, PressStateSpec, AccessibilitySpec, SoundEffectSpec, TransitionSpec, SplashScreenConfig } from '../types/schema';
import { ThemeMode } from '../theme/themeConfig';
import { SupportedLocale, I18nDictionary, TranslationMap } from '../types/localization';
import { saveProjectToDevice, loadProjectFromDevice, listProjectsFromDevice, deleteProjectFromDevice, SavedProjectSummary } from '../storage/projectStorage';
import { DroidUiProjectPackage } from '../storage/droidUiProjectFile';

const defaultDict: I18nDictionary = {
  header_title: {
    en: 'Mobile Dashboard Studio',
    es: 'Estudio de Panel Móvil',
    fr: 'Studio de Tableau de Bord Mobile',
    de: 'Mobiler Dashboard-Studio',
    ja: 'モバイルダッシュボードスタジオ',
    zh: '移动仪表板工作室'
  },
  btn_explore: {
    en: 'Explore Components',
    es: 'Explorar Componentes',
    fr: 'Explorer les Composants',
    de: 'Komponenten Erkunden',
    ja: 'コンポーネントを探索する',
    zh: '探索组件'
  },
  btn_submit: {
    en: 'Submit Application',
    es: 'Enviar Solicitud',
    fr: 'Soumettre la Demande',
    de: 'Antrag Einreichen',
    ja: '申請を送信',
    zh: '提交申请'
  },
  btn_cancel: {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    ja: 'キャンセル',
    zh: '取消'
  }
};

const initialSplash: SplashScreenConfig = {
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

const initialRoot: ComponentNode = {
  id: 'root_container',
  type: 'Container',
  style: {
    flexDirection: 'column',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  animation: { preset: 'fadeIn', duration: 400, delay: 100 },
  accessibility: {
    accessible: true,
    accessibilityRole: 'none',
    importantForAccessibility: 'yes',
  },
  children: [
    {
      id: 'title_header',
      type: 'Text',
      props: { text: 'Mobile Dashboard Studio', i18nKey: 'header_title' },
      style: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 12,
      },
      accessibility: {
        accessible: true,
        accessibilityRole: 'header',
        accessibilityLabel: 'Mobile Dashboard Studio Header',
        importantForAccessibility: 'yes',
      },
    },
    {
      id: 'cta_button',
      type: 'Button',
      props: { label: 'Explore Components', i18nKey: 'btn_explore' },
      style: {
        backgroundColor: '#3b82f6',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
      },
      animation: { preset: 'springIn', duration: 300, delay: 200 },
      pressState: {
        activeOpacity: 0.7,
        pressScale: 0.95,
        pressedBgColor: '#1d4ed8',
        hoverBorderColor: '#60a5fa',
        hoverGlow: true,
      },
      soundEffect: {
        soundName: 'pop',
        volume: 0.8,
      },
      transition: {
        type: 'slide_right',
        duration: 300,
        easing: 'spring',
      },
      accessibility: {
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: 'Explore Components Button',
        accessibilityHint: 'Double tap to view all interactive elements',
        importantForAccessibility: 'yes',
      },
    },
  ],
};

const randomizeIds = (node: ComponentNode): ComponentNode => {
  const newId = node.type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 6);
  return {
    ...node,
    id: newId,
    children: node.children ? node.children.map(randomizeIds) : undefined,
  };
};

interface SavedProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
  nodeCount: number;
}

export type SimMode = 'default' | 'pressed' | 'hovered';

interface EditorState {
  rootNode: ComponentNode;
  selectedNodeId: string | null;
  history: ComponentNode[];
  future: ComponentNode[];
  currentTheme: ThemeMode;
  currentProjectId: string | null;
  currentProjectName: string;
  savedProjects: SavedProjectSummary[];
  activeSimMode: SimMode;
  activeLocale: SupportedLocale;
  i18nDict: I18nDictionary;
  splashConfig: SplashScreenConfig;
  activeSplashPreview: boolean;

  setTheme: (theme: ThemeMode) => void;
  selectNode: (id: string | null) => void;
  setSimMode: (mode: SimMode) => void;
  setActiveLocale: (locale: SupportedLocale) => void;
  setTranslationKey: (key: string, translations: TranslationMap) => void;
  assignNodeTranslationKey: (nodeId: string, key: string) => void;
  applyDefaultI18nPresets: () => void;
  updateSplashConfig: (config: Partial<SplashScreenConfig>) => void;
  triggerSplashPreview: () => void;
  importDroidUiPackage: (pkg: DroidUiProjectPackage) => void;
  updateStyle: (id: string, style: Partial<ComponentStyle>) => void;
  updateProps: (id: string, props: Record<string, any>) => void;
  updateAnimation: (id: string, animation: AnimationSpec) => void;
  updatePressState: (id: string, pressState: PressStateSpec) => void;
  updateAccessibility: (id: string, accessibility: AccessibilitySpec) => void;
  updateSoundEffect: (id: string, soundEffect: SoundEffectSpec) => void;
  updateTransition: (id: string, transition: TransitionSpec) => void;
  addChildNode: (parentId: string, type: ComponentNode['type']) => void;
  insertTemplate: (parentId: string, templateNode: ComponentNode) => void;
  moveChildNode: (parentId: string, fromIndex: number, toIndex: number) => void;
  deleteNode: (id: string) => void;
  undo: () => void;
  redo: () => void;

  // Project Saver Actions
  saveCurrentProject: (name?: string) => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  refreshProjectList: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createNewProject: (name: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  rootNode: initialRoot,
  selectedNodeId: 'root_container',
  history: [],
  future: [],
  currentTheme: 'dark',
  currentProjectId: null,
  currentProjectName: 'Untitled Project',
  savedProjects: [],
  activeSimMode: 'default',
  activeLocale: 'en',
  i18nDict: defaultDict,
  splashConfig: initialSplash,
  activeSplashPreview: false,

  setTheme: (theme) => set({ currentTheme: theme }),

  selectNode: (id) => set({ selectedNodeId: id }),

  setSimMode: (mode) => set({ activeSimMode: mode }),

  setActiveLocale: (locale) => set({ activeLocale: locale }),

  setTranslationKey: (key, translations) => {
    const { i18nDict } = get();
    set({
      i18nDict: {
        ...i18nDict,
        [key]: translations
      }
    });
  },

  assignNodeTranslationKey: (nodeId, key) => {
    const { updateProps } = get();
    updateProps(nodeId, { i18nKey: key });
  },

  applyDefaultI18nPresets: () => {
    const { i18nDict } = get();
    set({
      i18nDict: {
        ...i18nDict,
        ...defaultDict
      }
    });
  },

  updateSplashConfig: (cfg) => {
    const { splashConfig } = get();
    set({ splashConfig: { ...splashConfig, ...cfg } });
  },

  triggerSplashPreview: () => {
    const { splashConfig } = get();
    set({ activeSplashPreview: true });
    setTimeout(() => {
      set({ activeSplashPreview: false });
    }, splashConfig.durationMs);
  },

  importDroidUiPackage: (pkg) => {
    const state = pkg.workspaceState;
    set({
      currentProjectId: null,
      currentProjectName: pkg.projectMeta.name || 'Imported Droid UI Project',
      rootNode: state.rootNode,
      currentTheme: state.currentTheme || 'dark',
      activeLocale: state.activeLocale || 'en',
      splashConfig: state.splashConfig || initialSplash,
      i18nDict: state.i18nDict || defaultDict,
      selectedNodeId: state.rootNode.id || 'root_container',
      history: [],
      future: [],
    });
  },

  updateStyle: (id, newStyle) => {
    const { rootNode, history } = get();
    const updateRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === id) {
        return { ...node, style: { ...node.style, ...newStyle } };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    set({
      history: [...history, rootNode],
      future: [],
      rootNode: updateRecursive(rootNode),
    });
  },

  updateProps: (id, newProps) => {
    const { rootNode, history } = get();
    const updateRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === id) {
        return { ...node, props: { ...node.props, ...newProps } };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    set({
      history: [...history, rootNode],
      future: [],
      rootNode: updateRecursive(rootNode),
    });
  },

  updateAnimation: (id, animation) => {
    const { rootNode, history } = get();
    const updateRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === id) {
        return { ...node, animation };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    set({
      history: [...history, rootNode],
      future: [],
      rootNode: updateRecursive(rootNode),
    });
  },

  updatePressState: (id, pressState) => {
    const { rootNode, history } = get();
    const updateRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === id) {
        return { ...node, pressState };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    set({
      history: [...history, rootNode],
      future: [],
      rootNode: updateRecursive(rootNode),
    });
  },

  updateAccessibility: (id, accessibility) => {
    const { rootNode, history } = get();
    const updateRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === id) {
        return { ...node, accessibility };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    set({
      history: [...history, rootNode],
      future: [],
      rootNode: updateRecursive(rootNode),
    });
  },

  updateSoundEffect: (id, soundEffect) => {
    const { rootNode, history } = get();
    const updateRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === id) {
        return { ...node, soundEffect };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    set({
      history: [...history, rootNode],
      future: [],
      rootNode: updateRecursive(rootNode),
    });
  },

  updateTransition: (id, transition) => {
    const { rootNode, history } = get();
    const updateRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === id) {
        return { ...node, transition };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateRecursive) };
      }
      return node;
    };
    set({
      history: [...history, rootNode],
      future: [],
      rootNode: updateRecursive(rootNode),
    });
  },

  addChildNode: (parentId, type) => {
    const { rootNode, history } = get();

    let defaultProps: Record<string, any> = {};
    let defaultStyle: ComponentStyle = { fontSize: 14, color: '#f8fafc' };

    if (type === 'Text') {
      defaultProps = { text: 'New Text Label' };
    } else if (type === 'Button') {
      defaultProps = { label: 'Click Me' };
      defaultStyle = { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center' };
    } else if (type === 'Input') {
      defaultProps = { placeholder: 'Enter value...' };
      defaultStyle = { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, color: '#f8fafc' };
    } else if (type === 'Container' || type === 'Card') {
      defaultStyle = { padding: 12, backgroundColor: '#1e293b', borderRadius: 10, marginVertical: 4 };
    } else if (type === 'Badge') {
      defaultProps = { text: 'Active' };
      defaultStyle = { backgroundColor: '#10b981', padding: 4, borderRadius: 12 };
    } else if (type === 'Icon') {
      defaultProps = { iconSymbol: '❖' };
      defaultStyle = { fontSize: 24, color: '#38bdf8' };
    } else if (type === 'ProgressBar') {
      defaultProps = { label: 'Task Progress', progress: 70, barColor: '#3b82f6', trackColor: '#334155' };
      defaultStyle = { marginVertical: 4 };
    } else if (type === 'Graph') {
      defaultProps = { title: 'Revenue Analytics', chartType: 'bar', values: [35, 60, 45, 80, 65, 90] };
      defaultStyle = { marginVertical: 6, color: '#38bdf8' };
    } else if (type === 'Switch') {
      defaultProps = { label: 'Enable Feature', value: true };
      defaultStyle = { marginVertical: 4 };
    } else if (type === 'Slider') {
      defaultProps = { label: 'Volume Control', value: 60 };
      defaultStyle = { marginVertical: 4 };
    } else if (type === 'Checkbox') {
      defaultProps = { label: 'I agree to the terms', checked: true };
      defaultStyle = { marginVertical: 4 };
    } else if (type === 'AnimatedAsset') {
      defaultProps = { assetName: 'Glowing Star Asset', animationType: 'pulse' };
      defaultStyle = { marginVertical: 4 };
    } else if (type === 'SvgVector') {
      defaultProps = {
        svgName: 'Android Bot Mascot',
        svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#a4c639" d="M6 18c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9H6v9zM7 3.5L5.4 1.9 4 3.3l1.8 1.8C4.7 6.1 4 7.5 4 9h16c0-1.5-.7-2.9-1.8-3.9L20 3.3l-1.4-1.4L17 3.5C15.6 2.6 13.9 2 12 2s-3.6.6-5 1.5z"/></svg>'
      };
      defaultStyle = { width: 48, height: 48, color: '#a4c639', marginVertical: 4 };
    }

    const newNode: ComponentNode = {
      id: type.toLowerCase() + '_' + Date.now().toString().slice(-4),
      type,
      props: defaultProps,
      style: defaultStyle,
      soundEffect: type === 'Button' || type === 'Switch' ? { soundName: 'pop', volume: 0.8 } : undefined,
    };

    const addRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === parentId) {
        return { ...node, children: [...(node.children || []), newNode] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addRecursive) };
      }
      return node;
    };

    set({
      history: [...history, rootNode],
      future: [],
      rootNode: addRecursive(rootNode),
      selectedNodeId: newNode.id,
    });
  },

  insertTemplate: (parentId, templateNode) => {
    const { rootNode, history } = get();
    const clonedTemplate = randomizeIds(templateNode);

    const insertRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === parentId) {
        return { ...node, children: [...(node.children || []), clonedTemplate] };
      }
      if (node.children) {
        return { ...node, children: node.children.map(insertRecursive) };
      }
      return node;
    };

    set({
      history: [...history, rootNode],
      future: [],
      rootNode: insertRecursive(rootNode),
      selectedNodeId: clonedTemplate.id,
    });
  },

  moveChildNode: (parentId, fromIndex, toIndex) => {
    const { rootNode, history } = get();
    const moveRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === parentId && node.children) {
        const children = [...node.children];
        const [movedItem] = children.splice(fromIndex, 1);
        children.splice(toIndex, 0, movedItem);
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: node.children.map(moveRecursive) };
      }
      return node;
    };

    set({
      history: [...history, rootNode],
      future: [],
      rootNode: moveRecursive(rootNode),
    });
  },

  deleteNode: (id) => {
    const { rootNode, history } = get();
    if (id === rootNode.id) return; // Cannot delete root

    const deleteRecursive = (node: ComponentNode): ComponentNode => {
      if (node.children) {
        return {
          ...node,
          children: node.children.filter((c) => c.id !== id).map(deleteRecursive),
        };
      }
      return node;
    };

    set({
      history: [...history, rootNode],
      future: [],
      rootNode: deleteRecursive(rootNode),
      selectedNodeId: null,
    });
  },

  undo: () => {
    const { history, rootNode, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      rootNode: previous,
      history: history.slice(0, -1),
      future: [rootNode, ...future],
    });
  },

  redo: () => {
    const { future, rootNode, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      rootNode: next,
      history: [...history, rootNode],
      future: [...future.slice(1)],
    });
  },

  // Project Saver Implementations
  saveCurrentProject: async (customName) => {
    const state = get();
    const name = customName || state.currentProjectName;
    const meta = await saveProjectToDevice(name, state.rootNode, state.currentProjectId || undefined, {
      currentTheme: state.currentTheme,
      activeLocale: state.activeLocale,
      splashConfig: state.splashConfig,
      i18nDict: state.i18nDict,
    });
    set({ currentProjectId: meta.id, currentProjectName: meta.name });
    await get().refreshProjectList();
  },

  loadProject: async (id) => {
    const meta = await loadProjectFromDevice(id);
    if (meta) {
      const workspace = meta.workspaceState;
      set({
        rootNode: meta.rootNode,
        currentProjectId: meta.id,
        currentProjectName: meta.name,
        currentTheme: workspace?.currentTheme || 'dark',
        activeLocale: workspace?.activeLocale || 'en',
        splashConfig: workspace?.splashConfig || { ...initialSplash },
        i18nDict: workspace?.i18nDict || defaultDict,
        activeSimMode: 'default',
        activeSplashPreview: false,
        selectedNodeId: meta.rootNode.id,
        history: [],
        future: []
      });
    }
  },

  refreshProjectList: async () => {
    const projects = await listProjectsFromDevice();
    set({ savedProjects: projects });
  },

  deleteProject: async (id) => {
    await deleteProjectFromDevice(id);
    await get().refreshProjectList();
  },

  createNewProject: (name) => {
    set({
      rootNode: JSON.parse(JSON.stringify(initialRoot)) as ComponentNode,
      currentProjectId: null,
      currentProjectName: name || 'New UI Project',
      currentTheme: 'dark',
      activeLocale: 'en',
      i18nDict: { ...defaultDict },
      splashConfig: { ...initialSplash },
      activeSimMode: 'default',
      activeSplashPreview: false,
      selectedNodeId: 'root_container',
      history: [],
      future: []
    });
  }
}));
