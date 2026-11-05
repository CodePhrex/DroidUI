import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import {
  generatePrivacyPolicyMarkdown,
  generateStoreListingText,
} from '../compiler/storeMetadataGenerator';

export const StoreMetadataStudio = () => {
  const { rootNode, currentProjectName } = useEditorStore();

  const [appName, setAppName] = useState(currentProjectName || 'My Android App');
  const [shortDesc, setShortDesc] = useState(
    'Powerful and sleek mobile app built with Droid Studio UI.',
  );
  const [category, setCategory] = useState('Tools & Productivity');
  const [email, setEmail] = useState('support@mycompany.com');
  const [privacyUrl, setPrivacyUrl] = useState('https://mycompany.com/privacy');
  const [activeTab, setActiveTab] = useState<'listing' | 'privacy'>('listing');

  const listingText = generateStoreListingText(rootNode, {
    appName,
    shortDescription: shortDesc,
    category,
    supportEmail: email,
    privacyPolicyUrl: privacyUrl,
  });

  const privacyText = generatePrivacyPolicyMarkdown(appName, 'My Company Studio');
  const output = activeTab === 'listing' ? listingText : privacyText;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Play Store & App Metadata Studio</Text>
        <Text style={styles.subtitle}>
          Generate editable store listing and privacy-policy content from the current project.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App metadata</Text>

        <Text style={styles.label}>App name</Text>
        <TextInput
          value={appName}
          onChangeText={setAppName}
          style={styles.input}
          placeholder="My Android App"
          placeholderTextColor="#7186B4"
          accessibilityLabel="App name"
        />

        <Text style={styles.label}>Short description</Text>
        <TextInput
          value={shortDesc}
          onChangeText={setShortDesc}
          style={[styles.input, styles.multiline]}
          placeholder="Describe the app"
          placeholderTextColor="#7186B4"
          multiline
          accessibilityLabel="Short description"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          placeholder="Tools & Productivity"
          placeholderTextColor="#7186B4"
          accessibilityLabel="App category"
        />

        <Text style={styles.label}>Support email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="support@example.com"
          placeholderTextColor="#7186B4"
          accessibilityLabel="Support email"
        />

        <Text style={styles.label}>Privacy policy URL</Text>
        <TextInput
          value={privacyUrl}
          onChangeText={setPrivacyUrl}
          style={styles.input}
          keyboardType="url"
          autoCapitalize="none"
          placeholder="https://example.com/privacy"
          placeholderTextColor="#7186B4"
          accessibilityLabel="Privacy policy URL"
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'listing' && styles.activeTab]}
          onPress={() => setActiveTab('listing')}
          accessibilityRole="button"
          accessibilityLabel="Show store listing"
        >
          <Text style={styles.tabText}>Store Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}
          accessibilityRole="button"
          accessibilityLabel="Show privacy policy"
        >
          <Text style={styles.tabText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.outputCard}>
        <Text style={styles.sectionTitle}>Generated content</Text>
        <Text selectable style={styles.output}>
          {output}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080D1F' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  header: { gap: 6 },
  title: { color: '#F4F7FF', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#9AADD6', fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: '#111827', borderRadius: 12, padding: 16, gap: 8 },
  sectionTitle: { color: '#F4F7FF', fontSize: 17, fontWeight: '700', marginBottom: 4 },
  label: { color: '#C7D5F1', fontSize: 13, fontWeight: '600', marginTop: 6 },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#263B68',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#F4F7FF',
    backgroundColor: '#080D1F',
  },
  multiline: { minHeight: 76, paddingTop: 10, textAlignVertical: 'top' },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111B35',
  },
  activeTab: { backgroundColor: '#263B68' },
  tabText: { color: '#F4F7FF', fontWeight: '600' },
  outputCard: { backgroundColor: '#111827', borderRadius: 12, padding: 16 },
  output: { color: '#C7D5F1', fontSize: 13, lineHeight: 20, fontFamily: 'monospace' },
});
