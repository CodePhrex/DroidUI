import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { SUPPORTED_LOCALES, SupportedLocale } from '../types/localization';

export const LocalizationStudio = () => {
  const {
    rootNode,
    selectedNodeId,
    activeLocale,
    i18nDict,
    setActiveLocale,
    setTranslationKey,
    assignNodeTranslationKey,
    applyDefaultI18nPresets
  } = useEditorStore();

  const [newKey, setNewKey] = useState('');
  const [newValEn, setNewValEn] = useState('');
  const [newValEs, setNewValEs] = useState('');

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

  const selectedNode = selectedNodeId ? findNode(rootNode, selectedNodeId) : null;
  const activeKey = selectedNode?.props?.i18nKey || '';

  const handleAddKey = () => {
    if (!newKey.trim()) return;
    setTranslationKey(newKey.trim(), {
      en: newValEn || newKey,
      es: newValEs || newKey,
      fr: newKey,
      de: newKey,
      ja: newKey,
      zh: newKey
    });
    setNewKey('');
    setNewValEn('');
    setNewValEs('');
    Alert.alert('Key Added', `Translation key "${newKey.trim()}" created successfully.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Multi-Language Localization Studio (i18n)</Text>
      
      {/* Active Locale Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Canvas Display Locale</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.localeScroll}>
          {SUPPORTED_LOCALES.map((loc) => (
            <TouchableOpacity
              key={loc.code}
              style={[styles.localeChip, activeLocale === loc.code && styles.activeLocaleChip]}
              onPress={() => setActiveLocale(loc.code)}
            >
              <Text style={styles.flagText}>{loc.flag}</Text>
              <Text style={[styles.localeText, activeLocale === loc.code && styles.activeLocaleText]}>
                {loc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Node Binding */}
      {selectedNode && (
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Selected Element Binding</Text>
          <Text style={styles.nodeBadge}>Target: [{selectedNode.id}] ({selectedNode.type})</Text>
          <Text style={styles.keyLabel}>Assigned i18n Key: {activeKey ? `"${activeKey}"` : 'None'}</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.keyChipsRow}>
            {Object.keys(i18nDict).map((k) => (
              <TouchableOpacity
                key={k}
                style={[styles.keyChip, activeKey === k && styles.activeKeyChip]}
                onPress={() => assignNodeTranslationKey(selectedNode.id, k)}
              >
                <Text style={styles.keyChipText}>{k}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Preset Translation Injection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Translation Presets</Text>
        <TouchableOpacity style={styles.presetBtn} onPress={applyDefaultI18nPresets}>
          <Text style={styles.presetBtnText}>✨ Load Standard UI i18n Presets (Welcome, Save, Cancel, etc.)</Text>
        </TouchableOpacity>
      </View>

      {/* Add Custom Translation Key */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardTitle}>Add New Translation Key</Text>
        <TextInput
          style={styles.input}
          placeholder="Key Name (e.g. btn_submit_label)"
          placeholderTextColor="#7186B4"
          value={newKey}
          onChangeText={setNewKey}
        />
        <TextInput
          style={styles.input}
          placeholder="English Text (e.g. Submit Application)"
          placeholderTextColor="#7186B4"
          value={newValEn}
          onChangeText={setNewValEn}
        />
        <TextInput
          style={styles.input}
          placeholder="Spanish Text (e.g. Enviar Solicitud)"
          placeholderTextColor="#7186B4"
          value={newValEs}
          onChangeText={setNewValEs}
        />
        <TouchableOpacity style={styles.addKeyBtn} onPress={handleAddKey}>
          <Text style={styles.addKeyBtnText}>+ Create Translation Key</Text>
        </TouchableOpacity>
      </View>

      {/* Registered Dictionary View */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registered Translation Dictionary</Text>
        {Object.entries(i18nDict).map(([k, trans]) => (
          <View key={k} style={styles.dictRow}>
            <Text style={styles.dictKey}>🔑 {k}</Text>
            <Text style={styles.dictVal}>🇺🇸 EN: {trans.en}</Text>
            <Text style={styles.dictVal}>🇪🇸 ES: {trans.es}</Text>
            <Text style={styles.dictVal}>🇫🇷 FR: {trans.fr}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#F4F7FF', marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#C7D5F1', marginBottom: 8, textTransform: 'uppercase' },
  localeScroll: { flexDirection: 'row', gap: 6 },
  localeChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111B35', borderWidth: 1, borderColor: '#263B68', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 6, marginRight: 6 },
  activeLocaleChip: { backgroundColor: '#398BFF', borderColor: '#60a5fa' },
  flagText: { fontSize: 14 },
  localeText: { fontSize: 11, color: '#9AADD6', fontWeight: 'bold' },
  activeLocaleText: { color: '#ffffff' },
  sectionCard: { backgroundColor: '#080D1F', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#263B68', marginBottom: 16 },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#38E8F2', marginBottom: 6 },
  nodeBadge: { fontSize: 11, color: '#9AADD6', marginBottom: 4 },
  keyLabel: { fontSize: 11, color: '#C7D5F1', fontWeight: '600', marginBottom: 8 },
  keyChipsRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  keyChip: { backgroundColor: '#111B35', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#475569', marginRight: 6 },
  activeKeyChip: { backgroundColor: '#10b981', borderColor: '#34d399' },
  keyChipText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  presetBtn: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1, borderColor: '#398BFF', padding: 10, borderRadius: 8, alignItems: 'center' },
  presetBtnText: { color: '#38E8F2', fontSize: 11, fontWeight: 'bold' },
  input: { backgroundColor: '#111B35', color: '#ffffff', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#263B68', marginBottom: 8, fontSize: 12 },
  addKeyBtn: { backgroundColor: '#398BFF', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 4 },
  addKeyBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  dictRow: { backgroundColor: '#111B35', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#263B68', marginBottom: 8 },
  dictKey: { fontSize: 12, fontWeight: 'bold', color: '#38E8F2', marginBottom: 4 },
  dictVal: { fontSize: 11, color: '#C7D5F1' },
});
