# Deck Engine — shared deck build machinery

Brand rules (color, glow, type, logo, NEEDS INPUT, company facts) live in [`../../cochl-design/core/brand-core.md`](../../cochl-design/core/brand-core.md); theme values in [`../../cochl-design/core/themes/plex.md`](../../cochl-design/core/themes/plex.md). This file holds only what is specific to building decks. Templates in `decks/` are self-contained **interactive HTML**, then optionally exported to PPTX. This machinery is identical across deck variants — the variant spec only supplies structure/copy/layouts.

## Page navigation (required on every deck)
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

## Motion (CSS only)
`@keyframes fadeUp` on `.slide-inner` children with staggered `animation-delay` (0.1s steps); one-shot stat shimmer on load. No looping animation.

## HTML → PPTX (pixel-faithful)
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
3. Delete intermediate PNGs; keep `.html` + `.pptx` (same basename/dir) for the architecture page to list.

## Output flow (all deliverables)
Build the primary artifact first (HTML for decks; SVG for brochure/social), then export. The final result is three files with one basename in one directory:
> `{slug}.pptx` · `{slug}.html` · `{slug}_claude-code-architecture.html`

Generate the architecture page last, after the PPTX and HTML exist, with [`claude-code-architecture.md`](claude-code-architecture.md). Deliver all three unless the user asks for fewer; report every path produced. (Editable-SVG artifacts deliver the `.svg` + a rendered `.png` preview, plus the architecture page.)


## Deck QA checklist

Brand items (theme tokens, token names, gradient/glow, fonts, logo, company facts, every NEEDS INPUT check, closing copy, headlines) are run from [`../../cochl-design/core/qa-checklist.md`](../../cochl-design/core/qa-checklist.md). The items below are the layout/structure checks specific to decks.

- [ ] Backgrounds `--bg` (cover/CTA may be full-bleed `--bg-pure` + glow); cards `--panel`
- [ ] ≤1 glow per slide
- [ ] Cover has white logo bottom-left, opacity 0.70
- [ ] Bottom page-nav present, no top nav; keyboard arrows work
- [ ] Every non-cover, non-statement slide has the footer chrome (logo bottom-left + deck title bottom-right). Grep the output for the footer class and confirm its count equals (slide count − cover − statement slides).
- [ ] Each heading has exactly one `grad-text` key phrase
- [ ] Card body ≤2 sentences; break slides at major transitions
- [ ] Self-contained (assets inline / no broken refs)
- [ ] Claude Code architecture page delivered next to the PPTX and HTML, and passes its QA list ([`claude-code-architecture.md`](claude-code-architecture.md))

**Post-generation self-checks** (run right after emitting the deck, before saving):
- [ ] **Deck-type check** — if the content carries partnership keywords (MOU, co-development, OEM, SDK integration, joint go-to-market) but was built on the investor template, flag the routing (should be B2B — see SKILL.md Routing step 2).
- [ ] **Layout-pool check** — every layout id used is one the chosen spec defines; flag any ad-hoc / unregistered layout (see SKILL.md Routing step 5).
- [ ] **Image/icon-placeholder check** — scan **every** image/icon placeholder container in the document (e.g. `.p-right`, `.img-placeholder`, and image cards using the `--card-img` / `--img` fill); flag any container that is empty and carries no label or caption, and either report it explicitly or fill it — so no unlabeled blank image/icon slot ships. (Companion to the text NEEDS-INPUT grep above.)
- [ ] **Adjacent-figure check** — walk the deck in order and compare each slide's figures (`%`, `ms`, counts, `$`) against the previous 1–2 slides; flag any figure restated verbatim on adjacent slides and rewrite all but the first occurrence. (Guards the SecureBuild 6–7 case — the same 96.2% precision, 41% false-alarm reduction, and 120ms latency repeated across two neighbouring slides.)
- [ ] **Figure-consistency check** — when the same target/goal figure is presented on more than one slide (e.g. an annual target restated as a bridge/waterfall endpoint), diff its numeric value across every occurrence; flag any mismatch as a contradiction unless the restated value is within **±1%** of the first occurrence, in which case it may be labeled "rounded" — anything beyond that band may not use that label and must be reconciled. (Guards the D3 case: slide 9's $6.8M annual target vs. slide 10's $6.1M bridge endpoint, mislabeled as rounding.)
- [ ] **Cross-build figure-reuse check** — when generating a financial/quarterly-target chart for a new deck build (a new fiscal year, a new quarter, a fresh iteration of the same deck type), compare its numeric series against the equivalent chart from this session's other builds of the same deck type; flag any series where most values match a prior build's values verbatim or within a trivial rounding difference — recycling old illustrative/placeholder figures into a new period's chart is a fabrication risk even when captioned "illustrative," not acceptable reuse (see SKILL.md Facts & fabrication → Cross-build / cross-fiscal-year figure reuse). (Guards the QBR case: Q2's 2026 build-plan quarterly financial targets and Q4's FY2027 financial-plan quarterly targets matched in 3 of 4 quarters exactly, with the fourth differing by only $0.1M.)

## Card-layout reuse check
- [ ] when a card-type layout already used elsewhere in the deck is reused for a different section, confirm at least one compositional element changed (card aspect ratio, image presence/absence, or an equivalent structural element) so the two sections read as visually distinct; flag any pair that is structurally identical apart from copy (see SKILL.md Routing step 5). (Guards the market-competitive case — in both Case 1 and Case 2: slide 6's `competitor-profiles` and slide 11's `strategic-takeaways` shipped the same 4-card + image-block composition with no distinguishing element, despite covering unrelated content — external competitor profiles vs. Cochl's own strategic edge. Also guards the research-paper case: section 06's Research Framework and section 08's Research Process both rendered as the identical index-numbered (01→05) card + arrow 5-step flow — same card count, arrow style, and spacing standing in for a conceptual model in one slide and a literal study procedure in the other; see `decks/research-paper-template.md` → Layout guard for the required distinct treatments.)

## Shared-layout reuse check
- [ ] for any repeated slide archetype used across multiple builds of the same deck type (e.g. `key-initiatives`), confirm the build reused the layout's registered class structure rather than standing up a new one; scaling the item count via a property like `grid-template-columns` is a valid adaptation of the same registered layout, a differently-structured replacement is not (see registry.md → Repeated slide-type layouts are canonical). (Confirms the QBR Q4 case: Q4 correctly reused Q2/Q3's `init-grid`/`init-card` classes for its 4-column, 14-card Key initiatives expansion — including full `[NEEDS INPUT]` coverage on every Owner field — rather than authoring a separate layout; this check formalizes that pattern as the required default across every deck type going forward.)

## Aspect-ratio check
- [ ] for every logo/icon image in the deck (the cover wordmark included), compare the rendered width:height ratio against the source file's ratio; flag any mismatch beyond a trivial rounding difference — regardless of which CSS technique positions the image, verify the actual rendered ratio rather than trusting that a given layout approach is safe. (Guards the D1/D2/D3 case: all three decks' cover `.cover-logo` rendered at ~48.18:1 against a 4.73:1 source — `section.slide{display:flex;flex-direction:column}` sets no `align-items`, so the default `stretch` forced the height-only-constrained logo's width to fill the container. Recurred in the QBR / Board Update Q2/Q3 test decks with the identical ~48.18:1 distortion; Q4 in the same batch passed only because `position:absolute` incidentally excluded its logo from the flex layout, not because the rule was applied — an accidental pass on one deck never exempts the next deck built the same way.)
