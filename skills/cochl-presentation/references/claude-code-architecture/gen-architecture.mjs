#!/usr/bin/env node
// Cochl "Claude Code architecture" page — the third deliverable next to the deck's PPTX and HTML.
// One 1920×1080 plex page that shows how this build ran inside Claude Code: install layer,
// request → router → skill → spec + brand → build tools → outputs, and the QA that ran.
//   node gen-architecture.mjs <build.json> <out.html>
// build.json fields are documented in ../claude-code-architecture.md. Colors and fonts come only
// from the plex :root block, read from themes/plex.md at build time (never restated here).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILLS = join(HERE, '../../..');                 // plugin's skills/
const PLUGIN_ROOT = join(SKILLS, '..');
const PLEX = join(SKILLS, 'cochl-design/core/themes/plex.md');
const LOGO = join(HERE, '../assets/cochl-logo-white.png');

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Any value the build did not record renders as the canonical marker (brand-core §1b).
// File paths may wrap only after a slash.
const path = (p) => esc(p).replace(/\//g, '/<wbr>');
const val = (v) => (v === undefined || v === null || v === '')
  ? '<span class="needs-input">[NEEDS INPUT]</span>' : esc(v);

function plexTheme() {
  const md = readFileSync(PLEX, 'utf8');
  const root = md.match(/```css\n(:root \{[\s\S]*?\n\})\n```/);
  const link = md.match(/```html\n(<link href="https:\/\/fonts\.googleapis\.com[^\n]*>)\n```/);
  if (!root || !link) throw new Error(`could not read the :root block or font link from ${PLEX}`);
  return { root: root[1], link: link[1] };
}

function pluginInfo(b) {
  let manifest = {};
  try { manifest = JSON.parse(readFileSync(join(PLUGIN_ROOT, '.claude-plugin/plugin.json'), 'utf8')); } catch {}
  return {
    name: b.plugin?.name ?? manifest.name,
    version: b.plugin?.version ?? manifest.version,
    marketplace: b.plugin?.marketplace ?? 'cochl',
  };
}

const list = (items) => items.length
  ? `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';

function stage(n, label, value, details = []) {
  return `<div class="stage"><div class="idx">${String(n).padStart(2, '0')} · ${esc(label)}</div>`
    + `<div class="value">${value}</div>${list(details)}</div>`;
}

const ARROW = '<svg class="arrow" viewBox="0 0 32 16" aria-hidden="true"><path d="M0 8h28M22 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

const OUTPUT_KINDS = [
  ['pptx', 'PPTX', '1920×1080 PNG per slide on 16:9 (deck-engine)'],
  ['html', 'HTML', 'Self-contained interactive deck, page-nav'],
  ['architecture', 'Claude Code architecture', 'This page — how the build ran'],
];

export function render(b) {
  const { root, link } = plexTheme();
  const plugin = pluginInfo(b);
  const logo = readFileSync(LOGO).toString('base64');
  const route = b.route ?? {};
  const routerUsed = b.entry === '/cochl-design';

  const stages = [
    stage(1, 'Request', `<code>${val(b.entry)}</code>`, [esc(b.request ?? '')].filter(Boolean)),
    stage(2, 'Router', routerUsed ? '<code>cochl-design</code>' : '<span class="muted">skipped — direct call</span>',
      routerUsed ? [`<code>${path('skills/cochl-design/SKILL.md')}</code>`, 'Routing table → cochl-presentation'] : ['Skill called by name']),
    stage(3, 'Skill', '<code>cochl-presentation</code>',
      ['<code>SKILL.md</code> → routing procedure', `<code>${path('references/registry.md')}</code> → ${val(route.row)}`]),
    stage(4, 'Spec + brand', route.spec ? `<code>${path(route.spec)}</code>` : val(),
      [`Theme <code>${val(route.theme)}</code>`, ...(b.reads ?? []).map((r) => `<code>${path(r)}</code>`)]),
    stage(5, 'Build', `${(b.tools ?? []).length} tool${(b.tools ?? []).length === 1 ? '' : 's'}`,
      (b.tools ?? []).map((t) => `<b>${esc(t.name)}</b> ${esc(t.use)}`)),
  ];

  const outputs = OUTPUT_KINDS.map(([key, label, desc]) => {
    const o = b.outputs?.[key];
    const file = typeof o === 'string' ? o : o?.path;
    const note = typeof o === 'object' ? o?.note : undefined;
    return `<div class="out${key === 'architecture' ? ' self' : ''}"><div class="idx">${esc(label)}</div>`
      + `<div class="value">${file ? `<code>${path(file)}</code>` : val()}</div><div class="desc">${esc(note ?? desc)}</div></div>`;
  }).join('');

  const qa = b.qa ?? {};
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=1920">
<title>${esc(b.deckTitle)} — Claude Code Architecture</title>
${link}
<style>
${root}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:var(--bg);color:var(--text);font-family:var(--font-sans)}
.page{position:relative;width:1920px;height:1080px;padding:72px 112px 0}
.glow{position:absolute;width:1100px;height:1100px;right:-380px;top:-520px;background:var(--glow);pointer-events:none}
.kicker,.idx,.band h3{font-family:var(--font-mono);font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
h1{font-size:68px;font-weight:600;line-height:1.1;margin:18px 0 14px}
.grad-text{background:var(--grad-brand);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{font-size:24px;color:var(--text-soft)}
.sub code{color:var(--text)}
code{font-family:var(--font-mono);font-size:.92em}
.flow{display:grid;grid-template-columns:repeat(5,1fr) 32px 360px;column-gap:32px;align-items:stretch;margin-top:44px}
.flow>.stage{position:relative}
.flow>.stage+.stage::before{content:"";position:absolute;left:-32px;top:50%;width:32px;height:1px;background:var(--muted)}
.stage,.out,.band{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:24px 22px}
.stage .value,.out .value{font-size:24px;font-weight:600;margin:12px 0 12px}
.stage ul{list-style:none;font-size:17px;line-height:1.45;color:var(--text-soft)}
.stage li+li{margin-top:6px}
.stage li code{color:var(--text-soft)}
.stage b{color:var(--text);font-weight:600}
.muted{color:var(--muted);font-weight:400}
.arrow{width:32px;height:16px;color:var(--muted);align-self:center}
.outs{display:flex;flex-direction:column;gap:16px;justify-content:space-between}
.out{padding:20px 22px;flex:1}
.out .value{font-size:18px;margin:10px 0 8px}
.out .desc{font-size:15px;color:var(--muted)}
.out.self{border-color:var(--accent)}
.bands{display:grid;grid-template-columns:1.6fr 1fr;gap:24px;margin-top:32px}
.band h3{margin-bottom:14px}
.chain{display:flex;align-items:center;gap:12px;font-size:17px}
.chain code{background:var(--panel-2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;white-space:nowrap}
.chain .arrow{width:24px}
.band p{font-size:17px;color:var(--muted);margin-top:12px;line-height:1.45}
.qa{display:flex;gap:40px;align-items:flex-end}
.qa .n{font-size:48px;font-weight:700;line-height:1}
.qa .l{font-family:var(--font-mono);font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:8px}
.needs-input{color:var(--accent);border-bottom:1px dashed var(--accent);font-style:italic}
footer{position:absolute;left:112px;right:112px;bottom:36px;display:flex;justify-content:space-between;align-items:center}
footer img{height:28px;width:auto;opacity:.7}
footer span{font-family:var(--font-mono);font-size:14px;letter-spacing:.08em;color:var(--muted)}
</style></head>
<body><div class="page">
<div class="glow"></div>
<div class="kicker">Claude Code architecture</div>
<h1>How this deck was <span class="grad-text">built in Claude Code</span></h1>
<p class="sub">${esc(b.deckTitle)} · <code>${esc(b.slug)}</code> · ${val(b.date)} · plugin <code>${val(plugin.name)}@${esc(plugin.marketplace)}</code> v${val(plugin.version)}</p>

<div class="flow">${stages.join('')}${ARROW}<div class="outs">${outputs}</div></div>

<div class="bands">
 <div class="band"><h3>Install layer</h3>
  <div class="chain"><code>marketplace ${esc(plugin.marketplace)}</code>${ARROW}<code>plugin ${val(plugin.name)} v${val(plugin.version)}</code>${ARROW}<code>skills/*/SKILL.md</code>${ARROW}<code>/cochl-presentation</code></div>
  <p>Claude Code reads the plugin manifest, discovers each skill folder, and loads a SKILL.md only when its command or description matches the request; references load on demand.</p>
 </div>
 <div class="band"><h3>QA run</h3>
  <div class="qa">
   <div><div class="n">${val(qa.slides)}</div><div class="l">Slides</div></div>
   <div><div class="n">${val(qa.needsInput)}</div><div class="l">[NEEDS INPUT] left</div></div>
   <div><div class="n">${(qa.checklists ?? []).length}</div><div class="l">Checklists</div></div>
  </div>
  <p>${(qa.checklists ?? []).map((c) => `<code>${esc(c)}</code>`).join(' · ')}</p>
 </div>
</div>

<footer><img src="data:image/png;base64,${logo}" alt="cochl"><span>${esc(b.deckTitle)}</span></footer>
</div></body></html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [input, out] = process.argv.slice(2);
  if (!input || !out) { console.error('usage: node gen-architecture.mjs <build.json> <out.html>'); process.exit(1); }
  writeFileSync(out, render(JSON.parse(readFileSync(input, 'utf8'))));
  console.log(out);
}
