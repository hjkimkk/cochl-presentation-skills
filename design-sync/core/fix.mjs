// Fix engine (Phase 8 — READ-ONLY). Turns diff differences into structured fix
// suggestions. For every verified mismatch it reports: current code value, verified
// design value, recommended change, source/provenance, and confidence/status.
// It NEVER writes. `[NEEDS INPUT]` stays `[NEEDS INPUT]` and is never "fixed".
//
// A suggestion is auto-applyable ONLY when: status is MISMATCH from an `equal`
// comparison, BOTH sides are verified, and the code field exposes a concrete `edit`
// (a literal we can locate, or a token whose target value maps back to the code's
// own palette). Everything else is suggestion-only (manual) — structural taxonomy
// changes, missing props, unmatched components, and anything NEEDS_INPUT.

import { STATUS } from "./model.mjs";

/** Find the palette token name (e.g. "70") whose hex equals `hex` in `palette[name]`. */
function tokenKeyForHex(palette, name, hex) {
  const group = palette?.[name];
  if (!group) return null;
  const target = String(hex).toLowerCase();
  for (const [k, v] of Object.entries(group)) {
    if (String(v).toLowerCase() === target) return k;
  }
  return null;
}

/**
 * @param {ReturnType<import("./diff.mjs").diff>} result
 * @param {ReturnType<import("./model.mjs").model>} design
 * @param {ReturnType<import("./model.mjs").model>} code
 */
export function buildSuggestions(result, design, code) {
  const palette = code.meta?.palette ?? null;
  const suggestions = [];

  for (const d of result.differences) {
    if (d.status === STATUS.MATCH) continue;

    const codeField = d.codeKey ? code.byKey[d.codeKey] : null;
    const base = {
      label: d.label,
      category: d.category,
      status: d.status,
      currentCodeValue: d.codeValue ?? "[NEEDS INPUT]",
      verifiedDesignValue: d.designValue ?? "[NEEDS INPUT]",
      designSource: d.designSource,
      codeSource: d.codeSource,
    };

    // Non-fixable buckets — clear, honest reasons.
    if (d.status === STATUS.NEEDS_INPUT) {
      suggestions.push({ ...base, fixable: false, confidence: "n/a",
        recommendedChange: "Resolve the missing value first (design capture or code source); do not change [NEEDS INPUT].",
        edit: null, reason: "A side is unverified." });
      continue;
    }
    if (d.status === STATUS.MISSING_IN_CODE) {
      suggestions.push({ ...base, fixable: false, confidence: "n/a",
        recommendedChange: `Add "${d.label}" support to the code component (design has it, code does not).`,
        edit: null, reason: "Adding an API/prop is a manual code change, not a value swap." });
      continue;
    }
    if (d.status === STATUS.UNMATCHED) {
      suggestions.push({ ...base, fixable: false, confidence: "n/a",
        recommendedChange: d.note || "Map to the correct code component.",
        edit: null, reason: "No corresponding code field/component." });
      continue;
    }
    if (d.status === STATUS.MISMATCH && d.mode !== "equal") {
      suggestions.push({ ...base, fixable: false, confidence: "low",
        recommendedChange: d.suggestedAction || d.note || "Reconcile the variant taxonomy (design/API decision).",
        edit: null, reason: "Structural/taxonomy mismatch — a person must author the mapping." });
      continue;
    }

    // MISMATCH + equal + both verified → try to build a concrete, safe edit.
    const edit = codeField?.edit ?? null;
    if (!edit || d.designValue == null || d.codeValue == null) {
      suggestions.push({ ...base, fixable: false, confidence: "low",
        recommendedChange: `Change code ${d.category} ${JSON.stringify(d.codeValue)} → ${JSON.stringify(d.designValue)}.`,
        edit: null, reason: "No locatable code literal/token to patch automatically." });
      continue;
    }

    if (edit.mode === "replaceLiteral") {
      suggestions.push({ ...base, fixable: true, confidence: "high",
        recommendedChange: `${edit.find} → ${d.designValue}`,
        edit: { file: edit.file, mode: "replaceLiteral", find: edit.find, replace: d.designValue },
        reason: "Unique code literal, verified design value." });
      continue;
    }

    if (edit.mode === "replaceToken") {
      const targetKey = tokenKeyForHex(palette, edit.palette, d.designValue);
      if (!targetKey) {
        suggestions.push({ ...base, fixable: false, confidence: "low",
          recommendedChange: `Set the accent to ${d.designValue}, but it is not a named \`${edit.palette}\` token in code — needs a design/token decision.`,
          edit: null, reason: `Design value ${d.designValue} has no matching ${edit.palette}[] token.` });
        continue;
      }
      const replace = `${edit.palette}[${targetKey}]`;
      suggestions.push({ ...base, fixable: true, confidence: "high",
        recommendedChange: `${edit.find} (${d.codeValue}) → ${replace} (${d.designValue})`,
        edit: { file: edit.file, mode: "replaceToken", find: edit.find, replace },
        reason: `Design ${d.designValue} == code token ${replace}; token-to-token swap.` });
      continue;
    }

    suggestions.push({ ...base, fixable: false, confidence: "low",
      recommendedChange: `Change ${d.codeValue} → ${d.designValue}.`, edit: null, reason: `Unsupported edit mode ${edit.mode}.` });
  }

  const fixable = suggestions.filter((s) => s.fixable);
  return { suggestions, fixableCount: fixable.length, manualCount: suggestions.length - fixable.length };
}
