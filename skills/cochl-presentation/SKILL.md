---
name: cochl-presentation
description: Creates production-grade Cochl presentation collateral from minimal input — slide decks (investor, B2B sales, corporate strategy/roadmap, QBR/board, market & competitive, plus team decks for Data/Design/Dev/Research), documents, editable-SVG brochures, and social media banners. Follows the Cochl brand system (near-black + indigo + purple→blue glow, IBM Plex Sans/Mono). Use whenever the user wants to build a Cochl deck, presentation, pitch, brochure/제품 소개서, or social media banner (LinkedIn/YouTube/Medium/Notion/OG).
license: Complete terms in LICENSE.txt
---

This skill builds Cochl-branded collateral — decks, documents, brochures, and social media banners — from raw user content. It is organized as a small router over a **template registry** and a shared **brand core**, so it scales to many templates without bloat.

## How this skill is organized
- **[`references/brand-core.md`](references/brand-core.md)** — the single source of brand truth: color, glow motif, typography, logo, and (for decks) the shared HTML→PPTX / page-nav / output / QA machinery. Every template inherits this.
- **[`references/registry.md`](references/registry.md)** — the index of every template (ready ✅ and planned 🟡), tagged by team/use-case, each pointing to its spec.
- **`references/<type>/`** — specs grouped by artifact type: `decks/`, `docs/`, `brochure/`, `social-kit/`.

**Teams are tags in the registry, not separate skills.** The same template (e.g. an onboarding or review deck) serves many teams; route by *what the artifact is*, then filter by team/use-case.

## Routing procedure
1. **Identify the artifact type** from the request: slide deck / presentation → `decks/`; developer or reference document → `docs/`; brochure / 제품 소개서 / 1-pager / leaflet → `brochure/`; social media banner (LinkedIn/YouTube/Medium/Notion/OG, "banner kit" / "press kit") → `social-kit/`.
2. **Open [`references/registry.md`](references/registry.md)** and match the request to a row (use the team/use-case tags to disambiguate).
3. **Open that row's spec and follow it as authoritative** — it defines structure, layouts, copy patterns, and heading treatment, and it inherits `brand-core.md`. Read `brand-core.md` too if you haven't this session.
   - If the row is **🟡 planned**, build it now on the shared structure: create the spec at the listed path (inheriting `brand-core.md`, reusing the deck machinery — don't restate it), produce the artifact, and flip the registry row to ✅.
   - If it's a deck with **no matching row**, use [`references/decks/generic-deck-template.md`](references/decks/generic-deck-template.md).
4. **Read `brand-core.md` before writing any pixel.** When a spec and brand-core disagree, the spec wins only for what it *explicitly* overrides.

Two artifact families route to sibling skills, not here: **design reviews** → `design-review`; **styled proposal documents** → `proposal-doc`.

## What the user provides
Any of: product/company name, audience, key messages/data points, or a file (JSON / PRD / brief). Infer the rest; never ask for more than what's needed to start.

## Facts & fabrication (hard rule)
Never invent company facts. Use only user-confirmed numbers, names, logos, quotes, and dates. Anything unconfirmed → mark **`[NEEDS INPUT]`** in place and list it back to the user; do not fill it with plausible-looking placeholders.

## Output
Build the primary artifact first, then ask which format(s) to save (decks: **PPTX / HTML / both**; SVG artifacts: deliver `.svg` + rendered `.png`). Details and the exact export recipe are in `brand-core.md` (§4).
