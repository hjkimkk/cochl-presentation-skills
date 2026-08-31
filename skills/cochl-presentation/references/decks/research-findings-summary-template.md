# Research Findings / Paper Summary — deck (Research)

A concise, **findings-first** summary of a single research paper — the short sibling of the full [`research-paper-template.md`](research-paper-template.md) (17-slide conference presentation). Use this when the goal is a fast readout — *"what did this paper find, and why does it matter"* — for an internal share, a reading-group recap, or a pre-read, rather than a full academic talk. **~9 slides, results up front, minimal setup.**

Inherits [`../brand-core.md`](../brand-core.md) for all tokens, typography (IBM Plex Sans/Mono + IBM Plex Serif for card titles), the glow motif, page-nav, HTML→PPTX export, output flow, and QA. This spec only defines the summary structure and its two visual signatures.

## Visual signature (this deck)
- **Light body, dark section slides.** Content slides use the Cochl **light report** palette (white bg, near-black `#0B0B12` ink, indigo `#4B68FF` / purple `#832BFB` accents, soft `#F4F7FF`/`#EEF2FF` panels). Only the **section-transition slides — Cover and Takeaway/closer** (plus any full-bleed statement slide) — stay **dark** (near-black `#0B0B12` + subtle glow), so they punctuate the flow instead of blending in.
- **Editorial "rule-line" cards.** Grid cards are borderless — no box, no fill: a thin light-grey top rule (`#D4D7DE`) at the content-column width, a small grey index number (`#8A8E97`), an **IBM Plex Serif SemiBold** title, and grey body. Whitespace over boxes. Reserve **one** filled indigo (`#4B68FF`) card per findings slide for the single headline finding (white text) — it earns the emphasis.
- Keep the recurring Cochl signatures from `brand-core.md`: a short **indigo underline** under each slide title, and the gradient `cochl.` logo on the cover + closer.

## Slide structure (~9)
| # | Slide | Treatment | Show |
|---|---|---|---|
| 1 | Cover | **dark** | `COCHL · RESEARCH` kicker · paper title · authors · venue/year · presenter/team |
| 2 | TL;DR / At a glance | light | one-line takeaway (h2, exactly one `grad-text` phrase) + 3 headline stat tiles (the paper's key numbers) |
| 3 | Context & gap | light | why this paper exists + the gap it addresses, 2–3 lines (compresses context / problem / question) |
| 4 | Approach in brief | light | rule-line cards: data · method · setup — at a glance, not deep |
| 5 | Key findings | light | 2–4 findings as rule-line cards; **one indigo headline card** for the top finding |
| 6 | Evidence | light | one chart or table (the core result) + 2–3 supporting metric callouts |
| 7 | Why it matters | light | implications — academic + practical; optional highlighted takeaway card |
| 8 | Limitations & open questions | light | honest constraints + what's still unanswered, brief |
| 9 | Takeaway + references | **dark** | the single sentence to remember + selected references + Q&A / contact |

**Density:** keep it summary-grade — ≤4 cards per grid slide, card body ≤2 sentences (≤30 words), h2 ≤8 words with exactly one `grad-text` phrase, one core message per slide. If the paper needs full method / related-work / discussion depth, use the full [`research-paper-template.md`](research-paper-template.md) instead.

## Facts discipline (hard rule)
Summaries are where a fabricated number does the most damage — a single stat on the "At a glance" slide can misrepresent the whole paper. Use only figures, claims, author names, venue, and quotes taken **directly from the paper**. Anything you can't source → mark **`[NEEDS INPUT]`** in place and list it back; never fill a summary stat with a plausible-looking placeholder. Cite the paper on the Evidence and References slides.

## Build / edit
No pre-built artifact ships with this spec yet — build on request with the `figma-use` + `figma-use-slides` Plugin API (or the HTML→PPTX machinery in `brand-core.md`), following the structure above and the two visual signatures. The full research-paper Figma deck is a working reference for the exact treatment (dark section slides + light body + editorial rule-line cards): https://www.figma.com/slides/tUF7JCvtvLfarIMyUY9gB6. When built, drop slide previews in `research-findings-summary-previews/` and keep the registry row ✅.
