import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useEditorStore } from '../store/useEditorStore';
import { createAssetId } from '../storage/assetManagement';
import { exportSvgAsset, svgToDataUri, validateAndNormalizeSvg } from '../storage/svgAsset';

export interface SvgPresetItem { id: string; name: string; category: string; svgXml: string; defaultColor: string; iconSymbol: string; }

export const SVG_PRESETS: SvgPresetItem[] = [
  { id: 'android_mascot', name: 'Android Bot Mascot', category: 'Branding', iconSymbol: '🤖', defaultColor: '#a4c639', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#a4c639" d="M6 18c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9H6v9zM7 3.5L5.4 1.9 4 3.3l1.8 1.8C4.7 6.1 4 7.5 4 9h16c0-1.5-.7-2.9-1.8-3.9L20 3.3l-1.4-1.4L17 3.5C15.6 2.6 13.9 2 12 2s-3.6.6-5 1.5z"/></svg>' },
  { id: 'star_sparkle', name: 'Star Rating Sparkle', category: 'Symbols', iconSymbol: '⭐', defaultColor: '#f59e0b', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#f59e0b" d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5-2.4-7.4H3.6l6.2 4.5z"/></svg>' },
  { id: 'shield_security', name: 'Shield Security Vault', category: 'Security', iconSymbol: '🛡️', defaultColor: '#10b981', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#10b981" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>' },
  { id: 'cyber_ring', name: 'Cyber Ring Progress', category: 'Analytics', iconSymbol: '⭕', defaultColor: '#38bdf8', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="40 10"/></svg>' },
  { id: 'analytics_wave', name: 'Analytics Line Wave', category: 'Analytics', iconSymbol: '📈', defaultColor: '#8b5cf6', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="#8b5cf6" stroke-width="2.5" d="M3.5 18.5l6-6 4 4 7-7"/><circle cx="20.5" cy="9.5" r="2.5" fill="#8b5cf6"/></svg>' },
  { id: 'search_magnifier', name: 'Search Glass Vector', category: 'Controls', iconSymbol: '🔍', defaultColor: '#38bdf8', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#38bdf8" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/></svg>' },
  { id: 'heart_favorite', name: 'Heart Favorite Emblem', category: 'Symbols', iconSymbol: '❤️', defaultColor: '#ef4444', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#ef4444" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>' },
  { id: 'bell_notification', name: 'Bell Notification Badge', category: 'Status', iconSymbol: '🔔', defaultColor: '#3b82f6', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#3b82f6" d="M12 22c1.1 0 2-.9 2-2h-4c0-3-2-5-2-9 0-3.07 1.64-5.64 4-6.32V4c0-.83.67-1.5 1.5-1.5S13 3.17 13 4v.68c2.36.68 4 3.25 4 6.32 0 4-2 6-2 9h-6z"/></svg>' },
  { id: 'shopping_cart', name: 'Shopping Cart Vector', category: 'Commerce', iconSymbol: '🛒', defaultColor: '#10b981', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#10b981" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM6.2 14.75l.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 19 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45C4.52 15.37 5.48 17 7 17h12v-2H7.42a.25.25 0 0 1-.22-.25z"/></svg>' },
  { id: 'gear_settings', name: 'Gear Settings Engine', category: 'Controls', iconSymbol: '⚙️', defaultColor: '#64748b', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#64748b" d="M19.14 12.94c.04-.3.06-.61-.94-.94-.32 0-.64.02-.94.07l-1.58-2.03a.5.5 0 0 0-.61-.12l-3.32 1.92a.5.5 0 0 0-.22.59l.96 2.39c-.38.5-.7 1.03-.94 1.62l-2.54.36a.5.5 0 0 0-.41.48v3.84c0 .24.17.44.41.47l2.54.36c.24.59.56 1.13.94 1.62l-.96 2.39a.5.5 0 0 0 .22.59l3.32 1.92a.5.5 0 0 0 .61-.12l1.58-2.03c.3.05.62.07.94.07s.64-.02.94-.07l1.58 2.03c.14.18.41.23.61.12l3.32-1.92a.5.5 0 0 0 .22-.59l-.96-2.39c.38-.49.7-1.03.94-1.62l2.54-.36c.24-.03.41-.23.41-.47v-3.84c0-.24-.17-.44-.41-.48l-2.54-.36a9.3 9.3 0 0 0-.94-1.62l.96-2.39a.5.5 0 0 0-.22-.59l-3.32-1.92a.5.5 0 0 0-.61.12zM12 15.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2z"/></svg>' },
  { id: 'checkmark_circle', name: 'Checkmark Circle Badge', category: 'Status', iconSymbol: '✓', defaultColor: '#10b981', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#10b981"/><path fill="#fff" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>' },
  { id: 'flame_trend', name: 'Flame Trending Symbol', category: 'Status', iconSymbol: '🔥', defaultColor: '#f97316', svgXml: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#f97316" d="M13.5 1.5c-1.11 0-2.07.6-2.58 1.5C9.5 2.1 8 3.5 8 5.5c0 1.25.5 2.42 1.34 3.25C7.9 9.35 7 10.8 7 12.5c0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.7-.9-3.15-2.34-4.25C15.5 7.42 16 6.25 16 5c0-1.93-1.57-3.5-3.5-3.5z"/></svg>' }
];

export const SvgImporterStudio = () => {
  const { rootNode, selectedNodeId } = useEditorStore();
  const targetParentId = selectedNodeId || rootNode.id;
  const [svgInput, setSvgInput] = useState(SVG_PRESETS[0].svgXml);
  const [vectorName, setVectorName] = useState('Android Bot Mascot');
  const [vectorColor, setVectorColor] = useState('#a4c639');
  const [vectorSize, setVectorSize] = useState(48);
  const validation = useMemo(() => validateAndNormalizeSvg(svgInput), [svgInput]);

  const handleSelectPreset = (preset: SvgPresetItem) => {
    setSvgInput(preset.svgXml);
    setVectorName(preset.name);
    setVectorColor(preset.defaultColor);
  };

  const handleInsertSvg = () => {
    if (!validation.valid || !validation.svgXml) {
      Alert.alert('Invalid SVG', validation.error || 'The SVG source could not be validated.');
      return;
    }
    const store = useEditorStore.getState();
    store.addChildNode(targetParentId, 'SvgVector');
    const updatedRoot = useEditorStore.getState().rootNode;
    const findLastAdded = (node: any): string | null => {
      if (node.type === 'SvgVector' && !node.props?.svgXml) return node.id;
      for (let i = (node.children?.length || 0) - 1; i >= 0; i--) {
        const result = findLastAdded(node.children[i]);
        if (result) return result;
      }
      return null;
    };
    const newId = findLastAdded(updatedRoot);
    if (!newId) return;
    const assetId = createAssetId();
    const metadata = validation.metadata || {};
    store.updateProps(newId, {
      assetId,
      assetName: vectorName.trim() || metadata.name || 'Imported SVG',
      mimeType: 'image/svg+xml',
      svgXml: validation.svgXml,
      imageUri: svgToDataUri(validation.svgXml),
      svgViewBox: metadata.viewBox,
      assetWidth: metadata.width,
      assetHeight: metadata.height,
      assetCreatedAt: new Date().toISOString(),
    });
    store.updateStyle(newId, { width: vectorSize, height: vectorSize, color: vectorColor });
  };

  const handleCopyExport = () => {
    if (!validation.valid || !validation.svgXml) return;
    const exported = exportSvgAsset(validation.svgXml, vectorName);
    Alert.alert('SVG Ready', `${exported.filename} is normalized and ready to copy from the editor.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SVG Vector Importer & Studio</Text>
        <Text style={styles.targetLabel}>Target Container: [{targetParentId}]</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Vector Name & Label</Text>
        <TextInput style={styles.input} value={vectorName} onChangeText={setVectorName} placeholder="Custom SVG Vector Asset Name" placeholderTextColor="#64748b" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Built-in Vector Asset Presets</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
          {SVG_PRESETS.map(p => <TouchableOpacity key={p.id} style={styles.presetCard} onPress={() => handleSelectPreset(p)}><Text style={styles.presetSymbol}>{p.iconSymbol}</Text><Text style={styles.presetName}>{p.name}</Text><Text style={styles.presetCategory}>{p.category}</Text></TouchableOpacity>)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Raw SVG XML Code</Text>
        <TextInput style={[styles.input, styles.xmlBox]} value={svgInput} onChangeText={setSvgInput} multiline numberOfLines={6} placeholder="Paste <svg ...>...</svg> code here..." placeholderTextColor="#64748b" />
        <Text style={[styles.validation, { color: validation.valid ? '#10b981' : '#ef4444' }]}>{validation.valid ? '✓ SVG validated' : `✕ ${validation.error}`}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Live SVG Preview</Text>
        <View style={[styles.preview, { width: vectorSize + 24, height: vectorSize + 24 }]}>
          {validation.valid && validation.svgXml ? <SvgXml xml={validation.svgXml} width={vectorSize} height={vectorSize} /> : <Text style={styles.previewError}>Invalid</Text>}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Dimensions & Color Tuning</Text>
        <View style={styles.row}>{[24, 32, 48, 64, 96].map(sz => <TouchableOpacity key={sz} style={[styles.sizeChip, vectorSize === sz && styles.activeChip]} onPress={() => setVectorSize(sz)}><Text style={styles.chipText}>{sz}px</Text></TouchableOpacity>)}</View>
        <View style={[styles.row, { marginTop: 8 }]}>{['#38bdf8', '#3b82f6', '#10b981', '#a4c639', '#8b5cf6', '#ef4444', '#f59e0b', '#ffffff'].map(col => <TouchableOpacity key={col} style={[styles.colorSwatch, { backgroundColor: col }, vectorColor === col && styles.activeSwatch]} onPress={() => setVectorColor(col)} />)}</View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.insertBtn, !validation.valid && styles.disabledBtn]} onPress={handleInsertSvg} disabled={!validation.valid}><Text style={styles.insertBtnText}>➕ Insert SVG Vector</Text></TouchableOpacity>
        <TouchableOpacity style={styles.exportBtn} onPress={handleCopyExport} disabled={!validation.valid}><Text style={styles.insertBtnText}>↗ Export SVG</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 }, header: { marginBottom: 12 }, title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc' }, targetLabel: { fontSize: 11, color: '#38bdf8', marginTop: 2 },
  section: { marginBottom: 14 }, sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 6 }, input: { backgroundColor: '#0f172a', color: '#38bdf8', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', fontSize: 11, fontFamily: 'monospace' }, xmlBox: { minHeight: 110, textAlignVertical: 'top' }, validation: { fontSize: 10, marginTop: 5 },
  presetScroll: { flexDirection: 'row', gap: 6 }, presetCard: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', padding: 8, borderRadius: 8, minWidth: 100, alignItems: 'center' }, presetSymbol: { fontSize: 18, marginBottom: 2 }, presetName: { fontSize: 10, fontWeight: 'bold', color: '#f8fafc', textAlign: 'center' }, presetCategory: { fontSize: 9, color: '#94a3b8', marginTop: 2 },
  preview: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 8, alignSelf: 'center' }, previewError: { color: '#ef4444', fontSize: 10 }, row: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' }, sizeChip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' }, activeChip: { backgroundColor: '#2563eb', borderColor: '#3b82f6' }, chipText: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' }, colorSwatch: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: '#475569' }, activeSwatch: { borderWidth: 3, borderColor: '#38bdf8' },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 24 }, insertBtn: { flex: 1, backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center' }, exportBtn: { flex: 1, backgroundColor: '#0f766e', padding: 12, borderRadius: 8, alignItems: 'center' }, disabledBtn: { opacity: 0.45 }, insertBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 11, textAlign: 'center' },
});
