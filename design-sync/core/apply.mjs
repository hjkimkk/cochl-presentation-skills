// Apply engine (Phase 9). SAFETY-FIRST:
//  - Never touches the installed package or any production source.
//  - Operates on a sandbox WORKING COPY under design-sync/.work/ui.
//  - Computes a diff first (used for --dry-run); only writes when write===true.
//  - Only applies edits produced by the fix engine (verified design values).
//
// In production this same edit descriptor would target the real source repo
// (cochlearai/cochl-dashboard) once reachable; the working copy proves the
// gate + validation loop without write access to the deployed package.

import { readFileSync, writeFileSync, existsSync, rmSync, cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

/** Fresh working copy of the package (so BEFORE=pristine, AFTER=patched-copy). */
export function prepareWorkingCopy(srcPkgDir, workDir) {
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
  mkdirSync(dirname(workDir), { recursive: true });
  cpSync(srcPkgDir, workDir, { recursive: true });
  // The dist/esm files are ES modules; mark the working copy so Node imports them
  // without a reparse warning (harmless; the copy is sandbox-only).
  try {
    const pj = join(workDir, "package.json");
    const j = JSON.parse(readFileSync(pj, "utf8"));
    if (j.type !== "module") { j.type = "module"; writeFileSync(pj, JSON.stringify(j, null, 2)); }
  } catch { /* non-fatal */ }
  return workDir;
}

/** Map an edit's cache-relative file into the working copy. */
function workFileFor(edit, srcPkgDir, workDir) {
  return edit.file.startsWith(srcPkgDir) ? workDir + edit.file.slice(srcPkgDir.length) : edit.file;
}

/**
 * Compute the change (and optionally write it) for one edit.
 * Literal string replace (handles both replaceLiteral and replaceToken — both carry
 * an exact `find`/`replace`). Returns a diff preview with per-line hunks.
 */
export function applyEdit(edit, { srcPkgDir, workDir, write }) {
  const target = workFileFor(edit, srcPkgDir, workDir);
  if (!existsSync(target)) return { ok: false, file: target, error: "target file not found" };

  const before = readFileSync(target, "utf8");
  const occurrences = before.split(edit.find).length - 1;
  if (occurrences === 0) return { ok: false, file: target, error: `find string not present: ${edit.find}` };

  const after = before.split(edit.find).join(edit.replace);

  // per-line hunks (only lines that changed)
  const bl = before.split("\n");
  const hunks = [];
  for (let i = 0; i < bl.length; i++) {
    if (bl[i].includes(edit.find)) {
      hunks.push({ line: i + 1, before: bl[i].trim(), after: bl[i].split(edit.find).join(edit.replace).trim() });
    }
  }

  if (write) writeFileSync(target, after);
  return {
    ok: true,
    file: target.replace(workDir + "/", ""),
    mode: edit.mode,
    find: edit.find,
    replace: edit.replace,
    occurrences,
    hunks,
    written: !!write,
  };
}

/** Render a compact unified-ish preview for a set of applied/dry-run edits. */
export function renderEditPreview(results) {
  const L = [];
  for (const r of results) {
    if (!r.ok) { L.push(`  ! ${r.error}`); continue; }
    L.push(`  ~ ${r.file}  (${r.occurrences}× ${r.mode}: "${r.find}" → "${r.replace}")`);
    for (const h of r.hunks.slice(0, 8)) {
      L.push(`      L${h.line}`);
      L.push(`      - ${h.before}`);
      L.push(`      + ${h.after}`);
    }
    if (r.hunks.length > 8) L.push(`      … ${r.hunks.length - 8} more line(s)`);
  }
  return L.join("\n");
}
