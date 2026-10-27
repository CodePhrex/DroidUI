import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { AccessibilitySpec } from '../types/schema';

export const AccessibilityStudio = () => {
  const { rootNode, selectedNodeId, updateAccessibility } = useEditorStore();

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
  const currentAcc: AccessibilitySpec = selectedNode?.accessibility || {};

  const handleUpdate = (patch: Partial<AccessibilitySpec>) => {
    if (!selectedNode) return;
    updateAccessibility(selectedNode.id, { ...currentAcc, ...patch });
  };

  const roles: Array<NonNullable<AccessibilitySpec['accessibilityRole']>> = [
    'button',
    'header',
    'link',
    'image',
    'text',
    'checkbox',
    'switch',
    'adjustable',
    'none',
  ];

  const importanceOptions: Array<NonNullable<AccessibilitySpec['importantForAccessibility']>> = [
    'auto',
    'yes',
    'no',
    'no-hide-descendants',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>♿ Accessibility & TalkBack Studio</Text>
        <Text style={styles.targetBadge}>
          Target: [{selectedNode?.id || 'root'}] ({selectedNode?.type})
        </Text>
      </View>

      {/* Enable Screen Reader Focus */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screen Reader Focus (`accessible`)</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, currentAcc.accessible !== false && styles.activeToggleBtn]}
            onPress={() => handleUpdate({ accessible: true })}
          >
            <Text style={styles.btnText}>✓ Accessible (Focusable)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, currentAcc.accessible === false && styles.activeToggleBtn]}
            onPress={() => handleUpdate({ accessible: false })}
          >
            <Text style={styles.btnText}>✕ Hide from TalkBack</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Reader Label */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility Label (`accessibilityLabel`)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Submit Order Button"
          placeholderTextColor="#64748b"
          value={currentAcc.accessibilityLabel || ''}
          onChangeText={(txt) => handleUpdate({ accessibilityLabel: txt })}
        />
        <Text style={styles.helperText}>Read aloud by Android TalkBack when element is focused</Text>
      </View>

      {/* Screen Reader Hint */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility Hint (`accessibilityHint`)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Double tap to finalize purchase"
          placeholderTextColor="#64748b"
          value={currentAcc.accessibilityHint || ''}
          onChangeText={(txt) => handleUpdate({ accessibilityHint: txt })}
        />
        <Text style={styles.helperText}>Provides additional context on the action outcome</Text>
      </View>

      {/* Accessibility Role */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility Role (`accessibilityRole`)</Text>
        <View style={styles.chipGrid}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.chip, currentAcc.accessibilityRole === role && styles.activeChip]}
              onPress={() => handleUpdate({ accessibilityRole: role })}
            >
              <Text style={styles.chipText}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Important for Accessibility */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TalkBack Importance (`importantForAccessibility`)</Text>
        <View style={styles.chipGrid}>
          {importanceOptions.map((imp) => (
            <TouchableOpacity
              key={imp}
              style={[styles.chip, currentAcc.importantForAccessibility === imp && styles.activeChip]}
              onPress={() => handleUpdate({ importantForAccessibility: imp })}
            >
              <Text style={styles.chipText}>{imp}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Presets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1-Tap Accessibility Presets</Text>
        <View style={styles.presetRow}>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() =>
              handleUpdate({
                accessible: true,
                accessibilityRole: 'button',
                accessibilityLabel: selectedNode?.props?.label || 'Interactive Button',
                accessibilityHint: 'Double tap to activate action',
                importantForAccessibility: 'yes',
              })
            }
          >
            <Text style={styles.presetBtnText}>🔘 Button Accessibility</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() =>
              handleUpdate({
                accessible: true,
                accessibilityRole: 'header',
                accessibilityLabel: selectedNode?.props?.text || 'Heading Title',
                importantForAccessibility: 'yes',
              })
            }
          >
            <Text style={styles.presetBtnText}>🔤 Header Heading</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() =>
              handleUpdate({
                accessible: false,
                importantForAccessibility: 'no-hide-descendants',
              })
            }
          >
            <Text style={styles.presetBtnText}>🙈 Decorative Only</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: { marginBottom: 14 },
  title: { fontSize: 13, fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase' },
  targetBadge: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 6 },
  buttonRow: { flexDirection: 'row', gap: 6 },
  toggleBtn: { flex: 1, backgroundColor: '#1e293b', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  activeToggleBtn: { backgroundColor: '#059669', borderColor: '#10b981' },
  btnText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
  textInput: { backgroundColor: '#0f172a', color: '#f8fafc', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', fontSize: 12 },
  helperText: { color: '#64748b', fontSize: 10, marginTop: 4 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  activeChip: { backgroundColor: '#10b981', borderColor: '#059669' },
  chipText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  presetBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#10b981' },
  presetBtnText: { color: '#34d399', fontSize: 11, fontWeight: 'bold' },
});
