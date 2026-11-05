# Design Review Skill — Usage

## Triggers
- `/design-review` — generate a Proposal or Direction Alignment & Feedback review
- `/cochl-design` — the toolkit entry point routes design-review requests here
- Old command names still work when typed on their own: `/dr-template`, `/design-review-template`

## Choosing the template
- `type=proposal` — pitching a new design or solution for approval
- `type=direction` — aligning on, or getting feedback on, work in progress or a live product
- Not clear from the request? The skill asks you one question before building.

## Assets
- `assets/DESIGN REVIEW_Proposal.pptx` — Proposal review source template
- `assets/DESIGN REVIEW_Direction Alignment, and Feedback Meetings.pptx` — Direction Alignment source template

## Key Arguments
Same as the `args` in SKILL.md.

| Arg | Description |
|---|---|
| `type` | `proposal` · `direction` (required) |
| `theme` | Section-divider variant for the whole deck: `light` (default) · `dark` |
| `project` | Project or feature name (required) |
| `phase` | Phase number (Direction only, default `01`) |
| `round` | Round number (Direction only, default `01`) |
| `team` | Company / team name |
| `presenters` | Presenter name(s) |
| `date` | Presentation date (default: today) |
| `screenshots` | Comma-separated image paths embedded as phone mockups |
| `output` | Output path (default: `./design-review-{project-slug}.html` in the current working directory) |

## Team inputs
Slides such as goals, market research, user insights, personas and findings need your team's content. The skill asks for it in one question; anything you skip is marked `[NEEDS INPUT]` and listed in the summary.

## Output
- Self-contained HTML (1440×810px canvas, scales to fit any viewport)
- Keyboard arrow navigation; nav dots readable on light and dark slides
- The skill reports the path; open it yourself with `open <path>`

## QA
For `type=direction`, check a deck with:

```
python3 audit_direction_deck.py path/to/deck.html
```

It checks the required slide order (optional slides may be left out), allowed variants, no Next Steps slide, and no literal colours outside `:root`. Exit code 0 means pass.

## Layout Philosophy
Narrative-first: full-width storytelling, process flows, comparison matrices, annotated screenshots. Cards used only for Goals, Directions, and Personas.

## Examples
See `examples/Project_Review_Skills.html` for a reference training deck.
