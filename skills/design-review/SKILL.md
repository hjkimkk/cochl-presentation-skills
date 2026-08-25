---
name: design-review-template
description: >
  Generates a self-contained interactive HTML design review presentation
  strictly following the two official Cochl PPTX templates:
  DESIGN REVIEW_Proposal.pptx and DESIGN REVIEW_Direction Alignment, and Feedback Meetings.pptx.
  Use when a team needs to run a Proposal Review or Direction Alignment & Feedback Meeting.
triggers:
  - /design-review-template
  - /dr-template
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

### Color Tokens
```
--black:     #000000    cover, section dividers (dark variant), final mockup
--white:     #FFFFFF    standard content slide backgrounds
--gray-bg:   #F1F1F2    section-divider bg, goal cards bg, persona bg
--card-bg:   #E6E6E6    cards that sit on --gray-bg slides
--border:    rgba(0,0,0,0.10)
--accent:    #4B68FF    small label caps only (REVIEW STATUS, GOAL labels)
--muted-d:   rgba(255,255,255,0.40)   muted text on dark slides
--muted-l:   rgba(0,0,0,0.40)         muted text on light slides
```

### Font Stack
```
IBM Plex Sans   → cover title, section dividers, section header blocks, direction titles
IBM Plex Mono   → tech/analysis headers: BEFORE/AFTER, DECISION MATRIX, FINDINGS, FINAL MOCKUP
Roboto          → body text, numbered items, descriptions, goal card body
Public Sans     → persistent header (top bar), keyword bars, column labels, attribution
Lora            → full-bleed quote slides (italic)
```

Google Fonts CDN import:
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Roboto:wght@300;400;500&family=Public+Sans:wght@400;500&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
```

### Typography Scale (at 1440px output)
| Role | Font | Size | Weight |
|------|------|------|--------|
| Cover main "DESIGN REVIEW" | IBM Plex Sans | 96px | 300 |
| Cover project name | IBM Plex Sans | 64px | 300 |
| Section divider title | IBM Plex Sans | 96px | 300 |
| Section header block title | IBM Plex Sans | 40px | 400 |
| Tech slide headers (Mono) | IBM Plex Mono | 40px | 400 |
| Direction title "DIRECTION 1" | IBM Plex Sans | 46px | 300 |
| Large numbers 01/02/03 | Roboto | 40px | 400 |
| Large body | Roboto | 20px | 400 |
| Standard body | Roboto | 16px | 300–400 |
| Small / captions | Roboto | 13px | 400 |
| Persistent header | Public Sans | 13px | 400 |
| Keyword bar | Public Sans | 13px | 400 |
| Cover metadata row | IBM Plex Sans | 21px | 300 |
| Full-bleed quote | Lora | 40px | 400 italic |

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
  font-family: 'Public Sans', sans-serif;
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
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Roboto:wght@300;400;500&family=Public+Sans:wght@400;500&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;overflow:hidden;background:#111;}
body{display:flex;align-items:center;justify-content:center;font-family:'Roboto',sans-serif;}
.dw{width:1440px;height:810px;position:relative;transform-origin:center center;overflow:hidden;}
.slide{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .22s ease;}
.slide.active{opacity:1;pointer-events:all;}
/* nav dots */
.nd{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:9999;}
.nd button{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.2);cursor:pointer;transition:all .2s;border:none;outline:none;padding:0;}
.nd button.on{background:rgba(255,255,255,.88);transform:scale(1.45);}
/* counter */
.ct{position:fixed;bottom:14px;right:28px;font-size:10px;color:rgba(255,255,255,.22);z-index:9999;letter-spacing:.12em;font-family:'Public Sans',sans-serif;}
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

### 1. COVER — Main (Full Bleed Black)
**Source**: Both PPTX, slide 1  
**Used for**: Opening slide of every design review

- Background: `#000000`, NO persistent header
- "DESIGN REVIEW" centered at y≈150px, 96px IBM Plex Sans 300, white
- Thin horizontal rules (1px, `rgba(255,255,255,0.15)`) at y≈550, 570, 610, 635
- Between rules: metadata rows in 21px IBM Plex Sans 300, white, centered
  - Row 1: `PHASE : XX  |  ROUND : XX`
  - Row 2: `DESIGN REVIEW  |  COMPANY / TEAM NAME  |  PERSON ONE, PERSON TWO  |  TODAY'S DATE`
- Logo top-center if available

```html
<div class="slide" style="background:#000;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;">
  <h1 style="font-size:96px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;color:#fff;letter-spacing:0.04em;text-transform:uppercase;margin-top:140px;">DESIGN REVIEW</h1>
  <div style="position:absolute;bottom:0;left:0;right:0;">
    <div style="height:1px;background:rgba(255,255,255,0.15);margin-bottom:20px;"></div>
    <p style="text-align:center;font-size:21px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;color:#fff;letter-spacing:0.06em;">PHASE : {phase} &nbsp;|&nbsp; ROUND : {round}</p>
    <div style="height:1px;background:rgba(255,255,255,0.15);margin:20px 0;"></div>
    <p style="text-align:center;font-size:21px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;color:#fff;letter-spacing:0.04em;">{team} &nbsp;|&nbsp; {presenters} &nbsp;|&nbsp; {date}</p>
    <div style="height:1px;background:rgba(255,255,255,0.15);margin-top:20px;margin-bottom:30px;"></div>
  </div>
</div>
```

---

### 2. COVER — Project (Split Panel)
**Source**: PPTX2, slides 5–8  
**Used for**: Second cover showing project name + phone mockup

- Background: `#000000`, NO persistent header
- Left 50%: project branding (label, name, round)
- Right 50%: phone mockup(s) centered
- Bottom strip: 3 metadata items (Public Sans 13px, `rgba(255,255,255,0.3)`)

```html
<div class="slide" style="background:#000;display:flex;">
  <div style="width:50%;padding:80px 60px;display:flex;flex-direction:column;justify-content:center;">
    <p style="font-size:16px;font-family:'IBM Plex Sans',sans-serif;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;">Cochl · {product line}</p>
    <h2 style="font-size:64px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;color:#fff;text-transform:uppercase;line-height:1.0;margin-top:28px;">{PROJECT NAME}</h2>
    <p style="font-size:18px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-top:28px;">ROUND {round}</p>
  </div>
  <div style="width:50%;display:flex;align-items:center;justify-content:center;">
    <!-- phone() helper output here -->
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;border-top:1px solid rgba(255,255,255,0.08);padding:14px 60px;display:flex;justify-content:space-between;">
    <span style="font-size:13px;font-family:'Public Sans',sans-serif;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;">PHASE : {phase}</span>
    <span style="font-size:13px;font-family:'Public Sans',sans-serif;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;">{team}</span>
    <span style="font-size:13px;font-family:'Public Sans',sans-serif;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;">{date}</span>
  </div>
</div>
```

---

### 3. AGENDA
**Source**: PPTX2, slides 3–4  
**Used for**: Listing review sections with numbered items

- Dark variant preferred (black bg, white text)
- Left ~60%: "AGENDA" at 40px IBM Plex Sans 400, y≈370px from top
- Right ~40%: numbered section list
  - Section row height: ~60px, gray highlight band behind each section number
  - Section number: 26px Roboto bold
  - Section title: 24px Roboto 400
  - Sub-items: 18px Roboto 400, muted

---

### 4. SECTION DIVIDER
**Source**: Both PPTX  
**Used for**: OVERVIEW, DISCOVERY, STRATEGY & PROCESS, KEY DELIVERABLES, NEXT STEPS

- Light variant bg: `#F1F1F2`; Dark variant bg: `#000000`
- Persistent header present
- Section title centered vertically: 96px IBM Plex Sans 300, uppercase
  - Light: black text; Dark: white text

```html
<!-- Light variant -->
<div class="slide" style="background:#F1F1F2;">
  {hdr}
  <div style="height:100%;display:flex;align-items:center;justify-content:center;padding-top:38px;">
    <h2 style="font-size:96px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;color:#000;text-transform:uppercase;letter-spacing:0.02em;">{SECTION TITLE}</h2>
  </div>
</div>
```

---

### 5. THREE THINGS TO KNOW — 3-Column
**Source**: PPTX2, slides 11–13  
**Used for**: Overview section framing (3 key principles/problems/constraints)

- Light or dark variant
- Persistent header
- "THREE THINGS TO KNOW" — 40px IBM Plex Sans 400, centered, below header
- 1px horizontal rule below title
- 3 equal columns: number (40px Roboto) + description (20px Roboto 400, lh 1.6)

```html
<div class="slide" style="background:#fff;">
  {hdr}
  <div style="padding-top:38px;">
    <div style="text-align:center;padding:48px 80px 0;">
      <h2 style="font-size:40px;font-weight:400;font-family:'IBM Plex Sans',sans-serif;text-transform:uppercase;color:#000;">THREE THINGS TO KNOW</h2>
      <div style="height:1px;background:rgba(0,0,0,0.12);margin-top:18px;"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;padding:0 80px;margin-top:48px;">
      <!-- repeat for 01, 02, 03 -->
      <div style="padding:0 48px;border-right:1px solid rgba(0,0,0,0.08);">
        <p style="font-size:40px;font-weight:400;font-family:'Roboto',sans-serif;color:#000;margin-bottom:20px;">01</p>
        <p style="font-size:20px;font-weight:400;font-family:'Roboto',sans-serif;color:#000;line-height:1.6;">{description}</p>
      </div>
    </div>
  </div>
</div>
```

---

### 6. PROJECT GOALS
**Source**: PPTX2, slide 14  
**Used for**: 3 measurable project goals with metrics

- Background: `#F1F1F2`
- Persistent header
- "PROJECT GOALS" — 40px IBM Plex Sans 400 + 1px divider
- 3 equal cards, bg `#E6E6E6`, border-radius 4px, padding 40px 36px
  - Goal label: "GOAL 1/2/3" — 40px IBM Plex Sans bold
  - Description: 20px Roboto 400, lh 1.45
  - Metric: 13px Public Sans uppercase, border-top 1px

---

### 7. MARKET RESEARCH (Competitive Landscape)
**Source**: PPTX1 slides 13–14, PPTX2 slides 17–18  
**Used for**: Showing top 5 competitors

- Persistent header
- "MARKET RESEARCH" section header (40px IBM Plex Sans) + 1px divider
- 5 company logo placeholders in a row (rectangles with name labels)

---

### 8. USER INSIGHTS (Quotes)
**Source**: PPTX2, slides 19–20  
**Used for**: 3 verbatim user research quotes

- Background: `#F1F1F2` (light) or `#000000` (dark)
- Persistent header
- "USER INSIGHTS" section header (40px IBM Plex Sans) + 1px divider
- 3-column quote layout:
  - Quote: 20px Roboto 400, italic, lh 1.6, curly quotes
  - Attribution: 13px Public Sans uppercase, muted, margin-top 8px

---

### 9. USER PERSONAS
**Source**: PPTX2, slides 21–22  
**Used for**: 2–3 user persona descriptions

- Background: `#F1F1F2`
- Persistent header + "USER PERSONAS" section header + 1px divider
- 3 equal columns (use 2 columns if only 2 personas):
  - Avatar: 80×80px circle, bg `#D8D8D8`
  - Name: 18px Roboto 400 uppercase
  - Role: 13px Public Sans uppercase, muted
  - Description: 14px Roboto 300, lh 1.65

---

### 10. FULL-BLEED QUOTE
**Source**: PPTX2, slide 23  
**Used for**: Emotional anchor between Discovery and Strategy

- White bg, NO section title block
- Persistent header (date only)
- Centered quote: 40px Lora italic, lh 1.55, max-width 900px, centered
- Attribution: 13px Public Sans uppercase, muted

---

### 11. DESIGN PROCESS (Timeline)
**Source**: PPTX1 slides 21–22, PPTX2 slides 26–27  
**Used for**: Showing the 4-stage design process + current position

- White bg
- Persistent header + "DESIGN PROCESS" section header (40px IBM Plex Sans) + 1px divider
- Horizontal timeline spanning full width:
  - 2px black horizontal line
  - 4 stage dots at x = 12.5%, 37.5%, 62.5%, 87.5%
  - Stages alternate above/below (1,3 above; 2,4 below)
  - Each: 10px circle dot + stage name (13px Public Sans uppercase) + date label (20px Roboto 300) + description (13px Roboto, muted)
- Stages: PROBLEM ALIGNMENT → EXPLORATION → SOLUTION ALIGNMENT → HANDOFF

---

### 12. FEEDBACK NEEDED — Categories
**Source**: PPTX2, slide 28  
**Used for**: Showing which design phase the review is in

- Background: `#F1F1F2`
- Persistent header + "FEEDBACK NEEDED" section header + 1px divider
- 4 category boxes in a row: CRAFT | STRUCTURE | EXPLORE | IMPLEMENT
  - Each: 13px Public Sans uppercase, centered, border 1px solid rgba(0,0,0,0.1)
  - Active category highlighted with black text and bold border

---

### 13. FEEDBACK NEEDED — Questions
**Source**: PPTX2, slide 29  
**Used for**: 3 specific questions framing the review discussion — THE MOST IMPORTANT SLIDE

- White bg
- Persistent header, NO section title block
- Split layout: left 42% | right 58%
  - Left: "FEEDBACK\nNEEDED" — 64px IBM Plex Sans 300, uppercase, vertically centered
  - Vertical rule: 1px `rgba(0,0,0,0.1)` between halves
  - Right: 3 bullet questions, 21px Roboto 300, lh 1.55
    - Bullet: 6×6px black circle, flex-shrink 0, margin-top 6px
    - Question text: left-aligned

```html
<div class="slide" style="background:#fff;">
  {hdr}
  <div style="padding-top:38px;height:calc(100% - 38px);display:flex;">
    <div style="width:42%;display:flex;align-items:center;justify-content:center;padding:60px;">
      <h2 style="font-size:64px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;text-transform:uppercase;line-height:1.1;color:#000;">FEEDBACK<br>NEEDED</h2>
    </div>
    <div style="width:1px;background:rgba(0,0,0,0.1);align-self:stretch;margin:40px 0;"></div>
    <div style="width:58%;padding:60px 70px;display:flex;flex-direction:column;justify-content:center;gap:32px;">
      <!-- repeat for each question -->
      <div style="display:flex;gap:18px;align-items:flex-start;">
        <div style="width:6px;height:6px;border-radius:50%;background:#000;flex-shrink:0;margin-top:9px;"></div>
        <p style="font-size:21px;font-weight:300;font-family:'Roboto',sans-serif;color:#000;line-height:1.55;">{question}</p>
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
- Persistent header + "PROPOSED CONCEPT" section header (40px IBM Plex Sans) + 1px divider
- Two halves separated by 1px vertical divider:
  - Labels: "1" / "2" or "TODAY" / "TOMORROW" — 21px Roboto 500 uppercase, centered
  - Sublabel: 13px Roboto 300 muted, text-align center
  - Phone mockup (220×420) centered below label

---

### 15. DIRECTION DIVIDER
**Source**: PPTX2, slides 32–43  
**Used for**: Chapter break before each design direction

- White bg (or black variant)
- Persistent header
- "DIRECTION" — 40px IBM Plex Sans 400, uppercase
- "01" / "02" / "03" — 40px IBM Plex Sans 400, alongside or same line

---

### 16. DIRECTION CONTENT
**Source**: PPTX2, slides 34–43  
**Used for**: Showing a design direction with screenshot and rationale

- White bg
- Persistent header, NO section title block
- Left 42%:
  - Direction title: "DIRECTION 1" — 46px IBM Plex Sans 300, uppercase, margin-bottom 28px
  - Direction name: 15px IBM Plex Sans 500
  - Description: 16px Roboto 300, lh 1.72, `rgba(0,0,0,0.55)`
- Right 58%: phone mockup(s) — single (276×556) or two side-by-side (216×436 each)
- Bottom keyword bar (absolute, bottom:0):
  - `border-top:1px solid rgba(0,0,0,0.1)`
  - 13px Public Sans uppercase, text-align center
  - Format: `Keywords: Word 01, Word 02, Word 03`

```html
<div class="slide" style="background:#fff;">
  {hdr}
  <div style="padding-top:38px;height:calc(100% - 38px);display:flex;">
    <div style="width:42%;padding:60px 60px 80px;display:flex;flex-direction:column;justify-content:center;">
      <h2 style="font-size:46px;font-weight:300;font-family:'IBM Plex Sans',sans-serif;text-transform:uppercase;color:#000;margin-bottom:28px;">DIRECTION {n}</h2>
      <p style="font-size:15px;font-weight:500;font-family:'IBM Plex Sans',sans-serif;color:#000;margin-bottom:14px;">{direction name}</p>
      <p style="font-size:16px;font-weight:300;font-family:'Roboto',sans-serif;color:rgba(0,0,0,0.55);line-height:1.72;">{description}</p>
    </div>
    <div style="width:58%;display:flex;align-items:center;justify-content:center;gap:24px;">
      <!-- phone() output -->
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;border-top:1px solid rgba(0,0,0,0.1);padding:10px 60px;text-align:center;">
    <span style="font-size:13px;font-family:'Public Sans',sans-serif;text-transform:uppercase;letter-spacing:0.08em;color:rgba(0,0,0,0.4);">Keywords: {word1}, {word2}, {word3}</span>
  </div>
</div>
```

---

### 17. BEFORE/AFTER WORKFLOW
**Source**: PPTX2, slides 44–45  
**Used for**: 3-step workflow comparison across BEFORE / NOW / AFTER

- White bg
- Persistent header + "BEFORE/AFTER WORKFLOW" — 40px **IBM Plex Mono** 400 + 1px divider
- Column headers: BEFORE | NOW | AFTER — 13px Public Sans uppercase
- 3 rows × 3 columns grid
  - Step number: 40px Roboto, `rgba(0,0,0,0.2)`, margin-right 16px
  - Step text: 16px Roboto 300, 2 lines

---

### 18. STRATEGIC DIRECTIONS / DECISION MATRIX
**Source**: PPTX2, slides 47–49  
**Used for**: Structured trade-off analysis between options

- White bg
- Persistent header + "STRATEGIC DIRECTIONS" or "DECISION MATRIX" — 40px IBM Plex Mono + 1px divider

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
- Persistent header + "BENEFIT COMPARISON TABLE" — 40px IBM Plex Mono + 1px divider
- Table: Benefit rows × Option columns (A/B/C/D/E)
- Cells: checkmark (✓) or dash (—)

---

### 20. FINDINGS & RECOMMENDATIONS
**Source**: PPTX2, slide 51  
**Used for**: Synthesizing review outcomes into a decision record

- White bg
- Persistent header + "FINDINGS & RECOMMENDATIONS" — 40px IBM Plex Mono + 1px divider
- 2-column split: Findings | Recommendations
  - Column header: 13px Public Sans uppercase
  - Items: numbered 01/02/03, 40px Roboto number (muted) + 16px Roboto 300 text

---

### 21. FINAL MOCKUP
**Source**: PPTX2, slide 52  
**Used for**: Showing the committed direction as a full-bleed visual

- Background: `#000000`, NO persistent header (or white persistent header on dark)
- "FINAL MOCKUP" — 40px IBM Plex Mono 400, white, top-left (with padding)
- Description: 20px Roboto 300, white, below title
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
- 4-cell grid: large metric value (40px+ Roboto bold) + metric label (13px Public Sans)

---

### 24. DESIGN DIRECTIONS COMPARISON (Proposal style)
**Source**: PPTX1, slides 29–36  
**Used for**: Showing 2 side-by-side directions in a Proposal context

- White bg
- Persistent header, NO section title block
- Left text panel: direction name + description
- Right visual panel: mockup + callout annotations
  - Callout: dotted line + 13px Roboto text label

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
- "THANKS" or "Questions or new ideas?" — 96px IBM Plex Sans 300, centered
- Below: email, project link, phase/round metadata
- Font: IBM Plex Sans

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
        f'<div style="width:{w}px;height:{h}px;border-radius:{r}px;border:2.5px solid #1a1a1a;'
        f'position:relative;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.18);background:#fff;flex-shrink:0;">'
        f'<div style="position:absolute;top:{nt}px;left:50%;transform:translateX(-50%);'
        f'width:{nw}px;height:{nh}px;background:#111;border-radius:{nh}px;z-index:10;"></div>'
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
        f'<span style="font-size:13px;font-weight:400;font-family:\'Public Sans\',sans-serif;'
        f'text-transform:uppercase;letter-spacing:0.08em;color:{fg};">{project}</span>'
        f'<span style="font-size:13px;font-weight:400;font-family:\'Public Sans\',sans-serif;'
        f'text-transform:uppercase;letter-spacing:0.08em;color:{fg};">{date}</span>'
        f'</div>'
    )

def stitle(text: str, dark: bool = False) -> str:
    """Render a section title block (used at top of content slides)."""
    fg = "#fff" if dark else "#000"
    br = "rgba(255,255,255,0.12)" if dark else "rgba(0,0,0,0.12)"
    return (
        f'<div style="text-align:center;padding:48px 80px 0;">'
        f'<h2 style="font-size:40px;font-weight:400;font-family:\'IBM Plex Sans\',sans-serif;'
        f'text-transform:uppercase;letter-spacing:0em;color:{fg};">{text}</h2>'
        f'<div style="height:1px;background:{br};margin-top:18px;"></div>'
        f'</div>'
    )
```

---

## Template Flow Rules

### PROPOSAL REVIEW (type=proposal)
Required slide order:
```
1.  COVER — Main (black full bleed)
2.  AGENDA
3.  SECTION DIVIDER — PROJECT OVERVIEW
4.  THREE THINGS TO KNOW / PRINCIPLES
5.  PROJECT GOALS
6.  SECTION DIVIDER — DISCOVERY
7.  MARKET RESEARCH (top 5 competitors)
8.  VALUE / EFFORT MATRIX
9.  SECTION DIVIDER — STRATEGY & PROCESS
10. KEY METRICS (4 numbers)
11. DESIGN PROCESS (timeline)
12. SECTION DIVIDER — KEY DELIVERABLES
13. DELIVERABLES list (2–3 items)
14. DIRECTION CONTENT — Direction 1
15. DIRECTION CONTENT — Direction 2
16. SECTION DIVIDER — NEXT STEPS
17. IMPROVEMENT / ACTION ITEMS
18. DIRECTION POLL (A / B / C)
19. PROJECT ROADMAP (Miro link)
20. CLOSING / THANK YOU
```

### DIRECTION ALIGNMENT & FEEDBACK REVIEW (type=direction)
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

If no screenshots are provided: render phone frame outlines with placeholder fill `#E8E8E8`.

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

- [ ] Font: IBM Plex Sans for ALL titles, section headers, cover text
- [ ] Font: Public Sans for persistent header, keyword bars, column labels
- [ ] Font: Roboto for all body text, numbered items, descriptions
- [ ] Font: IBM Plex Mono for BEFORE/AFTER, DECISION MATRIX, FINDINGS, FINAL MOCKUP headers
- [ ] Font: Lora only on full-bleed quote slide
- [ ] Section divider bg: exactly `#F1F1F2` (not #F2F2F2, not #EEEEEE)
- [ ] Card bg on gray slides: `#E6E6E6`
- [ ] Cover slides: NO persistent header
- [ ] All content slides: persistent header present
- [ ] "FEEDBACK NEEDED — Questions" has vertical 1px divider between left and right halves
- [ ] Direction slides have keyword bar at absolute bottom with border-top
- [ ] Design Process timeline: 2px horizontal line + 4 alternating dots
- [ ] Phone mockups: CSS border 2.5px solid #1a1a1a, correct border-radius, notch rendered
- [ ] Screenshots embedded as base64 data URIs (fully self-contained output)
- [ ] Nav dots functional (bottom center)
- [ ] Arrow button navigation functional (left/right sides)
- [ ] Keyboard ArrowLeft / ArrowRight / Space working
- [ ] Viewport scaling (transform:scale) works on load and resize
- [ ] Output file: `design-review-{slug}.html` on Desktop
