# Cochl 101 — Class / Lecture deck (All / Education)

A **teaching deck** for a "101 class" — introduce a topic to beginners and walk them from *what it is* to *try it yourself*. This is the canonical **Cochl 101** template: use it for internal enablement, onboarding, an all-hands topic intro, a reading-group teach-out, or any "teach concept X to people who are new to it" talk.

**Editable Figma Slides (primary, 33 slides):** https://www.figma.com/slides/pXQZ3uLG34fLpafWDA92dl/Cochl-%E2%80%94-101-Class---Lecture-Template — present or duplicate this file for a real class, and fill every `[ placeholder ]`. Building a deck from this spec produces a faithful HTML render of all 33 slides (then optionally PPTX via the shared export machinery).

Inherits [`../brand-core.md`](../brand-core.md) for all tokens, typography (IBM Plex Sans/Mono + **IBM Plex Serif** for card/column titles), the glow motif, page-nav, HTML→PPTX export, output flow, and QA. This spec only defines the teaching structure, the content-intent format catalog, and the two visual signatures. **Reuse brand-core's CSS token names verbatim — `--accent` / `--accent-purple`, never `--indigo` / `--purple`.**

## Visual signature (this deck)
- **Light body, dark section slides.** Content slides use the Cochl **light** palette (white bg, near-black `#0b0b12` ink, indigo `#4B68FF` / purple `#832BFB` accents, soft `#F6F7F9` panels, `#e6e8ee` rule lines). Only the **Cover, the 8 section dividers, and the Q&A / Thank-you closer** stay **dark** (near-black + one purple→blue glow off-center right), so they punctuate the flow.
- **Editorial serif accents.** Card/column titles and comparison option headers are **IBM Plex Serif SemiBold** (e.g. `Think of it as…`, `[ Option X ]`). Kickers, section numbers, stat values, and small labels are **IBM Plex Mono** (uppercase, indigo, letter-spaced). Body and headings are IBM Plex Sans; each content-slide title carries a short **indigo underline**.
- **Cover pattern (dark):** two-column split — **left 60% text block, right 40% image.** Left column, vertically centered and top-down: mono kicker `COCHL · 101 CLASS` (indigo) → **two-line headline** (`[ Topic Name ]` bold near-white on line 1, `[ Subtitle ]` lighter weight on line 2) → one-line promise (grey) → a `PERIOD` / `PREPARED BY` metadata row (mono, muted). Right 40%: an **`image` placeholder box at ~4:5 portrait ratio** — a bordered panel labelled `image`, using the standard placeholder treatment until a real cover image is supplied; never omit it. Dark-slide footer chrome applies (`cochl.` logo bottom-left, `[Presentation Title]` mono bottom-right, per the logo-placement rule below). Keep this structure verbatim — do not collapse the two-line headline into one line or drop the right image column.
- **Content header pattern (every light slide):** mono kicker `SECTION · SLIDE NAME` (indigo) → bold near-black H2 → indigo underline → grey one-line subtitle.
- **Section divider pattern (dark):** large indigo mono number `01`–`08` → white bold section title → grey one-line intent line → `cochl.` logo bottom-left → `[Presentation Title]` mono footer bottom-right.
- **Logo placement — dark surfaces only (overrides brand-core §3 / footer-chrome QA for this light deck).** The `cochl.` logo is the **white** wordmark (`assets/cochl-logo-white.png`), legible only on dark backgrounds. Place it **only on the dark slides — the Cover, the 8 section dividers, and the Q&A / Thank-you closer.** **Never put the logo in a light content slide's footer:** on the white body the white wordmark disappears and only the gradient dot shows. Light content slides keep just the text footer (`[Presentation Title]` mono, bottom-right) — **no footer logo.** brand-core's footer-chrome rule ("logo bottom-left on every non-cover slide") and its QA count therefore apply, for this deck, to the **dark slides only**; do not add a light-slide footer logo to satisfy that global count.

## Structure — 33 slides, 8 sections mirrored by the Agenda
The deck opens on a Cover and an **Agenda** that lists the 8 sections; each section is a **dark divider** followed by its content slides; it ends on a **Q&A / Thank you** closer.

| # | Slide | Treatment | Content-intent format |
|---|---|---|---|
| 1 | Cover | **dark** | `COCHL · 101 CLASS` · `[ Topic Name ]` + `Subtitle` · one-line promise · Period · Prepared by · image |
| 2 | Agenda | light | two-column 01–08 index (section → slide) |
| 3 | **01 · Opening** | **dark** | divider — "set the stage" |
| 4 | Team | light | Introduce — speaker/team intro, 3 photo cards ([ Name ] / [ Role ]) |
| 5 | **02 · Concept** | **dark** | divider — "build the mental model" |
| 6 | What is X? | light | Explain — big one-sentence definition + 2 clarifier bullets + serif "Think of it as…" analogy card |
| 7 | X vs Y | light | Compare — 3-col table, criteria × 2 options, serif option headers, `· RECOMMENDED` |
| 8 | Terminology | light | Explain — 6-term serif glossary grid |
| 9 | Architecture | light | Explain — Input → Core·[X] → Output flow + one-line data-flow note |
| 10 | **03 · Problem / Background** | **dark** | divider — "the gap" |
| 11 | Problem List | light | 4-card problem grid |
| 12 | Timeline | light | 4-phase trajectory (Phase / milestone / year·status) |
| 13 | **04 · Principles** | **dark** | divider — "the rules that make it work" |
| 14 | Before / After | light | Compare — 2 panels + big `[ +NN% ]` proof stat |
| 15 | Good / Bad | light | 2 panels, do vs avoid, 3 examples each |
| 16 | Rules + Examples | light | 3 rules × ✓ example rows |
| 17 | **05 · Data / Experiment** | **dark** | divider — "show the evidence" |
| 18 | Metrics | light | Prove — 4 KPI columns (mono value, label, ▲/▼ delta) |
| 19 | Graph | light | Prove — 6-bar chart + Takeaway + Source |
| 20 | **06 · Case Study** | **dark** | divider — "see it in the wild" |
| 21 | Client / Application | light | image + "Where it's applied" ✓ list + Notes |
| 22 | Feature Overview | light | `AT A GLANCE` + 4 feature cards |
| 23 | Challenge → Solution | light | Apply — Challenge → Solution panels + Evidence/Result stat |
| 24 | **07 · Hands-on** | **dark** | divider — "try it yourself" |
| 25 | Exercise | light | Practice — Time chip + Goal + 3 steps (Set up / Do / Check) + Expected result |
| 26 | Live Demo | light | prototype image + Walkthrough + key moments + "Open demo" |
| 27 | **08 · Process & Closing** | **dark** | divider — "wrap up" |
| 28 | Process Timeline | light | 4 ordered steps |
| 29 | Takeaways | light | Close — 3 numbered takeaways |
| 30 | Next Steps | light | 5 numbered next actions |
| 31 | Future Plans | light | Near / Mid / Long-term horizons |
| 32 | Conclusion + Limitations | light | 2 columns — conclusion vs limitations |
| 33 | Q&A / Thank you | **dark** | `Q & A` · **Thank you** · presenter · email · lab/institution |

**Content-intent catalog.** The content slides are drawn from a reusable format library keyed by teaching intent — **Introduce · Explain · Compare · Prove · Apply · Practice · Process · Close** (the kicker prefix on each light slide, e.g. `EXPLAIN · ARCHITECTURE`). A real class picks the formats it needs from this catalog and drops the rest; you don't have to use all 33. Keep the section-divider cadence (one dark divider per section) whenever you keep a section.

**Density:** teaching-grade — one core idea per slide, ≤4–6 cards per grid, card body ≤2 short lines. Whitespace over boxes; borderless editorial cards with a thin top rule where the Figma uses them.

## Facts discipline (hard rule)
A 101 class is where a confident-looking wrong number sticks hardest with beginners. Every `[ placeholder ]` — topic, definitions, terms, metrics, `[ +NN% ]`, dates, client names, quotes — stays **`[NEEDS INPUT]`** (styled per brand-core §1b) until the presenter supplies a real, confirmed value, and is listed back to the user. Never fabricate a metric, competitor, or client name to "fill" a teaching slide. The Figma ships every value as a bracketed placeholder for exactly this reason.

## Build / edit
For a real class: duplicate the Figma file above, keep the formats you need from the catalog, and fill every placeholder. To rebuild elsewhere, follow this spec on `brand-core.md` (light body + dark dividers/closer, editorial serif accents) and the shared HTML→PPTX / page-nav machinery.
