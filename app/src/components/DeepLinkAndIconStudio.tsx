import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import {
  generateAndroidManifestIntentFilters,
  generateExpoLinkingConfig,
  generateAppJsonIconConfig,
  DEFAULT_DEEP_LINK_ROUTES,
} from '../compiler/deepLinkAndIconGenerator';

export const DeepLinkAndIconStudio = () => {
  const [scheme, setScheme] = useState('droidui');
  const [host, setHost] = useState('app.example.com');
  const [activeTab, setActiveTab] = useState<'manifest' | 'expo' | 'icon'>('manifest');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (activeTab === 'manifest') return generateAndroidManifestIntentFilters(scheme, host);
    if (activeTab === 'expo') return generateExpoLinkingConfig(scheme, host);
    return generateAppJsonIconConfig(scheme, host);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔗 Deep Link Router & Adaptive Icon Studio</Text>
      <Text style={styles.subtitle}>
        Configure custom URL schemes (e.g. {scheme}://catalog/123), HTTPS Android App Links, and adaptive app icons for your build.
      </Text>

      {/* Scheme & Host Config Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ Deep Link & App Configuration</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Custom Scheme Name:</Text>
            <TextInput
              style={styles.input}
              value={scheme}
              onChangeText={setScheme}
              placeholder="e.g. droidui"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Associated Domain Host:</Text>
            <TextInput
              style={styles.input}
              value={host}
              onChangeText={setHost}
              placeholder="e.g. app.example.com"
              placeholderTextColor="#64748b"
            />
          </View>
        </View>
      </View>

      {/* Deep Link Route Table */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🗺️ Registered Intent Routes</Text>
        {DEFAULT_DEEP_LINK_ROUTES.map((route) => (
          <View key={route.path} style={styles.routeRow}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeUrl}>{scheme}://{route.path}</Text>
              <Text style={styles.routeDesc}>{route.description}</Text>
            </View>
            <Text style={styles.screenTag}>{route.screenName}</Text>
          </View>
        ))}
      </View>

      {/* Code Export Selector */}
      <View style={styles.card}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'manifest' && styles.activeTabBtn]}
            onPress={() => setActiveTab('manifest')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'manifest' && styles.activeTabBtnText]}>AndroidManifest.xml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'expo' && styles.activeTabBtn]}
            onPress={() => setActiveTab('expo')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'expo' && styles.activeTabBtnText]}>linking.ts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'icon' && styles.activeTabBtn]}
            onPress={() => setActiveTab('icon')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'icon' && styles.activeTabBtnText]}>app.json (Icon)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.codeHeader}>
          <Text style={styles.codeTitle}>
            {activeTab === 'manifest' ? 'AndroidManifest.xml Intent Filters' : activeTab === 'expo' ? 'Expo Linking Router Config' : 'Adaptive App Icon Spec'}
          </Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyBtnText}>{copied ? '✓ Copied!' : '📋 Copy Config'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.codeScroll}>
          <Text style={styles.codeText}>{getActiveCode()}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 14, flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc', marginBottom: 2 },
  subtitle: { fontSize: 11, color: '#94a3b8', marginBottom: 12 },
  card: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 10 },
  inputGroup: { flex: 1 },
  label: { fontSize: 11, color: '#cbd5e1', marginBottom: 4 },
  input: { backgroundColor: '#0f172a', color: '#38bdf8', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#475569', fontSize: 12 },
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: 8, borderRadius: 6, marginBottom: 6 },
  routeInfo: { flex: 1 },
  routeUrl: { fontSize: 12, fontWeight: 'bold', color: '#38bdf8', fontFamily: 'monospace' },
  routeDesc: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  screenTag: { backgroundColor: '#3b82f6', color: '#ffffff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tabRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  tabBtn: { flex: 1, paddingVertical: 6, backgroundColor: '#0f172a', borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  activeTabBtn: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  tabBtnText: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold' },
  activeTabBtnText: { color: '#ffffff' },
  codeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  codeTitle: { fontSize: 11, color: '#cbd5e1', fontWeight: 'bold' },
  copyBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  copyBtnText: { fontSize: 10, color: '#f8fafc', fontWeight: 'bold' },
  codeScroll: { backgroundColor: '#0f172a', padding: 10, borderRadius: 6 },
  codeText: { color: '#38bdf8', fontFamily: 'monospace', fontSize: 11 },
});
