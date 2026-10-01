# Theme: pt-template

The official Cochl PT template style (`Cochl_PT_template.pptx`, 22 slides, 10×5.625in): Century Gothic + Roboto, purple `--c-primary`, mixed light/dark slides. Used by `pitch-deck`. Override these only when the Cochl brand team has explicitly approved a change.

Part 1 tokens (names unchanged) come first; the `--pt-*` tokens after them name the extra literal colors the pitch-deck layouts use, so converting them to `var()` keeps the output identical.

```css
:root {
  /* ── PPTX slide canvas ───────────────────────────────── */
  --slide-width: 10in;
  --slide-height: 5.625in;          /* 16:9, NOT 13.33×7.5 */

  /* ── Color palette ───────────────────────────────────── */
  --c-primary: #832BFB;             /* Cochl purple — all accent highlights */
  --c-analytics: #2F80ED;           /* secondary blue */
  --c-lavender: #EBDDFF;            /* CTA subtitle / soft tint */
  --c-success: #10B981;
  --c-warning: #F59E0B;
  --c-emergency: #EB5757;

  /* Light-slide surfaces (most content slides) */
  --col-light-bg: #FFFFFF;          /* default slide background */
  --col-text-dark: #333333;         /* body text on light slides */
  --col-text-sub: #666666;          /* axis labels, footnotes */

  /* Dark-slide surfaces (cover, section-break, CTA) */
  /* --col-dark-bg: [master BG image] — 10×5.625in PNG from slide master (cochl_pt_master_bg.png); no CSS color */
  --col-text-light: #FFFFFF;        /* text on dark slides */
  --col-text-lavender: #EBDDFF;     /* subtitle/meta on CTA */

  /* Accent / gradient */
  --grad-main: linear-gradient(135deg, #832BFB 0%, #2F80ED 100%);

  /* ── Typography ──────────────────────────────────────── */
  /* Headings & display numbers */
  --font-heading: 'Century Gothic', 'CenturyGothic', sans-serif;
  /* Body copy */
  --font-body: 'Roboto', sans-serif;
  /* HTML/web fallback (no Century Gothic on web) */
  --font-web: 'IBM Plex Sans', sans-serif;

  /* ── Spacing (10in canvas) ───────────────────────────── */
  --margin-left: 1.46in;            /* standard left edge for content */
  --margin-top-title: 0.73in;       /* top edge of slide title */
  --col-gap: 2.81in;                /* center-to-center for 3-col layout */
  --page-num-x: 0.29in;
  --page-num-y: 5.18in;

  /* ── Extra pitch-deck layout colors (--pt-*) ─────────── */
  --pt-title-ink: #000000;          /* h2-slide title text */
  --pt-indigo: #4B68FF;             /* phase 1 / emphasis text, bar series */
  --pt-layer-2: #4B72F4;            /* layer stack, 2nd step (1st = --c-analytics) */
  --pt-layer-3: #5D5BF8;            /* layer stack, 3rd step */
  --pt-violet: #6B4EFF;             /* layer stack 4th step; budget donut primary */
  --pt-bar-violet: #7240FF;         /* bar chart series 1 */
  --pt-bar-deep: #000CC8;           /* bar chart series 4 */
  --pt-deep-blue: #001974;          /* phase 3 dot + badge border */
  --pt-green: #00C853;              /* phase 4 dot, label, badge */
  --pt-violet-soft: #A08BFF;        /* Cochl column / diagram label text on dark */
  --pt-purple-soft: #C084FC;        /* Cochl table header text */
  --pt-blue-soft: #7FB3F5;          /* diagram label text on dark */
  --pt-muted: #8B9BB4;              /* muted labels, chart axis text, quote attribution */
  --pt-navy-bg: #0B1F3A;            /* legacy dark slide background (quote / statement layouts) */
  --pt-navy-card: #0F2847;          /* legacy dark cards, donut track */
  --pt-chart-grid: #1E3050;         /* chart axis + grid lines */
}
```

**Type scale** (1 pt = 1/72 in; PPTX EMU ÷ 12700 = pt):

| Role | Size | Weight | Color | Font | Use |
|---|---|---|---|---|---|
| h1-cover | 39pt | bold | `--col-text-light` | `--font-heading` | cover title |
| h2-slide | 27pt | normal | `--pt-title-ink` | inherit | slide title with `--c-primary` keyword span |
| num-accent | 36pt | bold | `--c-primary` | `--font-heading` | numerical-value layout |
| caption-sub | 12pt | normal | `--col-text-light` | `--font-heading` | cover subtitle |
| body-copy | 9pt | normal | `--col-text-dark` | `--font-body` | all body text on light slides |
| small-label | 9pt | bold | `--col-text-dark` | `--font-body` | list titles / bold inline |

**Background system — two modes:**

| Slide type | Background | Text color |
|---|---|---|
| Cover, section-break, CTA | Dark master PICTURE (`cochl_pt_master_bg.png`) | `--col-text-light` |
| All other content slides | `--col-light-bg` (white) | `--col-text-dark` |

**Gradient rule — apply `--grad-main` ONLY to:**
- Accent lines (3px height, max 120px wide)
- KPI/numerical value text (`-webkit-background-clip: text`)
- Budget bar fills
- Timeline track line
- One keyword `<span class="grad-text">` per slide title h2

Never apply to card backgrounds, body text, or table rows.
