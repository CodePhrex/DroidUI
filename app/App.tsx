import { ReleaseVersionStudio } from './src/components/ReleaseVersionStudio';
import { DeepLinkAndIconStudio } from './src/components/DeepLinkAndIconStudio';
import { ProjectFileIOStudio } from './src/components/ProjectFileIOStudio';
import { AndroidProjectExportStudio } from './src/components/AndroidProjectExportStudio';
import { StoreMetadataStudio } from './src/components/StoreMetadataStudio';
import { SvgImporterStudio } from './src/components/SvgImporterStudio';
import { SplashScreenStudio } from './src/components/SplashScreenStudio';
import { SoundEffectsStudio } from './src/components/SoundEffectsStudio';
import { TransitionsStudio } from './src/components/TransitionsStudio';
import { CICDPipelineStudio } from './src/components/CICDPipelineStudio';
import { generateGitHubActionsYAML } from './src/compiler/cicdPipelineGenerator';
import { UnitTestGeneratorStudio } from './src/components/UnitTestGeneratorStudio';
import { generateJestTestSpec } from './src/compiler/jestTestGenerator';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, SafeAreaView, Alert, InteractionManager } from 'react-native';
import { useEditorStore } from './src/store/useEditorStore';
import { CanvasRenderer } from './src/components/CanvasRenderer';
import { PropertyInspector } from './src/components/PropertyInspector';
import { LayerReorderManager } from './src/components/LayerReorderManager';
import { TemplateLibrary } from './src/templates/TemplateLibrary';
import { ThemeManager } from './src/components/ThemeManager';
import { ProjectManager } from './src/components/ProjectManager';
import { AssetPickerStudio } from './src/components/AssetPickerStudio';
import { ViewportSelector, VIEWPORTS, ViewportMode } from './src/components/ViewportSelector';
import { ComponentSearchFilter } from './src/components/ComponentSearchFilter';
import { LiveCodePreview } from './src/components/LiveCodePreview';
import { FontLibraryStudio } from './src/components/FontLibraryStudio';
import { ComponentToolbar } from './src/components/ComponentToolbar';
import { StudioHub } from './src/components/StudioHub';
import { PropertyPresetsStudio } from './src/components/PropertyPresetsStudio';
import { ThemeExportImportStudio } from './src/components/ThemeExportImportStudio';
import { SpacingAlignmentStudio } from './src/components/SpacingAlignmentStudio';
import { PressStateStudio } from './src/components/PressStateStudio';
import { AccessibilityStudio } from './src/components/AccessibilityStudio';
import { LocalizationStudio } from './src/components/LocalizationStudio';
import { PerformanceProfilerStudio } from './src/components/PerformanceProfilerStudio';
import { THEMES } from './src/theme/themeConfig';
import { BrandMark, BrandSplash } from './src/components/DroidUIBrand';
import { FloatingToolWindow } from './src/components/FloatingToolWindow';
import { generateReactNativeTSX, generateJetpackComposeKotlin } from './src/compiler/codeExporter';
import { generateSVGVector, generateCSSinJS, generateJSONSchema } from './src/compiler/exportPresets';
import { generateStoreListingText } from './src/compiler/storeMetadataGenerator';
import { exportProjectToDroidUiFile } from './src/storage/droidUiProjectFile';

export default function App() {
  const {
    rootNode,
    currentTheme,
    setTheme,
    activeLocale,
    splashConfig,
    i18nDict,
    currentProjectId,
    currentProjectName,
    undo,
    redo,
    saveCurrentProject,
    refreshProjectList
  } = useEditorStore();

  const theme = THEMES[currentTheme] || THEMES.dark;
  const isLightMode = currentTheme === 'light';

  const [activeTab, setActiveTab] = useState<'toolbox' | 'more' | 'inspector' | 'deeplink' | 'release' | 'droid_file' | 'svg_importer' | 'store' | 'export_android' | 'splash' | 'sounds' | 'transitions' | 'assets' | 'templates' | 'cicd' | 'tests' | 'profiler' | 'i18n' | 'accessibility' | 'states' | 'spacing' | 'presets' | 'code' | 'font' | 'search' | 'assets' | 'projects' | 'layers' | 'theme' | 'theme_io'>('inspector');
  const [activeViewport, setActiveViewport] = useState<ViewportMode>('galaxy_s24_ultra');
  const [modalVisible, setModalVisible] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showBrandSplash, setShowBrandSplash] = useState(true);
  const [bootProgress, setBootProgress] = useState(8);
  const [bootStatus, setBootStatus] = useState('Starting DroidUI services');
  const [floatingPanels, setFloatingPanels] = useState<Array<'toolbox' | 'templates' | 'inspector'>>([]);
  const toggleFloatingPanel = (panel: 'toolbox' | 'templates' | 'inspector') => setFloatingPanels(current => current.includes(panel) ? current.filter(item => item !== panel) : [...current, panel]);

  useEffect(() => {
    let mounted = true;
    const initializeStudio = async () => {
      try {
        setBootStatus('Restoring your project library');
        setBootProgress(24);
        await refreshProjectList();

        if (!mounted) return;
        setBootStatus('Preparing the design canvas');
        setBootProgress(56);
        const editorState = useEditorStore.getState();
        if (!editorState.rootNode || !editorState.rootNode.id) {
          throw new Error('The editor workspace could not be initialized.');
        }

        setBootStatus('Loading studio tools and design systems');
        setBootProgress(78);
        await new Promise<void>(resolve => {
          InteractionManager.runAfterInteractions(() => resolve());
        });

        if (!mounted) return;
        setBootStatus('Finishing workspace setup');
        setBootProgress(100);
      } catch (error) {
        if (!mounted) return;
        // Keep startup resilient: the editor can still open with its default workspace
        // when local project storage is unavailable or empty.
        setBootStatus('Opening a fresh workspace');
        setBootProgress(100);
      }
    };
    initializeStudio();
    return () => { mounted = false; };
  }, [refreshProjectList]);

  const currentVP = VIEWPORTS[activeViewport] || VIEWPORTS.galaxy_s24_ultra;

  const toggleThemeMode = () => {
    setTheme(isLightMode ? 'dark' : 'light');
  };

  const handleQuickSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveCurrentProject();
      Alert.alert('Project saved', 'Your current DroidUI design is saved on this device.');
    } catch (error) {
      Alert.alert('Save failed', error instanceof Error ? error.message : 'Unable to save this project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = (format: 'tsx' | 'kotlin' | 'svg' | 'cssinjs' | 'json' | 'test' | 'cicd' | 'store' | 'droidui') => {
    if (format === 'tsx') setCodeOutput(generateReactNativeTSX(rootNode));
    else if (format === 'kotlin') setCodeOutput(generateJetpackComposeKotlin(rootNode));
    else if (format === 'svg') setCodeOutput(generateSVGVector(rootNode));
    else if (format === 'cssinjs') setCodeOutput(generateCSSinJS(rootNode));
    else if (format === 'json') setCodeOutput(generateJSONSchema(rootNode));
    else if (format === 'test') setCodeOutput(generateJestTestSpec(rootNode));
    else if (format === 'cicd') setCodeOutput(generateGitHubActionsYAML());
    else if (format === 'store') setCodeOutput(generateStoreListingText(rootNode));
    else if (format === 'droidui') setCodeOutput(exportProjectToDroidUiFile(currentProjectId, currentProjectName, rootNode, currentTheme, activeLocale, splashConfig, i18nDict).content);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgCanvas }]}>
      {/* Studio Top Navigation Header Bar */}
      <View style={[styles.navbar, { backgroundColor: theme.bgSurface, borderColor: theme.border }]}>
        <View style={styles.brandGroup}>
          <BrandMark size={34} compact />
          <View style={[styles.projectBadge, { backgroundColor: isLightMode ? '#E5EDFF' : '#111B35' }]}>
            <Text style={[styles.projectBadgeText, { color: theme.textSecondary }]}>{currentProjectName}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.navActions}>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#203D70', borderWidth: 1, borderColor: '#398BFF' }]} onPress={() => toggleFloatingPanel('toolbox')}><Text style={[styles.navBtnText, { color: '#DCE8FF' }]}>＋ Toolbox</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#203D70' }]} onPress={() => toggleFloatingPanel('templates')}><Text style={[styles.navBtnText, { color: '#DCE8FF' }]}>▣ Templates</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#203D70' }]} onPress={() => toggleFloatingPanel('inspector')}><Text style={[styles.navBtnText, { color: '#DCE8FF' }]}>◈ Inspector</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: isLightMode ? '#E5EDFF' : '#111B35' }]} onPress={handleQuickSave} disabled={isSaving}>
            <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>{isSaving ? 'Saving…' : '💾 Save'}</Text>
          </TouchableOpacity>
          {/* Light / Dark UI Toggle Switch */}
          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: isLightMode ? '#398BFF' : '#111B35', borderColor: theme.border }]}
            onPress={toggleThemeMode}
          >
            <Text style={styles.themeToggleText}>
              {isLightMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navBtn, { backgroundColor: isLightMode ? '#E5EDFF' : '#111B35' }]} onPress={undo}>
            <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>↩ Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: isLightMode ? '#E5EDFF' : '#111B35' }]} onPress={redo}>
            <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>↪ Redo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportBtn, { backgroundColor: theme.primary }]} onPress={() => handleExport('tsx')}>
            <Text style={styles.exportBtnText}>🚀 Export App</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Studio Workspace Area */}
      <View style={styles.workspace}>
        {/* Live Device Preview Canvas */}
        <View style={styles.canvasArea}>
          <ViewportSelector activeViewport={activeViewport} onSelectViewport={setActiveViewport} />
          <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={[styles.deviceFrame, { width: currentVP.width, minHeight: currentVP.height, borderColor: theme.border, backgroundColor: isLightMode ? '#101A36' : 'rgba(0,0,0,0.3)' }]}>
              <View style={[styles.deviceNotch, { backgroundColor: isLightMode ? '#cbd5e1' : '#111B35' }]} />
              <CanvasRenderer node={rootNode} />
            </View>
          </ScrollView>
        </View>

        {/* Focused workspace dock: five clear destinations instead of a crowded strip of every studio. */}
        <View style={[styles.panelArea, { backgroundColor: theme.bgSurface, borderColor: theme.border }]}>
          <View style={[styles.workspaceDock, { borderColor: theme.border }]}>
            {[
              { id: 'toolbox', label: 'Insert', icon: '＋' },
              { id: 'inspector', label: 'Design', icon: '◈' },
              { id: 'layers', label: 'Layers', icon: '▤' },
              { id: 'assets', label: 'Assets', icon: '▧' },
              { id: 'more', label: 'More', icon: '•••' },
            ].map(item => {
              const active = activeTab === item.id || (item.id === 'more' && !['toolbox', 'inspector', 'layers', 'assets', 'more'].includes(activeTab));
              return (
                <TouchableOpacity key={item.id} style={[styles.dockItem, active && styles.dockItemActive]} onPress={() => setActiveTab(item.id as typeof activeTab)}>
                  <Text style={[styles.dockIcon, { color: active ? theme.primary : theme.textSecondary }]}>{item.icon}</Text>
                  <Text style={[styles.dockLabel, { color: active ? theme.primary : theme.textSecondary }]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {activeTab === 'toolbox' && <ComponentToolbar />}
          {activeTab === 'more' && <StudioHub onOpen={(tab) => setActiveTab(tab as typeof activeTab)} />}
          {activeTab === 'inspector' && <PropertyInspector />}
          {activeTab === 'deeplink' && <DeepLinkAndIconStudio />}
          {activeTab === 'release' && <ReleaseVersionStudio />}
          {activeTab === 'droid_file' && <ProjectFileIOStudio />}
          {activeTab === 'svg_importer' && <SvgImporterStudio />}
          {activeTab === 'store' && <StoreMetadataStudio />}
          {activeTab === 'export_android' && <AndroidProjectExportStudio />}
          {activeTab === 'splash' && <SplashScreenStudio />}
          {activeTab === 'sounds' && <SoundEffectsStudio />}
          {activeTab === 'transitions' && <TransitionsStudio />}
          {activeTab === 'assets' && <AssetPickerStudio />}
          {activeTab === 'templates' && <TemplateLibrary />}
          {activeTab === 'cicd' && <CICDPipelineStudio />}
          {activeTab === 'tests' && <UnitTestGeneratorStudio />}
          {activeTab === 'profiler' && <PerformanceProfilerStudio />}
          {activeTab === 'i18n' && <LocalizationStudio />}
          {activeTab === 'accessibility' && <AccessibilityStudio />}
          {activeTab === 'states' && <PressStateStudio />}
          {activeTab === 'spacing' && <SpacingAlignmentStudio />}
          {activeTab === 'presets' && <PropertyPresetsStudio />}
          {activeTab === 'theme_io' && <ThemeExportImportStudio />}
          {activeTab === 'font' && <FontLibraryStudio />}
          {activeTab === 'code' && <LiveCodePreview />}
          {activeTab === 'search' && <ComponentSearchFilter />}
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'layers' && <LayerReorderManager />}
          {activeTab === 'theme' && <ThemeManager />}
        </View>
      </View>

      {/* Code Export Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.bgSurface }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Generated Code & Export Presets</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('tsx')}><Text style={styles.presetBtnText}>React Native (.tsx)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('kotlin')}><Text style={styles.presetBtnText}>Compose (.kt)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('svg')}><Text style={styles.presetBtnText}>SVG Vector (.svg)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('cssinjs')}><Text style={styles.presetBtnText}>CSS-in-JS</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('json')}><Text style={styles.presetBtnText}>JSON AST</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('test')}><Text style={styles.presetBtnText}>Jest Spec (.test.tsx)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('cicd')}><Text style={styles.presetBtnText}>CI/CD (.yml)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('store')}><Text style={styles.presetBtnText}>Play Store Spec</Text></TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => handleExport('droidui')}><Text style={styles.presetBtnText}>.dui Package</Text></TouchableOpacity>
            </View>
            <ScrollView style={[styles.codeScroll, { backgroundColor: isLightMode ? '#101A36' : '#1e293b' }]}>
              <Text style={[styles.codeText, { color: isLightMode ? '#0284c7' : '#38E8F2' }]}>{codeOutput}</Text>
            </ScrollView>
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {floatingPanels.map((panel, index) => <FloatingToolWindow key={panel} visible title={panel === 'templates' ? 'Template Library' : panel === 'inspector' ? 'Design Inspector' : 'Creative Toolbox'} subtitle="Drag this title bar to reposition • Multiple windows can stay open" offset={index} onClose={() => setFloatingPanels(current => current.filter(item => item !== panel))}>
        {panel === 'templates' ? <TemplateLibrary /> : panel === 'inspector' ? <PropertyInspector /> : <ComponentToolbar />}
      </FloatingToolWindow>)}
      {showBrandSplash && <BrandSplash progress={bootProgress} status={bootStatus} onFinish={() => setShowBrandSplash(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: { flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', paddingHorizontal: 10, paddingTop: 7, paddingBottom: 5, borderBottomWidth: 1, gap: 5 },
  brandGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  logoTitle: { fontSize: 15, fontWeight: 'bold' },
  projectBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  projectBadgeText: { fontSize: 10, fontWeight: 'bold' },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 8 },
  themeToggleBtn: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  themeToggleText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  navBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  navBtnText: { fontSize: 11, fontWeight: 'bold' },
  exportBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  exportBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  workspace: { flex: 1, flexDirection: 'column' },
  canvasArea: { flex: 1, minHeight: 180, padding: 8, alignItems: 'center' },
  deviceFrame: { borderWidth: 2, borderRadius: 24, padding: 12, alignSelf: 'center', shadowColor: '#000', shadowRadius: 10 },
  deviceNotch: { width: 60, height: 6, borderRadius: 3, alignSelf: 'center', marginBottom: 8 },
  panelArea: { height: 318, flexShrink: 0, borderTopWidth: 1 },
  workspaceDock: { height: 54, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-around', borderBottomWidth: 1, backgroundColor: '#0D1730' },
  dockItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, borderTopWidth: 2, borderTopColor: 'transparent' },
  dockItemActive: { borderTopColor: '#398BFF', backgroundColor: '#132343' },
  dockIcon: { fontSize: 17, fontWeight: '900' },
  dockLabel: { fontSize: 9, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { padding: 16, borderRadius: 12, maxHeight: '80%' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  codeScroll: { padding: 12, borderRadius: 8 },
  codeText: { fontFamily: 'monospace', fontSize: 12 },
  closeBtn: { marginTop: 12, padding: 10, borderRadius: 6, alignItems: 'center' },
  closeBtnText: { color: '#ffffff', fontWeight: 'bold' },
  presetBtn: { backgroundColor: '#111B35', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 4 },
  presetBtnText: { color: '#38E8F2', fontSize: 10, fontWeight: 'bold' },
});
