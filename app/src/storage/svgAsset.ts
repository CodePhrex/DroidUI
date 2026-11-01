export interface SvgAssetMetadata {
  name: string;
  width?: number;
  height?: number;
  viewBox?: string;
}

export interface SvgValidationResult {
  valid: boolean;
  error?: string;
  svgXml?: string;
  metadata?: SvgAssetMetadata;
}

const SVG_ROOT_RE = /<svg\b[\s\S]*?<\/svg>/i;
const BLOCKED_TAG_RE = /<\/?(?:script|foreignObject|iframe|object|embed)\b[^>]*>/gi;
const EVENT_HANDLER_RE = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_RE = /(?:javascript|vbscript)\s*:/gi;

const readNumericAttribute = (xml: string, name: string): number | undefined => {
  const match = xml.match(new RegExp(`\\b${name}\\s*=\\s*[\"']([0-9]+(?:\\.[0-9]+)?)`, 'i'));
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
};

const readAttribute = (xml: string, name: string): string | undefined => {
  const match = xml.match(new RegExp(`\\b${name}\\s*=\\s*[\"']([^\"']+)[\"']`, 'i'));
  return match?.[1]?.trim() || undefined;
};

export const normalizeSvgXml = (input: string): string => {
  const trimmed = input.trim().replace(/^```(?:xml|svg)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const root = trimmed.match(SVG_ROOT_RE)?.[0];
  if (!root) throw new Error('No complete <svg>...</svg> element was found.');
  if (BLOCKED_TAG_RE.test(root)) throw new Error('SVG contains a blocked embedded element.');
  const withoutEvents = root.replace(EVENT_HANDLER_RE, '');
  if (JAVASCRIPT_URL_RE.test(withoutEvents)) throw new Error('SVG contains a script URL.');
  return withoutEvents.replace(/\s{2,}/g, ' ').trim();
};

export const validateAndNormalizeSvg = (input: unknown): SvgValidationResult => {
  if (typeof input !== 'string' || !input.trim()) return { valid: false, error: 'SVG source is empty.' };
  try {
    const svgXml = normalizeSvgXml(input);
    const metadata: SvgAssetMetadata = {
      name: readAttribute(svgXml, 'id') || readAttribute(svgXml, 'aria-label') || 'Imported SVG',
      width: readNumericAttribute(svgXml, 'width'),
      height: readNumericAttribute(svgXml, 'height'),
      viewBox: readAttribute(svgXml, 'viewBox'),
    };
    return { valid: true, svgXml, metadata };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : String(error) };
  }
};

export const svgToDataUri = (svgXml: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgXml)}`;

export const exportSvgAsset = (svgXml: string, name = 'vector_asset'): { filename: string; content: string } => {
  const normalized = normalizeSvgXml(svgXml);
  const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'vector_asset';
  return { filename: `${safeName}.svg`, content: normalized };
};
