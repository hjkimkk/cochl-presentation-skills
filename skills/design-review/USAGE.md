# Design Review Skill — Usage

## Triggers
- `/design-review-template` — generate a Proposal or Direction Alignment review
- `/dr-template` — shorthand alias

## Assets
- `assets/DESIGN REVIEW_Proposal.pptx` — Proposal review source template
- `assets/DESIGN REVIEW_Direction Alignment, and Feedback Meetings.pptx` — Direction Alignment source template

## Key Arguments
| Arg | Description |
|---|---|
| `type` | `proposal` · `direction-alignment` |
| `project` | Project name |
| `phase` | Current project phase number |
| `round` | Review round number |
| `presenter` | Presenter name(s) |
| `team` | Team name |
| `output` | Output file path |

## Output
- Self-contained HTML (1440×810px canvas, scales to fit any viewport)
- Keyboard arrow navigation

## Layout Philosophy
Narrative-first: full-width storytelling, process flows, comparison matrices, annotated screenshots. Cards used only for Goals, Directions, and Personas.

## Examples
See `examples/Project_Review_Skills.html` for a reference training deck.
