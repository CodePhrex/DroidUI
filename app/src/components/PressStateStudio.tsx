import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { PressStateSpec } from '../types/schema';

export const PressStateStudio = () => {
  const { rootNode, selectedNodeId, updatePressState, activeSimMode, setSimMode } = useEditorStore();

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
  const currentPressState: PressStateSpec = selectedNode?.pressState || {};

  const handleUpdate = (patch: Partial<PressStateSpec>) => {
    if (selectedNode) {
      updatePressState(selectedNode.id, { ...currentPressState, ...patch });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Interactive Press & Hover States</Text>
        <Text style={styles.targetBadge}>Target: [{selectedNode?.id || 'root'}] ({selectedNode?.type})</Text>
      </View>

      {/* Live Simulation Mode Switcher */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Canvas Interactive Preview Simulation</Text>
        <View style={styles.simRow}>
          <TouchableOpacity
            style={[styles.simBtn, activeSimMode === 'default' && styles.activeSimBtn]}
            onPress={() => setSimMode('default')}
          >
            <Text style={styles.simBtnText}>Default</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.simBtn, activeSimMode === 'pressed' && styles.activeSimBtn]}
            onPress={() => setSimMode('pressed')}
          >
            <Text style={styles.simBtnText}>👇 Pressed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.simBtn, activeSimMode === 'hovered' && styles.activeSimBtn]}
            onPress={() => setSimMode('hovered')}
          >
            <Text style={styles.simBtnText}>✨ Hovered</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Opacity Slider / Chips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Press Opacity (Fade Feedback)</Text>
        <View style={styles.chipRow}>
          {[1.0, 0.8, 0.6, 0.4, 0.2].map((op) => (
            <TouchableOpacity
              key={op}
              style={[styles.chip, currentPressState.activeOpacity === op && styles.activeChip]}
              onPress={() => handleUpdate({ activeOpacity: op })}
            >
              <Text style={styles.chipText}>{Math.round(op * 100)}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Press Scale Transform */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Press Scale Effect (Spring Compression)</Text>
        <View style={styles.chipRow}>
          {[
            { label: 'Normal (1.0)', val: 1.0 },
            { label: 'Compress (0.95)', val: 0.95 },
            { label: 'Compact (0.90)', val: 0.90 },
            { label: 'Pop Out (1.05)', val: 1.05 },
          ].map((item) => (
            <TouchableOpacity
              key={item.val}
              style={[styles.chip, currentPressState.pressScale === item.val && styles.activeChip]}
              onPress={() => handleUpdate({ pressScale: item.val })}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pressed State Background Color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pressed Background Color Feedback</Text>
        <View style={styles.chipRow}>
          {[
            { label: 'None', color: undefined },
            { label: 'Primary Blue', color: '#1d4ed8' },
            { label: 'Danger Red', color: '#b91c1c' },
            { label: 'Success Green', color: '#15803d' },
            { label: 'Amber Accent', color: '#b45309' },
            { label: 'Dark Charcoal', color: '#0f172a' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.chip,
                currentPressState.pressedBgColor === item.color && styles.activeChip,
                item.color ? { backgroundColor: item.color } : {},
              ]}
              onPress={() => handleUpdate({ pressedBgColor: item.color })}
            >
              <Text style={[styles.chipText, item.color ? { color: '#ffffff', fontWeight: 'bold' } : {}]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hover State Glow & Border */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hover Focus Ring & Border Highlight</Text>
        <View style={styles.chipRow}>
          {[
            { label: 'Cyan Ring', color: '#00f0ff' },
            { label: 'Blue Highlight', color: '#3b82f6' },
            { label: 'Purple Glow', color: '#a855f7' },
            { label: 'Gold Ring', color: '#eab308' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.chip, currentPressState.hoverBorderColor === item.color && styles.activeChip]}
              onPress={() => handleUpdate({ hoverBorderColor: item.color, hoverGlow: true })}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: { marginBottom: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  targetBadge: { fontSize: 10, color: '#38bdf8', marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 8 },
  simRow: { flexDirection: 'row', gap: 6 },
  simBtn: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, flex: 1, alignItems: 'center' },
  activeSimBtn: { backgroundColor: '#3b82f6', borderColor: '#60a5fa' },
  simBtnText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  activeChip: { borderColor: '#3b82f6', backgroundColor: '#334155' },
  chipText: { color: '#f8fafc', fontSize: 11 },
});
