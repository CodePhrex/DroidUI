import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { THEMES, ThemePalette, ThemeMode } from '../theme/themeConfig';

export const ThemeExportImportStudio = () => {
  const { currentTheme, setTheme } = useEditorStore();
  const activePalette = THEMES[currentTheme] || THEMES.dark;

  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [customPrimary, setCustomPrimary] = useState(activePalette.primary);

  const themeExportJSON = JSON.stringify(
    {
      name: activePalette.name,
      tokens: {
        bgCanvas: activePalette.bgCanvas,
        bgSurface: activePalette.bgSurface,
        primary: customPrimary || activePalette.primary,
        secondary: activePalette.secondary,
        textPrimary: activePalette.textPrimary,
        textSecondary: activePalette.textSecondary,
        border: activePalette.border,
        accent: activePalette.accent,
      },
    },
    null,
    2
  );

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.tokens && parsed.tokens.primary && parsed.tokens.bgCanvas) {
        // Update live theme tokens
        activePalette.bgCanvas = parsed.tokens.bgCanvas;
        activePalette.bgSurface = parsed.tokens.bgSurface || activePalette.bgSurface;
        activePalette.primary = parsed.tokens.primary;
        activePalette.accent = parsed.tokens.accent || activePalette.accent;
        Alert.alert('Theme Imported', `Successfully applied custom theme: "${parsed.name || 'Custom Theme'}"`);
      } else {
        Alert.alert('Import Failed', 'Invalid theme payload format. Ensure JSON contains token colors.');
      }
    } catch (e) {
      Alert.alert('JSON Error', 'Failed to parse theme JSON syntax.');
    }
  };

  const presetPalettes: Array<{ id: ThemeMode; name: string; primary: string; bg: string }> = [
    { id: 'dark', name: 'Dark Studio', primary: '#3b82f6', bg: '#0f172a' },
    { id: 'light', name: 'Clean Light', primary: '#2563eb', bg: '#f8fafc' },
    { id: 'material_you', name: 'Material You', primary: '#d0bcff', bg: '#1c1b1f' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', primary: '#ff0055', bg: '#05050d' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Theme Export & Import Studio</Text>
      <Text style={styles.subtitle}>Share custom design system palettes & component styling</Text>

      {/* Preset Palettes Quick Switch */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built-In Palette Presets</Text>
        <View style={styles.presetGrid}>
          {presetPalettes.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.presetCard, currentTheme === p.id && styles.activePresetCard]}
              onPress={() => setTheme(p.id)}
            >
              <View style={styles.colorDotRow}>
                <View style={[styles.colorDot, { backgroundColor: p.bg }]} />
                <View style={[styles.colorDot, { backgroundColor: p.primary }]} />
              </View>
              <Text style={styles.presetName}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Token Color Editor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fine-Tune Primary Hex Token</Text>
        <View style={styles.colorRow}>
          <TextInput
            style={styles.hexInput}
            value={customPrimary}
            onChangeText={setCustomPrimary}
            placeholder="#3b82f6"
          />
          <View style={[styles.previewSwatch, { backgroundColor: customPrimary || activePalette.primary }]} />
        </View>
      </View>

      {/* Export Theme JSON */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Export Theme JSON</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : '📋 Copy JSON'}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.jsonBox}
          multiline={true}
          editable={false}
          value={themeExportJSON}
        />
      </View>

      {/* Import Theme JSON */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Import Theme Payload</Text>
        <TextInput
          style={styles.importInput}
          multiline={true}
          placeholder="Paste theme JSON object here..."
          value={importText}
          onChangeText={setImportText}
        />
        <TouchableOpacity style={styles.applyBtn} onPress={handleApplyImport}>
          <Text style={styles.applyBtnText}>⚡ Apply Custom Theme Payload</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc' },
  subtitle: { fontSize: 11, color: '#94a3b8', marginBottom: 12 },
  section: { marginBottom: 16, backgroundColor: '#0f172a', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#38bdf8', marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  presetCard: { backgroundColor: '#1e293b', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#475569', width: '48%' },
  activePresetCard: { borderColor: '#3b82f6', borderWidth: 2 },
  colorDotRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  colorDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#fff' },
  presetName: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
  colorRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  hexInput: { flex: 1, backgroundColor: '#1e293b', color: '#fff', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#475569', fontFamily: 'monospace' },
  previewSwatch: { width: 36, height: 36, borderRadius: 6, borderWidth: 1, borderColor: '#fff' },
  copyBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  copyBtnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  jsonBox: { backgroundColor: '#1e293b', color: '#38bdf8', padding: 8, borderRadius: 6, fontFamily: 'monospace', fontSize: 10, height: 100 },
  importInput: { backgroundColor: '#1e293b', color: '#fff', padding: 8, borderRadius: 6, fontFamily: 'monospace', fontSize: 10, height: 80, marginBottom: 8 },
  applyBtn: { backgroundColor: '#10b981', padding: 10, borderRadius: 6, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
});
