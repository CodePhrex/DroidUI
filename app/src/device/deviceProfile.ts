import { Dimensions, PixelRatio, Platform } from 'react-native';

import type { ViewportSpec } from '../components/ViewportSelector';

export interface DetectedDeviceProfile {
  viewport: ViewportSpec;
  brand: string;
  manufacturer: string;
  modelName: string;
  modelId: string;
  osVersion: string;
  pixelRatio: number;
  widthDp: number;
  heightDp: number;
  widthPx: number;
  heightPx: number;
  deviceType: string;
  source: 'react-native-platform-constants-and-window-metrics';
  detectedAt: string;
}

export function detectCurrentDeviceProfile(): DetectedDeviceProfile {
  const window = Dimensions.get('window');
  const screen = Dimensions.get('screen');
  const pixelRatio = PixelRatio.get();
  const widthDp = Math.round(window.width);
  const heightDp = Math.round(window.height);
  const widthPx = Math.round(screen.width * pixelRatio);
  const heightPx = Math.round(screen.height * pixelRatio);
  const native = Platform.constants as unknown as { Model?: string; Brand?: string; Manufacturer?: string; Release?: string; Fingerprint?: string };
  const modelName = native.Model || 'Android device';
  const viewport: ViewportSpec = {
    id: 'detected_device' as any,
    name: 'My Device',
    deviceModel: modelName,
    aspectRatio: widthDp >= heightDp ? 'Landscape' : 'Portrait',
    width: widthDp,
    height: heightDp,
    icon: '📱',
  };
  return {
    viewport,
    brand: native.Brand || 'Unknown',
    manufacturer: native.Manufacturer || 'Unknown',
    modelName,
    modelId: native.Fingerprint || native.Model || 'Unavailable',
    osVersion: native.Release || Platform.Version.toString(),
    pixelRatio,
    widthDp,
    heightDp,
    widthPx,
    heightPx,
    deviceType: Platform.OS,
    source: 'react-native-platform-constants-and-window-metrics',
    detectedAt: new Date().toISOString(),
  };
}
