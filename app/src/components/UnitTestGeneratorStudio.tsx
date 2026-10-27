import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { generateJestTestSpec } from '../compiler/jestTestGenerator';

export const UnitTestGeneratorStudio = () => {
  const { rootNode } = useEditorStore();

  const [includeSnapshot, setIncludeSnapshot] = useState(true);
  const [includeAccessibility, setIncludeAccessibility] = useState(true);
  const [includeInteractions, setIncludeInteractions] = useState(true);
  const [includePropsValidation, setIncludePropsValidation] = useState(true);
  const [copied, setCopied] = useState(false);

  const testSpecCode = generateJestTestSpec(rootNode, {
    includeSnapshot,
    includeAccessibility,
    includeInteractions,
    includePropsValidation,
  });

  const lines = testSpecCode.split('\n');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Automated Jest Test Spec Generator</Text>
          <Text style={styles.subtitle}>Exports React Native Testing Library unit tests</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn} onPress={() => setCopied(true)}>
          <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : '📋 Copy Spec'}</Text>
        </TouchableOpacity>
      </View>

      {/* Option Toggles */}
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[styles.toggleChip, includeSnapshot && styles.activeChip]}
          onPress={() => setIncludeSnapshot(!includeSnapshot)}
        >
          <Text style={styles.chipText}>{includeSnapshot ? '✓ Snapshot' : '+ Snapshot'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleChip, includeAccessibility && styles.activeChip]}
          onPress={() => setIncludeAccessibility(!includeAccessibility)}
        >
          <Text style={styles.chipText}>{includeAccessibility ? '✓ Accessibility' : '+ Accessibility'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleChip, includeInteractions && styles.activeChip]}
          onPress={() => setIncludeInteractions(!includeInteractions)}
        >
          <Text style={styles.chipText}>{includeInteractions ? '✓ Interactions' : '+ Interactions'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleChip, includePropsValidation && styles.activeChip]}
          onPress={() => setIncludePropsValidation(!includePropsValidation)}
        >
          <Text style={styles.chipText}>{includePropsValidation ? '✓ Props Val' : '+ Props Val'}</Text>
        </TouchableOpacity>
      </View>

      {/* Code Spec Viewer */}
      <ScrollView style={styles.codeBox} horizontal={true}>
        <ScrollView style={styles.verticalScroll}>
          <View style={styles.codeContainer}>
            <View style={styles.lineNumbers}>
              {lines.map((_, i) => (
                <Text key={i} style={styles.lineNumberText}>{i + 1}</Text>
              ))}
            </View>
            <View style={styles.codeLines}>
              {lines.map((line, i) => (
                <Text key={i} style={styles.codeLineText}>{line}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 10,
    color: '#38bdf8',
  },
  copyBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  toggleChip: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeChip: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  chipText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: 'bold',
  },
  codeBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    flex: 1,
  },
  verticalScroll: {
    padding: 10,
  },
  codeContainer: {
    flexDirection: 'row',
  },
  lineNumbers: {
    marginRight: 12,
    borderRightWidth: 1,
    borderColor: '#334155',
    paddingRight: 8,
  },
  lineNumberText: {
    color: '#475569',
    fontFamily: 'monospace',
    fontSize: 11,
    textAlign: 'right',
  },
  codeLines: {},
  codeLineText: {
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontSize: 11,
  },
});
