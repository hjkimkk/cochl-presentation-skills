# Trade Show / Conference Booth Deck

A **looping, glanceable kiosk display** for a booth monitor or conference standee — not a narrated pitch. It must read from 3–5 m away in a noisy hall, attract a passerby in ~2 seconds, and communicate one idea per screen while auto-advancing on a seamless loop. Inherits [`../brand-core.md`](../brand-core.md) for color, glow, logo, and type; **overrides** the type scale (much larger), replaces the page-nav pill with an auto-loop, and runs as a kiosk (no human navigation required).

Heading treatment: IBM Plex Sans, Title Case or UPPERCASE display; mono kickers. Accent: indigo, glow-forward. This is the most visually dramatic Cochl deck — lean into the glow and oversized type.

## Format & behavior
- **Canvas:** 1920×1080 landscape (booth monitor) by default. Portrait variant 1080×1920 for a vertical standee — same layouts, restacked. State which at build time.
- **Loop:** auto-advance ~6 s per slide, seamless wrap (last → first), one-shot fade/scale entrance per slide (no looping animation *within* a slide). Click or **Space** pauses/resumes; **→/←** step manually; a slim bottom dot row shows position. No nav pill, no scrollbars, cursor hidden after 3 s idle.
- **Distance legibility (hard rules):** display headline ≥ 96px (prefer 120–200px); supporting line ≥ 40px; **≤ 7 words on screen** at once; **max one stat per screen**; one glow per screen; never a paragraph. If it can't be read across a room, it's wrong.

## Loop slide set (~8 frames — keep it short so the loop feels tight)
| # | Frame | Layout class | Content |
|---|---|---|---|
| 1 | Attract / hero | `attract-hero` | Gradient `cochl.` symbol + wordmark, huge tagline "Creating ears for AI", full glow. The 2-second hook. |
| 2 | What we do | `one-line-XL` | One sentence value prop + one icon. "Sound AI for the physical world." |
| 3 | Why sound | `stat-spotlight-XL` | One oversized number/claim. Any metric unconfirmed → `[NEEDS INPUT]`. |
| 4 | Product lines | `triad-cards-XL` | 3 big cards (e.g. edge SDK · cloud API · sound dataset) — categories only, no invented specs. |
| 5 | How it works | `step-flow-XL` | 3 huge steps: Listen → Understand → Act. |
| 6 | Use cases | `icon-grid-XL` | 4–6 big icon tiles (safety, security, industrial, mobility, smart space…). Icons from `../brochure/icons/icon-data.json`. |
| 7 | Proof / trust | `logo-wall` or `stat-spotlight-XL` | "Trusted by" logo strip **or** a single proof stat. Logos/numbers unconfirmed → `[NEEDS INPUT]`. |
| 8 | CTA | `cta-qr` | "Visit cochl.ai" + large **QR** + booth # / "Talk to us". The takeaway frame — hold it slightly longer (~8 s). |

Drop or duplicate frames to fit the content, but keep the loop ≤ ~10 frames and always open on `attract-hero`, close on `cta-qr`.

## Type scale (override of brand-core body sizes)
```
display  : clamp(96px, 10vw, 200px) / 700 / lh 0.98 / tracking -0.03em
headline : clamp(56px, 6vw, 96px)  / 700
support  : clamp(32px, 3vw, 48px)  / 400  (--text-soft)
kicker   : 24–28px mono UPPERCASE, letter-spacing 3px, --accent
stat      : clamp(160px, 18vw, 340px) / 700, gradient background-clip:text
```

## Loop mechanics (HTML, kiosk)
```javascript
const slides=[...document.querySelectorAll('section.frame')]; let i=0, paused=false, HOLD=6000;
function show(n){slides.forEach((s,k)=>s.classList.toggle('on',k===n)); i=n;
  document.querySelectorAll('.dot').forEach((d,k)=>d.classList.toggle('act',k===n));}
function next(){ if(!paused) show((i+1)%slides.length); }
let timer=setInterval(next, HOLD);
addEventListener('keydown',e=>{ if(e.code==='Space'){paused=!paused;} 
  else if(e.key==='ArrowRight'){show((i+1)%slides.length);} else if(e.key==='ArrowLeft'){show((i-1+slides.length)%slides.length);} });
addEventListener('click',()=>paused=!paused);
// cursor auto-hide
let ch; addEventListener('mousemove',()=>{document.body.style.cursor='';clearTimeout(ch);ch=setTimeout(()=>document.body.style.cursor='none',3000);});
show(0);
```
Frame CSS: `.frame{position:fixed;inset:0;opacity:0;transition:opacity .8s ease}.frame.on{opacity:1}` plus a per-frame `@keyframes fadeUp`/scale on `.on` children. The CTA frame may carry a longer `HOLD` via a `data-hold` attribute if you extend the script to read it.

## QR
The CTA QR must be generated at build time (offline). Encode the destination URL (default `https://cochl.ai`). Render as a self-contained SVG/PNG on a light rounded panel for scan contrast; embed inline (no external QR service). Confirm the exact URL / booth number with the user; unconfirmed → `[NEEDS INPUT]`.

## Output
Primary = the self-contained looping **HTML** (kiosk). Then ask format per brand-core §4. A **PPTX** export is possible (each frame → 1920×1080 image via the brand-core recipe, set slide advance to auto ~6 s), but the HTML loop is the real deliverable — say so. Deliver HTML (and PPTX if asked); same basename/dir.

Everything else (colors, gradient rule, fonts, logo, glow, PPTX recipe, QA) → **[`../brand-core.md`](../brand-core.md)**. Booth-specific QA: readable at 3–5 m? ≤7 words/frame? one glow + ≤one stat per frame? loop wraps seamlessly? opens on attract, closes on CTA-QR? no unconfirmed facts left unmarked?
