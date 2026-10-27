import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';

export const PropertyInspector = () => {
  const { rootNode, selectedNodeId, updateStyle, updateProps, addChildNode } = useEditorStore();

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
        <Text style={styles.emptyText}>Tap any element on canvas to inspect properties</Text>
      </View>
    );
  }

  const currentProps = selectedNode.props || {};
  const currentStyle = selectedNode.style || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Properties: {selectedNode.id}</Text>
      <Text style={styles.typeTag}>Type: {selectedNode.type}</Text>

      {/* Transparency / Opacity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transparency & Opacity</Text>
        <View style={styles.chipRow}>
          {[1.0, 0.8, 0.6, 0.4, 0.2].map((op) => (
            <TouchableOpacity
              key={op}
              style={[styles.chip, currentStyle.opacity === op && styles.activeChip]}
              onPress={() => updateStyle(selectedNode.id, { opacity: op })}
            >
              <Text style={[styles.chipText, currentStyle.opacity === op && styles.activeChipText]}>
                {Math.round(op * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rotation Transform */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rotation Element Angle (°)</Text>
        <View style={styles.chipRow}>
          {[0, 15, 30, 45, 90, 180, 270].map((deg) => (
            <TouchableOpacity
              key={deg}
              style={[styles.chip, currentStyle.rotation === deg && styles.activeChip]}
              onPress={() => updateStyle(selectedNode.id, { rotation: deg })}
            >
              <Text style={[styles.chipText, currentStyle.rotation === deg && styles.activeChipText]}>
                {deg}°
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Component Specific Props Editors */}
      {selectedNode.type === 'Text' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text String</Text>
          <TextInput
            style={styles.input}
            value={currentProps.text || ''}
            onChangeText={(txt) => updateProps(selectedNode.id, { text: txt })}
          />
        </View>
      )}

      {selectedNode.type === 'Button' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button Label</Text>
          <TextInput
            style={styles.input}
            value={currentProps.label || ''}
            onChangeText={(txt) => updateProps(selectedNode.id, { label: txt })}
          />
        </View>
      )}

      {selectedNode.type === 'ProgressBar' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Completion (%)</Text>
          <View style={styles.chipRow}>
            {[25, 50, 75, 90, 100].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.chip, currentProps.progress === val && styles.activeChip]}
                onPress={() => updateProps(selectedNode.id, { progress: val })}
              >
                <Text style={[styles.chipText, currentProps.progress === val && styles.activeChipText]}>
                  {val}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectedNode.type === 'Switch' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Switch State</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, currentProps.value === true && styles.activeChip]}
              onPress={() => updateProps(selectedNode.id, { value: true })}
            >
              <Text style={[styles.chipText, currentProps.value === true && styles.activeChipText]}>
                ON (Active)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, currentProps.value === false && styles.activeChip]}
              onPress={() => updateProps(selectedNode.id, { value: false })}
            >
              <Text style={[styles.chipText, currentProps.value === false && styles.activeChipText]}>
                OFF (Inactive)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedNode.type === 'Slider' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Slider Thumb Position</Text>
          <View style={styles.chipRow}>
            {[10, 25, 50, 75, 90].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.chip, currentProps.value === val && styles.activeChip]}
                onPress={() => updateProps(selectedNode.id, { value: val })}
              >
                <Text style={[styles.chipText, currentProps.value === val && styles.activeChipText]}>
                  {val}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {selectedNode.type === 'Checkbox' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checkbox Toggle</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, currentProps.checked === true && styles.activeChip]}
              onPress={() => updateProps(selectedNode.id, { checked: true })}
            >
              <Text style={[styles.chipText, currentProps.checked === true && styles.activeChipText]}>
                ✓ Checked
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, currentProps.checked === false && styles.activeChip]}
              onPress={() => updateProps(selectedNode.id, { checked: false })}
            >
              <Text style={[styles.chipText, currentProps.checked === false && styles.activeChipText]}>
                Unchecked
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedNode.type === 'AnimatedAsset' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Animation Effect Spec</Text>
          <View style={styles.chipRow}>
            {['pulse', 'spin', 'bounce', 'lottie'].map((anim) => (
              <TouchableOpacity
                key={anim}
                style={[styles.chip, currentProps.animationType === anim && styles.activeChip]}
                onPress={() => updateProps(selectedNode.id, { animationType: anim })}
              >
                <Text style={[styles.chipText, currentProps.animationType === anim && styles.activeChipText]}>
                  {anim}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Add Children Buttons for Containers */}
      {(selectedNode.type === 'Container' || selectedNode.type === 'Card') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Child Component</Text>
          <View style={styles.addBtnGrid}>
            <TouchableOpacity style={styles.addBtn} onPress={() => addChildNode(selectedNode.id, 'Text')}>
              <Text style={styles.addBtnText}>+ Text</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => addChildNode(selectedNode.id, 'Button')}>
              <Text style={styles.addBtnText}>+ Button</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => addChildNode(selectedNode.id, 'ProgressBar')}>
              <Text style={styles.addBtnText}>+ Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={() => addChildNode(selectedNode.id, 'Graph')}>
              <Text style={styles.addBtnText}>+ Chart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Style Editors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spacing & Padding</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity style={styles.chip} onPress={() => updateStyle(selectedNode.id, { padding: 8 })}>
            <Text style={styles.chipText}>Pad: 8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => updateStyle(selectedNode.id, { padding: 16 })}>
            <Text style={styles.chipText}>Pad: 16</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => updateStyle(selectedNode.id, { borderRadius: 12 })}>
            <Text style={styles.chipText}>Radius: 12</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 12 },
  header: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  typeTag: { fontSize: 11, color: '#3b82f6', marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#cbd5e1', marginBottom: 8 },
  addBtnGrid: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  addBtn: { backgroundColor: '#334155', padding: 8, borderRadius: 6, flex: 1, minWidth: '45%', alignItems: 'center' },
  addBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#475569' },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#475569' },
  activeChip: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  chipText: { color: '#94a3b8', fontSize: 11 },
  activeChipText: { color: '#ffffff', fontWeight: 'bold' },
});
