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

export interface ComponentStyle {
  flexDirection?: 'row' | 'column';
  padding?: number;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold' | '600' | '700' | '100' | '300' | '500' | '800' | '900';
  fontFamily?: string;
  letterSpacing?: number;
  lineHeight?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  width?: number | string;
  height?: number | string;
  opacity?: number; // Transparency: 0.0 to 1.0
  rotation?: number; // Rotation in degrees: e.g., 0, 15, 45, 90, 180, 270
}

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
