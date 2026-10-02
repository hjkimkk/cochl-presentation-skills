// Snapshot freshness (Phase 12). A stale snapshot is never silently treated as
// current. Threshold is configurable (config/sync-config.json snapshot.maxAgeHours,
// or --max-age-hours). States: FRESH | STALE | UNKNOWN.

export const FRESHNESS = Object.freeze({ FRESH: "FRESH", STALE: "STALE", UNKNOWN: "UNKNOWN" });

/**
 * @param {string|null} capturedAt ISO timestamp from snapshot.meta.capturedAt
 * @param {number} maxAgeHours
 * @param {number} [nowMs]
 */
export function computeFreshness(capturedAt, maxAgeHours, nowMs = Date.now()) {
  if (!capturedAt) return { state: FRESHNESS.UNKNOWN, capturedAt: null, ageHours: null, maxAgeHours };
  const t = Date.parse(capturedAt);
  if (Number.isNaN(t)) return { state: FRESHNESS.UNKNOWN, capturedAt, ageHours: null, maxAgeHours };
  const ageHours = (nowMs - t) / 3_600_000;
  const state = ageHours <= maxAgeHours ? FRESHNESS.FRESH : FRESHNESS.STALE;
  return { state, capturedAt, ageHours: Math.round(ageHours * 100) / 100, maxAgeHours };
}
