// Generate the shareable Artifact-contract dashboard page from current batch data.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { runBatch } from "../core/batch.mjs";
import { buildDashboardArtifact } from "../report/dashboard.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const mapping = JSON.parse(readFileSync(join(ROOT, "config", "mapping.json"), "utf8"));
const { reports, summary } = await runBatch(mapping, {});
const html = buildDashboardArtifact(summary, reports);
const outDir = join(ROOT, "reports");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const out = join(outDir, "dashboard-share.html");
writeFileSync(out, html);
console.log(`wrote ${out} · ${html.length} bytes · overall ${summary.overallStatus} · ${summary.componentsChecked} components`);
