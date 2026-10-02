// Diff engine: given a design model, a code model, and the mapping comparisons,
// produce one Difference record per comparison. Values come only from the models;
// this engine decides status, never invents data.

import { STATUS, STATUS_SEVERITY_ORDER } from "./model.mjs";

const isNI = (f) => !f || f.needsInput || f.value === null || f.value === undefined;
const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);

function compareOne(cmp, design, code) {
  const d = cmp.designKey ? design.byKey[cmp.designKey] : undefined;
  const c = cmp.codeKey ? code.byKey[cmp.codeKey] : undefined;

  const base = {
    label: cmp.label,
    category: cmp.category,
    mode: cmp.mode,
    designKey: cmp.designKey ?? null,
    codeKey: cmp.codeKey ?? null,
    designValue: d ? d.value : undefined,
    codeValue: c ? c.value : undefined,
    designSource: d ? d.source.ref : null,
    codeSource: c ? c.source.ref : null,
    severity: cmp.severity ?? "medium",
    note: cmp.note ?? null,
  };

  // Explicit unmatched mapping (e.g. Figma Link → separate component)
  if (cmp.mode === "unmatched") {
    return { ...base, status: STATUS.UNMATCHED,
      suggestedAction: cmp.note ?? "No corresponding code field; map to the correct component." };
  }

  // Missing sides
  if (cmp.designKey && !d) return { ...base, status: STATUS.MISSING_IN_DESIGN,
    suggestedAction: `Design has no field "${cmp.designKey}".` };
  if (cmp.codeKey && !c && cmp.mode !== "presence") return { ...base, status: STATUS.MISSING_IN_CODE,
    suggestedAction: `Code has no field "${cmp.codeKey}".` };

  // NEEDS_INPUT if either verifiable side is null
  if ((cmp.designKey && isNI(d)) || (cmp.codeKey && cmp.mode === "equal" && isNI(c))) {
    const which = isNI(d) ? "design" : "code";
    return { ...base, status: STATUS.NEEDS_INPUT,
      suggestedAction: `Value not verifiable on ${which} side — resolve before judging.` };
  }

  switch (cmp.mode) {
    case "equal": {
      const same = String(d.value) === String(c.value);
      return { ...base, status: same ? STATUS.MATCH : STATUS.MISMATCH,
        suggestedAction: same ? "In sync." : `Change code ${cmp.category} ${JSON.stringify(c.value)} → ${JSON.stringify(d.value)} (source: design ${d.source.ref}).` };
    }
    case "setEqual": {
      const ds = new Set(arr(d.value));
      const cs = new Set(arr(c.value));
      const onlyDesign = [...ds].filter((x) => !cs.has(x));
      const onlyCode = [...cs].filter((x) => !ds.has(x));
      const same = onlyDesign.length === 0 && onlyCode.length === 0;
      return { ...base, status: same ? STATUS.MATCH : STATUS.MISMATCH,
        detail: same ? null : { onlyInDesign: onlyDesign, onlyInCode: onlyCode },
        suggestedAction: same ? "Variant sets align."
          : `Reconcile variant taxonomy — only-in-design: [${onlyDesign.join(", ") || "—"}], only-in-code: [${onlyCode.join(", ") || "—"}].` };
    }
    case "presence": {
      // design declares it's supported (truthy / non-empty). Is it in code?
      const designHas = Array.isArray(d.value) ? d.value.length > 0 : Boolean(d.value);
      const codeHas = c ? (Array.isArray(c.value) ? c.value.length > 0 : Boolean(c.value)) : false;
      if (designHas && !codeHas) return { ...base, status: STATUS.MISSING_IN_CODE,
        suggestedAction: `Design supports "${cmp.label}" but code does not expose it.` };
      if (!designHas && codeHas) return { ...base, status: STATUS.MISSING_IN_DESIGN,
        suggestedAction: `Code exposes "${cmp.label}" but design has no variant for it.` };
      return { ...base, status: STATUS.MATCH, suggestedAction: "Both sides support it." };
    }
    default:
      return { ...base, status: STATUS.NEEDS_INPUT, suggestedAction: `Unknown comparison mode "${cmp.mode}".` };
  }
}

/** Roll a list of statuses up to a single worst status. */
export function rollup(statuses) {
  for (const s of STATUS_SEVERITY_ORDER) if (statuses.includes(s)) return s;
  return STATUS.MATCH;
}

/**
 * @param {object} cfg  mapping.json component entry
 * @param {ReturnType<import("./model.mjs").model>} design
 * @param {ReturnType<import("./model.mjs").model>} code
 */
export function diff(cfg, design, code) {
  const differences = cfg.comparisons.map((cmp) => compareOne(cmp, design, code));
  const summary = { matches: 0, mismatches: 0, missing: 0, unmatched: 0, needsInput: 0 };
  for (const drec of differences) {
    if (drec.status === STATUS.MATCH) summary.matches++;
    else if (drec.status === STATUS.MISMATCH) summary.mismatches++;
    else if (drec.status === STATUS.UNMATCHED) summary.unmatched++;
    else if (drec.status === STATUS.NEEDS_INPUT) summary.needsInput++;
    else summary.missing++;
  }
  return { status: rollup(differences.map((d) => d.status)), summary, differences };
}
