---
name: design-review
description: >
  Generates a self-contained interactive HTML design review presentation
  strictly following the two official Cochl PPTX templates:
  DESIGN REVIEW_Proposal.pptx and DESIGN REVIEW_Direction Alignment, and Feedback Meetings.pptx.
  Use when a team needs to run a Proposal Review or Direction Alignment & Feedback Meeting.
args:
  - name: type
    required: true
    description: "proposal | direction  — which template to follow"
  - name: project
    required: true
    description: "Project or feature name shown in the persistent header"
  - name: phase
    description: "Phase number (Direction template only, default: 01)"
  - name: round
    description: "Round number (Direction template only, default: 01)"
  - name: team
    description: "Company / team name"
  - name: presenters
    description: "Presenter name(s)"
  - name: date
    description: "Presentation date (default: today)"
  - name: screenshots
    description: "Comma-separated file paths to embed as phone mockups"
  - name: output
    description: "Output path (default: ~/Desktop/design-review-{project-slug}.html)"
---

# Design Review Template Skill

## Source of Truth

This skill faithfully implements the two official Cochl design review templates.
**Never deviate from these visual rules without explicit user instruction.**

### Template files
```
assets/DESIGN REVIEW_Proposal.pptx
assets/DESIGN REVIEW_Direction Alignment, and Feedback Meetings.pptx
```

These PPTX files define all slide archetypes, layout proportions, font choices,
color values, and structural rules. Everything below is derived from them.

---

## Visual System

### Canvas
- **Output size**: 1440 × 810 px (16:9)
- **PPTX source**: 960 × 540 px → scale factor **1.5×** applied to all measurements
- Slides are rendered full-viewport and scaled via `transform:scale()` on resize
- **Safe area — nothing may exceed the canvas.** `.dw` / `.slide` are `overflow:hidden`, so any element extending past **y = 810px** (or above the top under the 38px persistent header) is silently clipped — there is no scrollbar to reveal it. Every slide's content must fit within the vertical range 0–810px.
- **Phone mockups + bottom callouts must fit vertically.** A phone frame plus any bottom keyword/callout bar has to sit between the header and y = 810. Do **not** pin the mockup with a fixed `top` whose `top + frame height (+ callout bar height)` exceeds 810 — that clips the bottom of the frame and its callout. Instead vertically center the mockup in the available area, or bottom-anchor the callout (`bottom:0`) and size the frame to fit above it. Always confirm the mockup's bottom edge and callout are fully visible; if they clip, reduce the mockup's `top`/height rather than letting it overflow.

### Brand

**Brand:** read `../cochl-design/core/brand-core.md`, then `../cochl-design/core/themes/plex.md`. Default theme `plex`. Paste the theme's `:root` block into the output `<style>` before any template CSS, and its Google Fonts `<link>` into `<head>`. Run `../cochl-design/core/qa-checklist.md` before delivering.

Use only the tokens below; never write a literal color or font name.

| Role | Token |
|---|---|
| Cover / dividers / final mockup bg | `--bg-pure` |
| Content slide bg | `--light-bg` |
| Divider / goal / persona bg | `--light-gray` |
| Cards on gray slides | `--light-card` |
| Small label caps | `--accent` |
| Titles, dividers, direction titles | `--font-sans` |
| Tech headers (BEFORE/AFTER, MATRIX, FINDINGS) | `--font-mono` |
| Body, numbers, goal card body | `--font-body` |
| Persistent header, keyword bars | `--font-ui` |
| Full-bleed quotes | `--font-quote` |

Borders use `--light-border`; muted text uses `--muted-on-dark` / `--muted-on-light`.

### Typography Scale (at 1440px output)
| Role | Font | Size | Weight |
|------|------|------|--------|
| Cover main "DESIGN REVIEW" | `--font-sans` | 96px | 300 |
| Cover project name | `--font-sans` | 64px | 300 |
| Section divider title | `--font-sans` | 96px | 300 |
| Section header block title | `--font-sans` | 40px | 400 |
| Tech slide headers (Mono) | `--font-mono` | 40px | 400 |
| Direction title "DIRECTION 1" | `--font-sans` | 46px | 300 |
| Large numbers 01/02/03 | `--font-body` | 40px | 400 |
| Large body | `--font-body` | 20px | 400 |
| Standard body | `--font-body` | 16px | 300–400 |
| Small / captions | `--font-body` | 13px | 400 |
| Persistent header | `--font-ui` | 13px | 400 |
| Keyword bar | `--font-ui` | 13px | 400 |
| Cover metadata row | `--font-sans` | 21px | 300 |
| Full-bleed quote | `--font-quote` | 40px | 400 italic |

---

## Persistent Header (present on ALL content slides)

**NOT present on:** full-cover black slides (COVER–Main, section dividers without header)

```html
<div class="hdr">
  <span class="hdr-left">PROJECT / FEATURE NAME</span>
  <span class="hdr-right">TODAY'S DATE</span>
</div>
```

```css
.hdr {
  position: absolute; top: 0; left: 0; right: 0;
  padding: 10px 45px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  z-index: 100; height: 38px;
}
.hdr span {
  font-size: 13px; font-weight: 400;
  font-family: var(--font-ui);
  text-transform: uppercase; letter-spacing: 0.08em;
  color: rgba(0,0,0,0.4);
}
/* Dark variant */
.hdr.dark { border-bottom-color: rgba(255,255,255,0.1); }
.hdr.dark span { color: rgba(255,255,255,0.4); }
```

Content area starts at `top: 38px`.

---

## HTML Shell

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{Project Name} — Design Review · Cochl</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- paste the <link> tag from ../cochl-design/core/themes/plex.md here -->
<style>/* paste plex :root block here */</style>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;overflow:hidden;background:var(--ink);}
body{display:flex;align-items:center;justify-content:center;font-family:var(--font-body);}
.dw{width:1440px;height:810px;position:relative;transform-origin:center center;overflow:hidden;}
.slide{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .22s ease;}
.slide.active{opacity:1;pointer-events:all;}
/* nav dots */
.nd{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:9999;}
.nd button{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.2);cursor:pointer;transition:all .2s;border:none;outline:none;padding:0;}
.nd button.on{background:rgba(255,255,255,.88);transform:scale(1.45);}
/* counter */
.ct{position:fixed;bottom:14px;right:28px;font-size:10px;color:rgba(255,255,255,.22);z-index:9999;letter-spacing:.12em;font-family:var(--font-ui);}
/* arrow buttons */
.arr{position:fixed;top:50%;transform:translateY(-50%);z-index:9999;background:rgba(255,255,255,.07);border:none;cursor:pointer;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .2s;}
.arr:hover{background:rgba(255,255,255,.16);}
.arr svg{width:14px;height:14px;stroke:rgba(255,255,255,.55);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
#ap{left:16px;}#an{right:16px;}
</style>
</head>
<body>
<div class="dw" id="dw">
  <!-- SLIDES injected here -->
</div>
<div class="nd" id="nd"></div>
<div class="ct" id="ct">1 / N</div>
<button class="arr" id="ap"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
<button class="arr" id="an"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
<script>
const ss=document.querySelectorAll('.slide'),nd=document.getElementById('nd'),ct=document.getElementById('ct');
let c=0;
ss.forEach((_,i)=>{const b=document.createElement('button');b.className=i===0?'on':'';b.onclick=e=>{e.stopPropagation();go(i);};nd.appendChild(b);});
function go(n){ss[c].classList.remove('active');nd.children[c].classList.remove('on');c=Math.max(0,Math.min(n,ss.length-1));ss[c].classList.add('active');nd.children[c].classList.add('on');ct.textContent=(c+1)+' / '+ss.length;}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(c+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(c-1);}});
document.getElementById('ap').onclick=()=>go(c-1);
document.getElementById('an').onclick=()=>go(c+1);
ss[0].classList.add('active');
(function scale(){const s=Math.min(innerWidth/1440,innerHeight/810)*.96;document.querySelector('.dw').style.transform='scale('+s+')';}());
window.addEventListener('resize',()=>{const s=Math.min(innerWidth/1440,innerHeight/810)*.96;document.querySelector('.dw').style.transform='scale('+s+')';});
</script>
</body>
</html>
```

---

## Layout Philosophy

**Avoid dashboard-style card grids.** Presentations are not dashboards.

Prefer these layout patterns, in order:

| Pattern | Use when |
|---|---|
| Full-width narrative section | Explaining a single idea with text + visual |
| Two-column split | Contrasting two things (before/after, problem/solution) |
| Process / timeline flow | Showing sequence, stages, or phases |
| Comparison matrix / table | Evaluating multiple options against criteria |
| Annotated screenshot | Pointing out specific UI moments |
| Full-bleed quote or stat | Emotional reset, key insight, or wow moment |
| Cards (sparingly) | Only when options are discrete and parallel (e.g., Direction A vs B) |

**Never use** a 2×3 or 3×3 card grid just to organize bullet points. If content is a list, use a vertical narrative layout, a timeline, or a split column — not cards.

Cards are allowed on: Goal slides (3 measurable goals), Direction slides (2–3 named directions), Persona slides (2–3 personas). All other slides must use the patterns above.

---

## Slide Archetypes Catalog

### 1. COVER — Main
**Source**: PPTX1 (Proposal), slides 1–2 / PPTX2 (Direction Alignment), slide 1  
**Used for**: Opening slide of every design review

> The two templates use **different** cover layouts — do not merge them into one "black full bleed" cover. Pick the variant that matches the deck type.

**Direction Alignment variant (PPTX2, slide 1) — Full Bleed Black:**

- Background: `--bg-pure`, NO persistent header
- "DESIGN REVIEW" centered at y≈150px, 96px `--font-sans` 300, white
- Thin horizontal rules (1px, `rgba(255,255,255,0.15)`) at y≈550, 570, 610, 635
- Between rules: metadata rows in 21px `--font-sans` 300, white, centered
  - Row 1: `PHASE : XX  |  ROUND : XX`
  - Row 2: `DESIGN REVIEW  |  COMPANY / TEAM NAME  |  PERSON ONE, PERSON TWO  |  TODAY'S DATE`
- Logo top-center if available

```html
<div class="slide" style="background:var(--bg-pure);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;">
  <h1 style="font-size:96px;font-weight:300;font-family:var(--font-sans);color:var(--text);letter-spacing:0.04em;text-transform:uppercase;margin-top:140px;">DESIGN REVIEW</h1>
  <div style="position:absolute;bottom:0;left:0;right:0;">
    <div style="height:1px;background:rgba(255,255,255,0.15);margin-bottom:20px;"></div>
    <p style="text-align:center;font-size:21px;font-weight:300;font-family:var(--font-sans);color:var(--text);letter-spacing:0.06em;">PHASE : {phase} &nbsp;|&nbsp; ROUND : {round}</p>
    <div style="height:1px;background:rgba(255,255,255,0.15);margin:20px 0;"></div>
    <p style="text-align:center;font-size:21px;font-weight:300;font-family:var(--font-sans);color:var(--text);letter-spacing:0.04em;">{team} &nbsp;|&nbsp; {presenters} &nbsp;|&nbsp; {date}</p>
    <div style="height:1px;background:rgba(255,255,255,0.15);margin-top:20px;margin-bottom:30px;"></div>
  </div>
</div>
```

**Proposal variant (PPTX1, slides 1–2) — Light Product Card:**

- Background: `--light-bg`, NO persistent header (this cover is light, not black)
- Title block, left-aligned at x≈98 / y≈250: two lines, 50px `--font-sans` bold, black
  - Line 1 = review label (placeholder "Product review"), Line 2 = product name
- Description under the title: 16px `--font-body` 300, black (placeholder "Add description")
- Metadata strip along y≈535 — 5 equal cells (133px wide, ~160px step), each:
  - Label chip: bg `--accent` (Cochl indigo), 10px `--font-ui` uppercase, white text — `REVIEW STATUS` · `PRODUCT STAGE` · `TEST COVERAGE` · `KEY METRIC` · `NEXT ACTION`
  - Value below chip: 10px `--font-ui` bold, black (e.g. `In Progress` · `Beta Release` · `12 User Sessions` · `92% Satisfaction` · `Iteration v2 Planned`)

```html
<div class="slide" style="background:var(--light-bg);position:relative;">
  <div style="position:absolute;left:98px;top:250px;">
    <h1 style="font-size:50px;font-weight:700;font-family:var(--font-sans);color:var(--bg-pure);line-height:1.05;margin:0;">{review label}<br>{product name}</h1>
    <p style="font-size:16px;font-weight:300;font-family:var(--font-body);color:var(--bg-pure);margin-top:16px;">{description}</p>
  </div>
  <div style="position:absolute;left:98px;top:533px;display:flex;gap:27px;">
    <!-- repeat for each of the 5 metadata cells -->
    <div style="width:133px;">
      <div style="background:var(--accent);color:var(--text);font-size:10px;font-family:var(--font-ui);text-transform:uppercase;letter-spacing:0.06em;padding:6px 8px;">{LABEL}</div>
      <p style="font-size:10px;font-weight:700;font-family:var(--font-ui);color:var(--bg-pure);margin-top:6px;">{value}</p>
    </div>
  </div>
</div>
```

---

### 2. COVER — Project (Split Panel)
**Source**: PPTX2, slides 5–8  
**Used for**: Second cover showing project name + phone mockup

- Background: `--bg-pure`, NO persistent header
- Left 50%: project branding (label, name, round)
- Right 50%: phone mockup(s) centered
- Bottom strip: 3 metadata items (`--font-ui` 13px, `rgba(255,255,255,0.3)`)

```html
<div class="slide" style="background:var(--bg-pure);display:flex;">
  <div style="width:50%;padding:80px 60px;display:flex;flex-direction:column;justify-content:center;">
    <p style="font-size:16px;font-family:var(--font-sans);color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;">Cochl · {product line}</p>
    <h2 style="font-size:64px;font-weight:300;font-family:var(--font-sans);color:var(--text);text-transform:uppercase;line-height:1.0;margin-top:28px;">{PROJECT NAME}</h2>
    <p style="font-size:18px;font-weight:300;font-family:var(--font-sans);color:rgba(255,255,255,0.35);text-transform:uppercase;margin-top:28px;">ROUND {round}</p>
  </div>
  <div style="width:50%;display:flex;align-items:center;justify-content:center;">
    <!-- phone() helper output here -->
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;border-top:1px solid rgba(255,255,255,0.08);padding:14px 60px;display:flex;justify-content:space-between;">
    <span style="font-size:13px;font-family:var(--font-ui);color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;">PHASE : {phase}</span>
    <span style="font-size:13px;font-family:var(--font-ui);color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;">{team}</span>
    <span style="font-size:13px;font-family:var(--font-ui);color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;">{date}</span>
  </div>
</div>
```

---

### 3. AGENDA
**Source**: PPTX1 (Proposal), slides 3–4 / PPTX2 (Direction Alignment), slides 3–4  
**Used for**: Listing review sections with numbered items

**Direction Alignment variant (PPTX2, slides 3–4):**

- Dark variant preferred (black bg, white text)
- Left ~60%: "AGENDA" at 40px `--font-sans` 400, y≈370px from top
- Right ~40%: numbered section list
  - Section row height: ~60px, gray highlight band behind each section number
  - Section number: 26px `--font-body` bold
  - Section title: 24px `--font-body` 400
  - Sub-items: 18px `--font-body` 400, muted

**Proposal variant (PPTX1, slides 3–4) — Two-Column Statement:**

- Background: `--light-bg`, no numbered/banded rows
- Left ~45% (x≈93 / y≈140): "Today's Agenda:" — 79px `--font-sans` bold, black, two lines
- Right ~40% (x≈647): plain section list, 37px `--font-sans` 400, black, generously spaced
  - Items: `Project Overview` · `Discovery` · `Strategy & Process` · `Key Deliverables` · `Next Steps`
  - No section numbers, no highlight bands, no sub-items

---

### 4. SECTION DIVIDER
**Source**: Both PPTX  
**Used for**: OVERVIEW, DISCOVERY, STRATEGY & PROCESS, KEY DELIVERABLES, NEXT STEPS

- Light variant bg: `--light-gray`; Dark variant bg: `--bg-pure`
- Persistent header present
- Section title centered vertically: 96px `--font-sans` 300, uppercase
  - Light: black text; Dark: white text

```html
<!-- Light variant -->
<div class="slide" style="background:var(--light-gray);">
  {hdr}
  <div style="height:100%;display:flex;align-items:center;justify-content:center;padding-top:38px;">
    <h2 style="font-size:96px;font-weight:300;font-family:var(--font-sans);color:var(--bg-pure);text-transform:uppercase;letter-spacing:0.02em;">{SECTION TITLE}</h2>
  </div>
</div>
```

---

### 5. THREE THINGS TO KNOW / PRINCIPLES
**Source**: PPTX1 (Proposal — "Principles"), slides 7–8 / PPTX2 (Direction Alignment — "Three Things To Know"), slides 11–13  
**Used for**: Overview section framing (3 key principles/problems/constraints/insights)

**Direction Alignment variant (PPTX2, slides 11–13) — 3-Column:**

- Light or dark variant
- Persistent header
- "THREE THINGS TO KNOW" — 40px `--font-sans` 400, centered, below header
- 1px horizontal rule below title
- 3 equal columns: number (40px `--font-body`) + description (20px `--font-body` 400, lh 1.6)

```html
<div class="slide" style="background:var(--light-bg);">
  {hdr}
  <div style="padding-top:38px;">
    <div style="text-align:center;padding:48px 80px 0;">
      <h2 style="font-size:40px;font-weight:400;font-family:var(--font-sans);text-transform:uppercase;color:var(--bg-pure);">THREE THINGS TO KNOW</h2>
      <div style="height:1px;background:rgba(0,0,0,0.12);margin-top:18px;"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;padding:0 80px;margin-top:48px;">
      <!-- repeat for 01, 02, 03 -->
      <div style="padding:0 48px;border-right:1px solid rgba(0,0,0,0.08);">
        <p style="font-size:40px;font-weight:400;font-family:var(--font-body);color:var(--bg-pure);margin-bottom:20px;">01</p>
        <p style="font-size:20px;font-weight:400;font-family:var(--font-body);color:var(--bg-pure);line-height:1.6;">{description}</p>
      </div>
    </div>
  </div>
</div>
```

**Proposal variant (PPTX1, slides 7–8) — Left Title + Stacked List:**

- Background: `--light-bg`, no persistent header, NOT a 3-column grid
- Left (x≈91, vertically centered): section title "Principles" — 50px `--font-sans` bold, black
- Right (x≈634): 3 stacked insight rows (top-aligned), each:
  - Small bullet: 13×13px black round dot (`border-radius:50%`), left of the label — house standard marker (not a square or bordered box)
  - Label: `Insight 1` / `Insight 2` / `Insight 3` — 21px `--font-sans` bold, black
  - Body: 12px `--font-body` 400, black, lh ~1.5, kept short
- Same layout is reused for the Proposal "Project Goals" slide (see §6)

---

### 6. PROJECT GOALS
**Source**: PPTX1 (Proposal), slides 9–10 / PPTX2 (Direction Alignment), slide 14  
**Used for**: 3 measurable project goals with metrics

**Direction Alignment variant (PPTX2, slide 14) — Cards:**

- Background: `--light-gray`
- Persistent header
- "PROJECT GOALS" — 40px `--font-sans` 400 + 1px divider
- 3 equal cards, bg `--light-card`, border-radius 4px, padding 40px 36px
  - Goal label: "GOAL 1/2/3" — 40px `--font-sans` bold
  - Description: 20px `--font-body` 400, lh 1.45
  - Metric: 13px `--font-ui` uppercase, border-top 1px

**Proposal variant (PPTX1, slides 9–10) — Left Title + Stacked List:**

- Background: `--light-bg`, no persistent header, no cards (shares the Proposal "Principles" layout, §5)
- Left (x≈91, vertically centered): section title "Project goals" — 50px `--font-sans` bold, black
- Right (x≈634): 3 stacked goal rows, each:
  - Small bullet: 13×13px black round dot (`border-radius:50%`), left of the label — house standard marker (not a square or bordered box)
  - Label: `Goal 1` / `Goal 2` / `Goal 3` — 21px `--font-sans` bold, black
  - Body: 12px `--font-body` 400, black, lh ~1.5 (no metric row / border-top in this variant)

---

### 7. MARKET RESEARCH (Competitive Landscape)
**Source**: PPTX1 slides 13–14, PPTX2 slides 17–18  
**Used for**: Showing top 5 competitors

- Persistent header
- "MARKET RESEARCH" section header (40px `--font-sans`) + 1px divider
- 5 company logo placeholders in a row (rectangles with name labels)

---

### 8. USER INSIGHTS (Quotes)
**Source**: PPTX2, slides 19–20  
**Used for**: 3 verbatim user research quotes

- Background: `--light-gray` (light) or `--bg-pure` (dark)
- Persistent header
- "USER INSIGHTS" section header (40px `--font-sans`) + 1px divider
- 3-column quote layout:
  - Quote: 20px `--font-body` 400, italic, lh 1.6, curly quotes
  - Attribution: 13px `--font-ui` uppercase, muted, margin-top 8px

---

### 9. USER PERSONAS
**Source**: PPTX2, slides 21–22  
**Used for**: 2–3 user persona descriptions

- Background: `--light-gray`
- Persistent header + "USER PERSONAS" section header + 1px divider
- 3 equal columns (use 2 columns if only 2 personas):
  - Avatar: 80×80px circle, bg `--avatar-fill`
  - Name: 18px `--font-body` 400 uppercase
  - Role: 13px `--font-ui` uppercase, muted
  - Description: 14px `--font-body` 300, lh 1.65

---

### 10. FULL-BLEED QUOTE
**Source**: PPTX2, slide 23  
**Used for**: Emotional anchor between Discovery and Strategy

- White bg, NO section title block
- Persistent header (date only)
- Centered quote: 40px `--font-quote` italic, lh 1.55, max-width 900px, centered
- Attribution: 13px `--font-ui` uppercase, muted

---

### 11. DESIGN PROCESS (Timeline)
**Source**: PPTX1 slides 21–22, PPTX2 slides 26–27  
**Used for**: Showing the 4-stage design process + current position

- White bg
- Persistent header + "DESIGN PROCESS" section header (40px `--font-sans`) + 1px divider
- Horizontal timeline spanning full width:
  - 2px horizontal line in black (`--bg-pure`)
  - 4 stage dots at x = 12.5%, 37.5%, 62.5%, 87.5%
  - Stages alternate above/below (1,3 above; 2,4 below)
  - Each: 10px circle dot + stage name (13px `--font-ui` uppercase) + date label (20px `--font-body` 300) + description (13px `--font-body`, muted)
- Stages: PROBLEM ALIGNMENT → EXPLORATION → SOLUTION ALIGNMENT → HANDOFF

**Timeline colors — brand tokens only:**
- Base line and past-stage dots: black `--bg-pure`
- Current-position dot / active highlight: `--accent` (Cochl indigo)
- Muted labels: `rgba(0,0,0,0.4)`–`rgba(0,0,0,0.55)`

> ⚠️ **Never** color the timeline line or dots with off-brand saturated dark blues — they render nearly black on screen and break the brand palette. The source PPTX Design Process slides (Proposal 21–22, Direction 26–27) contain those values; when porting them, **override** every timeline blue to `--accent` or `--bg-pure`. This rule applies to every generated deck.

---

### 12. FEEDBACK NEEDED — Categories
**Source**: PPTX2, slide 28  
**Used for**: Showing which design phase the review is in

- Background: `--light-gray`
- Persistent header + "FEEDBACK NEEDED" section header + 1px divider
- 4 category boxes in a row: CRAFT | STRUCTURE | EXPLORE | IMPLEMENT
  - Each: 13px `--font-ui` uppercase, centered, border 1px solid rgba(0,0,0,0.1)
  - Active category highlighted with black text and bold border

---

### 13. FEEDBACK NEEDED — Questions
**Source**: PPTX2, slide 29  
**Used for**: 3 specific questions framing the review discussion — THE MOST IMPORTANT SLIDE

- White bg
- Persistent header, NO section title block
- Split layout: left 42% | right 58%
  - Left: "FEEDBACK\nNEEDED" — 64px `--font-sans` 300, uppercase, vertically centered
  - Vertical rule: 1px `rgba(0,0,0,0.1)` between halves
  - Right: 3 bullet questions, 21px `--font-body` 300, lh 1.55
    - Bullet: 6×6px black circle, flex-shrink 0, margin-top 6px
    - Question text: left-aligned

```html
<div class="slide" style="background:var(--light-bg);">
  {hdr}
  <div style="padding-top:38px;height:calc(100% - 38px);display:flex;">
    <div style="width:42%;display:flex;align-items:center;justify-content:center;padding:60px;">
      <h2 style="font-size:64px;font-weight:300;font-family:var(--font-sans);text-transform:uppercase;line-height:1.1;color:var(--bg-pure);">FEEDBACK<br>NEEDED</h2>
    </div>
    <div style="width:1px;background:rgba(0,0,0,0.1);align-self:stretch;margin:40px 0;"></div>
    <div style="width:58%;padding:60px 70px;display:flex;flex-direction:column;justify-content:center;gap:32px;">
      <!-- repeat for each question -->
      <div style="display:flex;gap:18px;align-items:flex-start;">
        <div style="width:6px;height:6px;border-radius:50%;background:var(--bg-pure);flex-shrink:0;margin-top:9px;"></div>
        <p style="font-size:21px;font-weight:300;font-family:var(--font-body);color:var(--bg-pure);line-height:1.55;">{question}</p>
      </div>
    </div>
  </div>
</div>
```

---

### 14. PROPOSED CONCEPT
**Source**: PPTX2, slides 30–31  
**Used for**: Side-by-side current vs. proposed solution comparison

- White bg
- Persistent header + "PROPOSED CONCEPT" section header (40px `--font-sans`) + 1px divider
- Two halves separated by 1px vertical divider:
  - Labels: "1" / "2" or "TODAY" / "TOMORROW" — 21px `--font-body` 500 uppercase, centered
  - Sublabel: 13px `--font-body` 300 muted, text-align center
  - Phone mockup (220×420) centered below label

---

### 15. DIRECTION DIVIDER
**Source**: PPTX2, slides 32–43  
**Used for**: Chapter break before each design direction

- White bg (or black variant)
- Persistent header
- "DIRECTION" — 40px `--font-sans` 400, uppercase
- "01" / "02" / "03" — 40px `--font-sans` 400, alongside or same line

---

### 16. DIRECTION CONTENT
**Source**: PPTX2 (Direction Alignment), slides 34–43 — Direction-Alignment-only  
**Used for**: Showing a design direction with screenshot and rationale

> This layout is **specific to the Direction Alignment deck**. The Proposal deck presents its design directions with different archetypes — see §24 DESIGN DIRECTIONS COMPARISON (Proposal style) and §25 DIRECTION POLL (Proposal). Do not apply this keyword-bar layout to a Proposal deck.

- White bg
- Persistent header, NO section title block
- Left 42%:
  - Direction title: "DIRECTION 1" — 46px `--font-sans` 300, uppercase, margin-bottom 28px
  - Direction name: 15px `--font-sans` 500
  - Description: 16px `--font-body` 300, lh 1.72, `rgba(0,0,0,0.55)`
- Right 58%: phone mockup(s) — single (276×556) or two side-by-side (216×436 each)
- Bottom keyword bar (absolute, bottom:0):
  - `border-top:1px solid rgba(0,0,0,0.1)`
  - 13px `--font-ui` uppercase, text-align center
  - Format: `Keywords: Word 01, Word 02, Word 03`

```html
<div class="slide" style="background:var(--light-bg);">
  {hdr}
  <div style="padding-top:38px;height:calc(100% - 38px);display:flex;">
    <div style="width:42%;padding:60px 60px 80px;display:flex;flex-direction:column;justify-content:center;">
      <h2 style="font-size:46px;font-weight:300;font-family:var(--font-sans);text-transform:uppercase;color:var(--bg-pure);margin-bottom:28px;">DIRECTION {n}</h2>
      <p style="font-size:15px;font-weight:500;font-family:var(--font-sans);color:var(--bg-pure);margin-bottom:14px;">{direction name}</p>
      <p style="font-size:16px;font-weight:300;font-family:var(--font-body);color:rgba(0,0,0,0.55);line-height:1.72;">{description}</p>
    </div>
    <div style="width:58%;display:flex;align-items:center;justify-content:center;gap:24px;">
      <!-- phone() output -->
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;border-top:1px solid rgba(0,0,0,0.1);padding:10px 60px;text-align:center;">
    <span style="font-size:13px;font-family:var(--font-ui);text-transform:uppercase;letter-spacing:0.08em;color:rgba(0,0,0,0.4);">Keywords: {word1}, {word2}, {word3}</span>
  </div>
</div>
```

---

### 17. BEFORE/AFTER WORKFLOW
**Source**: PPTX2, slides 44–45  
**Used for**: 3-step workflow comparison across BEFORE / NOW / AFTER

- White bg
- Persistent header + "BEFORE/AFTER WORKFLOW" — 40px **`--font-mono`** 400 + 1px divider
- Column headers: BEFORE | NOW | AFTER — 13px `--font-ui` uppercase
- 3 rows × 3 columns grid
  - Step number: 40px `--font-body`, `rgba(0,0,0,0.2)`, margin-right 16px
  - Step text: 16px `--font-body` 300, 2 lines

---

### 18. STRATEGIC DIRECTIONS / DECISION MATRIX
**Source**: PPTX2, slides 47–49  
**Used for**: Structured trade-off analysis between options

- White bg
- Persistent header + "STRATEGIC DIRECTIONS" or "DECISION MATRIX" — 40px `--font-mono` + 1px divider

**Strategic Directions layout:**
- Question row at top
- Two columns: Option A | Option B
- Rows: Decision, Responsibility, FYI, Pros, Cons, Painkiller

**Decision Matrix layout:**
- 4-quadrant grid: CONSEQUENTIAL/INCONSEQUENTIAL × REVERSIBLE/IRREVERSIBLE
- Place options (A/B/C/D) in appropriate quadrant

---

### 19. BENEFIT COMPARISON TABLE
**Source**: PPTX2, slide 50  
**Used for**: Comparing 4–5 options across benefits

- White bg
- Persistent header + "BENEFIT COMPARISON TABLE" — 40px `--font-mono` + 1px divider
- Table: Benefit rows × Option columns (A/B/C/D/E)
- Cells: checkmark (✓) or dash (—)

---

### 20. FINDINGS & RECOMMENDATIONS
**Source**: PPTX2, slide 51  
**Used for**: Synthesizing review outcomes into a decision record

- White bg
- Persistent header + "FINDINGS & RECOMMENDATIONS" — 40px `--font-mono` + 1px divider
- 2-column split: Findings | Recommendations
  - Column header: 13px `--font-ui` uppercase
  - Items: numbered 01/02/03, 40px `--font-body` number (muted) + 16px `--font-body` 300 text

---

### 21. FINAL MOCKUP
**Source**: PPTX2, slide 52  
**Used for**: Showing the committed direction as a full-bleed visual

- Background: `--bg-pure`, NO persistent header (or white persistent header on dark)
- "FINAL MOCKUP" — 40px `--font-mono` 400, white, top-left (with padding)
- Description: 20px `--font-body` 300, white, below title
- Large mockup image fills most of slide

---

### 22. VALUE / EFFORT MATRIX
**Source**: PPTX1, slides 15–16  
**Used for**: Positioning a feature by value and implementation cost

- White bg
- Persistent header + section header
- 2×2 grid with axis labels: HIGH VALUE / LOW VALUE (y) × HIGH EFFORT / LOW EFFORT (x)
- Feature dot placed in appropriate quadrant

---

### 23. KEY METRICS
**Source**: PPTX1, slides 19–20  
**Used for**: 4 KPIs that define project success

- White bg
- Persistent header + section header
- 4-cell grid: large metric value + metric label (13px `--font-ui`)
  - **Large metric value: ~100–107px `--font-body` bold** (source PPTX is 53.44pt ≈ 107px at deck scale). The number must dominate its cell — do **not** shrink it to ~40–56px; all four cells use the same size for consistency across decks.

---

### 24. DESIGN DIRECTIONS COMPARISON (Proposal style)
**Source**: PPTX1, slides 29–36  
**Used for**: Showing 2 side-by-side directions in a Proposal context

- White bg
- Persistent header, NO section title block
- Left text panel: direction name + description
- Right visual panel: mockup + callout annotations
  - Callout: dotted line + 13px `--font-body` text label

---

### 25. DIRECTION POLL (Proposal)
**Source**: PPTX1, slides 47–48  
**Used for**: Collecting audience preference at end of Proposal review

- White bg
- Persistent header
- Question: "Which direction resonated with you the most?"
- Three labeled options: A. / B. / C. — large, clickable-looking

---

### 26. IMPROVEMENT / NEXT STEPS
**Source**: PPTX1, slides 43–44  
**Used for**: Action items after a Proposal review

- White bg
- Persistent header + "Improvement" section header
- 3 numbered items: 01/02/03 with title + description

---

### 27. CLOSING / THANK YOU
**Source**: PPTX1, slide 51–52; PPTX2, slide 54  
**Used for**: Final slide

- White bg (or black variant)
- "THANKS" or "Questions or new ideas?" — 96px `--font-sans` 300, centered
- Below: email, project link, phase/round metadata
- Font: `--font-sans`

---

## Python Helper Functions

```python
import base64

def encode_image(path: str) -> str:
    """Convert image file to base64 data URI."""
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode()
    ext = path.rsplit('.', 1)[-1].lower()
    mime = {'png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','gif':'image/gif','webp':'image/webp'}.get(ext, 'image/png')
    return f"data:{mime};base64,{data}"

def phone(src: str, w: int = 240, h: int = 480, pos: str = 'top') -> str:
    """Render a phone mockup frame with embedded screenshot."""
    r = min(w, h) // 8
    nw = max(40, int(w * 0.22))
    nh = max(8, int(h * 0.022))
    nt = max(8, int(h * 0.02))
    return (
        f'<div style="width:{w}px;height:{h}px;border-radius:{r}px;border:2.5px solid var(--ink-body);'
        f'position:relative;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.18);background:var(--light-bg);flex-shrink:0;">'
        f'<div style="position:absolute;top:{nt}px;left:50%;transform:translateX(-50%);'
        f'width:{nw}px;height:{nh}px;background:var(--ink);border-radius:{nh}px;z-index:10;"></div>'
        f'<img src="{src}" style="position:absolute;inset:0;width:100%;height:100%;'
        f'object-fit:cover;object-position:{pos};" alt="">'
        f'</div>'
    )

def hdr(project: str = "PROJECT / FEATURE NAME", date: str = "TODAY'S DATE", dark: bool = False) -> str:
    """Render the persistent top header bar."""
    fg = "rgba(255,255,255,0.4)" if dark else "rgba(0,0,0,0.4)"
    br = "rgba(255,255,255,0.1)" if dark else "rgba(0,0,0,0.1)"
    return (
        f'<div style="position:absolute;top:0;left:0;right:0;padding:10px 45px;display:flex;'
        f'justify-content:space-between;align-items:center;border-bottom:1px solid {br};z-index:100;">'
        f'<span style="font-size:13px;font-weight:400;font-family:var(--font-ui);'
        f'text-transform:uppercase;letter-spacing:0.08em;color:{fg};">{project}</span>'
        f'<span style="font-size:13px;font-weight:400;font-family:var(--font-ui);'
        f'text-transform:uppercase;letter-spacing:0.08em;color:{fg};">{date}</span>'
        f'</div>'
    )

def stitle(text: str, dark: bool = False) -> str:
    """Render a section title block (used at top of content slides)."""
    fg = "var(--text)" if dark else "var(--bg-pure)"
    br = "rgba(255,255,255,0.12)" if dark else "rgba(0,0,0,0.12)"
    return (
        f'<div style="text-align:center;padding:48px 80px 0;">'
        f'<h2 style="font-size:40px;font-weight:400;font-family:var(--font-sans);'
        f'text-transform:uppercase;letter-spacing:0em;color:{fg};">{text}</h2>'
        f'<div style="height:1px;background:{br};margin-top:18px;"></div>'
        f'</div>'
    )
```

---

## Template Flow Rules

> ⚠️ **Every item in the required slide order below is mandatory.** Never drop a required archetype or swap it for an off-spec slide — each numbered item must appear, in order. If a slide has no real content yet, keep the required archetype with placeholder content rather than substituting a different slide type.

> ⚠️ **"Next Steps" is a PROPOSAL-only slide — never add it to a Direction deck.** `SECTION DIVIDER — NEXT STEPS` (Proposal item 16) and the `IMPROVEMENT / NEXT STEPS` content slide (§26) exist **only** in the Proposal flow. The **Direction Alignment flow has no Next Steps slide of any kind.** Its required ending is fixed: `22 DECISION TOOL → 23 FINDINGS & RECOMMENDATIONS → 24 FINAL MOCKUP → 25 CLOSING / THANK YOU`. Never insert, append, or substitute a `NEXT STEPS` / `SECTION DIVIDER — NEXT STEPS` slide into a Direction deck, and never replace a Direction ending item with one. If content is missing, keep Direction items **16 (PROPOSED CONCEPT), 23 (FINDINGS & RECOMMENDATIONS), and 24 (FINAL MOCKUP)** as placeholders — do not drop or swap them.

### PROPOSAL REVIEW (type=proposal)
Required slide order:
```
1.  COVER — Main (Proposal light product card)
2.  AGENDA (Proposal two-column statement)
3.  SECTION DIVIDER — PROJECT OVERVIEW
4.  THREE THINGS TO KNOW / PRINCIPLES (Proposal left-title + stacked list)
5.  PROJECT GOALS (Proposal left-title + stacked list)
6.  SECTION DIVIDER — DISCOVERY
7.  MARKET RESEARCH (top 5 competitors)
8.  VALUE / EFFORT MATRIX
9.  SECTION DIVIDER — STRATEGY & PROCESS
10. KEY METRICS (4 numbers)
11. DESIGN PROCESS (timeline)
12. SECTION DIVIDER — KEY DELIVERABLES
13. DELIVERABLES list (2–3 items)
14. DESIGN DIRECTIONS COMPARISON (Proposal style) — Direction 1
15. DESIGN DIRECTIONS COMPARISON (Proposal style) — Direction 2
16. SECTION DIVIDER — NEXT STEPS
17. IMPROVEMENT / ACTION ITEMS
18. DIRECTION POLL (A / B / C)
19. PROJECT ROADMAP (Miro link)
20. CLOSING / THANK YOU
```

### DIRECTION ALIGNMENT & FEEDBACK REVIEW (type=direction)

> ⚠️ **No Next Steps in this flow.** This flow has **no** `SECTION DIVIDER — NEXT STEPS` and **no** `NEXT STEPS` content slide — those belong to the Proposal flow (item 16 / §26). The ending is fixed at **22 → 23 → 24 → 25**; keep items **16, 23, 24** even as placeholders and never substitute a Next Steps slide.

Required slide order:
```
1.  COVER — Main (black full bleed, Phase + Round)
2.  COVER — Project (split panel, optional)
3.  AGENDA (5 sections with sub-items)
4.  SECTION DIVIDER — OVERVIEW
5.  THREE THINGS TO KNOW (3-column)
6.  PROJECT GOALS (3 cards)
7.  SECTION DIVIDER — DISCOVERY
8.  MARKET RESEARCH
9.  USER INSIGHTS (3 quotes)
10. USER PERSONAS (2–3)
11. FULL-BLEED QUOTE (optional, between Discovery and Strategy)
12. SECTION DIVIDER — STRATEGY & PROCESS
13. DESIGN PROCESS (timeline)
14. FEEDBACK NEEDED — Categories
15. FEEDBACK NEEDED — Questions (3 specific questions)
16. PROPOSED CONCEPT (before/after)
17. SECTION DIVIDER — KEY DELIVERABLES (or DIRECTION 01 divider)
18. DIRECTION CONTENT — Direction 1
19. DIRECTION CONTENT — Direction 2
20. DIRECTION CONTENT — Direction 3 (optional)
21. BEFORE/AFTER WORKFLOW (optional)
22. DECISION TOOL (strategic directions OR decision matrix OR benefit comparison)
23. FINDINGS & RECOMMENDATIONS
24. FINAL MOCKUP
25. CLOSING / THANK YOU
```

---

## Screenshot Placement

When screenshots are provided:

| Slide | Screenshot | object-position |
|-------|-----------|-----------------|
| Cover Project (right panel) | First screenshot | top |
| Three Things (left phone, if split variant) | First or second | bottom |
| Proposed Concept — TODAY | First screenshot | top |
| Proposed Concept — TOMORROW | Second screenshot | bottom |
| Direction 1 (right panel) | First screenshot | top |
| Direction 2 (right panel) | Second screenshot | bottom |
| Direction 3 (right panel, 2 phones) | Both screenshots | top / bottom |
| Final Mockup | First screenshot | center |

If no screenshots are provided: render phone frame outlines with placeholder fill `--doc-canvas`.

---

## Construction Process

1. Determine `type` (proposal or direction)
2. Collect user inputs: project, phase, round, team, presenters, date, screenshots
3. Encode each screenshot with `encode_image()`
4. Select the appropriate slide flow from Template Flow Rules
5. Build each slide using its archetype HTML template + helper functions
6. Inject slides into HTML Shell
7. Write output to `~/Desktop/design-review-{kebab-slug}.html`
8. Open in browser
9. Report: file path, size in KB, slide count

---

## QA Checklist

- [ ] Google Fonts `<link>` from themes/plex.md is present in `<head>`
- [ ] Font: `--font-sans` for ALL titles, section headers, cover text
- [ ] Font: `--font-ui` for persistent header, keyword bars, column labels
- [ ] Font: `--font-body` for all body text, numbered items, descriptions
- [ ] Font: `--font-mono` for BEFORE/AFTER, DECISION MATRIX, FINDINGS, FINAL MOCKUP headers
- [ ] Font: `--font-quote` only on full-bleed quote slide
- [ ] Section divider bg: exactly `--light-gray` (never other near-white grays)
- [ ] Card bg on gray slides: `--light-card`
- [ ] Cover slides: NO persistent header
- [ ] All content slides: persistent header present
- [ ] "FEEDBACK NEEDED — Questions" has vertical 1px divider between left and right halves
- [ ] Direction slides have keyword bar at absolute bottom with border-top
- [ ] Design Process timeline: 2px horizontal line + 4 alternating dots
- [ ] Phone mockups: CSS border 2.5px solid `--ink-body`, correct border-radius, notch rendered
- [ ] Screenshots embedded as base64 data URIs (fully self-contained output)
- [ ] Nav dots functional (bottom center)
- [ ] Arrow button navigation functional (left/right sides)
- [ ] Keyboard ArrowLeft / ArrowRight / Space working
- [ ] Viewport scaling (transform:scale) works on load and resize
- [ ] Output file: `design-review-{slug}.html` on Desktop
