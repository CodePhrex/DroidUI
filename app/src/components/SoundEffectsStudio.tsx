import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { SoundType } from '../types/schema';
import { playSoundEffect } from '../audio/soundSynthesizer';

interface SoundPreset {
  id: SoundType;
  name: string;
  icon: string;
  desc: string;
}

const SOUND_PRESETS: SoundPreset[] = [
  { id: 'pop', name: 'Pop Tap', icon: '🫧', desc: 'Soft bubble pop for primary buttons and chips' },
  { id: 'click', name: 'UI Click', icon: '🔘', desc: 'Crisp mechanical click for form elements and switches' },
  { id: 'chime', name: 'Success Chime', icon: '🔔', desc: 'Harmonic ascending chime for achievements and saves' },
  { id: 'switch', name: 'Toggle Switch', icon: '🎚️', desc: 'Quick dual-tone tick for toggle switches' },
  { id: 'error', name: 'Error Buzz', icon: '⚠️', desc: 'Low frequency warning buzz for validation errors' },
  { id: 'bell', name: 'Notification Bell', icon: '✨', desc: 'High frequency bell tone for alerts' },
  { id: 'none', name: 'Mute (No Sound)', icon: '🔇', desc: 'Disable audio feedback for this element' },
];

export const SoundEffectsStudio = () => {
  const { rootNode, selectedNodeId, updateSoundEffect } = useEditorStore();

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
  const currentSound = selectedNode?.soundEffect?.soundName || 'none';

  const handleSelectSound = (snd: SoundType) => {
    updateSoundEffect(selectedNode.id, { soundName: snd, volume: 0.8 });
    playSoundEffect(snd, 0.8);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Action Sound Effects Studio</Text>
        <Text style={styles.targetBadge}>Target: [{selectedNode?.id || 'root'}] ({selectedNode?.type})</Text>
      </View>

      <Text style={styles.subtitle}>
        Attach sound effects triggered when users interact with canvas components on device.
      </Text>

      <View style={styles.soundList}>
        {SOUND_PRESETS.map((item) => {
          const isSelected = currentSound === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.soundCard, isSelected && styles.activeCard]}
              onPress={() => handleSelectSound(item.id)}
            >
              <View style={styles.soundHeader}>
                <Text style={styles.soundIcon}>{item.icon}</Text>
                <View style={styles.soundMeta}>
                  <Text style={styles.soundName}>{item.name}</Text>
                  <Text style={styles.soundDesc}>{item.desc}</Text>
                </View>
                <TouchableOpacity
                  style={styles.testBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    playSoundEffect(item.id, 0.8);
                  }}
                >
                  <Text style={styles.testBtnText}>▶ Test</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
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
  soundList: { gap: 8 },
  soundCard: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  activeCard: { borderColor: '#3b82f6', backgroundColor: '#1e3a8a' },
  soundHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  soundIcon: { fontSize: 20 },
  soundMeta: { flex: 1 },
  soundName: { fontSize: 12, fontWeight: 'bold', color: '#f8fafc' },
  soundDesc: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  testBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  testBtnText: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold' },
});
