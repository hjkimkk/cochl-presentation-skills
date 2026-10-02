// Composite / intent-checked mapping (Phase 11). Reads the authoritative mapping
// config and resolves each component's mapping TYPE and ROLE consistency — WITHOUT
// trusting component names. Also validates the whole mapping table before any
// comparison, so mapping problems are visible up front.
//
// Mapping types: ONE_TO_ONE | ONE_TO_MANY | UNMATCHED | AMBIGUOUS.

import { existsSync } from "node:fs";
import { join } from "node:path";

export const MAPPING_TYPE = Object.freeze({
  ONE_TO_ONE: "ONE_TO_ONE", ONE_TO_MANY: "ONE_TO_MANY", UNMATCHED: "UNMATCHED", AMBIGUOUS: "AMBIGUOUS",
});

/**
 * Resolve one component's mapping. Names are NOT trusted: a declared ONE_TO_ONE
 * whose figma role != code target role is downgraded to AMBIGUOUS.
 */
export function resolveMapping(figmaName, cfg) {
  const figmaRole = cfg.figma?.role ?? null;
  const m = cfg.mapping ?? { type: MAPPING_TYPE.ONE_TO_ONE, targets: cfg.code?.component ? [{ component: cfg.code.component, role: figmaRole, relationship: "assumed" }] : [] };
  const targets = m.targets ?? [];
  const primary = targets[0] ?? null;
  const declaredType = m.type ?? MAPPING_TYPE.ONE_TO_ONE;

  const roleMatch = figmaRole != null && primary?.role != null ? figmaRole === primary.role : null;

  let effectiveStatus = declaredType;
  const notes = [];
  if (declaredType === MAPPING_TYPE.ONE_TO_ONE && roleMatch === false) {
    effectiveStatus = MAPPING_TYPE.AMBIGUOUS;
    notes.push(`Declared ONE_TO_ONE but roles differ (figma "${figmaRole}" vs code "${primary?.role}") → AMBIGUOUS.`);
  }

  const nameCollision = !!(figmaName && primary?.component &&
    figmaName.toLowerCase() === primary.component.toLowerCase() && roleMatch === false);
  const renamed = !!(figmaName && primary?.component && figmaName.toLowerCase() !== primary.component.toLowerCase());

  const confidence = effectiveStatus === MAPPING_TYPE.ONE_TO_ONE ? "high"
    : effectiveStatus === MAPPING_TYPE.ONE_TO_MANY ? "medium" : "low";

  return {
    figmaName, figmaRole,
    declaredType, effectiveStatus,
    targets, primary,
    roleMatch, nameCollision, renamed, confidence,
    reason: m.reason ?? primary?.note ?? notes.join(" ") ?? null,
    notes,
    isOneToOne: effectiveStatus === MAPPING_TYPE.ONE_TO_ONE,
    isComposite: effectiveStatus === MAPPING_TYPE.ONE_TO_MANY,
    // A human-facing note when the code name legitimately differs but role matches.
    resolvedNote: renamed && effectiveStatus === MAPPING_TYPE.ONE_TO_ONE
      ? `Figma "${figmaName}" → code "${primary.component}" (name differs, role "${figmaRole}" matches — resolved via mapping.json).` : null,
  };
}

/**
 * Validate every mapping BEFORE comparison. Detects duplicate, unresolved,
 * ambiguous, 1:many, same-name collisions, missing targets, invalid refs.
 * @param {object} mapping parsed mapping.json
 * @param {string} pkgDir  resolved @cochlearai/ui dir (to check target existence)
 */
export function validateMappings(mapping, pkgDir) {
  const issues = [];
  const add = (component, kind, severity, message) => issues.push({ component, kind, severity, message });
  const oneToOneTargetUsage = new Map(); // code component -> [figma components]

  for (const [name, cfg] of Object.entries(mapping.components)) {
    const res = resolveMapping(cfg.figma?.name || name, cfg);

    if (!cfg.mapping) add(name, "no-mapping-block", "warning", "No explicit `mapping` block; assumed ONE_TO_ONE from `code.component`.");
    if (res.targets.length === 0) add(name, "unresolved", "error", "No code targets declared.");

    for (const t of res.targets) {
      const exists = pkgDir ? existsSync(join(pkgDir, "dist", "types", t.component, `${t.component}.d.ts`)) || existsSync(join(pkgDir, "dist", "esm", t.component)) : true;
      if (!exists) add(name, "invalid-ref", "error", `Code target "${t.component}" not found in @cochlearai/ui.`);
    }

    switch (res.effectiveStatus) {
      case MAPPING_TYPE.AMBIGUOUS:
        add(name, res.nameCollision ? "same-name-collision" : "ambiguous", "error",
          res.reason || `AMBIGUOUS mapping for "${name}".`);
        break;
      case MAPPING_TYPE.UNMATCHED:
        add(name, "unresolved", "error", res.reason || `No code counterpart for "${name}".`);
        break;
      case MAPPING_TYPE.ONE_TO_MANY:
        add(name, "one-to-many", "info", `${res.targets.length} code targets: ${res.targets.map((t) => t.component).join(", ")}.`);
        break;
      case MAPPING_TYPE.ONE_TO_ONE: {
        const key = res.primary.component;
        oneToOneTargetUsage.set(key, [...(oneToOneTargetUsage.get(key) || []), name]);
        break;
      }
    }
  }

  for (const [code, figmas] of oneToOneTargetUsage) {
    if (figmas.length > 1) add(figmas.join(","), "duplicate", "error", `Multiple Figma components map ONE_TO_ONE to the same code target "${code}": ${figmas.join(", ")}.`);
  }

  const byKind = {};
  for (const i of issues) byKind[i.kind] = (byKind[i.kind] || 0) + 1;
  const blockingKinds = new Set(["unresolved", "ambiguous", "same-name-collision", "invalid-ref", "duplicate"]);
  const hasBlocking = issues.some((i) => blockingKinds.has(i.kind) && i.severity === "error");

  return { issues, byKind, hasBlocking };
}
