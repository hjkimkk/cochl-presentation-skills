// Phase 11/12 assertions (node test/mapping.test.mjs). Dependency-free.
import assert from "node:assert/strict";
import { resolveMapping, validateMappings, MAPPING_TYPE } from "../core/mapping.mjs";
import { computeFreshness, FRESHNESS } from "../core/freshness.mjs";
import { matchAcceptance, isAccepted } from "../core/accept.mjs";

let passed = 0;
const ok = (n) => { passed++; console.log(`  ✓ ${n}`); };

// ONE_TO_ONE with matching role
{
  const r = resolveMapping("Alert", { figma: { role: "status-message" }, mapping: { type: "ONE_TO_ONE", targets: [{ component: "Toast", role: "status-message" }] } });
  assert.equal(r.effectiveStatus, MAPPING_TYPE.ONE_TO_ONE);
  assert.equal(r.renamed, true);
  assert.match(r.resolvedNote, /Alert.*Toast/);
  ok("ONE_TO_ONE renamed (Alert→Toast) with role match resolves");
}

// Name collision → AMBIGUOUS even if declared ONE_TO_ONE
{
  const r = resolveMapping("Dropdown", { figma: { role: "form-select" }, mapping: { type: "ONE_TO_ONE", targets: [{ component: "Dropdown", role: "popover-container" }] } });
  assert.equal(r.effectiveStatus, MAPPING_TYPE.AMBIGUOUS);
  assert.equal(r.nameCollision, true);
  ok("same-name + different role → AMBIGUOUS (name not trusted)");
}

// ONE_TO_MANY
{
  const r = resolveMapping("Table", { figma: { role: "data-table" }, mapping: { type: "ONE_TO_MANY", targets: [{ component: "Table" }, { component: "TableRow" }] } });
  assert.equal(r.effectiveStatus, MAPPING_TYPE.ONE_TO_MANY);
  assert.equal(r.isComposite, true);
  ok("ONE_TO_MANY recognized (Table → many)");
}

// validateMappings detects duplicate, ambiguous, one-to-many
{
  const mapping = { components: {
    A: { figma: { name: "A", role: "x" }, mapping: { type: "ONE_TO_ONE", targets: [{ component: "Foo", role: "x" }] } },
    B: { figma: { name: "B", role: "x" }, mapping: { type: "ONE_TO_ONE", targets: [{ component: "Foo", role: "x" }] } },
    D: { figma: { name: "Dropdown", role: "form-select" }, mapping: { type: "AMBIGUOUS", targets: [{ component: "Dropdown", role: "popover-container" }] } },
    T: { figma: { name: "T", role: "t" }, mapping: { type: "ONE_TO_MANY", targets: [{ component: "Foo" }, { component: "Bar" }] } },
  }};
  const { byKind, hasBlocking } = validateMappings(mapping, null);
  assert.ok(byKind.duplicate >= 1, "duplicate detected");
  assert.ok(byKind.ambiguous >= 1 || byKind["same-name-collision"] >= 1, "ambiguous detected");
  assert.ok(byKind["one-to-many"] >= 1, "one-to-many listed");
  assert.equal(hasBlocking, true);
  ok("validateMappings flags duplicate + ambiguous + one-to-many");
}

// Freshness
{
  const now = Date.parse("2026-09-22T12:00:00Z");
  assert.equal(computeFreshness("2026-09-22T11:00:00Z", 168, now).state, FRESHNESS.FRESH);
  assert.equal(computeFreshness("2026-09-01T00:00:00Z", 168, now).state, FRESHNESS.STALE);
  assert.equal(computeFreshness(null, 168, now).state, FRESHNESS.UNKNOWN);
  assert.equal(computeFreshness("2026-09-22T11:00:00Z", 0, now).state, FRESHNESS.STALE);
  ok("freshness FRESH / STALE / UNKNOWN + configurable threshold");
}

// Acceptance is scoped + value-specific + expiry
{
  const accepted = [{ component: "Chip", property: "Border radius", figmaValue: "74px", codeValue: "100px", acceptedBy: "x", reason: "pill", reviewBy: "2099-01-01" }];
  const diff = { label: "Border radius", designValue: "74px", codeValue: "100px" };
  assert.ok(matchAcceptance("Chip", diff, accepted));
  assert.equal(isAccepted("Chip", "Border radius", "74px", "100px", accepted), true);
  // different value → not accepted
  assert.equal(isAccepted("Chip", "Border radius", "80px", "100px", accepted), false);
  // different component → not accepted
  assert.equal(isAccepted("Button", "Border radius", "74px", "100px", accepted), false);
  // expired
  const exp = [{ ...accepted[0], reviewBy: "2000-01-01" }];
  assert.equal(matchAcceptance("Chip", diff, exp).expired, true);
  ok("acceptance is scoped, value-specific, and honors expiry");
}

// The real mapping table: no blocking issues, node IDs present, Dropdown resolved,
// and extra (variant) targets don't change a ONE_TO_ONE entry's status.
{
  const { readFileSync } = await import("node:fs");
  const real = JSON.parse(readFileSync(new URL("../config/mapping.json", import.meta.url), "utf8"));
  const { hasBlocking } = validateMappings(real, null);
  assert.equal(hasBlocking, false, "config/mapping.json has no blocking issues");
  for (const [name, cfg] of Object.entries(real.components)) {
    assert.match(cfg.figma?.nodeId ?? "", /^\d+:\d+$/, `${name} has a figma.nodeId`);
  }
  assert.equal(resolveMapping("Dropdown", real.components.Dropdown).effectiveStatus, MAPPING_TYPE.ONE_TO_MANY);
  for (const n of ["Button", "Input"]) {
    const r = resolveMapping(real.components[n].figma.name, real.components[n]);
    assert.equal(r.effectiveStatus, MAPPING_TYPE.ONE_TO_ONE, `${n} stays ONE_TO_ONE`);
    assert.equal(r.primary.component, n, `${n} primary target unchanged`);
  }
  ok("mapping.json: no blocking issues, node IDs, Dropdown ONE_TO_MANY, Button/Input primary kept");

  // `pending` entries (code not published yet) stay out of `components` but are complete.
  for (const [name, cfg] of Object.entries(real.pending ?? {})) {
    if (name.startsWith("_")) continue;
    assert.equal(real.components[name], undefined, `${name} is not also in components`);
    assert.match(cfg.figma?.nodeId ?? "", /^\d+:\d+$/, `pending ${name} has a figma.nodeId`);
    assert.ok(cfg.mapping?.targets?.length, `pending ${name} declares targets`);
  }
  ok("mapping.json: pending entries are complete and kept out of components");
}

console.log(`\n  ${passed} assertions passed.`);
