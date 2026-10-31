export type ComponentType =
  | 'Container'
  | 'Text'
  | 'Button'
  | 'Input'
  | 'Card'
  | 'Badge'
  | 'Icon'
  | 'Image'
  | 'ProgressBar'
  | 'Graph'
  | 'Switch'
  | 'Slider'
  | 'Checkbox'
  | 'AnimatedAsset'
  | 'SvgVector';

import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

/**
 * Shared editor style contract.
 * Uses React Native's native style definitions so dimensions and
 * supported properties remain compatible with the installed RN version.
 */
export type ComponentStyle = Partial<ViewStyle & TextStyle & ImageStyle> & {
  /** Editor-specific rotation in degrees. Converted to transform at render/export time. */
  rotation?: number;
};

export interface AnimationSpec {
  preset: 'none' | 'fadeIn' | 'springIn' | 'slideInLeft' | 'slideInRight' | 'zoomIn';
  duration: number; // ms
  delay: number; // ms
}

export interface PressStateSpec {
  activeOpacity?: number; // e.g. 0.2, 0.5, 0.8
  pressScale?: number; // e.g. 0.95, 1.05
  pressedBgColor?: string;
  pressedTextColor?: string;
  hoverBorderColor?: string;
  hoverGlow?: boolean;
}

export interface AccessibilitySpec {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'header' | 'link' | 'image' | 'text' | 'adjustable' | 'checkbox' | 'switch' | 'none';
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  accessible?: boolean;
}

export type SoundType = 'none' | 'pop' | 'click' | 'chime' | 'switch' | 'error' | 'bell';

export interface SoundEffectSpec {
  soundName?: SoundType;
  volume?: number; // 0.0 to 1.0
}

export type TransitionType = 'slide_right' | 'slide_left' | 'slide_up' | 'fade' | 'zoom' | 'flip';
export type EasingCurve = 'linear' | 'ease' | 'spring';

export interface TransitionSpec {
  type?: TransitionType;
  duration?: number; // ms
  easing?: EasingCurve;
}

export interface SplashScreenConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  logoIcon: string;
  backgroundColor: string;
  titleColor: string;
  durationMs: number;
  showSpinner: boolean;
  animationType: 'fade' | 'zoom' | 'slide_up';
}

export interface ComponentNode {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;
  style: ComponentStyle;
  animation?: AnimationSpec;
  pressState?: PressStateSpec;
  accessibility?: AccessibilitySpec;
  soundEffect?: SoundEffectSpec;
  transition?: TransitionSpec;
  children?: ComponentNode[];
}

export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt: string;
  nodeCount: number;
  rootNode: ComponentNode;
}
