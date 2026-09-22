// Accept / ignore drift (Phase 12). Scoped, value-specific acceptance of a known
// difference. An accepted mismatch is RECLASSIFIED to ACCEPTED_DRIFT — the original
// mismatch is retained (auditable), never deleted, never auto-fixed. This is NOT a
// generic ignore: matching requires component + property + BOTH exact values.

import { readFileSync, existsSync } from "node:fs";

export function loadAccepted(path) {
  if (!existsSync(path)) return [];
  try { return JSON.parse(readFileSync(path, "utf8")).accepted || []; }
  catch { return []; }
}

const S = (v) => (v == null ? "" : Array.isArray(v) ? `[${v.join(", ")}]` : String(v));

/**
 * Find an acceptance matching this difference (component + property + exact values).
 * Returns { entry, expired } or null. Expiry uses `reviewBy` (past → expired).
 */
export function matchAcceptance(component, diff, accepted, nowMs = Date.now()) {
  const hit = accepted.find((a) =>
    a.component === component &&
    a.property === diff.label &&
    S(a.figmaValue) === S(diff.designValue) &&
    S(a.codeValue) === S(diff.codeValue),
  );
  if (!hit) return null;
  const expired = hit.reviewBy ? Date.parse(hit.reviewBy) < nowMs : false;
  return { entry: hit, expired };
}

/** True when a fixable suggestion is currently accepted (so fix must skip it). */
export function isAccepted(component, label, designValue, codeValue, accepted, nowMs = Date.now()) {
  const m = matchAcceptance(component, { label, designValue, codeValue }, accepted, nowMs);
  return !!(m && !m.expired);
}
