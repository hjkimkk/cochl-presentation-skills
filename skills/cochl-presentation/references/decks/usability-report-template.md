# Usability Testing Report — deck (Design / UX Research)

A UX-research **usability testing report** deck. Delivered as an editable **Figma Slides** file (the Design team's preferred medium), in the Cochl **light report** treatment. Inherits [`../brand-core.md`](../brand-core.md) with the light print palette (white bg, `#0F1B3D` ink, indigo `#4B68FF` accent, `#F4F7FF`/`#EEF2FF` panels), IBM Plex Sans/Mono, and the recurring signatures: a short **indigo underline** under each slide title, gradient `cochl.` logo on cover + closer, gradient hero panel (indigo→purple + mint/purple circles + dot grid).

**Editable Figma Slides (Cochl_Internal):** https://www.figma.com/slides/j3AvEowJXBddgerOTd7fG3 — 13 slides. Duplicate this file for a real report and fill the placeholders. Slide previews (p01–p13) in [`usability-report-previews/`](usability-report-previews/).

## Slide structure (13)
1. **Cover** — cochl logo, mono kicker `COCHL · UX RESEARCH`, big title "Usability Testing Report", gradient hero.
2. **Agenda** — 8 items, two columns (indigo number · title · sub-question).
3. **What is a usability testing report?** — intro paragraphs + a side "Add your data" note card.
4. **Team** — 3 photo drop-zone cards (name / role).
5. **Objective** — 3 panel cards: objective (goal + %) · Why? · Key deliverables (with bullets).
6. **Methodology** — numbered list (Test date · Testing method · Participant demographics · Prototype) + image drop-zone.
7. **Prototype walkthrough** — screen drop-zone + Designs description, Change 1–3 bullets, "Open prototype" pill.
8. **Deliverables vs Results** — two columns; results use green ✓ / red ✗ on highlighted cards.
9. **Recommendation** — Context card + highlighted Suggestion card with evidence bullets.
10. **Supporting evidence — data** — heatmap/recording drop-zone + data points + source.
11. **Supporting evidence — feedback** — 3 user-quote cards (Tester # · timestamp).
12. **Action plan** — 3 ✓ next-step cards + Notes bullets.
13. **Thank you** — closer with cochl logo + gradient hero.

## NEEDS INPUT marker — Prototype link & Test date fields (template-local exception to brand-core §1b)

Two fields in this deck are structured enough to warrant a **typed** marker instead of brand-core's plain `[NEEDS INPUT]`: the **Prototype link** (slide 6 Methodology's "Prototype" line, and slide 7's "Open prototype" pill) and the **Test date** (slide 6 Methodology's "Test date" line). Both are unconfirmed-until-filled placeholders that are easy to paraphrase into free text instead of a recognizable marker — real usability-report builds have shipped every one of the following instead of a standard marker:

- `[ link to Figma prototype ]`
- `PROTOTYPE_LINK`
- `PROTOTYPE / BUILD LINK`
- `link to prototype / build`
- `test date not logged`

None of these are acceptable — each reads as a plausible field label rather than an unmistakable unconfirmed-value marker, and none carry the `.needs-input` styling brand-core defines. Use exactly:

- **Prototype link** (slide 6 Methodology + slide 7 "Open prototype" pill): `[NEEDS INPUT: link]`
- **Test date** (slide 6 Methodology): `[NEEDS INPUT: date]`

— styled with the same `.needs-input` class from brand-core §1b (accent color, dashed underline, italic). Only the bracket text is typed for these two fields; nothing else about the component changes.

**This is a template-local exception, not a change to the shared convention.** Every other field in this deck, and every field in every other template, keeps brand-core §1b's plain `[NEEDS INPUT]` (no type suffix). Do not generalize the typed `[NEEDS INPUT: <type>]` form beyond these two fields without revisiting brand-core §1b itself.

## Facts discipline
The deck ships with **example/placeholder** content (bracketed `[ ... ]` slots, `Change 1–3`, `Data point 1–3`, `Tester #[ID]`, example %). Replace every bracket and example figure with real test data before sharing. Do not present placeholder metrics as real Cochl results.

## Rebuild / edit
Built with the `figma-use` + `figma-use-slides` Plugin API (SVG-imported gradient logo; native text, shapes, gradient fills). To restyle, edit the Figma Slides file directly; to regenerate elsewhere, follow the slide structure above on `brand-core.md`.
