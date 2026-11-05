---
name: proposal-doc
description: >
  Generates Cochl.ai design proposal documents strictly following the structure,
  layout grammar, and writing style extracted from the official Cochl proposal PDFs
  (01–06.pdf, examples/source-pdfs/).
---

# Proposal Document Template Skill

## Source of Truth

This skill is derived from 6 official Cochl.ai proposal PDFs. Every structural rule,
layout pattern, and writing convention below was extracted directly from those documents.
**Do not invent sections or patterns not present in the source.**

**Brand:** read `../cochl-design/core/brand-core.md`, then `../cochl-design/core/themes/plex.md`. Default theme `plex`. Paste the theme's `:root` block into the output `<style>` before any template CSS, and its Google Fonts `<link>` into `<head>`. Run `../cochl-design/core/qa-checklist.md` before delivering.

### Source pages (one PDF per section)
```
01.pdf → Cover page
02.pdf → Project Overview (Scope + Timeline)
03.pdf → Milestones
04.pdf → Payments
05.pdf → Terms and Conditions
06.pdf → Final Summary + Signature
```

---

## Document Architecture

A complete proposal is exactly **6 sections** in this order:

```
1. Cover
2. Project Overview
   2a. Scope
   2b. Timeline
3. Milestones
4. Payments
5. Terms and Conditions
6. Final Summary
```

Each section is a **standalone page** — full page break before each. Never merge sections.

---

## Page Layout System

### Page dimensions
- Format: A4 (210 × 297mm) or US Letter
- All pages: white background, left-aligned content
- Top margin: generous (logo/title breathing room)

### Persistent footer (every page)
```
────────────────────────────────────────────────────
<presenter name>                Cochl.ai · San Francisco, CA, USA
<presenter role> (optional)     contact@cochl.ai · www.cochl.ai
```
- Thin horizontal rule above footer
- Left column: presenter name + optional role. The presenter can be a person ("HJ Kim" / "Product Design") or a team ("Cochl BD Team", no role line). Never default the role to "Product Design" — use what the user gave, or drop the line.
- Right column: company facts from `../cochl-design/core/brand-core.md` §3b, verbatim (contact@cochl.ai, www.cochl.ai, San Francisco, CA, USA). Do not add a street address or other email — they are not confirmed facts.

### Logo placement
- **Cover only**: top-left corner (cochl. logotype with dot)
- **Final Summary only**: centered, above footer

---

## Typography System

Extracted from the PDFs:

Font roles (values in `../cochl-design/core/themes/plex.md`): body = `--font-doc`; headings = `--font-sans`; monospace headings = `--font-mono`.

**Korean (and other Hangul) documents:** `--font-doc` has no Hangul glyphs, and brand-core has no Korean font role yet. Until one exists, do not add a font name to the CSS; set `<html lang="ko">` so the theme's trailing `sans-serif` resolves to the OS Korean face (Apple SD Gothic Neo on macOS, Malgun Gothic on Windows, Noto Sans CJK KR on Linux/Android). Latin text keeps `--font-doc`. Check the PDF before delivering — Hangul must not render as boxes. For a mixed document, put `lang="ko"` on the Korean blocks only.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title (H1) | ~48–56px | Extra Bold / Black | One per page, top of content |
| Section heading (H2) | ~22–24px | Bold | Subsections within a page |
| Body text | ~14–16px | Regular | Paragraphs, descriptions |
| Footer text | ~10–11px | Regular | Two-column footer |
| Monospace sections | ~14px | Regular | Used in legal/terms sections (GDPR, Governing Law) |

**Mixed typography rule (Terms page only):** Some H2 headings use default sans-serif weight; the GDPR Compliance and Governing Law subsections render their headings in a monospace/code font — this signals technical/legal content requiring exact language.

### Variable/placeholder style
All fill-in variables use `<angle-bracket>` notation and render in **blue hyperlink color** (`.var`, `--doc-link`):
- `<client's name>`
- `<designer's name>`
- `<country>`
- `<project name>`

**Which marker — one rule:** a template slot the author fills in (a name, role, country, amount, signature line) is `<span class="var">&lt;slot&gt;</span>`; a fact or figure the document states as true but the user has not confirmed (a date, price, count, deal value, client claim) is `<span class="needs-input">[NEEDS INPUT]</span>` (`brand-core.md` §1b, `qa-checklist.md` → NEEDS INPUT). Never mix the two on one value.

---

## Section Specifications

### 1. COVER

**Purpose:** Professional first impression. Establishes date, document type, and parties.

**Layout:**
```
[cochl. logo — top left]

[generous vertical space]

[date — centered, regular weight, ~14px]

[Document Title — centered, ~48-56px, Extra Bold]

[generous vertical space]

[footer]
```

**Required fields:**
- Date (top, centered, e.g. "January 1, 2026")
- Title: "Design Proposal" (or as specified)
- Footer: presenter name + role | company info

**Writing rule:** No body text on the cover. Title speaks for itself.

---

### 2. PROJECT OVERVIEW

**Purpose:** Define what will be done, in what phases, by when.

**Structure:**
```
[Page Title: "Project Overview"]

## Scope

• [Phase 1 name]
  [2-3 sentence description]

• [Phase 2 name]
  [2-3 sentence description]

[... additional phases]

## Timeline

[Estimated completion sentence]

[Visual horizontal timeline]
```

**Scope writing pattern:**
- Bullet item = phase name (bolded in context)
- Each bullet followed by 1–3 sentences explaining what happens, who does it, and what the deliverable is
- Voice follows the presenter (see Writing Style Guide → Voice): "I will..." for a solo designer, "we will..." for a team or BD proposal
- Uses semicolons to end bullet descriptions (not periods) — consistent with source

**Timeline format:**
```
Estimated completion time of [X–Y weeks/months].

[Date]    [Date]    [Date]    [Date]
  │          │         │         │
[Phase]   [Phase]  [Phase]  [End point]
[duration] [duration] [duration]
```

- Dates above the flow (e.g. "13.Feb", "16.Feb")
- Phase boxes below with name + duration
- Final node = the end point of the engagement, no duration. Source default: "Handover". Use the term that fits the work ("Launch", "Go-live", "Contract signed", "Decision"); if the end date is unconfirmed, the date is `[NEEDS INPUT]`, not invented
- Duration shown under phase name (e.g. "3-4 days", "10 weeks")

---

### 3. MILESTONES

**Purpose:** Translate scope into concrete, deliverable-bound checkpoints.

**Structure:**
```
[Page Title: "Milestones"]

## Milestone 1: [Phase Name(s)]

• Deliverables:
  • [Deliverable 1]
  • [Deliverable 2]
    • [Sub-deliverable]
    • [Sub-deliverable]
  • [Deliverable 3]

• [Phase name]
  [Brief description of that phase's process]

## Milestone 2: [Phase Name(s)]

• Deliverables 1:
  • [Item]

• Deliverables 2:
  • [Item]
```

**Rules:**
- Each milestone name includes the phase(s) it covers, e.g. "Milestone 1: Discovery and Research, Website Design"
- Deliverables use nested bullet lists (up to 3 levels deep)
- Each milestone may include a process note (not just deliverables) — a sentence explaining what happens during development/review

---

### 4. PAYMENTS

**Purpose:** Define the financial structure clearly. Reduce ambiguity.

**Structure:**
```
[Page Title: "Payments"]

[One-paragraph intro explaining payment model]

| Item           | Week  | Total, USD |
|----------------|-------|------------|
| Initial Deposit | -    | $X,XXX     |
| Milestone 1*   | 1-4   | $X,XXX     |
| Milestone 2**  | 5-7   | $X,XXX     |
|                |       |            |
|                | Total:| $X,XXX     |

*Milestone 1 Payment: [condition — when due]

**Milestone 2 Payment: [condition — when due]
```

**Intro paragraph pattern** (source default, freelance-style):
> "The project will follow a milestone-based payment schedule. To initiate the project, a [X]% non-refundable deposit of the total project cost is required."

For a team / BD / commercial proposal, describe the client's actual terms instead (e.g. "Invoiced on signature, then per milestone, net 30"). If no terms or amounts were supplied, say so and mark each figure `[NEEDS INPUT]` — never invent a deposit.

**Table rules:**
- 3 columns: Item | Week | Total, USD
- Header row: bold
- Currency: right-aligned
- Horizontal lines: top and bottom of table only; single line above Total row
- Total row: bold label, bold amount, right-aligned
- Footnotes below table using * ** notation

**Source default structure** (solo design engagement — use only when it matches the deal):
- Initial Deposit = 30% (non-refundable)
- Milestone 1 = due upon final design delivery
- Milestone 2 = due upon completion of development and before final file delivery

Otherwise keep the same 3-column table and rename the rows to the real schedule (e.g. "On signature", "Phase 1", "Annual licence"); drop the deposit row if there is none.

---

### 5. TERMS AND CONDITIONS

**Purpose:** Legal protection for both parties. Standard clauses.

**Structure:**
```
[Page Title: "Terms and Conditions"]

## Intellectual Property Rights (IPR)
[Paragraph]

## Timing of Intellectual Property Transfer
[Paragraph]

## Third-Party Intellectual Property
[Paragraph]

## GDPR Compliance        ← monospace heading
[Paragraph]

## Governing Law          ← monospace heading
[Paragraph]
```

**Standard clauses (from source):**

**IPR:** All IP transfers to `<client's name>` upon full payment. Client gets rights to use, modify, reproduce, distribute without limitation.

**IPR Transfer Timing:** IP transfers upon receipt of final payment. Until then, IP remains property of `<designer's name>`.

**Third-Party IP:** `<designer's name>` guarantees no third-party IP infringement.

**GDPR Compliance (monospace):** Website will comply with GDPR including cookie consent banner. Client provides cookie descriptions.

**Governing Law (monospace):** Agreement governed by laws of `<country>`.

**Typography note:** GDPR and Governing Law headings use monospace/code font — signals these are formulaic legal clauses requiring precise language, not narrative explanations.

---

### 6. FINAL SUMMARY

**Purpose:** Personal close. Confirms commitment, invites questions, requests signature.

**Structure:**
```
[Page Title: "Final Summary"]

Dear <client's name>,

[2-3 sentence personal letter confirming ability to deliver, inviting questions]

Thank you!

[Name]
[(xxx) xxx-xxxx]

────────────────────────────────────────────────────

Please sign below to approve this proposal and <sign-off action>.

┌─────────────────────────┐  ┌─────────────────────────┐
│ Date                    │  │ Signature               │
└─────────────────────────┘  └─────────────────────────┘

[cochl. logo — centered]

[footer]
```

**Letter body pattern** (solo voice; for a team use "we" / "our team" throughout):
> "Thank you for your inquiry and the interest you have shown. I've reviewed the project brief and can confirm that I'll be able to deliver the work within the specified time frame and budget. Please don't hesitate to contact me if you have any further questions."

**Signature block:**
- Horizontal rule separates letter from signature block
- "Please sign below to approve this proposal and `<sign-off action>`." — fixed phrase with one slot. Source default: "begin the project"; use what fits ("proceed with the engagement", "confirm the partnership")
- Phone line under the presenter name is optional — omit it rather than print `(xxx) xxx-xxxx` in a delivered document
- Two boxes side by side: Date | Signature
- Logo appears between signature block and footer (Final Summary page only)

---

## Writing Style Guide

### Voice
- Matches the presenter: first person singular ("I will", "I'll", "I've") for a solo designer — the source default; first person plural ("we will", "our team") for a team or BD proposal. Pick one and keep it on every page, Terms included (`<designer's name>` becomes the team or company name)
- Addressed directly to client: "you", "your"
- Confident and reassuring, not formal-legalistic

### Sentence structure
- Short, declarative sentences in scope/milestones
- Process sentences follow the pattern: action → clarification → benefit
  - "I will update regularly on the status of development so you always have a clear insight into the progress"
- Bullet descriptions end with semicolons in scope section
- Legal sections use longer, clause-heavy sentences

### What to avoid
- Passive voice in scope/timeline sections
- Jargon without explanation
- Vague deliverable descriptions ("various designs") — always name specific outputs
- Generic filler ("We are pleased to present...")

---

## Variable Conventions

All placeholder variables use `<angle-bracket>` notation:

| Variable | Where used |
|---|---|
| `<client's name>` | Final Summary letter, Terms |
| `<designer's name>` | Terms (IPR, GDPR, Third-Party) |
| `<country>` | Governing Law |
| `<project name>` | Cover, Overview (when project name is contextual) |
| `<presenter role>` | Footer left column — optional, omit for a team |
| `<sign-off action>` | Final Summary signature prompt (default "begin the project") |

When generating a real proposal, substitute all variables before output.
When generating a template, render variables in **blue** or a distinct color.

---

## Construction Process

When invoked, follow this sequence:

1. **Read source** — parse `.md` input file or user-provided arguments (project, client, presenter, date, scope, budget)
2. **Calculate payments** — from the user's terms; the 30%-deposit split is the solo-designer default only (see Payments). No terms supplied → amounts `[NEEDS INPUT]`
3. **Derive timeline** — build phase dates/durations from scope items
4. **Generate HTML** — produce a single self-contained `.html` file using the HTML Design System below
5. **Embed SVG logo** inline from `assets/logo_cochl_top.svg`, with the gradient stops on the logo tokens (see Logo)
6. **Mark unfilled variables** as `<span class="var">&lt;variable&gt;</span>` (renders blue) and unconfirmed facts as `[NEEDS INPUT]` (see Variable/placeholder style)
7. **Save** to `{project-slug}-proposal.html` in same directory as source, or to `output` path
8. **Open** in browser after writing

**Primary output format: HTML** (print-ready, A4, `Cmd+P → Save as PDF` from browser).
Markdown output is secondary and only generated when explicitly requested.

---

## HTML Design System

This is the exact CSS and HTML structure validated against the 6 source PDFs.
**Use this verbatim. Do not invent new patterns.**

### CSS

```css
/* ─── Reset ─────────────────────────────────────────── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

/* ─── Screen wrapper ─────────────────────────────────── */
html { background: var(--doc-canvas); }
body {
  font-family: var(--font-doc);
  font-size: 15px;
  font-weight: 400;
  color: var(--ink-body);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

/* ─── Page ───────────────────────────────────────────── */
.page {
  width: 210mm;
  height: 297mm;               /* fixed A4 — one .page = one printed sheet; content must fit */
  background: var(--light-bg);
  margin: 32px auto;
  padding: 52px 56px 36px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 24px var(--light-border);
}
.page-body { flex: 1; }

/* ─── Typography ─────────────────────────────────────── */
h1 { font-size: 52px; font-weight: 900; letter-spacing: -0.025em; line-height: 1.05; color: var(--ink); }
h1.sub { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin-top: 10px; }
h2 { font-size: 21px; font-weight: 700; letter-spacing: -0.01em; margin-top: 36px; margin-bottom: 12px; color: var(--ink); }
h2.mono { font-family: var(--font-mono); font-size: 18px; font-weight: 500; margin-top: 32px; }
p { margin-bottom: 10px; }

/* ─── Placeholders (see Variable/placeholder style) ──── */
.var { color: var(--doc-link); }                      /* unfilled template slot */
.needs-input{ color:var(--accent); border-bottom:1px dashed var(--accent); font-style:italic; } /* unconfirmed fact — brand-core §1b, verbatim */

/* ─── Cover ──────────────────────────────────────────── */
.cover { justify-content: space-between; }
.cover-logo { display: block; color: var(--ink); }  /* wordmark uses fill="currentColor" */
.cover-center {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 60px 0 80px;
}
.cover-date { font-size: 14px; font-weight: 400; color: var(--ink-muted); margin-bottom: 24px; }

/* ─── Footer ─────────────────────────────────────────── */
.footer {
  margin-top: 48px; padding-top: 10px;
  border-top: 1px solid var(--doc-rule);
  display: flex; justify-content: space-between; align-items: flex-start;
  font-size: 10.5px; color: var(--ink-soft); line-height: 1.55;
}
.footer-left strong { font-weight: 600; color: var(--ink); display: block; }
.footer-right { text-align: right; }

/* ─── Bullet lists ───────────────────────────────────── */
ul { list-style: none; padding-left: 0; margin: 4px 0; }
ul li { position: relative; padding-left: 20px; margin-bottom: 8px; }
ul li::before { content: '·'; position: absolute; left: 6px; color: var(--ink-muted); font-size: 16px; line-height: 1.5; }
ul.scope > li { margin-bottom: 18px; padding-left: 0; }
ul.scope > li::before { display: none; }
ul.scope > li > strong { display: block; font-weight: 600; margin-bottom: 2px; color: var(--ink); }
ul.scope > li > strong::before { content: '· '; color: var(--ink-muted); }
ul ul { margin-top: 6px; margin-left: 16px; }
ul ul li::before { content: '○'; font-size: 9px; top: 4px; left: 4px; }
ul ul ul li::before { content: '▪'; font-size: 8px; top: 5px; left: 3px; }

/* ─── Timeline ───────────────────────────────────────── */
.timeline {
  margin-top: 20px; display: flex; align-items: flex-start;
  position: relative; padding-top: 24px;
}
.timeline::before {
  content: ''; position: absolute; top: 46px; left: 0; right: 0;
  height: 1px; background: var(--doc-line);
}
.tl-node { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.tl-node:last-child { flex: 0 0 auto; min-width: 80px; }  /* sized to its content so [NEEDS INPUT] never wraps */
.tl-date { font-size: 11px; color: var(--ink-muted); margin-bottom: 10px; white-space: nowrap; }  /* one line → every tick stays on the rule */
.tl-tick { width: 1px; height: 12px; background: var(--doc-tick); margin-bottom: 8px; }
.tl-name { font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.3; }
.tl-dur { font-size: 11px; color: var(--ink-faint); margin-top: 3px; }

/* ─── Payment table ──────────────────────────────────── */
.pay-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 12px; font-size: 14px; }
.pay-table thead tr th { font-weight: 700; padding: 10px 8px; text-align: left; border-top: 1.5px solid var(--ink); border-bottom: 1px solid var(--doc-line); }
.pay-table thead tr th:last-child { text-align: right; }
.pay-table tbody tr td { padding: 10px 8px; }
.pay-table tbody tr td:last-child { text-align: right; }
.pay-table tfoot tr td { padding: 10px 8px; font-weight: 700; border-top: 1px solid var(--doc-line); border-bottom: 1.5px solid var(--ink); }
.pay-table tfoot tr td:last-child { text-align: right; font-weight: 900; font-size: 15px; }
.pay-note { font-size: 12.5px; color: var(--ink-soft); margin-top: 8px; line-height: 1.5; }

/* ─── Signature ──────────────────────────────────────── */
.sig-prompt { font-size: 14px; margin-bottom: 20px; }
.sig-boxes { display: flex; gap: 20px; }
.sig-box { flex: 1; border: 1.5px solid var(--doc-box-border); padding: 16px 16px 40px; font-size: 13px; color: var(--ink-muted); font-weight: 500; }

/* ─── Final summary logo ─────────────────────────────── */
.summary-logo { display: flex; justify-content: center; margin-top: 48px; margin-bottom: 8px; color: var(--ink); }

/* ─── Letter ─────────────────────────────────────────── */
.letter-body p { margin-bottom: 16px; }
.letter-sig { margin-top: 24px; line-height: 1.8; }
.letter-rule { height: 1px; background: var(--doc-rule); margin: 32px 0; }

/* ─── Print ──────────────────────────────────────────── */
@page { size: A4; margin: 0; }   /* the .page padding is the margin; overrides the browser default */
@media print {
  html, body { background: var(--light-bg); }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { margin: 0; box-shadow: none; width: 210mm; height: 296.8mm; /* a hair under A4: 297mm rounds up and adds a blank 7th sheet */ overflow: hidden; break-after: page; page-break-after: always; }
  .page:last-child { break-after: auto; page-break-after: auto; }
}
```

### Google Fonts link (required)
```html
<!-- paste the <link> tag from ../cochl-design/core/themes/plex.md here -->
```

---

## Logo

Logo rules (clear space, minimum size, do-not-recolor): `../cochl-design/core/brand-core.md` → Logo.
Source file: `assets/logo_cochl_top.svg`

Always embed inline (not via `<img src>`). Use unique `linearGradient` IDs per instance to avoid SVG defs conflicts.

When inlining, point the colours at the theme tokens so the logo can never drift from brand-core:
- the three gradient stops → `style="stop-color:var(--logo-g1)"`, `var(--logo-g2)`, `var(--logo-g3)` (replace the `stop-color` hex attributes)
- the wordmark path → `fill="currentColor"` (`.cover-logo` / `.summary-logo` set `color: var(--ink)`)

**Cover** — `width="100" height="22"`, gradient ID: `paint0_cover`
**Final Summary** — `width="85" height="18"`, centered via `.summary-logo`, gradient ID: `paint0_summary`

---

## HTML Page Templates

### Page shell
Every page uses this wrapper:
```html
<div class="page [cover|]">
  <div class="page-body">
    <!-- content -->
  </div>
  <div class="footer">
    <div class="footer-left">
      <strong>[Presenter name or team]</strong>
      [Presenter role — optional; delete this line if none was given]
    </div>
    <div class="footer-right">
      Cochl.ai · San Francisco, CA, USA<br>
      contact@cochl.ai · www.cochl.ai
    </div>
  </div>
</div>
```

### Page 1 — Cover
```html
<div class="page cover">
  <div class="cover-logo">
    [INLINE SVG — logo_cochl_top.svg, width="100" height="22", id=paint0_cover, stops on --logo-g1..3]
  </div>
  <div class="cover-center">
    <div class="cover-date">[Date]</div>
    <h1>Design Proposal</h1>
    <h1 class="sub">[Project Title]</h1>
  </div>
  [footer]
</div>
```

### Page 2 — Project Overview
```html
<div class="page">
  <div class="page-body">
    <h1>Project Overview</h1>
    <h2>Scope</h2>
    <ul class="scope">
      <li><strong>[Phase 1]</strong>[description ending with semicolon];</li>
      <li><strong>[Phase 2]</strong>[description ending with semicolon];</li>
      <!-- last item ends with period -->
      <li><strong>[Phase N]</strong>[description ending with period.]</li>
    </ul>
    <h2>Timeline</h2>
    <p>Estimated completion time of [X–Y weeks].</p>
    <div class="timeline">
      <div class="tl-node">
        <div class="tl-date">[DD.Mon]</div>
        <div class="tl-tick"></div>
        <div class="tl-name">[Phase Name]</div>
        <div class="tl-dur">[X weeks]</div>
      </div>
      <!-- repeat nodes; last node has no .tl-dur, name = the end point (default "Handover") -->
      <div class="tl-node">
        <div class="tl-date">[DD.Mon]</div>
        <div class="tl-tick"></div>
        <div class="tl-name">[End point — e.g. Handover]</div>
      </div>
    </div>
  </div>
  [footer]
</div>
```

### Page 3 — Milestones
```html
<div class="page">
  <div class="page-body">
    <h1>Milestones</h1>
    <h2>Milestone 1: [Phase Name(s)]</h2>
    <ul>
      <li>Deliverables:
        <ul>
          <li>[Deliverable]</li>
          <li>[Deliverable with sub-items]:
            <ul><li>[Sub-item]</li></ul>
          </li>
        </ul>
      </li>
      <li>[Process phase name]<br>
        <span style="font-size:13.5px;color:var(--ink-soft);">[process note ending with semicolon];</span>
      </li>
    </ul>
    <h2>Milestone 2: [Phase Name(s)]</h2>
    <ul>
      <li>Deliverables 1: <ul><li>[item]</li></ul></li>
      <li>Deliverables 2: <ul><li>[item]</li></ul></li>
    </ul>
  </div>
  [footer]
</div>
```

### Page 4 — Payments
```html
<div class="page">
  <div class="page-body">
    <h1>Payments</h1>
    <!-- solo-designer default below; for a team/BD proposal write the client's actual terms (see Payments) -->
    <p style="margin-top:28px;">The project will follow a milestone-based payment schedule. To initiate the project, a <span class="var">&lt;deposit %&gt;</span> non-refundable deposit of the total project cost is required.</p>
    <table class="pay-table">
      <thead>
        <tr><th>Item</th><th>Week</th><th>Total, USD</th></tr>
      </thead>
      <tbody>
        <tr><td>Initial Deposit</td><td>—</td><td><span class="var">&lt;deposit&gt;</span></td></tr>
        <tr><td>Milestone 1*</td><td>1–[N]</td><td><span class="var">&lt;amount&gt;</span></td></tr>
        <tr><td>Milestone 2**</td><td>[N+1]–[N]</td><td><span class="var">&lt;amount&gt;</span></td></tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="text-align:right;font-weight:700;">Total:</td>
          <td><span class="var">&lt;total&gt;</span></td>
        </tr>
      </tfoot>
    </table>
    <p class="pay-note">*Milestone 1 Payment: due upon [condition].</p>
    <p class="pay-note">**Milestone 2 Payment: due upon [condition].</p>
  </div>
  [footer]
</div>
```

### Page 5 — Terms and Conditions
```html
<div class="page">
  <div class="page-body">
    <h1>Terms and Conditions</h1>
    <h2>Intellectual Property Rights (IPR)</h2>
    <p>[IPR paragraph with <span class="var">&lt;client's name&gt;</span> variables]</p>
    <h2>Timing of Intellectual Property Transfer</h2>
    <p>[Transfer timing paragraph]</p>
    <h2>Third-Party Intellectual Property</h2>
    <p>[Third-party guarantee paragraph]</p>
    <h2 class="mono">GDPR Compliance</h2>
    <p>[GDPR paragraph — adapt to deliverable type]</p>
    <h2 class="mono">Governing Law</h2>
    <p>This agreement will be governed by and construed in accordance with the laws of <span class="var">&lt;country&gt;</span>.</p>
  </div>
  [footer]
</div>
```

### Page 6 — Final Summary
```html
<div class="page">
  <div class="page-body">
    <h1>Final Summary</h1>
    <div class="letter-body" style="margin-top:28px;">
      <p>Dear <span class="var">&lt;client's name&gt;</span>,</p>
      <!-- solo voice shown; use "we" / "our team" for a team or BD proposal -->
      <p>Thank you for your inquiry and the interest you have shown. I've reviewed the project brief and can confirm that I'll be able to deliver the work within the specified time frame and budget. Please don't hesitate to contact me if you have any further questions.</p>
      <p>Thank you!</p>
    </div>
    <div class="letter-sig">
      <strong>[Presenter name or team]</strong><br>
      [Phone — optional; delete this line if none was given]
    </div>
    <div class="letter-rule"></div>
    <p class="sig-prompt">Please sign below to approve this proposal and [sign-off action — default "begin the project"].</p>
    <div class="sig-boxes">
      <div class="sig-box">Date</div>
      <div class="sig-box">Signature</div>
    </div>
    <div class="summary-logo">
      [INLINE SVG — logo_cochl_top.svg, width="85" height="18", id=paint0_summary, stops on --logo-g1..3]
    </div>
  </div>
  [footer]
</div>
```

---

## QA Checklist

- [ ] Exactly 6 `.page` divs, each with `.page-body` + `.footer`
- [ ] Cover uses `.cover` class; has `.cover-center` with date + H1 + H1.sub
- [ ] SVG logo embedded inline on Cover (id=paint0_cover) and Final Summary (id=paint0_summary)
- [ ] Scope list uses `ul.scope`; phase names in `<strong>`; descriptions end with semicolons
- [ ] Timeline has `.timeline` wrapper with `.tl-node` per phase; final node is the end point (no duration); all ticks sit on one line
- [ ] Payment table uses `.pay-table` with `<thead>`, `<tbody>`, `<tfoot>` structure
- [ ] Payment terms come from the user (30% deposit only for a solo design engagement); unknown amounts are `[NEEDS INPUT]`; footnotes use `.pay-note`
- [ ] Terms: first 3 H2 use default style; GDPR + Governing Law use `h2.mono`
- [ ] All unfilled variables use `<span class="var">&lt;name&gt;</span>`; unconfirmed facts/figures use `.needs-input` `[NEEDS INPUT]` — never the other way round
- [ ] Final Summary has `.letter-body`, `.letter-sig`, `.letter-rule`, `.sig-boxes`, `.summary-logo`
- [ ] Footer identical on all 6 pages; company facts match `brand-core.md` §3b (contact@cochl.ai, San Francisco, CA, USA); role line is the user's or omitted
- [ ] One voice (I / we) throughout; no `(xxx) xxx-xxxx` or other leftover sample text
- [ ] Logo gradient stops use `var(--logo-g1..3)` — no hex in the SVG
- [ ] Korean content: `lang="ko"` set and Hangul renders in the PDF (see Typography)
- [ ] Google Fonts `<link>` from themes/plex.md is present in `<head>`
- [ ] `@page { size: A4; margin: 0 }` and `@media print` rules present; `.page` is a fixed 297mm with `break-after: page`; Cmd+P → exactly 6 pages. No section may overflow its page — print clips the overflow (footer included), so tighten the copy rather than letting it run on
- [ ] File is self-contained — no external asset refs except Google Fonts CDN
