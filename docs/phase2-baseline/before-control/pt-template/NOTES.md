# before-control / pt-template (variance control run)
Skill: /tmp/claude-501/phase2-before/skills/pitch-deck/SKILL.md; input: inputs/pt-template.md.
Files: cochl_investor_deck.html (self-contained, base64 bg+logo, arrow-key nav), cochl_investor_deck.pptx (python-pptx, native text boxes/shapes, 10x5.625in).
9 slides: hero, three-cols, section-break, four-pillar, icon-columns, two-cols-list, section-break, numerical-value, cta.

Skipped / deviations
- No browser rendering or screenshot QA (Chromium cannot launch); PPTX built with native shapes only.
- Skill asset paths (/Users/hyo/Desktop/challenge/*.b64) do not exist; bg/logo taken from assets/Cochl_PT_template.pptx (image5.png master bg, image2.png logo).
- SKILL.md conflicts: Part 7 says 13.33x7.5 and #0B1F3A bg; Part 1/2C say 10x5.625 PT template. Followed the PT template (10x5.625, white content slides, master bg image on dark slides). Fonts: Century Gothic/Roboto in PPTX, IBM Plex Sans in HTML.
- Break slides: section-break used for Problem->Solution and Solution->Proof. stat-spotlight and quote-break omitted (no striking sourced metric, no sourced quote; would require fabrication).
- Unsupplied metrics (market size, traction, ask, named customers, certifications, accuracy) marked [NEEDS INPUT] with brand-core caption on stat placeholders.
- Contact/web/location from brand-core 3b: contact@cochl.ai, www.cochl.ai, San Francisco, CA, USA.
- No interactive prompts arose.
