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
import React, { useState } from 'react';
import { IconGalleryStudio } from './src/components/IconGalleryStudio';
import { DeviceDetectionStudio } from './src/components/DeviceDetectionStudio';
import { detectCurrentDeviceProfile } from './src/device/deviceProfile';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useEditorStore } from './src/store/useEditorStore';
import { CanvasRenderer } from './src/components/CanvasRenderer';
import { PropertyInspector } from './src/components/PropertyInspector';
import { LayerReorderManager } from './src/components/LayerReorderManager';
import { TemplateLibrary } from './src/templates/TemplateLibrary';
import { ThemeManager } from './src/components/ThemeManager';
import { DesignSystemStudio } from './src/components/DesignSystemStudio';
import { BrandMark, BrandSplash } from './src/components/DroidUIBrand';
import { ProjectManager } from './src/components/ProjectManager';
import { AssetPickerStudio } from './src/components/AssetPickerStudio';
import { ViewportSelector, VIEWPORTS, ViewportMode } from './src/components/ViewportSelector';
import { ComponentSearchFilter } from './src/components/ComponentSearchFilter';
import { LiveCodePreview } from './src/components/LiveCodePreview';
import { FontLibraryStudio } from './src/components/FontLibraryStudio';
import { ComponentToolbar } from './src/components/ComponentToolbar';
import { PropertyPresetsStudio } from './src/components/PropertyPresetsStudio';
import { ThemeExportImportStudio } from './src/components/ThemeExportImportStudio';
import { SpacingAlignmentStudio } from './src/components/SpacingAlignmentStudio';
import { PressStateStudio } from './src/components/PressStateStudio';
import { AccessibilityStudio } from './src/components/AccessibilityStudio';
import { LocalizationStudio } from './src/components/LocalizationStudio';
import { PerformanceProfilerStudio } from './src/components/PerformanceProfilerStudio';
import { THEMES } from './src/theme/themeConfig';
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
    saveCurrentProject,
    undo,
    redo
  } = useEditorStore();

  const theme = THEMES[currentTheme] || THEMES.dark;
  const isLightMode = currentTheme === 'light';

  const [activeTab, setActiveTab] = useState<'inspector' | 'deeplink' | 'release' | 'droid_file' | 'svg_importer' | 'store' | 'export_android' | 'splash' | 'sounds' | 'transitions' | 'assets' | 'templates' | 'cicd' | 'tests' | 'profiler' | 'i18n' | 'accessibility' | 'states' | 'spacing' | 'presets' | 'code' | 'font' | 'search' | 'assets' | 'projects' | 'layers' | 'theme' | 'theme_io' | 'design_system' | 'icons' | 'device'>('inspector');
  const [activeViewport, setActiveViewport] = useState<ViewportMode>('galaxy_s24_ultra');
  const [modalVisible, setModalVisible] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [showBrandSplash, setShowBrandSplash] = useState(true);

  const currentVP = activeViewport === 'detected_device' ? detectCurrentDeviceProfile().viewport : (VIEWPORTS[activeViewport as Exclude<ViewportMode, 'detected_device'>] || VIEWPORTS.galaxy_s24_ultra);

  const handleSaveProject = async () => {
    try {
      await saveCurrentProject(currentProjectName);
      Alert.alert('Project Saved', `\"${currentProjectName}\" was saved on this device.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert('Save Failed', message);
    }
  };

  const toggleThemeMode = () => {
    setTheme(isLightMode ? 'dark' : 'light');
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

        <View style={styles.navActions}>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: isLightMode ? '#E5EDFF' : '#111B35' }]} onPress={() => setActiveTab('projects')}>
            <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>📂 Open</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: isLightMode ? '#E5EDFF' : '#111B35' }]} onPress={handleSaveProject}>
            <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>💾 Save</Text>
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
        </View>
      </View>

      {/* Main Studio Workspace Area */}
      <View style={styles.workspace}>
        {/* Quick Add Component Toolbar */}
        <ComponentToolbar />

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

        {/* Studio Panel Tabs */}
        <View style={[styles.panelArea, { backgroundColor: theme.bgSurface, borderColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.tabScroll, { borderColor: theme.border }]}>
            <TouchableOpacity style={[styles.tab, activeTab === 'deeplink' && styles.activeTab]} onPress={() => setActiveTab('deeplink')}>
              <Text style={[styles.tabText, { color: activeTab === 'deeplink' ? theme.primary : theme.textSecondary }]}>🔗 Deep Links & Icons</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'icons' && styles.activeTab]} onPress={() => setActiveTab('icons')}><Text style={[styles.tabText, { color: activeTab === 'icons' ? theme.primary : theme.textSecondary }]}>✣ Icon Gallery</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'device' && styles.activeTab]} onPress={() => setActiveTab('device')}><Text style={[styles.tabText, { color: activeTab === 'device' ? theme.primary : theme.textSecondary }]}>▣ Detect Device</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'inspector' && styles.activeTab]} onPress={() => setActiveTab('inspector')}>
              <Text style={[styles.tabText, { color: activeTab === 'inspector' ? theme.primary : theme.textSecondary }]}>🎨 Inspector</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'release' && styles.activeTab]} onPress={() => setActiveTab('release')}>
              <Text style={[styles.tabText, { color: activeTab === 'release' ? theme.primary : theme.textSecondary }]}>🏷️ Release & Tagging</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'droid_file' && styles.activeTab]} onPress={() => setActiveTab('droid_file')}>
              <Text style={[styles.tabText, { color: activeTab === 'droid_file' ? theme.primary : theme.textSecondary }]}>💾 .dui Files</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'svg_importer' && styles.activeTab]} onPress={() => setActiveTab('svg_importer')}>
              <Text style={[styles.tabText, { color: activeTab === 'svg_importer' ? theme.primary : theme.textSecondary }]}>📐 SVG Studio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'store' && styles.activeTab]} onPress={() => setActiveTab('store')}>
              <Text style={[styles.tabText, { color: activeTab === 'store' ? theme.primary : theme.textSecondary }]}>🛍️ Play Store & Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'export_android' && styles.activeTab]} onPress={() => setActiveTab('export_android')}>
              <Text style={[styles.tabText, { color: activeTab === 'export_android' ? theme.primary : theme.textSecondary }]}>📦 Android Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'splash' && styles.activeTab]} onPress={() => setActiveTab('splash')}>
              <Text style={[styles.tabText, { color: activeTab === 'splash' ? theme.primary : theme.textSecondary }]}>🚀 Splash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'sounds' && styles.activeTab]} onPress={() => setActiveTab('sounds')}>
              <Text style={[styles.tabText, { color: activeTab === 'sounds' ? theme.primary : theme.textSecondary }]}>🔊 Sounds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'transitions' && styles.activeTab]} onPress={() => setActiveTab('transitions')}>
              <Text style={[styles.tabText, { color: activeTab === 'transitions' ? theme.primary : theme.textSecondary }]}>🎭 Transitions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'assets' && styles.activeTab]} onPress={() => setActiveTab('assets')}>
              <Text style={[styles.tabText, { color: activeTab === 'assets' ? theme.primary : theme.textSecondary }]}>🖼️ Assets & Icons</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'templates' && styles.activeTab]} onPress={() => setActiveTab('templates')}>
              <Text style={[styles.tabText, { color: activeTab === 'templates' ? theme.primary : theme.textSecondary }]}>📑 Templates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'cicd' && styles.activeTab]} onPress={() => setActiveTab('cicd')}>
              <Text style={[styles.tabText, { color: activeTab === 'cicd' ? theme.primary : theme.textSecondary }]}>🚀 CI/CD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'tests' && styles.activeTab]} onPress={() => setActiveTab('tests')}>
              <Text style={[styles.tabText, { color: activeTab === 'tests' ? theme.primary : theme.textSecondary }]}>🧪 Tests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'profiler' && styles.activeTab]} onPress={() => setActiveTab('profiler')}>
              <Text style={[styles.tabText, { color: activeTab === 'profiler' ? theme.primary : theme.textSecondary }]}>📊 Profiler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'i18n' && styles.activeTab]} onPress={() => setActiveTab('i18n')}>
              <Text style={[styles.tabText, { color: activeTab === 'i18n' ? theme.primary : theme.textSecondary }]}>🌐 i18n</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'accessibility' && styles.activeTab]} onPress={() => setActiveTab('accessibility')}>
              <Text style={[styles.tabText, { color: activeTab === 'accessibility' ? theme.primary : theme.textSecondary }]}>♿ Accessibility</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'states' && styles.activeTab]} onPress={() => setActiveTab('states')}>
              <Text style={[styles.tabText, { color: activeTab === 'states' ? theme.primary : theme.textSecondary }]}>⚡ States</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'spacing' && styles.activeTab]} onPress={() => setActiveTab('spacing')}>
              <Text style={[styles.tabText, { color: activeTab === 'spacing' ? theme.primary : theme.textSecondary }]}>📐 Spacing & Grid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'presets' && styles.activeTab]} onPress={() => setActiveTab('presets')}>
              <Text style={[styles.tabText, { color: activeTab === 'presets' ? theme.primary : theme.textSecondary }]}>🎨 Presets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'theme_io' && styles.activeTab]} onPress={() => setActiveTab('theme_io')}>
              <Text style={[styles.tabText, { color: activeTab === 'theme_io' ? theme.primary : theme.textSecondary }]}>⇄ Theme I/O</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'font' && styles.activeTab]} onPress={() => setActiveTab('font')}>
              <Text style={[styles.tabText, { color: activeTab === 'font' ? theme.primary : theme.textSecondary }]}>🔤 Font</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'code' && styles.activeTab]} onPress={() => setActiveTab('code')}>
              <Text style={[styles.tabText, { color: activeTab === 'code' ? theme.primary : theme.textSecondary }]}>💻 Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'search' && styles.activeTab]} onPress={() => setActiveTab('search')}>
              <Text style={[styles.tabText, { color: activeTab === 'search' ? theme.primary : theme.textSecondary }]}>🔍 Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'projects' && styles.activeTab]} onPress={() => setActiveTab('projects')}>
              <Text style={[styles.tabText, { color: activeTab === 'projects' ? theme.primary : theme.textSecondary }]}>📁 Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'layers' && styles.activeTab]} onPress={() => setActiveTab('layers')}>
              <Text style={[styles.tabText, { color: activeTab === 'layers' ? theme.primary : theme.textSecondary }]}>🥞 Layers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'theme' && styles.activeTab]} onPress={() => setActiveTab('theme')}>
              <Text style={[styles.tabText, { color: activeTab === 'theme' ? theme.primary : theme.textSecondary }]}>⚙️ Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'design_system' && styles.activeTab]} onPress={() => setActiveTab('design_system')}>
              <Text style={[styles.tabText, { color: activeTab === 'design_system' ? theme.primary : theme.textSecondary }]}>🎨 Design System</Text>
            </TouchableOpacity>
          </ScrollView>

          {activeTab === 'icons' && <IconGalleryStudio />}
          {activeTab === 'device' && <DeviceDetectionStudio onDetected={() => setActiveViewport('detected_device')} />}
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
          {activeTab === 'design_system' && <DesignSystemStudio />}
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
      {showBrandSplash && <BrandSplash onFinish={() => setShowBrandSplash(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: { flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#263B68', gap: 9 },
  brandGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%' },
  logoTitle: { fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
  projectBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#263B68' },
  projectBadgeText: { fontSize: 10, fontWeight: 'bold' },
  navActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 6, width: '100%' },
  themeToggleBtn: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  themeToggleText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  navBtn: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 9, borderWidth: 1, borderColor: '#263B68' },
  navBtnText: { fontSize: 11, fontWeight: 'bold' },
  exportBtn: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 9, shadowColor: '#38E8F2', shadowOpacity: 0.18, shadowRadius: 8, elevation: 3 },
  exportBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  workspace: { flex: 1, flexDirection: 'column' },
  canvasArea: { flex: 1, padding: 12, alignItems: 'center' },
  deviceFrame: { borderWidth: 2, borderRadius: 24, padding: 12, alignSelf: 'center', shadowColor: '#000', shadowRadius: 10 },
  deviceNotch: { width: 60, height: 6, borderRadius: 3, alignSelf: 'center', marginBottom: 8 },
  panelArea: { flex: 1, borderTopWidth: 1, borderTopColor: '#263B68' },
  tabScroll: { borderBottomWidth: 1, maxHeight: 42 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#38E8F2', backgroundColor: 'rgba(56,232,242,0.07)' },
  tabText: { fontSize: 11, fontWeight: 'bold' },
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
