import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { generateReactNativeTSX, generateJetpackComposeKotlin } from '../compiler/codeExporter';
import { generateSVGVector, generateCSSinJS } from '../compiler/exportPresets';

type CodeLanguage = 'tsx' | 'kotlin' | 'svg' | 'cssinjs';

export const LiveCodePreview = () => {
  const { rootNode } = useEditorStore();
  const [language, setLanguage] = useState<CodeLanguage>('tsx');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (language) {
      case 'tsx':
        return generateReactNativeTSX(rootNode);
      case 'kotlin':
        return generateJetpackComposeKotlin(rootNode);
      case 'svg':
        return generateSVGVector(rootNode);
      case 'cssinjs':
        return generateCSSinJS(rootNode);
      default:
        return generateReactNativeTSX(rootNode);
    }
  };

  const codeString = getCode();
  const lines = codeString.split('\n');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header & Language Switcher */}
      <View style={styles.header}>
        <Text style={styles.title}>Live Code Preview</Text>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : '📋 Copy'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langChip, language === 'tsx' && styles.activeLangChip]}
          onPress={() => setLanguage('tsx')}
        >
          <Text style={[styles.langText, language === 'tsx' && styles.activeLangText]}>React Native (.tsx)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langChip, language === 'kotlin' && styles.activeLangChip]}
          onPress={() => setLanguage('kotlin')}
        >
          <Text style={[styles.langText, language === 'kotlin' && styles.activeLangText]}>Compose (.kt)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langChip, language === 'svg' && styles.activeLangChip]}
          onPress={() => setLanguage('svg')}
        >
          <Text style={[styles.langText, language === 'svg' && styles.activeLangText]}>SVG (.svg)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langChip, language === 'cssinjs' && styles.activeLangChip]}
          onPress={() => setLanguage('cssinjs')}
        >
          <Text style={[styles.langText, language === 'cssinjs' && styles.activeLangText]}>CSS-in-JS</Text>
        </TouchableOpacity>
      </View>

      {/* Code Viewer with Line Numbers */}
      <ScrollView style={styles.codeBox} horizontal={true}>
        <ScrollView style={styles.verticalScroll}>
          <View style={styles.codeContainer}>
            <View style={styles.lineNumbers}>
              {lines.map((_, index) => (
                <Text key={index} style={styles.lineNumberText}>{index + 1}</Text>
              ))}
            </View>
            <View style={styles.codeLines}>
              {lines.map((line, index) => (
                <Text key={index} style={styles.codeLineText}>{line}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#090d16' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 13, fontWeight: 'bold', color: '#f8fafc' },
  copyBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  copyBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  langRow: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  langChip: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#334155' },
  activeLangChip: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  langText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  activeLangText: { color: '#ffffff' },
  codeBox: { flex: 1, backgroundColor: '#0f172a', borderRadius: 8, borderWidth: 1, borderColor: '#1e293b' },
  verticalScroll: { padding: 10 },
  codeContainer: { flexDirection: 'row' },
  lineNumbers: { paddingRight: 10, borderRightWidth: 1, borderColor: '#334155', marginRight: 10 },
  lineNumberText: { color: '#475569', fontFamily: 'monospace', fontSize: 11, textAlign: 'right' },
  codeLines: { flex: 1 },
  codeLineText: { color: '#38bdf8', fontFamily: 'monospace', fontSize: 11 },
});
