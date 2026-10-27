import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';

export interface SvgPresetItem {
  id: string;
  name: string;
  category: string;
  svgXml: string;
  defaultColor: string;
  iconSymbol: string;
}

export const SVG_PRESETS: SvgPresetItem[] = [
  {
    id: 'android_mascot',
    name: 'Android Bot Mascot',
    category: 'Branding',
    iconSymbol: '🤖',
    defaultColor: '#a4c639',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#a4c639" d="M6 18c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9H6v9zM7 3.5L5.4 1.9 4 3.3l1.8 1.8C4.7 6.1 4 7.5 4 9h16c0-1.5-.7-2.9-1.8-3.9L20 3.3l-1.4-1.4L17 3.5C15.6 2.6 13.9 2 12 2s-3.6.6-5 1.5z"/></svg>'
  },
  {
    id: 'star_sparkle',
    name: 'Star Rating Sparkle',
    category: 'Symbols',
    iconSymbol: '⭐',
    defaultColor: '#f59e0b',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#f59e0b" d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>'
  },
  {
    id: 'shield_security',
    name: 'Shield Security Vault',
    category: 'Security',
    iconSymbol: '🛡️',
    defaultColor: '#10b981',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#10b981" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>'
  },
  {
    id: 'cyber_ring',
    name: 'Cyber Ring Progress',
    category: 'Analytics',
    iconSymbol: '⭕',
    defaultColor: '#38bdf8',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="40 10"/></svg>'
  },
  {
    id: 'analytics_wave',
    name: 'Analytics Line Wave',
    category: 'Analytics',
    iconSymbol: '📈',
    defaultColor: '#8b5cf6',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="#8b5cf6" stroke-width="2.5" d="M3.5 18.5l6-6 4 4 7-7"/><circle cx="20.5" cy="9.5" r="2.5" fill="#8b5cf6"/></svg>'
  },
  {
    id: 'search_magnifier',
    name: 'Search Glass Vector',
    category: 'Controls',
    iconSymbol: '🔍',
    defaultColor: '#38bdf8',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#38bdf8" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>'
  },
  {
    id: 'heart_favorite',
    name: 'Heart Favorite Emblem',
    category: 'Symbols',
    iconSymbol: '❤️',
    defaultColor: '#ef4444',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#ef4444" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
  },
  {
    id: 'bell_notification',
    name: 'Bell Notification Badge',
    category: 'Status',
    iconSymbol: '🔔',
    defaultColor: '#3b82f6',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#3b82f6" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>'
  },
  {
    id: 'shopping_cart',
    name: 'Shopping Cart Vector',
    category: 'Commerce',
    iconSymbol: '🛒',
    defaultColor: '#10b981',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#10b981" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z"/></svg>'
  },
  {
    id: 'gear_settings',
    name: 'Gear Settings Engine',
    category: 'Controls',
    iconSymbol: '⚙️',
    defaultColor: '#64748b',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#64748b" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'
  },
  {
    id: 'checkmark_circle',
    name: 'Checkmark Circle Badge',
    category: 'Status',
    iconSymbol: '✓',
    defaultColor: '#10b981',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#10b981"/><path fill="#ffffff" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>'
  },
  {
    id: 'flame_trend',
    name: 'Flame Trending Symbol',
    category: 'Status',
    iconSymbol: '🔥',
    defaultColor: '#f97316',
    svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#f97316" d="M13.5 1.5c-1.11 0-2.07.6-2.58 1.5C9.5 2.1 8 3.5 8 5.5c0 1.25.5 2.42 1.34 3.25C7.9 9.35 7 10.8 7 12.5c0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.7-.9-3.15-2.34-4.25C15.5 7.42 16 6.25 16 5c0-1.93-1.57-3.5-3.5-3.5zm-1.5 14c-1.65 0-3-1.35-3-3 0-1.12.61-2.1 1.54-2.62L12 9l1.46.88c.93.52 1.54 1.5 1.54 2.62 0 1.65-1.35 3-3 3z"/></svg>'
  }
];

export const SvgImporterStudio = () => {
  const { rootNode, selectedNodeId, addChildNode, updateProps, updateStyle } = useEditorStore();
  const targetParentId = selectedNodeId || rootNode.id;

  const [svgInput, setSvgInput] = useState<string>(SVG_PRESETS[0].svgXml);
  const [vectorName, setVectorName] = useState<string>('Android Bot Mascot');
  const [vectorColor, setVectorColor] = useState<string>('#a4c639');
  const [vectorSize, setVectorSize] = useState<number>(48);

  const handleSelectPreset = (preset: SvgPresetItem) => {
    setSvgInput(preset.svgXml);
    setVectorName(preset.name);
    setVectorColor(preset.defaultColor);
  };

  const handleInsertSvg = () => {
    const { rootNode, addChildNode } = useEditorStore.getState();
    const target = selectedNodeId || rootNode.id;

    // Use addChildNode to insert an SvgVector node
    const store = useEditorStore.getState();
    store.addChildNode(target, 'SvgVector');

    // Get the newly added node ID
    const updatedRoot = useEditorStore.getState().rootNode;
    const findLastAdded = (node: any): string | null => {
      if (node.type === 'SvgVector') return node.id;
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          const res = findLastAdded(node.children[i]);
          if (res) return res;
        }
      }
      return null;
    };

    const newId = findLastAdded(updatedRoot);
    if (newId) {
      store.updateProps(newId, {
        svgXml: svgInput,
        svgName: vectorName,
      });
      store.updateStyle(newId, {
        width: vectorSize,
        height: vectorSize,
        color: vectorColor,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SVG Vector Importer & Studio</Text>
        <Text style={styles.targetLabel}>Target Container: [{targetParentId}]</Text>
      </View>

      {/* Vector Name & Target Insertion */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Vector Name & Label</Text>
        <TextInput
          style={styles.input}
          value={vectorName}
          onChangeText={setVectorName}
          placeholder="Custom SVG Vector Asset Name"
          placeholderTextColor="#64748b"
        />
      </View>

      {/* Preset Vectors Library */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Built-in Vector Asset Presets</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
          {SVG_PRESETS.map((p) => (
            <TouchableOpacity key={p.id} style={styles.presetCard} onPress={() => handleSelectPreset(p)}>
              <Text style={styles.presetSymbol}>{p.iconSymbol}</Text>
              <Text style={styles.presetName}>{p.name}</Text>
              <Text style={styles.presetCategory}>{p.category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Custom Raw SVG XML Code Paste */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Raw SVG XML Code (Paste from Figma / XD / Sketch)</Text>
        <TextInput
          style={[styles.input, styles.xmlBox]}
          value={svgInput}
          onChangeText={setSvgInput}
          multiline={true}
          numberOfLines={5}
          placeholder="Paste <svg viewBox=...><path .../></svg> code here..."
          placeholderTextColor="#64748b"
        />
      </View>

      {/* Size & Color Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Dimensions & Color Tuning</Text>
        <View style={styles.row}>
          {[24, 32, 48, 64, 96].map((sz) => (
            <TouchableOpacity
              key={sz}
              style={[styles.sizeChip, vectorSize === sz && styles.activeChip]}
              onPress={() => setVectorSize(sz)}
            >
              <Text style={styles.chipText}>{sz}px</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
          {['#38bdf8', '#3b82f6', '#10b981', '#a4c639', '#8b5cf6', '#ef4444', '#f59e0b', '#ffffff'].map((col) => (
            <TouchableOpacity
              key={col}
              style={[styles.colorSwatch, { backgroundColor: col }, vectorColor === col && styles.activeSwatch]}
              onPress={() => setVectorColor(col)}
            />
          ))}
        </View>
      </View>

      {/* Insert Action */}
      <TouchableOpacity style={styles.insertBtn} onPress={handleInsertSvg}>
        <Text style={styles.insertBtnText}>➕ Insert SVG Vector into [{targetParentId}]</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: { marginBottom: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  targetLabel: { fontSize: 11, color: '#38bdf8', marginTop: 2 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 6 },
  input: { backgroundColor: '#0f172a', color: '#38bdf8', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' },
  xmlBox: { minHeight: 90, textAlignVertical: 'top' },
  presetScroll: { flexDirection: 'row', gap: 6 },
  presetCard: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', padding: 8, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  presetSymbol: { fontSize: 18, marginBottom: 2 },
  presetName: { fontSize: 10, fontWeight: 'bold', color: '#f8fafc', textAlign: 'center' },
  presetCategory: { fontSize: 9, color: '#94a3b8', marginTop: 2 },
  row: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  sizeChip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  activeChip: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  chipText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
  colorSwatch: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: '#475569' },
  activeSwatch: { borderWidth: 3, borderColor: '#38bdf8' },
  insertBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 24 },
  insertBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
});
