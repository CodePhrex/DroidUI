import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import * as ImagePicker from 'expo-image-picker';
import { buildAssetManifestFromTree, createAssetId, getAssetUsageCounts, getMissingAssetIds, removeAssetReferences, updateAssetReferences } from '../storage/assetManagement';

export interface IconCategory {
  category: string;
  icons: Array<{ name: string; symbol: string; tags: string }>;
}

export const ICON_CATEGORIES: IconCategory[] = [
  { category: 'Navigation & Layout', icons: [
    { name: 'Home', symbol: '🏠', tags: 'home main house index' }, { name: 'Menu Hamburger', symbol: '☰', tags: 'menu drawer lines hamburger' },
    { name: 'Back Arrow', symbol: '⬅️', tags: 'back left return arrow' }, { name: 'Forward Arrow', symbol: '➡️', tags: 'forward right proceed arrow' },
    { name: 'Compass', symbol: '🧭', tags: 'compass map navigation location' }, { name: 'Map Pin', symbol: '📍', tags: 'pin location marker map' },
    { name: 'Grid Layout', symbol: '⊞', tags: 'grid layout apps matrix' }, { name: 'Expand Screen', symbol: '⤢', tags: 'fullscreen expand resize' },
  ]},
  { category: 'Actions & Controls', icons: [
    { name: 'Search Glass', symbol: '🔍', tags: 'search magnifying glass find' }, { name: 'Settings Gear', symbol: '⚙️', tags: 'settings gear options config' },
    { name: 'Edit Pencil', symbol: '✏️', tags: 'edit pencil write compose' }, { name: 'Trash Delete', symbol: '🗑️', tags: 'trash delete remove bin' },
    { name: 'Add Plus', symbol: '➕', tags: 'add plus create new' }, { name: 'Check Valid', symbol: '✓', tags: 'check valid confirm success' },
    { name: 'Close Cross', symbol: '✕', tags: 'close cancel remove exit' }, { name: 'Refresh Reload', symbol: '🔄', tags: 'refresh sync reload update' },
    { name: 'Filter Funnel', symbol: '🌪️', tags: 'filter funnel sort category' }, { name: 'Share Node', symbol: '🔗', tags: 'share link URL send' },
  ]},
  { category: 'Media & Playback', icons: [
    { name: 'Play Video', symbol: '▶️', tags: 'play start video media' }, { name: 'Pause Media', symbol: '⏸️', tags: 'pause stop media' },
    { name: 'Volume High', symbol: '🔊', tags: 'volume sound speaker audio' }, { name: 'Mute Audio', symbol: '🔇', tags: 'mute silent volume off' },
    { name: 'Camera Photo', symbol: '📷', tags: 'camera photo picture image' }, { name: 'Music Note', symbol: '🎵', tags: 'music audio song note' },
    { name: 'Film Strip', symbol: '🎬', tags: 'movie film video clip' }, { name: 'Microphone Voice', symbol: '🎙️', tags: 'mic audio record voice' },
  ]},
  { category: 'Status & Signals', icons: [
    { name: 'Notification Bell', symbol: '🔔', tags: 'bell notify alert news' }, { name: 'Favorite Heart', symbol: '❤️', tags: 'heart like favorite love' },
    { name: 'Star Rating', symbol: '⭐', tags: 'star rate bookmark feature' }, { name: 'Shield Security', symbol: '🛡️', tags: 'shield security protect safe' },
    { name: 'Warning Alert', symbol: '⚠️', tags: 'warning danger caution alert' }, { name: 'Info Badge', symbol: 'ℹ️', tags: 'info detail about tip' },
    { name: 'Fire Trending', symbol: '🔥', tags: 'fire hot trending popular' }, { name: 'Sparkles Magic', symbol: '✨', tags: 'sparkles ai magic new' },
  ]},
  { category: 'Commerce & Profile', icons: [
    { name: 'User Avatar', symbol: '👤', tags: 'user profile avatar person' }, { name: 'Users Group', symbol: '👥', tags: 'users group team community' },
    { name: 'Shopping Cart', symbol: '🛒', tags: 'cart shop buy store' }, { name: 'Shopping Bag', symbol: '🛍️', tags: 'bag shop store purchase' },
    { name: 'Credit Card', symbol: '💳', tags: 'card pay payment checkout' }, { name: 'Money Coin', symbol: '💰', tags: 'money dollar cash coin' },
    { name: 'Gift Box', symbol: '🎁', tags: 'gift bonus reward present' }, { name: 'Trophy Winner', symbol: '🏆', tags: 'trophy award win rank' },
  ]},
  { category: 'Hardware & System', icons: [
    { name: 'Smartphone', symbol: '📱', tags: 'phone mobile android device' }, { name: 'Tablet Device', symbol: '📲', tags: 'tablet screen display' },
    { name: 'Battery Full', symbol: '🔋', tags: 'battery power charge energy' }, { name: 'Wi-Fi Signal', symbol: '📶', tags: 'wifi wireless signal network' },
    { name: 'Bluetooth', symbol: 'ᛒ', tags: 'bluetooth connect wireless' }, { name: 'CPU Processor', symbol: '💻', tags: 'cpu computer chip processing' },
    { name: 'Lock Vault', symbol: '🔒', tags: 'lock key secure privacy' }, { name: 'Key Unlock', symbol: '🔑', tags: 'key access unlock auth' },
  ]},
];

export const AssetPickerStudio = () => {
  const { selectedNodeId, rootNode, addChildNode, updateProps } = useEditorStore();
  const findNode = (node: any, id: string): any => {
    if (node.id === id) return node;
    for (const child of node.children || []) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };
  const findTargetContainer = (node: any, targetId: string, currentContainerId: string): string => {
    if (node.id === targetId) return node.type === 'Container' || node.type === 'Card' ? node.id : currentContainerId;
    const nextContainerId = node.type === 'Container' || node.type === 'Card' ? node.id : currentContainerId;
    for (const child of node.children || []) {
      const found = findTargetContainer(child, targetId, nextContainerId);
      if (found !== nextContainerId || child.id === targetId) return found;
    }
    return currentContainerId;
  };
  const selectedNode = selectedNodeId ? findNode(rootNode, selectedNodeId) : null;
  const targetParentId = selectedNodeId ? findTargetContainer(rootNode, selectedNodeId, rootNode.id) : rootNode.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const assets = useMemo(() => buildAssetManifestFromTree(rootNode), [rootNode]);
  const usageCounts = useMemo(() => getAssetUsageCounts(rootNode), [rootNode]);
  const missingIds = useMemo(() => getMissingAssetIds(rootNode, assets), [rootNode, assets]);

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
        base64: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const picked = result.assets[0];
      if (!picked.base64) {
        Alert.alert('Import Failed', 'The selected image did not provide embeddable image data.');
        return;
      }
      const assetId = createAssetId();
      const mimeType = picked.mimeType || 'image/jpeg';
      const dataUri = `data:${mimeType};base64,${picked.base64}`;
      const props = {
        assetId,
        assetName: picked.fileName || `Image ${assets.length + 1}`,
        mimeType,
        imageUri: dataUri,
        sourceUri: picked.uri,
        assetWidth: picked.width,
        assetHeight: picked.height,
        assetSizeBytes: picked.fileSize,
        assetCreatedAt: new Date().toISOString(),
      };
      if (selectedNode?.type === 'Image') {
        updateProps(selectedNode.id, props);
      } else {
        addChildNode(targetParentId, 'Image');
        const createdId = useEditorStore.getState().selectedNodeId;
        if (createdId) useEditorStore.getState().updateProps(createdId, props);
      }
    } catch {
      Alert.alert('Error', 'Unable to import image from the device library.');
    }
  };

  const renameAsset = (assetId: string) => {
    const nextName = renameValue.trim();
    if (!nextName) return;
    useEditorStore.setState((state) => ({ rootNode: updateAssetReferences(state.rootNode, assetId, { assetName: nextName }) }));
    setRenameId(null);
    setRenameValue('');
  };

  const deleteAsset = (assetId: string, usageCount: number) => {
    const remove = () => useEditorStore.setState((state) => ({ rootNode: removeAssetReferences(state.rootNode, assetId) }));
    if (usageCount > 0) {
      Alert.alert('Asset In Use', `This asset is used by ${usageCount} component${usageCount === 1 ? '' : 's'}. Remove it from those components?`, [
        { text: 'Cancel', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: remove },
      ]);
    } else remove();
  };

  const handleSelectIcon = (symbol: string) => {
    if (selectedNode?.type === 'Icon') {
      updateProps(selectedNode.id, { iconSymbol: symbol, name: symbol });
      return;
    }
    addChildNode(targetParentId, 'Icon');
    const createdId = useEditorStore.getState().selectedNodeId;
    if (createdId) useEditorStore.getState().updateProps(createdId, { iconSymbol: symbol, name: symbol });
  };

  const filteredCategories = ICON_CATEGORIES.map((cat) => ({
    ...cat,
    icons: cat.icons.filter((icon) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return icon.name.toLowerCase().includes(q) || icon.symbol.includes(q) || icon.tags.toLowerCase().includes(q);
    }),
  })).filter((cat) => cat.icons.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rich Vector & Media Asset Library</Text>
      <TouchableOpacity style={styles.galleryBtn} onPress={pickDeviceGalleryImage}>
        <Text style={styles.galleryBtnIcon}>📷</Text><Text style={styles.galleryBtnText}>Import Gallery Image</Text>
      </TouchableOpacity>
      <Text style={styles.sectionHeader}>Project Assets</Text>
      {assets.length === 0 && missingIds.length === 0 ? <Text style={styles.emptyText}>No imported image assets in this project.</Text> : (
        <View style={styles.assetList}>
          {assets.map((asset) => (
            <View key={asset.id} style={styles.assetRow}>
              <Image source={{ uri: asset.dataUri }} style={styles.assetPreview} resizeMode="cover" />
              <View style={styles.assetDetails}>
                {renameId === asset.id ? <TextInput autoFocus value={renameValue} onChangeText={setRenameValue} onSubmitEditing={() => renameAsset(asset.id)} style={styles.renameInput} /> : <Text style={styles.assetName} numberOfLines={1}>{asset.name}</Text>}
                <Text style={styles.assetMeta}>{asset.width || '?'}×{asset.height || '?'} · Used {usageCounts[asset.id] || 0}×</Text>
              </View>
              <TouchableOpacity style={styles.smallBtn} onPress={() => { setRenameId(asset.id); setRenameValue(asset.name); }}><Text style={styles.smallBtnText}>Rename</Text></TouchableOpacity>
              {renameId === asset.id && <TouchableOpacity style={styles.smallBtn} onPress={() => renameAsset(asset.id)}><Text style={styles.smallBtnText}>Save</Text></TouchableOpacity>}
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteAsset(asset.id, usageCounts[asset.id] || 0)}><Text style={styles.smallBtnText}>Delete</Text></TouchableOpacity>
            </View>
          ))}
          {missingIds.map((id) => <View key={id} style={styles.missingRow}><Text style={styles.missingText}>⚠ Missing asset: {id}</Text></View>)}
        </View>
      )}
      <Text style={styles.sectionHeader}>Search Icon Library</Text>
      <TextInput style={styles.searchInput} placeholder="Filter icons (e.g., home, play, battery, user)..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#64748b" />
      <ScrollView style={styles.iconScroll}>
        {filteredCategories.map((cat) => (
          <View key={cat.category} style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{cat.category}</Text>
            <View style={styles.iconGrid}>{cat.icons.map((icon) => (
              <TouchableOpacity key={icon.name} style={styles.iconTile} onPress={() => handleSelectIcon(icon.symbol)}>
                <Text style={styles.iconSymbol}>{icon.symbol}</Text><Text style={styles.iconName} numberOfLines={1}>{icon.name}</Text>
              </TouchableOpacity>
            ))}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc', marginBottom: 10 },
  galleryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb', padding: 10, borderRadius: 8, gap: 8, marginBottom: 12 },
  galleryBtnIcon: { fontSize: 16 }, galleryBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  sectionHeader: { fontSize: 12, fontWeight: '600', color: '#38bdf8', marginBottom: 6, marginTop: 6 },
  emptyText: { fontSize: 11, color: '#64748b', marginBottom: 8 }, assetList: { marginBottom: 8 },
  assetRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 7, padding: 6, marginBottom: 5 },
  assetPreview: { width: 34, height: 34, borderRadius: 5, backgroundColor: '#1e293b' }, assetDetails: { flex: 1, minWidth: 80 }, assetName: { color: '#f8fafc', fontSize: 11, fontWeight: '600' },
  assetMeta: { color: '#64748b', fontSize: 9, marginTop: 2 }, renameInput: { color: '#fff', fontSize: 11, borderBottomWidth: 1, borderBottomColor: '#38bdf8', paddingVertical: 2 },
  smallBtn: { paddingHorizontal: 6, paddingVertical: 5, borderRadius: 5, backgroundColor: '#334155' }, deleteBtn: { paddingHorizontal: 6, paddingVertical: 5, borderRadius: 5, backgroundColor: '#7f1d1d' }, smallBtnText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  missingRow: { backgroundColor: '#451a03', padding: 7, borderRadius: 6, marginBottom: 5 }, missingText: { color: '#fbbf24', fontSize: 10 },
  searchInput: { backgroundColor: '#0f172a', color: '#ffffff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', fontSize: 12, marginBottom: 10 },
  iconScroll: { flex: 1 }, categoryBlock: { marginBottom: 14 }, categoryTitle: { fontSize: 11, fontWeight: 'bold', color: '#cbd5e1', marginBottom: 6 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, iconTile: { width: 68, height: 58, backgroundColor: '#1e293b', borderRadius: 8, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', padding: 4 },
  iconSymbol: { fontSize: 20 }, iconName: { fontSize: 9, color: '#94a3b8', marginTop: 2, textAlign: 'center' },
});
