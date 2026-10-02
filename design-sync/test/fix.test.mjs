// Fix-engine assertions (node test/fix.test.mjs). Dependency-free.
import assert from "node:assert/strict";
import { model, field } from "../core/model.mjs";
import { diff } from "../core/diff.mjs";
import { buildSuggestions } from "../core/fix.mjs";

let passed = 0;
const ok = (n) => { passed++; console.log(`  ✓ ${n}`); };

// A literal MISMATCH with a code edit → auto-fixable suggestion with a concrete patch.
{
  const cfg = { comparisons: [{ label: "bg", category: "color", mode: "equal", designKey: "k", codeKey: "k" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "color", key: "k", value: "#ffffff", ref: "figma#1" })]);
  const c = model("code", "X", "c", [field({ side: "code", category: "color", key: "k", value: "#000000", ref: "code:a.js:1",
    edit: { file: "/pkg/a.js", mode: "replaceLiteral", find: "#000000", currentValue: "#000000" } })]);
  const res = diff(cfg, d, c);
  const { suggestions, fixableCount } = buildSuggestions(res, d, c);
  assert.equal(fixableCount, 1);
  assert.equal(suggestions[0].fixable, true);
  assert.equal(suggestions[0].confidence, "high");
  assert.deepEqual(suggestions[0].edit, { file: "/pkg/a.js", mode: "replaceLiteral", find: "#000000", replace: "#ffffff" });
  ok("literal MISMATCH → auto-fixable patch (current→verified)");
}

// Token MISMATCH resolves design hex to the code's own palette token name.
{
  const cfg = { comparisons: [{ label: "accent", category: "color", mode: "equal", designKey: "k", codeKey: "k" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "color", key: "k", value: "#445ee5", ref: "figma#1" })]);
  const c = model("code", "X", "c", [field({ side: "code", category: "color", key: "k", value: "#4b68ff", ref: "code:t.js:1",
    edit: { file: "/pkg/t.js", mode: "replaceToken", palette: "blue", find: "blue[60]", currentValue: "#4b68ff" } })],
    { palette: { blue: { 60: "#4B68FF", 70: "#445EE5" } } });
  const { suggestions } = buildSuggestions(diff(cfg, d, c), d, c);
  assert.equal(suggestions[0].fixable, true);
  assert.equal(suggestions[0].edit.replace, "blue[70]");
  ok("token MISMATCH → maps verified hex to code palette token (blue[70])");
}

// NEEDS_INPUT is never fixable and never silently changed.
{
  const cfg = { comparisons: [{ label: "font", category: "typography", mode: "equal", designKey: "k", codeKey: "k" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "typography", key: "k", value: "IBM Plex", ref: "figma#1" })]);
  const c = model("code", "X", "c", [field({ side: "code", category: "typography", key: "k", value: null, ref: "code:x.js", needsInput: true })]);
  const { suggestions } = buildSuggestions(diff(cfg, d, c), d, c);
  assert.equal(suggestions[0].fixable, false);
  assert.match(suggestions[0].recommendedChange, /do not change \[NEEDS INPUT\]/);
  ok("NEEDS_INPUT → never fixable, never changed");
}

// Structural (setEqual) MISMATCH is suggestion-only.
{
  const cfg = { comparisons: [{ label: "kinds", category: "variant", mode: "setEqual", designKey: "k", codeKey: "k" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "variant", key: "k", value: ["a", "b"], ref: "f" })]);
  const c = model("code", "X", "c", [field({ side: "code", category: "variant", key: "k", value: ["a", "c"], ref: "c" })]);
  const { suggestions } = buildSuggestions(diff(cfg, d, c), d, c);
  assert.equal(suggestions[0].fixable, false);
  ok("structural taxonomy MISMATCH → manual only");
}

console.log(`\n  ${passed} assertions passed.`);
