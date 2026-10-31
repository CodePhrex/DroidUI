import React, { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import {
  exportProjectToDroidUiFile,
  parseDroidUiFile,
  DROID_UI_FILE_EXTENSION,
  DROID_UI_SIGNATURE,
  DroidUiProjectPackage,
} from '../storage/droidUiProjectFile';

export const SAMPLE_DROID_PROJECTS: { name: string; filename: string; description: string; pkg: DroidUiProjectPackage }[] = [
  {
    name: 'E-Commerce Checkout App',
    filename: 'ecommerce_checkout.dui',
    description: 'Complete mobile shopping cart with order summary, payment badge, and submit button.',
    pkg: {
      signature: DROID_UI_SIGNATURE,
      extension: DROID_UI_FILE_EXTENSION,
      appTitle: 'Droid Mobile Studio',
      schemaVersion: 29,
      createdAt: new Date().toISOString(),
      projectMeta: { id: 'proj_ecommerce', name: 'E-Commerce Checkout App', nodeCount: 6 },
      workspaceState: {
        currentTheme: 'dark',
        activeLocale: 'en',
        splashConfig: {
          enabled: true,
          title: 'Storefront Mobile',
          subtitle: 'Seamless Checkout',
          logoIcon: '🛒',
          backgroundColor: '#0f172a',
          titleColor: '#ffffff',
          durationMs: 2000,
          showSpinner: true,
          animationType: 'fade',
        },
        i18nDict: {
          checkout_title: { en: 'Order Summary', es: 'Resumen del Pedido', fr: 'Récapitulatif de Commande', de: 'Bestellübersicht', ja: '注文の概要', zh: '订单摘要' },
          pay_btn: { en: 'Pay $129.99 Now', es: 'Pagar $129.99 Ahora', fr: 'Payer 129,99 $', de: 'Jetzt 129,99 $ Zahlen', ja: '$129.99 今すぐ支払う', zh: '立即支付 $129.99' },
        },
        rootNode: {
          id: 'root_container',
          type: 'Container',
          style: { flexDirection: 'column', padding: 16, backgroundColor: '#1e293b', borderRadius: 12 },
          children: [
            { id: 'cart_header', type: 'Text', props: { text: 'Order Summary', i18nKey: 'checkout_title' }, style: { fontSize: 20, color: '#f8fafc', fontWeight: 'bold', marginBottom: 12 } },
            { id: 'item_card', type: 'Card', style: { padding: 12, backgroundColor: '#0f172a', borderRadius: 8, marginBottom: 12 }, children: [
              { id: 'item_title', type: 'Text', props: { text: 'Wireless Noise-Canceling Headphones' }, style: { fontSize: 14, color: '#38bdf8', fontWeight: 'bold' } },
              { id: 'item_price', type: 'Text', props: { text: '$129.99 • Qty 1' }, style: { fontSize: 12, color: '#10b981', marginTop: 4 } },
            ]},
            { id: 'btn_pay', type: 'Button', props: { label: 'Pay $129.99 Now', i18nKey: 'pay_btn' }, style: { backgroundColor: '#10b981', padding: 12, borderRadius: 8, alignItems: 'center' } },
          ],
        },
      },
    },
  },
  {
    name: 'Smart Home Automation',
    filename: 'smart_home_control.dui',
    description: 'IoT device dashboard with living room climate sliders, light switches, and status cards.',
    pkg: {
      signature: DROID_UI_SIGNATURE,
      extension: DROID_UI_FILE_EXTENSION,
      appTitle: 'Droid Mobile Studio',
      schemaVersion: 29,
      createdAt: new Date().toISOString(),
      projectMeta: { id: 'proj_smarthome', name: 'Smart Home Automation', nodeCount: 5 },
      workspaceState: {
        currentTheme: 'cyberpunk',
        activeLocale: 'en',
        splashConfig: {
          enabled: true,
          title: 'SmartHome OS',
          subtitle: 'Connected Living Space',
          logoIcon: '🏠',
          backgroundColor: '#05050d',
          titleColor: '#ffe600',
          durationMs: 1800,
          showSpinner: true,
          animationType: 'zoom',
        },
        i18nDict: {},
        rootNode: {
          id: 'root_container',
          type: 'Container',
          style: { flexDirection: 'column', padding: 16, backgroundColor: '#0d0d1a', borderRadius: 12 },
          children: [
            { id: 'home_title', type: 'Text', props: { text: 'Living Room Controls' }, style: { fontSize: 20, color: '#ffe600', fontWeight: 'bold', marginBottom: 12 } },
            { id: 'switch_light', type: 'Switch', props: { label: 'Ambient Ceiling Light', value: true }, style: { marginVertical: 6 } },
            { id: 'slider_temp', type: 'Slider', props: { label: 'AC Temperature (°C)', value: 22 }, style: { marginVertical: 6 } },
          ],
        },
      },
    },
  },
];

export const ProjectFileIOStudio = () => {
  const {
    currentProjectId,
    currentProjectName,
    rootNode,
    currentTheme,
    activeLocale,
    splashConfig,
    i18nDict,
    importDroidUiPackage,
    saveCurrentProject,
  } = useEditorStore();

  const [copied, setCopied] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  // Export package specs
  const exportData = exportProjectToDroidUiFile(
    currentProjectId,
    currentProjectName,
    rootNode,
    currentTheme,
    activeLocale,
    splashConfig,
    i18nDict
  );

  const handleCopyPackage = async () => {
    setCopied(false);
    try {
      await Clipboard.setStringAsync(exportData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert('Clipboard Error', `Unable to copy the .dui project package: ${message}`);
    }
  };

  const handleImportPayload = async (payload: string) => {
    setImportError('');
    setImportSuccess('');

    if (!payload.trim()) {
      setImportError('Please paste a valid .dui JSON project string.');
      return;
    }

    const res = parseDroidUiFile(payload);
    if (!res.success || !res.data) {
      setImportError(res.error || 'Failed to parse .dui file package.');
      return;
    }

    try {
      importDroidUiPackage(res.data);
      await saveCurrentProject(res.data.projectMeta.name);
      setImportSuccess(`Imported and saved native project: "${res.data.projectMeta.name}" (.dui)!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setImportError(`Project loaded into the editor but could not be saved: ${message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>💾 .dui Native Project File Studio</Text>
      <Text style={styles.subtitle}>
        Export & import native Droid Studio project files using the proprietary <Text style={styles.highlightText}>.dui</Text> format.
      </Text>

      {/* Export Section */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTitle}>Active Project File Package</Text>
          <Text style={styles.extBadge}>{DROID_UI_FILE_EXTENSION}</Text>
        </View>

        <View style={styles.specBox}>
          <Text style={styles.specLabel}>File Name: <Text style={styles.specVal}>{exportData.filename}</Text></Text>
          <Text style={styles.specLabel}>File Signature: <Text style={styles.specVal}>{DROID_UI_SIGNATURE}</Text></Text>
          <Text style={styles.specLabel}>Project Name: <Text style={styles.specVal}>{currentProjectName}</Text></Text>
          <Text style={styles.specLabel}>Root Theme: <Text style={styles.specVal}>{currentTheme.toUpperCase()}</Text></Text>
          <Text style={styles.specLabel}>Default Locale: <Text style={styles.specVal}>{activeLocale.toUpperCase()}</Text></Text>
        </View>

        <TouchableOpacity style={styles.copyBtn} onPress={handleCopyPackage}>
          <Text style={styles.copyBtnText}>{copied ? '✓ .dui Package Payload Copied!' : '📋 Copy .dui Project String'}</Text>
        </TouchableOpacity>
      </View>

      {/* Import Section */}
      <View style={styles.card}>
        <Text style={styles.cardHeaderTitle}>📥 Import Native .dui File</Text>
        <Text style={styles.cardDesc}>
          Paste a serialized .dui package string to restore full AST nodes, themes, i18n keys, and splash configurations into the live workspace:
        </Text>

        <TextInput
          style={styles.importArea}
          multiline={true}
          placeholder="Paste .dui JSON project package here..."
          placeholderTextColor="#64748b"
          value={importInput}
          onChangeText={setImportInput}
        />

        {importError ? <Text style={styles.errorText}>⚠️ {importError}</Text> : null}
        {importSuccess ? <Text style={styles.successText}>✓ {importSuccess}</Text> : null}

        <TouchableOpacity style={styles.importBtn} onPress={() => handleImportPayload(importInput)}>
          <Text style={styles.importBtnText}>📥 Load .dui Project Payload</Text>
        </TouchableOpacity>
      </View>

      {/* Sample .dui Projects */}
      <View style={styles.card}>
        <Text style={styles.cardHeaderTitle}>📦 Prebuilt Sample .dui Packages</Text>
        <Text style={styles.cardDesc}>Tap any package below to test loading native .dui project files:</Text>

        {SAMPLE_DROID_PROJECTS.map((sample) => (
          <TouchableOpacity
            key={sample.filename}
            style={styles.sampleCard}
            onPress={async () => {
              setImportError('');
              setImportSuccess('');
              try {
                importDroidUiPackage(sample.pkg);
                await saveCurrentProject(sample.name);
                setImportSuccess(`Loaded and saved sample project: "${sample.name}" (${sample.filename})`);
              } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                setImportError(`Sample loaded into the editor but could not be saved: ${message}`);
              }
            }}
          >
            <View style={styles.sampleHeaderRow}>
              <Text style={styles.sampleName}>{sample.name}</Text>
              <Text style={styles.sampleFileTag}>{sample.filename}</Text>
            </View>
            <Text style={styles.sampleDesc}>{sample.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 14,
  },
  highlightText: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  extBadge: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  cardDesc: {
    fontSize: 11,
    color: '#cbd5e1',
    marginBottom: 10,
  },
  specBox: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  specLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 3,
  },
  specVal: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  copyBtn: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  copyBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  importArea: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontSize: 11,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  importBtn: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  importBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sampleCard: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  sampleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sampleName: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sampleFileTag: {
    color: '#38bdf8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  sampleDesc: {
    color: '#94a3b8',
    fontSize: 11,
  },
});
