import { generateJestTestSpec } from './jestTestGenerator';
import { ComponentNode } from '../types/schema';

export const generateCSSinJS = (node: ComponentNode): string => {
  const stylesObj: Record<string, any> = {};

  const processNodeStyles = (n: ComponentNode) => {
    const st: any = { ...n.style };
    if (st.rotation !== undefined && st.rotation !== 0) {
      const rot = st.rotation;
      delete st.rotation;
      st.transform = [{ rotate: `${rot}deg` }];
    }
    stylesObj[n.id] = st;
    if (n.children) {
      n.children.forEach(processNodeStyles);
    }
  };

  processNodeStyles(node);

  return `import { StyleSheet } from 'react-native';\n\nexport const styles = StyleSheet.create(${JSON.stringify(stylesObj, null, 2)});`;
};

export const generateJSONSchema = (node: ComponentNode): string => {
  return JSON.stringify(node, null, 2);
};

export const generateSVGVector = (node: ComponentNode): string => {
  const numberValue = (value: unknown, fallback: number): number =>
    typeof value === 'number' && Number.isFinite(value) ? value : fallback;

  const stringValue = (value: unknown, fallback: string): string =>
    typeof value === 'string' ? value : fallback;

  const escapeXml = (value: unknown): string =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const width = numberValue(node.style?.width, 360);
  const height = numberValue(node.style?.height, 640);
  const bgColor = escapeXml(stringValue(node.style?.backgroundColor, '#1e293b'));

  const renderNodeSVG = (
    n: ComponentNode,
    x = 0,
    y = 0,
    currentWidth = 320,
  ): string => {
    const bg = escapeXml(stringValue(n.style?.backgroundColor, 'transparent'));
    const borderRadius = numberValue(n.style?.borderRadius, 0);
    const padding = numberValue(n.style?.padding, 8);
    const opacity = numberValue(n.style?.opacity, 1);
    const rotation = numberValue(n.style?.rotation, 0);
    const borderColor = escapeXml(stringValue(n.style?.borderColor, 'none'));
    const borderWidth = numberValue(n.style?.borderWidth, 0);

    let transformAttr = `opacity="${opacity}"`;
    if (rotation !== 0) {
      transformAttr += ` transform="rotate(${rotation} ${x + currentWidth / 2} ${y + 20})"`;
    }

    const svgElements: string[] = [];

    if (n.type === 'Container' || n.type === 'Card') {
      const h = numberValue(n.style?.height, 140);
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${currentWidth}" height="${h}" rx="${borderRadius}" fill="${bg}" stroke="${borderColor}" stroke-width="${borderWidth}" ${transformAttr} />`,
      );

      let childY = y + padding;
      n.children?.forEach((child) => {
        svgElements.push(
          renderNodeSVG(child, x + padding, childY, Math.max(0, currentWidth - padding * 2)),
        );
        childY += numberValue(child.style?.height, 40) + 8;
      });
    } else if (n.type === 'Text') {
      const fontSize = numberValue(n.style?.fontSize, 14);
      const color = escapeXml(stringValue(n.style?.color, '#ffffff'));
      const text = escapeXml(n.props?.text || 'Text');
      svgElements.push(
        `<text x="${x + 4}" y="${y + fontSize}" font-size="${fontSize}" fill="${color}" ${transformAttr}>${text}</text>`,
      );
    } else if (n.type === 'Button') {
      const label = escapeXml(n.props?.label || 'Button');
      const btnBg = escapeXml(stringValue(n.style?.backgroundColor, '#3b82f6'));
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${currentWidth}" height="40" rx="${borderRadius || 8}" fill="${btnBg}" ${transformAttr} />`,
      );
      svgElements.push(
        `<text x="${x + currentWidth / 2}" y="${y + 24}" font-size="14" fill="#ffffff" font-weight="bold" text-anchor="middle" ${transformAttr}>${label}</text>`,
      );
    } else if (n.type === 'ProgressBar') {
      const prog = Math.min(100, Math.max(0, numberValue(n.props?.progress, 70)));
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${currentWidth}" height="10" rx="5" fill="#334155" ${transformAttr} />`,
      );
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${(currentWidth * prog) / 100}" height="10" rx="5" fill="#3b82f6" ${transformAttr} />`,
      );
    } else if (n.type === 'Graph') {
      const title = escapeXml(n.props?.title || 'Chart');
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${currentWidth}" height="80" rx="8" fill="#0f172a" stroke="#334155" ${transformAttr} />`,
      );
      svgElements.push(
        `<text x="${x + 10}" y="${y + 20}" font-size="12" fill="#38bdf8" font-weight="bold" ${transformAttr}>📊 ${title}</text>`,
      );
    } else if (n.type === 'Switch') {
      const enabled = Boolean(n.props?.value);
      svgElements.push(
        `<rect x="${x + currentWidth - 44}" y="${y}" width="44" height="24" rx="12" fill="${enabled ? '#3b82f6' : '#475569'}" ${transformAttr} />`,
      );
      svgElements.push(
        `<circle cx="${x + currentWidth - (enabled ? 14 : 32)}" cy="${y + 12}" r="9" fill="#ffffff" ${transformAttr} />`,
      );
    } else if (n.type === 'SvgVector') {
      const sz = numberValue(n.style?.width, 48);
      const xml = stringValue(
        n.props?.svgXml,
        `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" fill="#38bdf8" />`,
      );
      svgElements.push(`<g ${transformAttr}>${xml}</g>`);
    } else if (n.type === 'Checkbox') {
      const checked = Boolean(n.props?.checked);
      const label = escapeXml(n.props?.label || 'Checkbox');
      svgElements.push(
        `<rect x="${x}" y="${y}" width="20" height="20" rx="4" fill="${checked ? '#3b82f6' : 'transparent'}" stroke="#64748b" ${transformAttr} />`,
      );
      svgElements.push(
        `<text x="${x + 28}" y="${y + 15}" font-size="13" fill="#f8fafc" ${transformAttr}>${label}</text>`,
      );
    } else {
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${currentWidth}" height="32" rx="6" fill="#334155" ${transformAttr} />`,
      );
      svgElements.push(
        `<text x="${x + 10}" y="${y + 20}" font-size="12" fill="#94a3b8" ${transformAttr}>[${escapeXml(n.type)}]</text>`,
      );
    }

    return svgElements.join('\n  ');
  };

  const innerSVG = renderNodeSVG(node, 20, 20, Math.max(0, width - 40));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}" />
  ${innerSVG}
</svg>`;
};

export { generateJestTestSpec };
