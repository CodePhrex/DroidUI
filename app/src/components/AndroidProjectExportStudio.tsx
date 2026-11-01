import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useEditorStore } from '../store/useEditorStore';
import { AndroidExportConfig, defaultConfig, FrameworkTarget, TargetSDK, MinSDK, ABIFilter } from '../compiler/androidProjectExporter';
import { generateAndroidProjectBundle, serializeAndroidProjectBundle } from '../compiler/androidProjectBundle';

export const AndroidProjectExportStudio = () => {
  const { rootNode } = useEditorStore();
  const [config, setConfig] = useState<AndroidExportConfig>({ ...defaultConfig });
  const [selectedPath, setSelectedPath] = useState('app/src/main/java/com/droidstudio/app/MainActivity.kt');
  const [copied, setCopied] = useState(false);
  const bundle = useMemo(() => generateAndroidProjectBundle(rootNode, config), [rootNode, config]);
  const selectedFile = bundle.files.find((file) => file.path === selectedPath) || bundle.files[0];
  const hasErrors = bundle.diagnostics.some((item) => item.severity === 'error');

  const copyBundle = async () => {
    if (hasErrors || bundle.files.length === 0) {
      Alert.alert('Export blocked', 'Resolve the generation errors before copying the Android project bundle.');
      return;
    }
    await Clipboard.setStringAsync(serializeAndroidProjectBundle(bundle));
    setCopied(true);
    Alert.alert('Project bundle copied', 'The generated project manifest and all source files are on your clipboard as JSON. Save it as a .json file or transfer it to your development environment.');
  };

  const copySelectedFile = async () => {
    if (!selectedFile) return;
    await Clipboard.setStringAsync(selectedFile.content);
    Alert.alert('File copied', selectedFile.path);
  };

  const updateConfig = <K extends keyof AndroidExportConfig>(key: K, value: AndroidExportConfig[K]) =>
    setConfig((current) => ({ ...current, [key]: value }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Native Android Project Generator</Text>
          <Text style={styles.subtitle}>Generate a source project from the current component tree.</Text>
        </View>
        <View style={[styles.status, hasErrors ? styles.statusError : styles.statusReady]}>
          <Text style={styles.statusText}>{hasErrors ? 'Needs attention' : 'Generation ready'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project identity</Text>
        <Text style={styles.label}>Application name</Text>
        <TextInput style={styles.input} value={config.appName} onChangeText={(value) => updateConfig('appName', value)} />
        <Text style={styles.label}>Android package name</Text>
        <TextInput autoCapitalize="none" style={styles.input} value={config.packageName} onChangeText={(value) => updateConfig('packageName', value)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generation target</Text>
        <View style={styles.frameworkActive}>
          <Text style={styles.frameworkTitle}>Jetpack Compose · Kotlin</Text>
          <Text style={styles.muted}>Supported native Android target</Text>
        </View>
        <Text style={styles.label}>Other targets</Text>
        <Text style={styles.muted}>XML Views, React Native modules, and Flutter exports are not enabled until their generators and validation gates are implemented.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Android SDK configuration</Text>
        <Text style={styles.label}>Target SDK</Text>
        <View style={styles.chips}>
          {([35, 34, 33] as TargetSDK[]).map((sdk) => (
            <TouchableOpacity key={sdk} style={[styles.chip, config.targetSdk === sdk && styles.chipActive]} onPress={() => updateConfig('targetSdk', sdk)}>
              <Text style={styles.chipText}>API {sdk}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Minimum SDK</Text>
        <View style={styles.chips}>
          {([21, 24, 26] as MinSDK[]).map((sdk) => (
            <TouchableOpacity key={sdk} style={[styles.chip, config.minSdk === sdk && styles.chipActive]} onPress={() => updateConfig('minSdk', sdk)}>
              <Text style={styles.chipText}>API {sdk}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>ABI filter</Text>
        <View style={styles.chips}>
          {(['all', 'arm64-v8a', 'armeabi-v7a', 'x86_64'] as ABIFilter[]).map((abi) => (
            <TouchableOpacity key={abi} style={[styles.chip, config.abiFilter === abi && styles.chipActive]} onPress={() => updateConfig('abiFilter', abi)}>
              <Text style={styles.chipText}>{abi === 'all' ? 'Universal' : abi}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Generated project files</Text>
          <Text style={styles.count}>{bundle.files.length} files</Text>
        </View>
        {bundle.files.map((file) => (
          <TouchableOpacity key={file.path} style={[styles.fileRow, selectedFile?.path === file.path && styles.fileSelected]} onPress={() => setSelectedPath(file.path)}>
            <Text style={styles.fileName}>{file.path}</Text>
            <Text style={styles.fileAction}>{selectedFile?.path === file.path ? 'Selected' : 'View'}</Text>
          </TouchableOpacity>
        ))}
        {selectedFile ? (
          <View style={styles.preview}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewPath}>{selectedFile.path}</Text>
              <TouchableOpacity onPress={copySelectedFile} style={styles.copySmall}><Text style={styles.copySmallText}>Copy file</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal style={styles.codeScroll}>
              <Text selectable style={styles.code}>{selectedFile.content}</Text>
            </ScrollView>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generation inspection</Text>
        {bundle.diagnostics.length === 0 ? <Text style={styles.success}>No generation diagnostics.</Text> : bundle.diagnostics.map((item, index) => (
          <View key={item.code + index} style={styles.diagnostic}>
            <Text style={item.severity === 'error' ? styles.error : styles.warning}>{item.severity.toUpperCase()} · {item.code}</Text>
            <Text style={styles.diagnosticMessage}>{item.message}{item.nodeId ? ` (node: ${item.nodeId})` : ''}</Text>
          </View>
        ))}
        <Text style={styles.note}>This exports source files as a JSON project bundle. It does not build or certify an APK; Android build verification belongs to Phase 2F.</Text>
        <TouchableOpacity disabled={hasErrors || bundle.files.length === 0} style={[styles.exportButton, (hasErrors || bundle.files.length === 0) && styles.exportDisabled]} onPress={copyBundle}>
          <Text style={styles.exportText}>{copied ? '✓ Bundle copied' : 'Copy complete Android project bundle'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 12, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  headerCopy: { flex: 1 },
  title: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  subtitle: { color: '#94a3b8', fontSize: 11, marginTop: 4 },
  status: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  statusReady: { backgroundColor: '#064e3b' },
  statusError: { backgroundColor: '#7f1d1d' },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  section: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  sectionTitle: { color: '#38bdf8', fontSize: 13, fontWeight: '800', marginBottom: 9 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { color: '#94a3b8', fontSize: 10 },
  label: { color: '#cbd5e1', fontSize: 11, marginTop: 8, marginBottom: 5 },
  input: { color: '#f8fafc', backgroundColor: '#1e293b', borderColor: '#475569', borderWidth: 1, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 8, fontSize: 12 },
  frameworkActive: { borderWidth: 1, borderColor: '#2563eb', backgroundColor: '#172554', borderRadius: 8, padding: 10 },
  frameworkTitle: { color: '#fff', fontSize: 12, fontWeight: '700' },
  muted: { color: '#94a3b8', fontSize: 10, lineHeight: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1e293b', borderColor: '#475569', borderWidth: 1, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 7 },
  chipActive: { backgroundColor: '#1d4ed8', borderColor: '#60a5fa' },
  chipText: { color: '#f8fafc', fontSize: 10, fontWeight: '600' },
  fileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 7, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  fileSelected: { backgroundColor: '#172554', borderRadius: 5 },
  fileName: { color: '#cbd5e1', fontSize: 10, flex: 1 },
  fileAction: { color: '#60a5fa', fontSize: 10, fontWeight: '700' },
  preview: { backgroundColor: '#020617', borderRadius: 8, marginTop: 10, overflow: 'hidden' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8 },
  previewPath: { color: '#94a3b8', fontSize: 9, flex: 1 },
  copySmall: { backgroundColor: '#1e40af', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 5 },
  copySmallText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  codeScroll: { maxHeight: 240, padding: 10 },
  code: { color: '#7dd3fc', fontSize: 10, fontFamily: 'monospace' },
  success: { color: '#86efac', fontSize: 11 },
  diagnostic: { paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  error: { color: '#fca5a5', fontSize: 10, fontWeight: '800' },
  warning: { color: '#fcd34d', fontSize: 10, fontWeight: '800' },
  diagnosticMessage: { color: '#cbd5e1', fontSize: 10, marginTop: 3, lineHeight: 15 },
  note: { color: '#94a3b8', fontSize: 10, lineHeight: 15, marginTop: 10 },
  exportButton: { backgroundColor: '#2563eb', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 10 },
  exportDisabled: { opacity: 0.4 },
  exportText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
