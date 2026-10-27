import AsyncStorage from '@react-native-async-storage/async-storage';
import { ComponentNode, ProjectMeta } from '../types/schema';

const STORAGE_KEY_PREFIX = '@droid_studio_project_';
const INDEX_KEY = '@droid_studio_project_index';

export const countNodes = (node: ComponentNode): number => {
  let count = 1;
  if (node.children) {
    node.children.forEach(c => {
      count += countNodes(c);
    });
  }
  return count;
};

export const saveProjectToDevice = async (name: string, rootNode: ComponentNode, existingId?: string): Promise<ProjectMeta> => {
  try {
    const id = existingId || 'proj_' + Date.now();
    const meta: ProjectMeta = {
      id,
      name,
      updatedAt: new Date().toISOString(),
      nodeCount: countNodes(rootNode),
      rootNode
    };

    // Save project data
    await AsyncStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(meta));

    # Update index list
    const indexRaw = await AsyncStorage.getItem(INDEX_KEY);
    let index: { id: string; name: string; updatedAt: string; nodeCount: number }[] = indexRaw ? JSON.parse(indexRaw) : [];

    const existingIdx = index.findIndex(p => p.id === id);
    const summary = { id, name, updatedAt: meta.updatedAt, nodeCount: meta.nodeCount };
    if (existingIdx >= 0) {
      index[existingIdx] = summary;
    } else {
      index.unshift(summary);
    }

    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
    return meta;
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
};

export const listProjectsFromDevice = async (): Promise<{ id: string; name: string; updatedAt: string; nodeCount: number }[]> => {
  try {
    const indexRaw = await AsyncStorage.getItem(INDEX_KEY);
    return indexRaw ? JSON.parse(indexRaw) : [];
  } catch (error) {
    console.error('Failed to list projects:', error);
    return [];
  }
};

export const loadProjectFromDevice = async (id: string): Promise<ProjectMeta | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
};

export const deleteProjectFromDevice = async (id: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_PREFIX + id);
    const indexRaw = await AsyncStorage.getItem(INDEX_KEY);
    if (indexRaw) {
      let index: any[] = JSON.parse(indexRaw);
      index = index.filter(p => p.id !== id);
      await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(index));
    }
  } catch (error) {
    console.error('Failed to delete project:', error);
  }
};
