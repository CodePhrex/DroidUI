import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { ComponentNode } from '../types/schema';
import { useEditorStore } from '../store/useEditorStore';
import { playSoundEffect } from '../audio/soundSynthesizer';
import { validateAndNormalizeSvg } from '../storage/svgAsset';

interface Props { node: ComponentNode; }

export const CanvasRenderer: React.FC<Props> = ({ node }) => {
  const { selectedNodeId, selectNode, activeSimMode, activeLocale, i18nDict, activeSplashPreview, splashConfig } = useEditorStore();
  const isSelected = selectedNodeId === node.id;
  const outlineStyle = isSelected ? { borderWidth: 2, borderColor: '#398BFF' } : { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' };
  const acc = node.accessibility;
  const accProps = acc ? {
    accessible: acc.accessible !== false,
    accessibilityLabel: acc.accessibilityLabel,
    accessibilityHint: acc.accessibilityHint,
    accessibilityRole: acc.accessibilityRole,
    importantForAccessibility: acc.importantForAccessibility,
  } : {};

  const handleNodePress = (e: any) => {
    e.stopPropagation();
    selectNode(node.id);
    if (node.soundEffect?.soundName) playSoundEffect(node.soundEffect.soundName, node.soundEffect.volume || 0.8);
  };

  const transform: any = {};
  if (node.style?.opacity !== undefined) transform.opacity = node.style.opacity;
  if (node.style?.rotation) transform.transform = [{ rotate: `${node.style.rotation}deg` }];
  if (activeSimMode === 'pressed' && node.pressState) {
    if (node.pressState.activeOpacity !== undefined) transform.opacity = node.pressState.activeOpacity;
    if (node.pressState.pressScale !== undefined) transform.transform = [...(transform.transform || []), { scale: node.pressState.pressScale }];
    if (node.pressState.pressedBgColor) transform.backgroundColor = node.pressState.pressedBgColor;
  } else if (activeSimMode === 'hovered' && node.pressState?.hoverBorderColor) {
    transform.borderColor = node.pressState.hoverBorderColor;
    transform.borderWidth = 2;
  }

  const text = (fallback: string, key?: string) => key && i18nDict[key]?.[activeLocale] ? i18nDict[key][activeLocale] : fallback;
  const wrap = (children: React.ReactNode, style: any = {}) => (
    <TouchableOpacity {...accProps} activeOpacity={0.8} onPress={handleNodePress} style={[style, node.style, transform, outlineStyle]}>{children}</TouchableOpacity>
  );

  if (node.id === 'root_container' && activeSplashPreview) {
    return <View style={[styles.splashOverlay, { backgroundColor: splashConfig.backgroundColor }]}>
      <Text style={{ fontSize: 56, marginBottom: 12 }}>{splashConfig.logoIcon}</Text>
      <Text style={[styles.splashTitle, { color: splashConfig.titleColor }]}>{splashConfig.title}</Text>
      <Text style={styles.splashSubtitle}>{splashConfig.subtitle}</Text>
      {splashConfig.showSpinner && <View style={styles.spinnerContainer}><Text style={styles.spinnerText}>⚡ Loading Assets...</Text></View>}
    </View>;
  }

  if (node.type === 'Container' || node.type === 'Card') return (
    <TouchableOpacity {...accProps} activeOpacity={0.9} onPress={handleNodePress} style={[node.style, transform, outlineStyle, styles.containerBase]}>
      {node.children?.map(child => <CanvasRenderer key={child.id} node={child} />)}
    </TouchableOpacity>
  );

  if (node.type === 'Text') return wrap(<Text style={node.style}>{text(node.props?.text || 'Text', node.props?.i18nKey)}</Text>, { borderRadius: 4, marginVertical: 2 });

  if (node.type === 'Input') return wrap(<Text style={{ color: node.style.color || '#9AADD6', fontSize: node.style.fontSize || 14, fontFamily: node.style.fontFamily }}>{node.props?.placeholder || 'Enter text...'}</Text>, styles.input);

  if (node.type === 'Badge') return wrap(<Text style={{ color: node.style.color || '#fff', fontSize: node.style.fontSize || 11, fontWeight: node.style.fontWeight || 'bold', fontFamily: node.style.fontFamily }}>{node.props?.text || 'Badge'}</Text>, styles.badge);

  if (node.type === 'Image') return wrap(node.props?.imageUri ? <Image source={{ uri: node.props.imageUri }} style={[{ width: '100%', height: node.style.height || 140 }, node.style]} resizeMode="cover" /> : <View style={[styles.imagePlaceholder, node.style]}><Text style={styles.muted}>📷 Image Placeholder</Text></View>, { borderRadius: node.style.borderRadius || 8, overflow: 'hidden', marginVertical: 4 });

  if (node.type === 'Icon') {
    const iconLibraries: Record<string, any> = { MaterialCommunityIcons, MaterialIcons, Ionicons, Feather, FontAwesome5, AntDesign };
    const IconSet = iconLibraries[node.props?.iconLibrary || 'MaterialCommunityIcons'] || MaterialCommunityIcons;
    return wrap(
      node.props?.iconName
        ? <IconSet name={node.props.iconName} size={node.style.fontSize || 28} color={node.style.color || '#398BFF'} />
        : <Text style={{ fontSize: node.style.fontSize || 28, color: node.style.color || '#398BFF' }}>{node.props?.iconSymbol || '❖'}</Text>,
      { padding: 4, borderRadius: 6, marginVertical: 2 }
    );
  }

  if (node.type === 'Button') return wrap(<Text style={{ color: (activeSimMode === 'pressed' && node.pressState?.pressedTextColor) || node.style.color || '#fff', fontWeight: node.style.fontWeight || 'bold', fontSize: node.style.fontSize || 14, fontFamily: node.style.fontFamily }}>{text(node.props?.label || 'Button', node.props?.i18nKey)}</Text>, styles.button);

  if (node.type === 'ProgressBar') {
    const progress = Math.min(100, Math.max(0, node.props?.progress ?? 65));
    return wrap(<><View style={styles.progressHeader}><Text style={styles.progressLabel}>{node.props?.label || 'Task Completion'}</Text><Text style={styles.progressPercent}>{progress}%</Text></View><View style={[styles.progressTrack, { backgroundColor: node.props?.trackColor || '#263B68' }]}><View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: node.props?.barColor || node.style.backgroundColor || '#398BFF' }]} /></View></>, styles.progressWrapper);
  }

  if (node.type === 'Graph') {
    const values = node.props?.values || [35, 65, 40, 85, 60, 95];
    return wrap(<><Text style={styles.graphTitle}>📊 {node.props?.title || 'Analytics Graph'}</Text><View style={styles.graphCanvas}>{values.map((v: number, i: number) => <View key={i} style={styles.graphColumn}><View style={[styles.graphBar, { height: `${Math.min(100, Math.max(0, v))}%`, backgroundColor: node.style.color || '#38E8F2' }]} /><Text style={styles.graphAxisLabel}>M{i + 1}</Text></View>)}</View></>, styles.graphWrapper);
  }

  if (node.type === 'Switch') {
    const on = node.props?.value ?? true;
    return wrap(<><Text style={[styles.switchLabel, { color: node.style.color || '#F4F7FF' }]}>{node.props?.label || 'Toggle Option'}</Text><View style={[styles.switchTrack, on ? styles.switchOn : styles.switchOff]}><View style={[styles.switchThumb, on ? styles.thumbOn : styles.thumbOff]} /></View></>, styles.switchRow);
  }

  if (node.type === 'Slider') {
    const value = Math.min(100, Math.max(0, Number(node.props?.value ?? 50)));
    return wrap(<><View style={styles.sliderHeader}><Text style={styles.sliderLabel}>{node.props?.label || 'Slider Control'}</Text><Text style={styles.sliderValText}>{value}</Text></View><View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${value}%` }]} /><View style={[styles.sliderThumb, { left: `${Math.max(0, value - 4)}%` }]} /></View></>, styles.sliderWrapper);
  }

  if (node.type === 'Checkbox') {
    const checked = node.props?.checked ?? true;
    return wrap(<><View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>{checked && <Text style={styles.checkboxCheck}>✓</Text>}</View><Text style={[styles.checkboxLabel, { color: node.style.color || '#F4F7FF' }]}>{node.props?.label || 'Accept terms and conditions'}</Text></>, styles.checkboxRow);
  }

  if (node.type === 'SvgVector') {
    const svgResult = validateAndNormalizeSvg(node.props?.svgXml);
    const size = Number(node.style.width || 48);
    const height = Number(node.style.height || size);
    return wrap(svgResult.valid && svgResult.svgXml
      ? <SvgXml xml={svgResult.svgXml} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
      : <View style={styles.svgFallback}><Text style={{ fontSize: size * 0.35 }}>📐</Text><Text style={styles.muted}>Invalid SVG</Text></View>,
      { width: size, height, marginVertical: 4, borderRadius: 8, overflow: 'hidden', backgroundColor: 'rgba(56, 189, 248, 0.08)' });
  }

  if (node.type === 'AnimatedAsset') return wrap(<><Text style={styles.assetSymbol}>✨</Text><View style={styles.assetInfo}><Text style={styles.assetName}>{node.props?.assetName || 'Glow Ring Asset'}</Text><Text style={styles.assetTag}>Animation: {(node.props?.animationType || 'pulse').toUpperCase()}</Text></View></>, styles.animatedAssetCard);

  return wrap(<Text style={styles.muted}>[{node.type}]</Text>);
};

const styles = StyleSheet.create({
  containerBase: { minHeight: 40 },
  splashOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999, justifyContent: 'center', alignItems: 'center', padding: 24 },
  splashTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  splashSubtitle: { fontSize: 13, color: '#9AADD6', textAlign: 'center', marginBottom: 24 },
  spinnerContainer: { backgroundColor: 'rgba(56, 189, 248, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#38E8F2' },
  spinnerText: { color: '#38E8F2', fontSize: 12, fontWeight: 'bold' },
  input: { backgroundColor: '#111B35', borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginVertical: 4 },
  badge: { backgroundColor: '#398BFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginVertical: 2 },
  button: { backgroundColor: '#398BFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  imagePlaceholder: { width: '100%', height: 120, backgroundColor: '#263B68', justifyContent: 'center', alignItems: 'center' },
  muted: { color: '#9AADD6', fontSize: 12 },
  progressWrapper: { padding: 10, backgroundColor: '#111B35', borderRadius: 8, marginVertical: 4 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: '#C7D5F1', fontSize: 12, fontWeight: '600' },
  progressPercent: { color: '#38E8F2', fontSize: 12, fontWeight: 'bold' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  graphWrapper: { padding: 12, backgroundColor: '#080D1F', borderRadius: 12, borderWidth: 1, borderColor: '#263B68', marginVertical: 6 },
  graphTitle: { color: '#F4F7FF', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  graphCanvas: { height: 80, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 8 },
  graphColumn: { alignItems: 'center', flex: 1 }, graphBar: { width: 14, borderRadius: 3 }, graphAxisLabel: { color: '#7186B4', fontSize: 9, marginTop: 4 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#111B35', borderRadius: 8, marginVertical: 4 },
  switchLabel: { fontSize: 13, fontWeight: '600' }, switchTrack: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' }, switchOn: { backgroundColor: '#398BFF' }, switchOff: { backgroundColor: '#475569' }, switchThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }, thumbOn: { alignSelf: 'flex-end' }, thumbOff: { alignSelf: 'flex-start' },
  sliderWrapper: { padding: 10, backgroundColor: '#111B35', borderRadius: 8, marginVertical: 4 }, sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }, sliderLabel: { color: '#C7D5F1', fontSize: 12, fontWeight: '600' }, sliderValText: { color: '#38E8F2', fontSize: 12, fontWeight: 'bold' }, sliderTrack: { height: 6, backgroundColor: '#263B68', borderRadius: 3, justifyContent: 'center', position: 'relative' }, sliderFill: { height: '100%', backgroundColor: '#398BFF', borderRadius: 3 }, sliderThumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: '#398BFF' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, marginVertical: 2 }, checkboxBox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#7186B4', justifyContent: 'center', alignItems: 'center', marginRight: 10 }, checkboxBoxChecked: { backgroundColor: '#398BFF', borderColor: '#398BFF' }, checkboxCheck: { color: '#fff', fontSize: 12, fontWeight: 'bold' }, checkboxLabel: { fontSize: 13 },
  svgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  animatedAssetCard: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: '#398BFF', borderRadius: 10, marginVertical: 4 }, assetSymbol: { fontSize: 22, marginRight: 10 }, assetInfo: { flex: 1 }, assetName: { color: '#F4F7FF', fontSize: 13, fontWeight: 'bold' }, assetTag: { color: '#38E8F2', fontSize: 10, fontWeight: '600' },
});
