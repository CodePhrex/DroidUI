import AsyncStorage from '@react-native-async-storage/async-storage';
import { ComponentNode } from '../types/schema';

const KEY = '@droidui_custom_design_presets_v1';
export interface SavedDesignPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  node: ComponentNode;
}
const validNode = (node: any): node is ComponentNode =>
  !!node && typeof node.id === 'string' && typeof node.type === 'string' &&
  !!node.style && typeof node.style === 'object' &&
  (!node.children || (Array.isArray(node.children) && node.children.every(validNode)));

export const listCustomDesignPresets = async (): Promise<SavedDesignPreset[]> => {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(item =>
      item && typeof item.id === 'string' && typeof item.name === 'string' && validNode(item.node)
    ) : [];
  } catch {
    return [];
  }
};

export const saveCustomDesignPreset = async (
  name: string, node: ComponentNode, description = 'Saved from the DroidUI editor'
): Promise<SavedDesignPreset> => {
  const cleanName = name.trim();
  if (!cleanName) throw new Error('Enter a name for this preset.');
  if (!validNode(node)) throw new Error('The selected design cannot be saved as a preset.');
  const presets = await listCustomDesignPresets();
  const preset: SavedDesignPreset = {
    id: 'custom_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
    name: cleanName,
    description,
    category: 'My Presets',
    createdAt: new Date().toISOString(),
    node: JSON.parse(JSON.stringify(node)),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify([preset, ...presets]));
  return preset;
};

export const deleteCustomDesignPreset = async (id: string): Promise<void> => {
  const presets = await listCustomDesignPresets();
  await AsyncStorage.setItem(KEY, JSON.stringify(presets.filter(item => item.id !== id)));
};
