import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export type ViewportMode =
  | 'galaxy_s24_ultra'
  | 'pixel_8_pro'
  | 'galaxy_z_fold5'
  | 'galaxy_z_flip5'
  | 'pixel_tablet'
  | 'compact_phone'
  | 'wear_os_watch'
  | 'android_tv';

export interface ViewportSpec {
  id: ViewportMode;
  name: string;
  deviceModel: string;
  aspectRatio: string;
  width: number;
  height: number;
  icon: string;
}

export const VIEWPORTS: Record<ViewportMode, ViewportSpec> = {
  galaxy_s24_ultra: {
    id: 'galaxy_s24_ultra',
    name: 'Galaxy S24 Ultra',
    deviceModel: 'Samsung Galaxy S24 Ultra',
    aspectRatio: '19.5:9',
    width: 384,
    height: 832,
    icon: '📱',
  },
  pixel_8_pro: {
    id: 'pixel_8_pro',
    name: 'Pixel 8 Pro',
    deviceModel: 'Google Pixel 8 Pro',
    aspectRatio: '20:9',
    width: 384,
    height: 848,
    icon: '📱',
  },
  galaxy_z_fold5: {
    id: 'galaxy_z_fold5',
    name: 'Galaxy Z Fold 5',
    deviceModel: 'Samsung Galaxy Z Fold 5 (Unfolded)',
    aspectRatio: '6:5',
    width: 480,
    height: 580,
    icon: '📖',
  },
  galaxy_z_flip5: {
    id: 'galaxy_z_flip5',
    name: 'Galaxy Z Flip 5',
    deviceModel: 'Samsung Galaxy Z Flip 5 (Main Display)',
    aspectRatio: '22:9',
    width: 360,
    height: 800,
    icon: '📲',
  },
  pixel_tablet: {
    id: 'pixel_tablet',
    name: 'Pixel Tablet 11"',
    deviceModel: 'Google Pixel Tablet / Galaxy Tab S9',
    aspectRatio: '16:10',
    width: 600,
    height: 380,
    icon: '🖥️',
  },
  compact_phone: {
    id: 'compact_phone',
    name: 'Classic Compact',
    deviceModel: 'Standard Android Phone (HD)',
    aspectRatio: '16:9',
    width: 360,
    height: 640,
    icon: '📱',
  },
  wear_os_watch: {
    id: 'wear_os_watch',
    name: 'Wear OS Watch',
    deviceModel: 'Samsung Galaxy Watch / Pixel Watch',
    aspectRatio: '1:1',
    width: 240,
    height: 240,
    icon: '⌚',
  },
  android_tv: {
    id: 'android_tv',
    name: 'Android TV 1080p',
    deviceModel: 'Android TV / Google TV Display',
    aspectRatio: '16:9',
    width: 640,
    height: 360,
    icon: '📺',
  },
};

interface Props {
  activeViewport: ViewportMode;
  onSelectViewport: (mode: ViewportMode) => void;
}

export const ViewportSelector: React.FC<Props> = ({ activeViewport, onSelectViewport }) => {
  const activeVP = VIEWPORTS[activeViewport] || VIEWPORTS.galaxy_s24_ultra;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Android Device Presets:</Text>
        <Text style={styles.activeMeta}>
          {activeVP.deviceModel} ({activeVP.width}×{activeVP.height}px | {activeVP.aspectRatio})
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {(Object.keys(VIEWPORTS) as ViewportMode[]).map((mode) => {
          const vp = VIEWPORTS[mode];
          const isActive = activeViewport === mode;
          return (
            <TouchableOpacity
              key={mode}
              style={[styles.btn, isActive && styles.activeBtn]}
              onPress={() => onSelectViewport(mode)}
            >
              <Text style={styles.btnIcon}>{vp.icon}</Text>
              <Text style={[styles.btnText, isActive && styles.activeBtnText]}>{vp.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  label: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  activeMeta: { color: '#cbd5e1', fontSize: 10, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 6, paddingVertical: 2 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeBtn: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  btnIcon: { fontSize: 12 },
  btnText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  activeBtnText: { color: '#ffffff' },
});
