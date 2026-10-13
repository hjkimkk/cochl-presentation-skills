import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkManifests, changelogSection, checkChangedFiles } from '../release.mjs';

const changelog = '# Changelog\n\n## Unreleased\n\n## 2.0.0 — 2026-10-13\n\n- first\n\n## 1.0.0\n\n- old\n';
const market = { plugins: [{ name: 'cochl-design', source: '.' }] };

test('matching manifests and changelog pass', () => {
  assert.deepEqual(checkManifests({ name: 'cochl-design', version: '2.0.0' }, market, changelog), []);
});

test('bad version, missing entry, version in marketplace, missing heading are errors', () => {
  assert.equal(checkManifests({ name: 'cochl-design', version: 'v2' }, market, changelog).length, 2); // not semver + no heading
  assert.match(checkManifests({ name: 'other', version: '2.0.0' }, market, changelog)[0], /no plugins\[\] entry/);
  assert.match(checkManifests({ name: 'cochl-design', version: '2.0.0' }, { plugins: [{ name: 'cochl-design', version: '2.0.0' }] }, changelog)[0], /only in plugin.json/);
  assert.match(checkManifests({ name: 'cochl-design', version: '2.1.0' }, market, changelog)[0], /no "## 2.1.0" heading/);
});

test('changelogSection returns the body up to the next heading', () => {
  assert.equal(changelogSection(changelog, '2.0.0'), '- first');
  assert.equal(changelogSection(changelog, '1.0.0'), '- old');
  assert.equal(changelogSection(changelog, '3.0.0'), null);
});

test('shipped changes need a CHANGELOG line; docs-only changes do not', () => {
  assert.equal(checkChangedFiles(['skills/a/SKILL.md']).length, 1);
  assert.deepEqual(checkChangedFiles(['skills/a/SKILL.md', 'CHANGELOG.md']), []);
  assert.deepEqual(checkChangedFiles(['docs/x.md', 'design-sync/cli.mjs']), []);
});
