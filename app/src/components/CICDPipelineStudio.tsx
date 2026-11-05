import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import {
  ProviderType,
  generateGitHubActionsYAML,
  generateGitLabCIYAML,
  generateBitbucketPipelinesYAML,
} from '../compiler/cicdPipelineGenerator';

export const CICDPipelineStudio = () => {
  const { currentProjectName } = useEditorStore();
  const [provider, setProvider] = useState<ProviderType>('github');
  const [copied, setCopied] = useState(false);

  const getYAMLCode = () => {
    switch (provider) {
      case 'github':
        return generateGitHubActionsYAML(currentProjectName);
      case 'gitlab':
        return generateGitLabCIYAML(currentProjectName);
      case 'bitbucket':
        return generateBitbucketPipelinesYAML(currentProjectName);
      default:
        return generateGitHubActionsYAML(currentProjectName);
    }
  };

  const yamlString = getYAMLCode();
  const lines = yamlString.split('\n');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CI/CD Pipeline Config Generator</Text>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : '📋 Copy YAML'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Automate linting, unit testing, and Expo EAS cloud APK builds on every git push
      </Text>

      {/* Provider Selector Chips */}
      <View style={styles.providerRow}>
        <TouchableOpacity
          style={[styles.providerChip, provider === 'github' && styles.activeChip]}
          onPress={() => setProvider('github')}
        >
          <Text style={styles.chipText}>🐙 GitHub Actions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.providerChip, provider === 'gitlab' && styles.activeChip]}
          onPress={() => setProvider('gitlab')}
        >
          <Text style={styles.chipText}>🦊 GitLab CI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.providerChip, provider === 'bitbucket' && styles.activeChip]}
          onPress={() => setProvider('bitbucket')}
        >
          <Text style={styles.chipText}>🪣 Bitbucket</Text>
        </TouchableOpacity>
      </View>

      {/* YAML Viewer */}
      <ScrollView style={styles.codeBox} horizontal={true}>
        <ScrollView style={styles.verticalScroll}>
          <View style={styles.codeContainer}>
            <View style={styles.lineNumbers}>
              {lines.map((_, i) => (
                <Text key={i} style={styles.lineNumberText}>
                  {i + 1}
                </Text>
              ))}
            </View>
            <View style={styles.codeLines}>
              {lines.map((line, i) => (
                <Text key={i} style={styles.codeLineText}>
                  {line}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Configuration Tips */}
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>💡 Setup Instructions:</Text>
        <Text style={styles.tipText}>
          1. Create <Text style={styles.boldText}>.github/workflows/android-build.yml</Text> in your project repository.
        </Text>
        <Text style={styles.tipText}>
          2. Generate an Expo token from <Text style={styles.boldText}>expo.dev/settings/access-tokens</Text>.
        </Text>
        <Text style={styles.tipText}>
          3. Add secret <Text style={styles.boldText}>EAS_BUILD_TOKEN</Text> in GitHub Repo &gt; Settings &gt; Secrets.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 14, fontWeight: 'bold', color: '#F4F7FF' },
  subtitle: { fontSize: 11, color: '#9AADD6', marginBottom: 10 },
  copyBtn: {
    backgroundColor: '#398BFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  providerRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  providerChip: {
    backgroundColor: '#111B35',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#263B68',
  },
  activeChip: { backgroundColor: '#398BFF', borderColor: '#60a5fa' },
  chipText: { color: '#F4F7FF', fontSize: 11, fontWeight: '600' },
  codeBox: {
    backgroundColor: '#080D1F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263B68',
    maxHeight: 260,
    marginBottom: 12,
  },
  verticalScroll: { padding: 8 },
  codeContainer: { flexDirection: 'row' },
  lineNumbers: { paddingRight: 8, borderRightWidth: 1, borderColor: '#263B68', marginRight: 8 },
  lineNumberText: { color: '#475569', fontSize: 10, fontFamily: 'monospace', textAlign: 'right' },
  codeLines: { flex: 1 },
  codeLineText: { color: '#38E8F2', fontSize: 11, fontFamily: 'monospace' },
  tipsBox: {
    backgroundColor: '#111B35',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263B68',
  },
  tipsTitle: { color: '#F4F7FF', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  tipText: { color: '#9AADD6', fontSize: 10, marginBottom: 2 },
  boldText: { color: '#38E8F2', fontWeight: 'bold' },
});
