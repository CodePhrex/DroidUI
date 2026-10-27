import { ComponentType } from './schema';

export interface AccessibilitySpec {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'header' | 'link' | 'image' | 'text' | 'adjustable' | 'checkbox' | 'switch' | 'none';
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  accessible?: boolean;
}

export type { ComponentType };
