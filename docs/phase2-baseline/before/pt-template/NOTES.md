# Baseline: pt-template (before)
Skill: /tmp/claude-501/phase2-before/skills/pitch-deck/SKILL.md. Input: docs/phase2-baseline/inputs/pt-template.md.
Output: 8 slides (hero, three-cols, section-break, icon-columns, numerical-value, three-scenario, kpi-grid-2x3, cinematic-cta/CTA), HTML + PPTX.

- Skipped: browser render/screenshot QA (no Chromium). HTML and PPTX were not visually inspected.
- PPTX: built with python-pptx native shapes/text, not scripts/gen_pptx.py (that script hardcodes the AcousticShield content). Size 10x5.625in per Part 1 tokens; SKILL Part 7 says 13.33x7.5 and #0B1F3A backgrounds, which contradicts Part 1, so Part 1 (PT template) was followed.
- Cover/section-break/CTA use the master background picture and cover logo extracted from assets/Cochl_PT_template.pptx (SKILL points to /Users/hyo/Desktop/challenge/*.b64, which does not exist).
- Source CSS (cochl_acousticshield_deck.html) is not available, so HTML uses inline styles with same geometry as the PPTX, not the skill's class names.
- Icons in icon-columns are numbered purple squares (no emoji/icon assets).
- Brand facts: contact@cochl.ai, www.cochl.ai, San Francisco, CA, USA (from brand-core.md).
- No metrics invented; missing figures marked NEEDS INPUT (market size, ARR, customers, accuracy, latency, deployment proof, ask).
- No questions were asked; defaults chosen throughout.
