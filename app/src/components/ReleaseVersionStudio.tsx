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
              placeholderTextColor="#7186B4"
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
              placeholderTextColor="#7186B4"
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Release Title / Highlights:</Text>
        <TextInput
          style={styles.textInput}
          value={releaseTitle}
          onChangeText={setReleaseTitle}
          placeholder="Brief release summary..."
          placeholderTextColor="#7186B4"
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
  title: { fontSize: 15, fontWeight: 'bold', color: '#F4F7FF', marginBottom: 2 },
  subtitle: { fontSize: 11, color: '#9AADD6', marginBottom: 12 },
  highlight: { color: '#38E8F2', fontWeight: 'bold' },
  card: { backgroundColor: '#111B35', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#263B68', marginBottom: 12 },
  cardHeader: { fontSize: 12, fontWeight: 'bold', color: '#C7D5F1', marginBottom: 8 },
  bumpRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  bumpBtn: { flex: 1, paddingVertical: 6, backgroundColor: '#080D1F', borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#263B68' },
  activeBumpBtn: { backgroundColor: '#398BFF', borderColor: '#398BFF' },
  bumpBtnText: { fontSize: 11, fontWeight: 'bold', color: '#9AADD6' },
  activeBumpText: { color: '#ffffff' },
  inputGrid: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  inputLabel: { fontSize: 10, color: '#9AADD6', marginBottom: 4, fontWeight: 'bold' },
  textInput: { backgroundColor: '#080D1F', color: '#F4F7FF', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#475569', fontSize: 11, marginBottom: 8 },
  versionBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  versionPill: { flex: 1, backgroundColor: '#080D1F', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#263B68', alignItems: 'center' },
  pillLabel: { fontSize: 10, color: '#9AADD6' },
  pillValue: { fontSize: 14, fontWeight: 'bold', color: '#10b981', marginTop: 2 },
  codeCard: { backgroundColor: '#080D1F', borderRadius: 8, borderWidth: 1, borderColor: '#263B68', padding: 10, marginBottom: 16 },
  codeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tabToggleRow: { flexDirection: 'row', gap: 6 },
  toggleTab: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: '#111B35' },
  activeToggleTab: { backgroundColor: '#398BFF' },
  toggleTabText: { fontSize: 10, color: '#9AADD6', fontWeight: 'bold' },
  activeToggleText: { color: '#ffffff' },
  copyBtn: { backgroundColor: '#263B68', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  copyBtnText: { fontSize: 10, color: '#F4F7FF', fontWeight: 'bold' },
  codeScroll: { backgroundColor: '#111B35', padding: 10, borderRadius: 6 },
  codeText: { color: '#F4F7FF', fontFamily: 'monospace', fontSize: 11, lineHeight: 16 },
});
