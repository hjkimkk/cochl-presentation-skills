# Investor regression run (after)

Output: `cochl-investor-deck.html` (11 slides, self-contained, logo inlined as base64).

Routing: investor-template (no partnership signals in input). Theme: plex.

Layouts used (all from the investor spec): cover, mission-statement, problem-split-callout, use-case-band (3 cards), traction-metrics, competitors-cards, offering-devices, market-nested-circles, revenue-tiers, the-ask, thanks-contact. Skipped (no data supplied): competitors-map, use-case-four-column, pipeline-table, financials-bars.

Default choices (skill would have asked):
- Output format question -> HTML only (task says PPTX optional). No PPTX produced.

Skipped steps:
- HTML -> PNG -> PPTX export and any visual/screenshot check: needs headless Chrome, unavailable in sandbox. Layout is therefore NOT visually verified.

Static checks run: footer count 7 = 11 - cover - 2 statement - thanks; no literal hex outside :root; no non-canonical tokens; all markers bracketed `[NEEDS INPUT]` (32); contact from brand-core 3b.

[NEEDS INPUT] coverage: cover date, 5 traction metrics (each with sourcing caption), 4 competitor card titles, TAM/SAM/SOM, all revenue-tier prices/features, the-ask fields. Only user-supplied number is "30+" sound events.

Known deviations / notes:
- Cover logo placed top-left per investor spec (brand-core footer rule says bottom-left); cover has no footer chrome per spec.
- `#page-nav` uses rgba literals copied verbatim from deck-engine.md.
- Image placeholders carry visible labels (use-case and offering cards).
- Competitor card "why not a solution" statements are generic category framing, not named-competitor claims.
