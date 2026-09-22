#!/usr/bin/env node
// Snapshot capture / freshness refresh (Phase C — self-service, no Claude required).
//
// Uses the Figma REST API with a FIGMA_TOKEN to re-read each captured component's
// reference node and compute a stable FINGERPRINT (background hex + corner radius +
// padding + text style + variant-axis names). It compares that against the
// fingerprint stored in the snapshot and reports FRESH vs CHANGED, and refreshes
// `meta.capturedAt`.
//
// SAFETY / no-fabrication: capture does NOT overwrite a snapshot's verified `value`s.
// A verified value stays human/Claude-reviewed. What capture does is DETECT that the
// Figma source changed (fingerprint differs) so a human knows the snapshot is stale
// and must be refreshed — the tool's own two-phase principle applied to its inputs.
//
// Usage:
//   FIGMA_TOKEN=figd_xxx node scripts/capture.mjs                 # check all
//   FIGMA_TOKEN=figd_xxx node scripts/capture.mjs Button Alert    # check some
//   FIGMA_TOKEN=figd_xxx node scripts/capture.mjs --write         # refresh capturedAt + fingerprint
// Exit: 0 = all fresh · 3 = some CHANGED (snapshots need review) · 2 = config/setup error.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DATA = join(ROOT, "data", "figma");
const API = "https://api.figma.com/v1";

const args = process.argv.slice(2);
const write = args.includes("--write");
const only = args.filter((a) => !a.startsWith("-"));

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error("✗ FIGMA_TOKEN is not set.\n  Create a Figma personal access token (Settings → Security → Personal access tokens,\n  scope: File content read) and run:\n      FIGMA_TOKEN=figd_xxx node scripts/capture.mjs");
  process.exit(2);
}

const hex = (c) => c ? "#" + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase() : null;

// Best-effort structural fingerprint of a node subtree (order-stable, human-meaningful).
function fingerprintNode(node) {
  const fp = {};
  const firstSolid = (fills) => (fills || []).find((f) => f.type === "SOLID" && f.visible !== false);
  const walk = (n, depth) => {
    if (!n || depth > 4) return;
    if (fp.background == null) { const f = firstSolid(n.fills); if (f) fp.background = hex(f.color); }
    if (fp.cornerRadius == null && typeof n.cornerRadius === "number") fp.cornerRadius = `${n.cornerRadius}px`;
    if (fp.paddingLeft == null && typeof n.paddingLeft === "number") fp.paddingLeft = `${n.paddingLeft}px`;
    if (fp.paddingTop == null && typeof n.paddingTop === "number") fp.paddingTop = `${n.paddingTop}px`;
    if (n.type === "TEXT" && n.style && fp.font == null) {
      fp.font = `${n.style.fontFamily} ${n.style.fontWeight} ${n.style.fontSize}px`;
      const tf = firstSolid(n.fills); if (tf) fp.textColor = hex(tf.color);
    }
    for (const c of n.children || []) walk(c, depth + 1);
  };
  walk(node, 0);
  return fp;
}

// Variant-axis names for a page/component-set (property names only, not exhaustive values).
function variantAxes(node) {
  const axes = new Set();
  const walk = (n, depth) => {
    if (!n || depth > 4) return;
    if ((n.type === "COMPONENT" || n.type === "COMPONENT_SET") && /=/.test(n.name || "")) {
      for (const kv of n.name.split(",")) { const k = kv.trim().split("=")[0]; if (k) axes.add(k.trim()); }
    }
    for (const c of n.children || []) walk(c, depth + 1);
  };
  walk(node, 0);
  return [...axes].sort();
}

async function fetchNodes(fileKey, ids) {
  const res = await fetch(`${API}/files/${fileKey}/nodes?ids=${ids.join(",")}`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`Figma API ${res.status} ${res.statusText}`);
  return (await res.json()).nodes || {};
}

const stable = (o) => JSON.stringify(o, Object.keys(o).sort());

let changed = 0, checked = 0, errors = 0;
const files = readdirSync(DATA).filter((f) => f.endsWith(".snapshot.json"));
for (const f of files) {
  const path = join(DATA, f);
  const snap = JSON.parse(readFileSync(path, "utf8"));
  if (only.length && !only.includes(snap.component)) continue;
  if (snap.meta?.captureStatus !== "captured") { console.log(`  · ${snap.component.padEnd(10)} skipped (${snap.meta?.captureStatus || "no meta"})`); continue; }

  const fileKey = snap.meta.figmaFileId, refId = snap.meta.figmaNodeId, pageId = snap.page?.nodeId;
  try {
    const nodes = await fetchNodes(fileKey, [refId, pageId].filter(Boolean));
    const refDoc = nodes[refId]?.document || nodes[refId?.replace(":", "-")]?.document;
    const pageDoc = nodes[pageId]?.document || nodes[pageId?.replace(":", "-")]?.document;
    const fp = { ...fingerprintNode(refDoc || {}), axes: variantAxes(pageDoc || refDoc || {}) };

    checked++;
    const prev = snap.meta.fingerprint || null;
    const isChanged = prev && stable(prev) !== stable(fp);
    const state = !prev ? "NEW" : isChanged ? "CHANGED" : "FRESH";
    if (isChanged) changed++;
    console.log(`  ${state === "FRESH" ? "✓" : state === "CHANGED" ? "✗" : "•"} ${snap.component.padEnd(10)} ${state}` +
      (isChanged ? `  (was ${JSON.stringify(prev)} → now ${JSON.stringify(fp)})` : ""));

    if (write) {
      snap.meta.capturedAt = new Date().toISOString();
      snap.meta.fingerprint = fp;
      writeFileSync(path, JSON.stringify(snap, null, 2) + "\n");
    }
  } catch (e) {
    errors++;
    console.log(`  ! ${snap.component.padEnd(10)} ERROR: ${e.message}`);
  }
}

console.log(`\n  ${checked} checked · ${changed} changed · ${errors} error(s)${write ? " · capturedAt + fingerprint written" : " (run with --write to refresh)"}`);
if (changed > 0) console.log("  → CHANGED components: refresh the snapshot's verified values (via Claude + Figma MCP), then commit.");
process.exit(errors ? 2 : changed ? 3 : 0);
