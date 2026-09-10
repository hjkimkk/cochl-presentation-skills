# Research Paper Presentation — deck (Research)

> **Primary (recommended): Figma Slides** — brand-accurate, real IBM Plex, 17 slides merging the SlideBazaar academic layout patterns (4-step infographic, six-step flow, bar chart, comparison table, references) with the Cochl 16-section structure. **Theme:** section-transition slides (Cover, Research Question, Conclusion, References, Q&A) stay **dark** (near-black `#0B0B12` + glow); body slides are **light** (white bg, near-black ink, indigo/purple accents), with **editorial rule-line cards** (borderless — thin grey top rule, grey index number, IBM Plex Serif SemiBold title, grey body; one indigo headline card allowed per findings slide). **Edit:** https://www.figma.com/slides/tUF7JCvtvLfarIMyUY9gB6 · previews in [`research-paper-figma-previews/`](research-paper-figma-previews/) (p01–p17).
> The Canva version below is an earlier alternate (lighter brand fidelity).

Academic **research-paper presentation** template, 16 sections. Produced in **Canva** (the Research team's requested tool) via Canva's AI presentation generator, styled toward the Cochl system (near-black backgrounds, indigo `#4B68FF` / purple `#832BFB` accents + glow, bold display headings, generous whitespace). Previews (p01–p16) in [`research-paper-previews/`](research-paper-previews/).

**Editable Canva design (Cochl_Internal):** https://www.canva.com/d/TLDSf2uePrIVPOy — duplicate/edit this for a real talk and fill the placeholders.

## 16-section structure
| # | Section | Show |
|---|---|---|
| 01 | Title / Cover | Paper title · authors · institution · conference/journal · presenter |
| 02 | Research Context | Background · domain · why it matters |
| 03 | Problem / Gap | The problem + what's missing in current research |
| 04 | Research Question | Main question / hypothesis |
| 05 | Related Work | Key prior studies + positioning |
| 06 | Research Framework | Conceptual / theoretical model |
| 07 | Methodology | Participants · dataset · tools · setup |
| 08 | Research Process | Step-by-step study workflow |
| 09 | Results | Findings via charts / tables / metrics |
| 10 | Key Findings | 2–4 most important discoveries |
| 11 | Discussion | Meaning + comparison with prior work |
| 12 | Implications | Academic / practical |
| 13 | Limitations | Constraints · weaknesses · bias |
| 14 | Future Work | What to study next |
| 15 | Conclusion | Question → answer → takeaway |
| 16 | Q&A / References | Questions + selected references |

## Layout guard — Section 06 (Research Framework) and Section 08 (Research Process) never share a layout

These two sections are adjacent in the deck and easy to generate as the same component — both can be described as "N boxes in sequence" — but they represent different kinds of content and must read as visually distinct slides, not restatements of each other:

- **06 Research Framework** is a conceptual/theoretical model — if it renders as a sequence at all, it's a chain of ideas (constructs, variables, a hypothesis path), not a literal procedure.
- **08 Research Process** is the actual step-by-step study workflow — participants → data collection → analysis → validation, or similar concrete operational steps.

Do **not** render 08 with the same index-numbered (01→0N) card + arrow flow component used for 06 — same card count, arrow style, width, and spacing as 06 is a structural duplicate even if the copy differs, and having the same step count (e.g. both landing on 5 steps) is not license to reuse the composition. Give 08 a distinct treatment instead — either:
- a **vertical timeline**: a connecting line running down the slide with a node/checkmark per stage and the stage's output or deliverable labeled beside it, or
- a **left→right progress bar**: a single horizontal track with markers at each step and a short output label underneath each marker (what that step produced, not just its name).

This is a specific instance of the general rule in `../brand-core.md` §4 → Card-layout reuse check — apply it here even though 06 and 08 are not both literally "cards," since an index+arrow flow is the same offending pattern (a reused compositional unit standing in for unrelated content).

## Notes
- **Tooling:** Canva (not Figma/SVG). Because the Cochl account has **no Canva brand kit**, Canva applied its own styling steered toward Cochl via a style prompt — palette/mood match, but the display face is a serif rather than IBM Plex Sans, and colors are approximate. For a pixel-exact Cochl deck, use the Figma-Slides path instead.
- **Facts discipline:** the generated deck contains **example/placeholder** content (e.g. `[Presenter Name] - [Institution]`, an example "75% increase" stat). Replace every placeholder and example figure with real paper data before presenting. Do not present placeholder metrics as real results.
- **To improve brand fidelity:** set up a Cochl brand kit in Canva (indigo/purple + IBM Plex), then regenerate with `brand_kit_id`; or restyle this design with the Canva editing tools.
