import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';

interface FontSpec {
  id: string;
  name: string;
  fontFamily: string;
  category: 'Sans-Serif' | 'Serif' | 'Monospace' | 'Display';
  previewText: string;
}

export const FONTS: FontSpec[] = [
  { id: 'roboto', name: 'Roboto', fontFamily: 'Roboto, sans-serif', category: 'Sans-Serif', previewText: 'The quick brown fox jumps' },
  { id: 'inter', name: 'Inter UI', fontFamily: 'Inter, sans-serif', category: 'Sans-Serif', previewText: 'Modern digital interface font' },
  { id: 'poppins', name: 'Poppins', fontFamily: 'Poppins, sans-serif', category: 'Display', previewText: 'Geometric sans typography' },
  { id: 'system', name: 'System Default', fontFamily: 'System', category: 'Sans-Serif', previewText: 'Native platform typography' },
  { id: 'fira_code', name: 'Fira Code', fontFamily: 'Fira Code, monospace', category: 'Monospace', previewText: 'Developer code & ligatures' },
  { id: 'serif', name: 'System Serif', fontFamily: 'serif', category: 'Serif', previewText: 'Editorial & formal headers' },
  { id: 'playfair', name: 'Playfair Display', fontFamily: 'Playfair Display, serif', category: 'Serif', previewText: 'Elegant luxury serif design' },
  { id: 'montserrat', name: 'Montserrat', fontFamily: 'Montserrat, sans-serif', category: 'Display', previewText: 'Bold header typography' },
  { id: 'courier', name: 'Courier New', fontFamily: 'Courier New, monospace', category: 'Monospace', previewText: 'Classic typewriter style' },
];

export const FontLibraryStudio = () => {
  const { selectedNodeId, rootNode, updateStyle } = useEditorStore();
  const [selectedFont, setSelectedFont] = useState<FontSpec>(FONTS[0]);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold' | '500' | '700'>('bold');
  const [fontSize, setFontSize] = useState<number>(16);
  const [letterSpacing, setLetterSpacing] = useState<number>(0.5);
  const [customText, setCustomText] = useState('Type sample text...');

  const handleApplyToSelected = () => {
    if (!selectedNodeId) return;
    updateStyle(selectedNodeId, {
      fontFamily: selectedFont.fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
    });
  };

  const handleApplyGlobally = () => {
    const applyRecursive = (nodeId: string) => {
      updateStyle(nodeId, {
        fontFamily: selectedFont.fontFamily,
      });
    };

    const traverseAndApply = (node: any) => {
      if (node.type === 'Text' || node.type === 'Button' || node.type === 'Input') {
        applyRecursive(node.id);
      }
      if (node.children) {
        node.children.forEach(traverseAndApply);
      }
    };

    traverseAndApply(rootNode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Typography & Font Library</Text>
      <Text style={styles.subtitle}>Select custom fonts and typography styles for your UI</Text>

      {/* Font Family Selector Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontRow}>
        {FONTS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.fontCard, selectedFont.id === f.id && styles.selectedFontCard]}
            onPress={() => setSelectedFont(f)}
          >
            <Text style={styles.fontCategory}>{f.category}</Text>
            <Text style={styles.fontName}>{f.name}</Text>
            <Text style={[styles.fontPreviewText, { fontFamily: f.fontFamily }]}>Aa Bb 123</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Live Sample Card */}
      <View style={styles.sampleBox}>
        <Text style={styles.sampleLabel}>Live Typography Specimen</Text>
        <Text
          style={[
            styles.specimenText,
            {
              fontFamily: selectedFont.fontFamily,
              fontWeight,
              fontSize,
              letterSpacing,
            },
          ]}
        >
          {customText || selectedFont.previewText}
        </Text>
        <TextInput
          style={styles.specimenInput}
          value={customText}
          onChangeText={setCustomText}
          placeholder="Test custom font preview..."
          placeholderTextColor="#64748b"
        />
      </View>

      {/* Controls Row */}
      <View style={styles.controlsRow}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Weight</Text>
          <View style={styles.chipGroup}>
            {(['normal', '500', 'bold'] as const).map((w) => (
              <TouchableOpacity
                key={w}
                style={[styles.chip, fontWeight === w && styles.activeChip]}
                onPress={() => setFontWeight(w)}
              >
                <Text style={styles.chipText}>{w}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Size: {fontSize}px</Text>
          <View style={styles.chipGroup}>
            {[12, 16, 20, 24].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, fontSize === s && styles.activeChip]}
                onPress={() => setFontSize(s)}
              >
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.applyBtn, !selectedNodeId && styles.disabledBtn]}
          disabled={!selectedNodeId}
          onPress={handleApplyToSelected}
        >
          <Text style={styles.btnText}>
            {selectedNodeId ? `Apply to [${selectedNodeId}]` : 'Select a Node First'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.globalBtn} onPress={handleApplyGlobally}>
          <Text style={styles.btnText}>Apply Globally</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', marginBottom: 2 },
  subtitle: { fontSize: 11, color: '#94a3b8', marginBottom: 12 },
  fontRow: { maxHeight: 90, marginBottom: 12 },
  fontCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    width: 120,
    justifyContent: 'center',
  },
  selectedFontCard: { borderColor: '#3b82f6', backgroundColor: '#0f172a' },
  fontCategory: { fontSize: 9, color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' },
  fontName: { fontSize: 13, fontWeight: 'bold', color: '#f8fafc', marginTop: 2 },
  fontPreviewText: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  sampleBox: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  sampleLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 },
  specimenText: { color: '#ffffff', marginBottom: 8, minHeight: 32 },
  specimenInput: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 6,
    borderRadius: 4,
    fontSize: 11,
    borderWidth: 1,
    borderColor: '#334155',
  },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 8 },
  controlGroup: { flex: 1 },
  controlLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 4 },
  chipGroup: { flexDirection: 'row', gap: 4 },
  chip: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  activeChip: { backgroundColor: '#3b82f6' },
  chipText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 8 },
  applyBtn: { flex: 1, backgroundColor: '#3b82f6', padding: 10, borderRadius: 6, alignItems: 'center' },
  globalBtn: { backgroundColor: '#8b5cf6', padding: 10, borderRadius: 6, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#475569', opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
