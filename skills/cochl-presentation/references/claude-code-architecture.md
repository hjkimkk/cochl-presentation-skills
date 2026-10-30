# Claude Code architecture — the third deliverable

Every `cochl-presentation` build ends with three files: the **PPTX**, the **HTML**, and a **Claude Code architecture** page. The architecture page is one 1920×1080 plex page that shows how this build ran inside Claude Code, so a reviewer can see which skill, template, spec and tools produced the deck without reading the session.

Example: [`claude-code-architecture/examples/cochl-investor-deck_claude-code-architecture.html`](claude-code-architecture/examples/cochl-investor-deck_claude-code-architecture.html), generated from [`claude-code-architecture/examples/cochl-investor-deck.build.json`](claude-code-architecture/examples/cochl-investor-deck.build.json).

## What the page shows
| Area | Content |
|---|---|
| Header | Deck title, slug, build date, plugin name@marketplace and version (read from `.claude-plugin/plugin.json`) |
| Flow (01–05) | Request (entry command + one-line ask) → Router (`cochl-design`, or "skipped — direct call") → Skill (`cochl-presentation` → registry row) → Spec + brand (spec path, theme, files read) → Build (tools used) |
| Outputs | PPTX, HTML, Claude Code architecture — file names; the architecture card is outlined in `--accent` |
| Install layer | marketplace → plugin → `skills/*/SKILL.md` → command |
| QA run | slide count, `[NEEDS INPUT]` markers left in the deck, checklists run |

The layout is fixed — do not add or reorder areas. Brand rules are inherited from [`brand-core.md`](../../cochl-design/core/brand-core.md): plex theme, one glow, one `grad-text` phrase in the heading, white logo bottom-left at 0.70 in the footer with the deck title bottom-right.

## How to build it
1. After the deck HTML (and PPTX) exist, write `{slug}.build.json` next to them with what actually happened this session:
```json
{
  "deckTitle": "…", "slug": "…", "date": "YYYY-MM-DD",
  "request": "one line, the user's ask", "entry": "/cochl-design | /cochl-presentation",
  "route": { "row": "registry row name", "spec": "references/decks/…-template.md", "theme": "plex | pt-template" },
  "reads": ["files read besides SKILL.md and registry.md"],
  "tools": [{ "name": "Read | Write | Bash | …", "use": "what it did" }],
  "outputs": { "pptx": "{slug}.pptx", "html": "{slug}.html", "architecture": "{slug}_claude-code-architecture.html" },
  "qa": { "slides": 0, "needsInput": 0, "checklists": ["core/qa-checklist.md", "deck-engine.md → Deck QA"] }
}
```
   An output that was not produced takes `{ "path": "…", "note": "not exported — reason" }` instead of a string.
2. Run the generator (it reads the plex `:root` block and the logo itself; no colors are restated):
```bash
node <skill>/references/claude-code-architecture/gen-architecture.mjs {slug}.build.json {slug}_claude-code-architecture.html
```
3. Delete `{slug}.build.json` unless the user asks to keep it. Optionally add a PNG of the page as the last PPTX slide with the deck-engine screenshot step.

## Facts
Record only what happened in this session: real file paths, the tools actually called, the real slide and `[NEEDS INPUT]` counts (grep the deck). A field left empty renders as `[NEEDS INPUT]`; never fill one with a guess.

## QA
- [ ] Three outputs listed, file names match the files on disk
- [ ] Route row and spec match the registry row the build used
- [ ] `[NEEDS INPUT]` count equals a grep of the deck HTML
- [ ] Page fits 1920×1080 with no overlap into the footer
