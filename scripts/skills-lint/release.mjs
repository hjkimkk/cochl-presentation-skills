// Plugin release check: manifests agree, version is semver and has a CHANGELOG
// heading, and a PR that changes the plugin also touches CHANGELOG.md.
//   node scripts/skills-lint/release.mjs [--base <ref>]   (exit 1 on errors)
//   node scripts/skills-lint/release.mjs --notes <version> (prints that CHANGELOG section)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
// Paths that ship in the plugin; changing them needs a CHANGELOG line.
const SHIPPED = /^(skills\/|\.claude-plugin\/)/;

export function checkManifests(plugin, marketplace, changelog) {
  const errors = [];
  if (!plugin.name) errors.push('plugin.json: missing name');
  if (!SEMVER.test(plugin.version ?? '')) errors.push(`plugin.json: version "${plugin.version}" is not semver`);
  const entry = (marketplace.plugins ?? []).find((p) => p.name === plugin.name);
  if (!entry) errors.push(`marketplace.json: no plugins[] entry named "${plugin.name}"`);
  else if (entry.version) errors.push('marketplace.json: set version only in plugin.json, not in the marketplace entry');
  if (plugin.version && !changelogSection(changelog, plugin.version))
    errors.push(`CHANGELOG.md: no "## ${plugin.version}" heading for the plugin.json version`);
  return errors;
}

export function changelogSection(changelog, version) {
  const lines = changelog.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## ${version}`));
  if (start === -1) return null;
  const end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n').trim();
}

export function checkChangedFiles(changed) {
  const shipped = changed.some((f) => SHIPPED.test(f));
  return shipped && !changed.includes('CHANGELOG.md')
    ? ['CHANGELOG.md: this PR changes the plugin (skills/ or .claude-plugin/); add a line under "## Unreleased"']
    : [];
}

function main(argv) {
  const root = process.cwd();
  const read = (p) => readFileSync(join(root, p), 'utf8');
  const changelog = read('CHANGELOG.md');
  const notesIdx = argv.indexOf('--notes');
  if (notesIdx !== -1) {
    const section = changelogSection(changelog, argv[notesIdx + 1]);
    if (section === null) { console.error(`no CHANGELOG section for ${argv[notesIdx + 1]}`); return 1; }
    console.log(section);
    return 0;
  }
  const errors = checkManifests(JSON.parse(read('.claude-plugin/plugin.json')), JSON.parse(read('.claude-plugin/marketplace.json')), changelog);
  const baseIdx = argv.indexOf('--base');
  if (baseIdx !== -1) {
    const diff = execFileSync('git', ['diff', '--name-only', `${argv[baseIdx + 1]}...HEAD`], { encoding: 'utf8' });
    errors.push(...checkChangedFiles(diff.split('\n').filter(Boolean)));
  }
  errors.forEach((e) => console.error(`✗ ${e}`));
  console.log(errors.length ? `${errors.length} error(s)` : '✓ release check passed');
  return errors.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
