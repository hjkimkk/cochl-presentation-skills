// Minimal, dependency-free assertions for the diff engine (node test/diff.test.mjs).
import assert from "node:assert/strict";
import { model, field, STATUS } from "../core/model.mjs";
import { diff, rollup } from "../core/diff.mjs";

let passed = 0;
const ok = (name) => { passed++; console.log(`  ✓ ${name}`); };

// equal MATCH / MISMATCH
{
  const cfg = { comparisons: [
    { label: "c", category: "color", mode: "equal", designKey: "k", codeKey: "k" },
  ]};
  const d = model("design", "X", "d", [field({ side: "design", category: "color", key: "k", value: "#fff", ref: "r" })]);
  const c1 = model("code", "X", "c", [field({ side: "code", category: "color", key: "k", value: "#fff", ref: "r" })]);
  const c2 = model("code", "X", "c", [field({ side: "code", category: "color", key: "k", value: "#000", ref: "r" })]);
  assert.equal(diff(cfg, d, c1).differences[0].status, STATUS.MATCH);
  assert.equal(diff(cfg, d, c2).differences[0].status, STATUS.MISMATCH);
  ok("equal → MATCH / MISMATCH");
}

// NEEDS_INPUT when a side is null
{
  const cfg = { comparisons: [{ label: "r", category: "radius", mode: "equal", designKey: "k", codeKey: "k" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "radius", key: "k", value: null, ref: "r", needsInput: true })]);
  const c = model("code", "X", "c", [field({ side: "code", category: "radius", key: "k", value: "4px", ref: "r" })]);
  assert.equal(diff(cfg, d, c).differences[0].status, STATUS.NEEDS_INPUT);
  ok("null side → NEEDS_INPUT (never guessed)");
}

// presence → MISSING_IN_CODE
{
  const cfg = { comparisons: [{ label: "size", category: "variant", mode: "presence", designKey: "size", codeKey: "size" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "variant", key: "size", value: ["sm", "md"], ref: "r" })]);
  const c = model("code", "X", "c", [field({ side: "code", category: "variant", key: "size", value: false, ref: "r" })]);
  assert.equal(diff(cfg, d, c).differences[0].status, STATUS.MISSING_IN_CODE);
  ok("presence design-only → MISSING_IN_CODE");
}

// setEqual difference → MISMATCH with detail
{
  const cfg = { comparisons: [{ label: "kinds", category: "variant", mode: "setEqual", designKey: "k", codeKey: "k" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "variant", key: "k", value: ["a", "b"], ref: "r" })]);
  const c = model("code", "X", "c", [field({ side: "code", category: "variant", key: "k", value: ["a", "c"], ref: "r" })]);
  const rec = diff(cfg, d, c).differences[0];
  assert.equal(rec.status, STATUS.MISMATCH);
  assert.deepEqual(rec.detail, { onlyInDesign: ["b"], onlyInCode: ["c"] });
  ok("setEqual → MISMATCH with only-in-* detail");
}

// unmatched
{
  const cfg = { comparisons: [{ label: "link", category: "variant", mode: "unmatched", designKey: "k" }] };
  const d = model("design", "X", "d", [field({ side: "design", category: "variant", key: "k", value: true, ref: "r" })]);
  const c = model("code", "X", "c", []);
  assert.equal(diff(cfg, d, c).differences[0].status, STATUS.UNMATCHED);
  ok("unmatched mode → UNMATCHED");
}

// rollup picks worst
assert.equal(rollup([STATUS.MATCH, STATUS.NEEDS_INPUT, STATUS.MISMATCH]), STATUS.MISMATCH);
ok("rollup picks worst status");

console.log(`\n  ${passed} assertions passed.`);
