import { ComponentStyle } from '../types/schema';

export interface VisualStylePreset {
  id: string;
  label: string;
  description: string;
  style: Partial<ComponentStyle>;
}

export const VISUAL_STYLE_PRESETS: VisualStylePreset[] = [
  { id: 'soft_surface', label: 'Soft Surface', description: 'Quiet neutral surface with generous rounding.', style: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 16, padding: 14 } },
  { id: 'elevated_card', label: 'Elevated Card', description: 'Bright card with subtle elevation.', style: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 18, padding: 16, elevation: 4, shadowColor: '#0f172a', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } } },
  { id: 'glass_dark', label: 'Glass Dark', description: 'Translucent dark glass-like surface.', style: { backgroundColor: 'rgba(15, 23, 42, 0.92)', borderColor: '#475569', borderWidth: 1, borderRadius: 18, padding: 16 } },
  { id: 'neon_edge', label: 'Neon Edge', description: 'Dark surface with bright cyan accent border.', style: { backgroundColor: '#0f172a', borderColor: '#22d3ee', borderWidth: 1.5, borderRadius: 14, padding: 14, shadowColor: '#22d3ee', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } } },
  { id: 'outline', label: 'Outline', description: 'Minimal transparent surface with a clear border.', style: { backgroundColor: 'transparent', borderColor: '#64748b', borderWidth: 1.5, borderRadius: 10, padding: 12 } },
  { id: 'pill', label: 'Pill', description: 'Rounded capsule treatment for compact controls.', style: { backgroundColor: '#2563eb', borderColor: '#2563eb', borderWidth: 1, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 } },
  { id: 'midnight', label: 'Midnight', description: 'Deep navy surface with cool blue contrast.', style: { backgroundColor: '#172554', borderColor: '#1d4ed8', borderWidth: 1, borderRadius: 14, padding: 14 } },
  { id: 'warm_editorial', label: 'Warm Editorial', description: 'Warm paper-like surface with understated brown border.', style: { backgroundColor: '#fff7ed', borderColor: '#fed7aa', borderWidth: 1, borderRadius: 12, padding: 16 } },
];
