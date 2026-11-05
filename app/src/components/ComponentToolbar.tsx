import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentType } from '../types/schema';

interface ToolItem {
  type: ComponentType;
  label: string;
  icon: string;
}

const TOOLBAR_ITEMS: ToolItem[] = [
  { type: 'Container', label: 'Box', icon: '🔲' },
  { type: 'Text', label: 'Text', icon: '🔤' },
  { type: 'Button', label: 'Button', icon: '🔘' },
  { type: 'Input', label: 'Input', icon: '📝' },
  { type: 'ProgressBar', label: 'Progress', icon: '📊' },
  { type: 'Graph', label: 'Chart', icon: '📈' },
  { type: 'Switch', label: 'Switch', icon: '🔲' },
  { type: 'Slider', label: 'Slider', icon: '🎚️' },
  { type: 'Checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'AnimatedAsset', label: 'Animated', icon: '✨' },
  { type: 'SvgVector', label: 'Vector SVG', icon: '📐' },
  { type: 'Badge', label: 'Badge', icon: '🏷️' },
  { type: 'Icon', label: 'Icon', icon: '❖' },
  { type: 'Image', label: 'Image', icon: '📷' },
  { type: 'Card', label: 'Card', icon: '📑' },
];

export const ComponentToolbar = () => {
  const { selectedNodeId, rootNode, addChildNode } = useEditorStore();

  // New elements must be inserted into a renderable parent. If a text/button/etc.
  // is selected, use its nearest Container/Card ancestor instead of nesting
  // children inside a leaf component where they would never appear on canvas.
  const findTargetContainer = (node: import('../types/schema').ComponentNode, targetId: string, currentContainerId: string): string => {
    if (node.id === targetId) {
      return node.type === 'Container' || node.type === 'Card' ? node.id : currentContainerId;
    }
    const nextContainerId = node.type === 'Container' || node.type === 'Card' ? node.id : currentContainerId;
    for (const child of node.children || []) {
      const found = findTargetContainer(child, targetId, nextContainerId);
      if (found !== currentContainerId || child.id === targetId) return found;
    }
    return currentContainerId;
  };

  const targetParentId = selectedNodeId
    ? findTargetContainer(rootNode, selectedNodeId, rootNode.id)
    : rootNode.id;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Quick Component Toolbar</Text>
        <Text style={styles.targetLabel}>Adding to: [{targetParentId}]</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarScroll}>
        {TOOLBAR_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={styles.toolBtn}
            onPress={() => addChildNode(targetParentId, item.type)}
          >
            <Text style={styles.toolIcon}>{item.icon}</Text>
            <Text style={styles.toolLabel}>+ {item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#334155',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#38bdf8',
    textTransform: 'uppercase',
  },
  targetLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  toolbarScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  toolBtn: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toolIcon: {
    fontSize: 12,
  },
  toolLabel: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
