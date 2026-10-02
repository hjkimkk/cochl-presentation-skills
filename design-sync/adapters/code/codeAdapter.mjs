// Code adapter: the REAL published @cochlearai/ui package → NormalizedCodeModel.
//
// RECIPE-DRIVEN: what to read per component is DATA (mapping.json `code.extract`),
// not hardcoded logic. The engine stays generic; adding a component = adding a
// recipe. Every value carries `file:line` provenance and, when the value sits in a
// patchable literal/token, an `edit` descriptor the fix engine can act on.
//
// Package location: local Yarn cache by default (the deployed artifact), or the
// COCHL_UI_DIR env var to point at any installed / cloned / working-copy package.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { homedir } from "node:os";
import { model, field } from "../../core/model.mjs";
import { normHex, normLength } from "../../core/normalize.mjs";

export function resolvePackageDir() {
  if (process.env.COCHL_UI_DIR && existsSync(process.env.COCHL_UI_DIR)) return process.env.COCHL_UI_DIR;
  const cache = join(homedir(), "Library", "Caches", "Yarn", "v6");
  if (existsSync(cache)) {
    const hit = readdirSync(cache)
      .filter((d) => d.startsWith("npm-@cochlearai-ui-"))
      .map((d) => join(cache, d, "node_modules", "@cochlearai", "ui"))
      .filter((p) => existsSync(join(p, "package.json")))
      .sort();
    if (hit.length) return hit[hit.length - 1];
  }
  throw new Error("Could not locate @cochlearai/ui. Set COCHL_UI_DIR to an installed/cloned package dir.");
}

const rel = (pkgDir, file) => `@cochlearai/ui/${file.replace(pkgDir + "/", "")}`;
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

// Resolve the package's own colour palette (for token-name ↔ hex mapping).
async function loadPalette(pkgDir) {
  const colorsPath = join(pkgDir, "dist", "esm", "lib", "Colors.js");
  const themePath = join(pkgDir, "dist", "esm", "types", "theme.js");
  const [{ theme }, { ThemeType }] = await Promise.all([
    import(pathToFileURL(colorsPath).href),
    import(pathToFileURL(themePath).href),
  ]);
  return theme[ThemeType.LIGHT];
}

/**
 * @param {string} component logical component name (e.g. "Alert")
 * @param {object} codeCfg   mapping.json `code` entry: { component, extract }
 */
export async function loadCodeModel(component, codeCfg) {
  const pkgDir = resolvePackageDir();
  const version = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).version;
  const codeName = codeCfg.component; // dir name in dist (may differ from logical name)
  const ref = `@cochlearai/ui@${version} (${codeName})`;

  const dtsPath = join(pkgDir, "dist", "types", codeName, `${codeName}.d.ts`);
  const jsPath = join(pkgDir, "dist", "esm", codeName, `${codeName}.js`);
  const tcPath = join(pkgDir, "dist", "esm", "lib", "ThemeColors.js");
  const dts = existsSync(dtsPath) ? readFileSync(dtsPath, "utf8") : "";
  const js = existsSync(jsPath) ? readFileSync(jsPath, "utf8") : "";
  const palette = existsSync(join(pkgDir, "dist", "esm", "lib", "Colors.js")) ? await loadPalette(pkgDir) : null;
  let TC = null;
  if (existsSync(tcPath)) { try { TC = (await import(pathToFileURL(tcPath).href)).ThemeColors; } catch { /* reported per-field */ } }

  const fields = [];
  for (const [key, r] of Object.entries(codeCfg.extract || {})) {
    fields.push(extractField(key, r, { component, codeName, pkgDir, dtsPath, jsPath, tcPath, dts, js, palette, TC }));
  }
  return model("code", component, ref, fields, { packageDir: pkgDir, version, codeName, palette });
}

function extractField(key, r, ctx) {
  const category = r.category || "property";
  const mk = (o) => field({ side: "code", category, key, ...o });

  switch (r.method) {
    case "unionType": {
      const m = new RegExp(`export type ${r.typeName}\\s*=\\s*([^;]+);`).exec(ctx.dts);
      if (!m) return mk({ value: null, ref: rel(ctx.pkgDir, ctx.dtsPath), detail: `type ${r.typeName} not found`, needsInput: true });
      const vals = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1].toLowerCase()).sort();
      return mk({ value: vals, ref: `code:${rel(ctx.pkgDir, ctx.dtsPath)}:${lineOf(ctx.dts, m.index)}`, detail: `${r.typeName} = ${vals.join(" | ")}` });
    }
    case "propUnion": {
      const m = new RegExp(`${r.prop}\\??:\\s*("[^;]+");`).exec(ctx.dts);
      if (!m) return mk({ value: null, ref: rel(ctx.pkgDir, ctx.dtsPath), detail: `prop ${r.prop} union not found`, needsInput: true });
      const vals = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1].toLowerCase()).sort();
      return mk({ value: vals, ref: `code:${rel(ctx.pkgDir, ctx.dtsPath)}:${lineOf(ctx.dts, m.index)}`, detail: `${r.prop}: ${vals.join(" | ")}` });
    }
    case "hasProp": {
      const has = new RegExp(`\\b${r.prop}\\??:`).test(ctx.dts);
      return mk({ value: has, ref: rel(ctx.pkgDir, ctx.dtsPath), detail: has ? `prop \`${r.prop}\`` : `no \`${r.prop}\` prop` });
    }
    case "regexBool": {
      const has = new RegExp(r.pattern, "i").test(ctx.js);
      return mk({ value: has, ref: rel(ctx.pkgDir, ctx.jsPath), detail: r.detail || r.pattern,
        needsInput: r.onFalseNeedsInput && !has });
    }
    case "literal": {
      const m = new RegExp(r.pattern).exec(ctx.js);
      if (!m) return mk({ value: null, ref: rel(ctx.pkgDir, ctx.jsPath), detail: `pattern not found: ${r.pattern}`, needsInput: true });
      const raw = m[1];
      const value = r.kind === "hex" ? normHex(raw) : r.kind === "length" ? normLength(raw) : raw;
      return mk({ value, ref: `code:${rel(ctx.pkgDir, ctx.jsPath)}:${lineOf(ctx.js, m.index)}`,
        detail: r.detail || `literal \`${raw}\``,
        edit: { file: ctx.jsPath, mode: "replaceLiteral", find: raw, currentValue: value } });
    }
    case "tokenRef": {
      // e.g. pattern captures the token index for `...colors.blue[(\d+)]` in an info branch
      const m = new RegExp(r.pattern).exec(ctx.js);
      if (!m) return mk({ value: null, ref: rel(ctx.pkgDir, ctx.jsPath), detail: `token ref not found: ${r.pattern}`, needsInput: true });
      const token = `${r.palette}[${m[1]}]`;
      const hex = ctx.palette?.[r.palette]?.[m[1]];
      return mk({ value: hex ? normHex(hex) : null, needsInput: !hex,
        ref: `code:${rel(ctx.pkgDir, ctx.jsPath)}:${lineOf(ctx.js, m.index)}`,
        detail: `token \`${token}\` → ${hex ?? "?"}`,
        edit: { file: ctx.jsPath, mode: "replaceToken", palette: r.palette, find: token, currentValue: hex ? normHex(hex) : null } });
    }
    case "tokenValue": {
      // resolve a named theme token to its hex, e.g. red / black / white
      const hex = ctx.palette?.[r.token];
      return mk({ value: hex ? normHex(hex) : null, needsInput: !hex,
        ref: `code:@cochlearai/ui/dist/esm/lib/Colors.js`,
        detail: `theme token \`${r.token}\` → ${hex ?? "?"}` });
    }
    case "paletteValue": {
      // resolve palette[name][key] → hex, e.g. grey[30] / blue[60]
      const hex = ctx.palette?.[r.palette]?.[r.key];
      return mk({ value: hex ? normHex(hex) : null, needsInput: !hex,
        ref: `code:@cochlearai/ui/dist/esm/lib/Colors.js`,
        detail: `theme token \`${r.palette}[${r.key}]\` → ${hex ?? "?"}` });
    }
    case "themeColors": {
      const v = r.path.split(".").reduce((o, k) => (o == null ? o : o[k]), ctx.TC);
      return mk({ value: v ? normHex(v) : null, needsInput: !v,
        ref: rel(ctx.pkgDir, ctx.tcPath), detail: `ThemeColors.${r.path}` });
    }
    default:
      return mk({ value: null, ref: rel(ctx.pkgDir, ctx.pkgDir), detail: `unknown method ${r.method}`, needsInput: true });
  }
}
