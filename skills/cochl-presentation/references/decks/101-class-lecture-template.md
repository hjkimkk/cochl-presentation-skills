# 101 Class / Lecture — deck (Education / All teams)

A **teaching format** for 101 classes — explaining a topic *X* to beginners (onboarding, tech talks, internal training, workshops). Unlike the other deck specs, this is a **format library organized by content intent**: pick the slide formats each section needs and assemble them, rather than following one fixed slide list. For a company/product intro specifically, see the planned `Cochl 101` row; this template is the general "teach a concept" engine it builds on.

Inherits [`../brand-core.md`](../brand-core.md) for all tokens, typography, the glow motif, page-nav, HTML→PPTX export, output flow, and QA. This spec defines the design treatment + the content-intent format library.

## Content-intent spine
Every 101 class flows through up to seven intents. Use the ones the topic needs; skip the rest.

```
Introduce → Explain → Compare → Prove → Apply → Practice → Close
```

**Assembling a class:** Introduce (1) · Explain (2–4, the backbone) · Compare (0–2) · Prove (1–3) · Apply (1–3) · Practice (0–3) · Close (2–4). Aim for **~12–20 content slides**. Open each intent with a dark **section-break** slide (below), and keep **one core message per slide**.

## Design system application (this deck)
- **Light body, dark section slides.** Content slides use the Cochl **light** treatment (white bg, near-black `#0B0B12` ink, indigo `#4B68FF` / purple `#832BFB` accents, soft `#F4F7FF`/`#EEF2FF` panels) — best for content-dense teaching and lit rooms. Only the **Cover, the seven intent section-breaks, Q&A** stay **dark** (near-black + a single glow), so each new intent lands as a beat.
- **Section-break slide (one per intent):** dark, big decorative intent number + name (e.g. `02 · EXPLAIN`), mono kicker, one glow. This is the recurring signature of the deck.
- **Editorial "rule-line" cards.** Grid cards are borderless: a thin light-grey top rule (`#D4D7DE`) at the content-column width, a small grey index number (`#8A8E97`), an **IBM Plex Serif SemiBold** title, and grey body — whitespace over boxes. Reserve **one** filled indigo (`#4B68FF`) card per slide for the single most important item (white text).
- **Type & accents:** IBM Plex Sans headings (Title Case), IBM Plex Mono UPPERCASE kickers/labels, short **indigo underline** under each slide title, gradient `cochl.` logo on cover + closer. Gradient (purple→blue) only in the approved positions from `brand-core.md` (stat text, thin underlines, section overlays, chart-highlight). ≤2 accent elements per content slide; ≤1 icon per card.

---

## Slide-format library

Each format lists: **Intent · Best for · Content structure · Visual pattern · Avoid when**. "Visual pattern" names the Cochl layout to reuse.

### 1 · Introduce
**Title / Speaker Intro**
- **Intent:** open the class — topic, speaker, credibility.
- **Best for:** slide 1 of any 101.
- **Content:** ① topic title ② one-line promise / subtitle ③ speaker · role · team ④ date / context.
- **Visual:** *cover* — dark, full-bleed + one glow, left-aligned title, gradient `cochl.` logo top-left, mono kicker (`TOPIC · 101`).
- **Avoid when:** mid-deck — use a section-break instead.

### 2 · Explain  *(the backbone — build the concept)*
**What is X?**
- **Intent:** define the core concept in one screen.
- **Best for:** right after the intro; the anchor definition.
- **Content:** ① one-sentence definition (h2, exactly one `grad-text` phrase) ② 2–3 clarifiers ③ a plain-language analogy.
- **Visual:** *statement* — large definition left; optional single analogy card right; light bg.
- **Avoid when:** several concepts at once — split them.

**Terminology**
- **Intent:** give beginners the vocabulary.
- **Best for:** after "What is X?" when jargon is unavoidable.
- **Content:** 3–6 *term · definition* pairs.
- **Visual:** rule-line card grid (2×3) or a two-column term/def list — term = serif title, def = grey body.
- **Avoid when:** >6 terms — move extras to a handout / References.

**General → Specific**
- **Intent:** zoom from the big picture down to the specific case.
- **Best for:** situating X inside a wider field.
- **Content:** 3–4 nested levels (field → subfield → X → this instance).
- **Visual:** descending indent / funnel, indigo connector rail, each level a rule-line row.
- **Avoid when:** the relationship isn't hierarchical — use Compare.

**Architecture**
- **Intent:** show how the system is built and how parts connect.
- **Best for:** technical topics with components + data flow.
- **Content:** ≤4 layers/blocks + connectors + one line each.
- **Visual:** *layer-stack (≤4)* or block diagram — indigo nodes, purple flow arrows. HIGH density → follow with a section-break.
- **Avoid when:** there's no structural relationship to show.

### 3 · Compare
**X vs Y**
- **Intent:** contrast two options on shared criteria.
- **Best for:** choosing between methods / tools.
- **Content:** criteria rows × 2 columns (X, Y).
- **Visual:** *comparison table (2 cols)* or two mirrored columns; the recommended side gets the one indigo highlight.
- **Avoid when:** >3 alternatives (use an N-column table) or a sequential process.

**Before / After**
- **Intent:** show change / improvement from a baseline.
- **Best for:** demonstrating the impact of X.
- **Content:** ① before state ② after state ③ what changed (delta).
- **Visual:** split — left *before* (muted) / right *after* (indigo); delta callout bottom-center.
- **Avoid when:** there's no single baseline — use Metrics / Graph.

**Good / Bad**
- **Intent:** teach do / don't, correct vs incorrect.
- **Best for:** guidelines, labeling standards, style rules.
- **Content:** 2–4 paired examples with ✓ / ✗.
- **Visual:** two columns — success `#10B981` ✓ / danger `#EB5757` ✗ used sparingly on rule-line cards.
- **Avoid when:** the point has nuance that isn't binary.

### 4 · Prove
**Experiment**
- **Intent:** describe the setup that produces the evidence.
- **Best for:** research applications, benchmarks.
- **Content:** hypothesis · setup · variables · procedure.
- **Visual:** numbered rule-line steps or a compact 2×2; light.
- **Avoid when:** there's no empirical test — use Case Study.

**Metrics**
- **Intent:** state the numbers that matter.
- **Best for:** quantifying results.
- **Content:** 3–4 *KPI label · value · delta*.
- **Visual:** *kpi-grid* — values in gradient stat text; ≤4 tiles.
- **Avoid when:** a trend needs a shape — use Graph.

**Graph**
- **Intent:** show a trend / distribution / comparison visually.
- **Best for:** results over time or across categories.
- **Content:** one chart + title + one-line takeaway + source.
- **Visual:** single chart (bar/line) — indigo series + one purple highlight; one takeaway line.
- **Avoid when:** the data is a single number — use Metrics / a stat-spotlight.

**KPI Dashboard**
- **Intent:** a consolidated results snapshot.
- **Best for:** the end-of-Prove summary.
- **Content:** 4–6 KPIs + one supporting chart/table.
- **Visual:** *kpi-grid + side panel*. This is a density peak — follow with a section-break.
- **Avoid when:** early in the class, before there's context.

### 5 · Apply
**Case Study**
- **Intent:** show X working in a real situation.
- **Best for:** making the concept concrete.
- **Content:** context · what was done · outcome.
- **Visual:** narrative left + result metric / screenshot right.
- **Avoid when:** you have no real example — mark `[NEEDS INPUT]`, never fabricate one.

**Challenge → Solution**
- **Intent:** explain a problem and introduce a corresponding solution.
- **Best for:** case studies · product presentations · research applications.
- **Content:** ① Challenge ② Evidence ③ Impact ④ Solution.
- **Visual:** **left = problem · right = solution · bottom = evidence / result.**
- **Avoid when:** comparing multiple alternatives, or explaining a sequential process.

**Demo**
- **Intent:** walk through the thing (live or recorded).
- **Best for:** products, tools.
- **Content:** what you'll show · 2–3 key moments · a call to try it.
- **Visual:** large screen drop-zone + step captions + an "Open demo" pill.
- **Avoid when:** there's nothing live to show — use Screenshot.

**Screenshot**
- **Intent:** freeze one UI / output moment and annotate it.
- **Best for:** pointing at specifics.
- **Content:** image + 2–3 annotation callouts.
- **Visual:** full-bleed or framed screenshot, indigo annotation pins, minimal text.
- **Avoid when:** a flow needs several steps — use Demo.

### 6 · Practice
**Dataset**
- **Intent:** introduce the data learners will work with.
- **Best for:** hands-on sessions / exercises.
- **Content:** source · size · schema / fields · access.
- **Visual:** compact table + an "access / download" pill.
- **Avoid when:** there's no hands-on component.

**Exercise**
- **Intent:** give a task to do.
- **Best for:** applied learning.
- **Content:** goal · steps · expected result · time-box.
- **Visual:** numbered rule-line steps + a time chip.
- **Avoid when:** the session is purely informational.

**Quiz**
- **Intent:** check understanding.
- **Best for:** reinforcement / checkpoints.
- **Content:** question + options (answer revealed on the next slide).
- **Visual:** big question (*statement*), options as rule-line cards; the answer/reveal slide is **dark**.
- **Avoid when:** there's no single right answer — use open discussion.

### 7 · Close
**Takeaways**
- **Intent:** the 2–4 things to remember.
- **Best for:** the penultimate summary.
- **Content:** 2–4 one-line takeaways.
- **Visual:** rule-line cards or a numbered list; the single most important gets the one indigo card.
- **Avoid when:** introducing new material.

**Next Steps**
- **Intent:** what to do after the class.
- **Best for:** driving action / continued learning.
- **Content:** 2–3 actions · resources · a timeline.
- **Visual:** three rule-line cards or a short timeline.
- **Avoid when:** no follow-up is expected.

**Q&A**
- **Intent:** invite questions; a hold slide for discussion.
- **Best for:** the transition to discussion.
- **Content:** `Q & A` + contact.
- **Visual:** dark section-transition slide (one glow), big `Q & A`, contact line.
- **Avoid when:** — (always valid as the closer).

**References**
- **Intent:** cite sources / further reading.
- **Best for:** credibility and handoff.
- **Content:** numbered citations / links.
- **Visual:** two-column numbered list on light, thin dividers.
- **Avoid when:** — (optional; keep it concise).

---

## Facts discipline (hard rule)
Never invent numbers, quotes, benchmark results, dataset sizes, or case-study outcomes. Use only user-confirmed content; anything unconfirmed → mark **`[NEEDS INPUT]`** in place and list it back. Do not present placeholder metrics or fabricated examples as real.

## Build / edit
No pre-built artifact ships yet — build on request with the shared HTML→PPTX machinery in `brand-core.md`, or the `figma-use` + `figma-use-slides` Plugin API. Compose the deck by choosing formats per intent (above), inserting a dark section-break at each intent transition. The restyled research-paper Figma deck is a working reference for the exact treatment (dark section slides + light body + editorial rule-line cards): https://www.figma.com/slides/tUF7JCvtvLfarIMyUY9gB6. When built, drop slide previews in `101-class-lecture-previews/` and keep the registry row ✅.
