import { Dimensions, PixelRatio, Platform } from 'react-native';
import * as Device from 'expo-device';
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
  source: 'expo-device-and-window-metrics';
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
  const modelName = Device.modelName || Device.deviceName || 'Android device';
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
    brand: Device.brand || 'Unknown',
    manufacturer: Device.manufacturer || 'Unknown',
    modelName,
    modelId: Device.modelId || 'Unavailable',
    osVersion: Device.osVersion || Platform.Version.toString(),
    pixelRatio,
    widthDp,
    heightDp,
    widthPx,
    heightPx,
    deviceType: String(Device.deviceType ?? 'Unknown'),
    source: 'expo-device-and-window-metrics',
    detectedAt: new Date().toISOString(),
  };
}
