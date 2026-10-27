import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { THEMES, ThemeMode } from '../theme/themeConfig';

export const ThemeManager = () => {
  const { currentTheme, setTheme } = useEditorStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Design System Theme</Text>
      <View style={styles.grid}>
        {(Object.keys(THEMES) as ThemeMode[]).map((mode) => {
          const t = THEMES[mode];
          const isSelected = currentTheme === mode;
          return (
            <TouchableOpacity
              key={mode}
              style={[styles.themeCard, isSelected && styles.selectedCard]}
              onPress={() => setTheme(mode)}
            >
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: t.textPrimary }}>{t.name}</Text>
              <View style={styles.swatchRow}>
                <View style={[styles.swatch, { backgroundColor: t.bgCanvas }]} />
                <View style={[styles.swatch, { backgroundColor: t.primary }]} />
                <View style={[styles.swatch, { backgroundColor: t.accent }]} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  themeCard: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, width: '48%', borderWidth: 1, borderColor: '#334155' },
  selectedCard: { borderColor: '#3b82f6' },
  swatchRow: { flexDirection: 'row', gap: 4, marginTop: 6 },
  swatch: { width: 14, height: 14, borderRadius: 7 },
});
