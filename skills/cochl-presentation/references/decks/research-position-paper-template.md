# Research Position / Critical Review Paper — deck (Research)

Argument-driven **position / critical review paper** template, 14 sections. For a talk built around a critique or reframing of existing work — no original experiments of the presenter's own — rather than an empirical study. Distinct from [`research-paper-template.md`](research-paper-template.md): that spec assumes the presenter ran the study being shown (Methodology → Results → Key Findings); this one assumes the presenter is arguing **about** other people's work (Existing View → Problem → Alternative Position), and adds a slide type standard research talks don't need — a full pull-quote.

**Tooling / theme:** inherit the same **Figma Slides** approach as the research-paper deck — dark section-transition slides (Cover, Existing View, Alternative Position, Conclusion, Q&A) + light editorial body slides (rule-line cards: thin grey top rule, grey index number, IBM Plex Serif SemiBold title, grey body). Start by **duplicating** the research-paper Figma file (https://www.figma.com/slides/tUF7JCvtvLfarIMyUY9gB6) and restructuring per the section list below — do not build this deck type from the research-paper file's section order as-is; the sections genuinely differ (see table).

## 14-section structure

| # | Section | Show |
|---|---|---|
| 01 | Title / Cover | Position title · author · institution · venue/context · presenter |
| 02 | Context | Why this critique matters now — field state, what's at stake |
| 03 | Existing View | The standard/consensus framing being challenged, with its source |
| 04 | Full Quotation — Existing View | Verbatim pull-quote from the work/standard under critique (see Full Quotation slide, below) |
| 05 | The Problem | Where the existing view falls short — conceptual/structural, not an experimental result |
| 06 | Supporting Reasoning | Literature-grounded argument for why the gap matters — citations, prior critiques, analogous cases |
| 07 | Alternative Position | The paper's proposed reframing — the core claim being advanced |
| 08 | Full Quotation — Position | Pull-quote stating the paper's own claim, or a cited source that backs it (see Full Quotation slide, below) |
| 09 | Implications — Academic | What changes for how the field should frame/evaluate this problem |
| 10 | Implications — Practical | What changes for teams building on the current (challenged) framing |
| 11 | Anticipated Counterarguments | The strongest objections, stated fairly, each with a short rebuttal |
| 12 | Limitations | What the position does **not** claim — scope boundaries |
| 13 | Conclusion | Position restated → what should happen next |
| 14 | Q&A / References | Questions + selected references |

## Full Quotation slide (new component — not in the standard research-paper deck)

A full-bleed pull-quote slide, used at 04 and 08. This is genuinely new relative to `research-paper-template.md` — do not force it into that deck's rule-line card component, and do not reuse the same visual treatment for both instances beyond what's specified here (04 and 08 share the same *component*, which is correct — they are quoting, just from opposite sides of the argument — but must carry different index/eyebrow labels so they don't read as the same slide repeated).

- **Theme:** dark section-transition surface (near-black `#0B0B12` + glow), matching Cover/Conclusion — a quotation is a pivot moment in the argument, not a body-slide fact.
- **Layout:** large serif italic quotation, vertically centered, generous margin (quote text should never span the full slide width — cap it, e.g. ~70% width, to keep line length readable).
- **Attribution:** small IBM Plex Mono line beneath the quote, uppercase, muted — `— AUTHOR, "SOURCE TITLE" (YEAR)` — never presented without a real, checkable source.
- **Eyebrow label:** a short mono tag above the quote distinguishing which side of the argument it's on — e.g. `THE CLAIM UNDER REVIEW` at 04 vs. `THE REFRAMING` at 08 — this is what keeps the two instances visually distinct despite sharing one component.
- **Facts discipline:** every quotation slide must carry a real, verifiable citation. Do not fabricate or paraphrase-as-verbatim a quote — if the exact wording isn't available, use the Existing View / Alternative Position slide (paraphrase, cited) instead of this component.

## Notes
- **No Methodology / Results / Key Findings sections.** This template does not report an original study — do not add those sections from `research-paper-template.md` "just in case." If a request turns out to include the presenter's own experiment alongside the critique, that's a hybrid case: flag it rather than silently merging this spec with `research-paper-template.md`.
- **Card-layout reuse still applies.** Sections 05 (Problem), 06 (Supporting Reasoning), and 11 (Anticipated Counterarguments) are all "several short points" content and are the ones most likely to get generated as the same card grid. Per `../brand-core.md` §4 → Card-layout reuse check, give each a distinct structure appropriate to its content (e.g. Problem as a short indented list under one heading, Supporting Reasoning as citation-backed rule-line cards, Counterarguments as a two-column objection/rebuttal pairing) rather than three identical card grids in a row.
- **Facts discipline (deck-wide):** every claim attributed to the existing view, and every citation in Supporting Reasoning / References, must be real and checkable. This deck type is argument-heavy — it's easier than most to accidentally strengthen a critique with an invented or misremembered source. When a specific citation isn't available, mark it `[NEEDS SOURCE]` rather than filling in a plausible-sounding one.
