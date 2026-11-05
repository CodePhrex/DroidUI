import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentStyle } from '../types/schema';

interface PresetItem {
  id: string;
  name: string;
  category: 'Button' | 'Card' | 'Text' | 'Input' | 'Badge';
  icon: string;
  style: Partial<ComponentStyle>;
}

const PRESETS: PresetItem[] = [
  // Button Presets
  {
    id: 'btn_primary',
    name: 'Primary Action',
    category: 'Button',
    icon: '🔵',
    style: { backgroundColor: '#398BFF', borderRadius: 8, padding: 12, alignItems: 'center' },
  },
  {
    id: 'btn_danger',
    name: 'Danger / Destructive',
    category: 'Button',
    icon: '🔴',
    style: { backgroundColor: '#ef4444', borderRadius: 8, padding: 12, alignItems: 'center' },
  },
  {
    id: 'btn_outline',
    name: 'Outline Border',
    category: 'Button',
    icon: '🔳',
    style: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#398BFF', borderRadius: 8, padding: 10, alignItems: 'center' },
  },
  {
    id: 'btn_ghost',
    name: 'Ghost Minimal',
    category: 'Button',
    icon: '👻',
    style: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 10, alignItems: 'center' },
  },
  {
    id: 'btn_pill',
    name: 'Success Pill',
    category: 'Button',
    icon: '💊',
    style: { backgroundColor: '#10b981', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  },

  // Card / Container Presets
  {
    id: 'card_glass',
    name: 'Glassmorphism Card',
    category: 'Card',
    icon: '✨',
    style: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  },
  {
    id: 'card_elevated',
    name: 'Elevated Dark Card',
    category: 'Card',
    icon: '🃏',
    style: { backgroundColor: '#111B35', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#263B68' },
  },
  {
    id: 'card_cyber',
    name: 'Cyberpunk Neon Box',
    category: 'Card',
    icon: '⚡',
    style: { backgroundColor: '#0d0d1a', borderRadius: 8, padding: 16, borderWidth: 2, borderColor: '#00f0ff' },
  },

  // Text Presets
  {
    id: 'txt_hero',
    name: 'Hero Display Title',
    category: 'Text',
    icon: '👑',
    style: { fontSize: 26, fontWeight: 'bold', color: '#F4F7FF', marginBottom: 8 },
  },
  {
    id: 'txt_section',
    name: 'Section Heading',
    category: 'Text',
    icon: '📌',
    style: { fontSize: 18, fontWeight: '700', color: '#38E8F2', marginBottom: 6 },
  },
  {
    id: 'txt_subtle',
    name: 'Subtle Metadata',
    category: 'Text',
    icon: '💬',
    style: { fontSize: 13, color: '#9AADD6', marginBottom: 4 },
  },

  // Badge Presets
  {
    id: 'badge_success',
    name: 'Success Badge',
    category: 'Badge',
    icon: '🟢',
    style: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: 12, padding: 6 },
  },
  {
    id: 'badge_warning',
    name: 'Warning Tag',
    category: 'Badge',
    icon: '🟡',
    style: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', borderRadius: 12, padding: 6 },
  },
];

export const PropertyPresetsStudio = () => {
  const { rootNode, selectedNodeId, updateStyle } = useEditorStore();

  const findNode = (node: any, id: string): any => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const res = findNode(child, id);
        if (res) return res;
      }
    }
    return null;
  };

  const selectedNode = selectedNodeId ? findNode(rootNode, selectedNodeId) : null;

  if (!selectedNode) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tap a canvas component to apply 1-tap style presets</Text>
      </View>
    );
  }

  const applyPreset = (presetStyle: Partial<ComponentStyle>) => {
    updateStyle(selectedNode.id, presetStyle);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>1-Tap Component Style Presets</Text>
      <Text style={styles.targetTag}>Target Component: [{selectedNode.id}] ({selectedNode.type})</Text>

      <View style={styles.grid}>
        {PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.presetCard}
            onPress={() => applyPreset(preset.style)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.presetIcon}>{preset.icon}</Text>
              <View style={styles.presetMeta}>
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetCategory}>{preset.category} Style</Text>
              </View>
            </View>
            <Text style={styles.applyLabel}>+ Apply Preset</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#7186B4', fontSize: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#F4F7FF', marginBottom: 2 },
  targetTag: { fontSize: 11, color: '#38E8F2', marginBottom: 12 },
  grid: { gap: 8 },
  presetCard: { backgroundColor: '#111B35', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#263B68' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  presetIcon: { fontSize: 18 },
  presetMeta: { flex: 1 },
  presetName: { color: '#F4F7FF', fontSize: 12, fontWeight: 'bold' },
  presetCategory: { color: '#9AADD6', fontSize: 10 },
  applyLabel: { color: '#398BFF', fontSize: 10, fontWeight: 'bold', textAlign: 'right' },
});
