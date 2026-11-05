import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentNode } from '../types/schema';
import { DESIGN_PRESETS, DESIGN_PRESET_CATEGORIES } from './designPresets';

export const PREBUILT_TEMPLATES: { id: string; name: string; deviceTag: string; description: string; icon: string; node: ComponentNode }[] = [
  {
    id: 'login_form',
    name: 'Login Form Card',
    deviceTag: 'Phone / Universal',
    description: 'User authentication block with email input, password field, and primary sign-in button.',
    icon: '🔐',
    node: {
      id: 'login_card',
      type: 'Card',
      style: { flexDirection: 'column', padding: 16, backgroundColor: '#1e293b', borderRadius: 12, marginVertical: 6 },
      animation: { preset: 'fadeIn', duration: 400, delay: 100 },
      children: [
        { id: 'lbl_title', type: 'Text', props: { text: 'Welcome Back' }, style: { fontSize: 18, color: '#ffffff', fontWeight: 'bold', marginBottom: 4 } },
        { id: 'lbl_sub', type: 'Text', props: { text: 'Sign in to access your account' }, style: { fontSize: 12, color: '#94a3b8', marginBottom: 12 } },
        { id: 'inp_email', type: 'Input', props: { placeholder: 'user@domain.com' }, style: { marginBottom: 8 } },
        { id: 'inp_pass', type: 'Input', props: { placeholder: '••••••••' }, style: { marginBottom: 12 } },
        { id: 'chk_remember', type: 'Checkbox', props: { label: 'Remember login session', checked: true }, style: { marginBottom: 14 } },
        { id: 'btn_login', type: 'Button', props: { label: 'Sign In' }, style: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center' } },
      ],
    },
  },
  {
    id: 'analytics_kpi',
    name: 'Analytics KPI Dashboard Tile',
    deviceTag: 'Galaxy S24 / Pixel 8',
    description: 'KPI summary tile with progress bar, revenue growth badge, and data chart.',
    icon: '📊',
    node: {
      id: 'kpi_card',
      type: 'Card',
      style: { flexDirection: 'column', padding: 16, backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginVertical: 6 },
      children: [
        {
          id: 'kpi_header',
          type: 'Container',
          style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
          children: [
            { id: 'kpi_title', type: 'Text', props: { text: 'Monthly Revenue' }, style: { fontSize: 12, color: '#94a3b8', fontWeight: 'bold' } },
            { id: 'kpi_badge', type: 'Badge', props: { text: '+24.8% Growth' }, style: { backgroundColor: '#10b981', padding: 4, borderRadius: 12 } },
          ],
        },
        { id: 'kpi_val', type: 'Text', props: { text: '$128,450.00' }, style: { fontSize: 24, color: '#38bdf8', fontWeight: 'bold', marginBottom: 10 } },
        { id: 'kpi_prog', type: 'ProgressBar', style: {}, props: { label: 'Target Completion', progress: 82, barColor: '#38bdf8' } },
        { id: 'kpi_chart', type: 'Graph', style: {}, props: { title: 'Q3 Growth Trend', values: [45, 60, 55, 80, 75, 95] } },
      ],
    },
  },
  {
    id: 's24_hero_dashboard',
    name: 'Galaxy S24 Flagship Quick Settings',
    deviceTag: 'Galaxy S24 Ultra',
    description: 'Modern glassmorphism device status banner with system toggles and status indicators.',
    icon: '📱',
    node: {
      id: 's24_hero',
      type: 'Card',
      style: { flexDirection: 'column', padding: 16, backgroundColor: 'rgba(30, 41, 59, 0.9)', borderRadius: 16, borderWidth: 1, borderColor: '#38bdf8', marginVertical: 6 },
      children: [
        {
          id: 's24_row1',
          type: 'Container',
          style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
          children: [
            { id: 's24_dev', type: 'Text', props: { text: 'Galaxy S24 Ultra' }, style: { fontSize: 14, color: '#f8fafc', fontWeight: 'bold' } },
            { id: 's24_bat', type: 'Badge', props: { text: '🔋 98% Super Fast' }, style: { backgroundColor: '#3b82f6' } },
          ],
        },
        { id: 's24_sw1', type: 'Switch', style: {}, props: { label: 'Adaptive 120Hz Refresh', value: true } },
        { id: 's24_sw2', type: 'Switch', style: {}, props: { label: 'Galaxy AI System Protect', value: true } },
      ],
    },
  },
  {
    id: 'pixel_fold_dual_pane',
    name: 'Pixel Fold Dual-Pane Dashboard',
    deviceTag: 'Pixel Fold / Tablet',
    description: 'Side-by-side 2-column layout designed for wide screen foldables and Android tablets.',
    icon: '📖',
    node: {
      id: 'fold_container',
      type: 'Container',
      style: { flexDirection: 'row', padding: 12, backgroundColor: '#0f172a', borderRadius: 12, gap: 10, marginVertical: 6 },
      children: [
        {
          id: 'fold_pane_left',
          type: 'Card',
          style: { flex: 1, padding: 12, backgroundColor: '#1e293b', borderRadius: 10 },
          children: [
            { id: 'p1_title', type: 'Text', props: { text: 'System Status' }, style: { fontSize: 14, color: '#38bdf8', fontWeight: 'bold', marginBottom: 8 } },
            { id: 'p1_prog', type: 'ProgressBar', style: {}, props: { label: 'CPU Load', progress: 42, barColor: '#10b981' } },
          ],
        },
        {
          id: 'fold_pane_right',
          type: 'Card',
          style: { flex: 1, padding: 12, backgroundColor: '#1e293b', borderRadius: 10 },
          children: [
            { id: 'p2_title', type: 'Text', props: { text: 'Quick Controls' }, style: { fontSize: 14, color: '#f8fafc', fontWeight: 'bold', marginBottom: 8 } },
            { id: 'p2_btn', type: 'Button', props: { label: 'Sync Workspace' }, style: { backgroundColor: '#3b82f6', padding: 8, borderRadius: 6, alignItems: 'center' } },
          ],
        },
      ],
    },
  },
  {
    id: 'wear_os_card',
    name: 'Wear OS Smartwatch Fitness Tile',
    deviceTag: 'Galaxy Watch / Pixel Watch',
    description: 'Compact circular smartwatch layout with heart rate stats, step progress, and action button.',
    icon: '⌚',
    node: {
      id: 'watch_tile',
      type: 'Card',
      style: { flexDirection: 'column', padding: 12, backgroundColor: '#000000', borderRadius: 24, borderWidth: 2, borderColor: '#3b82f6', alignItems: 'center', marginVertical: 6 },
      children: [
        { id: 'w_icon', type: 'Icon', props: { iconSymbol: '❤️' }, style: { fontSize: 24, color: '#ef4444' } },
        { id: 'w_hr', type: 'Text', props: { text: '138 BPM' }, style: { fontSize: 18, color: '#ffffff', fontWeight: 'bold', marginVertical: 2 } },
        { id: 'w_prog', type: 'ProgressBar', style: {}, props: { label: 'Steps', progress: 78, barColor: '#10b981' } },
        { id: 'w_btn', type: 'Button', props: { label: 'Start Run' }, style: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginTop: 6 } },
      ],
    },
  },
  {
    id: 'tv_hero_banner',
    name: 'Android TV Media Showcase Banner',
    deviceTag: 'Android TV 1080p',
    description: 'High-impact 16:9 landscape video card with rating stars, genre tags, and play CTA.',
    icon: '📺',
    node: {
      id: 'tv_banner',
      type: 'Card',
      style: { flexDirection: 'column', padding: 16, backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', marginVertical: 6 },
      children: [
        { id: 'tv_badge', type: 'Badge', props: { text: '⭐ 4.9 | 4K Ultra HD' }, style: { backgroundColor: '#f59e0b', marginBottom: 6 } },
        { id: 'tv_title', type: 'Text', props: { text: 'Cyberpunk Mobile Warfare' }, style: { fontSize: 20, color: '#ffffff', fontWeight: 'bold', marginBottom: 4 } },
        { id: 'tv_desc', type: 'Text', props: { text: 'Stream the ultimate high-framerate action series natively on Android TV.' }, style: { fontSize: 12, color: '#cbd5e1', marginBottom: 12 } },
        { id: 'tv_btn', type: 'Button', props: { label: '▶ Play Feature' }, style: { backgroundColor: '#ef4444', padding: 10, borderRadius: 8, alignItems: 'center' } },
      ],
    },
  },
];

type CatalogItem = { id: string; name: string; deviceTag?: string; description: string; icon?: string; category: string; node: ComponentNode };

export const TemplateLibrary = () => {
  const { selectedNodeId, rootNode, insertTemplate, applyTemplateAsProject } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const targetParentId = selectedNodeId || rootNode.id;
  const catalog: CatalogItem[] = useMemo(() => [
    ...PREBUILT_TEMPLATES.map((item, index) => ({
      ...item,
      category: index < 2 ? 'Component Kits' : 'Complete Screens',
    })),
    ...DESIGN_PRESETS.map((item) => ({ ...item, icon: '✦', deviceTag: item.styleName })),
  ], []);
  const categories = ['All', ...DESIGN_PRESET_CATEGORIES];
  const filtered = catalog.filter((item) =>
    (activeCategory === 'All' || item.category === activeCategory) &&
    (item.name + ' ' + item.description + ' ' + item.category).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Design Presets & UI Kits</Text>
      <Text style={styles.subtitle}>Start a complete design or insert a reusable component kit into [{targetParentId}]</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search screens, headers, forms, cards..."
        placeholderTextColor="#94a3b8"
        style={styles.search}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((category) => (
          <TouchableOpacity key={category} onPress={() => setActiveCategory(category)} style={[styles.categoryChip, activeCategory === category && styles.categoryActive]}>
            <Text style={[styles.categoryText, activeCategory === category && styles.categoryTextActive]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.resultCount}>{filtered.length} PRELOADED DESIGNS & COMPONENT KITS</Text>
      <ScrollView style={{ marginTop: 8 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon || '✦'}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.deviceTag}>{item.category} · {item.deviceTag || 'Universal'}</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.insertBtn} onPress={() => insertTemplate(targetParentId, item.node)}>
                <Text style={styles.insertBtnText}>＋ Insert into canvas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.startBtn} onPress={() => applyTemplateAsProject(item.node, item.name)}>
                <Text style={styles.startBtnText}>Use as starting design</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {filtered.length === 0 && <Text style={styles.empty}>No matching presets. Try another search or category.</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 17, fontWeight: '900', color: '#f8fafc', letterSpacing: 0.2 },
  subtitle: { fontSize: 11, color: '#94a3b8', marginTop: 4, marginBottom: 8, lineHeight: 16 },
  search: { backgroundColor: '#0f172a', color: '#f8fafc', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 12 },
  categoryRow: { flexDirection: 'row', gap: 7, paddingVertical: 10 },
  categoryChip: { borderWidth: 1, borderColor: '#475569', borderRadius: 18, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: '#1e293b' },
  categoryActive: { backgroundColor: '#2563eb', borderColor: '#60a5fa' },
  categoryText: { color: '#cbd5e1', fontSize: 10, fontWeight: '600' },
  categoryTextActive: { color: '#ffffff' },
  resultCount: { color: '#38bdf8', fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginTop: 2 },
  card: { backgroundColor: '#1e293b', padding: 13, borderRadius: 13, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 5 },
  cardIcon: { fontSize: 23, width: 30, textAlign: 'center' },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: '#ffffff' },
  deviceTag: { fontSize: 9, color: '#38bdf8', fontWeight: '700', marginTop: 3 },
  cardDesc: { fontSize: 11, color: '#cbd5e1', marginBottom: 10, lineHeight: 16 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  insertBtn: { backgroundColor: '#2563eb', paddingVertical: 9, paddingHorizontal: 11, borderRadius: 8, flexGrow: 1, alignItems: 'center' },
  insertBtnText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  startBtn: { backgroundColor: '#334155', paddingVertical: 9, paddingHorizontal: 11, borderRadius: 8, flexGrow: 1, alignItems: 'center', borderWidth: 1, borderColor: '#64748b' },
  startBtnText: { color: '#e2e8f0', fontSize: 10, fontWeight: '800' },
  empty: { color: '#94a3b8', textAlign: 'center', padding: 24, fontSize: 12 },
});
