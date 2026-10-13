---
name: design-system
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications — especially for Cochl products. Applies Cochl Design System tokens (@cochlearai/ui) automatically when working in a React/Vite project. Avoids generic AI aesthetics in all output.
license: Complete terms in LICENSE.txt
---

This skill combines **Cochl Design System** integration with **production-grade aesthetic principles** to produce interfaces that are both on-brand and memorable. It covers two modes: React app components and static HTML pages. Pitch decks and presentations are out of scope: use the `cochl-presentation` skill.

---

## Mode Detection

Before writing any code, determine which mode applies:

| Signal | Mode |
|---|---|
| React / Vite project, `package.json` present | **React DS Mode** — install `@cochlearai/ui`, use `BaseTheme` |
| Request is for a pitch deck / slides / presentation | stop and use the `cochl-presentation` skill |
| Static HTML page, landing page, web artifact | **HTML Mode** — apply the shared Cochl brand (theme `plex`) |

---

## Design Thinking (all modes)

Before writing a single line of code, answer these four questions internally:

1. **Purpose** — What problem does this interface solve? Who uses it?
2. **Tone** — Pick one direction and commit: enterprise-dark, editorial-minimal, cinematic, data-dense, conversational. No default choices.
3. **Differentiation** — What makes this UNFORGETTABLE? One specific detail someone will remember.
4. **Constraints** — Framework, performance, accessibility requirements.

NEVER default to generic AI aesthetics: no generic default sans-serif fonts on non-Cochl work, no purple gradients on white, no cookie-cutter card grids without intent.

### Brand sources by mode

- **React mode:** tokens come from `../cochl-design/core/tokens.md`; product UI uses `@cochlearai/ui` (setup below).
- **HTML mode:** **Brand:** read `../cochl-design/core/brand-core.md`, then `../cochl-design/core/themes/<theme>.md`. Default theme `plex`. Paste the theme's `:root` block into the output `<style>` before any template CSS, and its Google Fonts `<link>` into `<head>`. Run `../cochl-design/core/qa-checklist.md` before delivering.

---

## React DS Mode — @cochlearai/ui Setup

Use when project has `package.json`. Steps:

### 1. Create `.npmrc` at project root
```ini
@cochlearai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${COCHLEARAI_NPM_TOKEN}
```
Add `.npmrc` to `.gitignore`. Never hardcode the token.

### 2. Install packages
```bash
yarn add @cochlearai/ui @cochlearai/util
# or: npm install @cochlearai/ui @cochlearai/util
# or: pnpm add @cochlearai/ui @cochlearai/util
```

### 3. Wrap root with BaseTheme
```tsx
import { BaseTheme, ThemeType } from '@cochlearai/ui';

export default function App() {
  return (
    <BaseTheme theme={ThemeType.LIGHT}>
      {/* existing app content */}
    </BaseTheme>
  );
}
```

Rules: Place `BaseTheme` as high as possible. Never nest multiple providers. Don't remove existing Router/QueryClient — wrap inside or around them.

### 4. Verify with a test component
```tsx
import { Button } from '@cochlearai/ui';
<Button color="primary">Design System Active</Button>
```

### 5. From a Figma component to code (mapping)

When the user gives a Figma node, a Figma URL or a Figma component name, don't guess the component. Read the mapping (Code Connect stand-in, Phase 2 Path 2):

1. Open `../../design-sync/config/mapping.json` (inside the plugin), or `design-sync/config/mapping.json` in the cochl-presentation-skills repo.
2. Find the entry whose `figma.nodeId` or `relatedNodeIds` matches the node (URL `node-id=3251-7381` → `3251:7381`), else match `figma.name`. Look in `components` first, then `pending`.
3. Use, in this order:
   - `mapping.propMap`: exact Figma variant → JSX rows (e.g. `type=Red` → `<Button color="danger">`, `type=Link` → `<HyperlinkButton>`). Rows marked `pending` are not published yet.
   - `mapping.targets[].variant` and `.props`: which code component and props a Figma variant becomes.
   - `mapping.iconMap` for Icons: Figma icon set → code icon; `probable`/`ambiguous` rows need a visual check.
4. An entry in `pending` means the component is not in the published `@cochlearai/ui` yet (or lives in another package, see `code.package`). Tell the user; don't import it from `@cochlearai/ui`.
5. Theme (`theme=Light|Dark`) is never a prop: it comes from `BaseTheme` / `ThemeType`.
6. No entry for the component → say so and build from library primitives; don't invent a component name.

### React QA checklist
- [ ] `.npmrc` uses env variable, not raw token
- [ ] `.npmrc` in `.gitignore`
- [ ] `@cochlearai/ui` and `@cochlearai/util` in `package.json`
- [ ] `BaseTheme` wraps root with `ThemeType.LIGHT`
- [ ] `npm run build` completes with no errors
- [ ] No unrelated layout changes made
- [ ] Figma components were turned into code via `mapping.json` (step 5), not by guessing names

---

## HTML Mode — Aesthetic Guidelines

For non-React HTML interfaces:

**Typography:** Pair a distinctive display font with a refined body font. The theme's `--font-sans` for Cochl work; for non-Cochl work choose something unexpected and context-specific. Never default to generic system sans-serif fonts.

**Motion (CSS only):**
- `@keyframes fadeUp` with staggered `animation-delay` on page load (0.1s increments)
- One well-orchestrated reveal beats scattered micro-interactions
- Hover states that surprise — not just opacity changes

**Spatial composition:**
- Asymmetry over symmetry. Grid-breaking elements. Generous negative space OR controlled density — never the safe middle.
- Cover/hero: full-bleed background, dramatic type scale, minimal competing elements

**Backgrounds & depth:**
- Create atmosphere: gradient meshes, noise textures, layered transparencies, dramatic shadows
- Flat solid backgrounds only when the data IS the visual (data tables, dense dashboards)

**Anti-patterns to avoid:**
- Purple gradients on white (cliché)
- Evenly-distributed color palettes (timid)
- Perfectly symmetrical card grids (generic)
- Glassmorphism everywhere (overused)
- Cookie-cutter layouts without context-specific intent

---

## Output rules (all modes)

- Self-contained HTML: all assets base64 inline, Google Fonts CDN only external dependency
- React: run build check before reporting complete
- File naming: sensible names for components and pages
- Open browser after writing HTML files
- Never modify unrelated components or routing logic
