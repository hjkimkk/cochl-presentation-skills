// Figma adapter: verified design snapshot (JSON) → NormalizedDesignModel.
//
// The snapshot is a generic list of fields captured from the Figma MCP (with
// node-id provenance). Adding a component = adding a snapshot, no code change.
// The CLI can't call MCP tools itself, so the agent captures the snapshot; the
// snapshot records exactly which node/read each value came from.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { model, field } from "../../core/model.mjs";
import { normHex, normLength, normType, normSet } from "../../core/normalize.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(HERE, "..", "..", "data", "figma");

function normByCategory(category, value) {
  if (value === null || value === undefined) return null;
  if (category === "color") return normHex(value);
  if (category === "radius" || category === "spacing" || category === "dimension") return normLength(value);
  if (category === "typography") return normType(value);
  if (Array.isArray(value)) return normSet(value);
  return value;
}

/** @param {string} component */
export function loadDesignModel(component) {
  const path = join(DATA_DIR, `${component}.snapshot.json`);
  let snap;
  try {
    snap = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error(`No verified Figma snapshot for "${component}" at ${path}. Capture it from the Figma MCP first (do not fabricate).`);
  }

  const ref = `figma://${snap.fileKey}?node-id=${snap.page.nodeId}`;
  const fields = (snap.fields || []).map((f) =>
    field({
      side: "design",
      category: f.category,
      key: f.key,
      value: f.needsInput ? null : normByCategory(f.category, f.value),
      ref: `figma:${snap.fileKey}#${f.ref}`,
      detail: f.detail ?? null,
      needsInput: !!f.needsInput,
    }),
  );

  const sm = snap.meta || {};
  return model("design", component, ref, fields, {
    fileName: snap.fileName,
    page: snap.page,
    referenceVariant: snap.referenceVariant,
    // lifecycle metadata (Phase 12)
    capturedAt: sm.capturedAt ?? null,
    figmaFileId: sm.figmaFileId ?? snap.fileKey,
    figmaNodeId: sm.figmaNodeId ?? snap.referenceVariant?.nodeId ?? snap.page?.nodeId ?? null,
    captureMethod: sm.captureMethod ?? snap.capturedVia ?? null,
    captureStatus: sm.captureStatus ?? null,
    sourceRevision: sm.sourceRevision ?? null,
  });
}
