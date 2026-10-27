import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { TransitionType, EasingCurve } from '../types/schema';

interface TransitionPreset {
  id: TransitionType;
  name: string;
  icon: string;
  desc: string;
}

const TRANSITION_PRESETS: TransitionPreset[] = [
  { id: 'slide_right', name: 'iOS Slide Right', icon: '➡️', desc: 'Standard Stack Push transition sliding in from right margin' },
  { id: 'slide_left', name: 'Slide Left Pop', icon: '⬅️', desc: 'Reverse stack pop transition sliding left' },
  { id: 'slide_up', name: 'Modal Bottom Sheet', icon: '⬆️', desc: 'Slide up transition for dialogs, cards, and sheets' },
  { id: 'fade', name: 'Cross Dissolve Fade', icon: '🌫️', desc: 'Smooth opacity cross-fade transition' },
  { id: 'zoom', name: 'Elastic Zoom Scale', icon: '🔍', desc: 'Scale expand transition popping from center' },
  { id: 'flip', name: '3D Card Flip', icon: '🔄', desc: 'Perspective Y-axis flip transition for flashcards and preview tiles' },
];

export const TransitionsStudio = () => {
  const { rootNode, selectedNodeId, updateTransition } = useEditorStore();

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
  const currentTrans = selectedNode?.transition || { type: 'fade', duration: 300, easing: 'ease' };

  const handleSelectType = (t: TransitionType) => {
    updateTransition(selectedNode.id, { ...currentTrans, type: t });
  };

  const handleSelectDuration = (d: number) => {
    updateTransition(selectedNode.id, { ...currentTrans, duration: d });
  };

  const handleSelectEasing = (e: EasingCurve) => {
    updateTransition(selectedNode.id, { ...currentTrans, easing: e });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Screen & Component Transitions Studio</Text>
        <Text style={styles.targetBadge}>Target: [{selectedNode?.id || 'root'}] ({selectedNode?.type})</Text>
      </View>

      <Text style={styles.subtitle}>
        Configure animated route push/pop and container entry transitions for React Navigation and Reanimated.
      </Text>

      {/* Transition Preset Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transition Animation Spec</Text>
        <View style={styles.grid}>
          {TRANSITION_PRESETS.map((item) => {
            const isSelected = currentTrans.type === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.transCard, isSelected && styles.activeCard]}
                onPress={() => handleSelectType(item.id)}
              >
                <Text style={styles.transIcon}>{item.icon}</Text>
                <Text style={styles.transName}>{item.name}</Text>
                <Text style={styles.transDesc}>{item.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Duration Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transition Speed / Duration (ms)</Text>
        <View style={styles.chipRow}>
          {[150, 300, 450, 600, 800].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, currentTrans.duration === d && styles.activeChip]}
              onPress={() => handleSelectDuration(d)}
            >
              <Text style={styles.chipText}>{d}ms</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Easing Curves */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animation Easing Curve</Text>
        <View style={styles.chipRow}>
          {(['linear', 'ease', 'spring'] as EasingCurve[]).map((ec) => (
            <TouchableOpacity
              key={ec}
              style={[styles.chip, currentTrans.easing === ec && styles.activeChip]}
              onPress={() => handleSelectEasing(ec)}
            >
              <Text style={styles.chipText}>{ec.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: { marginBottom: 4 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  targetBadge: { fontSize: 10, color: '#38bdf8', marginTop: 2, fontWeight: 'bold' },
  subtitle: { fontSize: 11, color: '#94a3b8', marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#cbd5e1', marginBottom: 8 },
  grid: { gap: 8 },
  transCard: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  activeCard: { borderColor: '#3b82f6', backgroundColor: '#1e3a8a' },
  transIcon: { fontSize: 18, marginBottom: 2 },
  transName: { fontSize: 12, fontWeight: 'bold', color: '#f8fafc' },
  transDesc: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  activeChip: { borderColor: '#3b82f6', backgroundColor: '#2563eb' },
  chipText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
});
