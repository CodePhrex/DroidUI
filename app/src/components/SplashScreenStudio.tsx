import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';

const LOGO_PRESETS = ['🚀', '📱', '⚡', '❖', '🔥', '🛡️', '💎', '🎨', '🌟', '⚙️'];
const BG_COLOR_PRESETS = ['#0f172a', '#1e1b4b', '#18181b', '#022c22', '#2a0a18', '#111827'];

export const SplashScreenStudio = () => {
  const { splashConfig, updateSplashConfig, triggerSplashPreview } = useEditorStore();

  const [title, setTitle] = useState(splashConfig.title);
  const [subtitle, setSubtitle] = useState(splashConfig.subtitle);

  const handleTitleChange = (txt: string) => {
    setTitle(txt);
    updateSplashConfig({ title: txt });
  };

  const handleSubtitleChange = (txt: string) => {
    setSubtitle(txt);
    updateSplashConfig({ subtitle: txt });
  };

  const generateExpoSplashCode = () => {
    return JSON.stringify({
      expo: {
        name: splashConfig.title,
        slug: 'mobile-app',
        splash: {
          image: './assets/splash-logo.png',
          resizeMode: 'contain',
          backgroundColor: splashConfig.backgroundColor
        },
        android: {
          splash: {
            backgroundColor: splashConfig.backgroundColor
          }
        }
      }
    }, null, 2);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Splash Screen Generator Studio</Text>
        <TouchableOpacity style={styles.previewBtn} onPress={triggerSplashPreview}>
          <Text style={styles.previewBtnText}>▶ Trigger Splash Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Brand Title & Subtitle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Brand Details</Text>
        <Text style={styles.inputLabel}>App Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="App Title..."
        />
        <Text style={styles.inputLabel}>Tagline / Subtitle</Text>
        <TextInput
          style={styles.input}
          value={subtitle}
          onChangeText={handleSubtitleChange}
          placeholder="Subtitle..."
        />
      </View>

      {/* Logo Emblem Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Splash Logo Symbol</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconRow}>
          {LOGO_PRESETS.map((ic) => (
            <TouchableOpacity
              key={ic}
              style={[styles.iconChip, splashConfig.logoIcon === ic && styles.activeChip]}
              onPress={() => updateSplashConfig({ logoIcon: ic })}
            >
              <Text style={{ fontSize: 20 }}>{ic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Background Color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Background Color Theme</Text>
        <View style={styles.colorRow}>
          {BG_COLOR_PRESETS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.colorSwatch, { backgroundColor: c }, splashConfig.backgroundColor === c && styles.activeSwatch]}
              onPress={() => updateSplashConfig({ backgroundColor: c })}
            />
          ))}
        </View>
      </View>

      {/* Duration & Animation Config */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display Duration (ms)</Text>
        <View style={styles.chipRow}>
          {[1000, 1500, 2000, 3000, 4000].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, splashConfig.durationMs === d && styles.activeChip]}
              onPress={() => updateSplashConfig({ durationMs: d })}
            >
              <Text style={styles.chipText}>{d}ms</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Expo Splash Config Output */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generated app.json Splash Config</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{generateExpoSplashCode()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  previewBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  previewBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#cbd5e1', marginBottom: 8 },
  inputLabel: { fontSize: 10, color: '#94a3b8', marginBottom: 4 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', marginBottom: 8, fontSize: 12 },
  iconRow: { flexDirection: 'row', gap: 8 },
  iconChip: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  activeChip: { borderColor: '#3b82f6', backgroundColor: '#1e3a8a' },
  colorRow: { flexDirection: 'row', gap: 8 },
  colorSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  activeSwatch: { borderWidth: 3, borderColor: '#38bdf8' },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  chipText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  codeBlock: { backgroundColor: '#0f172a', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  codeText: { color: '#38bdf8', fontFamily: 'monospace', fontSize: 10 },
});
