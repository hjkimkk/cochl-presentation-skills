# Research Findings / Paper Summary — deck (Research)

A concise, **findings-first** summary of a single research paper — the short sibling of the full [`research-paper-template.md`](research-paper-template.md) (17-slide conference presentation). Use it for a fast readout — *"what did this paper find, and why does it matter"* — for an internal share, a reading-group recap, or a pre-read, rather than a full academic talk.

**This summary is a curated ~9-slide condensation of the full research-paper Figma deck** — same file, same design system, fewer slides. **Editable Figma Slides (Cochl_Internal):** https://www.figma.com/slides/tUF7JCvtvLfarIMyUY9gB6 — present or duplicate the subset below for a real readout, and fill every placeholder. Previews (p01–p09) in [`research-findings-summary-previews/`](research-findings-summary-previews/).

Inherits [`../brand-core.md`](../brand-core.md) for all tokens, typography (IBM Plex Sans/Mono + IBM Plex Serif for card titles), the glow motif, page-nav, HTML→PPTX export, output flow, and QA. This spec only defines the summary selection and its two visual signatures.

## Visual signature (this deck)
- **Light body, dark section slides.** Content slides use the Cochl **light** palette (white bg, near-black `#0B0B12` ink, indigo `#4B68FF` / purple `#832BFB` accents, soft `#F4F7FF`/`#EEF2FF` panels). Only the **section-transition slides — Cover, Research Question, Conclusion** — stay **dark** (near-black `#0B0B12` + subtle glow), so they punctuate the flow.
- **Editorial "rule-line" cards.** Grid cards are borderless — no box, no fill: a thin light-grey top rule (`#D4D7DE`) at the content-column width, a small grey index number (`#8A8E97`), an **IBM Plex Serif SemiBold** title, and grey body. Whitespace over boxes. Reserve **one** filled indigo (`#4B68FF`) card on the Key Findings slide for the single headline finding (white text).
- Keep the recurring Cochl signatures from `brand-core.md`: a short **indigo underline** under each slide title, and the gradient `cochl.` logo on the cover + closer.

## Slide selection (~9, drawn from the full deck)
| # | Slide (source section) | Treatment | Show |
|---|---|---|---|
| 1 | Cover | **dark** | `COCHL · RESEARCH` kicker · paper title · authors · venue/year · presenter |
| 2 | Research Context | light | background · domain · why it matters (context + gap) |
| 3 | Research Question | **dark** | the main question / hypothesis, as a full-bleed statement |
| 4 | Methodology | light | participants · dataset · tools · setup — at a glance |
| 5 | Results | light | the core result via chart / table / metrics |
| 6 | Key Findings | light | the 2–4 most important discoveries; **one indigo headline card** |
| 7 | Implications | light | academic + practical significance |
| 8 | Limitations | light | constraints · weaknesses · bias, brief |
| 9 | Conclusion | **dark** | question → answer → the single takeaway to remember |

Drop the "Related Work / Framework / Process / Discussion / Future Work" slides that the full deck carries — a summary trades completeness for speed. If a reader needs that depth, send the full [`research-paper-template.md`](research-paper-template.md) instead. To add a live "Q & A / References" closer, pull slides 16–17 from the full deck.

**Density:** keep it summary-grade — ≤4 cards per grid slide, card body ≤2 sentences (≤30 words), one core message per slide.

## Facts discipline (hard rule)
Summaries are where a fabricated number does the most damage — a single stat can misrepresent the whole paper. Use only figures, claims, author names, venue, and quotes taken **directly from the paper**. Anything you can't source → mark **`[NEEDS INPUT]`** in place and list it back; never fill a summary stat with a plausible-looking placeholder. Cite the paper on the Results and (if included) References slides.

## Build / edit
The deck reuses the research-paper Figma file above (dark section slides + light body + editorial rule-line cards). To produce a real summary: duplicate that file, keep the ~9 slides in the selection table, delete the rest, and fill placeholders. To rebuild elsewhere, follow the selection on `brand-core.md` with the `figma-use` + `figma-use-slides` Plugin API. Keep the previews in `research-findings-summary-previews/` in sync when the selection changes.
