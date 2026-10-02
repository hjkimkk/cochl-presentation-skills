// Batch runner (Phase 10 + 11/12). Runs the UNCHANGED per-component pipeline across
// every configured component, applies mapping resolution + freshness + drift
// acceptance (all additive), writes each detailed report, and aggregates one summary.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadDesignModel } from "../adapters/figma/figmaAdapter.mjs";
import { loadCodeModel, resolvePackageDir } from "../adapters/code/codeAdapter.mjs";
import { diff } from "./diff.mjs";
import { buildSuggestions } from "./fix.mjs";
import { buildJsonReport } from "../report/json.mjs";
import { classifyReport, COMPONENT_STATUS } from "./classify.mjs";
import { resolveMapping } from "./mapping.mjs";
import { computeFreshness } from "./freshness.mjs";
import { loadAccepted } from "./accept.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CFG_DIR = join(HERE, "..", "config");

function readConfig() {
  try { return JSON.parse(readFileSync(join(CFG_DIR, "sync-config.json"), "utf8")); }
  catch { return { snapshot: { maxAgeHours: 168 } }; }
}

async function runComponent(name, cfg, ctx) {
  const mapping = resolveMapping(cfg.figma?.name || name, cfg);
  const prev = process.env.COCHL_UI_DIR;
  if (ctx.codeDirOverride) process.env.COCHL_UI_DIR = ctx.codeDirOverride;
  try {
    let design, code;
    try { design = loadDesignModel(name); }
    catch (e) { return { component: name, status: COMPONENT_STATUS.CONFIG_ERROR, error: `design: ${e.message}`, mapping }; }
    try { code = await loadCodeModel(name, cfg.code); }
    catch (e) { return { component: name, status: COMPONENT_STATUS.CONFIG_ERROR, error: `code: ${e.message}`, mapping }; }

    const result = diff(cfg, design, code);
    const suggestions = buildSuggestions(result, design, code);
    const report = buildJsonReport(name, design, code, result);
    report.suggestions = suggestions.suggestions;

    // Snapshot lifecycle + freshness.
    const snap = design.meta || {};
    const capturedAt = snap.capturedAt || snap?.snapshotMeta?.capturedAt || (design.meta && design.meta.capturedAt) || null;
    report.snapshot = {
      capturedAt: design.meta?.capturedAt || null,
      figmaFileId: design.meta?.figmaFileId || null,
      figmaNodeId: design.meta?.figmaNodeId || null,
      captureMethod: design.meta?.captureMethod || design.meta?.capturedVia || null,
      captureStatus: design.meta?.captureStatus || null,
      sourceRevision: design.meta?.sourceRevision ?? null,
    };
    report.freshness = computeFreshness(report.snapshot.capturedAt, ctx.maxAgeHours, ctx.now);

    return classifyReport(report, { mapping, accepted: ctx.accepted, now: ctx.now });
  } finally {
    if (ctx.codeDirOverride) { if (prev === undefined) delete process.env.COCHL_UI_DIR; else process.env.COCHL_UI_DIR = prev; }
  }
}

/**
 * @param {object} mapping parsed mapping.json
 * @param {object} [opts]  { only?, codeDirOverride?, maxAgeHours?, now? }
 */
export async function runBatch(mapping, opts = {}) {
  const cfg = readConfig();
  const ctx = {
    codeDirOverride: opts.codeDirOverride,
    maxAgeHours: opts.maxAgeHours ?? cfg.snapshot?.maxAgeHours ?? 168,
    now: opts.now ?? Date.now(),
    accepted: loadAccepted(join(CFG_DIR, "accepted-drift.json")),
  };
  const names = opts.only?.length ? opts.only : Object.keys(mapping.components);
  const reports = [];
  for (const name of names) {
    const c = mapping.components[name];
    if (!c) { reports.push({ component: name, status: COMPONENT_STATUS.CONFIG_ERROR, error: "no mapping entry" }); continue; }
    reports.push(await runComponent(name, c, ctx));
  }
  return { reports, summary: aggregate(reports, ctx.maxAgeHours) };
}

export function aggregate(reports, maxAgeHours) {
  const totals = { matches: 0, mismatches: 0, missing: 0, unmatched: 0, needsInput: 0, accepted: 0, fixable: 0, manual: 0 };
  const taxonomy = { match: 0, "token-drift": 0, "value-drift": 0, "structural-drift": 0, unmatched: 0, "missing-info": 0, "accepted-drift": 0 };
  const byStatus = {}, byFreshness = {};
  let codeVersion = null;
  const components = [];

  for (const r of reports) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    if (r.status === COMPONENT_STATUS.CONFIG_ERROR) { components.push({ component: r.component, status: r.status, error: r.error }); continue; }
    codeVersion = codeVersion || r.codeVersion;
    for (const k of Object.keys(totals)) if (k in r.summary) totals[k] += r.summary[k];
    totals.fixable += r.fixSummary.fixable; totals.manual += r.fixSummary.manual;
    for (const k of Object.keys(taxonomy)) taxonomy[k] += r.taxonomy[k] || 0;
    const fr = r.freshness?.state || "UNKNOWN"; byFreshness[fr] = (byFreshness[fr] || 0) + 1;
    components.push({
      component: r.component, codeName: r.codeName, status: r.status,
      mappingType: r.mapping?.effectiveStatus || null, freshness: fr,
      summary: r.summary, fixSummary: r.fixSummary, taxonomy: r.taxonomy,
      mappingResolved: r.mapping?.resolved || null, accepted: r.summary.accepted || 0,
    });
  }

  const hasConfigError = reports.some((r) => r.status === COMPONENT_STATUS.CONFIG_ERROR);
  const hasAmbiguous = (byStatus.AMBIGUOUS || 0) > 0;
  const hasDrift = totals.mismatches > 0 || totals.missing > 0 || totals.unmatched > 0;
  const hasNeedsInput = totals.needsInput > 0 || (byStatus.ONE_TO_MANY || 0) > 0;
  const overall = hasConfigError || hasAmbiguous ? "MAPPING_ERROR"
    : hasDrift ? "DRIFT" : hasNeedsInput ? "NEEDS_INPUT" : "SYNC";

  return {
    generatedAt: new Date().toISOString(),
    codePackage: "@cochlearai/ui", codeVersion,
    maxAgeHours,
    componentsChecked: reports.length,
    overallStatus: overall,
    byStatus, byFreshness,
    totals, taxonomy,
    staleSnapshots: byFreshness.STALE || 0,
    components,
  };
}

/**
 * Exit codes (documented):
 *   0 = no unresolved drift (all SYNC, no needs-input/one-to-many pending)
 *   1 = verified drift exists (mismatch / missing / unmatched)
 *   2 = configuration / mapping error (config error, or AMBIGUOUS mapping)
 *   3 = missing required input (NEEDS_INPUT, or ONE_TO_MANY pending per-target capture)
 */
export function exitCodeFor(summary) {
  if ((summary.byStatus.CONFIG_ERROR || 0) > 0 || (summary.byStatus.AMBIGUOUS || 0) > 0) return 2;
  if (summary.totals.mismatches > 0 || summary.totals.missing > 0 || summary.totals.unmatched > 0) return 1;
  if (summary.totals.needsInput > 0 || (summary.byStatus.ONE_TO_MANY || 0) > 0) return 3;
  return 0;
}
