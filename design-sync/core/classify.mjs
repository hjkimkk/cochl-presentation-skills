// Drift classification (additive). Consumes an existing per-component report
// (differences + suggestions from the UNCHANGED diff/fix engines) and annotates it
// with a drift taxonomy, applies scoped drift acceptance, and derives a component
// status that respects the composite mapping type. It NEVER re-runs comparisons.
//
// Drift classes:
//   match | token-drift | value-drift | structural-drift | unmatched | missing-info
//   accepted-drift  (a mismatch explicitly accepted — auditable, never auto-fixed)
//
// Component status: SYNC | DRIFT | UNMATCHED | NEEDS_INPUT | ONE_TO_MANY | AMBIGUOUS | CONFIG_ERROR

import { matchAcceptance } from "./accept.mjs";

export const DRIFT_CLASS = Object.freeze({
  MATCH: "match", TOKEN: "token-drift", VALUE: "value-drift", STRUCTURAL: "structural-drift",
  UNMATCHED: "unmatched", MISSING_INFO: "missing-info", ACCEPTED: "accepted-drift",
});

export const COMPONENT_STATUS = Object.freeze({
  SYNC: "SYNC", DRIFT: "DRIFT", UNMATCHED: "UNMATCHED", NEEDS_INPUT: "NEEDS_INPUT",
  ONE_TO_MANY: "ONE_TO_MANY", AMBIGUOUS: "AMBIGUOUS", CONFIG_ERROR: "CONFIG_ERROR",
});

function baseClass(diff, fixable) {
  switch (diff.status) {
    case "MATCH": return DRIFT_CLASS.MATCH;
    case "NEEDS_INPUT": return DRIFT_CLASS.MISSING_INFO;
    case "UNMATCHED": return DRIFT_CLASS.UNMATCHED;
    case "MISSING_IN_CODE":
    case "MISSING_IN_DESIGN": return DRIFT_CLASS.STRUCTURAL;
    case "MISMATCH": return diff.mode === "equal" ? (fixable ? DRIFT_CLASS.TOKEN : DRIFT_CLASS.VALUE) : DRIFT_CLASS.STRUCTURAL;
    default: return DRIFT_CLASS.STRUCTURAL;
  }
}

/**
 * @param {object} report per-component report (buildJsonReport + suggestions)
 * @param {object} [opts] { mapping, accepted, now }
 */
export function classifyReport(report, opts = {}) {
  const { mapping = null, accepted = [], now = Date.now() } = opts;
  const sugByLabel = new Map((report.suggestions || []).map((s) => [s.label, s]));
  const taxonomy = { match: 0, "token-drift": 0, "value-drift": 0, "structural-drift": 0, unmatched: 0, "missing-info": 0, "accepted-drift": 0 };
  const counts = { matches: 0, mismatches: 0, missing: 0, unmatched: 0, needsInput: 0, accepted: 0 };

  const differences = report.differences.map((d) => {
    const s = sugByLabel.get(d.label);
    let fixable = !!s?.fixable;
    let status = d.status;
    let driftClass = baseClass(d, fixable);
    let acceptance = null;

    // Scoped acceptance (reclassify, retain original).
    if (d.status === "MISMATCH") {
      const m = matchAcceptance(report.component, d, accepted, now);
      if (m && !m.expired) {
        status = "ACCEPTED_DRIFT";
        driftClass = DRIFT_CLASS.ACCEPTED;
        fixable = false; // accepted drift is never auto-fixed
        acceptance = { ...m.entry, expired: false };
      } else if (m && m.expired) {
        acceptance = { ...m.entry, expired: true, note: `Acceptance expired (reviewBy ${m.entry.reviewBy}) — treated as active drift again.` };
      }
    }

    taxonomy[driftClass]++;
    if (status === "MATCH") counts.matches++;
    else if (status === "ACCEPTED_DRIFT") counts.accepted++;
    else if (status === "MISMATCH") counts.mismatches++;
    else if (status === "UNMATCHED") counts.unmatched++;
    else if (status === "NEEDS_INPUT") counts.needsInput++;
    else counts.missing++;

    return {
      ...d, status, originalStatus: d.status, driftClass, fixable,
      suggestedFix: (status === "ACCEPTED_DRIFT") ? null : (s?.recommendedChange ?? null),
      fixEdit: (status === "ACCEPTED_DRIFT") ? null : (s?.edit ?? null),
      acceptance,
    };
  });

  // Component status: mapping type wins when it is not a plain 1:1.
  const mappingStatus = mapping?.effectiveStatus;
  let status;
  if (mappingStatus && mappingStatus !== "ONE_TO_ONE") status = mappingStatus; // ONE_TO_MANY / AMBIGUOUS / UNMATCHED
  else if (counts.mismatches > 0 || counts.missing > 0) status = COMPONENT_STATUS.DRIFT;
  else if (counts.unmatched > 0) status = COMPONENT_STATUS.UNMATCHED;
  else if (counts.needsInput > 0) status = COMPONENT_STATUS.NEEDS_INPUT;
  else status = COMPONENT_STATUS.SYNC;

  const fixSummary = {
    fixable: differences.filter((d) => d.fixable && d.status !== "ACCEPTED_DRIFT").length,
    manual: differences.filter((d) => d.status !== "MATCH" && d.status !== "ACCEPTED_DRIFT" && !d.fixable).length,
  };

  return {
    ...report,
    status,
    summary: counts,
    taxonomy,
    fixSummary,
    mapping: mapping ? {
      type: mapping.declaredType, effectiveStatus: mapping.effectiveStatus, figmaRole: mapping.figmaRole,
      targets: mapping.targets, roleMatch: mapping.roleMatch, nameCollision: mapping.nameCollision,
      confidence: mapping.confidence, reason: mapping.reason, resolved: mapping.resolvedNote,
    } : null,
    differences,
  };
}
