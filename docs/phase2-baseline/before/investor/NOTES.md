# Baseline notes: investor (before)
Skill: /tmp/claude-501/phase2-before/skills/cochl-presentation (SKILL.md + brand-core.md + decks/investor-template.md). Routed to Investor template (no partnership signals).

Deck: cochl_sense_investor_deck.html, 11 slides: cover, mission-statement, problem-split-callout, use-case-band (3 cards), traction-metrics, competitors-cards, offering-devices, market-nested-circles, revenue-tiers, the-ask, thanks-contact. Skipped (no data): competitors-map, use-case-four-column, pipeline-table, financials-bars.

Defaults chosen instead of asking:
- Output-format question ("PPTX, HTML, or both?"): chose HTML only (task says PPTX optional; browser not available).
- PPTX export / headless screenshots: skipped (Chromium cannot launch in sandbox). No visual/rendered-ratio QA done.
- Cover logo placed top-left (investor spec) while brand-core QA says bottom-left; spec override followed.
- Image cards use labeled grey placeholders.

[NEEDS INPUT] used (40 occurrences, all bracketed): cover date/team; all 6 traction metrics (with sourcing caption); competitor names/descriptions/gaps (4 cards); TAM/SAM/SOM; tier prices and most features (with caption on prices); the-ask use of funds/target/date.
Real facts used: Cochl.Sense, 30+ sound events, Cloud API + Edge SDK, smart home/automotive/safety, contact@cochl.ai, www.cochl.ai, San Francisco, CA, USA.
Self-checks run: footer count 8 (= 11 - cover - 2 statement slides); bracket-format grep ok; tokens canonical only.
Known deviation: closing sub-line "Pitch Closing Questions / Ask!" is investor-template copy, appropriate for this deck type.
