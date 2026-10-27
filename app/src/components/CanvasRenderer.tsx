import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ComponentNode } from '../types/schema';
import { useEditorStore } from '../store/useEditorStore';
import { playSoundEffect } from '../audio/soundSynthesizer';

interface Props {
  node: ComponentNode;
}

export const CanvasRenderer: React.FC<Props> = ({ node }) => {
  const { selectedNodeId, selectNode, activeSimMode, activeLocale, i18nDict, activeSplashPreview, splashConfig } = useEditorStore();

  const handleNodePress = (e: any, n: ComponentNode) => {
    e.stopPropagation();
    selectNode(n.id);
    if (n.soundEffect?.soundName) {
      playSoundEffect(n.soundEffect.soundName, n.soundEffect.volume || 0.8);
    }
  };

  const getI18nText = (defaultTxt: string, key?: string) => {
    if (key && i18nDict[key] && i18nDict[key][activeLocale]) {
      return i18nDict[key][activeLocale];
    }
    return defaultTxt;
  };

  const isSelected = selectedNodeId === node.id;

  const outlineStyle = isSelected
    ? { borderWidth: 2, borderColor: '#3b82f6' }
    : { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' };

  const getAccProps = (n: ComponentNode) => {
    const acc = n.accessibility;
    if (!acc) return {};
    return {
      accessible: acc.accessible !== false,
      accessibilityLabel: acc.accessibilityLabel,
      accessibilityHint: acc.accessibilityHint,
      accessibilityRole: acc.accessibilityRole,
      importantForAccessibility: acc.importantForAccessibility,
    };
  };

  const getSimTransformStyle = (n: ComponentNode) => {
    const st: any = {};
    if (n.style?.opacity !== undefined) {
      st.opacity = n.style.opacity;
    }
    if (n.style?.rotation !== undefined && n.style.rotation !== 0) {
      st.transform = [{ rotate: `${n.style.rotation}deg` }];
    }

    const press = n.pressState;
    if (activeSimMode === 'pressed' && press) {
      if (press.activeOpacity !== undefined) st.opacity = press.activeOpacity;
      if (press.pressScale !== undefined) {
        const scale = press.pressScale;
        st.transform = [...(st.transform || []), { scale }];
      }
      if (press.pressedBgColor) st.backgroundColor = press.pressedBgColor;
    } else if (activeSimMode === 'hovered' && press) {
      if (press.hoverBorderColor) {
        st.borderColor = press.hoverBorderColor;
        st.borderWidth = 2;
      }
    }

    return st;
  };

  const nodeTransform = getSimTransformStyle(node);
  const accProps = getAccProps(node);

  // If rendering root container and activeSplashPreview is true, render splash screen overlay
  if (node.id === 'root_container' && activeSplashPreview) {
    return (
      <View style={[styles.splashOverlay, { backgroundColor: splashConfig.backgroundColor }]}>
        <Text style={{ fontSize: 56, marginBottom: 12 }}>{splashConfig.logoIcon}</Text>
        <Text style={[styles.splashTitle, { color: splashConfig.titleColor }]}>{splashConfig.title}</Text>
        <Text style={styles.splashSubtitle}>{splashConfig.subtitle}</Text>
        {splashConfig.showSpinner && (
          <View style={styles.spinnerContainer}>
            <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: 'bold' }}>⚡ Loading Assets...</Text>
          </View>
        )}
      </View>
    );
  }

  if (node.type === 'Container' || node.type === 'Card') {
    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.9}
        onPress={(e) => handleNodePress(e, node)}
        style={[node.style, nodeTransform, outlineStyle, styles.containerBase]}
      >
        {node.children && node.children.map((child) => (
          <CanvasRenderer key={child.id} node={child} />
        ))}
      </TouchableOpacity>
    );
  }

  if (node.type === 'Text') {
    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[outlineStyle, nodeTransform, { borderRadius: 4, marginVertical: 2 }]}
      >
        <Text style={node.style}>{getI18nText(node.props?.text || 'Text', node.props?.i18nKey)}</Text>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Input') {
    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[
          {
            backgroundColor: '#1e293b',
            borderWidth: 1,
            borderColor: '#475569',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginVertical: 4,
          },
          node.style,
          nodeTransform,
          outlineStyle,
        ]}
      >
        <Text style={{ color: node.style.color || '#94a3b8', fontSize: node.style.fontSize || 14, fontFamily: node.style.fontFamily }}>
          {node.props?.placeholder || 'Enter text...'}
        </Text>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Badge') {
    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[
          {
            backgroundColor: '#3b82f6',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            alignSelf: 'flex-start',
            marginVertical: 2,
          },
          node.style,
          nodeTransform,
          outlineStyle,
        ]}
      >
        <Text style={{ color: node.style.color || '#ffffff', fontSize: node.style.fontSize || 11, fontWeight: node.style.fontWeight || 'bold', fontFamily: node.style.fontFamily }}>
          {node.props?.text || 'Badge'}
        </Text>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Image') {
    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[
          outlineStyle,
          nodeTransform,
          { borderRadius: node.style.borderRadius || 8, overflow: 'hidden', marginVertical: 4 },
        ]}
      >
        {node.props?.imageUri ? (
          <Image
            source={{ uri: node.props.imageUri }}
            style={[{ width: '100%', height: node.style.height || 140 }, node.style]}
            resizeMode="cover"
          />
        ) : (
          <View style={[{ width: '100%', height: node.style.height || 120, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' }, node.style]}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>📷 Image Placeholder</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (node.type === 'Icon') {
    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[outlineStyle, nodeTransform, { padding: 4, borderRadius: 6, marginVertical: 2 }]}
      >
        <Text style={{ fontSize: node.style.fontSize || 28, color: node.style.color || '#3b82f6' }}>
          {node.props?.iconSymbol || '❖'}
        </Text>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Button') {
    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[
          {
            backgroundColor: '#3b82f6',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          },
          node.style,
          nodeTransform,
          outlineStyle,
        ]}
      >
        <Text
          style={{
            color: (activeSimMode === 'pressed' && node.pressState?.pressedTextColor) || node.style.color || '#ffffff',
            fontWeight: node.style.fontWeight || 'bold',
            fontSize: node.style.fontSize || 14,
            fontFamily: node.style.fontFamily,
          }}
        >
          {getI18nText(node.props?.label || 'Button', node.props?.i18nKey)}
        </Text>
      </TouchableOpacity>
    );
  }

  if (node.type === 'ProgressBar') {
    const progress = Math.min(100, Math.max(0, node.props?.progress ?? 65));
    const barColor = node.props?.barColor || node.style.backgroundColor || '#3b82f6';
    const trackColor = node.props?.trackColor || '#334155';

    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[styles.progressWrapper, node.style, nodeTransform, outlineStyle]}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{node.props?.label || 'Task Completion'}</Text>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: barColor }]} />
        </View>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Graph') {
    const values = node.props?.values || [35, 65, 40, 85, 60, 95];
    const barColor = node.style.color || '#38bdf8';

    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[styles.graphWrapper, node.style, nodeTransform, outlineStyle]}
      >
        <Text style={styles.graphTitle}>📊 {node.props?.title || 'Analytics Graph'}</Text>
        <View style={styles.graphCanvas}>
          {values.map((v: number, idx: number) => (
            <View key={idx} style={styles.graphColumn}>
              <View style={[styles.graphBar, { height: `${v}%`, backgroundColor: barColor }]} />
              <Text style={styles.graphAxisLabel}>M{idx + 1}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Switch') {
    const isOn = node.props?.value ?? true;

    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[styles.switchRow, node.style, nodeTransform, outlineStyle]}
      >
        <Text style={[styles.switchLabel, { color: node.style.color || '#f8fafc' }]}>
          {node.props?.label || 'Toggle Option'}
        </Text>
        <View style={[styles.switchTrack, isOn ? styles.switchOn : styles.switchOff]}>
          <View style={[styles.switchThumb, isOn ? styles.thumbOn : styles.thumbOff]} />
        </View>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Slider') {
    const val = node.props?.value ?? 50;

    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[styles.sliderWrapper, node.style, nodeTransform, outlineStyle]}
      >
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{node.props?.label || 'Slider Control'}</Text>
          <Text style={styles.sliderValText}>{val}</Text>
        </View>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${val}%` }]} />
          <View style={[styles.sliderThumb, { left: `${Math.max(0, val - 4)}%` }]} />
        </View>
      </TouchableOpacity>
    );
  }

  if (node.type === 'Checkbox') {
    const isChecked = node.props?.checked ?? true;

    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[styles.checkboxRow, node.style, nodeTransform, outlineStyle]}
      >
        <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
          {isChecked && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <Text style={[styles.checkboxLabel, { color: node.style.color || '#f8fafc' }]}>
          {node.props?.label || 'Accept terms and conditions'}
        </Text>
      </TouchableOpacity>
    );
  }

  if (node.type === 'SvgVector') {
    const svgName = node.props?.svgName || 'Vector Asset';
    const svgSize = node.style.width || 48;
    const svgColor = node.style.color || '#38bdf8';

    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[
          {
            width: svgSize,
            height: svgSize,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 4,
            borderRadius: 8,
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            borderWidth: 1,
            borderColor: svgColor,
          },
          node.style,
          nodeTransform,
          outlineStyle,
        ]}
      >
        <Text style={{ fontSize: (Number(svgSize) || 48) * 0.45 }}>📐</Text>
        <Text style={{ fontSize: 8, color: '#f8fafc', fontWeight: 'bold', marginTop: 1 }} numberOfLines={1}>
          {svgName}
        </Text>
      </TouchableOpacity>
    );
  }

  if (node.type === 'AnimatedAsset') {
    const animType = node.props?.animationType || 'pulse';
    const assetName = node.props?.assetName || 'Glow Ring Asset';

    return (
      <TouchableOpacity
        {...accProps}
        activeOpacity={0.8}
        onPress={(e) => handleNodePress(e, node)}
        style={[styles.animatedAssetCard, node.style, nodeTransform, outlineStyle]}
      >
        <Text style={styles.assetSymbol}>✨</Text>
        <View style={styles.assetInfo}>
          <Text style={styles.assetName}>{assetName}</Text>
          <Text style={styles.assetTag}>Animation: {animType.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      {...accProps}
      activeOpacity={0.8}
      onPress={(e) => handleNodePress(e, node)}
      style={[node.style, nodeTransform, outlineStyle]}
    >
      <Text style={{ color: '#94a3b8' }}>[{node.type}]</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerBase: {
    minHeight: 40,
  },
  splashOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  splashTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  spinnerContainer: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  progressWrapper: {
    padding: 10,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginVertical: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  graphWrapper: {
    padding: 12,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 6,
  },
  graphTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  graphCanvas: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  graphColumn: {
    alignItems: 'center',
    flex: 1,
  },
  graphBar: {
    width: 14,
    borderRadius: 3,
  },
  graphAxisLabel: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginVertical: 4,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: '#3b82f6',
  },
  switchOff: {
    backgroundColor: '#475569',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
  sliderWrapper: {
    padding: 10,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginVertical: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sliderLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  sliderValText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxBoxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxCheck: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 13,
  },
  animatedAssetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 10,
    marginVertical: 4,
  },
  assetSymbol: {
    fontSize: 22,
    marginRight: 10,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: 'bold',
  },
  assetTag: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '600',
  },
});
