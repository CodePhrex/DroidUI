import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';

export const LayerReorderManager = () => {
  const { rootNode, selectedNodeId, selectNode, moveChildNode, deleteNode } = useEditorStore();

  const renderLayer = (node: any, depth = 0, parentId?: string, index?: number, total = 0) => {
    const isSelected = selectedNodeId === node.id;
    return (
      <View key={node.id} style={{ marginLeft: depth * 12, marginBottom: 4 }}>
        <TouchableOpacity
          style={[styles.row, isSelected && styles.selectedRow]}
          onPress={() => selectNode(node.id)}
        >
          <Text style={{ color: '#fff', fontSize: 12 }}>{node.id} ({node.type})</Text>
        </TouchableOpacity>
        {node.children && node.children.map((c: any, i: number) => renderLayer(c, depth + 1, node.id, i, node.children.length))}
      </View>
    );
  };

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 8 }}>Layer Hierarchy</Text>
      <ScrollView>{renderLayer(rootNode)}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { padding: 8, backgroundColor: '#1e293b', borderRadius: 6 },
  selectedRow: { borderColor: '#3b82f6', borderWidth: 1 },
});
