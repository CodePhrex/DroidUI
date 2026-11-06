import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentType, ComponentNode } from '../types/schema';

type ToolCategory = 'All' | 'Layout' | 'Text' | 'Controls' | 'Data' | 'Media' | 'Decorative';
interface ToolItem { type: ComponentType; label: string; icon: string; category: Exclude<ToolCategory, 'All'>; description: string; }

const TOOLBAR_ITEMS: ToolItem[] = [
  { type: 'Container', label: 'Container', icon: '▣', category: 'Layout', description: 'Flexible layout frame' },
  { type: 'Card', label: 'Card', icon: '▤', category: 'Layout', description: 'Surface with grouped content' },
  { type: 'Text', label: 'Text', icon: 'T', category: 'Text', description: 'Headings and body copy' },
  { type: 'Button', label: 'Button', icon: '▰', category: 'Controls', description: 'Primary action' },
  { type: 'Input', label: 'Text field', icon: '▱', category: 'Controls', description: 'Editable input field' },
  { type: 'Switch', label: 'Switch', icon: '◉', category: 'Controls', description: 'On and off control' },
  { type: 'Slider', label: 'Slider', icon: '⟷', category: 'Controls', description: 'Adjustable value' },
  { type: 'Checkbox', label: 'Checkbox', icon: '☑', category: 'Controls', description: 'Selectable option' },
  { type: 'ProgressBar', label: 'Progress', icon: '▥', category: 'Data', description: 'Completion indicator' },
  { type: 'Graph', label: 'Chart', icon: '▥', category: 'Data', description: 'Data visualization' },
  { type: 'Image', label: 'Image', icon: '▧', category: 'Media', description: 'Photo or graphic asset' },
  { type: 'SvgVector', label: 'SVG vector', icon: '◇', category: 'Media', description: 'Scalable vector artwork' },
  { type: 'AnimatedAsset', label: 'Animation', icon: '✧', category: 'Media', description: 'Animated visual element' },
  { type: 'Icon', label: 'Icon', icon: '✣', category: 'Decorative', description: 'Interface icon' },
  { type: 'Badge', label: 'Badge', icon: '⬡', category: 'Decorative', description: 'Status or label chip' },
];
const CATEGORIES: { label: ToolCategory; icon: string; accent: string }[] = [
  { label: 'All', icon: '✦', accent: '#55DDEB' },
  { label: 'Layout', icon: '▦', accent: '#65A8FF' },
  { label: 'Text', icon: 'T', accent: '#B89AFF' },
  { label: 'Controls', icon: '☷', accent: '#58D6B0' },
  { label: 'Data', icon: '▥', accent: '#FFCA72' },
  { label: 'Media', icon: '▧', accent: '#F58CCB' },
  { label: 'Decorative', icon: '✧', accent: '#A9B5FF' },
];

export const ComponentToolbar = () => {
  const { selectedNodeId, rootNode, addChildNode } = useEditorStore();
  const [category, setCategory] = useState<ToolCategory>('All');
  const [query, setQuery] = useState('');
  const findTargetContainer = (node: ComponentNode, targetId: string, currentContainerId: string): string => {
    if (node.id === targetId) return node.type === 'Container' || node.type === 'Card' ? node.id : currentContainerId;
    const nextContainerId = node.type === 'Container' || node.type === 'Card' ? node.id : currentContainerId;
    for (const child of node.children || []) {
      const found = findTargetContainer(child, targetId, nextContainerId);
      if (found !== currentContainerId || child.id === targetId) return found;
    }
    return currentContainerId;
  };
  const targetParentId = selectedNodeId ? findTargetContainer(rootNode, selectedNodeId, rootNode.id) : rootNode.id;
  const tools = useMemo(() => TOOLBAR_ITEMS.filter(item =>
    (category === 'All' || item.category === category) &&
    (item.label.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()))
  ), [category, query]);

  return <View style={styles.container}>
    <View style={styles.headingRow}>
      <View><Text style={styles.eyebrow}>CREATIVE TOOLBOX</Text><Text style={styles.title}>Add an element</Text><Text style={styles.subtitle}>Choose a tool to add it to your canvas.</Text></View>
      <View style={styles.targetPill}><Text style={styles.targetText}>Target: {targetParentId === rootNode.id ? 'Screen' : 'Selected group'}</Text></View>
    </View>
    <TextInput value={query} onChangeText={setQuery} placeholder="Search tools and elements" placeholderTextColor="#8292B4" style={styles.search} returnKeyType="search" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
      {CATEGORIES.map(item => <TouchableOpacity
        key={item.label}
        onPress={() => setCategory(item.label)}
        activeOpacity={0.78}
        accessibilityRole="button"
        accessibilityState={{ selected: category === item.label }}
        accessibilityLabel={`${item.label} elements`}
        style={[styles.categoryButton, category === item.label && styles.categoryButtonActive, category === item.label && { borderColor: item.accent }]}
      >
        <View style={[styles.categoryIconWrap, { backgroundColor: `${item.accent}20` }, category === item.label && { backgroundColor: item.accent }]}>
          <Text style={[styles.categoryIcon, { color: item.accent }, category === item.label && styles.categoryIconActive]}>{item.icon}</Text>
        </View>
        <Text style={[styles.categoryText, category === item.label && styles.categoryActiveText]}>{item.label}</Text>
        {category === item.label && <View style={[styles.categoryActiveDot, { backgroundColor: item.accent }]} />}
      </TouchableOpacity>)}
    </ScrollView>
    <ScrollView style={styles.toolScroll} contentContainerStyle={styles.toolGrid}>
      {tools.map(item => <TouchableOpacity key={item.type} style={styles.toolCard} onPress={() => addChildNode(targetParentId, item.type)} activeOpacity={0.78}>
        <View style={styles.previewTile}>
          {item.type === 'Text' ? <><View style={styles.previewTextLineWide} /><View style={styles.previewTextLine} /><View style={styles.previewTextLineShort} /></>
            : item.type === 'Button' ? <View style={styles.previewButton}><Text style={styles.previewButtonText}>Action</Text></View>
            : item.type === 'Input' ? <View style={styles.previewInput}><Text style={styles.previewMuted}>Enter text…</Text></View>
            : item.type === 'Image' || item.type === 'SvgVector' || item.type === 'AnimatedAsset' ? <View style={styles.previewMedia}><Text style={styles.previewMediaIcon}>{item.icon}</Text></View>
            : item.type === 'Graph' ? <View style={styles.previewBars}><View style={[styles.previewBar,{height:15}]} /><View style={[styles.previewBar,{height:25}]} /><View style={[styles.previewBar,{height:19}]} /><View style={[styles.previewBar,{height:31}]} /></View>
            : item.type === 'Switch' ? <View style={styles.previewSwitch}><View style={styles.previewSwitchDot} /></View>
            : item.type === 'Checkbox' ? <View style={styles.previewCheck}><Text style={styles.previewCheckText}>✓</Text><View style={styles.previewTextLine} /></View>
            : <><View style={styles.previewShape} /><View style={styles.previewTextLineWide} /><View style={styles.previewTextLineShort} /></>}
        </View>
        <View style={styles.toolCardMeta}><Text style={styles.toolLabel}>{item.label}</Text><Text style={styles.toolDescription} numberOfLines={2}>{item.description}</Text><Text style={styles.addLabel}>＋ Add to canvas</Text></View>
      </TouchableOpacity>)}
      {tools.length === 0 && <Text style={styles.empty}>No matching tools. Try another search.</Text>}
    </ScrollView>
  </View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 14, paddingTop: 12, backgroundColor: '#0D1730' },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  eyebrow: { color: '#38E8F2', fontSize: 9, fontWeight: '900', letterSpacing: 1.8 },
  title: { color: '#F4F7FF', fontSize: 17, fontWeight: '800', marginTop: 2 },
  subtitle: { color: '#9AADD6', fontSize: 11, marginTop: 3 },
  targetPill: { backgroundColor: '#18294D', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6, borderWidth: 1, borderColor: '#2A4679' },
  targetText: { color: '#BBD0F5', fontSize: 9, fontWeight: '700' },
  search: { backgroundColor: '#111F3D', color: '#F4F7FF', borderColor: '#2A416C', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 12, marginBottom: 9 },
  categoryRow: { gap: 8, paddingBottom: 12, paddingTop: 2, paddingHorizontal: 1 },
  categoryButton: { minWidth: 76, minHeight: 62, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 13, backgroundColor: '#142342', borderWidth: 1, borderColor: '#2A416C', alignItems: 'center', justifyContent: 'center', gap: 5 },
  categoryButtonActive: { backgroundColor: '#1C3157', borderWidth: 1.5, shadowColor: '#398BFF', shadowOpacity: 0.2, shadowRadius: 7, elevation: 3 },
  categoryIconWrap: { width: 25, height: 25, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  categoryIcon: { fontSize: 15, fontWeight: '900' },
  categoryIconActive: { color: '#081329' },
  categoryText: { color: '#A9B9D9', fontSize: 9, fontWeight: '800', letterSpacing: 0.2 },
  categoryActiveText: { color: '#FFFFFF' },
  categoryActiveDot: { position: 'absolute', top: 5, right: 6, width: 5, height: 5, borderRadius: 3 },
  toolScroll: { flex: 1 },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, paddingBottom: 18 },
  toolCard: { flexGrow: 1, flexBasis: '46%', minWidth: 130, minHeight: 158, flexDirection: 'column', alignItems: 'stretch', backgroundColor: '#142342', borderWidth: 1, borderColor: '#293F68', borderRadius: 12, padding: 9, gap: 8 },
  toolCardMeta: { flex: 1, minWidth: 0, width: '100%' },
  previewTile: { width: '100%', height: 76, borderRadius: 9, backgroundColor: '#0B1530', borderWidth: 1, borderColor: '#2B4777', alignItems: 'center', justifyContent: 'center', padding: 8, gap: 5 },
  previewTextLineWide: { width: '90%', height: 5, borderRadius: 3, backgroundColor: '#DCE8FF' },
  previewTextLine: { width: '72%', height: 4, borderRadius: 3, backgroundColor: '#7795C8' },
  previewTextLineShort: { width: '48%', height: 4, borderRadius: 3, backgroundColor: '#536F9F', alignSelf: 'flex-start', marginLeft: 3 },
  previewButton: { backgroundColor: '#398BFF', borderRadius: 6, paddingHorizontal: 11, paddingVertical: 7 },
  previewButtonText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  previewInput: { width: '100%', height: 27, borderRadius: 5, borderWidth: 1, borderColor: '#5876A8', justifyContent: 'center', paddingHorizontal: 5 },
  previewMuted: { color: '#7892BE', fontSize: 7 },
  previewMedia: { width: 49, height: 52, borderRadius: 7, backgroundColor: '#1A3765', alignItems: 'center', justifyContent: 'center' },
  previewMediaIcon: { color: '#59DDEC', fontSize: 24 },
  previewBars: { height: 48, flexDirection: 'row', alignItems: 'flex-end', gap: 5 },
  previewBar: { width: 8, borderRadius: 3, backgroundColor: '#38E8F2' },
  previewSwitch: { width: 42, height: 24, borderRadius: 12, backgroundColor: '#245EB7', justifyContent: 'center', padding: 3 },
  previewSwitchDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF', alignSelf: 'flex-end' },
  previewCheck: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  previewCheckText: { color: '#FFFFFF', backgroundColor: '#398BFF', overflow: 'hidden', borderRadius: 3, paddingHorizontal: 3, fontSize: 11 },
  previewShape: { width: 35, height: 25, borderRadius: 6, backgroundColor: '#234B84', borderWidth: 1, borderColor: '#55DDEB' },
  iconTile: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#203D70', alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  toolIcon: { color: '#55DDEB', fontSize: 19, fontWeight: '800' },
  toolLabel: { color: '#F4F7FF', fontSize: 11, fontWeight: '800' },
  toolDescription: { color: '#91A5CC', fontSize: 8, marginTop: 3, lineHeight: 11 },
  addLabel: { color: '#65B4FF', fontSize: 9, fontWeight: '800', marginTop: 6 },
  empty: { color: '#A9B9D9', fontSize: 12, padding: 16 },
});