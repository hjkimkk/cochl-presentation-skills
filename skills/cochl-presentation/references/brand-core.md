# Cochl Brand Core — single source of truth

Every template in this skill (decks, docs, brochure, social kit) inherits this. A template spec may **extend** or **override** specific tokens (e.g. a light-theme doc), but it must not silently redefine the brand. When a spec and this file disagree, the spec wins **only for what it explicitly overrides**.

> This supersedes the old `#0B1F3A / #6B4EFF / #2F80ED` "enterprise navy" tokens that earlier versions of this skill used. The current Cochl system is **near-black + indigo + purple→blue glow**. Do not use `#0B1F3A` as a background.

---

## 1. Color

```css
/* Surfaces (dark — default) */
--bg:        #0b0b12;   /* page / slide background (near-black) */
--bg-pure:   #000000;   /* full-bleed cover/CTA base */
--panel:     #14141c;   /* cards, table surfaces, drop-zones */
--panel-2:   #1b1b26;   /* raised / hover surface */
--border:    rgba(255,255,255,0.08);

/* Ink */
--text:      #FFFFFF;
--text-soft: #c9c9d4;   /* body on dark */
--muted:     #9aa1ac;   /* captions, labels */
--placeholder:#565b6b;  /* template placeholder text (blank templates only) */

/* Brand accents — these token NAMES are canonical; every deck reuses them as-is (no --indigo/--purple aliases) */
--accent:        #4B68FF;   /* primary accent (indigo) — subtitles, glows, links, accent underline */
--accent-purple: #832BFB;   /* secondary accent (purple) — gradient + glow partner */
--mint:          #A6F0CE;   /* tertiary accent (B2B / strategy secondary) */

/* Logo symbol gradient (do not recolor) */
--logo-g1:   #9827FF;   /* → */ --logo-g2: #4B7EFF; /* → */ --logo-g3: #00D7FF;

/* Signals (use sparingly) */
--danger: #EB5757; --success: #10B981; --warning: #F59E0B;
```

**Glow motif** — the Cochl signature. A soft radial, indigo core → purple mid → transparent, placed off-center behind hero content:
```css
radial-gradient(closest-side,
  rgba(75,104,255,0.55) 0%, rgba(131,43,251,0.22) 50%, rgba(75,104,255,0) 100%)
```
Max **one** glow per slide/canvas. Never behind dense data.

**Gradient rule** — the purple→blue gradient (`linear-gradient(135deg,#832BFB,#4B68FF)`) applies ONLY to: KPI/stat value text (`background-clip:text`), a thin accent underline (≤3px, ≤120px), cover/CTA overlays, timeline tracks, and pillar-card top borders. Never on card backgrounds, body text, or table rows.

## 1b. NEEDS INPUT component (single definition — do not restyle per template)

The one and only visual treatment for an unconfirmed value. Every template inherits this exact class and token — never introduce a second treatment (amber text, mint badge, blue accent, etc.) for the same state.
```css
.needs-input{ color:var(--accent); border-bottom:1px dashed var(--accent); font-style:italic; }
```

**Never add a color-setting inline style to an element with the `.needs-input` class** — no `style="color:inherit"`, `style="color:#fff"`, or any other inline `color` override, however it got there (inherited from a parent, copy-pasted from a styled neighbor, etc.). An inline override silently defeats the whole point of the class: the text renders as plain confirmed-looking copy again, and the warning is lost with nothing in the markup to flag it. NEEDS INPUT text always keeps its default style — accent color + dashed underline + italic — with no exceptions (see §4 → NEEDS INPUT style-integrity check).

**Marker text is always bracketed — no exceptions.** The literal marker text is always `[NEEDS INPUT]`, brackets included, every time, in every template and every case. Rendering the bare words `NEEDS INPUT` without the brackets is not a lighter variant of the same marker — it is a different, non-canonical format, even when the `.needs-input` CSS class and styling are applied correctly. One case using bracketed markers throughout and another using unbracketed markers throughout are not two acceptably consistent renderings; both are wrong the moment they diverge from `[NEEDS INPUT]`. This is not limited to the styled data-field marker itself — any literal appearance of the phrase anywhere in the document, including a section caption or note that references the concept in prose, must also carry the brackets; a deck with every data-field marker correctly bracketed but a caption mentioning bare NEEDS INPUT is still non-compliant, not "mostly right." See §4 → NEEDS INPUT bracket-format check.

## 1c. Competitor profile/card component — title-level NEEDS INPUT (single definition — do not restyle per template)

Any card or profile component that stands in for a specific competitor — market-competitive's `competitor-profiles` archetype cards, investor's `competitors-cards`, or any future template's competitor grid — must carry **`[NEEDS INPUT]`** (styled with the `.needs-input` class from §1b) **in the card's title/name slot itself** whenever the user has not supplied a real, confirmed competitor name for that slot.

A qualitative category label (e.g. "Speech AI," "Audio analytics," "Computer vision," "Traditional sensors") may still appear as a tag or subtitle under the title — that framing is not itself fabrication — but it is never a substitute for the title-level mark, and neither is a footnote or caption below the card: footnotes add supporting context only, they do not carry the mark. Apply this **per card, independently** — one correctly-marked card in a set does not exempt its siblings (see §4 → Competitor-card NEEDS INPUT check).

## 1d. NEEDS INPUT stat/number component — mandatory sourcing caption (single definition — do not omit per template)

Any oversized or hero-position stat rendered as `[NEEDS INPUT]` — a big-stat callout (e.g. the customer-gaps split), a headline number, a snapshot/KPI-grid card standing in for an unconfirmed figure — automatically carries a fixed caption directly beneath it, in `--muted`, smaller than the stat itself:

> Pending verified research — do not present without a sourced figure.

This caption is a **built-in part of the stat component itself**, the same way §1b's dashed-underline/italic treatment is non-optional — it is not supporting copy the builder adds or skips per slide. Every `.needs-input` hero/stat number carries it, every time; a slide that includes it and a slide that omits it are not two valid renderings of the same component. See §4 → NEEDS INPUT stat-caption check.

## 1e. Quote/citation component — uniform field-level confirmation (single definition — do not mix per field)

Any quote, testimonial, or citation component that names a source — a press quote's reporter attribution, a customer testimonial, or any similar quoted-attribution block — carries several source fields at once: the speaker's name, their title, and the publication or company they're attributed to. These fields are **not independently gradable**. If any one of them is unconfirmed, every field in that same citation is marked `[NEEDS INPUT]` (§1b) at the same level — never a mix of bracketed and unbracketed, real-sounding fields within one citation.

A citation with `[Reporter Name]` / `[Title]` correctly bracketed sitting beside an unbracketed, real publication name (e.g. "TechCrunch") does not read as "partially confirmed" — it reads as a real quote, from a real outlet, attributed to a placeholder person, which is a worse fabrication risk than leaving the whole citation unconfirmed: nothing in the delivered document tells the reader the outlet name isn't itself sourced from that quote. The same applies when the quote body itself is unconfirmed placeholder copy — a note in the authoring template or spec marking it "sample quote for layout purposes" is not a substitute for marking the citation in the delivered document; a reader outside that authoring context has no way to see the disclaimer. Apply this **per citation, independently** — one correctly-bracketed citation does not exempt its neighbors. See §4 → Quote/citation field-consistency check.

## 1f. Repeated-instance fields (social handles, and similar) — never a shared guessed value (single definition — do not fill from another field)

Any component with multiple parallel instances of the same field type — a social-handle row (one handle per platform icon), a multi-language contact list, or any similar repeated slot — treats **each instance as independently unconfirmed** unless that specific instance has its own confirmed value. Being confirmed for one instance never carries over to the rest; apply this per instance, independently, the same way §1c and §1e apply per card and per citation.

A confirmed value from a **different field** does not transfer to a distinct field just because the two look related — e.g. §3b's confirmed web domain `www.cochl.ai` is not a confirmed social handle, even though a company's handle conventionally resembles its domain. Deriving or guessing one field's value from another field's confirmed status is exactly the fabrication this rule blocks: the domain being real doesn't make the handle real. Reusing that one guessed value across every repeated instance compounds the failure rather than diluting it — four platforms all showing the identical `@cochl.ai` is not four confirmed handles, it's one unconfirmed guess pasted four times with nothing to distinguish it from a genuinely verified account name. See §4 → Repeated-field confirmation check.

## 2. Typography

- **IBM Plex Sans** — headings & body. Weights: 700 stat/hero, 600 heading, 400 body, 300 italic tagline/quote.
- **IBM Plex Mono** — kickers, labels, counters, eyebrow tags, code. UPPERCASE + letter-spacing for labels.
- Google Fonts: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap`
- Editable-SVG artifacts (brochure/social) use a system stack `'IBM Plex Sans','Helvetica Neue',Arial` so the file stays editable without the font installed.

**Heading treatment differs per template family** (this is the intended variation, not drift):
| Family | Heading | Kicker | Secondary accent |
|---|---|---|---|
| Investor deck | IBM Plex Mono, UPPERCASE | mono | indigo |
| B2B / sales | IBM Plex Sans, Title Case | mono | mint |
| Strategy / QBR | IBM Plex Sans, Title Case | mono `STRATEGIC` | mint |
| Market / competitive | IBM Plex Sans, Title Case | mono | indigo |
| Brochure / social | per-template | mono | indigo |

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

Templates that reuse a shared closing layout (`thanks-contact` and similar) inherit the **structure**, never the **copy** — when adapting a closing slide from another deck's spec, check every line for phrases that only make sense in the source deck type, and rewrite them for the deck actually being built. See §4 → Closing-copy deck-type check.

## 3. Logo

White `cochl.` logotype (gradient symbol + white wordmark). Files:
- Raster (deck footer): `assets/cochl-logo-white.png` — the real Cochl logo (gradient symbol + white wordmark), matching the canonical source `cochlearai/cochl-dashboard-v2` @ `hjkim` · `assets/logo/header_logo_dark.png` (dark-theme = white-on-dark, correct for the near-black footer). Always embed this raster in the footer — never a text `cochl.` placeholder — and keep it in sync with that source.
- Vector inline (SVG artifacts): the gradient symbol path + white wordmark path — see the generators in `social-kit/`.
- Footer placement on decks: `bottom:60px; left:40px; height:20px; opacity:0.70`.

**Aspect-ratio safety — hard rule.** A logo or icon image constrained only by `height` inside a `flex-direction:column` container inherits `align-items:stretch` by default — nothing sets `align-items` on `section.slide{display:flex;flex-direction:column}`, so the browser fills the container's cross-axis (width) regardless of the image's own ratio. This is what broke the cover wordmark across all three Corporate Strategy & Roadmap test decks (D1/D2/D3): a source ratio of 4.73:1 rendered at roughly 48.18:1, about 10× distortion. Any aspect-ratio-sensitive image — the cover logo (`.cover-logo`) included, and any other logo/icon fixed only by height — must set `width:auto; align-self:flex-start;` (or an equivalent rule that keeps both dimensions tied to the source ratio) **by default**, never height-only. See §4 → Aspect-ratio check.

**Recurs across deck families — this is not a Corporate Strategy–specific bug.** The identical defect reappeared in the QBR / Board Update test decks (Q2, Q3): the same ~10× distortion (4.73:1 source → ~48.18:1 rendered) on the same shared `.cover-logo` element, inherited from this same cover layout. Q4 in that batch rendered correctly, but only because its logo happened to be positioned with `position:absolute`, which incidentally excludes it from the flex layout — that is an accidental escape from the bug, not evidence the rule was applied, and must never be copied as a fix pattern. The `width:auto; align-self:flex-start;` rule above is the only sanctioned fix; apply it by default to every flex-child logo/icon image regardless of deck family — don't rely on a layout technique dodging the bug by chance.

Never recolor the symbol gradient. On light surfaces use the standard color logo (see `brochure/assets/`).

## 3b. Company facts (single source — never re-derive)

These are the **confirmed** company values — use them verbatim on every thanks / contact / closing slide:

- **Contact:** contact@cochl.ai
- **Web:** www.cochl.ai
- **Location:** San Francisco, CA, USA

Do not substitute, guess, or leave `[NEEDS INPUT]` when this block already answers the field. Any company fact *not* listed here is still subject to the NEEDS INPUT rule (SKILL.md → Facts & fabrication).

---

## 4. Shared deck build machinery

Templates in `decks/` are self-contained **interactive HTML**, then optionally exported to PPTX. This machinery is identical across deck variants — the variant spec only supplies structure/copy/layouts.

### Page navigation (required on every deck)
Bottom pill navigator, no top nav bar:
```html
<div id="page-nav">
  <button class="pn-btn" id="pn-prev" onclick="pnPrev()">&#8249;</button>
  <span id="pn-counter">1 / N</span>
  <button class="pn-btn" id="pn-next" onclick="pnNext()">&#8250;</button>
</div>
```
```css
#page-nav{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:1000;
 display:flex;align-items:center;gap:18px;background:rgba(11,11,18,0.82);backdrop-filter:blur(14px);
 border:1px solid rgba(255,255,255,0.09);border-radius:99px;padding:9px 22px}
```
JS: `goTo(n)` scrolls `#slide-n` into view, updates `#pn-counter`, dims prev/next at ends; an `IntersectionObserver` (threshold 0.4) syncs the counter on scroll; ArrowRight/Down → next, ArrowLeft/Up → prev.

### Motion (CSS only)
`@keyframes fadeUp` on `.slide-inner` children with staggered `animation-delay` (0.1s steps); one-shot stat shimmer on load. No looping animation.

### HTML → PPTX (pixel-faithful)
Each slide becomes a full-bleed **1920×1080 PNG** placed on a 16:9 slide (glows/gradients/mono survive; primitive shape APIs do not).
1. Emit each `<section>` as a standalone 1920×1080 page (same CSS + `html,body{width:1920px;height:1080px;overflow:hidden}`), screenshot with `chrome --headless=new --screenshot=sNN.png --window-size=1920,1080 --force-device-scale-factor=1 --hide-scrollbars --virtual-time-budget=3500 file://…/slide-N.html`. (Combined-deck JS scroll is unreliable headless; standalone pages are not.)
2. python-pptx (`pip install --user python-pptx`):
```python
from pptx import Presentation; from pptx.util import Inches; import glob
prs=Presentation(); prs.slide_width=Inches(13.333); prs.slide_height=Inches(7.5)
blank=prs.slide_layouts[6]
for p in sorted(glob.glob('build/png/s*.png')):
    s=prs.slides.add_slide(blank); s.shapes.add_picture(p,0,0,width=prs.slide_width,height=prs.slide_height)
prs.save('{slug}_deck.pptx')
```
3. Delete intermediate PNGs; keep `.html` + `.pptx` (same basename/dir).

### Output flow (all deliverables)
Build the primary artifact first (HTML for decks; SVG for brochure/social), **then ask** which format(s) to save:
> "How should I save it — PPTX, HTML, or both?" → **Both** (recommended) · **PPTX only** · **HTML only**

Both files share basename + directory. Report the path(s) produced. (Editable-SVG artifacts deliver the `.svg` + a rendered `.png` preview.)

### Deck QA checklist
- [ ] Backgrounds `#0b0b12` (cover/CTA may be full-bleed black + glow); cards `#14141c`
- [ ] Gradient only in approved positions; ≤1 glow per slide
- [ ] IBM Plex Sans/Mono per the family's heading treatment
- [ ] Cover has white logo bottom-left, opacity 0.70
- [ ] Bottom page-nav present, no top nav; keyboard arrows work
- [ ] Every non-cover, non-statement slide has the footer chrome (logo bottom-left + deck title bottom-right). Grep the output for the footer class and confirm its count equals (slide count − cover − statement slides).
- [ ] Each heading has exactly one `grad-text` key phrase
- [ ] Card body ≤2 sentences; break slides at major transitions
- [ ] Self-contained (assets inline / no broken refs)

**Post-generation self-checks** (run these right after emitting the deck, before saving):
- [ ] **NEEDS INPUT grep (whole document)** — scan the text of **every page/slide/face of the document — not just the one holding the primary stat-band** — for bare numerals / percentages / `ms` / `$` amounts; any value with no `.needs-input` class and no matching user-provided input is flagged and reported back. A front cover's hero stats and callouts get the **same rigor** as a back-side stat-band — the hard rule is per value across the whole document, never applied on one page while another ships unmarked. (Guards the retail-brochure case: the back correctly marked its stats NEEDS INPUT while the cover's "90% detection accuracy in pilot stores" / "0 new hardware required" shipped as confirmed fact.)
- [ ] **Deck-type check** — if the content carries partnership keywords (MOU, co-development, OEM, SDK integration, joint go-to-market) but was built on the investor template, flag the routing (should be B2B — see SKILL.md Routing step 2).
- [ ] **Layout-pool check** — every layout id used is one the chosen spec defines; flag any ad-hoc / unregistered layout (see SKILL.md Routing step 5).
- [ ] **Image/icon-placeholder check** — scan **every** image/icon placeholder container in the document (e.g. `.p-right`, `.img-placeholder`, and image cards using the `--card-img` / `--img` fill); flag any container that is empty and carries no label or caption, and either report it explicitly or fill it — so no unlabeled blank image/icon slot ships. (Companion to the text NEEDS-INPUT grep above.)
- [ ] **Adjacent-figure check** — walk the deck in order and compare each slide's figures (`%`, `ms`, counts, `$`) against the previous 1–2 slides; flag any figure restated verbatim on adjacent slides and rewrite all but the first occurrence. (Guards the SecureBuild 6–7 case — the same 96.2% precision, 41% false-alarm reduction, and 120ms latency repeated across two neighbouring slides.)
- [ ] **Token-name check** — grep the generated CSS for `--` custom properties; every one must be a canonical shared name from §1 (`--bg`, `--panel`, `--panel-2`, `--border`, `--text`, `--text-soft`, `--muted`, `--placeholder`, `--accent`, `--accent-purple`, `--mint`, plus the logo/signal tokens). Flag any deck-specific alias (`--indigo`, `--purple`) or invented token — rename it to the shared token, don't ship a parallel name. (See registry.md → "Shared CSS token names are canonical.")
- [ ] **Headline-template check** — read every headline / section title against the §2b *Overused headline templates* list; flag any that matches a listed structure (`The Blind Spot in X-Only Y`, `One A, N B`, `Where the [X]`, …). Separately, walk the deck in slide order and compare each headline's sentence structure against the previous 1–2 slides specifically — flag any adjacent/consecutive pair sharing a structure even if neither alone matches a listed template. Rewrite each flagged one into a different structure. (Guards the D1 case: slide 9 "Where the Budget Shifts" → slide 10 "Where the Savings Go" — adjacent reuse the deck-wide dedup check alone missed.)
- [ ] **Version-consistency NEEDS INPUT check** — when this deck is a language or audience variant of another (e.g. an English deck re-rendered for a Korean board), every value the source marked `[NEEDS INPUT]` must still be marked here, and the variant's `[NEEDS INPUT]` count is compared to the source's; if it falls below **half** the source count, re-review the variant before saving — a variant with far fewer marks is almost always leaking unconfirmed figures the source correctly withheld. (Guards the D3 case: D3 marked only 4 where D1/D2 marked 34/33 of the same revenue/NRR/accuracy/uptime/margin/customer figures on slides 9 & 11.)
- [ ] **Figure-consistency check** — when the same target/goal figure is presented on more than one slide (e.g. an annual target restated as a bridge/waterfall endpoint), diff its numeric value across every occurrence; flag any mismatch as a contradiction unless the restated value is within **±1%** of the first occurrence, in which case it may be labeled "rounded" — anything beyond that band may not use that label and must be reconciled. (Guards the D3 case: slide 9's $6.8M annual target vs. slide 10's $6.1M bridge endpoint, mislabeled as rounding.)
- [ ] **NEEDS INPUT style-integrity check** — grep the generated HTML for any `.needs-input` element carrying an inline `style` attribute that sets `color` (e.g. `style="color:inherit"`, `style="color:#fff"`); flag every match and strip the inline override so the element falls back to the default `.needs-input` style (accent color + dashed underline + italic). (Guards the D3 case: 3 NEEDS INPUT labels on slide 13 carried `style="color:inherit"` and rendered as plain white text, losing the visual warning — the same content on D2 slide 13 was unaffected.)
- [ ] **Hero-figure confirmation check** — for every stat rendered in a hero/KPI position (a large callout, a headline number, a snapshot/KPI-grid card — e.g. ARR, YoY growth, churn, and similar financial figures), confirm it traces to a value the user explicitly supplied and confirmed as measured. Any hero-position figure without that confirmation must be `[NEEDS INPUT]`, not a bare number, however plausible it reads. (Guards the D2 case: slide 3's $3.4M ARR / 183% YoY growth / 6% churn were exposed as confirmed `kpi-value` figures with no caveat.)
- [ ] **Aspect-ratio check** — for every logo/icon image in the deck (the cover wordmark included), compare the rendered width:height ratio against the source file's ratio; flag any mismatch beyond a trivial rounding difference — regardless of which CSS technique positions the image, verify the actual rendered ratio rather than trusting that a given layout approach is safe. (Guards the D1/D2/D3 case: all three decks' cover `.cover-logo` rendered at ~48.18:1 against a 4.73:1 source — `section.slide{display:flex;flex-direction:column}` sets no `align-items`, so the default `stretch` forced the height-only-constrained logo's width to fill the container. Recurred in the QBR / Board Update Q2/Q3 test decks with the identical ~48.18:1 distortion; Q4 in the same batch passed only because `position:absolute` incidentally excluded its logo from the flex layout, not because the rule was applied — an accidental pass on one deck never exempts the next deck built the same way.)
- [ ] **Competitor-card NEEDS INPUT check** — for every competitor profile/card component in the deck (e.g. market-competitive's 4 archetype cards, investor's competitors-cards), confirm the card's title/name slot itself carries `[NEEDS INPUT]` unless the user supplied a real, confirmed competitor name for that specific card; check **each card independently** — do not assume the rule was applied deck-wide just because one card in the set is marked. A category tag (Speech AI, Audio analytics, Computer vision, Traditional sensors, or similar) is not a substitute for the title-level mark, and neither is a footnote (see §1c). (Guards the market-competitive Case 1 vs. Case 2 divergence: slide 6's 4 archetype cards shipped with no `[NEEDS INPUT]` mark on any card, while the equivalent cards in Case 2 were handled correctly.)
- [ ] **NEEDS INPUT stat-caption check** — for every oversized/hero stat rendered as `[NEEDS INPUT]` (e.g. the customer-gaps big-stat, a hero KPI value, a snapshot/KPI-grid card), confirm the fixed caption "Pending verified research — do not present without a sourced figure." appears directly beneath it; flag any hero-stat `[NEEDS INPUT]` missing this caption (see §1d). (Guards the market-competitive Case 1 vs. Case 2 divergence: slide 10's hero stat carried the caption in Case 2 but shipped without it in Case 1.)
- [ ] **Closing-copy deck-type check** — read the closing/subhead copy (thanks line, action-plan closer, ask-adjacent qualifiers) against the deck type actually being built; flag any phrase that belongs to another deck type's vocabulary (fundraising language — "funding round," "the ask," "Pitch Closing Questions" — appearing outside an investor deck is the common case) and rewrite it for this deck's own purpose (see §2c). (Guards the market-competitive Case 2 case: slide 13's closing carried the investor template's "not a funding round" phrasing into a deck with no ask or round.)
- [ ] **NEEDS INPUT bracket-format check** — grep every occurrence of the marker text across the whole document — including prose/caption mentions, not just styled data-field markers — and confirm each one is written exactly `[NEEDS INPUT]`, brackets included; flag any bare `NEEDS INPUT` with no brackets, even where the `.needs-input` class and styling are otherwise correctly applied (see §1b). An entire case being internally consistent is not a pass — one case rendering every marker unbracketed and another rendering every marker bracketed is still a divergence from the single canonical format, and a case that gets its data-field markers right while leaving a caption's bare mention unbracketed is only partially compliant, not a pass. (Guards the market-competitive Case 1 vs. Case 2 divergence: Case 1's 32 markers all shipped as bare `NEEDS INPUT`, Case 2's 34 markers all shipped as `[NEEDS INPUT]`. Also guards the QBR case: Q2 shipped 0 NEEDS INPUT occurrences, Q3 shipped 18 all unbracketed, and Q4 shipped 29 data-field markers bracketed but still had 2 separate section-caption mentions of the bare phrase — proof that bracketing the data fields alone doesn't clear the check.)
- [ ] **Quote/citation field-consistency check** — for every quote/testimonial/citation component in the document, check its source fields (name, title, publication/media name, company name) together: if any one field is `[NEEDS INPUT]`, confirm every other field in that same citation is too — flag any citation mixing a bracketed field with an unbracketed, real-sounding value (e.g. a bracketed `[Reporter Name]`/`[Title]` beside an unbracketed real outlet name), and flag a citation whose quote body itself is unconfirmed placeholder copy but whose attribution fields aren't bracketed to match (see §1e). (Guards the press/media kit case: page 4's first quote bracketed `[Reporter Name]`/`[Title]` but left the publication name as the real, unbracketed "TechCrunch," while the quote body itself was acknowledged elsewhere only as sample copy for layout — a single citation carrying three different confirmation levels at once.)
- [ ] **Repeated-field confirmation check** — for every component with parallel repeated instances of one field type (social handles across platform icons, a multi-instance contact/language list, or similar), confirm each instance independently: flag any instance showing a real-looking, confirmed-looking value with no user-supplied confirmation for that specific instance, and flag the same value repeated across multiple instances without each one separately confirmed — including a value borrowed from a different, genuinely confirmed field (e.g. a web domain reused as a handle) rather than confirmed for the field it's actually filling (see §1f). (Guards the press/media kit case: page 5's 4 social-platform icons all displayed the identical handle "@cochl.ai" as confirmed, apparently derived from the confirmed web domain in §3b rather than an actually-confirmed handle for any of the 4 platforms, with no `[NEEDS INPUT]` mark distinguishing the guess from a verified account.)
- [ ] **Card-layout reuse check** — when a card-type layout already used elsewhere in the deck is reused for a different section, confirm at least one compositional element changed (card aspect ratio, image presence/absence, or an equivalent structural element) so the two sections read as visually distinct; flag any pair that is structurally identical apart from copy (see SKILL.md Routing step 5). (Guards the market-competitive case — in both Case 1 and Case 2: slide 6's `competitor-profiles` and slide 11's `strategic-takeaways` shipped the same 4-card + image-block composition with no distinguishing element, despite covering unrelated content — external competitor profiles vs. Cochl's own strategic edge.)
