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
const CATEGORIES: ToolCategory[] = ['All', 'Layout', 'Text', 'Controls', 'Data', 'Media', 'Decorative'];

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
      {CATEGORIES.map(item => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.categoryChip, category === item && styles.categoryActive]}><Text style={[styles.categoryText, category === item && styles.categoryActiveText]}>{item}</Text></TouchableOpacity>)}
    </ScrollView>
    <ScrollView style={styles.toolScroll} contentContainerStyle={styles.toolGrid}>
      {tools.map(item => <TouchableOpacity key={item.type} style={styles.toolCard} onPress={() => addChildNode(targetParentId, item.type)} activeOpacity={0.78}>
        <View style={styles.iconTile}><Text style={styles.toolIcon}>{item.icon}</Text></View><Text style={styles.toolLabel}>{item.label}</Text><Text style={styles.toolDescription} numberOfLines={2}>{item.description}</Text><Text style={styles.addLabel}>＋ Add</Text>
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
  categoryRow: { gap: 7, paddingBottom: 10 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, backgroundColor: '#152441', borderWidth: 1, borderColor: '#263B61' },
  categoryActive: { backgroundColor: '#245EB7', borderColor: '#398BFF' },
  categoryText: { color: '#A9B9D9', fontSize: 10, fontWeight: '700' },
  categoryActiveText: { color: '#FFFFFF' },
  toolScroll: { flex: 1 },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, paddingBottom: 18 },
  toolCard: { width: '31%', minHeight: 112, backgroundColor: '#142342', borderWidth: 1, borderColor: '#293F68', borderRadius: 12, padding: 9 },
  iconTile: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#203D70', alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  toolIcon: { color: '#55DDEB', fontSize: 19, fontWeight: '800' },
  toolLabel: { color: '#F4F7FF', fontSize: 11, fontWeight: '800' },
  toolDescription: { color: '#91A5CC', fontSize: 8, marginTop: 3, lineHeight: 11 },
  addLabel: { color: '#65B4FF', fontSize: 9, fontWeight: '800', marginTop: 6 },
  empty: { color: '#A9B9D9', fontSize: 12, padding: 16 },
});