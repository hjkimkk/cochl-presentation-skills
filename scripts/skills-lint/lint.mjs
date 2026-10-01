#!/usr/bin/env node
// Skills lint: frontmatter, name=folder, path refs, size warning, and the
// "no hex/font outside skills/cochl-design/core/" rule (diff or --strict).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, scanLine, isExempt, findPathRefs, addedLines } from './scan.mjs';

const posix = (p) => p.split(sep).join('/');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

export function lintTree(root) {
  const errors = [], warnings = [];
  const skillsDir = join(root, 'skills');
  const names = new Map();
  for (const folder of existsSync(skillsDir) ? readdirSync(skillsDir) : []) {
    const skillMd = join(skillsDir, folder, 'SKILL.md');
    if (!existsSync(skillMd)) continue;
    const rel = `skills/${folder}/SKILL.md`;
    const text = readFileSync(skillMd, 'utf8');
    const fm = parseFrontmatter(text);
    if (!fm || !fm.name || !fm.description) { errors.push(`${rel}: missing name/description frontmatter`); continue; }
    if (fm.name !== folder) errors.push(`${rel}: name "${fm.name}" must equal folder "${folder}"`);
    if (names.has(fm.name)) errors.push(`duplicate name "${fm.name}" in ${names.get(fm.name)} and ${rel}`);
    names.set(fm.name, rel);
    const lines = text.split('\n').length;
    if (lines > 400) warnings.push(`${rel}: ${lines} lines (> 400)`);
  }
  for (const file of walk(skillsDir).filter((f) => f.endsWith('.md'))) {
    const rel = posix(relative(root, file));
    const skillRoot = join(skillsDir, rel.split('/')[1]);
    for (const ref of findPathRefs(readFileSync(file, 'utf8'))) {
      const ok = existsSync(join(dirname(file), ref)) || existsSync(join(skillRoot, ref));
      if (!ok) errors.push(`${rel}: referenced path not found: ${ref}`);
    }
  }
  return { errors, warnings };
}

function brandHits(rel, entries) {
  if (isExempt(rel)) return [];
  return entries.flatMap(({ line, text }) =>
    scanLine(text).map((h) => `${rel}:${line} brand ${h.kind} "${h.value}" outside skills/cochl-design/core/`));
}

export function lintStrict(root, dir) {
  return walk(join(root, dir)).flatMap((file) => {
    const rel = posix(relative(root, file));
    if (isExempt(rel)) return [];
    const entries = readFileSync(file, 'utf8').split('\n').map((text, i) => ({ line: i + 1, text }));
    return brandHits(rel, entries);
  });
}

export function lintDiff(_root, diffText) {
  const byFile = new Map();
  for (const a of addedLines(diffText)) {
    if (!a.file.startsWith('skills/')) continue;
    if (!byFile.has(a.file)) byFile.set(a.file, []);
    byFile.get(a.file).push(a);
  }
  return [...byFile].flatMap(([rel, entries]) => brandHits(rel, entries));
}

function main(argv) {
  const root = process.cwd();
  const strictIdx = argv.indexOf('--strict');
  if (strictIdx !== -1) {
    const errs = lintStrict(root, argv[strictIdx + 1]);
    errs.forEach((e) => console.error(`✗ ${e}`));
    console.log(errs.length ? `${errs.length} brand value(s) found` : '✓ strict: clean');
    return errs.length ? 1 : 0;
  }
  const baseIdx = argv.indexOf('--base');
  const base = baseIdx !== -1 ? argv[baseIdx + 1] : 'origin/main';
  const { errors, warnings } = lintTree(root);
  const diff = execFileSync('git', ['diff', '--unified=0', `${base}...HEAD`, '--', 'skills'], { encoding: 'utf8' });
  errors.push(...lintDiff(root, diff));
  warnings.forEach((w) => console.warn(`! ${w}`));
  errors.forEach((e) => console.error(`✗ ${e}`));
  console.log(errors.length ? `${errors.length} error(s)` : '✓ skills lint passed');
  return errors.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
