import React, { useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, PanResponder } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ComponentNode } from '../types/schema';
import { useEditorStore } from '../store/useEditorStore';
import { playSoundEffect } from '../audio/soundSynthesizer';
import { validateAndNormalizeSvg } from '../storage/svgAsset';

interface Props { node: ComponentNode; previewMode?: boolean; }

export const CanvasRenderer: React.FC<Props> = ({ node, previewMode = false }) => {
  const { selectedNodeId, selectNode, activeSimMode, activeLocale, i18nDict, activeSplashPreview, splashConfig, duplicateNode, deleteNode, moveChildNode, rootNode, updateStyle } = useEditorStore();
  const layoutOrigin = useRef({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0 });
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_event, gesture) => !previewMode && node.id !== rootNode.id && (Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6),
    onPanResponderGrant: () => {
      selectNode(node.id);
      dragOrigin.current = node.style.position === 'absolute'
        ? { x: Number(node.style.left || 0), y: Number(node.style.top || 0) }
        : { ...layoutOrigin.current };
    },
    onPanResponderRelease: (_event, gesture) => {
      if (node.id === rootNode.id) return;
      updateStyle(node.id, {
        position: 'absolute',
        left: Math.max(0, dragOrigin.current.x + gesture.dx),
        top: Math.max(0, dragOrigin.current.y + gesture.dy),
      });
    },
  }), [node.id, node.style.position, node.style.left, node.style.top, previewMode, rootNode.id, selectNode, updateStyle]);
  const trackLayout = (event: any) => {
    layoutOrigin.current = { x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y };
  };
  const isSelected = selectedNodeId === node.id;
  const outlineStyle = previewMode ? { borderWidth: 0, borderColor: 'transparent' } : isSelected ? { borderWidth: 2, borderColor: '#3b82f6' } : { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' };
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
  const findParentPosition = (current: ComponentNode, targetId: string): { parentId: string; index: number } | null => {
    for (let index = 0; index < (current.children || []).length; index += 1) {
      const child = current.children![index];
      if (child.id === targetId) return { parentId: current.id, index };
      const nested = findParentPosition(child, targetId);
      if (nested) return nested;
    }
    return null;
  };
  const handleNodeContextMenu = () => {
    if (previewMode || node.id === rootNode.id) return;
    selectNode(node.id);
    const position = findParentPosition(rootNode, node.id);
    const buttons: Array<{ text: string; onPress?: () => void; style?: 'cancel' | 'destructive' }> = [
      { text: 'Select / Edit', onPress: () => selectNode(node.id) },
      { text: 'Duplicate', onPress: () => duplicateNode(node.id) },
    ];
    if (position) {
      buttons.push({ text: 'Move Forward', onPress: () => moveChildNode(position.parentId, position.index, Math.min(position.index + 1, (findNode(rootNode, position.parentId)?.children?.length || 1) - 1)) });
      buttons.push({ text: 'Move Backward', onPress: () => moveChildNode(position.parentId, position.index, Math.max(0, position.index - 1)) });
    }
    buttons.push({ text: 'Delete', style: 'destructive', onPress: () => deleteNode(node.id) });
    buttons.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Element actions', node.props?.label || node.props?.text || node.type, buttons);
  };
  const findNode = (current: ComponentNode, targetId: string): ComponentNode | null => {
    if (current.id === targetId) return current;
    for (const child of current.children || []) {
      const found = findNode(child, targetId);
      if (found) return found;
    }
    return null;
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
  const wrap = (children: React.ReactNode, style: any = {}) => previewMode ? (
    <View {...accProps} style={[style, node.style, transform, outlineStyle]}>{children}</View>
  ) : (
    <TouchableOpacity {...accProps} {...panResponder.panHandlers} onLayout={trackLayout} activeOpacity={0.8} onPress={handleNodePress} onLongPress={handleNodeContextMenu} delayLongPress={450} style={[style, node.style, transform, outlineStyle]}>{children}</TouchableOpacity>
  );

  if (node.id === 'root_container' && activeSplashPreview) {
    return <View style={[styles.splashOverlay, { backgroundColor: splashConfig.backgroundColor }]}>
      <Text style={{ fontSize: 56, marginBottom: 12 }}>{splashConfig.logoIcon}</Text>
      <Text style={[styles.splashTitle, { color: splashConfig.titleColor }]}>{splashConfig.title}</Text>
      <Text style={styles.splashSubtitle}>{splashConfig.subtitle}</Text>
      {splashConfig.showSpinner && <View style={styles.spinnerContainer}><Text style={styles.spinnerText}>⚡ Loading Assets...</Text></View>}
    </View>;
  }

  if (node.type === 'Container' || node.type === 'Card') {
    const content = node.children?.map(child => <CanvasRenderer key={child.id} node={child} previewMode={previewMode} />);
    return previewMode ? (
      <View {...accProps} style={[node.style, transform, outlineStyle, styles.containerBase]}>{content}</View>
    ) : (
      <TouchableOpacity {...accProps} {...panResponder.panHandlers} onLayout={trackLayout} activeOpacity={0.9} onPress={handleNodePress} onLongPress={handleNodeContextMenu} delayLongPress={450} style={[node.style, transform, outlineStyle, styles.containerBase]}>{content}</TouchableOpacity>
    );
  }

  if (node.type === 'Text') return wrap(<Text style={node.style}>{text(node.props?.text || 'Text', node.props?.i18nKey)}</Text>, { borderRadius: 4, marginVertical: 2 });

  if (node.type === 'Input') return wrap(<Text style={{ color: node.style.color || '#94a3b8', fontSize: node.style.fontSize || 14, fontFamily: node.style.fontFamily }}>{node.props?.placeholder || 'Enter text...'}</Text>, styles.input);

  if (node.type === 'Badge') return wrap(<Text style={{ color: node.style.color || '#fff', fontSize: node.style.fontSize || 11, fontWeight: node.style.fontWeight || 'bold', fontFamily: node.style.fontFamily }}>{node.props?.text || 'Badge'}</Text>, styles.badge);

  if (node.type === 'Image') return wrap(node.props?.imageUri ? <Image source={{ uri: node.props.imageUri }} style={[{ width: '100%', height: node.style.height || 140 }, node.style]} resizeMode="cover" /> : <View style={[styles.imagePlaceholder, node.style]}><Text style={styles.muted}>📷 Image Placeholder</Text></View>, { borderRadius: node.style.borderRadius || 8, overflow: 'hidden', marginVertical: 4 });

  if (node.type === 'Icon') return wrap(<Text style={{ fontSize: node.style.fontSize || 28, color: node.style.color || '#3b82f6' }}>{node.props?.iconSymbol || '❖'}</Text>, { padding: 4, borderRadius: 6, marginVertical: 2 });

  if (node.type === 'Button') return wrap(<Text style={{ color: (activeSimMode === 'pressed' && node.pressState?.pressedTextColor) || node.style.color || '#fff', fontWeight: node.style.fontWeight || 'bold', fontSize: node.style.fontSize || 14, fontFamily: node.style.fontFamily }}>{text(node.props?.label || 'Button', node.props?.i18nKey)}</Text>, styles.button);

  if (node.type === 'ProgressBar') {
    const progress = Math.min(100, Math.max(0, node.props?.progress ?? 65));
    return wrap(<><View style={styles.progressHeader}><Text style={styles.progressLabel}>{node.props?.label || 'Task Completion'}</Text><Text style={styles.progressPercent}>{progress}%</Text></View><View style={[styles.progressTrack, { backgroundColor: node.props?.trackColor || '#334155' }]}><View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: node.props?.barColor || node.style.backgroundColor || '#3b82f6' }]} /></View></>, styles.progressWrapper);
  }

  if (node.type === 'Graph') {
    const values = node.props?.values || [35, 65, 40, 85, 60, 95];
    return wrap(<><Text style={styles.graphTitle}>📊 {node.props?.title || 'Analytics Graph'}</Text><View style={styles.graphCanvas}>{values.map((v: number, i: number) => <View key={i} style={styles.graphColumn}><View style={[styles.graphBar, { height: `${Math.min(100, Math.max(0, v))}%`, backgroundColor: node.style.color || '#38bdf8' }]} /><Text style={styles.graphAxisLabel}>M{i + 1}</Text></View>)}</View></>, styles.graphWrapper);
  }

  if (node.type === 'Switch') {
    const on = node.props?.value ?? true;
    return wrap(<><Text style={[styles.switchLabel, { color: node.style.color || '#f8fafc' }]}>{node.props?.label || 'Toggle Option'}</Text><View style={[styles.switchTrack, on ? styles.switchOn : styles.switchOff]}><View style={[styles.switchThumb, on ? styles.thumbOn : styles.thumbOff]} /></View></>, styles.switchRow);
  }

  if (node.type === 'Slider') {
    const value = Math.min(100, Math.max(0, Number(node.props?.value ?? 50)));
    return wrap(<><View style={styles.sliderHeader}><Text style={styles.sliderLabel}>{node.props?.label || 'Slider Control'}</Text><Text style={styles.sliderValText}>{value}</Text></View><View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${value}%` }]} /><View style={[styles.sliderThumb, { left: `${Math.max(0, value - 4)}%` }]} /></View></>, styles.sliderWrapper);
  }

  if (node.type === 'Checkbox') {
    const checked = node.props?.checked ?? true;
    return wrap(<><View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>{checked && <Text style={styles.checkboxCheck}>✓</Text>}</View><Text style={[styles.checkboxLabel, { color: node.style.color || '#f8fafc' }]}>{node.props?.label || 'Accept terms and conditions'}</Text></>, styles.checkboxRow);
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
  splashSubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 24 },
  spinnerContainer: { backgroundColor: 'rgba(56, 189, 248, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#38bdf8' },
  spinnerText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },
  input: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginVertical: 4 },
  badge: { backgroundColor: '#3b82f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginVertical: 2 },
  button: { backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  imagePlaceholder: { width: '100%', height: 120, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  muted: { color: '#94a3b8', fontSize: 12 },
  progressWrapper: { padding: 10, backgroundColor: '#1e293b', borderRadius: 8, marginVertical: 4 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  progressPercent: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  graphWrapper: { padding: 12, backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginVertical: 6 },
  graphTitle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  graphCanvas: { height: 80, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 8 },
  graphColumn: { alignItems: 'center', flex: 1 }, graphBar: { width: 14, borderRadius: 3 }, graphAxisLabel: { color: '#64748b', fontSize: 9, marginTop: 4 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#1e293b', borderRadius: 8, marginVertical: 4 },
  switchLabel: { fontSize: 13, fontWeight: '600' }, switchTrack: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' }, switchOn: { backgroundColor: '#3b82f6' }, switchOff: { backgroundColor: '#475569' }, switchThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }, thumbOn: { alignSelf: 'flex-end' }, thumbOff: { alignSelf: 'flex-start' },
  sliderWrapper: { padding: 10, backgroundColor: '#1e293b', borderRadius: 8, marginVertical: 4 }, sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }, sliderLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' }, sliderValText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' }, sliderTrack: { height: 6, backgroundColor: '#334155', borderRadius: 3, justifyContent: 'center', position: 'relative' }, sliderFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 3 }, sliderThumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: '#3b82f6' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, marginVertical: 2 }, checkboxBox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#64748b', justifyContent: 'center', alignItems: 'center', marginRight: 10 }, checkboxBoxChecked: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' }, checkboxCheck: { color: '#fff', fontSize: 12, fontWeight: 'bold' }, checkboxLabel: { fontSize: 13 },
  svgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  animatedAssetCard: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: '#3b82f6', borderRadius: 10, marginVertical: 4 }, assetSymbol: { fontSize: 22, marginRight: 10 }, assetInfo: { flex: 1 }, assetName: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' }, assetTag: { color: '#38bdf8', fontSize: 10, fontWeight: '600' },
});
