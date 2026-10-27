import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { exportProjectToDroidUiFile, parseDroidUiFile } from '../storage/droidUiProjectFile';
import {
  calculateNextVersion,
  generateReleaseNotesMarkdown,
  generateReleaseScriptBash,
} from '../compiler/releaseVersionGenerator';

export const ReleaseVersionStudio = () => {
  const {
    currentProjectId,
    currentProjectName,
    rootNode,
    currentTheme,
    activeLocale,
    splashConfig,
    i18nDict,
  } = useEditorStore();

  const [bumpType, setBumpType] = useState<'patch' | 'minor' | 'major'>('patch');
  const [currentVersion, setCurrentVersion] = useState('1.0.0');
  const [currentVersionCode, setCurrentVersionCode] = useState('10000');
  const [releaseTitle, setReleaseTitle] = useState('Production release with responsive UI & TalkBack accessibility updates.');
  const [viewMode, setViewMode] = useState<'markdown' | 'bash'>('markdown');
  const [copied, setCopied] = useState(false);

  // Get active .dui package
  const fileExport = exportProjectToDroidUiFile(
    currentProjectId,
    currentProjectName,
    rootNode,
    currentTheme,
    activeLocale,
    splashConfig,
    i18nDict
  );

  const parsedPkgRes = parseDroidUiFile(fileExport.content);
  const pkg = parsedPkgRes.data || {
    signature: 'DROID_STUDIO_PROJECT_V30',
    extension: '.dui',
    appTitle: 'Droid Mobile Studio',
    schemaVersion: 30,
    createdAt: new Date().toISOString(),
    projectMeta: { id: 'proj_default', name: currentProjectName, nodeCount: 1 },
    workspaceState: { currentTheme, activeLocale, splashConfig, i18nDict, rootNode },
  };

  const codeConfig = {
    bumpType,
    currentVersion,
    currentVersionCode: parseInt(currentVersionCode, 10) || 10000,
    releaseTitle,
  };

  const nextVersion = calculateNextVersion(currentVersion, bumpType);
  const nextVersionCode = (parseInt(currentVersionCode, 10) || 10000) + 1;

  const markdownContent = generateReleaseNotesMarkdown(pkg, codeConfig);
  const bashScriptContent = generateReleaseScriptBash(pkg, codeConfig);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏷️ Release Notes & Versioning Studio</Text>
      <Text style={styles.subtitle}>
        Automate semantic versioning (SemVer), calculate Android versionCode bumps, and generate git release tags for <Text style={styles.highlight}>.dui</Text> projects.
      </Text>

      {/* Version Bump Controls */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Version Bump Selector</Text>
        <View style={styles.bumpRow}>
          <TouchableOpacity
            style={[styles.bumpBtn, bumpType === 'patch' && styles.activeBumpBtn]}
            onPress={() => setBumpType('patch')}
          >
            <Text style={[styles.bumpBtnText, bumpType === 'patch' && styles.activeBumpText]}>
              Patch (+0.0.1)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bumpBtn, bumpType === 'minor' && styles.activeBumpBtn]}
            onPress={() => setBumpType('minor')}
          >
            <Text style={[styles.bumpBtnText, bumpType === 'minor' && styles.activeBumpText]}>
              Minor (+0.1.0)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bumpBtn, bumpType === 'major' && styles.activeBumpBtn]}
            onPress={() => setBumpType('major')}
          >
            <Text style={[styles.bumpBtnText, bumpType === 'major' && styles.activeBumpText]}>
              Major (+1.0.0)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.inputGrid}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Current SemVer Version:</Text>
            <TextInput
              style={styles.textInput}
              value={currentVersion}
              onChangeText={setCurrentVersion}
              placeholder="1.0.0"
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Current Android versionCode:</Text>
            <TextInput
              style={styles.textInput}
              value={currentVersionCode}
              onChangeText={setCurrentVersionCode}
              placeholder="10000"
              keyboardType="numeric"
              placeholderTextColor="#64748b"
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Release Title / Highlights:</Text>
        <TextInput
          style={styles.textInput}
          value={releaseTitle}
          onChangeText={setReleaseTitle}
          placeholder="Brief release summary..."
          placeholderTextColor="#64748b"
        />

        {/* Result Preview Box */}
        <View style={styles.versionBadgeRow}>
          <View style={styles.versionPill}>
            <Text style={styles.pillLabel}>Next Version:</Text>
            <Text style={styles.pillValue}>v{nextVersion}</Text>
          </View>
          <View style={styles.versionPill}>
            <Text style={styles.pillLabel}>Next versionCode:</Text>
            <Text style={styles.pillValue}>{nextVersionCode}</Text>
          </View>
        </View>
      </View>

      {/* Output Display Mode */}
      <View style={styles.codeCard}>
        <View style={styles.codeHeader}>
          <View style={styles.tabToggleRow}>
            <TouchableOpacity
              style={[styles.toggleTab, viewMode === 'markdown' && styles.activeToggleTab]}
              onPress={() => setViewMode('markdown')}
            >
              <Text style={[styles.toggleTabText, viewMode === 'markdown' && styles.activeToggleText]}>
                📝 RELEASE_NOTES.md
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleTab, viewMode === 'bash' && styles.activeToggleTab]}
              onPress={() => setViewMode('bash')}
            >
              <Text style={[styles.toggleTabText, viewMode === 'bash' && styles.activeToggleText]}>
                🐚 bump_release.sh
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyBtnText}>{copied ? '✓ Copied!' : '📋 Copy Output'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal style={styles.codeScroll}>
          <Text style={styles.codeText}>
            {viewMode === 'markdown' ? markdownContent : bashScriptContent}
          </Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 14, flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc', marginBottom: 2 },
  subtitle: { fontSize: 11, color: '#94a3b8', marginBottom: 12 },
  highlight: { color: '#38bdf8', fontWeight: 'bold' },
  card: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  cardHeader: { fontSize: 12, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 8 },
  bumpRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  bumpBtn: { flex: 1, paddingVertical: 6, backgroundColor: '#0f172a', borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  activeBumpBtn: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  bumpBtnText: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8' },
  activeBumpText: { color: '#ffffff' },
  inputGrid: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  inputLabel: { fontSize: 10, color: '#94a3b8', marginBottom: 4, fontWeight: 'bold' },
  textInput: { backgroundColor: '#0f172a', color: '#f8fafc', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#475569', fontSize: 11, marginBottom: 8 },
  versionBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  versionPill: { flex: 1, backgroundColor: '#0f172a', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  pillLabel: { fontSize: 10, color: '#94a3b8' },
  pillValue: { fontSize: 14, fontWeight: 'bold', color: '#10b981', marginTop: 2 },
  codeCard: { backgroundColor: '#0f172a', borderRadius: 8, borderWidth: 1, borderColor: '#334155', padding: 10, marginBottom: 16 },
  codeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tabToggleRow: { flexDirection: 'row', gap: 6 },
  toggleTab: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: '#1e293b' },
  activeToggleTab: { backgroundColor: '#3b82f6' },
  toggleTabText: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold' },
  activeToggleText: { color: '#ffffff' },
  copyBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  copyBtnText: { fontSize: 10, color: '#f8fafc', fontWeight: 'bold' },
  codeScroll: { backgroundColor: '#1e293b', padding: 10, borderRadius: 6 },
  codeText: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 11, lineHeight: 16 },
});
