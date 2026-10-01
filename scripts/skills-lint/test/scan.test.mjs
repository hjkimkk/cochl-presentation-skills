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
