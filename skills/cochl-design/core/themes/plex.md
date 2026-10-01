# Theme: plex (default)

IBM Plex Sans/Mono, near-black + indigo + purple→blue glow. Used by every skill unless a template sets `pt-template`.

Paste the `:root` block below into the output `<style>` before any template CSS, then reference values only as `var(--name)`. Some values are listed twice under different names (for example `#ffffff` is both `--light-bg` and `--text`): pick the name for the role you mean.

```css
:root {
  /* Surfaces (dark) */
  --bg: #0b0b12;              /* page / slide background (near-black) */
  --bg-pure: #000000;         /* full-bleed cover/CTA base; pure-black data slides; design-review dark slides */
  --panel: #14141c;           /* cards, table surfaces, drop-zones */
  --panel-2: #1b1b26;         /* raised / hover surface */
  --panel-3: #1c1c24;         /* b2b-sales dark rounded cards */
  --bg-near: #16161c;         /* b2b-sales near-black charcoal (cover & glow slides) */
  --neutral-bar: #2b2b38;     /* market-competitive neutral bars */
  --brochure-neutral: #141414; /* brochure V1 Visual neutral accent */
  --border: rgba(255,255,255,0.08);
  --muted-on-dark: rgba(255,255,255,0.40); /* design-review muted text on dark slides */

  /* Surfaces (light) */
  --light-bg: #ffffff;        /* light slide / page background */
  --light-gray: #f1f1f2;      /* design-review section-divider, goal-card and persona bg */
  --light-card: #e6e6e6;      /* design-review cards on --light-gray slides */
  --light-panel: #f6f7f9;     /* light-palette soft panels (101 lecture) */
  --light-panel-indigo: #eef2ff; /* light print panels (press kit, usability, research findings) */
  --light-panel-tint: #f4f7ff;   /* light print panels, lighter tint */
  --light-rule: #e6e8ee;      /* light-palette rule lines */
  --light-rule-2: #d4d7de;    /* editorial rule-line card top rule */
  --img-placeholder: #ececec; /* light image-placeholder fill */
  --doc-canvas: #e8e8e8;      /* proposal-doc screen wrapper; design-review phone placeholder fill */
  --avatar-fill: #d8d8d8;     /* design-review avatar circle */
  --doc-rule: #d0d0d0;        /* proposal-doc footer / letter rule */
  --doc-line: #cccccc;        /* proposal-doc timeline + table lines */
  --doc-box-border: #aaaaaa;  /* proposal-doc signature box border */
  --doc-tick: #888888;        /* proposal-doc timeline tick */
  --light-border: rgba(0,0,0,0.10);  /* borders on light slides */
  --muted-on-light: rgba(0,0,0,0.40); /* muted text on light slides */

  /* Ink */
  --text: #ffffff;            /* text on dark */
  --text-soft: #c9c9d4;       /* body on dark */
  --muted: #9aa1ac;           /* captions, labels */
  --muted-2: #9a9aa6;         /* corporate-strategy / b2b-sales muted body + labels */
  --muted-3: #8a8a99;         /* investor grey body on light-heading slides */
  --muted-light: #8a8e97;     /* small grey index numbers on light slides */
  --placeholder: #565b6b;     /* template placeholder text (blank templates only) */
  --ink: #111111;             /* headings / strong text on light; design-review viewer letterbox */
  --ink-body: #1a1a1a;        /* proposal-doc body text; phone-mockup frame */
  --ink-soft: #444444;        /* proposal-doc footer + notes */
  --ink-muted: #555555;       /* proposal-doc dates, bullets, signature labels */
  --ink-faint: #777777;       /* proposal-doc timeline durations */
  --ink-navy: #0f1b3d;        /* light print ink (press kit, usability report) */
  --doc-link: #1155cc;        /* proposal-doc fill-in variables (blue hyperlink color) */

  /* Accents */
  --accent: #4b68ff;          /* primary accent (indigo) — subtitles, glows, links, accent underline */
  --accent-purple: #832bfb;   /* secondary accent (purple) — gradient + glow partner */
  --mint: #a6f0ce;            /* tertiary accent (B2B / strategy secondary) */
  --brochure-green: #0fa068;  /* brochure V3 Editorial accent */
  --pos: #b7e4a0;             /* investor offering ✓ (soft green) */
  --neg: #eb5b6b;             /* investor competitor ✕ / strategy risk dot (pink-red) */
  --grad-brand: linear-gradient(135deg, var(--accent-purple), var(--accent));
  --glow: radial-gradient(closest-side, rgba(75,104,255,0.55) 0%, rgba(131,43,251,0.22) 50%, rgba(75,104,255,0) 100%);

  /* Logo gradient (do not recolor) */
  --logo-g1: #9827ff;
  --logo-g2: #4b7eff;
  --logo-g3: #00d7ff;

  /* Signals (use sparingly) */
  --danger: #eb5757;
  --success: #10b981;
  --warning: #f59e0b;

  /* Font roles */
  --font-sans: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'Roboto', sans-serif;      /* design-review body */
  --font-ui: 'Public Sans', sans-serif;   /* design-review header bar */
  --font-quote: 'Lora', serif;            /* design-review quote slides */
  --font-doc: 'Inter', sans-serif;        /* proposal-doc body */
  --font-link: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&family=Roboto:wght@300;400;500&family=Public+Sans:wght@400;500&family=Lora:ital,wght@0,400;1,400&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400&display=swap'; /* reference only — load it with the <link> below */
}
```

**Google Fonts link** (paste into `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&family=Roboto:wght@300;400;500&family=Public+Sans:wght@400;500&family=Lora:ital,wght@0,400;1,400&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet">
```
A template that uses only some roles may drop the unused families from the link.

**Glow motif** — the Cochl signature. A soft radial, indigo core → purple mid → transparent, placed off-center behind hero content (`--glow` above):
```
radial-gradient(closest-side,
  rgba(75,104,255,0.55) 0%, rgba(131,43,251,0.22) 50%, rgba(75,104,255,0) 100%)
```
Max **one** glow per slide/canvas. Never behind dense data.

**Gradient rule** — the purple→blue gradient (`linear-gradient(135deg, var(--accent-purple), var(--accent))`, i.e. `--grad-brand`) applies ONLY to: KPI/stat value text (`background-clip:text`), a thin accent underline (≤3px, ≤120px), cover/CTA overlays, timeline tracks, and pillar-card top borders. Never on card backgrounds, body text, or table rows.

**Editable SVG** (brochure/social): use the literal stack `'IBM Plex Sans','Helvetica Neue',Arial` — SVGs are lint-exempt.
