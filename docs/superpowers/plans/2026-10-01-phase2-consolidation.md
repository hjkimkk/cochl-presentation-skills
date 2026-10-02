# Phase 2 Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the five Cochl skills into one brand core (`skills/cochl-design/core/`) with two themes, add the `/cochl-design` router and a `design-sync` thin skill, and fold `pitch-deck` into `cochl-presentation` — without breaking any command that works today.

**Architecture:** Skills stay as sibling folders under `skills/`. Brand values live only in `skills/cochl-design/core/` (`brand-core.md` + `themes/plex.md` + `themes/pt-template.md`); every other skill references `../cochl-design/core/…` and uses `var(--token)` in its HTML/CSS templates. A zero-dependency Node lint script enforces this on every PR, and a Python/Playwright "brand facts" extractor proves before/after outputs match.

**Tech Stack:** Markdown skills (Claude Code), Node ≥ 20 (`node:test`, no deps) for lint/inventory/hex-to-var, Python 3.10 + Playwright + python-pptx (already installed locally) for brand facts, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-01-phase2-consolidation-design.md` (read §9 Amendment — it overrides earlier sections where they differ).

## Global Constraints

- Skill **folder names never change**: `cochl-presentation`, `pitch-deck`, `design-review`, `proposal-doc`, `design-system`. New folders: `cochl-design`, `design-sync`. Each SKILL.md `name:` must equal its folder name.
- Hex colors and font names appear **only** in `skills/cochl-design/core/**`. Lint scans `.md` files under `skills/`; exempt: `skills/cochl-design/core/**`, `**/*-previews/**`, `**/examples/**`, `**/assets/**`, all non-`.md` files.
- Two themes only: `plex` (default) and `pt-template`. No third theme.
- Brand section text in every module SKILL.md (exact wording):
  > **Brand:** read `../cochl-design/core/brand-core.md`, then `../cochl-design/core/themes/<theme>.md`. Default theme `plex`. Paste the theme's `:root` block into the output `<style>` before any template CSS. Run `../cochl-design/core/qa-checklist.md` before delivering.
- Branching: W1 cleanup (Task 2) → PR to `main`. Everything else → PRs into `phase2/consolidation`; that branch merges to `main` once, in Task 15, after regression passes.
- Size report at W4: SKILL.md lines baseline **3,907**, target **≤ 2,735**; also report total `.md` lines under `skills/`.
- Commit trailer on every commit: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Ask HJ before: any push, opening a PR, editing Confluence, deleting a folder that the Task 2 check marks UNIQUE.

## File map

| Path | Responsibility | Task |
|---|---|---|
| `scripts/skills-lint/scan.mjs` | Pure functions: frontmatter parse, hex/font scan, exemption, path-ref extraction, diff parsing | 1 |
| `scripts/skills-lint/lint.mjs` | CLI: tree checks + diff check + `--strict <dir>` | 1 |
| `scripts/skills-lint/inventory.mjs` | CLI: writes `docs/phase2-inventory.md` | 1 |
| `scripts/skills-lint/hex-to-var.mjs` | CLI: rewrites hex in fenced code to `var(--x)` from a theme | 4 |
| `scripts/skills-lint/test/*.test.mjs` | `node:test` suites | 1, 4 |
| `scripts/brand-facts/facts.py` | Extract brand facts from HTML (Playwright) / PPTX (python-pptx) → JSON | 3 |
| `scripts/brand-facts/diff.py` | Compare two facts JSONs → markdown + exit code; build `report.html` | 3 |
| `scripts/brand-facts/test_facts.py` | `unittest` suite + `fixtures/` | 3 |
| `.github/workflows/skills-lint.yml` | Runs lint + tests on PRs touching `skills/` or `scripts/skills-lint/` | 4 |
| `skills/cochl-design/core/*` | Brand core, themes, tokens pointer, QA checklist | 5 |
| `skills/cochl-presentation/references/deck-engine.md` | Deck-only machinery split out of brand-core | 6 |
| `skills/cochl-presentation/references/decks/pt-template/` | Former pitch-deck content | 10 |
| `skills/cochl-design/SKILL.md` | Router | 11 |
| `skills/design-sync/SKILL.md` | Thin wrapper over `design-sync/cli.mjs` | 12 |
| `docs/phase2-baseline/` | Inputs, before/after outputs, facts JSON, report | 3, 14 |

---

## W1 — Oct 5

### Task 1: Lint scanner, lint CLI and inventory

**Files:**
- Create: `scripts/skills-lint/scan.mjs`, `scripts/skills-lint/lint.mjs`, `scripts/skills-lint/inventory.mjs`, `scripts/skills-lint/package.json`
- Test: `scripts/skills-lint/test/scan.test.mjs`, `scripts/skills-lint/test/lint.test.mjs`
- Create (output): `docs/phase2-inventory.md`

**Interfaces:**
- Produces (`scan.mjs`):
  - `parseFrontmatter(text: string): {name?: string, description?: string} | null`
  - `scanLine(line: string): Array<{kind: 'hex'|'font', value: string}>`
  - `isExempt(relPath: string): boolean` — `relPath` is relative to repo root, POSIX separators
  - `findPathRefs(text: string): string[]`
  - `addedLines(diffText: string): Array<{file: string, line: number, text: string}>`
  - `FONT_NAMES: string[]`
- Produces (`lint.mjs`): `lintTree(root: string): {errors: string[], warnings: string[]}`, `lintStrict(root: string, dir: string): string[]`, `lintDiff(root: string, diffText: string): string[]`; CLI `node scripts/skills-lint/lint.mjs [--base <ref>] [--strict <skills/dir>]` exits 1 on any error.

- [ ] **Step 1: Create branch**

```bash
git switch phase2/consolidation && git switch -c phase2/a1-lint
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "skills-lint",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test" },
  "engines": { "node": ">=20" }
}
```

- [ ] **Step 3: Write the failing scanner tests** — `scripts/skills-lint/test/scan.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, scanLine, isExempt, findPathRefs, addedLines } from '../scan.mjs';

test('parseFrontmatter reads name and single-line description', () => {
  const fm = parseFrontmatter('---\nname: pitch-deck\ndescription: Builds decks.\n---\n# body');
  assert.deepEqual(fm, { name: 'pitch-deck', description: 'Builds decks.' });
});

test('parseFrontmatter reads folded description', () => {
  const fm = parseFrontmatter('---\nname: x\ndescription: >\n  line one\n  line two\n---\n');
  assert.equal(fm.description, 'line one line two');
});

test('parseFrontmatter returns null without frontmatter', () => {
  assert.equal(parseFrontmatter('# no frontmatter'), null);
});

test('scanLine finds 3/6/8-digit hex and fonts', () => {
  const hits = scanLine("color:#832BFB; bg:#fff; a:#11223344; font-family:'IBM Plex Sans'");
  assert.deepEqual(hits.map(h => h.value), ['#832BFB', '#fff', '#11223344', 'IBM Plex Sans']);
});

test('scanLine ignores HTML entities, URL fragments and 2-digit refs', () => {
  assert.deepEqual(scanLine('&#123; see page.html#abc and PR #34'), []);
});

test('scanLine does not double-count CenturyGothic inside Century Gothic', () => {
  const vals = scanLine("'Century Gothic', 'CenturyGothic'").map(h => h.value);
  assert.deepEqual(vals, ['Century Gothic', 'CenturyGothic']);
});

test('isExempt', () => {
  assert.equal(isExempt('skills/cochl-design/core/themes/plex.md'), true);
  assert.equal(isExempt('skills/cochl-presentation/references/decks/investor-template-previews/a.md'), true);
  assert.equal(isExempt('skills/proposal-doc/examples/x.md'), true);
  assert.equal(isExempt('skills/pitch-deck/assets/notes.md'), true);
  assert.equal(isExempt('skills/brochure/x.svg'), true);
  assert.equal(isExempt('skills/design-review/SKILL.md'), false);
});

test('findPathRefs extracts relative refs in links and backticks only', () => {
  const t = 'See [core](../cochl-design/core/brand-core.md) and `references/registry.md` and `references/<type>/` and https://x.com/a.md';
  assert.deepEqual(findPathRefs(t), ['../cochl-design/core/brand-core.md', 'references/registry.md']);
});

test('addedLines parses unified=0 diff', () => {
  const diff = [
    'diff --git a/skills/a/SKILL.md b/skills/a/SKILL.md',
    '+++ b/skills/a/SKILL.md',
    '@@ -10,0 +11,2 @@',
    '+color: #fff',
    '+ok line',
    '@@ -20 +22 @@',
    '-old',
    '+new #000',
  ].join('\n');
  assert.deepEqual(addedLines(diff), [
    { file: 'skills/a/SKILL.md', line: 11, text: 'color: #fff' },
    { file: 'skills/a/SKILL.md', line: 12, text: 'ok line' },
    { file: 'skills/a/SKILL.md', line: 22, text: 'new #000' },
  ]);
});
```

- [ ] **Step 4: Run to verify failure**

Run: `cd scripts/skills-lint && npm test`
Expected: FAIL — `Cannot find module '../scan.mjs'`

- [ ] **Step 5: Implement `scan.mjs`**

```js
// Pure scanning helpers for the skills lint. No I/O here.
export const FONT_NAMES = [
  'IBM Plex Sans', 'IBM Plex Mono', 'Century Gothic', 'CenturyGothic',
  'Roboto', 'Public Sans', 'Lora', 'Helvetica Neue',
];

const HEX_RE = /(?<![&\w/#.])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g;
// Longest names first so "Century Gothic" wins over a partial match.
const FONT_RE = new RegExp(
  [...FONT_NAMES].sort((a, b) => b.length - a.length)
    .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
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
```

- [ ] **Step 6: Run scanner tests**

Run: `cd scripts/skills-lint && npm test`
Expected: all `scan.test.mjs` tests PASS.

- [ ] **Step 7: Write failing lint tests** — `scripts/skills-lint/test/lint.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lintTree, lintStrict, lintDiff } from '../lint.mjs';

function repo(files) {
  const root = mkdtempSync(join(tmpdir(), 'skills-lint-'));
  for (const [p, body] of Object.entries(files)) {
    mkdirSync(join(root, p, '..'), { recursive: true });
    writeFileSync(join(root, p), body);
  }
  return root;
}
const fm = (name) => `---\nname: ${name}\ndescription: d\n---\n`;

test('clean tree passes', () => {
  const root = repo({
    'skills/a/SKILL.md': fm('a') + 'See `../cochl-design/core/brand-core.md`',
    'skills/cochl-design/SKILL.md': fm('cochl-design'),
    'skills/cochl-design/core/brand-core.md': '#fff',
  });
  assert.deepEqual(lintTree(root), { errors: [], warnings: [] });
});

test('missing frontmatter, name≠folder and duplicate names are errors', () => {
  const root = repo({
    'skills/a/SKILL.md': '# none',
    'skills/b/SKILL.md': fm('c'),
    'skills/c/SKILL.md': fm('c'),
  });
  const { errors } = lintTree(root);
  assert.ok(errors.some(e => e.includes('skills/a/SKILL.md') && e.includes('frontmatter')));
  assert.ok(errors.some(e => e.includes('skills/b/SKILL.md') && e.includes('must equal folder')));
  assert.ok(errors.some(e => e.includes('duplicate name "c"')));
});

test('broken path ref is an error; ref resolving from skill root passes', () => {
  const root = repo({
    'skills/a/SKILL.md': fm('a') + '`references/x.md` `references/missing.md`',
    'skills/a/references/x.md': 'see `assets/logo.png`',
    'skills/a/references/assets/logo.png': '',
  });
  const { errors } = lintTree(root);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /references\/missing\.md/);
});

test('SKILL.md over 400 lines is a warning', () => {
  const root = repo({ 'skills/a/SKILL.md': fm('a') + 'x\n'.repeat(401) });
  assert.equal(lintTree(root).warnings.length, 1);
});

test('lintStrict flags every hex/font in a skill dir except exempt paths', () => {
  const root = repo({
    'skills/a/SKILL.md': fm('a') + "color:#123456\nfont:'Roboto'",
    'skills/a/examples/e.md': '#fff',
  });
  assert.equal(lintStrict(root, 'skills/a').length, 2);
});

test('lintDiff flags only added lines in non-exempt files', () => {
  const diff = [
    '+++ b/skills/a/SKILL.md', '@@ -1,0 +5,1 @@', '+color:#fff',
    '+++ b/skills/cochl-design/core/themes/plex.md', '@@ -1,0 +1,1 @@', '+--bg:#000',
  ].join('\n');
  const errs = lintDiff('/unused', diff);
  assert.equal(errs.length, 1);
  assert.match(errs[0], /skills\/a\/SKILL\.md:5 .*#fff/);
});
```

- [ ] **Step 8: Run to verify failure**

Run: `cd scripts/skills-lint && npm test`
Expected: FAIL — `Cannot find module '../lint.mjs'`

- [ ] **Step 9: Implement `lint.mjs`**

```js
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
```

- [ ] **Step 10: Run all tests**

Run: `cd scripts/skills-lint && npm test`
Expected: all tests PASS.

- [ ] **Step 11: Implement `inventory.mjs`**

```js
#!/usr/bin/env node
// Writes docs/phase2-inventory.md: every hex/font hit under skills/ (non-exempt),
// grouped by value, with file:line locations.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { scanLine, isExempt } from './scan.mjs';

const root = process.cwd();
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p];
});
const byValue = new Map();
for (const file of walk(join(root, 'skills'))) {
  const rel = relative(root, file).split(sep).join('/');
  if (isExempt(rel)) continue;
  readFileSync(file, 'utf8').split('\n').forEach((text, i) => {
    for (const h of scanLine(text)) {
      const key = `${h.kind}\t${h.kind === 'hex' ? h.value.toLowerCase() : h.value}`;
      if (!byValue.has(key)) byValue.set(key, []);
      byValue.get(key).push(`${rel}:${i + 1}`);
    }
  });
}
const rows = [...byValue].sort((a, b) => b[1].length - a[1].length).map(([k, locs]) => {
  const [kind, value] = k.split('\t');
  const files = [...new Set(locs.map((l) => l.replace(/:\d+$/, '')))];
  return `| ${kind} | \`${value}\` | ${locs.length} | ${files.join('<br>')} | |`;
});
const out = [
  '# Phase 2 brand inventory', '',
  `Generated by \`node scripts/skills-lint/inventory.mjs\` on ${new Date().toISOString().slice(0, 10)}.`,
  'The **Target** column is filled by hand in Task 5 (theme + token name, or "drop").', '',
  '| Kind | Value | Hits | Files | Target |', '|---|---|---|---|---|', ...rows, '',
].join('\n');
writeFileSync(join(root, 'docs/phase2-inventory.md'), out);
console.log(`wrote docs/phase2-inventory.md (${rows.length} distinct values)`);
```

- [ ] **Step 12: Generate the inventory and sanity-check it**

Run: `node scripts/skills-lint/inventory.mjs && grep -c '^| hex' docs/phase2-inventory.md && grep '`#832bfb`' docs/phase2-inventory.md`
Expected: a hex count > 30; the `#832bfb` row lists `skills/pitch-deck/SKILL.md` and `skills/cochl-presentation/references/brand-core.md`.

- [ ] **Step 13: Run lint against the current tree (expected to fail — record the baseline)**

Run: `node scripts/skills-lint/lint.mjs --base HEAD 2>&1 | tail -15`
Expected: errors for `name` ≠ folder (`pitch-deck-skill`, `design-review-template`, `frontend-design`, `proposal-doc-template`). Paste the full error list into the PR description as the starting point; these get fixed in Tasks 7–10.

- [ ] **Step 14: Commit**

```bash
git add scripts/skills-lint docs/phase2-inventory.md
git commit -m "phase2: skills lint + brand inventory

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Leftover cleanup (PR to `main`)

**Files:**
- Create: `scripts/check-leftovers.sh`
- Delete (only if the check passes): `SKILL.md` (root), `cochl-brochure-skill/`, `cochl-social-kit/`, `cochl-presentation-skills/` (nested), `skills/pitch-deck/pitch-deck-skill.md`

**Interfaces:**
- Produces: `bash scripts/check-leftovers.sh <path>…` prints `DUP <file> = <match>` or `UNIQUE <file>`; exits 1 if any UNIQUE.

- [ ] **Step 1: Branch from `main`**

```bash
git fetch origin && git switch -c phase2/w1-cleanup origin/main
```

- [ ] **Step 2: Write `scripts/check-leftovers.sh`**

```bash
#!/bin/bash
# For each file under the given leftover paths, find an identical file elsewhere
# in the repo (outside the leftover paths). Prints DUP/UNIQUE; exit 1 if any UNIQUE.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
leftovers=("$@")
is_leftover() { for l in "${leftovers[@]}"; do [[ "$1" == "$l" || "$1" == "$l/"* ]] && return 0; done; return 1; }

# "hash path" index of every tracked file outside the leftovers (bash 3.2-safe, no assoc arrays).
index="$(mktemp)"; trap 'rm -f "$index"' EXIT
while IFS= read -r f; do
  is_leftover "$f" && continue
  echo "$(shasum -a 256 "$f" | cut -d' ' -f1) $f" >> "$index"
done < <(git ls-files)

unique=0
for l in "${leftovers[@]}"; do
  while IFS= read -r f; do
    h=$(shasum -a 256 "$f" | cut -d' ' -f1)
    match=$(grep -m1 "^$h " "$index" | cut -d' ' -f2- || true)
    if [[ -n "$match" ]]; then echo "DUP    $f = $match"
    else echo "UNIQUE $f"; unique=1; fi
  done < <(git ls-files "$l")
done
exit $unique
```

- [ ] **Step 3: Run the check**

Run: `bash scripts/check-leftovers.sh SKILL.md cochl-brochure-skill cochl-social-kit cochl-presentation-skills skills/pitch-deck/pitch-deck-skill.md`
Expected: mostly `DUP`. `skills/pitch-deck/pitch-deck-skill.md` and root `SKILL.md` will show `UNIQUE` (stale versions, not copies).

- [ ] **Step 4: Review each UNIQUE file**

For each UNIQUE file, `diff` it against its nearest current counterpart (for example `diff cochl-brochure-skill/SKILL.md skills/cochl-presentation/references/brochure/<spec>.md`). Classify each as **stale** (an older version of something under `skills/`) or **only copy** (content not found anywhere else). Write the list into the PR description. **If anything is "only copy", stop and ask HJ** before deleting it.

Known: root `SKILL.md` is a copy of the superpowers verification skill (not Cochl content) → stale. `pitch-deck-skill.md` is v1.0 (IBM Plex, navy) superseded by `SKILL.md` v1.1 → stale.

- [ ] **Step 5: Delete and verify the installer still works**

```bash
git rm -r -q SKILL.md cochl-brochure-skill cochl-social-kit cochl-presentation-skills skills/pitch-deck/pitch-deck-skill.md
HOME="$TMPDIR/phase2-home" bash .claude/install-skills.sh --skip-hook
ls "$TMPDIR/phase2-home/.claude/skills"
```
Expected: `cochl-presentation design-review design-system pitch-deck proposal-doc` and no errors.

- [ ] **Step 6: Commit, then ask HJ before pushing / opening the PR to `main`**

```bash
git add scripts/check-leftovers.sh
git commit -m "chore: remove root leftovers and stale pitch-deck v1.0

Verified with scripts/check-leftovers.sh; see PR for the UNIQUE review.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 7: After the PR merges, bring it into the integration branch**

```bash
git switch phase2/consolidation && git merge --no-edit origin/main
```

---

### Task 3: Brand-facts tooling and "before" baseline

**Files:**
- Create: `scripts/brand-facts/facts.py`, `scripts/brand-facts/diff.py`, `scripts/brand-facts/test_facts.py`, `scripts/brand-facts/fixtures/slide_a.html`, `scripts/brand-facts/fixtures/slide_b.html`
- Create: `docs/phase2-baseline/inputs/investor.md`, `inputs/pt-template.md`, `inputs/design-review.md`, `inputs/router-cases.md`
- Create (outputs): `docs/phase2-baseline/before/<case>/…`, `docs/phase2-baseline/before/<case>.facts.json`

**Interfaces:**
- Produces: `python3 scripts/brand-facts/facts.py <file.html|file.pptx> [--shots <dir>] > out.json`, JSON shape:
  `{"kind": "html"|"pptx", "fonts": {name: count}, "colors": {"#rrggbb": count}, "canvas": [w, h], "logos": [{"src": str, "distortion": float}], "layouts": [str]}`
- Produces: `python3 scripts/brand-facts/diff.py before.json after.json [--html report.html --before-shots d1 --after-shots d2]` → markdown on stdout; exit 1 on a brand-fact difference (fonts, colors, canvas, logo distortion > 0.05). Layout differences are reported but don't fail.

- [ ] **Step 1: Write fixtures**

`scripts/brand-facts/fixtures/slide_a.html`:
```html
<!doctype html><html><head><style>
body{margin:0} .slide{width:1440px;height:810px;background:#0b0b12;color:#ffffff;font-family:'IBM Plex Sans',sans-serif}
h1{color:#4b68ff} img{height:20px;width:auto}
</style></head><body>
<section class="slide" data-layout="hero"><h1>Title</h1><p>Body</p>
<img class="logo" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='20'></svg>"></section>
</body></html>
```
`scripts/brand-facts/fixtures/slide_b.html`: same file, but `h1{color:#832bfb}` and `img{height:20px;width:200px}` (logo stretched to 2×).

- [ ] **Step 2: Write failing tests** — `scripts/brand-facts/test_facts.py`

```python
import json, subprocess, sys, unittest
from pathlib import Path

HERE = Path(__file__).parent
FX = HERE / "fixtures"

def run(*args):
    return subprocess.run([sys.executable, *args], capture_output=True, text=True)

class FactsTest(unittest.TestCase):
    def facts(self, name):
        r = run(str(HERE / "facts.py"), str(FX / name))
        self.assertEqual(r.returncode, 0, r.stderr)
        return json.loads(r.stdout)

    def test_html_facts(self):
        f = self.facts("slide_a.html")
        self.assertEqual(f["kind"], "html")
        self.assertIn("IBM Plex Sans", f["fonts"])
        self.assertIn("#4b68ff", f["colors"])
        self.assertIn("#0b0b12", f["colors"])
        self.assertEqual(f["canvas"], [1440, 810])
        self.assertEqual(f["layouts"], ["hero"])
        self.assertLess(f["logos"][0]["distortion"], 0.05)

    def test_diff_flags_color_and_logo(self):
        a, b = HERE / "a.json", HERE / "b.json"
        a.write_text(json.dumps(self.facts("slide_a.html")))
        b.write_text(json.dumps(self.facts("slide_b.html")))
        try:
            r = run(str(HERE / "diff.py"), str(a), str(b))
            self.assertEqual(r.returncode, 1)
            self.assertIn("#832bfb", r.stdout)
            self.assertIn("logo", r.stdout.lower())
            same = run(str(HERE / "diff.py"), str(a), str(a))
            self.assertEqual(same.returncode, 0, same.stdout)
        finally:
            a.unlink(); b.unlink()

if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 3: Run to verify failure**

Run: `python3 scripts/brand-facts/test_facts.py`
Expected: FAIL — `facts.py` not found (non-zero return code).

- [ ] **Step 4: Implement `facts.py`**

```python
#!/usr/bin/env python3
"""Extract brand facts (fonts, colors, canvas, logo distortion, layouts) from an HTML or PPTX output."""
import json, sys
from collections import Counter
from pathlib import Path

JS = r"""
() => {
  const hex = (c) => {
    const m = c && c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m || (m[4] !== undefined && Number(m[4]) === 0)) return null;
    return '#' + [m[1], m[2], m[3]].map(n => Number(n).toString(16).padStart(2, '0')).join('');
  };
  const fonts = {}, colors = {};
  const bump = (o, k) => { if (k) o[k] = (o[k] || 0) + 1; };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') continue;
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      bump(fonts, cs.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, ''));
      bump(colors, hex(cs.color));
    }
    bump(colors, hex(cs.backgroundColor));
    if (parseFloat(cs.borderTopWidth) > 0) bump(colors, hex(cs.borderTopColor));
  }
  const logos = [...document.querySelectorAll('img')]
    .filter(i => /logo/i.test(i.className + ' ' + i.src + ' ' + i.alt))
    .map(i => {
      const r = i.getBoundingClientRect();
      const natural = i.naturalWidth / (i.naturalHeight || 1), rendered = r.width / (r.height || 1);
      return { src: i.src.slice(0, 80), distortion: natural ? Math.abs(rendered / natural - 1) : 0 };
    });
  const slides = [...document.querySelectorAll('section.slide, .slide, .pg, .page')];
  const first = slides[0] ? slides[0].getBoundingClientRect() : { width: innerWidth, height: innerHeight };
  return {
    fonts, colors, logos,
    canvas: [Math.round(first.width), Math.round(first.height)],
    layouts: slides.map(s => s.dataset.layout || s.className),
  };
}
"""

def html_facts(path: Path, shots: Path | None):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={"width": 1440, "height": 810})
        page.goto(path.resolve().as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        facts = page.evaluate(JS)
        if shots:
            shots.mkdir(parents=True, exist_ok=True)
            els = page.query_selector_all("section.slide, .slide, .pg, .page") or [page]
            for i, el in enumerate(els, 1):
                el.screenshot(path=str(shots / f"{i:02d}.png"))
        b.close()
    return {"kind": "html", **facts}

def pptx_facts(path: Path):
    from pptx import Presentation
    prs = Presentation(str(path))
    fonts, colors = Counter(), Counter()
    for slide in prs.slides:
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            for para in shape.text_frame.paragraphs:
                for run in para.runs:
                    if run.font.name:
                        fonts[run.font.name] += 1
                    try:
                        if run.font.color and run.font.color.type is not None and run.font.color.rgb:
                            colors["#" + str(run.font.color.rgb).lower()] += 1
                    except AttributeError:
                        pass  # theme colors have no .rgb
    emu_per_in = 914400
    return {
        "kind": "pptx", "fonts": dict(fonts), "colors": dict(colors), "logos": [],
        "canvas": [round(prs.slide_width / emu_per_in, 3), round(prs.slide_height / emu_per_in, 3)],
        "layouts": [s.slide_layout.name for s in prs.slides],
    }

def main(argv):
    path = Path(argv[0])
    shots = Path(argv[argv.index("--shots") + 1]) if "--shots" in argv else None
    facts = pptx_facts(path) if path.suffix == ".pptx" else html_facts(path, shots)
    print(json.dumps(facts, indent=2, sort_keys=True))

if __name__ == "__main__":
    main(sys.argv[1:])
```

- [ ] **Step 5: Implement `diff.py`**

```python
#!/usr/bin/env python3
"""Compare two brand-facts JSON files. Exit 1 on any brand-fact difference."""
import json, sys
from pathlib import Path

def compare(a, b):
    fails, notes = [], []
    for key in ("fonts", "colors"):
        added, removed = set(b[key]) - set(a[key]), set(a[key]) - set(b[key])
        if added: fails.append(f"{key} added: {', '.join(sorted(added))}")
        if removed: fails.append(f"{key} removed: {', '.join(sorted(removed))}")
    if a["canvas"] != b["canvas"]:
        fails.append(f"canvas {a['canvas']} → {b['canvas']}")
    for i, logo in enumerate(b["logos"]):
        if logo["distortion"] > 0.05:
            fails.append(f"logo #{i + 1} distorted {logo['distortion']:.0%} ({logo['src']})")
    if a["layouts"] != b["layouts"]:
        notes.append(f"layouts {a['layouts']} → {b['layouts']}")
    return fails, notes

def html_report(out: Path, before: Path, after: Path, md: str):
    names = sorted({p.name for p in before.glob("*.png")} | {p.name for p in after.glob("*.png")})
    rows = "".join(
        f"<tr><td>{n}</td><td><img src='{(before / n).resolve().as_uri()}'></td>"
        f"<td><img src='{(after / n).resolve().as_uri()}'></td></tr>" for n in names)
    out.write_text(
        "<!doctype html><meta charset=utf-8><title>Phase 2 regression</title>"
        "<style>body{font-family:system-ui;margin:24px}img{width:560px;border:1px solid #ccc}"
        "td{vertical-align:top;padding:6px}</style>"
        f"<pre>{md}</pre><table><tr><th></th><th>before</th><th>after</th></tr>{rows}</table>")

def main(argv):
    a, b = (json.loads(Path(p).read_text()) for p in argv[:2])
    fails, notes = compare(a, b)
    md = "\n".join(["## Brand facts", *([f"- ✗ {f}" for f in fails] or ["- ✓ no brand-fact differences"]),
                    "## Layout notes", *([f"- {n}" for n in notes] or ["- none"])])
    print(md)
    if "--html" in argv:
        g = lambda flag: Path(argv[argv.index(flag) + 1])
        html_report(g("--html"), g("--before-shots"), g("--after-shots"), md)
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
```

Note: `diff.py` uses the literal `#ccc` in a report stylesheet; `scripts/` is outside `skills/`, so lint does not apply.

- [ ] **Step 6: Run tests**

Run: `python3 scripts/brand-facts/test_facts.py -v`
Expected: 2 tests PASS.

- [ ] **Step 7: Write baseline inputs**

`docs/phase2-baseline/inputs/investor.md`:
```markdown
Build an investor deck for Cochl.
- Product: Cochl.Sense — sound AI that recognizes 30+ sound events (Cloud API + Edge SDK).
- Audience: seed/Series A investors.
- Key messages: machines can't hear today; Cochl gives devices hearing; proven in smart home, automotive, safety.
- Contact/web/location: use brand-core company facts.
- Any metric not given here: mark NEEDS INPUT (do not invent).
```
`docs/phase2-baseline/inputs/pt-template.md`: the same content, plus the first line `Use the official Cochl PT template look (pitch-deck skill).`
`docs/phase2-baseline/inputs/design-review.md`:
```markdown
type=proposal
Project: Mobile Dashboard redesign. Goal: let ops managers check sound-event alerts on phone.
Feedback needed: navigation pattern (tabs vs drawer), alert density.
Directions: 1) Tab-first  2) Feed-first.
```
`docs/phase2-baseline/inputs/router-cases.md` — 12 cases, `expected` is the skill folder:
```markdown
| # | Request | Expected |
|---|---|---|
| 1 | Make an investor deck for our seed round | cochl-presentation |
| 2 | I need a LinkedIn banner for the CES launch | cochl-presentation |
| 3 | Rebuild the AcousticShield deck in the official PT template | cochl-presentation (pt-template) |
| 4 | Update slide 5 of our Century Gothic pitch deck | cochl-presentation (pt-template) |
| 5 | Prepare a proposal review for the mobile dashboard | design-review |
| 6 | Set up a direction alignment & feedback meeting deck | design-review |
| 7 | Write a design proposal document for client X with payments and terms | proposal-doc |
| 8 | Turn this proposal into a PDF in Cochl style | proposal-doc |
| 9 | Install @cochlearai/ui in my Vite app | design-system |
| 10 | Is our Button in code drifting from Figma? | design-sync |
| 11 | Help me with a Cochl thing | ASK (one multiple-choice question) |
| 12 | Make a review deck and then a proposal doc for it | design-review first, then offer proposal-doc |
```

- [ ] **Step 8: Tag the baseline and generate "before" outputs**

```bash
git tag phase2-before origin/main
git worktree add "$TMPDIR/phase2-before" phase2-before
```

For each case — `investor` (skill `cochl-presentation`), `pt-template` (skill `pitch-deck`), `design-review` (skill `design-review`), `proposal-doc` (skill `proposal-doc`, input `skills/proposal-doc/examples/mobile-dashboard-proposal.md`) — dispatch one subagent with this prompt:

> Read `$TMPDIR/phase2-before/skills/<skill>/SKILL.md` and follow it exactly (resolve its relative paths from that folder, not from `~/.claude/skills`). Input: the contents of `docs/phase2-baseline/inputs/<case>.md`. Write all outputs to `docs/phase2-baseline/before/<case>/`. Do not ask questions; if the skill would ask, choose the first option and note it in `docs/phase2-baseline/before/<case>/NOTES.md`.

For `design-system`: in `$TMPDIR/phase2-vite` run `npm create vite@latest app -- --template react-ts`, then have a subagent follow `$TMPDIR/phase2-before/skills/design-system/SKILL.md` React mode, and save `git -C app diff --stat` plus the changed files to `docs/phase2-baseline/before/design-system/`. If the `@cochlearai` registry token is not available, record that in `NOTES.md` and compare only the planned file changes.

- [ ] **Step 9: Extract facts**

```bash
for c in investor pt-template design-review proposal-doc; do
  f=$(ls docs/phase2-baseline/before/$c/*.html | head -1)
  python3 scripts/brand-facts/facts.py "$f" --shots docs/phase2-baseline/before/$c/shots > docs/phase2-baseline/before/$c.facts.json
done
python3 scripts/brand-facts/facts.py "$(ls docs/phase2-baseline/before/pt-template/*.pptx | head -1)" > docs/phase2-baseline/before/pt-template.pptx.facts.json
```
Expected: 5 JSON files; `pt-template.pptx.facts.json` has `"canvas": [10.0, 5.625]` and `Century Gothic` in `fonts`.

- [ ] **Step 10: Commit**

```bash
git add scripts/brand-facts docs/phase2-baseline
git commit -m "phase2: brand-facts tooling + before baseline

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## W2 — Oct 12

### Task 4: hex-to-var tool and CI workflow

**Files:**
- Create: `scripts/skills-lint/hex-to-var.mjs`, `scripts/skills-lint/test/hex-to-var.test.mjs`, `.github/workflows/skills-lint.yml`

**Interfaces:**
- Consumes: none from earlier tasks (theme files are created in Task 5; the tool reads any markdown with a fenced `css` `:root` block).
- Produces: `themeVars(themeText: string): Map<string /*#rrggbb lowercase*/, string /*--name*/>`, `rewrite(text: string, vars: Map): {text: string, replaced: number, unmapped: string[]}`; CLI `node scripts/skills-lint/hex-to-var.mjs --theme <theme.md> <file.md>… [--write]` prints counts and unmapped hexes; exits 1 if any unmapped.

- [ ] **Step 1: Write failing tests** — `scripts/skills-lint/test/hex-to-var.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { themeVars, rewrite } from '../hex-to-var.mjs';

const theme = '# t\n```css\n:root {\n  --bg: #0B0B12;\n  --text: #fff;\n  --accent: #4B68FF;\n  --link: #4b68ff;\n}\n```\n';

test('themeVars normalises case and 3-digit hex; first name wins', () => {
  const v = themeVars(theme);
  assert.equal(v.get('#0b0b12'), '--bg');
  assert.equal(v.get('#ffffff'), '--text');
  assert.equal(v.get('#4b68ff'), '--accent');
});

test('rewrite replaces hex only inside fenced code', () => {
  const src = 'Prose #4B68FF stays.\n```html\n<div style="color:#4B68FF;background:#FFF">\n```\n';
  const r = rewrite(src, themeVars(theme));
  assert.equal(r.replaced, 2);
  assert.match(r.text, /color:var\(--accent\);background:var\(--text\)/);
  assert.match(r.text, /Prose #4B68FF stays/);
});

test('rewrite reports unmapped hex and leaves it', () => {
  const r = rewrite('```css\na{color:#123456}\n```', themeVars(theme));
  assert.deepEqual(r.unmapped, ['#123456']);
  assert.match(r.text, /#123456/);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd scripts/skills-lint && npm test`
Expected: FAIL — `Cannot find module '../hex-to-var.mjs'`

- [ ] **Step 3: Implement `hex-to-var.mjs`**

```js
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
```

- [ ] **Step 4: Run tests**

Run: `cd scripts/skills-lint && npm test`
Expected: all PASS.

- [ ] **Step 5: Write `.github/workflows/skills-lint.yml`**

```yaml
name: skills-lint

on:
  pull_request:
    paths: ["skills/**", "scripts/skills-lint/**", ".github/workflows/skills-lint.yml"]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Unit tests
        working-directory: scripts/skills-lint
        run: npm test
      - name: Lint skills
        run: node scripts/skills-lint/lint.mjs --base "origin/${{ github.base_ref }}"
```

- [ ] **Step 6: Commit**

```bash
git add scripts/skills-lint .github/workflows/skills-lint.yml
git commit -m "phase2: hex-to-var tool + skills-lint CI

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Create `skills/cochl-design/core/`

**Files:**
- Create: `skills/cochl-design/core/brand-core.md`, `core/themes/plex.md`, `core/themes/pt-template.md`, `core/tokens.md`, `core/qa-checklist.md`
- Modify: `docs/phase2-inventory.md` (fill the Target column)
- Source: `skills/cochl-presentation/references/brand-core.md` (§1–§3b), `skills/pitch-deck/SKILL.md` Part 1 (lines 21–95), `skills/design-review/SKILL.md` §Color Tokens + §Font Stack (lines 61–86), `skills/proposal-doc/SKILL.md` §Typography System + §HTML Design System CSS (lines 76–98, 391–520)

**Interfaces:**
- Produces: theme files each containing exactly one fenced ```` ```css ```` block starting with `:root {`, one `--name: value;` per line. **Token names other tasks rely on:**
  - `plex`: `--bg --bg-pure --panel --panel-2 --border --text --text-soft --muted --placeholder --accent --accent-purple --mint --logo-g1 --logo-g2 --logo-g3 --danger --success --warning` (from brand-core §1, names unchanged) + light surfaces `--light-bg --light-gray --light-card --ink --ink-soft --doc-link` (from design-review / proposal-doc values found by the inventory) + font roles `--font-sans --font-mono --font-body --font-ui --font-quote` + `--font-link` (Google Fonts URL as a comment).
  - `pt-template`: names from pitch-deck Part 1 unchanged (`--c-primary --c-analytics --c-lavender --c-success --c-warning --c-emergency --col-light-bg --col-text-dark --col-text-sub --col-text-light --col-text-lavender --grad-main`) + `--font-heading --font-body --font-web` + `--slide-width --slide-height`.

- [ ] **Step 1: Fill the inventory Target column**

For every row of `docs/phase2-inventory.md`, write `plex --name`, `pt-template --name`, or `drop (superseded)`. Rules: values from `pitch-deck/SKILL.md` → `pt-template`. `#0b1f3a #6b4eff #06101e #0f2847 #8b9bb4` (old navy) → `drop`. Everything else → `plex`; reuse the brand-core name when the value already exists there. Two values within ΔE < 2 of each other (for example `#1a1a1a` vs `#1b1b26`) are **not** merged automatically — list them under "Near-duplicates for HJ" at the bottom of the file.

- [ ] **Step 2: Write `core/themes/plex.md`**

Structure (fill values from the inventory Target column; every `plex` row must appear exactly once):
````markdown
# Theme: plex (default)

IBM Plex Sans/Mono, near-black + indigo + purple→blue glow. Used by every skill unless a template sets `pt-template`.

```css
:root {
  /* Surfaces (dark) */
  --bg: #0b0b12;
  /* … every plex token, grouped: Surfaces (dark), Surfaces (light), Ink, Accents, Logo gradient, Signals … */
  /* Font roles */
  --font-sans: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'Roboto', sans-serif;      /* design-review body */
  --font-ui: 'Public Sans', sans-serif;   /* design-review header bar */
  --font-quote: 'Lora', serif;            /* design-review quote slides */
}
```

**Google Fonts link** (paste into `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&family=Roboto:wght@300;400;500&family=Public+Sans:wght@400;500&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
```

**Glow motif** — copy brand-core §1 "Glow motif" verbatim, with hex values replaced by var().
**Editable SVG** (brochure/social): use the literal stack `'IBM Plex Sans','Helvetica Neue',Arial` — SVGs are lint-exempt.
````

- [ ] **Step 3: Write `core/themes/pt-template.md`**

Move pitch-deck Part 1 (lines 21–95: the css token block, background-system table, gradient rule) here verbatim, wrapping the tokens in `:root { … }` with `;` line endings and converting `font-family-heading:` → `--font-heading:`, `font-family-body:` → `--font-body:`, `font-family-web:` → `--font-web:`. Keep the type-scale lines as a markdown table below the css block.

- [ ] **Step 4: Write `core/brand-core.md`**

Move from `cochl-presentation/references/brand-core.md`: §1b, §1c, §1d (NEEDS INPUT components), §2b, §2c (copy), §3 (logo), §3b (company facts), the heading-treatment table from §2, and the Glow description. Replace every hex/font literal with the token name (for example "indigo `--accent`"). Add at the top:
```markdown
# Cochl Brand Core

Shared by every Cochl skill. Values live in `themes/plex.md` (default) and `themes/pt-template.md`; this file holds the rules. A template may choose a theme and use its tokens — it may not define new color or font values.
```

- [ ] **Step 5: Write `core/tokens.md` and `core/qa-checklist.md`**

`core/tokens.md`:
```markdown
# Product UI tokens

React/product UI uses `@cochlearai/ui` tokens directly — do not copy values here or into a skill.
Install and usage: `skills/design-system/SKILL.md` → React DS Mode. Mapping Figma ↔ code: `design-sync/config/mapping.json`.
```
`core/qa-checklist.md`: the union of brand-only items from `brand-core.md` §4 "Deck QA checklist", `design-system` "React QA checklist" + "Pitch deck QA checklist", and `proposal-doc` "QA Checklist" — keep only items about logo, color, fonts, glow, company facts and NEEDS INPUT; leave layout/structure items in their skill.

- [ ] **Step 6: Verify**

Run: `node scripts/skills-lint/lint.mjs --base HEAD && node scripts/skills-lint/hex-to-var.mjs --theme skills/cochl-design/core/themes/plex.md skills/design-review/SKILL.md skills/proposal-doc/SKILL.md`
Expected: lint shows only the known name≠folder errors (core is exempt). hex-to-var (dry run) reports **0 UNMAPPED** for both files — if not, add the missing value to `plex.md` (and the inventory) and re-run.

Run: `node scripts/skills-lint/hex-to-var.mjs --theme skills/cochl-design/core/themes/pt-template.md skills/pitch-deck/SKILL.md`
Expected: 0 UNMAPPED.

- [ ] **Step 7: Commit**

```bash
git add skills/cochl-design/core docs/phase2-inventory.md
git commit -m "phase2: cochl-design core (brand-core, plex, pt-template, qa)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Split deck machinery out of the old brand-core

**Files:**
- Create: `skills/cochl-presentation/references/deck-engine.md`
- Delete: `skills/cochl-presentation/references/brand-core.md`
- Modify: every file under `skills/cochl-presentation/` that mentions `brand-core.md`

**Interfaces:**
- Consumes: `skills/cochl-design/core/brand-core.md` (Task 5)
- Produces: `references/deck-engine.md` with sections `Page navigation`, `Motion`, `HTML → PPTX`, `Output flow`, `Deck QA checklist` (layout/structure items only), `Card-layout reuse check`, `Aspect-ratio check`.

- [ ] **Step 1: Move §4 of the old brand-core into `deck-engine.md`**, converting hex/font literals with `node scripts/skills-lint/hex-to-var.mjs --theme skills/cochl-design/core/themes/plex.md skills/cochl-presentation/references/deck-engine.md --write`. Replace font literals in prose by role names (`--font-mono`).

- [ ] **Step 2: Repoint references**

Run: `grep -rln "brand-core.md" skills/cochl-presentation`
For each hit: links to brand rules → `../cochl-design/core/brand-core.md` (adjust `../` depth to the file's location: a file in `references/decks/` uses `../../../cochl-design/core/brand-core.md`); links to `§4` / page-nav / PPTX / QA machinery → `deck-engine.md` (relative to the file).

- [ ] **Step 3: Delete the old file and verify**

```bash
git rm -q skills/cochl-presentation/references/brand-core.md
node scripts/skills-lint/lint.mjs --base HEAD
```
Expected: no `referenced path not found` errors.

- [ ] **Step 4: Commit**

```bash
git add -A skills/cochl-presentation
git commit -m "phase2: split deck machinery into deck-engine.md

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Tasks 7–9: Point one skill at core (one PR each)

Each of these three tasks is one PR into `phase2/consolidation`, so a reviewer can reject one without the others.

#### Task 7: design-review

**Files:** Modify `skills/design-review/SKILL.md`

- [ ] **Step 1: Strict lint shows the current hits**

Run: `node scripts/skills-lint/lint.mjs --strict skills/design-review | tail -3`
Expected: FAIL with ~80 brand values found.

- [ ] **Step 2: Frontmatter** — set `name: design-review`; delete the `triggers:` block. Keep `description` unchanged.

- [ ] **Step 3: Replace §Color Tokens and §Font Stack (lines 61–86)** with the Global Constraints brand text, using theme `plex`, followed by one table that maps roles → tokens:
```markdown
| Role | Token |
|---|---|
| Cover / dividers / final mockup bg | `--bg-pure` |
| Content slide bg | `--light-bg` |
| Divider / goal / persona bg | `--light-gray` |
| Cards on gray slides | `--light-card` |
| Small label caps | `--accent` |
| Titles, dividers, direction titles | `--font-sans` |
| Tech headers (BEFORE/AFTER, MATRIX, FINDINGS) | `--font-mono` |
| Body, numbers, goal card body | `--font-body` |
| Persistent header, keyword bars | `--font-ui` |
| Full-bleed quotes | `--font-quote` |
```
In §Typography Scale, replace the Font column values with the token names.

- [ ] **Step 4: Convert code templates**

Run: `node scripts/skills-lint/hex-to-var.mjs --theme skills/cochl-design/core/themes/plex.md skills/design-review/SKILL.md --write`
Then replace `font-family:'IBM Plex Sans'…` etc. inside code blocks with `font-family:var(--font-sans)` (same for mono/body/ui/quote). In §HTML Shell, replace the Google Fonts `<link>` with `<!-- Google Fonts link: see ../cochl-design/core/themes/plex.md -->` and add `<style>/* paste plex :root block here */</style>` as the first style element.

- [ ] **Step 5: Strict lint passes**

Run: `node scripts/skills-lint/lint.mjs --strict skills/design-review`
Expected: `✓ strict: clean`

- [ ] **Step 6: Quick output check** — dispatch a subagent to run the skill from the repo copy (`skills/design-review/SKILL.md`) with `docs/phase2-baseline/inputs/design-review.md` into `$TMPDIR/dr-check/`, then:
```bash
python3 scripts/brand-facts/facts.py "$(ls $TMPDIR/dr-check/*.html | head -1)" > $TMPDIR/dr.json
python3 scripts/brand-facts/diff.py docs/phase2-baseline/before/design-review.facts.json $TMPDIR/dr.json
```
Expected: `✓ no brand-fact differences`. If fonts/colors differ, fix the role table or theme and repeat.

- [ ] **Step 7: Commit** — `git commit -am "phase2: design-review uses cochl-design core" ` with the trailer.

#### Task 8: proposal-doc

**Files:** Modify `skills/proposal-doc/SKILL.md`

- [ ] **Step 1:** `node scripts/skills-lint/lint.mjs --strict skills/proposal-doc` → expect hits.
- [ ] **Step 2: Frontmatter** — `name: proposal-doc`; delete `triggers:`.
- [ ] **Step 3:** Replace §Typography System font literals with role tokens (`--font-sans` headings, `--font-mono` monospace headings) and insert the Global Constraints brand text (theme `plex`) directly under `## Source of Truth`.
- [ ] **Step 4:** `node scripts/skills-lint/hex-to-var.mjs --theme skills/cochl-design/core/themes/plex.md skills/proposal-doc/SKILL.md --write`; replace font-family literals in §HTML Design System CSS with `var(--font-…)`; replace the §Google Fonts link block with a pointer to `plex.md`; make §Logo point to `../cochl-design/core/brand-core.md` → Logo.
- [ ] **Step 5:** `node scripts/skills-lint/lint.mjs --strict skills/proposal-doc` → `✓ strict: clean`.
- [ ] **Step 6:** Quick output check as Task 7 Step 6, using input `skills/proposal-doc/examples/mobile-dashboard-proposal.md` and baseline `proposal-doc.facts.json`. Expected: no brand-fact differences.
- [ ] **Step 7: Commit** — `"phase2: proposal-doc uses cochl-design core"` with trailer.

#### Task 9: design-system (NS reviews)

**Files:** Modify `skills/design-system/SKILL.md`

- [ ] **Step 1:** `node scripts/skills-lint/lint.mjs --strict skills/design-system` → expect hits.
- [ ] **Step 2: Frontmatter** — `name: design-system`. Remove "or pitch decks" and "and applies the Cochl Presentation System when building HTML pitch decks" from `description`.
- [ ] **Step 3:** Delete §Cochl Design System Tokens (lines 36–80, old navy tokens) and §Pitch Deck Mode (lines 130–191). In §Mode Detection, replace the pitch-deck branch with: `Pitch deck / presentation request → stop and use the cochl-presentation skill.`
- [ ] **Step 4:** Add under `## Mode Detection`: React mode → `../cochl-design/core/tokens.md` (use `@cochlearai/ui`); HTML mode → the Global Constraints brand text with theme `plex`.
- [ ] **Step 5:** `node scripts/skills-lint/lint.mjs --strict skills/design-system` → `✓ strict: clean`.
- [ ] **Step 6:** Ask NS to review this PR specifically for the React-mode changes. HTML-mode color change (navy → plex) is intended (spec §9.4); call it out in the PR description.
- [ ] **Step 7: Commit** — `"phase2: design-system uses cochl-design core; drop navy tokens and pitch-deck mode"` with trailer.

---

## W3 — Oct 19

### Task 10: Merge pitch-deck into cochl-presentation + stub

**Files:**
- Create: `skills/cochl-presentation/references/decks/pt-template/pt-template.md`, move `skills/pitch-deck/assets/` → `skills/cochl-presentation/references/decks/pt-template/assets/`
- Modify: `skills/cochl-presentation/references/registry.md`, `skills/cochl-presentation/SKILL.md`
- Replace: `skills/pitch-deck/SKILL.md` (stub); delete `skills/pitch-deck/USAGE.md`

**Interfaces:**
- Consumes: `core/themes/pt-template.md` (Task 5), `references/deck-engine.md` (Task 6)
- Produces: registry row id `pt-template`, spec path `references/decks/pt-template/pt-template.md`.

- [ ] **Step 1: Move content**

```bash
mkdir -p skills/cochl-presentation/references/decks/pt-template
git mv skills/pitch-deck/assets skills/cochl-presentation/references/decks/pt-template/assets
sed -n '96,$p' skills/pitch-deck/SKILL.md > skills/cochl-presentation/references/decks/pt-template/pt-template.md
```
(Part 1, lines 21–95, already lives in `core/themes/pt-template.md`.)

- [ ] **Step 2: Header + conversion**

Prepend to `pt-template.md`:
```markdown
# Deck template: PT template (official Cochl_PT_template.pptx)

**Theme:** `pt-template` — read `../../../../cochl-design/core/brand-core.md`, then `../../../../cochl-design/core/themes/pt-template.md`. Paste its `:root` block into the output `<style>`.
**Machinery:** `../../deck-engine.md`. **Always output both HTML and PPTX.** Slide size 10×5.625in.
**Source template:** `assets/Cochl_PT_template.pptx`.
```
Run: `node scripts/skills-lint/hex-to-var.mjs --theme skills/cochl-design/core/themes/pt-template.md skills/cochl-presentation/references/decks/pt-template/pt-template.md --write` → expect 0 UNMAPPED. Replace font-family literals with `var(--font-heading)` / `var(--font-body)` / `var(--font-web)`. Delete any remaining Part-1 restatements (search for `Design Tokens`).

- [ ] **Step 3: Registry and router line**

Add a row to `registry.md` in the decks table, following its existing column format: `pt-template | ✅ | Official PT template (Century Gothic) — update or rebuild decks in Cochl_PT_template.pptx | all teams | decks/pt-template/pt-template.md`. In `cochl-presentation/SKILL.md` §Routing procedure step 1, add: "PT template / `.pptx` template / Century Gothic / AcousticShield deck → `decks/pt-template/` (theme `pt-template`)." Replace its §How this skill is organized brand-core bullet with the Global Constraints brand text.

- [ ] **Step 4: Write the stub** — `skills/pitch-deck/SKILL.md`

```markdown
---
name: pitch-deck
description: Preserves the Cochl pitch deck visual system and maps new content into it. Use this skill when updating slide content, replacing individual slides, or building a new deck for a different product using the official Cochl PT template style (10×5.625in, mixed light/dark slides). Always outputs both HTML and PPTX formats.
---

This skill moved into `cochl-presentation`. Do this:

1. Read `../cochl-presentation/SKILL.md`.
2. Use the deck template `../cochl-presentation/references/decks/pt-template/pt-template.md` with theme `pt-template`.
3. Always output both HTML and PPTX.
```

Note: the old description named the fonts; they are dropped here because font names outside `core/` fail strict lint. "PT template" still triggers it.

- [ ] **Step 5: Verify**

```bash
git rm -q skills/pitch-deck/USAGE.md
node scripts/skills-lint/lint.mjs --strict skills/pitch-deck
node scripts/skills-lint/lint.mjs --strict skills/cochl-presentation
node scripts/skills-lint/lint.mjs --base origin/main
wc -l skills/*/SKILL.md | tail -1
```
Expected: both strict runs `✓ strict: clean` (convert any remaining hits in `cochl-presentation/references/**` with hex-to-var + font roles — that is part of this task); lint passes; SKILL.md total ≤ 2,735.

- [ ] **Step 6: Quick pt-template check** — subagent runs `/pitch-deck` from the repo copy with `docs/phase2-baseline/inputs/pt-template.md` into `$TMPDIR/pt-check/`; then `facts.py` on both the HTML and the PPTX and `diff.py` against `before/pt-template.facts.json` and `before/pt-template.pptx.facts.json`. Expected: no brand-fact differences; PPTX canvas `[10.0, 5.625]`.

- [ ] **Step 7: Commit** — `"phase2: merge pitch-deck into cochl-presentation (pt-template) + stub"` with trailer.

---

### Task 11: `/cochl-design` router

**Files:** Create `skills/cochl-design/SKILL.md`

- [ ] **Step 1: Write the router**

```markdown
---
name: cochl-design
description: Single entry point for the Cochl design team toolkit. Use when the user asks for anything Cochl-branded — decks, pitches, brochures, banners, press kits, design reviews, proposal documents, installing or applying the Cochl design system (@cochlearai/ui), or checking Figma ↔ code drift — or types /cochl-design. Routes the request to the right Cochl skill.
---

# Cochl Design — router

You do not build anything here. Pick the skill, load its SKILL.md, and follow it.

## Routing table

| The request is about… | Load | Theme |
|---|---|---|
| deck, pitch, presentation, brochure, banner, press kit, document | `../cochl-presentation/SKILL.md` | `plex` |
| …PT template, `.pptx` template, Century Gothic, AcousticShield deck | `../cochl-presentation/SKILL.md` → `references/decks/pt-template/` | `pt-template` |
| design review — Proposal, or Direction Alignment & Feedback | `../design-review/SKILL.md` | `plex` |
| design proposal document (HTML → PDF) | `../proposal-doc/SKILL.md` | `plex` |
| install/apply `@cochlearai/ui`, build React UI | `../design-system/SKILL.md` | `@cochlearai/ui` tokens |
| Figma ↔ code drift, mapping, coverage | `../design-sync/SKILL.md` | n/a |

## Rules

1. **Unclear request** → ask exactly one multiple-choice question listing the six rows above, then route. Never guess between two skills.
2. **Two-part request** → route the first part; when it is done, offer the second. Never run two skills at once.
3. **`/cochl-design` with no request** → show the six rows as a menu, one line each, and wait.
4. The user may ask for the other theme in words; there is no third theme.
5. Every skill can still be called directly (`/cochl-presentation`, `/pitch-deck`, `/design-review`, `/proposal-doc`, `/design-system`, `/design-sync`).

Brand rules for all skills: `core/brand-core.md`.
```

- [ ] **Step 2: Router check (12 cases)**

For each row of `docs/phase2-baseline/inputs/router-cases.md`, dispatch a subagent: "Read only `skills/cochl-design/SKILL.md`. For this request, answer with the skill folder you would load and the theme, or the question you would ask. Request: <request>". Record answers in `docs/phase2-baseline/router-results.md` as `| # | expected | got | ✓/✗ |`.
Expected: 12/12 ✓. If any ✗, adjust the routing table wording and re-run only the failed cases.

- [ ] **Step 3: Verify and commit**

Run: `node scripts/skills-lint/lint.mjs --strict skills/cochl-design` → `✓ strict: clean` (the `core/` folder is exempt; the SKILL.md has no values).
Commit: `"phase2: /cochl-design router"` with trailer.

---

### Task 12: `design-sync` thin skill (YJ reviews)

**Files:** Create `skills/design-sync/SKILL.md`

- [ ] **Step 1: Write the skill**

```markdown
---
name: design-sync
description: Checks drift between the Figma Cochl Design System and @cochlearai/ui code. Use when the user asks whether a component in code matches Figma, wants a drift or coverage report, or wants to validate or extend the Figma ↔ code component mapping.
---

# design-sync (wrapper)

The engine lives in the repo at `design-sync/` and is owned by YJ. This skill only runs it.

1. Find the repo: the folder containing `design-sync/cli.mjs` (ask the user for the path if it isn't the current repo).
2. Pick the command:

| Ask | Command (run in `design-sync/`) |
|---|---|
| Is the mapping valid? | `node cli.mjs mapping validate` |
| Drift for all components | `node cli.mjs sync` |
| Drift for one component | `node cli.mjs compare <Component>` |
| Suggested fixes | `node cli.mjs suggest <Component>` |
| Report | `node cli.mjs report` |

3. Exit codes: `0` clean · `1` drift · `2` mapping error · `3` needs input. Report drift; only `2` is a failure.
4. Do not edit `design-sync/config/mapping.json` or engine code from this skill — open an issue for YJ instead.

Supported components today: run `node cli.mjs` with no arguments to print the list.
```

- [ ] **Step 2: Verify**

Run: `(cd design-sync && node cli.mjs mapping validate; echo "exit $?")` and `node scripts/skills-lint/lint.mjs --strict skills/design-sync`
Expected: mapping validate exits 0; strict clean.

- [ ] **Step 3: Commit; request YJ review on the PR** — `"phase2: design-sync thin skill"` with trailer.

---

### Task 13: Plugin namespacing check

**Files:** Create `docs/phase2-plugin-namespace-check.md`

- [ ] **Step 1: Build a throwaway plugin**

```bash
P="$TMPDIR/cochl-design-plugin"; rm -rf "$P"; mkdir -p "$P/.claude-plugin"
cp -R skills "$P/skills"
cat > "$P/.claude-plugin/plugin.json" <<'EOF'
{ "name": "cochl-design", "version": "0.0.0-check", "description": "namespacing check" }
EOF
```

- [ ] **Step 2: Check resolution** — start `claude --plugin-dir "$TMPDIR/cochl-design-plugin"` in a scratch folder **with the copied skills removed from `~/.claude/skills`** (`HOME="$TMPDIR/phase2-home"` keeps the user's install untouched; if auth fails under a temporary HOME, run in the normal HOME and note that copied skills may shadow plugin ones). Record, for each of `/cochl-design`, `/cochl-presentation`, `/pitch-deck`, `/design-review`, `/proposal-doc`, `/design-system`, `/design-sync`: does the bare name resolve? What name does the skill list show (`cochl-design:pitch-deck`?).

- [ ] **Step 3: Write the result** to `docs/phase2-plugin-namespace-check.md` as a table (command · resolves bare? · listed as). If `/cochl-design` only appears as `cochl-design:cochl-design`, add a "Workstream B action" line: move the router to the plugin root skill. Commit with trailer.

---

## W4 — Oct 26

### Task 14: Regression check

**Files:** Create `docs/phase2-baseline/after/…`, `docs/phase2-baseline/report.html`, `docs/phase2-baseline/RESULT.md`

- [ ] **Step 1: Generate "after" outputs** — repeat Task 3 Step 8 with prompts pointing at the repo copy on `phase2/consolidation` (`skills/<skill>/SKILL.md`) and outputs in `docs/phase2-baseline/after/<case>/`. Use the same inputs.

- [ ] **Step 2: Facts and diff**

```bash
for c in investor pt-template design-review proposal-doc; do
  f=$(ls docs/phase2-baseline/after/$c/*.html | head -1)
  python3 scripts/brand-facts/facts.py "$f" --shots docs/phase2-baseline/after/$c/shots > docs/phase2-baseline/after/$c.facts.json
  echo "### $c"; python3 scripts/brand-facts/diff.py docs/phase2-baseline/before/$c.facts.json docs/phase2-baseline/after/$c.facts.json \
    --html docs/phase2-baseline/$c-report.html \
    --before-shots docs/phase2-baseline/before/$c/shots --after-shots docs/phase2-baseline/after/$c/shots
done | tee docs/phase2-baseline/RESULT.md
python3 scripts/brand-facts/facts.py "$(ls docs/phase2-baseline/after/pt-template/*.pptx | head -1)" > docs/phase2-baseline/after/pt-template.pptx.facts.json
python3 scripts/brand-facts/diff.py docs/phase2-baseline/before/pt-template.pptx.facts.json docs/phase2-baseline/after/pt-template.pptx.facts.json | tee -a docs/phase2-baseline/RESULT.md
```
Expected: every case shows `✓ no brand-fact differences`. Layout notes are allowed but each must be explained in `RESULT.md` under "Accepted layout differences" (one line each, with who accepted it).

- [ ] **Step 3: design-system** — repeat the Vite install from the integration branch and compare the files changed to `before/design-system/`. Same files and same `@cochlearai/ui` imports → pass.

- [ ] **Step 4: Size numbers** — append to `RESULT.md`:
```bash
echo "SKILL.md lines: $(cat skills/*/SKILL.md | wc -l) (baseline 3907, target ≤ 2735)"
before_md=$(git ls-tree -r --name-only phase2-before -- skills | grep '\.md$' | while read -r f; do git show "phase2-before:$f"; done | wc -l)
echo "All skills .md lines: $(find skills -name '*.md' -print0 | xargs -0 cat | wc -l) (baseline $before_md)"
```

- [ ] **Step 5: Sign-offs** — send `pt-template-report.html` to the PT template owner and record their OK in `RESULT.md`. **Any ✗ in brand facts → fix in a new PR and repeat Steps 1–2 for that case; do not proceed to Task 15.**

- [ ] **Step 6: Commit** — `"phase2: W4 regression results"` with trailer.

---

### Task 15: Release to `main` and docs

**Files:** Modify `README.md`, `docs/onboarding.md`, `docs/architecture.md`

- [ ] **Step 1: README** — replace the Skills table with: `/cochl-design` (router) first, then `/cochl-presentation`, `/pitch-deck` (→ cochl-presentation, pt-template), `/design-review`, `/proposal-doc`, `/design-system`, `/design-sync`. Remove the `/pitch-deck-skill`, `/design-review-template`, `/dr-template`, `/proposal-doc-template`, `/frontend-design` mentions. Update the Repository Structure block to the spec §3 layout. Make the same command-name fixes in `docs/onboarding.md` and `docs/architecture.md` (`grep -rn "pitch-deck-skill\|design-review-template\|dr-template\|proposal-doc-template\|frontend-design" docs README.md` must return nothing outside `docs/superpowers/` and `docs/phase2-*`).

- [ ] **Step 2: Final checks**

```bash
node scripts/skills-lint/lint.mjs --base origin/main
(cd scripts/skills-lint && npm test)
python3 scripts/brand-facts/test_facts.py
HOME="$TMPDIR/phase2-home2" bash .claude/install-skills.sh --skip-hook && ls "$TMPDIR/phase2-home2/.claude/skills"
```
Expected: lint passes; tests pass; installed skills `cochl-design cochl-presentation design-review design-sync design-system pitch-deck proposal-doc`.

- [ ] **Step 3: Ask HJ, then tag and merge**

```bash
git tag v1-final origin/main
git switch main && git pull --ff-only
git merge --no-ff phase2/consolidation -m "Phase 2 Workstream A: consolidation into cochl-design core

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
Push (`git push origin main v1-final`) only after HJ confirms. Rollback, if needed: `git revert -m 1 <merge-sha>`.

- [ ] **Step 4: Confluence** — ask HJ before editing. Then update the Phase 2 execution plan page: `/cochl` → `/cochl-design`, and add a link to `docs/phase2-baseline/RESULT.md`.

---

## Spec coverage

| Spec item | Task |
|---|---|
| D1 two themes | 5 |
| D2 router + real skills | 11 |
| D3 names unchanged (§9.1 folder = name) | 1 (lint rule), 7–10 |
| D4 pitch-deck merge + stub | 10 |
| D5 `cochl-design` name | 11, 15 |
| D6 core inside router skill | 5 |
| D7 drop `triggers:` | 7, 8 |
| §5 W1 inventory / cleanup / baseline | 1, 2, 3 |
| §5 deck-engine split | 6 |
| §5 one PR per skill | 7, 8, 9, 10 |
| §5 namespacing check | 13 |
| §5 size metric (both numbers) | 10 (check), 14 (report) |
| §6 regression + router 12 cases | 3, 11, 14 |
| §6 CI lint rules 1–4 | 1, 4 |
| §7 rollback / `v1-final` | 15 |
| §9.2 code templates use var() | 4, 7–10 |
| §9.4 drop navy tokens | 5, 9 |
