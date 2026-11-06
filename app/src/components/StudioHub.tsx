import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type StudioItem = { id: string; title: string; description: string; icon: string };
type StudioGroup = { title: string; description: string; items: StudioItem[] };

const GROUPS: StudioGroup[] = [
  { title: 'Design & appearance', description: 'Shape the look and feel of your interface.', items: [
    { id: 'templates', title: 'Templates', description: 'Start from a ready-made design', icon: '▦' },
    { id: 'presets', title: 'Style presets', description: 'Apply reusable component styles', icon: '✦' },
    { id: 'theme', title: 'Theme studio', description: 'Colors and design systems', icon: '◐' },
    { id: 'theme_io', title: 'Theme import / export', description: 'Share and reuse theme files', icon: '⇄' },
    { id: 'font', title: 'Typography', description: 'Manage fonts and type styles', icon: 'T' },
    { id: 'spacing', title: 'Spacing & alignment', description: 'Grid, spacing and layout rules', icon: '⊞' },
  ]},
  { title: 'Assets & interaction', description: 'Bring content into your project and define behavior.', items: [
    { id: 'assets', title: 'Asset library', description: 'Images, icons and imported media', icon: '▧' },
    { id: 'svg_importer', title: 'SVG importer', description: 'Import scalable vector artwork', icon: '◇' },
    { id: 'states', title: 'Interaction states', description: 'Pressed and hover states', icon: '◉' },
    { id: 'sounds', title: 'Sound effects', description: 'Configure interface sounds', icon: '♫' },
    { id: 'transitions', title: 'Transitions', description: 'Motion and screen transitions', icon: '↝' },
    { id: 'splash', title: 'Splash screen', description: 'Design the app launch screen', icon: '✧' },
    { id: 'accessibility', title: 'Accessibility', description: 'Labels and accessible behavior', icon: '◎' },
    { id: 'i18n', title: 'Localization', description: 'Translate interface content', icon: '文' },
  ]},
  { title: 'Project & delivery', description: 'Organize, inspect, export and prepare your app.', items: [
    { id: 'projects', title: 'Projects', description: 'Open and manage design projects', icon: '▰' },
    { id: 'droid_file', title: 'DroidUI files', description: 'Import and export .dui projects', icon: '▤' },
    { id: 'code', title: 'Code preview', description: 'Inspect generated source code', icon: '</>' },
    { id: 'export_android', title: 'Android export', description: 'Prepare a native Android project', icon: '▣' },
    { id: 'deeplink', title: 'App links & icons', description: 'Deep links and app icon settings', icon: '⌘' },
    { id: 'store', title: 'Store listing', description: 'Metadata and privacy information', icon: '▧' },
    { id: 'release', title: 'Release manager', description: 'Versioning and release tags', icon: '⬆' },
  ]},
  { title: 'Quality & developer tools', description: 'Validate, profile and automate your project.', items: [
    { id: 'search', title: 'Component search', description: 'Find components and properties', icon: '⌕' },
    { id: 'tests', title: 'Test generator', description: 'Generate UI test specifications', icon: '✓' },
    { id: 'profiler', title: 'Performance profiler', description: 'Review performance signals', icon: '▥' },
    { id: 'cicd', title: 'Build automation', description: 'Create CI/CD pipeline configuration', icon: '⚙' },
  ]},
];

export const StudioHub: React.FC<{ onOpen: (tab: string) => void }> = ({ onOpen }) => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>WORKSPACE MENU</Text>
    <Text style={styles.title}>All studios</Text>
    <Text style={styles.subtitle}>Specialist tools are organized by task. Choose a studio to open it.</Text>
    {GROUPS.map(group => <View key={group.title} style={styles.group}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      <Text style={styles.groupDescription}>{group.description}</Text>
      <View style={styles.grid}>
        {group.items.map(item => <TouchableOpacity key={item.id} style={styles.card} onPress={() => onOpen(item.id)} activeOpacity={0.78}>
          <View style={styles.icon}><Text style={styles.iconText}>{item.icon}</Text></View>
          <View style={styles.cardCopy}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.cardDescription}>{item.description}</Text></View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>)}
      </View>
    </View>)}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1730' },
  content: { padding: 14, paddingBottom: 28 },
  eyebrow: { color: '#38E8F2', fontSize: 9, fontWeight: '900', letterSpacing: 1.8 },
  title: { color: '#F4F7FF', fontSize: 18, fontWeight: '900', marginTop: 3 },
  subtitle: { color: '#9AADD6', fontSize: 11, marginTop: 4, marginBottom: 15 },
  group: { marginBottom: 18 },
  groupTitle: { color: '#EAF1FF', fontSize: 13, fontWeight: '800' },
  groupDescription: { color: '#8297BF', fontSize: 10, marginTop: 3, marginBottom: 8 },
  grid: { flexDirection: 'column', gap: 8 },
  card: { width: '100%', minHeight: 66, backgroundColor: '#142342', borderColor: '#293F68', borderWidth: 1, borderRadius: 11, padding: 9, flexDirection: 'row', alignItems: 'center' },
  icon: { width: 31, height: 31, borderRadius: 9, backgroundColor: '#203D70', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  iconText: { color: '#55DDEB', fontSize: 15, fontWeight: '900' },
  cardCopy: { flex: 1 },
  cardTitle: { color: '#F4F7FF', fontSize: 12, fontWeight: '800' },
  cardDescription: { color: '#91A5CC', fontSize: 10, lineHeight: 14, marginTop: 3 },
  chevron: { color: '#65B4FF', fontSize: 19, marginLeft: 3 },
});