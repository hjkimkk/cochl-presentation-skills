#!/usr/bin/env node
// design-sync — CLI
//
//   analyze  <C>                     normalized DESIGN model (Figma snapshot)
//   code     <C>                     normalized CODE model (@cochlearai/ui)
//   compare  <C>                     diff + suggestions (+ mapping/freshness/accept)
//   suggest  <C>                     read-only fix suggestions
//   report   <C>                     re-print last report
//   fix      <C> [--dry-run|--yes]   confirm-gated apply (sandbox, tests, re-sync)
//   sync     [C...] [--max-age-hours N]   batch → sync-summary.json + dashboard.html
//   mapping  validate                validate the mapping table (before comparison)
//
// Components are DATA (config/mapping.json). Nothing here is component-specific.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadDesignModel } from "./adapters/figma/figmaAdapter.mjs";
import { loadCodeModel, resolvePackageDir } from "./adapters/code/codeAdapter.mjs";
import { runBatch, aggregate, exitCodeFor } from "./core/batch.mjs";
import { validateMappings } from "./core/mapping.mjs";
import { prepareWorkingCopy, applyEdit, renderEditPreview } from "./core/apply.mjs";
import { printHumanReport } from "./report/human.mjs";
import { buildDashboard } from "./report/dashboard.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "reports");
const WORK_DIR = join(HERE, ".work", "ui");
const MAPPING = JSON.parse(readFileSync(join(HERE, "config", "mapping.json"), "utf8"));
const reportPath = (c) => join(OUT_DIR, `sync-report.${c}.json`);
const ensureOut = () => { if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true }); };

// ---- arg parsing ----
const raw = process.argv.slice(2);
const cmd = raw[0];
const flags = { yes: false, dryRun: false, maxAgeHours: undefined };
const pos = [];
for (let i = 1; i < raw.length; i++) {
  const a = raw[i];
  if (a === "--max-age-hours") flags.maxAgeHours = parseFloat(raw[++i]);
  else if (a.startsWith("--max-age-hours=")) flags.maxAgeHours = parseFloat(a.split("=")[1]);
  else if (a === "--yes" || a === "--confirm") flags.yes = true;
  else if (a === "--dry-run") flags.dryRun = true;
  else if (!a.startsWith("-")) pos.push(a);
}
const batchOpts = flags.maxAgeHours !== undefined ? { maxAgeHours: flags.maxAgeHours } : {};

const fmt = (v) => (v == null ? "[NEEDS INPUT]" : Array.isArray(v) ? `[${v.join(", ")}]` : String(v));
const summaryLine = (s) => `${s.matches} match · ${s.mismatches} mismatch · ${s.missing} missing · ${s.unmatched} unmatched · ${s.needsInput} needs-input${s.accepted ? " · " + s.accepted + " accepted" : ""}`;

function printSuggestions(report) {
  const sug = report.differences.filter((d) => d.status !== "MATCH");
  const L = ["", "  SUGGESTED FIXES", "  " + "─".repeat(74)];
  if (!sug.length) L.push("  (nothing to suggest — all in sync)");
  for (const d of sug) {
    const tag = d.status === "ACCEPTED_DRIFT" ? "ACCEPTED" : d.fixable ? "AUTO-FIX" : "MANUAL";
    L.push(`  [${tag}] ${d.label}  (${d.status}, class: ${d.driftClass})`);
    L.push(`     current code : ${fmt(d.codeValue)}`);
    L.push(`     verified figma: ${fmt(d.designValue)}`);
    if (d.status === "ACCEPTED_DRIFT" && d.acceptance) L.push(`     accepted     : ${d.acceptance.acceptedBy} — ${d.acceptance.reason}`);
    else L.push(`     recommend    : ${d.suggestedFix || d.suggestedAction || "—"}`);
    L.push(`     source       : design ${d.designSource || "—"} | code ${d.codeSource || "—"}`);
    if (d.fixEdit) L.push(`     patch        : ${d.fixEdit.file}  "${d.fixEdit.find}" → "${d.fixEdit.replace}"`);
  }
  L.push("  " + "─".repeat(74));
  L.push(`  ${report.fixSummary.fixable} auto-fixable · ${report.fixSummary.manual} manual · ${report.summary.accepted || 0} accepted`);
  return L.join("\n");
}

function dumpModel(m) {
  console.log(`\n  ${m.side.toUpperCase()} model — ${m.component}  (${m.ref})`);
  console.log("  " + "─".repeat(74));
  for (const f of m.fields) {
    const v = f.value === null ? "[NEEDS INPUT]" : Array.isArray(f.value) ? `[${f.value.join(", ")}]` : String(f.value);
    console.log(`  ${f.key.padEnd(26)} ${v}`);
    console.log(`  ${"".padEnd(26)} └ ${f.source.ref}${f.source.detail ? "  (" + f.source.detail + ")" : ""}`);
  }
  console.log("");
}

async function oneReport(component, extra = {}) {
  const { reports } = await runBatch(MAPPING, { only: [component], ...batchOpts, ...extra });
  return reports[0];
}

async function main() {
  const component = pos[0] && cmd !== "mapping" ? pos[0] : "Button";

  if (!cmd || ["-h", "--help", "help"].includes(cmd)) {
    console.log("Usage: design-sync <analyze|code|compare|suggest|report|fix|sync|mapping> [Component] [--dry-run|--yes|--max-age-hours N]");
    console.log("Components:", Object.keys(MAPPING.components).join(", "));
    return;
  }

  if (cmd === "analyze") { dumpModel(loadDesignModel(component)); return; }
  if (cmd === "code") { dumpModel(await loadCodeModel(component, MAPPING.components[component].code)); return; }

  if (cmd === "mapping" && pos[0] === "validate") {
    let pkgDir = null; try { pkgDir = resolvePackageDir(); } catch { /* validate refs skipped */ }
    const { issues, byKind, hasBlocking } = validateMappings(MAPPING, pkgDir);
    console.log("\n  design-sync mapping validate");
    console.log("  " + "─".repeat(70));
    if (!issues.length) console.log("  ✓ no mapping issues.");
    const order = { error: 0, warning: 1, info: 2 };
    for (const i of [...issues].sort((a, b) => order[a.severity] - order[b.severity])) {
      const mark = i.severity === "error" ? "✗" : i.severity === "warning" ? "!" : "·";
      console.log(`  ${mark} [${i.kind}] ${i.component}: ${i.message}`);
    }
    console.log("  " + "─".repeat(70));
    console.log("  " + Object.entries(byKind).map(([k, n]) => `${n} ${k}`).join(" · "));
    process.exitCode = hasBlocking ? 2 : 0;
    console.log(`  exit ${process.exitCode} (0=ok · 2=blocking mapping problem)\n`);
    return;
  }

  if (cmd === "compare" || cmd === "suggest") {
    const report = await oneReport(component);
    if (report.status === "CONFIG_ERROR") { console.error("config error:", report.error); process.exitCode = 2; return; }
    ensureOut(); writeFileSync(reportPath(component), JSON.stringify(report, null, 2));
    if (cmd === "compare") console.log(printHumanReport(report));
    console.log(printSuggestions(report));
    if (cmd === "compare") console.log(`\n  → wrote ${join("reports", `sync-report.${component}.json`)}`);
    process.exitCode = exitCodeFor(aggregate([report], report.freshness?.maxAgeHours ?? 168));
    return;
  }

  if (cmd === "report") {
    const p = reportPath(component);
    if (!existsSync(p)) throw new Error(`No report yet for ${component}. Run: design-sync compare ${component}`);
    const rep = JSON.parse(readFileSync(p, "utf8"));
    console.log(printHumanReport(rep));
    console.log(printSuggestions(rep));
    return;
  }

  if (cmd === "sync") {
    const only = pos.length ? pos : undefined;
    const { reports, summary } = await runBatch(MAPPING, { only, ...batchOpts });
    ensureOut();
    for (const r of reports) if (r.status !== "CONFIG_ERROR") writeFileSync(reportPath(r.component), JSON.stringify(r, null, 2));
    writeFileSync(join(OUT_DIR, "sync-summary.json"), JSON.stringify(summary, null, 2));
    writeFileSync(join(OUT_DIR, "dashboard.html"), buildDashboard(summary, reports));

    console.log("\n  Design–Code Sync");
    console.log(`  ${summary.componentsChecked} components · ${summary.codePackage}@${summary.codeVersion || "?"} · overall ${summary.overallStatus} · snapshot max-age ${summary.maxAgeHours}h`);
    if (summary.staleSnapshots > 0) console.log(`  ⚠ WARNING: ${summary.staleSnapshots} stale snapshot(s) — comparisons may not reflect the current design.`);
    console.log("");
    const pad = (s, n) => String(s).padEnd(n), padl = (s, n) => String(s).padStart(n);
    console.log("  " + pad("Component", 11) + pad("Code", 13) + pad("Status", 13) + pad("Fresh", 8) + padl("Mism", 5) + padl("Miss", 5) + padl("Unm", 4) + padl("NI", 4) + padl("Acc", 4) + padl("Fix", 4));
    console.log("  " + "─".repeat(74));
    for (const r of reports) {
      if (r.status === "CONFIG_ERROR") { console.log("  " + pad(r.component, 11) + pad("—", 13) + pad(r.status, 13) + "  " + r.error); continue; }
      const s = r.summary;
      console.log("  " + pad(r.component, 11) + pad((r.codeName || "").slice(0, 12), 13) + pad(r.status, 13) + pad(r.freshness?.state || "?", 8) +
        padl(s.mismatches, 5) + padl(s.missing, 5) + padl(s.unmatched, 4) + padl(s.needsInput, 4) + padl(s.accepted || 0, 4) + padl(r.fixSummary.fixable, 4));
    }
    console.log("  " + "─".repeat(74));
    const t = summary.totals;
    console.log(`  totals: ${t.matches} match · ${t.mismatches} mismatch · ${t.missing} missing · ${t.unmatched} unmatched · ${t.needsInput} needs-input · ${t.accepted} accepted`);
    console.log(`  drift classes: ${summary.taxonomy["token-drift"]} token · ${summary.taxonomy["value-drift"]} value · ${summary.taxonomy["structural-drift"]} structural · ${summary.taxonomy.unmatched} unmatched · ${summary.taxonomy["missing-info"]} missing-info · ${summary.taxonomy["accepted-drift"]} accepted`);
    console.log(`  statuses: ${Object.entries(summary.byStatus).map(([k, n]) => `${n} ${k}`).join(" · ")}`);
    console.log(`\n  → ${join("reports", "sync-summary.json")} · ${join("reports", "dashboard.html")}`);
    process.exitCode = exitCodeFor(summary);
    console.log(`  exit ${process.exitCode} (0=clean · 1=drift · 2=config/mapping-error · 3=needs-input/pending)\n`);
    return;
  }

  if (cmd === "fix") {
    const before = await oneReport(component);
    if (before.status === "CONFIG_ERROR") { console.error("config error:", before.error); process.exitCode = 2; return; }
    // Fixable edits (classify already excludes accepted drift + NEEDS_INPUT).
    const edits = before.differences.filter((d) => d.fixable && d.fixEdit).map((d) => d.fixEdit);
    const srcPkgDir = resolvePackageDir();

    console.log("\n  BEFORE");
    console.log("  " + summaryLine(before.summary));

    if (edits.length === 0) {
      console.log("\n  No auto-fixable drift. Items requiring manual/other handling:");
      for (const d of before.differences.filter((x) => x.status !== "MATCH")) {
        console.log(`   • [${d.status}] ${d.label} — ${d.status === "ACCEPTED_DRIFT" ? "accepted (auditable)" : (d.suggestedFix || d.suggestedAction || "manual")}`);
      }
      console.log("");
      return;
    }

    console.log("\n  PROPOSED FIX");
    const preview = edits.map((e) => applyEdit(e, { srcPkgDir, workDir: srcPkgDir, write: false }));
    console.log(renderEditPreview(preview));

    if (!flags.yes) {
      console.log("\n  DRY RUN — no files changed.");
      console.log(`  Re-run with --yes to apply to a sandbox working copy (never the installed package):\n      node cli.mjs fix ${component} --yes\n`);
      return;
    }

    console.log("\n  APPLYING (sandbox working copy — installed package untouched)…");
    prepareWorkingCopy(srcPkgDir, WORK_DIR);
    const applied = edits.map((e) => applyEdit(e, { srcPkgDir, workDir: WORK_DIR, write: true }));
    console.log(renderEditPreview(applied));

    let testsOk = true;
    try { execSync("node test/diff.test.mjs && node test/fix.test.mjs && node test/mapping.test.mjs", { cwd: HERE, stdio: "pipe" }); } catch { testsOk = false; }
    console.log(`\n  TESTS: ${testsOk ? "PASS" : "FAIL"}`);

    const after = await oneReport(component, { codeDirOverride: WORK_DIR });
    ensureOut(); writeFileSync(reportPath(component), JSON.stringify(after, null, 2));
    console.log("\n  AFTER");
    console.log("  " + summaryLine(after.summary));
    console.log("\n  BEFORE→AFTER");
    console.log("   before: " + summaryLine(before.summary));
    console.log("   after:  " + summaryLine(after.summary));
    console.log(`\n  ✓ Resolved ${before.summary.mismatches - after.summary.mismatches} mismatch(es). Working copy: ${WORK_DIR.replace(HERE + "/", "")}`);
    console.log("  (In production this edit targets the real source repo; here it stays in the sandbox copy.)\n");
    return;
  }

  throw new Error(`Unknown command "${cmd}".`);
}

main().catch((e) => { console.error("design-sync error:", e.message); process.exitCode = 1; });
