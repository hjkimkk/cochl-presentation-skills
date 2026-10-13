#!/usr/bin/env node
// Mapping coverage against the Figma Cochl Design System component families.
//   node scripts/coverage.mjs [--json]
// Denominator: config/figma-families.json (every Figma component family; D1: all in
// one file). A family counts as mapped when it is in mapping.json `components`
// (checked by validate/sync) or `pending` (mapped by hand, code not published or
// engine support missing). AMBIGUOUS entries never count.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

export function coverage(families, mapping) {
  const entries = (section) => Object.entries(mapping[section] ?? {}).filter(([k]) => !k.startsWith("_"));
  const byNode = new Map();
  for (const section of ["components", "pending"])
    for (const [name, cfg] of entries(section)) byNode.set(cfg.figma?.nodeId, { name, section, type: cfg.mapping?.type });
  const rows = families.map((f) => {
    const hit = byNode.get(f.nodeId);
    const status = !hit ? "unmapped" : hit.type === "AMBIGUOUS" ? "ambiguous" : hit.section === "pending" ? "pending" : "mapped";
    return { ...f, entry: hit?.name ?? null, status };
  });
  const count = (s) => rows.filter((r) => r.status === s).length;
  const mapped = count("mapped"), pending = count("pending");
  return {
    rows,
    total: rows.length,
    mapped, pending, ambiguous: count("ambiguous"), unmapped: count("unmapped"),
    percent: rows.length ? Math.round(((mapped + pending) / rows.length) * 100) : 0,
    percentChecked: rows.length ? Math.round((mapped / rows.length) * 100) : 0,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const c = coverage(read("config/figma-families.json").families, read("config/mapping.json"));
  if (process.argv.includes("--json")) { console.log(JSON.stringify(c, null, 2)); process.exit(0); }
  for (const r of c.rows) console.log(`  ${r.status.padEnd(10)} ${r.family.padEnd(14)} ${r.nodeId.padEnd(11)} ${r.entry ?? "-"}`);
  console.log(`\n  coverage ${c.percent}% (${c.mapped + c.pending}/${c.total}) · checked by sync ${c.percentChecked}% (${c.mapped}) · pending ${c.pending} · ambiguous ${c.ambiguous} · unmapped ${c.unmapped}`);
  process.exit(c.ambiguous ? 1 : 0);
}
