# Mismatch audit brief (shared by all group agents)

Goal: for each component in your group, find mismatches between
- **Figma** — file `Cochl Design System`, fileKey `aUrjRMAnE8ND8o6lAI0VcM`
- **GitHub** — repo `cochlearai/cochl-dashboard`, library `packages/cochl-ui/src/<Component>/` (props/types in the .tsx), plus app usage in `packages/client` only when needed
- **Storybook** — `packages/cochl-ui/stories/**` (same repo); live ids at https://dashboardstorybook.cochl.ai/index.json

## Tools (read-only — never modify Figma or GitHub, never commit, never dispatch subagents)
- Figma: first invoke the Skill `figma:figma-use`, then load `mcp__5fc919a3-01c6-453a-82be-fc0b70514160__use_figma` via ToolSearch. Pass `skillNames: "figma-use"`. Read-only scripts only. One `figma.setCurrentPageAsync` per call; for several pages issue parallel calls. Useful script:
  ```js
  const page = await figma.getNodeByIdAsync("PAGE_ID"); await figma.setCurrentPageAsync(page);
  const sets = page.findAllWithCriteria({ types: ['COMPONENT_SET'] });
  return sets.map(s => ({ id: s.id, name: s.name,
    props: Object.fromEntries(Object.entries(s.componentPropertyDefinitions).map(([k, d]) => [k, d.type === 'VARIANT' ? d.variantOptions : d.type])) }));
  ```
  Clean `\b` (U+0008) characters from names. If a script is too big, narrow it (by set id).
- GitHub: load `mcp__e8c87627-6e15-45b0-b6ef-446aefdee372__get_file_contents` and `..._search_code` via ToolSearch. owner `cochlearai`, repo `cochl-dashboard`.

## What counts as a mismatch (record each with severity)
- **High:** a Figma variant/value with no code equivalent (or vice versa) that users would see; wrong component used; a state in Figma (e.g. disabled, error, focus) the code can't render.
- **Medium:** naming differences that make mapping ambiguous (Figma `type=Red` vs code `color="danger"`), states missing from Storybook, theme (Light/Dark) support differing.
- **Low:** typos, prop names, story naming, docs links.
Record the mapping you infer (Figma value → code prop value) — it feeds `design-sync/config/mapping.json`.

## Output
Write `docs/design-sync/mismatch/<group>.md` in /Users/hyo/cochl-presentation-skills with, per component:
1. Figma: page, set id(s), variant properties + values
2. Code: component(s), props + allowed values (quote file:line)
3. Storybook: story ids and which variants/states they show
4. Inferred mapping table (Figma value → code prop)
5. Mismatches table: | Severity | Where | Mismatch | Evidence |
End with a short "Top issues" list. Reply in under 12 lines: components covered, counts of High/Medium/Low, top 3 issues.
