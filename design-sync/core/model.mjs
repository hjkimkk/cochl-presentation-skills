// Normalized models + shared vocabulary for the Design-to-Code Sync engine.
//
// Design principle: every value carries a `source` (provenance) so any verdict is
// traceable back to a real Figma node or a real code file. Adapters NEVER fabricate
// a value — a field the adapter cannot verify is emitted with value `null` and
// `needsInput: true`, which the diff engine renders as NEEDS_INPUT (never a guess).

/** Diff status vocabulary (see docs/design-to-code-architecture.md §6). */
export const STATUS = Object.freeze({
  MATCH: "MATCH",
  MISMATCH: "MISMATCH",
  MISSING_IN_DESIGN: "MISSING_IN_DESIGN",
  MISSING_IN_CODE: "MISSING_IN_CODE",
  UNMATCHED: "UNMATCHED",
  NEEDS_INPUT: "NEEDS_INPUT",
});

/** Ordering from "worst" to "best" — used to roll a component up to one status. */
export const STATUS_SEVERITY_ORDER = [
  STATUS.MISMATCH,
  STATUS.MISSING_IN_CODE,
  STATUS.MISSING_IN_DESIGN,
  STATUS.UNMATCHED,
  STATUS.NEEDS_INPUT,
  STATUS.MATCH,
];

/**
 * Build one field of a normalized model.
 * @param {object} o
 * @param {"design"|"code"} o.side
 * @param {string} o.category  color|typography|radius|spacing|dimension|variant|state|property
 * @param {string} o.key       canonical key, e.g. "color.background.primary"
 * @param {*} o.value          normalized value, or null when unverifiable
 * @param {string} o.ref       provenance: figma node id, or code file[:line]
 * @param {string} [o.detail]  extra provenance detail (raw value, expression, note)
 * @param {boolean} [o.needsInput] true when the source genuinely does not express this
 */
export function field({ side, category, key, value, ref, detail, needsInput = false, edit = null }) {
  return {
    side,
    category,
    key,
    value: value ?? null,
    needsInput: needsInput || value === null || value === undefined,
    source: { ref, detail: detail ?? null },
    // Optional patch descriptor (code side only): how this value could be edited.
    edit: edit ?? null,
  };
}

/**
 * A normalized model for one side (design or code) of one component.
 * @param {"design"|"code"} side
 * @param {string} component
 * @param {string} ref   provenance root (figma file/node, or pkg@version)
 * @param {ReturnType<typeof field>[]} fields
 * @param {object} [meta]
 */
export function model(side, component, ref, fields, meta = {}) {
  const byKey = Object.create(null);
  for (const f of fields) byKey[f.key] = f;
  return { side, component, ref, meta, fields, byKey };
}
