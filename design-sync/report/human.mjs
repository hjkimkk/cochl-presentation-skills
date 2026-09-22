// Human-readable terminal report.

const ICON = {
  MATCH: "✓",
  MISMATCH: "✗",
  MISSING_IN_CODE: "▽",
  MISSING_IN_DESIGN: "△",
  UNMATCHED: "≠",
  NEEDS_INPUT: "?",
  ACCEPTED_DRIFT: "◈",
};

function val(v) {
  if (v === null || v === undefined) return "[NEEDS INPUT]";
  if (Array.isArray(v)) return `[${v.join(", ")}]`;
  return String(v);
}

export function printHumanReport(report) {
  const L = [];
  L.push("");
  L.push(`  Component: ${report.component}   Status: ${report.status}`);
  if (report.mapping) {
    L.push(`  Mapping: ${report.mapping.effectiveStatus}${report.mapping.resolved ? "  (" + report.mapping.resolved + ")" : ""}`);
    if (report.mapping.effectiveStatus === "AMBIGUOUS" && report.mapping.reason) L.push(`     ⚠ ${report.mapping.reason}`);
  }
  L.push(`  Design: ${report.designSource}`);
  L.push(`  Code:   ${report.codeSource}`);
  if (report.snapshot) {
    const fr = report.freshness ? `${report.freshness.state}${report.freshness.ageHours != null ? ` (${report.freshness.ageHours}h old, max ${report.freshness.maxAgeHours}h)` : ""}` : "UNKNOWN";
    L.push(`  Snapshot captured: ${report.snapshot.capturedAt || "[unknown]"}  ·  freshness: ${fr}`);
    L.push(`  Package version:   @cochlearai/ui@${report.codeVersion || "?"}`);
    if (report.freshness && report.freshness.state === "STALE") L.push("  ⚠ WARNING: Figma snapshot is stale — comparison may not reflect the current design.");
  }
  L.push("  " + "─".repeat(72));
  for (const d of report.differences) {
    const icon = ICON[d.status] || "·";
    L.push(`  ${icon} ${d.status.padEnd(17)} ${d.label}  [${d.category}]`);
    L.push(`      design: ${val(d.designValue)}`);
    L.push(`      code:   ${val(d.codeValue)}`);
    if (d.detail) L.push(`      detail: ${JSON.stringify(d.detail)}`);
    if (d.status === "ACCEPTED_DRIFT" && d.acceptance) L.push(`      ◈ accepted by ${d.acceptance.acceptedBy} — ${d.acceptance.reason}${d.acceptance.reviewBy ? " (review by " + d.acceptance.reviewBy + ")" : ""}`);
    else if (d.status !== "MATCH") L.push(`      → ${d.suggestedAction || d.suggestedFix || ""}`);
  }
  L.push("  " + "─".repeat(72));
  const s = report.summary;
  L.push(`  ${s.matches} match · ${s.mismatches} mismatch · ${s.missing} missing · ${s.unmatched} unmatched · ${s.needsInput} needs-input${s.accepted ? " · " + s.accepted + " accepted" : ""}`);
  L.push("");
  return L.join("\n");
}
