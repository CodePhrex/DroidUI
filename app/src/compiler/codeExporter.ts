import { ComponentNode } from '../types/schema';

export const generateReactNativeTSX = (rootNode: ComponentNode): string => {
  const serializeStyle = (style: any) => {
    const st: any = { ...style };
    if (st.rotation !== undefined && st.rotation !== 0) {
      const rot = st.rotation;
      delete st.rotation;
      st.transform = [{ rotate: `${rot}deg` }];
    }
    return JSON.stringify(st);
  };

  const formatAccProps = (node: ComponentNode) => {
    const acc = node.accessibility;
    if (!acc) return '';
    let props = [];
    if (acc.accessible !== undefined) props.push(`accessible={${acc.accessible}}`);
    if (acc.accessibilityLabel) props.push(`accessibilityLabel="${acc.accessibilityLabel}"`);
    if (acc.accessibilityHint) props.push(`accessibilityHint="${acc.accessibilityHint}"`);
    if (acc.accessibilityRole) props.push(`accessibilityRole="${acc.accessibilityRole}"`);
    if (acc.importantForAccessibility) props.push(`importantForAccessibility="${acc.importantForAccessibility}"`);
    return props.length > 0 ? ' ' + props.join(' ') : '';
  };

  const renderNodeTSX = (node: ComponentNode, indent = '      '): string => {
    const styleStr = serializeStyle(node.style);
    const accStr = formatAccProps(node);

    if (node.type === 'Container' || node.type === 'Card') {
      const childrenCode = node.children
        ? node.children.map((c) => renderNodeTSX(c, indent + '  ')).join('\n')
        : '';
      return `${indent}<View style={${styleStr}}${accStr}>\n${childrenCode}\n${indent}</View>`;
    }

    if (node.type === 'Text') {
      return `${indent}<Text style={${styleStr}}${accStr}>${node.props?.text || 'Text'}</Text>`;
    }

    if (node.type === 'Button') {
      return `${indent}<TouchableOpacity style={${styleStr}}${accStr}>\n${indent}  <Text style={{ color: '#fff', fontWeight: 'bold' }}>${node.props?.label || 'Button'}</Text>\n${indent}</TouchableOpacity>`;
    }

    if (node.type === 'Input') {
      return `${indent}<TextInput style={${styleStr}}${accStr} placeholder="${node.props?.placeholder || 'Enter text...'}" placeholderTextColor="#94a3b8" />`;
    }

    if (node.type === 'Badge') {
      return `${indent}<View style={${styleStr}}${accStr}>\n${indent}  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>${node.props?.text || 'Badge'}</Text>\n${indent}</View>`;
    }

    if (node.type === 'ProgressBar') {
      const progress = node.props?.progress ?? 70;
      return `${indent}<View style={${styleStr}}${accStr}>\n${indent}  <View style={{ height: 8, backgroundColor: '${node.props?.trackColor || '#334155'}', borderRadius: 4 }}>\n${indent}    <View style={{ width: '${progress}%', height: '100%', backgroundColor: '${node.props?.barColor || '#3b82f6'}', borderRadius: 4 }} />\n${indent}  </View>\n${indent}</View>`;
    }

    if (node.type === 'Graph') {
      const vals = JSON.stringify(node.props?.values || [35, 60, 45, 80, 65, 90]);
      return `${indent}/* Analytics Chart (${node.props?.title || 'Revenue'}) */\n${indent}<View style={${styleStr}}${accStr}>\n${indent}  {/* Data Bars: ${vals} */}\n${indent}</View>`;
    }

    if (node.type === 'Switch') {
      return `${indent}<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}${accStr}>\n${indent}  <Text style={{ color: '#f8fafc' }}>${node.props?.label || 'Switch'}</Text>\n${indent}  <Switch value={${node.props?.value ?? true}} />\n${indent}</View>`;
    }

    if (node.type === 'Slider') {
      return `${indent}<View style={${styleStr}}${accStr}>\n${indent}  <Text style={{ color: '#f8fafc' }}>${node.props?.label || 'Slider'}: ${node.props?.value ?? 50}%</Text>\n${indent}</View>`;
    }

    if (node.type === 'Checkbox') {
      return `${indent}<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}${accStr}>\n${indent}  <View style={{ width: 20, height: 20, backgroundColor: ${node.props?.checked ? "'#3b82f6'" : "'transparent'"}, borderRadius: 4, borderWidth: 1, borderColor: '#64748b' }} />\n${indent}  <Text style={{ marginLeft: 8, color: '#f8fafc' }}>${node.props?.label || 'Checkbox'}</Text>\n${indent}</TouchableOpacity>`;
    }

    if (node.type === 'SvgVector') {
      const xmlStr = JSON.stringify(node.props?.svgXml || '<svg></svg>');
      return `${indent}<SvgXml xml={${xmlStr}} width={${node.style.width || 48}} height={${node.style.height || 48}}${accStr} />`;
    }

    if (node.type === 'AnimatedAsset') {
      return `${indent}<Animated.View style={${styleStr}}${accStr} entering={FadeIn.duration(400)}>\n${indent}  <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>✨ ${node.props?.assetName || 'Animated Asset'}</Text>\n${indent}</Animated.View>`;
    }

    return `${indent}<View style={${styleStr}}${accStr} />`;
  };

  const bodyCode = renderNodeTSX(rootNode, '      ');

  return `import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Animated, { FadeIn, SpringIn } from 'react-native-reanimated';

export default function ExportedUI() {
  return (
${bodyCode}
  );
}
`;
};

export const generateJetpackComposeKotlin = (rootNode: ComponentNode): string => {
  const renderComposeNode = (node: ComponentNode, indent = '    '): string => {
    let mods = 'Modifier';
    if (node.style.padding) mods += `.padding(${node.style.padding}.dp)`;
    if (node.style.opacity !== undefined) mods += `.alpha(${node.style.opacity}f)`;
    if (node.style.rotation !== undefined && node.style.rotation !== 0) mods += `.rotate(${node.style.rotation}f)`;

    if (node.accessibility?.accessibilityLabel) {
      mods += `.semantics { contentDescription = "${node.accessibility.accessibilityLabel}" }`;
    }

    if (node.type === 'Container' || node.type === 'Card') {
      const isRow = node.style.flexDirection === 'row';
      const containerType = isRow ? 'Row' : 'Column';
      const childrenCode = node.children
        ? node.children.map((c) => renderComposeNode(c, indent + '    ')).join('\n')
        : '';
      return `${indent}${containerType}(modifier = ${mods}) {\n${childrenCode}\n${indent}}`;
    }

    if (node.type === 'Text') {
      return `${indent}Text(text = "${node.props?.text || 'Text'}", modifier = ${mods})`;
    }

    if (node.type === 'Button') {
      return `${indent}Button(onClick = { /* TODO */ }, modifier = ${mods}) {\n${indent}    Text("${node.props?.label || 'Button'}")\n${indent}}`;
    }

    if (node.type === 'ProgressBar') {
      const prog = (node.props?.progress ?? 70) / 100;
      return `${indent}LinearProgressIndicator(progress = { ${prog}f }, modifier = ${mods})`;
    }

    if (node.type === 'Switch') {
      return `${indent}Row(verticalAlignment = Alignment.CenterVertically, modifier = ${mods}) {\n${indent}    Text("${node.props?.label || 'Switch'}")\n${indent}    Switch(checked = ${node.props?.value ?? true}, onCheckedChange = {}) \n${indent}}`;
    }

    if (node.type === 'Slider') {
      const val = (node.props?.value ?? 50) / 100;
      return `${indent}Slider(value = ${val}f, onValueChange = {}, modifier = ${mods})`;
    }

    if (node.type === 'Checkbox') {
      return `${indent}Row(verticalAlignment = Alignment.CenterVertically, modifier = ${mods}) {\n${indent}    Checkbox(checked = ${node.props?.checked ?? true}, onCheckedChange = {})\n${indent}    Text("${node.props?.label || 'Checkbox'}")\n${indent}}`;
    }

    if (node.type === 'SvgVector') {
      const name = (node.props?.svgName || 'vector').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `${indent}Icon(painter = painterResource(id = R.drawable.${name}), contentDescription = "${node.props?.svgName || 'Vector Asset'}", modifier = ${mods})`;
    }

    return `${indent}Text(text = "[${node.type}]", modifier = ${mods})`;
  };

  const composeBody = renderComposeNode(rootNode, '    ');

  return `import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*

@Composable
fun ExportedComposeUI() {
${composeBody}
}
`;
};
