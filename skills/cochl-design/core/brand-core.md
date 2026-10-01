# Cochl Brand Core

Shared by every Cochl skill. Values live in `themes/plex.md` (default) and `themes/pt-template.md`; this file holds the rules. A template may choose a theme and use its tokens — it may not define new color or font values.

- **plex** (default) — near-black `--bg` + indigo `--accent` + purple→blue glow, `--font-sans` / `--font-mono`. Every skill uses it unless a template says otherwise.
- **pt-template** — the official PT template style (`--font-heading` + `--font-body`, purple `--c-primary`, mixed light/dark slides). Used by `pitch-deck`.

The old "enterprise navy" palette (navy slide background + violet + blue) is superseded by plex. It survives only as `--pt-navy-*` tokens inside pt-template, so existing pitch-deck layouts keep rendering the same. Never use it for new plex work.

Brand QA for every deliverable: `qa-checklist.md`. Product UI (React): `tokens.md`.

---

## 1. Color and glow (plex)

Token names are canonical: every template reuses them as-is — `--bg`, `--bg-pure`, `--panel`, `--panel-2`, `--border`, `--text`, `--text-soft`, `--muted`, `--placeholder`, `--accent`, `--accent-purple`, `--mint`, plus the logo (`--logo-g1..3`) and signal (`--danger`, `--success`, `--warning`) tokens. Do not introduce deck-specific aliases (`--indigo` for `--accent`, `--purple` for `--accent-purple`) or invent tokens; if a value is missing, add it to the theme file first.

- **Surfaces:** near-black `--bg` for pages and slides; `--bg-pure` for full-bleed cover/CTA bases; `--panel` for cards and tables; `--panel-2` for raised/hover surfaces.
- **Accents:** indigo `--accent` is primary (subtitles, glows, links, accent underline); purple `--accent-purple` is its gradient and glow partner; `--mint` is the tertiary accent (B2B / strategy secondary).
- **Signals** (`--danger`, `--success`, `--warning`) are used sparingly.

**Glow motif** — the Cochl signature. A soft radial (`--glow`): indigo core → purple mid → transparent, placed off-center behind hero content. Max **one** glow per slide/canvas. Never behind dense data.

**Gradient rule** — the purple→blue gradient (`--grad-brand`: `--accent-purple` → `--accent`) applies ONLY to: KPI/stat value text (`background-clip:text`), a thin accent underline (≤3px, ≤120px), cover/CTA overlays, timeline tracks, and pillar-card top borders. Never on card backgrounds, body text, or table rows. (pt-template has its own `--grad-main` with the same placement rule.)

## 1b. NEEDS INPUT component (single definition — do not restyle per template)

The one and only visual treatment for an unconfirmed value. Every template inherits this exact class and token — never introduce a second treatment (amber text, mint badge, blue accent, etc.) for the same state.
```css
.needs-input{ color:var(--accent); border-bottom:1px dashed var(--accent); font-style:italic; }
```

**Never add a color-setting inline style to an element with the `.needs-input` class** — no `style="color:inherit"`, no `style="color:…"` with any value, no other inline `color` override, however it got there (inherited from a parent, copy-pasted from a styled neighbor, etc.). An inline override silently defeats the whole point of the class: the text renders as plain confirmed-looking copy again, and the warning is lost with nothing in the markup to flag it. NEEDS INPUT text always keeps its default style — accent color + dashed underline + italic — with no exceptions (see `qa-checklist.md` → NEEDS INPUT style integrity).

**Marker text is always bracketed — no exceptions.** The literal marker text is always `[NEEDS INPUT]`, brackets included, every time, in every template and every case. Rendering the bare words `NEEDS INPUT` without the brackets is not a lighter variant of the same marker — it is a different, non-canonical format, even when the `.needs-input` CSS class and styling are applied correctly. One case using bracketed markers throughout and another using unbracketed markers throughout are not two acceptably consistent renderings; both are wrong the moment they diverge from `[NEEDS INPUT]`. This is not limited to the styled data-field marker itself — any literal appearance of the phrase anywhere in the document, including a section caption or note that references the concept in prose, must also carry the brackets; a deck with every data-field marker correctly bracketed but a caption mentioning bare `NEEDS INPUT` is still non-compliant, not "mostly right." See `qa-checklist.md` → NEEDS INPUT bracket format.

## 1c. Competitor profile/card component — title-level NEEDS INPUT (single definition — do not restyle per template)

Any card or profile component that stands in for a specific competitor — market-competitive's `competitor-profiles` archetype cards, investor's `competitors-cards`, or any future template's competitor grid — must carry **`[NEEDS INPUT]`** (styled with the `.needs-input` class from §1b) **in the card's title/name slot itself** whenever the user has not supplied a real, confirmed competitor name for that slot.

A qualitative category label (e.g. "Speech AI," "Audio analytics," "Computer vision," "Traditional sensors") may still appear as a tag or subtitle under the title — that framing is not itself fabrication — but it is never a substitute for the title-level mark, and neither is a footnote or caption below the card: footnotes add supporting context only, they do not carry the mark. Apply this **per card, independently** — one correctly-marked card in a set does not exempt its siblings (see `qa-checklist.md` → Competitor-card NEEDS INPUT).

## 1d. NEEDS INPUT stat/number component — mandatory sourcing caption (single definition — do not omit per template)

Any oversized or hero-position stat rendered as `[NEEDS INPUT]` — a big-stat callout (e.g. the customer-gaps split), a headline number, a snapshot/KPI-grid card standing in for an unconfirmed figure — automatically carries a fixed caption directly beneath it, in `--muted`, smaller than the stat itself:

> Pending verified research — do not present without a sourced figure.

This caption is a **built-in part of the stat component itself**, the same way §1b's dashed-underline/italic treatment is non-optional — it is not supporting copy the builder adds or skips per slide. Every `.needs-input` hero/stat number carries it, every time; a slide that includes it and a slide that omits it are not two valid renderings of the same component. See `qa-checklist.md` → NEEDS INPUT stat caption.

## 2. Typography (plex)

- `--font-sans` — headings & body. Weights: 700 stat/hero, 600 heading, 400 body, 300 italic tagline/quote.
- `--font-mono` — kickers, labels, counters, eyebrow tags, code. UPPERCASE + letter-spacing for labels.
- Load fonts with the Google Fonts `<link>` in `themes/plex.md`. Editable-SVG artifacts (brochure/social) use the literal system stack given there so the file stays editable without the font installed.
- Other roles: `--font-body` (design-review body), `--font-ui` (design-review header bar), `--font-quote` (design-review quote slides), `--font-doc` (proposal-doc body).

**Heading treatment differs per template family** (this is the intended variation, not drift):
| Family | Heading | Kicker | Secondary accent |
|---|---|---|---|
| Investor deck | `--font-mono`, UPPERCASE | mono | indigo `--accent` |
| B2B / sales | `--font-sans`, Title Case | mono | `--mint` |
| Strategy / QBR | `--font-sans`, Title Case | mono `STRATEGIC` | `--mint` |
| Market / competitive | `--font-sans`, Title Case | mono | indigo `--accent` |
| Brochure / social | per-template | mono | indigo `--accent` |

## 2b. Copy variety (avoid AI-sounding repetition)

- Do not reuse the "We're not X — we're Y" (or any single-structure contrast) tagline more than once per deck. If the cover and the mission-statement both need a hook, write two different sentences — not two slots for the same line.
- **Vary headline sentence structure across decks.** Before writing any headline or section title, check it against the *Overused headline templates* list below (and the headlines already in this deck). Do not reuse a structure that's on the list or already used — these read as a house tic once they recur deck to deck. Reach for a different sentence shape (a question, an imperative, a plain declarative, a number-led line) instead of refilling the same mold with new nouns.

  **Overused headline templates — do not reuse** (append here as new tics are spotted, so later decks can check against it):
  - `The Blind Spot in [X]-Only [Y]` — the contrarian "hidden gap" frame.
  - `One [A], [N] [B]` — the one-vs-many scale contrast (e.g. "One Model, 37 Sound Classes").
  - `Where the [X]` — the "where it goes/shifts/comes from" frame (e.g. "Where the Budget Shifts" → "Where the Savings Go").

  When a drafted headline matches one of these shapes, rewrite it in a different structure before it ships.
- Do not repeat a headline stat verbatim across slides. When the same number must reappear (e.g. in both traction and a supporting callout), rephrase the sentence around it each time — vary which part of the sentence carries the number.
- **Track figures across adjacent slides.** When generating a slide, keep a running note of the statistics/figures presented on the previous 1–2 slides — percentages, latency (ms), counts, `$` amounts — and do not restate the same figures verbatim on an adjacent slide. When a figure must carry forward, reference it by meaning ("that same sub-frame latency") or fold it into a comparison instead of reprinting the number, so no two neighbouring slides read as a figure-for-figure restatement.
- **Track headline structure across adjacent slides.** Within one deck, consecutive/adjacent slides must not repeat the same headline sentence structure. Before writing a headline, compare it against the previous 1–2 slides' headline structure (not just the deck-wide *Overused headline templates* list) — if it overlaps, switch the sentence form (question, declarative, contrast) rather than refilling the same template with new nouns. (Guards the D1 case: slide 9 "Where the Budget Shifts" → slide 10 "Where the Savings Go", back-to-back reuse of the same "Where the ___" frame.)
- Before finalizing, scan all slide headlines / kickers / statements for near-duplicate sentences (>80% word overlap) and rewrite every repeat but the first.

## 2c. Deck-type copy provenance — closing/subhead phrase pools stay siloed per deck type

When generating closing, thanks, or subhead copy — the sub-line under a THANKS!/closing kicker, an ask-adjacent qualifier, or any short closing phrase — do not carry a phrase over from another deck type's copy pool. Investor language ("not a funding round," "Pitch Closing Questions / Ask!," anything that presumes a fundraising ask) has no place in a market-competitive, QBR, corporate-strategy, or brochure closing, and the reverse holds too: each deck type's closing subhead draws only from language appropriate to that deck's own purpose (e.g. market-competitive's `action-plan` closes on category ownership, not a funding ask).

Templates that reuse a shared closing layout (`thanks-contact` and similar) inherit the **structure**, never the **copy** — when adapting a closing slide from another deck's spec, check every line for phrases that only make sense in the source deck type, and rewrite them for the deck actually being built. See `qa-checklist.md` → Closing copy.

## 3. Logo

White `cochl.` logotype (gradient symbol + white wordmark). Files:
- Raster (deck footer): `../../cochl-presentation/references/assets/cochl-logo-white.png` — the real Cochl logo (gradient symbol + white wordmark), matching the canonical source assets/logo/header_logo_dark.png in the cochlearai/cochl-dashboard-v2 repo (branch hjkim). That is the dark-theme (white-on-dark) file, correct for the near-black footer. Always embed this raster in the footer — never a text `cochl.` placeholder — and keep it in sync with that source.
- Vector inline (SVG artifacts): the gradient symbol path + white wordmark path — see the generators described in `../../cochl-presentation/references/social-kit/README.md`.
- Footer placement on decks: `bottom:60px; left:40px; height:20px; opacity:0.70`.

**Aspect-ratio safety — hard rule.** A logo or icon image constrained only by `height` inside a `flex-direction:column` container inherits `align-items:stretch` by default — nothing sets `align-items` on `section.slide{display:flex;flex-direction:column}`, so the browser fills the container's cross-axis (width) regardless of the image's own ratio. This is what broke the cover wordmark across all three Corporate Strategy & Roadmap test decks (D1/D2/D3): a source ratio of 4.73:1 rendered at roughly 48.18:1, about 10× distortion. Any aspect-ratio-sensitive image — the cover logo (`.cover-logo`) included, and any other logo/icon fixed only by height — must set `width:auto; align-self:flex-start;` (or an equivalent rule that keeps both dimensions tied to the source ratio) **by default**, never height-only. See `qa-checklist.md` → Aspect ratio.

**Recurs across deck families — this is not a Corporate Strategy–specific bug.** The identical defect reappeared in the QBR / Board Update test decks (Q2, Q3): the same ~10× distortion (4.73:1 source → ~48.18:1 rendered) on the same shared `.cover-logo` element, inherited from this same cover layout. Q4 in that batch rendered correctly, but only because its logo happened to be positioned with `position:absolute`, which incidentally excludes it from the flex layout — that is an accidental escape from the bug, not evidence the rule was applied, and must never be copied as a fix pattern. The `width:auto; align-self:flex-start;` rule above is the only sanctioned fix; apply it by default to every flex-child logo/icon image regardless of deck family — don't rely on a layout technique dodging the bug by chance.

Never recolor the symbol gradient (`--logo-g1` → `--logo-g2` → `--logo-g3`). On light surfaces use the standard color logo: `../../cochl-presentation/references/brochure/assets/logo_basic.svg`.

## 3b. Company facts (single source — never re-derive)

These are the **confirmed** company values — use them verbatim on every thanks / contact / closing slide:

- **Contact:** contact@cochl.ai
- **Web:** www.cochl.ai
- **Location:** San Francisco, CA, USA

Do not substitute, guess, or leave `[NEEDS INPUT]` when this block already answers the field. Any company fact *not* listed here is still subject to the NEEDS INPUT rule (the calling skill's facts & fabrication rules, e.g. cochl-presentation SKILL.md → Facts & fabrication).
