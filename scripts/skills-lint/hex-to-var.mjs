#!/usr/bin/env node
// Rewrites literal hex colors inside fenced code blocks to var(--token) using a theme's :root block.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HEX = /(?<![&\w/#.])#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g;
const norm = (h) => {
  const s = h.replace('#', '').toLowerCase();
  return '#' + (s.length === 3 ? [...s].map((c) => c + c).join('') : s);
};

export function themeVars(themeText) {
  const vars = new Map();
  for (const m of themeText.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b/g)) {
    const key = norm(m[2]);
    if (!vars.has(key)) vars.set(key, m[1]);
  }
  return vars;
}

export function rewrite(text, vars) {
  let replaced = 0;
  const unmapped = new Set();
  const out = text.split(/(```[\s\S]*?```)/g).map((chunk) => {
    if (!chunk.startsWith('```')) return chunk;
    return chunk.replace(HEX, (m) => {
      const name = vars.get(norm(m));
      if (!name) { unmapped.add(m); return m; }
      replaced++;
      return `var(${name})`;
    });
  }).join('');
  return { text: out, replaced, unmapped: [...unmapped] };
}

function main(argv) {
  const themeIdx = argv.indexOf('--theme');
  const vars = themeVars(readFileSync(argv[themeIdx + 1], 'utf8'));
  const write = argv.includes('--write');
  const files = argv.filter((a, i) => !a.startsWith('--') && i !== themeIdx + 1);
  let bad = 0;
  for (const f of files) {
    const r = rewrite(readFileSync(f, 'utf8'), vars);
    if (write) writeFileSync(f, r.text);
    console.log(`${f}: ${r.replaced} replaced${r.unmapped.length ? `, UNMAPPED ${r.unmapped.join(' ')}` : ''}`);
    bad += r.unmapped.length;
  }
  return bad ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
