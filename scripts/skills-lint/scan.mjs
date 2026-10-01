// Pure scanning helpers for the skills lint. No I/O here.
export const FONT_NAMES = [
  'IBM Plex Sans', 'IBM Plex Mono', 'Century Gothic', 'CenturyGothic',
  'Roboto', 'Public Sans', 'Lora', 'Helvetica Neue', 'Inter',
];

const HEX_RE = /(?<![&\w/#.])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g;
// Longest names first so "Century Gothic" wins over a partial match.
// Word boundaries keep short names (e.g. Inter) from matching inside words like "Internal".
const FONT_RE = new RegExp(
  '\\b(?:' + [...FONT_NAMES].sort((a, b) => b.length - a.length)
    .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b',
  'g',
);

export function parseFrontmatter(text) {
  const lines = text.split('\n');
  if (lines[0].trim() !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end === -1) return null;
  const out = {};
  for (let i = 1; i < end; i++) {
    const m = lines[i].match(/^(name|description):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (value === '>' || value === '|') {
      const parts = [];
      while (i + 1 < end && /^\s+/.test(lines[i + 1])) parts.push(lines[++i].trim());
      value = parts.join(' ');
    }
    out[m[1]] = value;
  }
  return out;
}

export function scanLine(line) {
  const hits = [];
  for (const m of line.matchAll(HEX_RE)) hits.push({ kind: 'hex', value: m[0], index: m.index });
  for (const m of line.matchAll(FONT_RE)) hits.push({ kind: 'font', value: m[0], index: m.index });
  return hits.sort((a, b) => a.index - b.index).map(({ kind, value }) => ({ kind, value }));
}

export function isExempt(relPath) {
  if (!relPath.endsWith('.md')) return true;
  if (relPath.startsWith('skills/cochl-design/core/')) return true;
  return relPath.split('/').some(seg => seg.endsWith('-previews') || seg === 'examples' || seg === 'assets');
}

const REF_RE = /^(\.\.\/|references\/|assets\/|core\/)[\w./ -]+\.(md|pptx|png|svg|html|json)$/;

export function findPathRefs(text) {
  const refs = [];
  for (const m of text.matchAll(/\]\(([^)\s]+)\)|`([^`\n]+)`/g)) {
    const ref = (m[1] ?? m[2]).trim();
    if (REF_RE.test(ref)) refs.push(ref);
  }
  return refs;
}

export function addedLines(diffText) {
  const out = [];
  let file = null, line = 0;
  for (const raw of diffText.split('\n')) {
    if (raw.startsWith('+++ ')) { file = raw.slice(4).replace(/^b\//, ''); continue; }
    const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) { line = Number(hunk[1]); continue; }
    if (file && raw.startsWith('+')) out.push({ file, line: line++, text: raw.slice(1) });
  }
  return out;
}
