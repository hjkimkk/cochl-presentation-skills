---
name: cochl-design
description: Single entry point for the Cochl design team toolkit. Use when the user asks for anything Cochl-branded — decks, pitches, brochures, banners, press kits, design reviews, proposal documents, installing or applying the Cochl design system (@cochlearai/ui), or checking Figma ↔ code drift — or types /cochl-design or an old command name (/pitch-deck-skill, /dr-template, /design-review-template, /proposal-doc-template). Routes the request to the right Cochl skill.
---

# Cochl Design — router

You do not build anything here. Pick the skill, load its SKILL.md, and follow it.

## Routing table

| The request is about… | Load | Theme |
|---|---|---|
| deck, pitch, presentation, brochure, banner, press kit, document | `../cochl-presentation/SKILL.md` | `plex` |
| …PT template, `.pptx` template, `Cochl_PT_template.pptx`, AcousticShield deck | `../cochl-presentation/SKILL.md` → `references/decks/pt-template/` | `pt-template` |
| design review — Proposal, or Direction Alignment & Feedback | `../design-review/SKILL.md` | `plex` |
| design proposal document (HTML → PDF) | `../proposal-doc/SKILL.md` | `plex` |
| install/apply `@cochlearai/ui`, build React UI | `../design-system/SKILL.md` | `@cochlearai/ui` tokens |
| Figma ↔ code drift, mapping, coverage | `../design-sync/SKILL.md` | n/a |

## Rules

1. **Unclear request** → ask exactly one multiple-choice question listing the six rows above, then route. Never guess between two skills.
2. **Two-part request** → route the first part; when it is done, offer the second. Never run two skills at once.
3. **`/cochl-design` with no request** → show the six rows as a menu, one line each, and wait.
4. The user may ask for the other theme in words; there is no third theme.
5. Every skill can still be called directly (`/cochl-presentation`, `/pitch-deck`, `/design-review`, `/proposal-doc`, `/design-system`, `/design-sync`).
6. **Old command names** → treat as the current skill, no question asked:

| Old name | Load |
|---|---|
| `/pitch-deck-skill` | `../pitch-deck/SKILL.md` |
| `/design-review-template`, `/dr-template` | `../design-review/SKILL.md` |
| `/proposal-doc-template` | `../proposal-doc/SKILL.md` |

Brand rules for all skills: `core/brand-core.md`.
