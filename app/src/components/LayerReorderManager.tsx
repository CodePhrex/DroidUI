import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentNode } from '../types/schema';

export const LayerReorderManager = () => {
  const { rootNode, selectedNodeId, selectNode, moveChildNode, deleteNode } = useEditorStore();

  const getLayerName = (node: ComponentNode) => {
    const props = node.props || {};
    const value = props.text || props.label || props.title || props.assetName;
    return typeof value === 'string' && value.trim() ? value.trim() : node.id === rootNode.id ? 'Screen' : node.type;
  };

  const renderLayer = (node: ComponentNode, depth = 0, parentId?: string, index?: number, total = 0): React.ReactNode => {
    const isSelected = selectedNodeId === node.id;
    const canMoveUp = index !== undefined && index > 0;
    const canMoveDown = index !== undefined && index < total - 1;
    return (
      <View key={node.id} style={[styles.layerBlock, { marginLeft: depth * 10 }]}>
        <View style={styles.layerRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Select ${getLayerName(node)} layer`}
            style={[styles.selectRow, isSelected && styles.selectedRow]}
            onPress={() => selectNode(node.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.layerType}>{node.type}</Text>
            <Text style={styles.layerName} numberOfLines={1}>{getLayerName(node)}</Text>
          </TouchableOpacity>
          {parentId && index !== undefined && (
            <View style={styles.actions}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Move layer up" disabled={!canMoveUp} style={[styles.actionBtn, !canMoveUp && styles.disabledBtn]} onPress={() => moveChildNode(parentId, index, index - 1)}>
                <Text style={styles.actionText}>↑</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Move layer down" disabled={!canMoveDown} style={[styles.actionBtn, !canMoveDown && styles.disabledBtn]} onPress={() => moveChildNode(parentId, index, index + 1)}>
                <Text style={styles.actionText}>↓</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Delete ${getLayerName(node)} layer`} style={[styles.actionBtn, styles.deleteBtn]} onPress={() => deleteNode(node.id)}>
                <Text style={styles.actionText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {node.children?.map((child, childIndex) => renderLayer(child, depth + 1, node.id, childIndex, node.children?.length || 0))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Layers</Text>
          <Text style={styles.subtitle}>Select, reorder or remove canvas elements</Text>
        </View>
        <Text style={styles.count}>{countNodes(rootNode)} items</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {renderLayer(rootNode)}
      </ScrollView>
    </View>
  );
};

const countNodes = (node: ComponentNode): number => 1 + (node.children || []).reduce((sum, child) => sum + countNodes(child), 0);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1730', padding: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { color: '#F4F7FF', fontSize: 15, fontWeight: '900' },
  subtitle: { color: '#91A5CC', fontSize: 10, marginTop: 3 },
  count: { color: '#9DB9E7', fontSize: 10, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { paddingBottom: 14 },
  layerBlock: { marginBottom: 5 },
  layerRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  selectRow: { flex: 1, minWidth: 0, minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 9, paddingVertical: 7, backgroundColor: '#172744', borderRadius: 8, borderWidth: 1, borderColor: '#263B61' },
  selectedRow: { backgroundColor: '#1D3B69', borderColor: '#398BFF' },
  layerType: { color: '#68DCEB', fontSize: 9, fontWeight: '800', minWidth: 54 },
  layerName: { flex: 1, color: '#F4F7FF', fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 3 },
  actionBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#263F68' },
  disabledBtn: { opacity: 0.35 },
  deleteBtn: { backgroundColor: '#6B2838' },
  actionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
