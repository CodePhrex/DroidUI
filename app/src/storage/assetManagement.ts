import { ComponentNode } from '../types/schema';

export interface ProjectAsset {
  id: string;
  name: string;
  mimeType: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  dataUri: string;
  sourceUri?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssetManifest = ProjectAsset[];

export const ASSET_ID_PREFIX = 'asset_';

export const createAssetId = (): string =>
  `${ASSET_ID_PREFIX}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

export const toDataUri = (mimeType: string, base64: string): string =>
  `data:${mimeType || 'image/jpeg'};base64,${base64}`;

const isRecord = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

export const normalizeAssetManifest = (value: unknown): AssetManifest => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .filter((asset) =>
      typeof asset.id === 'string' && asset.id.trim() &&
      typeof asset.name === 'string' && asset.name.trim() &&
      typeof asset.mimeType === 'string' && asset.mimeType.startsWith('image/') &&
      typeof asset.dataUri === 'string' && asset.dataUri.startsWith('data:image/')
    )
    .map((asset) => ({
      id: asset.id,
      name: asset.name,
      mimeType: asset.mimeType,
      width: typeof asset.width === 'number' ? asset.width : undefined,
      height: typeof asset.height === 'number' ? asset.height : undefined,
      sizeBytes: typeof asset.sizeBytes === 'number' ? asset.sizeBytes : undefined,
      dataUri: asset.dataUri,
      sourceUri: typeof asset.sourceUri === 'string' ? asset.sourceUri : undefined,
      createdAt: typeof asset.createdAt === 'string' ? asset.createdAt : new Date().toISOString(),
      updatedAt: typeof asset.updatedAt === 'string' ? asset.updatedAt : new Date().toISOString(),
    }));
};

export const walkComponentTree = (rootNode: ComponentNode, visit: (node: ComponentNode) => void): void => {
  visit(rootNode);
  rootNode.children?.forEach((child) => walkComponentTree(child, visit));
};

export const getAssetUsageCounts = (rootNode: ComponentNode): Record<string, number> => {
  const counts: Record<string, number> = {};
  walkComponentTree(rootNode, (node) => {
    const assetId = node.props?.assetId;
    if (typeof assetId === 'string' && assetId.trim()) {
      counts[assetId] = (counts[assetId] || 0) + 1;
    }
  });
  return counts;
};

export const getMissingAssetIds = (rootNode: ComponentNode, assets: AssetManifest): string[] => {
  const known = new Set(assets.map((asset) => asset.id));
  return Object.keys(getAssetUsageCounts(rootNode)).filter((id) => !known.has(id));
};

export const buildAssetManifestFromTree = (rootNode: ComponentNode): AssetManifest => {
  const assets = new Map<string, ProjectAsset>();
  walkComponentTree(rootNode, (node) => {
    const props = node.props;
    if (!props || typeof props.assetId !== 'string' || !props.assetId.trim()) return;
    const dataUri = typeof props.imageUri === 'string' && props.imageUri.startsWith('data:image/')
      ? props.imageUri
      : '';
    if (!dataUri) return;
    if (!assets.has(props.assetId)) {
      const now = new Date().toISOString();
      assets.set(props.assetId, {
        id: props.assetId,
        name: typeof props.assetName === 'string' && props.assetName.trim() ? props.assetName : 'Imported Image',
        mimeType: typeof props.mimeType === 'string' ? props.mimeType : dataUri.slice(5, dataUri.indexOf(';')) || 'image/jpeg',
        width: typeof props.assetWidth === 'number' ? props.assetWidth : undefined,
        height: typeof props.assetHeight === 'number' ? props.assetHeight : undefined,
        sizeBytes: typeof props.assetSizeBytes === 'number' ? props.assetSizeBytes : undefined,
        dataUri,
        sourceUri: typeof props.sourceUri === 'string' ? props.sourceUri : undefined,
        createdAt: typeof props.assetCreatedAt === 'string' ? props.assetCreatedAt : now,
        updatedAt: now,
      });
    }
  });
  return Array.from(assets.values());
};

export const updateAssetReferences = (
  rootNode: ComponentNode,
  assetId: string,
  patch: Record<string, any>
): ComponentNode => {
  const update = (node: ComponentNode): ComponentNode => ({
    ...node,
    props: node.props?.assetId === assetId ? { ...node.props, ...patch } : node.props,
    children: node.children?.map(update),
  });
  return update(rootNode);
};

export const removeAssetReferences = (rootNode: ComponentNode, assetId: string): ComponentNode => {
  const update = (node: ComponentNode): ComponentNode => {
    if (node.props?.assetId !== assetId) {
      return { ...node, children: node.children?.map(update) };
    }
    const nextProps = { ...(node.props || {}) };
    delete nextProps.assetId;
    delete nextProps.assetName;
    delete nextProps.mimeType;
    delete nextProps.imageUri;
    delete nextProps.sourceUri;
    delete nextProps.assetWidth;
    delete nextProps.assetHeight;
    delete nextProps.assetSizeBytes;
    delete nextProps.assetCreatedAt;
    return { ...node, props: nextProps, children: node.children?.map(update) };
  };
  return update(rootNode);
};

export const getAssetById = (assets: AssetManifest, assetId: string | undefined): ProjectAsset | undefined =>
  assetId ? assets.find((asset) => asset.id === assetId) : undefined;
