# Brand QA checklist

Run before delivering any Cochl artifact. Brand items only — layout and structure checks stay in each skill's own QA list. "Theme" means the file the template chose: `themes/plex.md` (default) or `themes/pt-template.md`.

## Theme and tokens
- [ ] The theme's `:root` block is pasted into the output `<style>` before any template CSS.
- [ ] Every color and font in the output CSS is a `var(--token)` from the chosen theme — no literal hex, no font name outside the `:root` block (editable SVGs excepted, see `themes/plex.md`).
- [ ] **Token-name check** — grep the generated CSS for `--` custom properties; each one is a canonical name from the theme (plex: `--bg`, `--panel`, `--panel-2`, `--border`, `--text`, `--text-soft`, `--muted`, `--placeholder`, `--accent`, `--accent-purple`, `--mint`, logo/signal tokens, …). Flag any alias (`--indigo`, `--purple`) or invented token and rename it to the theme token — never ship a parallel name.
- [ ] plex output never uses the superseded navy palette (`--pt-navy-*` belong to pt-template only).

## Color, gradient and glow
- [ ] plex decks: slide backgrounds `--bg` (cover/CTA may be full-bleed `--bg-pure` + glow); cards `--panel`. pt-template decks: content slides `--col-light-bg`, cover/section-break/CTA on the dark master background.
- [ ] The brand gradient (`--grad-brand` / `--grad-main`) appears only in approved positions: stat/KPI text, thin accent underline (≤3px, ≤120px), cover/CTA overlays, timeline tracks, pillar-card top borders, one `grad-text` keyword per slide title. Never on card backgrounds, body text or table rows.
- [ ] At most one glow per slide/canvas, never behind dense data.

## Fonts
- [ ] Fonts come from the theme's font roles and the family's heading treatment (`brand-core.md` §2): plex `--font-sans` / `--font-mono` (plus `--font-body`, `--font-ui`, `--font-quote`, `--font-doc` where the skill uses them); pt-template `--font-heading` / `--font-body` / `--font-web`.
- [ ] The Google Fonts `<link>` for those families is present in `<head>`.

## Logo
- [ ] The real logo file is embedded (never a text `cochl.` placeholder): white logo on dark surfaces, standard color logo on light surfaces. Symbol gradient not recolored.
- [ ] Decks: white logo bottom-left on the cover and in the footer chrome, opacity 0.70.
- [ ] **Aspect ratio** — for every logo/icon image (cover wordmark included), the rendered width:height ratio matches the source file. Any flex-child logo constrained by height sets `width:auto; align-self:flex-start;`. Verify the rendered ratio; a layout that dodges the bug by accident (e.g. `position:absolute`) is not a pass for the next deck.

## Company facts
- [ ] Contact, web and location on thanks/contact/closing slides match `brand-core.md` §3b verbatim — not guessed, not left `[NEEDS INPUT]`.

## NEEDS INPUT
- [ ] **Whole-document grep** — scan every page/slide/face (not just the one holding the primary stat band) for bare numerals, percentages, `ms` and `$` amounts; any value without the `.needs-input` class and without matching user input is flagged and reported. Cover hero stats get the same rigor as a back-side stat band.
- [ ] **Hero-figure confirmation** — every stat in a hero/KPI position traces to a value the user supplied and confirmed as measured; otherwise it is `[NEEDS INPUT]`.
- [ ] **Style integrity** — no `.needs-input` element carries an inline `style` that sets `color`; strip any override so the default (accent color + dashed underline + italic) applies (`brand-core.md` §1b).
- [ ] **Bracket format** — every occurrence of the marker, prose and captions included, is exactly `[NEEDS INPUT]` (`brand-core.md` §1b).
- [ ] **Stat caption** — every hero/stat `[NEEDS INPUT]` has the fixed caption "Pending verified research — do not present without a sourced figure." directly beneath it (`brand-core.md` §1d).
- [ ] **Competitor cards** — each competitor card's title slot carries `[NEEDS INPUT]` unless the user supplied a confirmed name for that card; check each card independently (`brand-core.md` §1c).
- [ ] **Version consistency** — a language/audience variant keeps every `[NEEDS INPUT]` its source had; if its count falls below half the source's, re-review before saving.
- [ ] **Placeholder variables** (proposal-doc) — every unfilled variable uses the `.var` span in `--doc-link`.

## Copy
- [ ] **Closing copy** — closing/subhead lines use only the vocabulary of the deck type being built; no fundraising language outside an investor deck (`brand-core.md` §2c).
- [ ] **Headlines** — no headline matches an *Overused headline template* and no two adjacent slides share a headline structure (`brand-core.md` §2b).
