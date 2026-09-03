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

  When a drafted headline matches one of these shapes, rewrite it in a different structure before it ships.
- Do not repeat a headline stat verbatim across slides. When the same number must reappear (e.g. in both traction and a supporting callout), rephrase the sentence around it each time — vary which part of the sentence carries the number.
- **Track figures across adjacent slides.** When generating a slide, keep a running note of the statistics/figures presented on the previous 1–2 slides — percentages, latency (ms), counts, `$` amounts — and do not restate the same figures verbatim on an adjacent slide. When a figure must carry forward, reference it by meaning ("that same sub-frame latency") or fold it into a comparison instead of reprinting the number, so no two neighbouring slides read as a figure-for-figure restatement.
- Before finalizing, scan all slide headlines / kickers / statements for near-duplicate sentences (>80% word overlap) and rewrite every repeat but the first.

## 3. Logo

White `cochl.` logotype (gradient symbol + white wordmark). Files:
- Raster (deck footer): `assets/cochl-logo-white.png` — the real Cochl logo (gradient symbol + white wordmark), matching the canonical source `cochlearai/cochl-dashboard-v2` @ `hjkim` · `assets/logo/header_logo_dark.png` (dark-theme = white-on-dark, correct for the near-black footer). Always embed this raster in the footer — never a text `cochl.` placeholder — and keep it in sync with that source.
- Vector inline (SVG artifacts): the gradient symbol path + white wordmark path — see the generators in `social-kit/`.
- Footer placement on decks: `bottom:60px; left:40px; height:20px; opacity:0.70`.

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
- [ ] **Headline-template check** — read every headline / section title against the §2b *Overused headline templates* list; flag any that matches a listed structure (`The Blind Spot in X-Only Y`, `One A, N B`, …), and flag any single sentence shape reused for 2+ headlines in this deck. Rewrite each flagged one into a different structure.
- [ ] **Version-consistency NEEDS INPUT check** — when this deck is a language or audience variant of another (e.g. an English deck re-rendered for a Korean board), every value the source marked `[NEEDS INPUT]` must still be marked here, and the variant's `[NEEDS INPUT]` count is compared to the source's; if it falls below **half** the source count, re-review the variant before saving — a variant with far fewer marks is almost always leaking unconfirmed figures the source correctly withheld. (Guards the D3 case: D3 marked only 4 where D1/D2 marked 34/33 of the same revenue/NRR/accuracy/uptime/margin/customer figures on slides 9 & 11.)
