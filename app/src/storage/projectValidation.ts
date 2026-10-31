import type { ComponentNode, SplashScreenConfig } from '../types/schema';
import type { ThemeMode } from '../theme/themeConfig';
import type { SupportedLocale, I18nDictionary } from '../types/localization';

const COMPONENT_TYPES = new Set([
  'Container', 'Text', 'Button', 'Input', 'Card', 'Badge', 'Icon', 'Image',
  'ProgressBar', 'Graph', 'Switch', 'Slider', 'Checkbox', 'AnimatedAsset', 'SvgVector',
]);
const THEMES = new Set(['dark', 'light', 'material_you', 'cyberpunk']);
const LOCALES = new Set(['en', 'es', 'fr', 'de', 'ja', 'zh']);
const ANIMATIONS = new Set(['fade', 'zoom', 'slide_up']);

export const isRecord = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

export interface TreeValidation {
  valid: boolean;
  nodeCount: number;
  error?: string;
}

export const validateComponentTree = (root: unknown, maxDepth = 200): TreeValidation => {
  const ids = new Set<string>();
  const visited = new WeakSet<object>();
  let nodeCount = 0;

  const visit = (value: unknown, depth: number): string | undefined => {
    if (!isRecord(value)) return 'Each component must be an object.';
    if (depth > maxDepth) return `Component tree exceeds maximum depth of ${maxDepth}.`;
    if (visited.has(value)) return 'Component tree contains a circular reference.';
    visited.add(value);

    if (typeof value.id !== 'string' || !value.id.trim()) return 'Every component must have a non-empty string ID.';
    if (ids.has(value.id)) return `Duplicate component ID: ${value.id}.`;
    ids.add(value.id);

    if (typeof value.type !== 'string' || !COMPONENT_TYPES.has(value.type)) {
      return `Unsupported component type: ${String(value.type)}.`;
    }
    if (!isRecord(value.style)) return `Component ${value.id} must have a style object.`;
    for (const field of ['props', 'animation', 'pressState', 'accessibility', 'soundEffect', 'transition']) {
      if (value[field] !== undefined && !isRecord(value[field])) {
        return `Component ${value.id} has an invalid ${field} object.`;
      }
    }
    if (value.children !== undefined && !Array.isArray(value.children)) {
      return `Component ${value.id} children must be an array.`;
    }

    nodeCount += 1;
    for (const child of value.children || []) {
      const error = visit(child, depth + 1);
      if (error) return error;
    }
    return undefined;
  };

  const error = visit(root, 0);
  return error ? { valid: false, nodeCount, error } : { valid: true, nodeCount };
};

export const validateSplashConfig = (value: unknown): value is SplashScreenConfig => {
  if (!isRecord(value)) return false;
  return typeof value.enabled === 'boolean' &&
    typeof value.title === 'string' &&
    typeof value.subtitle === 'string' &&
    typeof value.logoIcon === 'string' &&
    typeof value.backgroundColor === 'string' &&
    /^#[0-9a-fA-F]{6}$/.test(value.backgroundColor) &&
    typeof value.titleColor === 'string' &&
    /^#[0-9a-fA-F]{6}$/.test(value.titleColor) &&
    Number.isInteger(value.durationMs) && value.durationMs >= 0 && value.durationMs <= 60000 &&
    typeof value.showSpinner === 'boolean' &&
    ANIMATIONS.has(value.animationType);
};

export const validateI18nDictionary = (value: unknown): value is I18nDictionary => {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([key, translations]) =>
    key.trim().length > 0 && isRecord(translations) &&
    Object.entries(translations).every(([locale, text]) =>
      LOCALES.has(locale) && typeof text === 'string'));
};

export const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && THEMES.has(value);

export const isSupportedLocale = (value: unknown): value is SupportedLocale =>
  typeof value === 'string' && LOCALES.has(value);
