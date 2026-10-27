import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import * as ImagePicker from 'expo-image-picker';

export interface IconCategory {
  category: string;
  icons: Array<{ name: string; symbol: string; tags: string }>;
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    category: 'Navigation & Layout',
    icons: [
      { name: 'Home', symbol: '🏠', tags: 'home main house index' },
      { name: 'Menu Hamburger', symbol: '☰', tags: 'menu drawer lines hamburger' },
      { name: 'Back Arrow', symbol: '⬅️', tags: 'back left return arrow' },
      { name: 'Forward Arrow', symbol: '➡️', tags: 'forward right proceed arrow' },
      { name: 'Compass', symbol: '🧭', tags: 'compass map navigation location' },
      { name: 'Map Pin', symbol: '📍', tags: 'pin location marker map' },
      { name: 'Grid Layout', symbol: '⊞', tags: 'grid layout apps matrix' },
      { name: 'Expand Screen', symbol: '⤢', tags: 'fullscreen expand resize' },
    ],
  },
  {
    category: 'Actions & Controls',
    icons: [
      { name: 'Search Glass', symbol: '🔍', tags: 'search magnifying glass find' },
      { name: 'Settings Gear', symbol: '⚙️', tags: 'settings gear options config' },
      { name: 'Edit Pencil', symbol: '✏️', tags: 'edit pencil write compose' },
      { name: 'Trash Delete', symbol: '🗑️', tags: 'trash delete remove bin' },
      { name: 'Add Plus', symbol: '➕', tags: 'add plus create new' },
      { name: 'Check Valid', symbol: '✓', tags: 'check valid confirm success' },
      { name: 'Close Cross', symbol: '✕', tags: 'close cancel remove exit' },
      { name: 'Refresh Reload', symbol: '🔄', tags: 'refresh sync reload update' },
      { name: 'Filter Funnel', symbol: '🌪️', tags: 'filter funnel sort category' },
      { name: 'Share Node', symbol: '🔗', tags: 'share link URL send' },
    ],
  },
  {
    category: 'Media & Playback',
    icons: [
      { name: 'Play Video', symbol: '▶️', tags: 'play start video media' },
      { name: 'Pause Media', symbol: '⏸️', tags: 'pause stop media' },
      { name: 'Volume High', symbol: '🔊', tags: 'volume sound speaker audio' },
      { name: 'Mute Audio', symbol: '🔇', tags: 'mute silent volume off' },
      { name: 'Camera Photo', symbol: '📷', tags: 'camera photo picture image' },
      { name: 'Music Note', symbol: '🎵', tags: 'music audio song note' },
      { name: 'Film Strip', symbol: '🎬', tags: 'movie film video clip' },
      { name: 'Microphone Voice', symbol: '🎙️', tags: 'mic audio record voice' },
    ],
  },
  {
    category: 'Status & Signals',
    icons: [
      { name: 'Notification Bell', symbol: '🔔', tags: 'bell notify alert news' },
      { name: 'Favorite Heart', symbol: '❤️', tags: 'heart like favorite love' },
      { name: 'Star Rating', symbol: '⭐', tags: 'star rate bookmark feature' },
      { name: 'Shield Security', symbol: '🛡️', tags: 'shield security protect safe' },
      { name: 'Warning Alert', symbol: '⚠️', tags: 'warning danger caution alert' },
      { name: 'Info Badge', symbol: 'ℹ️', tags: 'info detail about tip' },
      { name: 'Fire Trending', symbol: '🔥', tags: 'fire hot trending popular' },
      { name: 'Sparkles Magic', symbol: '✨', tags: 'sparkles ai magic new' },
    ],
  },
  {
    category: 'Commerce & Profile',
    icons: [
      { name: 'User Avatar', symbol: '👤', tags: 'user profile avatar person' },
      { name: 'Users Group', symbol: '👥', tags: 'users group team community' },
      { name: 'Shopping Cart', symbol: '🛒', tags: 'cart shop buy store' },
      { name: 'Shopping Bag', symbol: '🛍️', tags: 'bag shop store purchase' },
      { name: 'Credit Card', symbol: '💳', tags: 'card pay payment checkout' },
      { name: 'Money Coin', symbol: '💰', tags: 'money dollar cash coin' },
      { name: 'Gift Box', symbol: '🎁', tags: 'gift bonus reward present' },
      { name: 'Trophy Winner', symbol: '🏆', tags: 'trophy award win rank' },
    ],
  },
  {
    category: 'Hardware & System',
    icons: [
      { name: 'Smartphone', symbol: '📱', tags: 'phone mobile android device' },
      { name: 'Tablet Device', symbol: '📲', tags: 'tablet screen display' },
      { name: 'Battery Full', symbol: '🔋', tags: 'battery power charge energy' },
      { name: 'Wi-Fi Signal', symbol: '📶', tags: 'wifi wireless signal network' },
      { name: 'Bluetooth', symbol: 'ᛒ', tags: 'bluetooth connect wireless' },
      { name: 'CPU Processor', symbol: '💻', tags: 'cpu computer chip processing' },
      { name: 'Lock Vault', symbol: '🔒', tags: 'lock key secure privacy' },
      { name: 'Key Unlock', symbol: '🔑', tags: 'key access unlock auth' },
    ],
  },
];

export const AssetPickerStudio = () => {
  const { selectedNodeId, rootNode, addChildNode, updateProps } = useEditorStore();
  const targetParentId = selectedNodeId || rootNode.id;
  const [searchQuery, setSearchQuery] = useState('');

  const pickDeviceGalleryImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Gallery access permission is required to select local images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        if (selectedNodeId) {
          updateProps(selectedNodeId, { imageUri: selectedUri });
        } else {
          addChildNode(targetParentId, 'Image');
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to pick image from device library.');
    }
  };

  const handleSelectIcon = (symbol: string) => {
    if (selectedNodeId) {
      updateProps(selectedNodeId, { iconSymbol: symbol, name: symbol });
    } else {
      addChildNode(targetParentId, 'Icon');
    }
  };

  const filteredCategories = ICON_CATEGORIES.map((cat) => ({
    ...cat,
    icons: cat.icons.filter((icon) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        icon.name.toLowerCase().includes(q) ||
        icon.symbol.includes(q) ||
        icon.tags.toLowerCase().includes(q)
      );
    }),
  })).filter((cat) => cat.icons.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rich Vector & Media Asset Library</Text>

      {/* Gallery Photo Picker Action */}
      <TouchableOpacity style={styles.galleryBtn} onPress={pickDeviceGalleryImage}>
        <Text style={styles.galleryBtnIcon}>📷</Text>
        <Text style={styles.galleryBtnText}>Pick Gallery Image to Canvas</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Search Abundant Icon Library</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Filter icons (e.g., home, play, battery, user)..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#64748b"
      />

      <ScrollView style={styles.iconScroll}>
        {filteredCategories.map((cat) => (
          <View key={cat.category} style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{cat.category}</Text>
            <View style={styles.iconGrid}>
              {cat.icons.map((icon) => (
                <TouchableOpacity
                  key={icon.name}
                  style={styles.iconTile}
                  onPress={() => handleSelectIcon(icon.symbol)}
                >
                  <Text style={styles.iconSymbol}>{icon.symbol}</Text>
                  <Text style={styles.iconName} numberOfLines={1}>
                    {icon.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc', marginBottom: 10 },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  galleryBtnIcon: { fontSize: 16 },
  galleryBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  sectionHeader: { fontSize: 12, fontWeight: '600', color: '#38bdf8', marginBottom: 6 },
  searchInput: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    fontSize: 12,
    marginBottom: 10,
  },
  iconScroll: { flex: 1 },
  categoryBlock: { marginBottom: 14 },
  categoryTitle: { fontSize: 11, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 6 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconTile: {
    width: 68,
    height: 58,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  iconSymbol: { fontSize: 20 },
  iconName: { fontSize: 9, color: '#94a3b8', marginTop: 2, textAlign: 'center' },
});
