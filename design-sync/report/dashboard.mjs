// Dashboard generator (Phase 10 + 11/12). ADDITIVE: consumes the classified
// per-component reports + aggregate summary and emits a self-contained static HTML
// file. It runs no comparisons and modifies no code — the fix workflow is shown as
// steps + the exact CLI command (the safety gate stays in the CLI).

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function buildDashboard(summary, reports) {
  const data = JSON.stringify({ summary, reports }).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Design–Code Sync</title>
<style>
  :root{color-scheme:dark;--bg:#06101E;--card:#0F2847;--line:rgba(255,255,255,.09);--text:#fff;--muted:#8B9BB4;--grad:linear-gradient(135deg,#6B4EFF,#2F80ED)}
  *{box-sizing:border-box}
  body{background:var(--bg);color:var(--text);font-family:'IBM Plex Sans',system-ui,sans-serif;padding-block:32px;padding-inline:clamp(16px,4vw,32px);max-width:1220px;margin:0 auto}
  .tw{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:14px}
  h1{font-size:30px;letter-spacing:-.02em;margin:0 0 4px}
  .sub{color:var(--muted);font-size:14px;margin-bottom:16px}
  .warn{background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.4);color:#ffd082;padding:10px 14px;border-radius:10px;margin-bottom:18px;font-size:13px}
  .kpis{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:22px}
  .kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 18px;min-width:104px}
  .kpi .n{font-size:26px;font-weight:700}
  .kpi .l{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
  th,td{padding:11px 14px;text-align:left;border-bottom:1px solid var(--line);font-size:14px}
  th{color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  tbody tr{cursor:pointer}
  tbody tr:hover{background:rgba(255,255,255,.03)}
  .pill{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
  .SYNC{background:rgba(16,185,129,.15);color:#10B981}
  .DRIFT{background:rgba(235,87,87,.15);color:#EB5757}
  .NEEDS_INPUT{background:rgba(245,158,11,.15);color:#F59E0B}
  .UNMATCHED{background:rgba(107,78,255,.18);color:#B9A9FF}
  .ONE_TO_MANY{background:rgba(47,128,237,.16);color:#7db0ff}
  .AMBIGUOUS{background:rgba(245,158,11,.2);color:#ffcf87}
  .CONFIG_ERROR{background:rgba(235,87,87,.25);color:#ffb4b4}
  .fr{font-size:11px;padding:1px 7px;border-radius:6px}
  .fr-FRESH{background:rgba(16,185,129,.14);color:#7fe3c0}.fr-STALE{background:rgba(235,87,87,.16);color:#ff9d9d}.fr-UNKNOWN{background:rgba(139,155,180,.16);color:#c4d0e0}
  .num{font-variant-numeric:tabular-nums}
  .legend{display:flex;gap:14px;flex-wrap:wrap;margin:14px 2px 24px;color:var(--muted);font-size:12px}
  .dot{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px;vertical-align:middle}
  #detail{margin-top:26px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;margin-bottom:16px}
  .drow{display:flex;gap:22px;flex-wrap:wrap;margin:6px 0 14px}
  .drow div span{color:var(--muted);font-size:12px;display:block}
  .drow div b{font-size:20px}
  code{background:rgba(255,255,255,.06);padding:1px 6px;border-radius:6px;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:12px}
  .src{color:var(--muted);font-size:11px;font-family:'IBM Plex Mono',ui-monospace,monospace;word-break:break-all}
  .dc{font-size:11px;padding:1px 7px;border-radius:6px;white-space:nowrap}
  .dc-token-drift{background:rgba(47,128,237,.16);color:#7db0ff}
  .dc-value-drift{background:rgba(235,87,87,.14);color:#ff9d9d}
  .dc-structural-drift{background:rgba(245,158,11,.14);color:#ffd082}
  .dc-unmatched{background:rgba(107,78,255,.16);color:#b9a9ff}
  .dc-missing-info{background:rgba(139,155,180,.16);color:#c4d0e0}
  .dc-accepted-drift{background:rgba(16,185,129,.1);color:#8fd0b6}
  .dc-match{background:rgba(16,185,129,.14);color:#7fe3c0}
  .yes{color:#10B981;font-weight:600}.no{color:var(--muted)}
  .note{margin-top:8px;color:var(--muted);font-size:13px;line-height:1.6}
  .note code{color:#cfe0ff}
  .hint{color:var(--muted);font-size:12px;margin:10px 2px 0}
</style></head><body>
<h1>Design–Code Sync</h1>
<div class="sub" id="sub"></div>
<div id="warn"></div>
<div class="kpis" id="kpis"></div>
<div class="legend">
  <span><b style="color:#fff">Drift classes:</b></span>
  <span><i class="dot" style="background:#7db0ff"></i>token-drift <b style="color:#fff">(auto-fixable)</b></span>
  <span><i class="dot" style="background:#ff9d9d"></i>value-drift</span>
  <span><i class="dot" style="background:#ffd082"></i>structural-drift</span>
  <span><i class="dot" style="background:#b9a9ff"></i>unmatched</span>
  <span><i class="dot" style="background:#c4d0e0"></i>missing-info</span>
  <span><i class="dot" style="background:#8fd0b6"></i>accepted-drift</span>
</div>
<div class="tw"><table><thead><tr><th>Component</th><th>Code</th><th>Mapping / Status</th><th>Fresh</th><th class="num">Mism</th><th class="num">Miss</th><th class="num">Unm</th><th class="num">NI</th><th class="num">Acc</th><th class="num">Fix</th></tr></thead>
<tbody id="rows"></tbody></table></div>
<div id="detail"></div>
<div class="hint">Dashboard is read-only. Apply a fixable drift safely with <code>node cli.mjs fix &lt;Component&gt; --dry-run</code> then <code>--yes</code> (sandbox copy · tests · re-sync). Production code is not connected.</div>
<script>
const DATA = ${data};
const S = DATA.summary, R = DATA.reports;
document.getElementById('sub').textContent =
  S.componentsChecked + ' components · ' + (S.codePackage||'') + '@' + (S.codeVersion||'?') + ' · overall ' + S.overallStatus + ' · snapshot max-age ' + S.maxAgeHours + 'h · ' + new Date(S.generatedAt).toLocaleString();
if (S.staleSnapshots > 0) document.getElementById('warn').innerHTML = '<div class="warn">⚠ ' + S.staleSnapshots + ' stale snapshot(s) — comparisons may not reflect the current design.</div>';
const kpi = (n,l)=>'<div class="kpi"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>';
document.getElementById('kpis').innerHTML =
  kpi(S.byStatus.SYNC||0,'in sync')+kpi(S.byStatus.DRIFT||0,'drift')+kpi(S.byStatus.ONE_TO_MANY||0,'1:many')+
  kpi(S.byStatus.AMBIGUOUS||0,'ambiguous')+kpi(S.totals.fixable,'auto-fixable')+kpi(S.totals.accepted,'accepted')+kpi(S.totals.manual,'manual');
const cell=(v)=> (v? '<b>'+v+'</b>' : '<span class="no">0</span>');
document.getElementById('rows').innerHTML = R.map((r,i)=>{
  if(r.status==='CONFIG_ERROR') return '<tr onclick="show('+i+')"><td>'+r.component+'</td><td class="no">—</td><td><span class="pill CONFIG_ERROR">CONFIG_ERROR</span></td><td colspan="7" class="src">'+ (r.error||'') +'</td></tr>';
  const s=r.summary,f=r.fixSummary, fr=(r.freshness&&r.freshness.state)||'UNKNOWN';
  return '<tr onclick="show('+i+')"><td><b>'+r.component+'</b></td><td class="no">'+(r.codeName||'')+'</td>'+
    '<td><span class="pill '+r.status+'">'+r.status+'</span></td>'+
    '<td><span class="fr fr-'+fr+'">'+fr+'</span></td>'+
    '<td class="num">'+cell(s.mismatches)+'</td><td class="num">'+cell(s.missing)+'</td><td class="num">'+cell(s.unmatched)+'</td>'+
    '<td class="num">'+cell(s.needsInput)+'</td><td class="num">'+(s.accepted?'<b class="dc-accepted-drift" style="padding:1px 6px;border-radius:6px">'+s.accepted+'</b>':'<span class="no">0</span>')+'</td>'+
    '<td class="num">'+(f.fixable?'<b class="yes">'+f.fixable+'</b>':'<span class="no">0</span>')+'</td></tr>';
}).join('');
function show(i){
  const r=R[i], d=document.getElementById('detail');
  if(r.status==='CONFIG_ERROR'){d.innerHTML='<div class="card"><h2>'+r.component+' — CONFIG_ERROR</h2><div class="src">'+esc(r.error)+'</div></div>';d.scrollIntoView({behavior:'smooth'});return;}
  const s=r.summary, m=r.mapping;
  let mapHtml='';
  if(m){
    mapHtml='<div class="note">🔗 mapping: <b>'+m.effectiveStatus+'</b>'+
      (m.figmaRole?' · figma role <code>'+esc(m.figmaRole)+'</code>':'')+
      (m.targets?' · code '+m.targets.map(t=>'<code>'+esc(t.component)+(t.role?' ('+esc(t.role)+')':'')+'</code>').join(' + '):'')+'</div>';
    if(m.resolved) mapHtml+='<div class="note">'+esc(m.resolved)+'</div>';
    if(m.reason && (m.effectiveStatus==='AMBIGUOUS'||m.effectiveStatus==='ONE_TO_MANY'||m.effectiveStatus==='UNMATCHED')) mapHtml+='<div class="note">⚠ '+esc(m.reason)+'</div>';
  }
  const snap=r.snapshot||{}, fr=r.freshness||{};
  const snapHtml='<div class="note">snapshot captured <code>'+(snap.capturedAt||'[unknown]')+'</code> · freshness <span class="fr fr-'+(fr.state||'UNKNOWN')+'">'+(fr.state||'UNKNOWN')+'</span>'+
    (fr.ageHours!=null?' ('+fr.ageHours+'h old, max '+fr.maxAgeHours+'h)':'')+' · package <code>@cochlearai/ui@'+(r.codeVersion||'?')+'</code></div>'+
    (fr.state==='STALE'?'<div class="warn">⚠ WARNING: Figma snapshot is stale.</div>':'');
  const rows = r.differences.map(x=>{
    const dc='<span class="dc dc-'+x.driftClass+'">'+x.driftClass+'</span>';
    const fx = x.status==='MATCH'?'':(x.status==='ACCEPTED_DRIFT'?'<span class="no">accepted</span>':(x.fixable?'<span class="yes">auto</span>':'<span class="no">manual</span>'));
    const fig = x.designValue==null?'<span class="no">[NEEDS INPUT]</span>':'<code>'+fmt(x.designValue)+'</code>';
    const cod = x.codeValue==null?'<span class="no">[NEEDS INPUT]</span>':'<code>'+fmt(x.codeValue)+'</code>';
    const sug = x.status==='ACCEPTED_DRIFT'&&x.acceptance ? '◈ accepted by '+esc(x.acceptance.acceptedBy)+' — '+esc(x.acceptance.reason)+(x.acceptance.reviewBy?' (review '+esc(x.acceptance.reviewBy)+')':'') : (x.suggestedFix?esc(x.suggestedFix):'<span class="no">—</span>');
    return '<tr><td><b>'+x.label+'</b><br><span class="src">'+x.category+(x.originalStatus&&x.originalStatus!==x.status?' · was '+x.originalStatus:'')+'</span></td><td>'+fig+'</td><td>'+cod+'</td>'+
      '<td><span class="pill '+badge(x.status)+'">'+x.status+'</span><br>'+dc+'</td>'+
      '<td class="src">design '+(x.designSource||'—')+'<br>code '+(x.codeSource||'—')+'</td>'+
      '<td>'+sug+'</td><td>'+fx+'</td></tr>';
  }).join('');
  const table = r.differences.length? '<div class="tw"><table><thead><tr><th>Property</th><th>Figma</th><th>Code</th><th>Status</th><th>Source (provenance)</th><th>Suggested fix</th><th>Fixable?</th></tr></thead><tbody>'+rows+'</tbody></table></div>' : '<div class="note">No per-property comparison for this mapping type (see mapping note above).</div>';
  d.innerHTML='<div class="card"><h2 style="margin:0 0 2px">'+r.component+' <span class="pill '+r.status+'">'+r.status+'</span></h2>'+mapHtml+snapHtml+
    '<div class="drow"><div><span>Matches</span><b class="yes">'+s.matches+'</b></div><div><span>Mismatches</span><b>'+s.mismatches+'</b></div>'+
    '<div><span>Missing</span><b>'+s.missing+'</b></div><div><span>Unmatched</span><b>'+s.unmatched+'</b></div><div><span>Needs Input</span><b>'+s.needsInput+'</b></div>'+
    '<div><span>Accepted</span><b>'+(s.accepted||0)+'</b></div><div><span>Auto-fixable</span><b class="yes">'+r.fixSummary.fixable+'</b></div></div>'+
    table+
    (r.fixSummary.fixable? '<div class="note">Apply the auto-fixable drift: <code>node cli.mjs fix '+r.component+' --dry-run</code> → review → <code>node cli.mjs fix '+r.component+' --yes</code>.</div>':'')+
    '</div>';
  d.scrollIntoView({behavior:'smooth'});
}
function fmt(v){return Array.isArray(v)?'['+v.join(', ')+']':String(v);}
function badge(st){return st==='MATCH'?'SYNC':st==='ACCEPTED_DRIFT'?'ONE_TO_MANY':st==='MISMATCH'?'DRIFT':st==='UNMATCHED'?'UNMATCHED':st==='NEEDS_INPUT'?'NEEDS_INPUT':'DRIFT';}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
if(R.length) show(0);
</script></body></html>`;
}

// Artifact-contract variant: content-only (no doctype/html/head/body), with the
// IBM Plex web fonts linked. For publishing to a shareable claude.ai URL.
export function buildDashboardArtifact(summary, reports) {
  const full = buildDashboard(summary, reports);
  const head = (full.match(/<head>([\s\S]*?)<\/head>/) || [, ""])[1];
  const body = (full.match(/<body>([\s\S]*?)<\/body>/) || [, ""])[1];
  const title = (head.match(/<title>[\s\S]*?<\/title>/) || [""])[0];
  const style = (head.match(/<style>[\s\S]*?<\/style>/) || [""])[0];
  const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">';
  return `${title}\n${fonts}\n${style}\n${body}`;
}
