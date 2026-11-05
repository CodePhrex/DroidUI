export type ThemeMode = 'dark' | 'light' | 'material_you' | 'cyberpunk';

export interface ThemePalette {
  id: ThemeMode;
  name: string;
  bgCanvas: string;
  bgSurface: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
}

export const THEMES: Record<ThemeMode, ThemePalette> = {
  dark: {
    id: 'dark',
    name: 'Dark Studio (Default)',
    bgCanvas: '#080D1F',
    bgSurface: '#111B35',
    primary: '#398BFF',
    secondary: '#38E8F2',
    textPrimary: '#F4F7FF',
    textSecondary: '#9AADD6',
    border: '#263B68',
    accent: '#9065FF',
  },
  light: {
    id: 'light',
    name: 'Clean Light',
    bgCanvas: '#f8fafc',
    bgSurface: '#ffffff',
    primary: '#2563eb',
    secondary: '#94a3b8',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#e2e8f0',
    accent: '#7c3aed',
  },
  material_you: {
    id: 'material_you',
    name: 'Material You Dynamic',
    bgCanvas: '#1c1b1f',
    bgSurface: '#2b2930',
    primary: '#d0bcff',
    secondary: '#ccc2dc',
    textPrimary: '#e6e1e5',
    textSecondary: '#aeaaae',
    border: '#49454f',
    accent: '#efb8c8',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    bgCanvas: '#05050d',
    bgSurface: '#0d0d1a',
    primary: '#ff0055',
    secondary: '#00f0ff',
    textPrimary: '#ffe600',
    textSecondary: '#00ff66',
    border: '#ff0055',
    accent: '#00f0ff',
  },
};
