import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';

export const SpacingAlignmentStudio = () => {
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

  const selectedNode = selectedNodeId ? findNode(rootNode, selectedNodeId) : rootNode;
  const currentStyle = selectedNode?.style || {};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Spacing & Alignment Grid Studio</Text>
        <Text style={styles.targetBadge}>Target: [{selectedNode?.id || 'root'}] ({selectedNode?.type})</Text>
      </View>

      {/* Flexbox Layout Direction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Layout Flow Direction</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.flexBtn, currentStyle.flexDirection === 'column' && styles.activeBtn]}
            onPress={() => updateStyle(selectedNode.id, { flexDirection: 'column' })}
          >
            <Text style={styles.btnText}>⬇ Vertical Column</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flexBtn, currentStyle.flexDirection === 'row' && styles.activeBtn]}
            onPress={() => updateStyle(selectedNode.id, { flexDirection: 'row' })}
          >
            <Text style={styles.btnText}>➡ Horizontal Row</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Align Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Align Items (Cross Axis)</Text>
        <View style={styles.chipRow}>
          {(['flex-start', 'center', 'flex-end', 'stretch'] as const).map((align) => (
            <TouchableOpacity
              key={align}
              style={[styles.chip, currentStyle.alignItems === align && styles.activeChip]}
              onPress={() => updateStyle(selectedNode.id, { alignItems: align })}
            >
              <Text style={styles.chipText}>{align}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Justify Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Justify Content (Main Axis)</Text>
        <View style={styles.chipRow}>
          {(['flex-start', 'center', 'flex-end', 'space-between'] as const).map((justify) => (
            <TouchableOpacity
              key={justify}
              style={[styles.chip, currentStyle.justifyContent === justify && styles.activeChip]}
              onPress={() => updateStyle(selectedNode.id, { justifyContent: justify })}
            >
              <Text style={styles.chipText}>{justify}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Padding Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Internal Padding (px)</Text>
        <View style={styles.chipRow}>
          {[0, 8, 12, 16, 24, 32].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, currentStyle.padding === p && styles.activeChip]}
              onPress={() => updateStyle(selectedNode.id, { padding: p })}
            >
              <Text style={styles.chipText}>{p}px</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Margin Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>External Margin (px)</Text>
        <View style={styles.chipRow}>
          {[0, 4, 8, 12, 16, 24].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, currentStyle.margin === m && styles.activeChip]}
              onPress={() => updateStyle(selectedNode.id, { margin: m })}
            >
              <Text style={styles.chipText}>{m}px</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Border Radius */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Corner Radius (px)</Text>
        <View style={styles.chipRow}>
          {[0, 4, 8, 12, 16, 24, 999].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.chip, currentStyle.borderRadius === r && styles.activeChip]}
              onPress={() => updateStyle(selectedNode.id, { borderRadius: r })}
            >
              <Text style={styles.chipText}>{r === 999 ? 'Pill' : `${r}px`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: { marginBottom: 14 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  targetBadge: { fontSize: 11, color: '#38bdf8', fontWeight: 'bold', marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 8 },
  buttonGroup: { flexDirection: 'row', gap: 8 },
  flexBtn: { flex: 1, backgroundColor: '#1e293b', padding: 10, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  activeBtn: { backgroundColor: '#2563eb', borderColor: '#60a5fa' },
  btnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  activeChip: { backgroundColor: '#3b82f6', borderColor: '#60a5fa' },
  chipText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
});
