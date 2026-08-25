---
name: proposal-doc-template
description: >
  Generates Cochl.ai design proposal documents strictly following the structure,
  layout grammar, and writing style extracted from the official Cochl proposal PDFs
  (01–06.pdf, examples/source-pdfs/).
triggers:
  - /proposal-doc-template
  - /proposal-doc
---

# Proposal Document Template Skill

## Source of Truth

This skill is derived from 6 official Cochl.ai proposal PDFs. Every structural rule,
layout pattern, and writing convention below was extracted directly from those documents.
**Do not invent sections or patterns not present in the source.**

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
[Name]                          Cochl.ai
[Role: Product Design]          San Francisco (HQ)
                                1 Brady St. #A-120, San Francisco, CA 94103, USA
                                hello@cochl.ai
```
- Thin horizontal rule above footer
- Left column: presenter name + role
- Right column: company + location + address + email

### Logo placement
- **Cover only**: top-left corner (cochl. logotype with dot)
- **Final Summary only**: centered, above footer

---

## Typography System

Extracted from the PDFs:

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title (H1) | ~48–56px | Extra Bold / Black | One per page, top of content |
| Section heading (H2) | ~22–24px | Bold | Subsections within a page |
| Body text | ~14–16px | Regular | Paragraphs, descriptions |
| Footer text | ~10–11px | Regular | Two-column footer |
| Monospace sections | ~14px | Regular | Used in legal/terms sections (GDPR, Governing Law) |

**Mixed typography rule (Terms page only):** Some H2 headings use default sans-serif weight; the GDPR Compliance and Governing Law subsections render their headings in a monospace/code font — this signals technical/legal content requiring exact language.

### Variable/placeholder style
All fill-in variables use `<angle-bracket>` notation and render in **blue hyperlink color**:
- `<client's name>`
- `<designer's name>`
- `<country>`
- `<project name>`

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
- Written in first person: "I will work on...", "I will update regularly..."
- Uses semicolons to end bullet descriptions (not periods) — consistent with source

**Timeline format:**
```
Estimated completion time of [X–Y weeks/months].

[Date]    [Date]    [Date]    [Date]
  │          │         │         │
[Phase]   [Phase]  [Phase]  [Handover]
[duration] [duration] [duration]
```

- Dates above the flow (e.g. "13.Feb", "16.Feb")
- Phase boxes below with name + duration
- Final node always: "Handover"
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

**Intro paragraph pattern:**
> "The project will follow a milestone-based payment schedule. To initiate the project, a [X]% non-refundable deposit of the total project cost is required."

**Table rules:**
- 3 columns: Item | Week | Total, USD
- Header row: bold
- Currency: right-aligned
- Horizontal lines: top and bottom of table only; single line above Total row
- Total row: bold label, bold amount, right-aligned
- Footnotes below table using * ** notation

**Standard structure:**
- Initial Deposit = 30% (non-refundable)
- Milestone 1 = due upon final design delivery
- Milestone 2 = due upon completion of development and before final file delivery

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

Please sign below to approve this proposal and begin the project.

┌─────────────────────────┐  ┌─────────────────────────┐
│ Date                    │  │ Signature               │
└─────────────────────────┘  └─────────────────────────┘

[cochl. logo — centered]

[footer]
```

**Letter body pattern:**
> "Thank you for your inquiry and the interest you have shown. I've reviewed the project brief and can confirm that I'll be able to deliver the work within the specified time frame and budget. Please don't hesitate to contact me if you have any further questions."

**Signature block:**
- Horizontal rule separates letter from signature block
- "Please sign below to approve this proposal and begin the project." — exact phrase
- Two boxes side by side: Date | Signature
- Logo appears between signature block and footer (Final Summary page only)

---

## Writing Style Guide

### Voice
- First person singular: "I will", "I'll", "I've"
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

When generating a real proposal, substitute all variables before output.
When generating a template, render variables in **blue** or a distinct color.

---

## Construction Process

When invoked, follow this sequence:

1. **Read source** — parse `.md` input file or user-provided arguments (project, client, presenter, date, scope, budget)
2. **Calculate payments** — 30% deposit, remainder split across milestones
3. **Derive timeline** — build phase dates/durations from scope items
4. **Generate HTML** — produce a single self-contained `.html` file using the HTML Design System below
5. **Embed SVG logo** inline from `assets/logo_cochl_top.svg`
6. **Mark unfilled variables** as `<span class="var">&lt;variable&gt;</span>` (renders blue)
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
html { background: #e8e8e8; }
body {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #1a1a1a;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

/* ─── Page ───────────────────────────────────────────── */
.page {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  margin: 32px auto;
  padding: 52px 56px 36px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 24px rgba(0,0,0,0.10);
}
.page-body { flex: 1; }

/* ─── Typography ─────────────────────────────────────── */
h1 { font-size: 52px; font-weight: 900; letter-spacing: -0.025em; line-height: 1.05; color: #111; }
h1.sub { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; margin-top: 10px; }
h2 { font-size: 21px; font-weight: 700; letter-spacing: -0.01em; margin-top: 36px; margin-bottom: 12px; color: #111; }
h2.mono { font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 500; margin-top: 32px; }
p { margin-bottom: 10px; }

/* ─── Variable placeholders ──────────────────────────── */
.var { color: #1155cc; }

/* ─── Cover ──────────────────────────────────────────── */
.cover { justify-content: space-between; }
.cover-logo { display: block; }
.cover-center {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 60px 0 80px;
}
.cover-date { font-size: 14px; font-weight: 400; color: #555; margin-bottom: 24px; }

/* ─── Footer ─────────────────────────────────────────── */
.footer {
  margin-top: 48px; padding-top: 10px;
  border-top: 1px solid #d0d0d0;
  display: flex; justify-content: space-between; align-items: flex-start;
  font-size: 10.5px; color: #444; line-height: 1.55;
}
.footer-left strong { font-weight: 600; color: #111; display: block; }
.footer-right { text-align: right; }

/* ─── Bullet lists ───────────────────────────────────── */
ul { list-style: none; padding-left: 0; margin: 4px 0; }
ul li { position: relative; padding-left: 20px; margin-bottom: 8px; }
ul li::before { content: '·'; position: absolute; left: 6px; color: #555; font-size: 16px; line-height: 1.5; }
ul.scope > li { margin-bottom: 18px; padding-left: 0; }
ul.scope > li::before { display: none; }
ul.scope > li > strong { display: block; font-weight: 600; margin-bottom: 2px; color: #111; }
ul.scope > li > strong::before { content: '· '; color: #555; }
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
  height: 1px; background: #ccc;
}
.tl-node { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.tl-node:last-child { flex: 0 0 80px; }
.tl-date { font-size: 11px; color: #555; margin-bottom: 10px; }
.tl-tick { width: 1px; height: 12px; background: #888; margin-bottom: 8px; }
.tl-name { font-size: 13px; font-weight: 600; color: #111; line-height: 1.3; }
.tl-dur { font-size: 11px; color: #777; margin-top: 3px; }

/* ─── Payment table ──────────────────────────────────── */
.pay-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 12px; font-size: 14px; }
.pay-table thead tr th { font-weight: 700; padding: 10px 8px; text-align: left; border-top: 1.5px solid #111; border-bottom: 1px solid #ccc; }
.pay-table thead tr th:last-child { text-align: right; }
.pay-table tbody tr td { padding: 10px 8px; }
.pay-table tbody tr td:last-child { text-align: right; }
.pay-table tfoot tr td { padding: 10px 8px; font-weight: 700; border-top: 1px solid #ccc; border-bottom: 1.5px solid #111; }
.pay-table tfoot tr td:last-child { text-align: right; font-weight: 900; font-size: 15px; }
.pay-note { font-size: 12.5px; color: #444; margin-top: 8px; line-height: 1.5; }

/* ─── Signature ──────────────────────────────────────── */
.sig-prompt { font-size: 14px; margin-bottom: 20px; }
.sig-boxes { display: flex; gap: 20px; }
.sig-box { flex: 1; border: 1.5px solid #aaa; padding: 16px 16px 40px; font-size: 13px; color: #555; font-weight: 500; }

/* ─── Final summary logo ─────────────────────────────── */
.summary-logo { display: flex; justify-content: center; margin-top: 48px; margin-bottom: 8px; }

/* ─── Letter ─────────────────────────────────────────── */
.letter-body p { margin-bottom: 16px; }
.letter-sig { margin-top: 24px; line-height: 1.8; }
.letter-rule { height: 1px; background: #d0d0d0; margin: 32px 0; }

/* ─── Print ──────────────────────────────────────────── */
@media print {
  html { background: white; }
  .page { margin: 0; box-shadow: none; page-break-after: always; width: 100%; }
  .page:last-child { page-break-after: auto; }
}
```

### Google Fonts link (required)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Logo

Source file: `assets/logo_cochl_top.svg`

Always embed inline (not via `<img src>`). Use unique `linearGradient` IDs per instance to avoid SVG defs conflicts.

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
      <strong>[Presenter Name]</strong>
      Product Design
    </div>
    <div class="footer-right">
      Cochl.ai · San Francisco (HQ) · 1 Brady St. #A-120, San Francisco, CA 94103, USA · hello@cochl.ai
    </div>
  </div>
</div>
```

### Page 1 — Cover
```html
<div class="page cover">
  <div class="cover-logo">
    [INLINE SVG — logo_cochl_top.svg, width="100" height="22", id=paint0_cover]
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
      <!-- repeat nodes; last node has no .tl-dur, name = "Handover" -->
      <div class="tl-node">
        <div class="tl-date">[DD.Mon]</div>
        <div class="tl-tick"></div>
        <div class="tl-name">Handover</div>
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
        <span style="font-size:13.5px;color:#444;">[process note ending with semicolon];</span>
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
    <p style="margin-top:28px;">The project will follow a milestone-based payment schedule. To initiate the project, a 30% non-refundable deposit of the total project cost is required.</p>
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
      <p>Thank you for your inquiry and the interest you have shown. I've reviewed the project brief and can confirm that I'll be able to deliver the work within the specified time frame and budget. Please don't hesitate to contact me if you have any further questions.</p>
      <p>Thank you!</p>
    </div>
    <div class="letter-sig">
      <strong>[Presenter Name]</strong><br>
      (xxx) xxx-xxxx
    </div>
    <div class="letter-rule"></div>
    <p class="sig-prompt">Please sign below to approve this proposal and begin the project.</p>
    <div class="sig-boxes">
      <div class="sig-box">Date</div>
      <div class="sig-box">Signature</div>
    </div>
    <div class="summary-logo">
      [INLINE SVG — logo_cochl_top.svg, width="85" height="18", id=paint0_summary]
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
- [ ] Timeline has `.timeline` wrapper with `.tl-node` per phase; final node labeled "Handover"
- [ ] Payment table uses `.pay-table` with `<thead>`, `<tbody>`, `<tfoot>` structure
- [ ] Initial deposit = 30%; footnotes use `.pay-note`
- [ ] Terms: first 3 H2 use default style; GDPR + Governing Law use `h2.mono`
- [ ] All unfilled variables use `<span class="var">&lt;name&gt;</span>`
- [ ] Final Summary has `.letter-body`, `.letter-sig`, `.letter-rule`, `.sig-boxes`, `.summary-logo`
- [ ] Footer identical on all 6 pages
- [ ] Google Fonts CDN link present in `<head>`
- [ ] `@media print` rules present (page-break-after: always per .page)
- [ ] File is self-contained — no external asset refs except Google Fonts CDN
