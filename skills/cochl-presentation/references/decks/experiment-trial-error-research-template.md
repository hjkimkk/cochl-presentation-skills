# Experiment / Trial & Error Research — deck (Research)

A **reusable format library** for research told as an *iterative journey* — not a single presentation, and not a linear success story. It exists so Claude Code can take raw research content and answer: **"What happened in this experiment?" → "Which slide format best communicates it?"**

The spine every deck follows:

```
Hypothesis → Experiment → Result → Learning → Iteration → Decision
```

Part of the **101 Class Presentation Format Library** (see [`101-class-lecture-template.md`](101-class-lecture-template.md) for the teaching-format engine this extends). Inherits [`../brand-core.md`](../brand-core.md) for all tokens, typography, the glow motif, page-nav, HTML→PPTX export, output flow, and QA. This spec defines only: the Cochl design application, the reusable **Trial → Result → Learning → Next Trial** component, the 11 slide formats (with full metadata), and the orchestration rules that pick a format from content.

---

## Design system application (Cochl)

- **Light body, dark section slides.** Content slides use the Cochl **light** treatment (white bg, near-black `#0B0B12` ink, indigo `#4B68FF` / purple `#832BFB` accents, soft `#F4F7FF`/`#EEF2FF` panels). The four **phase section-breaks** stay **dark** (near-black + one glow), grouping the spine:
  - **Frame** — Experiment Overview · Hypothesis · Experiment Setup
  - **Run** — Trial · Failed Experiment · Iteration
  - **Read** — Experiment Comparison · Experiment Results · Key Learnings
  - **Decide** — Final Decision · Next Experiment
- **Editorial "rule-line" cards.** Borderless: a thin light-grey top rule (`#D4D7DE`) at the content-column width, a small grey index/label (`#8A8E97`, IBM Plex Mono), an **IBM Plex Serif SemiBold** title, grey body (`#33343E`). Whitespace over boxes.
- **Status semantics (this deck's signature).** Outcomes are colour-coded and **never hidden**:
  - `#10B981` success — *held / worked / Keep*
  - `#F59E0B` warning — *partial / mixed / Modify*
  - `#EB5757` danger — *failed / did-not-hold / Abandon*
  - `#4B68FF` indigo — **Learning** (the payload of every trial) and the single highlight per slide
- **Type & accents:** IBM Plex Sans headings (Title Case), IBM Plex Mono UPPERCASE kickers/labels/trial-tags, short **indigo underline** under each slide title, gradient `cochl.` logo on cover + closer, gradient (purple→blue) only in brand-core's approved positions (stat text, thin underlines, section overlays, chart-highlight). ≤2 accent elements per content slide.
- Reserve **one** filled indigo highlight card per slide — on trial/iteration slides it is always the **Learning**; on the decision slide it is the **verdict**.

---

## Core component — `TRIAL → RESULT → LEARNING → NEXT TRIAL`

The atom of the whole deck. One **unit** is a left-to-right chain of three rule-line nodes plus a hand-off arrow. Reuse it standalone (a single **Trial** slide) or stack/append units (an **Iteration** slide).

**Anatomy of one unit**
```
┌ TRIAL #N ──────┐   ┌ RESULT ────────┐   ┌ LEARNING ───────┐
│ (mono tag)     │ → │ status chip ●  │ → │ indigo highlight│ ──▶ next trial
│ What we tried  │   │ What happened  │   │ What it taught  │
│ Why (optional) │   │ + metric/Δ     │   │ → feeds Trial N+1│
└────────────────┘   └────────────────┘   └─────────────────┘
```

- **Trial node** — mono tag `TRIAL #N`; serif title *What we tried*; optional grey *why* line. Neutral rule-line card.
- **Result node** — a **status chip** (● success / ● warning / ● danger) + serif *what happened* + one metric or Δ. Neutral card; the chip carries the verdict, so a failed result stays fully legible.
- **Learning node** — the **indigo highlight** card (white text). This is the point of the unit; it is what the arrow carries forward.
- **Hand-off arrow** — purple `→` between nodes, and a purple `▶` from Learning to the next unit's Trial. The arrow *is* the argument: each experiment visibly causes the next.

**Tokens:** node top-rule `#D4D7DE`; Trial tag mono `#8A8E97`; titles IBM Plex Serif SemiBold `#0B0B12`; body `#33343E`; status chips per the semantics above; Learning card `#4B68FF` fill, white/`#E5EBFF` text; arrows `#832BFB`.

**Reuse rules**
- Same anatomy every time — only the data changes. Never restyle it per trial; consistency across trials is the point.
- A **failed** trial uses the *same* unit with a danger chip — do not drop it or shrink it. Failures and successes get equal visual weight.
- One unit → **Trial** / **Failed Experiment** (expand the Result into expected-vs-actual). Multiple units in a row/serpentine → **Iteration**.

---

## Design principles

1. **Process over answer.** The iteration chain is the hero; the final decision is one slide, not the whole story.
2. **Show failures.** Failed trials are first-class slides (`Failed Experiment`) and stay visible inside the iteration chain with a danger chip — never edited out.
3. **Make causality obvious.** Every Learning node hands off to the next Trial via an arrow; the reader can trace *why* trial N+1 exists.
4. **Not a success story.** No slide implies a straight line from hypothesis to win; expected-vs-actual contrast is built into Results and Failed Experiment.
5. **Evidence, comparison, decision.** Results distinguish expected vs actual; Comparison names a winner on shared criteria; Final Decision states Keep/Modify/Abandon *with reasoning*.
6. **Consistent hierarchy across trials.** The core component is byte-for-byte the same each time, so ten trials read as one system.
7. **Reusable with any research data.** Every field is a `[ placeholder ]`; the same component renders any study's trials.

---

## Slide-format library

Each format: **Intent · Best for · Content structure · Recommended layout · Required components · Optional components · Data visualization · When to use · When NOT to use.**

### Frame

#### 1 · Experiment Overview
- **Intent:** frame the study — the question, the goal, the boundaries.
- **Best for:** the first content slide; setting context before any trial.
- **Content structure:** Research Question · Objective · Scope.
- **Recommended layout:** Research Question as a large statement (one `grad-text` phrase) up top; Objective + Scope as two rule-line cards beneath.
- **Required components:** title block; Research Question (statement); Objective card; Scope card.
- **Optional components:** timebox / owner chip; dataset reference.
- **Data visualization:** none (text-forward).
- **When to use:** once per study, to open it.
- **When NOT to use:** mid-deck; for a single attempt (use `Trial`).

#### 2 · Hypothesis
- **Intent:** state what you expected *before* testing, and how you'd know you were right.
- **Best for:** right after Overview, before setup.
- **Content structure:** Hypothesis · Expected Outcome · Success Criteria.
- **Recommended layout:** hypothesis statement left (large); Expected Outcome + Success Criteria as a right rail; Success Criteria as a checklist.
- **Required components:** Hypothesis statement; Expected Outcome; measurable Success Criteria.
- **Optional components:** confidence level; prior assumption note.
- **Data visualization:** optional target / threshold line.
- **When to use:** the content explains what was expected before testing.
- **When NOT to use:** describing how it was run (`Experiment Setup`) or what happened (`Trial`/`Results`).

#### 3 · Experiment Setup
- **Intent:** make the method reproducible.
- **Best for:** after Hypothesis, before trials.
- **Content structure:** Variables · Control vs. Test · Conditions · Evaluation Method.
- **Recommended layout:** a 2×2 rule-line grid, or a Control | Test split with a Variables/Evaluation strip beneath.
- **Required components:** Variables; Control vs. Test split; Evaluation Method.
- **Optional components:** Conditions / environment; dataset; apparatus.
- **Data visualization:** a small variables table.
- **When to use:** the content explains how the experiment was conducted.
- **When NOT to use:** results or learnings.

### Run

#### 4 · Trial (Trial #N)  — *core component, single unit*
- **Intent:** document one specific attempt and what it taught.
- **Best for:** each individual iteration.
- **Content structure:** What We Tried · Why We Tried It · Result · Learning.
- **Recommended layout:** one `TRIAL → RESULT → LEARNING` unit with a `TRIAL #N` tag and a result status chip.
- **Required components:** Trial number/label; What We Tried; Result (+ status chip); Learning (indigo highlight).
- **Optional components:** Why We Tried It; a metric; a screenshot.
- **Data visualization:** a single result metric or mini-chart.
- **When to use:** the content explains one specific attempt.
- **When NOT to use:** connecting multiple attempts (`Iteration`) or a failure deep-dive (`Failed Experiment`).

#### 5 · Failed Experiment
- **Intent:** give a failure its due — expected vs actual, why, and the lesson.
- **Best for:** a trial that didn't work but produced insight.
- **Content structure:** Approach · Expected Result · Actual Result · Why It Failed · What We Learned.
- **Recommended layout:** Expected | Actual side-by-side with the mismatch highlighted (Actual carries a danger chip); a *Why it failed* rule-line; *What we learned* as the indigo highlight; a `✗ DID NOT HOLD` banner.
- **Required components:** Approach; Expected-vs-Actual contrast; Why It Failed; What We Learned.
- **Optional components:** the failing metric/graph; an error example.
- **Data visualization:** expected-vs-actual bars, delta highlighted in danger.
- **When to use:** the result was unsuccessful **and** provides a learning.
- **When NOT to use:** a successful trial (`Trial`) — and never to bury the failure.

#### 6 · Iteration  — *core component, repeated*
- **Intent:** show the chain — how each experiment fed the next. The spine of the deck.
- **Best for:** connecting ≥2 trials chronologically.
- **Content structure:** Trial #1 → Learning → Trial #2 → Learning → Trial #3 …
- **Recommended layout:** the core unit repeated in a horizontal (or serpentine) chain; each Learning hands off by arrow to the next Trial. Failed trials stay inline with a danger chip.
- **Required components:** ≥2 trials; the linking Learning between each; directional connectors.
- **Optional components:** per-trial status chips; a running metric trend.
- **Data visualization:** a small trend line beneath the chain (a metric across trials).
- **When to use:** multiple attempts are connected chronologically.
- **When NOT to use:** a single trial, or comparing approaches at one moment (`Experiment Comparison`).

### Read

#### 7 · Experiment Comparison
- **Intent:** compare approaches/trials on shared criteria and name the winner.
- **Best for:** choosing between ≥2 approaches.
- **Content structure:** approaches × criteria; a highlighted best.
- **Recommended layout:** a comparison table/matrix (approaches as columns), best column highlighted indigo; or a scored matrix.
- **Required components:** ≥2 approaches; shared criteria; a highlighted best-performer.
- **Optional components:** criterion weights; score totals; a recommendation line.
- **Data visualization:** table / matrix; optional grouped bars.
- **When to use:** multiple approaches are being compared.
- **When NOT to use:** a chronological progression (`Iteration`) or a single result (`Experiment Results`).

#### 8 · Experiment Results
- **Intent:** present the evidence; distinguish **expected vs actual**; highlight meaningful change.
- **Best for:** the quantitative outcome.
- **Content structure:** chart(s) · expected vs actual · highlighted deltas · one takeaway.
- **Recommended layout:** one primary chart — expected as a ghost/dashed reference, actual as solid indigo; a callout on the meaningful change; a takeaway line.
- **Required components:** a chart; expected-vs-actual distinction; one takeaway.
- **Optional components:** significance / CI; secondary metric tiles; source.
- **Data visualization:** bar or line with an expected reference vs actual; delta highlighted.
- **When to use:** presenting measured outcomes.
- **When NOT to use:** there's no data yet (`Hypothesis`) or the finding is qualitative-only (`Key Learnings`).

#### 9 · Key Learnings
- **Intent:** distil 3–5 insights and **separate findings (evidenced) from assumptions (unproven)**.
- **Best for:** synthesis before the decision.
- **Content structure:** 3–5 insights, each tagged Finding or Assumption.
- **Recommended layout:** rule-line cards, each with a `FINDING` (indigo) or `ASSUMPTION` (muted/outline) tag; the top insight as the indigo highlight.
- **Required components:** 3–5 insights; Finding/Assumption tags.
- **Optional components:** an evidence link per finding; a confidence marker.
- **Data visualization:** none.
- **When to use:** summarising what was learned across trials.
- **When NOT to use:** a single trial's learning (`Trial`) or the decision itself (`Final Decision`).

### Decide

#### 10 · Final Decision
- **Intent:** the choice — **Keep / Modify / Abandon** — with the reasoning.
- **Best for:** closing the study.
- **Content structure:** Decision (one of three) · Reasoning · evidence basis.
- **Recommended layout:** a large verdict, colour-coded (Keep `#10B981` / Modify `#4B68FF` / Abandon `#EB5757`); reasoning bullets; a *based on* evidence recap.
- **Required components:** the decision (exactly one of the three); the reasoning.
- **Optional components:** dissent / risks; conditions; owner / date.
- **Data visualization:** none, or a tiny evidence recap.
- **When to use:** the research produces a final choice.
- **When NOT to use:** still iterating (`Iteration` / `Next Experiment`).

#### 11 · Next Experiment
- **Intent:** what's still open and what you'll test next — research is never "done".
- **Best for:** the forward-looking closer.
- **Content structure:** Remaining Question · New Hypothesis · Next Test.
- **Recommended layout:** three rule-line cards, or a "loop-back" motif pointing to the top of the cycle.
- **Required components:** Remaining Question; a New Hypothesis or Next Test.
- **Optional components:** priority; owner; timebox.
- **Data visualization:** none.
- **When to use:** the result creates a new research question.
- **When NOT to use:** the study is fully closed with no follow-up (then `Final Decision` alone).

---

## Orchestration rules

Given a chunk of raw research content, classify it and pick the format. Match top-to-bottom; **the first matching, more specific rule wins.**

| If the content… | → Format |
|---|---|
| frames the study (question / objective / scope) | **Experiment Overview** |
| explains what we expected *before* testing | **Hypothesis** |
| explains *how* the experiment was conducted (variables, control/test, method) | **Experiment Setup** |
| is one attempt that **failed** and yields a learning | **Failed Experiment** |
| is one specific attempt (any outcome) | **Trial** |
| connects multiple attempts **chronologically** | **Iteration** |
| **compares** multiple approaches at one point in time | **Experiment Comparison** |
| reports **measured** outcomes / charts (expected vs actual) | **Experiment Results** |
| synthesises 3–5 insights across trials | **Key Learnings** |
| states a final choice (keep / modify / abandon) | **Final Decision** |
| raises a **new** research question / next test | **Next Experiment** |

**Precedence & tie-breaks**
- **Failed Experiment beats Trial** when a single attempt failed *and* there's a lesson — the failure deserves the deep-dive.
- **Iteration beats repeated Trials** when ≥2 attempts are linked in time — build one chain, don't spam single-trial slides.
- **Iteration vs Comparison:** chronological cause-and-effect → Iteration; side-by-side on shared criteria at one moment → Comparison.
- **Results vs Key Learnings:** numbers/charts → Results; distilled qualitative insight → Key Learnings.
- **Always keep failures visible** — never route a failure to a slide that hides it. If in doubt between Trial and Failed Experiment for an unsuccessful attempt, choose Failed Experiment.
- **Default assembly:** Overview → Hypothesis → Setup → §Run → (Trial / Failed Experiment)… → Iteration → §Read → Results → Comparison → Key Learnings → §Decide → Final Decision → Next Experiment. Insert a dark phase section-break at each of the four phase boundaries; drop any format the study doesn't need.

---

## Facts discipline (hard rule)
Trial & error decks live or die on honest numbers. Use only user-confirmed results, metrics, and outcomes — expected **and** actual. Never soften a failure, invent a delta, or present an assumption as a finding. Anything unconfirmed → mark **`[NEEDS INPUT]`** in place and list it back.

## Build / edit
No pre-built artifact ships yet — build on request with the shared HTML→PPTX machinery in `brand-core.md`, or the `figma-use` + `figma-use-slides` Plugin API. Assemble by running content through the orchestration rules, reusing the `TRIAL → RESULT → LEARNING → NEXT TRIAL` component wherever a trial appears, and inserting a dark phase section-break at each phase boundary. The restyled research-paper Figma deck is a working reference for the exact Cochl treatment (dark section slides + light body + editorial rule-line cards): https://www.figma.com/slides/tUF7JCvtvLfarIMyUY9gB6. When built, drop previews in `experiment-trial-error-research-previews/` and keep the registry row ✅.
