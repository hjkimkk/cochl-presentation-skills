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
