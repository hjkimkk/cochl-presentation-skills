# B2B Partnership & Sales Proposal Deck — Official Cochl Template

Source of truth for the **B2B partnership / sales proposal** variant. Derived from the official
22-page Cochl "B2B Sales Deck Presentation" (1920×1080). Page previews live in
[`b2b-sales-proposal-previews/`](b2b-sales-proposal-previews/) (`p01`–`p22`). Treat this file as
authoritative. It is a **sibling of the investor template** — same Cochl dark + indigo + glow
system — but with a **Sans (not mono) heading treatment**, a **mint/teal secondary accent**, and a
sales/partnership slide set.

Template ships with placeholder tokens (`xxk`, `xx%`, `$XXXX`, `Solution 1`, `Capability 1`,
`Value 1`, `Target audience 1`, `Case study 1`, `Name One`, `[Step Name]`, `NAME`, `Aug 2026`,
Lorem ipsum). Map them to real content or explicit **`NEEDS INPUT`** slots. Never invent facts.

---

## Design system (B2B variant)

Use the plex theme tokens as-is — this variant defines **no tokens of its own** (no `--near`,
`--img`, `--font-head`, or any other alias; see `../../../cochl-design/core/qa-checklist.md` →
Token-name check). Which canonical token plays which role here:

| Role | Token (from `themes/plex.md`) |
|---|---|
| Most content slides background | `var(--bg-pure)` |
| Cover & glow slides background (near-black charcoal) | `var(--bg-near)` |
| Dark rounded cards | `var(--panel-3)` |
| Light image-placeholder fill | `var(--img-placeholder)` |
| Text / muted body + labels | `var(--text)` / `var(--muted-2)` |
| Glows, arrows, links | `var(--accent)` (gradient partner `var(--accent-purple)`) |
| Secondary accent — timeline highlight bars, status pills, comparison ✓ | `var(--mint)` |
| Slide titles, body, metric values | `var(--font-sans)` |
| Kicker, meta (NAME / date), small labels | `var(--font-mono)` |

Layout values (plain CSS values, not tokens — write them inline in the rule that uses them):
card corner radius `20px`; content side margin `110px` at 1920 wide.

```text
title:        var(--font-sans) / clamp(40–56px) / 700 / Title Case / var(--text)   ← HEADINGS ARE SANS, TITLE CASE (this variant's signature; NOT mono/uppercase)
kicker:       var(--font-mono) / 12–13px / 500 / .15em / UPPERCASE / var(--muted-2) (e.g. CONFIDENTIAL + PROPRIETARY)
metric value: var(--font-sans) / very large / 700
body:         var(--font-sans) / 18–20px / 400 / lh 1.55 / var(--muted-2)
```

**Contrast with the investor variant:** investor = **mono UPPERCASE** titles; B2B = **Sans Title-Case**
titles. Both share near-black/indigo/glow, the `cochl.` footer logo, and the THANKS/contact closing.

### Glow motifs (CSS radial/linear — never raster)
1. **Bottom-center crescent** (cover): indigo→blue arc curving up from the bottom-center.
2. **Right crescent** (agenda): large arc glow on the right.
3. **Upper-right band** (problem, solution, thanks): glow bleeding from the top-right.
4. **Blue radial** (workflow left, clients bottom, team bottom): soft indigo/purple radial.

### Chrome
White logo (`../assets/cochl-logo-white.png`, the real file — never a text `cochl.`) **bottom-left
on the cover at opacity 0.70**, and the footer chrome (same logo bottom-left at 0.70 + deck title
bottom-right) on every non-cover, non-statement slide — per `../../../cochl-design/core/qa-checklist.md`
→ Logo and `../deck-engine.md` → Deck QA. The source PDF's bottom-right cover logo is superseded by
core. Optional mono kicker (`CONFIDENTIAL + PROPRIETARY`) top-left on narrative slides.

---

## The 23 layouts

| # | Layout id | Intent | Preview |
|--:|---|---|---|
| 1 | `cover` | Title + presenter/date | p01 |
| 2 | `agenda` | Numbered agenda list + page numbers | p02 |
| 3 | `problem` | Title + body (top-right glow) | p03 |
| 4 | `solution` | Title + body + 4 image cards | p04 |
| 5 | `workflow` | Body steps + big 01/02/03 numerals | p05 |
| 6 | `objective` | Centered body + large image | p06 |
| 7 | `values` | Title + 3 stacked value blocks | p07 |
| 8 | `capabilities` | Title + 4 image cards + body | p08 |
| 9 | `data-highlights` | Bento metric grid | p09 |
| 10 | `target-audiences` | 3×3 audience grid + 3-tier pyramid | p10 |
| 11 | `partnership` | Title + body + large image | p11 |
| 12 | `our-clients` | Client logo wall | p12 |
| 13 | `next-steps` | 2 step cards (image + step + body) | p13 |
| 14 | `our-approach` | Title + body + 5-image grid | p14 |
| 15 | `deliverable` | Deliverable-feature list + 2 images | p15 |
| 16 | `timeline` | Gantt (month columns + task bars) | p16 |
| 17 | `case-study` (grid) | Title + case + 5-image grid | p17 |
| 18 | `case-study` (row) | Title + 3-image row + body | p18 |
| 19 | `case-study` (single) | Title + body + one large image | p19 |
| 20 | `pricing` | 3 pricing tier cards | p20 |
| 21 | `team` | Row of members (avatar + name + role) | p21 |
| 22 | `thanks-contact` | Thanks + contact row | p22 |
| 23 | `comparison-table` | Cochl vs. alternatives feature table | — (added; no source page) |

### Layout notes
- **cover** — big Sans-bold Title-Case title, `NAME` / `Aug 2026` (mono) meta above the logo, white
  logo **bottom-left at opacity 0.70** (core rule; not bottom-right as in the source PDF),
  **bottom-center blue crescent** glow.
- **agenda** — left "Agenda" title; a vertical list of items each with a right-aligned page number
  and a thin divider; **right crescent** glow.
- **problem** — mono kicker + title + 2 body paragraphs; upper-right glow band.
- **solution** — title + body, then a row of **4 cards** (light image placeholder + `Solution N`).
- **workflow** — left: 3 numbered rows of body copy separated by rules; right: oversized `01 02 03`
  numerals; blue radial glow on the left.
- **objective** — centered body paragraph over a **large image placeholder** below.
- **values** — title left; right column of 3 stacked `Value N` + body blocks.
- **capabilities** — title + **4 cards**, each light image placeholder + `Capability N` + body.
- **data-highlights** — **bento grid**: dark rounded cards, each a muted label + big Sans-bold value
  (`xxk`, `xx%`, `xxx`, `xx countries`); one tall right card + one wide bottom card.
- **target-audiences** — left **3×3 grid** of `Target audience N` (bold label + `→` + muted body),
  rows split by full-width rules; right a **1px-outline triangle** with tiers **Primary / Secondary /
  Tertiary** and small upward arrows.
- **partnership** — title + 2 body paragraphs left, large image placeholder right.
- **our-clients** — title + a **logo wall** (rows of partner/customer logos); blue glow bottom.
- **next-steps** — title + **2 step cards**: image placeholder, `Step N [Step Name]`, body.
- **our-approach** — title + body ("Solution") left; **5-image grid** (3 top + 2 bottom) right.
- **deliverable** — title + left list of `Deliverable feature` items; right **2 large images**.
- **timeline** — **Gantt**: month column headers (Sep…Jan) with vertical rules; horizontal **task
  bars** (white with black label inside) spanning their duration; **mint (`--mint`) bars** for
  special items (Holiday, Quick Wins). Left: `Final Launch: …` + `Note:` copy.
- **case-study** (3 variants) — title + `Case study N` + body, paired with a 5-image grid (p17),
  a 3-image row (p18), or a single large image (p19). Pick per available imagery.
- **pricing** — **3 bordered tier cards**: `$XXXX` + `per unit` + a ✓ feature checklist.
- **team** — title + a **row of members**: circular avatar placeholder, `Name`, role; purple/blue
  glow bottom; caption "Executive team, Board members, existing investors, etc."
- **thanks-contact** — mono kicker + Sans-bold `THANKS!` + sub-line (`Pitch Closing Questions /
  Ask!`) + contact row: `contact@cochl.ai` · `www.cochl.ai` · `San Francisco, CA, USA` — the
  confirmed values from `../../../cochl-design/core/brand-core.md` §3b, used verbatim (never
  `[NEEDS INPUT]`); upper-right glow.
- **comparison-table** — for a competitor / alternatives slide. Title + optional one-line body, then
  a table on `var(--bg-pure)`: first column = criteria (`var(--text)`, 18px, 600); 2–4 alternative
  columns, then the **Cochl column last**, its header in `var(--text)` on a `var(--panel-3)` column
  fill with a 2px `var(--mint)` top rule. Header row in `var(--font-mono)` 13px uppercase
  `var(--muted-2)`; rows split by 1px `var(--border)` rules, no zebra fill, no gradient. Cells:
  ✓ in `var(--mint)`, ✕ / "—" in `var(--muted-2)`, short text (≤4 words) in `var(--muted-2)`;
  max 6 criteria rows. Competitor names the user did not supply are `[NEEDS INPUT]` in each
  header independently (`../../../cochl-design/core/brand-core.md` §1c); a one-line source
  footnote in `var(--muted-2)` 14px under the table. One glow max, never behind the table.

---

## Mapping content onto the template

A B2B partnership / sales proposal typically runs: cover → agenda → problem → solution →
capabilities/workflow → data-highlights/traction → target-audiences → partnership → clients/case-
studies → deliverables → approach → timeline → pricing → team → next-steps/thanks. Competitor or
alternatives content goes on `comparison-table`. Drop the slides you don't need; every deck need not
use all 23. Keep the Sans-bold-Title-Case headings + near-black/indigo/mint system and the bottom
page-nav + keyboard nav from `../deck-engine.md` → Page navigation. Every unconfirmed figure stays a
visible `[NEEDS INPUT]` slot. Output follows `SKILL.md` → Output: build the HTML, export the PPTX,
then the architecture page — always all three files, no format question.
