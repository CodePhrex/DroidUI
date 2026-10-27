import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import {
  AndroidExportConfig,
  defaultConfig,
  generateAppBuildGradleKts,
  generateSettingsGradleKts,
  generateFullProjectFileTree,
  FrameworkTarget,
  GradleDSL,
  TargetSDK,
  MinSDK,
  ABIFilter
} from '../compiler/androidProjectExporter';

export const AndroidProjectExportStudio = () => {
  const { rootNode } = useEditorStore();
  const [config, setConfig] = useState<AndroidExportConfig>(defaultConfig);
  const [activePreviewTab, setActivePreviewTab] = useState<'tree' | 'gradle' | 'settings'>('tree');
  const [copied, setCopied] = useState(false);

  const getPreviewText = () => {
    switch (activePreviewTab) {
      case 'tree':
        return generateFullProjectFileTree(rootNode, config);
      case 'gradle':
        return generateAppBuildGradleKts(config);
      case 'settings':
        return generateSettingsGradleKts(config);
      default:
        return generateFullProjectFileTree(rootNode, config);
    }
  };

  const textToCopy = getPreviewText();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Android Project & Environment Exporter</Text>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : '📋 Copy Spec'}</Text>
        </TouchableOpacity>
      </View>

      {/* Package & App Name Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Project Identity & Namespace</Text>
        <View style={styles.inputRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>App Title:</Text>
            <TextInput
              style={styles.textInput}
              value={config.appName}
              onChangeText={(txt) => setConfig({ ...config, appName: txt })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Package Name:</Text>
            <TextInput
              style={styles.textInput}
              value={config.packageName}
              onChangeText={(txt) => setConfig({ ...config, packageName: txt })}
            />
          </View>
        </View>
      </View>

      {/* Target UI Framework */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Target Android UI Framework</Text>
        <View style={styles.chipGrid}>
          {[
            { id: 'compose', label: 'Jetpack Compose', desc: 'Material3 Kotlin' },
            { id: 'xml_native', label: 'XML Layout Views', desc: 'ConstraintLayout' },
            { id: 'react_native_module', label: 'React Native Module', desc: 'ReactPackage' },
            { id: 'flutter_widget', label: 'Flutter Package', desc: 'StatelessWidget' },
          ].map((fw) => (
            <TouchableOpacity
              key={fw.id}
              style={[styles.chip, config.framework === fw.id && styles.activeChip]}
              onPress={() => setConfig({ ...config, framework: fw.id as FrameworkTarget })}
            >
              <Text style={[styles.chipText, config.framework === fw.id && styles.activeChipText]}>{fw.label}</Text>
              <Text style={styles.chipSubText}>{fw.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Android SDK & Build System Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Build System & SDK Compatibility</Text>
        <Text style={styles.subLabel}>Target SDK Level:</Text>
        <View style={styles.row}>
          {[35, 34, 33].map((sdk) => (
            <TouchableOpacity
              key={sdk}
              style={[styles.smallChip, config.targetSdk === sdk && styles.activeChip]}
              onPress={() => setConfig({ ...config, targetSdk: sdk as TargetSDK })}
            >
              <Text style={styles.smallChipText}>Android {sdk === 35 ? '15 (SDK 35)' : sdk === 34 ? '14 (SDK 34)' : '13 (SDK 33)'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subLabel, { marginTop: 8 }]}>Minimum Supported SDK:</Text>
        <View style={styles.row}>
          {[21, 24, 26].map((sdk) => (
            <TouchableOpacity
              key={sdk}
              style={[styles.smallChip, config.minSdk === sdk && styles.activeChip]}
              onPress={() => setConfig({ ...config, minSdk: sdk as MinSDK })}
            >
              <Text style={styles.smallChipText}>{sdk === 21 ? 'API 21 (Lollipop)' : sdk === 24 ? 'API 24 (Nougat)' : 'API 26 (Oreo)'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CPU Architectures & ABI Filters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Hardware CPU Architectures (ABI Filters)</Text>
        <View style={styles.chipGrid}>
          {[
            { id: 'all', label: 'Universal (All ABIs)' },
            { id: 'arm64-v8a', label: 'arm64-v8a (64-bit ARM)' },
            { id: 'armeabi-v7a', label: 'armeabi-v7a (32-bit ARM)' },
            { id: 'x86_64', label: 'x86_64 (Intel Emulator)' },
          ].map((abi) => (
            <TouchableOpacity
              key={abi.id}
              style={[styles.smallChip, config.abiFilter === abi.id && styles.activeChip]}
              onPress={() => setConfig({ ...config, abiFilter: abi.id as ABIFilter })}
            >
              <Text style={styles.smallChipText}>{abi.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, config.enableFlavors && styles.activeToggle]}
            onPress={() => setConfig({ ...config, enableFlavors: !config.enableFlavors })}
          >
            <Text style={styles.toggleText}>{config.enableFlavors ? '✓ Build Flavors (dev, staging, prod)' : '✗ Single Build Variant'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, config.enableABISplit && styles.activeToggle]}
            onPress={() => setConfig({ ...config, enableABISplit: !config.enableABISplit })}
          >
            <Text style={styles.toggleText}>{config.enableABISplit ? '✓ ABI Splits Enabled' : '✗ Single APK Output'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Code Preview Tabs */}
      <View style={styles.section}>
        <View style={styles.previewTabRow}>
          <TouchableOpacity
            style={[styles.previewTab, activePreviewTab === 'tree' && styles.activePreviewTab]}
            onPress={() => setActivePreviewTab('tree')}
          >
            <Text style={styles.previewTabText}>📂 File Tree</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.previewTab, activePreviewTab === 'gradle' && styles.activePreviewTab]}
            onPress={() => setActivePreviewTab('gradle')}
          >
            <Text style={styles.previewTabText}>📄 build.gradle.kts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.previewTab, activePreviewTab === 'settings' && styles.activePreviewTab]}
            onPress={() => setActivePreviewTab('settings')}
          >
            <Text style={styles.previewTabText}>⚙️ settings.gradle.kts</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.codeBox}>
          <Text style={styles.codeText}>{textToCopy}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  copyBtn: { backgroundColor: '#2563eb', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  copyBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  section: { marginBottom: 16, backgroundColor: '#0f172a', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#38bdf8', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 8 },
  inputLabel: { color: '#94a3b8', fontSize: 10, marginBottom: 4 },
  textInput: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#475569', fontSize: 12 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155', minWidth: '47%' },
  activeChip: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  chipText: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold' },
  activeChipText: { color: '#ffffff' },
  chipSubText: { color: '#94a3b8', fontSize: 10, marginTop: 2 },
  subLabel: { color: '#cbd5e1', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 6 },
  smallChip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  smallChipText: { color: '#f8fafc', fontSize: 11, fontWeight: '600' },
  toggleRow: { flexDirection: 'column', gap: 6, marginTop: 10 },
  toggleBtn: { backgroundColor: '#1e293b', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  activeToggle: { borderColor: '#10b981', backgroundColor: '#064e3b' },
  toggleText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
  previewTabRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  previewTab: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  activePreviewTab: { backgroundColor: '#3b82f6' },
  previewTabText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
  codeBox: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8, maxHeight: 200 },
  codeText: { color: '#38bdf8', fontFamily: 'monospace', fontSize: 11 },
});
