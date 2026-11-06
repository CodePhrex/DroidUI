import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentNode } from '../types/schema';

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
{
    id: 'finance_overview', name: 'Fintech Wallet Dashboard', deviceTag: 'Phone • Tablet',
    description: 'A complete finance home screen with balance summary, spending progress, transaction rows, account shortcuts and a strong primary action.',
    icon: '💳',
    node: { id: 'finance_root', type: 'Container', style: { flexDirection: 'column', padding: 16, backgroundColor: '#0B1224', borderRadius: 18, gap: 12 }, children: [
      { id: 'finance_greeting', type: 'Text', props: { text: 'Good morning, Alex 👋' }, style: { fontSize: 19, color: '#F8FAFC', fontWeight: 'bold' } },
      { id: 'finance_balance', type: 'Card', style: { padding: 16, backgroundColor: '#173B72', borderRadius: 16, gap: 7 }, children: [
        { id: 'finance_label', type: 'Text', props: { text: 'TOTAL BALANCE' }, style: { fontSize: 10, color: '#B9D7FF', fontWeight: 'bold' } },
        { id: 'finance_amount', type: 'Text', props: { text: '$24,680.50' }, style: { fontSize: 29, color: '#FFFFFF', fontWeight: 'bold' } },
        { id: 'finance_change', type: 'Badge', props: { text: '↗ 12.8% this month' }, style: { backgroundColor: '#126B64', padding: 6, borderRadius: 14 } },
        { id: 'finance_send', type: 'Button', props: { label: '＋  Send money' }, style: { backgroundColor: '#38E8F2', color: '#081126', padding: 11, borderRadius: 9, alignItems: 'center' } }
      ]},
      { id: 'finance_actions_title', type: 'Text', props: { text: 'Quick actions' }, style: { fontSize: 15, color: '#F8FAFC', fontWeight: 'bold' } },
      { id: 'finance_actions', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 }, children: [
        { id: 'finance_a1', type: 'Card', style: { flex: 1, padding: 10, backgroundColor: '#17243D', borderRadius: 10 }, children: [{ id: 'finance_a1t', type: 'Text', props: { text: '↗ Transfer' }, style: { color: '#DCE8FF', fontSize: 10 } }] },
        { id: 'finance_a2', type: 'Card', style: { flex: 1, padding: 10, backgroundColor: '#17243D', borderRadius: 10 }, children: [{ id: 'finance_a2t', type: 'Text', props: { text: '▣ Cards' }, style: { color: '#DCE8FF', fontSize: 10 } }] },
        { id: 'finance_a3', type: 'Card', style: { flex: 1, padding: 10, backgroundColor: '#17243D', borderRadius: 10 }, children: [{ id: 'finance_a3t', type: 'Text', props: { text: '◷ History' }, style: { color: '#DCE8FF', fontSize: 10 } }] }
      ]},
      { id: 'finance_spend_title', type: 'Text', props: { text: 'Monthly spending' }, style: { fontSize: 15, color: '#F8FAFC', fontWeight: 'bold' } },
      { id: 'finance_spend', type: 'ProgressBar', props: { label: '$1,840 of $3,000 budget', progress: 61, barColor: '#38E8F2' }, style: { backgroundColor: '#17243D', padding: 10, borderRadius: 10 } },
      { id: 'finance_recent', type: 'Text', props: { text: 'Recent activity' }, style: { fontSize: 15, color: '#F8FAFC', fontWeight: 'bold' } },
      { id: 'finance_tx1', type: 'Card', style: { padding: 11, backgroundColor: '#17243D', borderRadius: 10 }, children: [{ id: 'finance_tx1t', type: 'Text', props: { text: '☕  Coffee House                 -$6.80' }, style: { color: '#DCE8FF', fontSize: 11 } }] },
      { id: 'finance_tx2', type: 'Card', style: { padding: 11, backgroundColor: '#17243D', borderRadius: 10 }, children: [{ id: 'finance_tx2t', type: 'Text', props: { text: '↗  Salary deposit             +$3,850' }, style: { color: '#38E8F2', fontSize: 11 } }] }
    ]}
  },
  {
    id: 'commerce_storefront', name: 'Premium Commerce Storefront', deviceTag: 'Phone • Tablet',
    description: 'A polished shopping landing page with campaign hero, category chips, featured product cards, price hierarchy and shopping CTA.',
    icon: '🛍️',
    node: { id: 'shop_root', type: 'Container', style: { flexDirection: 'column', padding: 15, backgroundColor: '#F5F3EF', borderRadius: 16, gap: 11 }, children: [
      { id: 'shop_brand', type: 'Text', props: { text: 'ATELIER  /  NEW SEASON' }, style: { fontSize: 11, color: '#20252D', fontWeight: 'bold' } },
      { id: 'shop_hero', type: 'Card', style: { padding: 18, backgroundColor: '#D9D1C4', borderRadius: 14, gap: 8 }, children: [
        { id: 'shop_kicker', type: 'Text', props: { text: 'THE EDIT • 2026' }, style: { fontSize: 10, color: '#5D554B', fontWeight: 'bold' } },
        { id: 'shop_title', type: 'Text', props: { text: 'Objects for a better everyday.' }, style: { fontSize: 25, color: '#1D242B', fontWeight: 'bold' } },
        { id: 'shop_desc', type: 'Text', props: { text: 'Thoughtful essentials. Exceptional details.' }, style: { fontSize: 12, color: '#514C45' } },
        { id: 'shop_cta', type: 'Button', props: { label: 'Explore collection  →' }, style: { backgroundColor: '#1D242B', padding: 11, borderRadius: 8, alignItems: 'center' } }
      ]},
      { id: 'shop_categories', type: 'Text', props: { text: 'Discover   •   Clothing   •   Objects   •   Living' }, style: { fontSize: 11, color: '#343B43', fontWeight: 'bold' } },
      { id: 'shop_featured', type: 'Text', props: { text: 'Featured pieces' }, style: { fontSize: 18, color: '#20252D', fontWeight: 'bold' } },
      { id: 'shop_product1', type: 'Card', style: { padding: 13, backgroundColor: '#FFFFFF', borderRadius: 12, gap: 5 }, children: [
        { id: 'shop_product1_art', type: 'Container', style: { height: 90, backgroundColor: '#C6B8A5', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, children: [{ id: 'shop_product1_icon', type: 'Text', props: { text: '✦  SIGNATURE COLLECTION  ✦' }, style: { color: '#54483A', fontSize: 10, fontWeight: 'bold' } }] },
        { id: 'shop_product1_name', type: 'Text', props: { text: 'Everyday Essential Jacket' }, style: { fontSize: 13, color: '#20252D', fontWeight: 'bold' } },
        { id: 'shop_product1_price', type: 'Text', props: { text: '$148.00   •   New arrival' }, style: { fontSize: 11, color: '#65615A' } },
        { id: 'shop_product1_btn', type: 'Button', props: { label: 'Add to bag' }, style: { backgroundColor: '#20252D', padding: 10, borderRadius: 7, alignItems: 'center' } }
      ]}
    ]}
  },
  {
    id: 'social_creator_profile', name: 'Creator Social Profile', deviceTag: 'Phone',
    description: 'A complete creator profile with identity header, stats, follow action, bio, highlight tiles and a visual post grid.',
    icon: '✨',
    node: { id: 'creator_root', type: 'Container', style: { flexDirection: 'column', padding: 15, backgroundColor: '#101426', borderRadius: 16, gap: 10 }, children: [
      { id: 'creator_top', type: 'Container', style: { flexDirection: 'row', alignItems: 'center', gap: 12 }, children: [
        { id: 'creator_avatar', type: 'Container', style: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#7257D9', alignItems: 'center', justifyContent: 'center' }, children: [{ id: 'creator_avatar_text', type: 'Text', props: { text: 'JD' }, style: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' } }] },
        { id: 'creator_identity', type: 'Container', style: { flex: 1, gap: 4 }, children: [
          { id: 'creator_name', type: 'Text', props: { text: 'Jordan Davis  ✓' }, style: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' } },
          { id: 'creator_handle', type: 'Text', props: { text: '@jordandcreates' }, style: { color: '#A5B0D0', fontSize: 11 } },
          { id: 'creator_stats', type: 'Text', props: { text: '128 posts  •  24.8K followers' }, style: { color: '#D7DDF1', fontSize: 10 } }
        ]}
      ]},
      { id: 'creator_follow', type: 'Button', props: { label: '＋  Follow creator' }, style: { backgroundColor: '#7657E8', padding: 11, borderRadius: 9, alignItems: 'center' } },
      { id: 'creator_bio', type: 'Text', props: { text: 'Designer • storyteller • building things that move culture.\nNew work every week ↓' }, style: { color: '#D8DEF0', fontSize: 12, lineHeight: 18 } },
      { id: 'creator_highlights', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 }, children: [
        { id: 'creator_h1', type: 'Card', style: { flex: 1, padding: 10, backgroundColor: '#27305A', borderRadius: 10 }, children: [{ id: 'creator_h1t', type: 'Text', props: { text: '◉  Work' }, style: { color: '#FFFFFF', fontSize: 10 } }] },
        { id: 'creator_h2', type: 'Card', style: { flex: 1, padding: 10, backgroundColor: '#27305A', borderRadius: 10 }, children: [{ id: 'creator_h2t', type: 'Text', props: { text: '♫  Audio' }, style: { color: '#FFFFFF', fontSize: 10 } }] },
        { id: 'creator_h3', type: 'Card', style: { flex: 1, padding: 10, backgroundColor: '#27305A', borderRadius: 10 }, children: [{ id: 'creator_h3t', type: 'Text', props: { text: '☆  About' }, style: { color: '#FFFFFF', fontSize: 10 } }] }
      ]},
      { id: 'creator_gridtitle', type: 'Text', props: { text: 'Latest posts' }, style: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' } },
      { id: 'creator_grid', type: 'Container', style: { flexDirection: 'row', gap: 7 }, children: [
        { id: 'creator_post1', type: 'Card', style: { flex: 1, height: 76, backgroundColor: '#A15F73', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, children: [{ id: 'creator_post1t', type: 'Text', props: { text: '01' }, style: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' } }] },
        { id: 'creator_post2', type: 'Card', style: { flex: 1, height: 76, backgroundColor: '#3D7890', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, children: [{ id: 'creator_post2t', type: 'Text', props: { text: '02' }, style: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' } }] },
        { id: 'creator_post3', type: 'Card', style: { flex: 1, height: 76, backgroundColor: '#8C754D', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, children: [{ id: 'creator_post3t', type: 'Text', props: { text: '03' }, style: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' } }] }
      ]}
    ]}
  },
  {
    id: 'music_player', name: 'Music Player Experience', deviceTag: 'Phone • Tablet',
    description: 'A full now-playing screen with album artwork treatment, track metadata, playback controls, progress and queue shortcut.',
    icon: '🎧',
    node: { id: 'music_root', type: 'Container', style: { flexDirection: 'column', padding: 18, backgroundColor: '#111027', borderRadius: 18, alignItems: 'center', gap: 12 }, children: [
      { id: 'music_header', type: 'Text', props: { text: 'NOW PLAYING  •  YOUR MIX' }, style: { color: '#B8B0E8', fontSize: 10, fontWeight: 'bold' } },
      { id: 'music_art', type: 'Container', style: { width: '100%', height: 180, backgroundColor: '#6245A8', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, children: [{ id: 'music_art_icon', type: 'Text', props: { text: '♫' }, style: { color: '#FFFFFF', fontSize: 76, fontWeight: 'bold' } }] },
      { id: 'music_track', type: 'Text', props: { text: 'Midnight in Motion' }, style: { color: '#FFFFFF', fontSize: 21, fontWeight: 'bold' } },
      { id: 'music_artist', type: 'Text', props: { text: 'The New Frequencies' }, style: { color: '#B8B0E8', fontSize: 12 } },
      { id: 'music_progress', type: 'ProgressBar', props: { label: '02:14                                  04:08', progress: 54, barColor: '#A98AFF' }, style: { width: '100%', padding: 8 } },
      { id: 'music_controls', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: 'center' }, children: [
        { id: 'music_shuffle', type: 'Text', props: { text: '⤨' }, style: { color: '#C7BDF2', fontSize: 22 } },
        { id: 'music_prev', type: 'Text', props: { text: '◀◀' }, style: { color: '#FFFFFF', fontSize: 19 } },
        { id: 'music_play', type: 'Button', props: { label: 'Ⅱ' }, style: { backgroundColor: '#9B7CF5', padding: 15, borderRadius: 28, alignItems: 'center' } },
        { id: 'music_next', type: 'Text', props: { text: '▶▶' }, style: { color: '#FFFFFF', fontSize: 19 } },
        { id: 'music_queue', type: 'Text', props: { text: '☷' }, style: { color: '#C7BDF2', fontSize: 22 } }
      ]}
    ]}
  },];

export const TemplateLibrary = () => {
  const { selectedNodeId, rootNode, insertTemplate } = useEditorStore();
  const targetParentId = selectedNodeId || rootNode.id;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Phone', 'Dashboard', 'Commerce', 'Social', 'Media', 'Wearable', 'TV'];
  const filteredTemplates = useMemo(() => PREBUILT_TEMPLATES.filter(item => {
    const matchesQuery = (item.name + ' ' + item.description + ' ' + item.deviceTag).toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || item.deviceTag.toLowerCase().includes(category.toLowerCase()) || item.name.toLowerCase().includes(category.toLowerCase()) || (category === 'Dashboard' && /dashboard|analytics|wallet/i.test(item.name));
    return matchesQuery && matchesCategory;
  }), [query, category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device-Tailored Component Templates</Text>
      <Text style={styles.subtitle}>Complete, editable screens and components • Target: {targetParentId === rootNode.id ? 'Screen' : 'Selected group'}</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search templates and devices" placeholderTextColor="#8194B8" style={styles.search} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {categories.map(value => <TouchableOpacity key={value} onPress={() => setCategory(value)} style={[styles.category, category === value && styles.categoryActive]}><Text style={[styles.categoryText, category === value && styles.categoryTextActive]}>{value}</Text></TouchableOpacity>)}
      </ScrollView>
      <ScrollView style={{ marginTop: 8 }}>
        {filteredTemplates.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => insertTemplate(targetParentId, item.node)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.thumbnail}>
                <View style={[styles.thumbHero, { backgroundColor: item.id === 'commerce_storefront' ? '#BBAA92' : item.id === 'music_player' ? '#7455B7' : item.id === 'social_creator_profile' ? '#6953B5' : item.id === 'finance_overview' ? '#235B9C' : '#25446F' }]}><Text style={styles.thumbHeroText}>{item.icon}</Text></View>
                <View style={styles.thumbLines}><View style={styles.thumbLineWide} /><View style={styles.thumbLine} /><View style={styles.thumbButton} /></View>
                <View style={styles.thumbFooter}><View style={styles.thumbDot} /><View style={styles.thumbDot} /><View style={styles.thumbDot} /></View>
              </View>
              <View style={styles.cardIconWrap}><Text style={styles.cardIcon}>{item.icon}</Text></View>
              <View style={styles.cardMeta}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.deviceTag}>Tag: {item.deviceTag}</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <View style={styles.insertBtn}>
              <Text style={styles.insertBtnText}>+ Insert Template</Text>
            </View>
          </TouchableOpacity>
        ))}
        {filteredTemplates.length === 0 && <Text style={styles.empty}>No templates match that search. Try another category.</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' },
  subtitle: { fontSize: 11, color: '#38bdf8', marginBottom: 6 },
  card: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  search: { backgroundColor: '#111F3D', color: '#F4F7FF', borderColor: '#2A416C', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 12, marginTop: 8 },
  categories: { gap: 7, paddingVertical: 9 },
  category: { backgroundColor: '#172744', borderWidth: 1, borderColor: '#2A416C', borderRadius: 16, paddingHorizontal: 11, paddingVertical: 6 },
  categoryActive: { backgroundColor: '#245EB7', borderColor: '#398BFF' },
  categoryText: { color: '#A9B9D9', fontSize: 10, fontWeight: '700' },
  categoryTextActive: { color: '#FFFFFF' },
  thumbnail: { width: 82, height: 104, backgroundColor: '#0D1730', borderRadius: 8, borderWidth: 1, borderColor: '#3A5076', padding: 6, justifyContent: 'space-between' },
  thumbHero: { height: 37, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  thumbHeroText: { color: '#FFFFFF', fontSize: 19, fontWeight: 'bold' },
  thumbLines: { gap: 4, paddingHorizontal: 2 },
  thumbLineWide: { width: '92%', height: 4, borderRadius: 3, backgroundColor: '#D6E4FF' },
  thumbLine: { width: '66%', height: 3, borderRadius: 3, backgroundColor: '#8299C2' },
  thumbButton: { width: '58%', height: 7, borderRadius: 3, backgroundColor: '#398BFF', marginTop: 2 },
  thumbFooter: { flexDirection: 'row', gap: 5 },
  thumbDot: { width: 13, height: 5, borderRadius: 3, backgroundColor: '#304A75' },
  cardIconWrap: { width: 24, alignItems: 'center' },
  empty: { color: '#A9B9D9', fontSize: 12, padding: 16 },
  cardIcon: { fontSize: 20 },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#ffffff' },
  deviceTag: { fontSize: 10, color: '#38bdf8', fontWeight: '600' },
  cardDesc: { fontSize: 11, color: '#94a3b8', marginBottom: 8 },
  insertBtn: { backgroundColor: '#2563eb', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, alignSelf: 'flex-start' },
  insertBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
});
