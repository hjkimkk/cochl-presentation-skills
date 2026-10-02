# pt-template regression output (after)

Input: docs/phase2-baseline/inputs/pt-template.md. Route: pitch-deck -> cochl-presentation -> decks/pt-template (theme pt-template, 10x5.625in).
Files: cochl-investor-deck.html (self-contained, page-nav) and cochl-investor-deck.pptx (7 slides, native python-pptx text boxes/shapes, template bg + logo extracted from Cochl_PT_template.pptx).

Slides: hero, three-cols (Problem), section-break, four-pillar (Solution), kpi-grid-2x3 (Market/traction), three-scenario (Proof), cinematic-cta.

## Skipped / adapted
- Output-format question skipped: pt-template always saves both HTML and PPTX.
- Browser step skipped (none required here; the pt-template spec builds PPTX via python-pptx natively, no screenshots). HTML and PPTX were NOT visually rendered/inspected (no Chromium, no LibreOffice).
- Spec ships no stylesheet, so CSS was written from the spec's class names and theme tokens (only `var(--token)` colors/fonts; a few rgba values copied from the spec). HTML headings use --font-web per spec.
- `.needs-input` uses `--pt-violet-soft` (pt-template has no `--accent`; brand-core's rule names `--accent`, a plex token). Chosen for contrast on navy cards.
- Light-slide footer logo in HTML is logo_basic.svg; omitted in PPTX (SVG unsupported by python-pptx).
- Omitted slides needing unsupplied facts: competition (competitor names), team, roadmap, budget. Market quote-block omitted (no sourced quote).
- 5 of 6 market KPIs, and all 3 CTA cards (round size, use of funds, milestones) are [NEEDS INPUT]; KPI ones carry the fixed "Pending verified research" caption. The only confirmed figure is 30+ sound events (from input); contact/web/location from brand-core 3b.
- Scenario steps on the Proof slide are qualitative/illustrative and contain no figures.
