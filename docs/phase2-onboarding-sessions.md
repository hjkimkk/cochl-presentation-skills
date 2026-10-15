# Phase 2 onboarding: 30-minute team sessions

- **When:** W8–W11 (Nov 23 – Dec 18, 2026) · **Host:** HJ · **Material:** this page, [session deck](./phase2-onboarding-deck.html) (13 slides, Cochl 101 template), [README install](../README.md#install-plugin-v2), [Cochl 101 team guide](./cochl-101-team-guide.md)
- **Goal:** everyone leaves with the plugin installed, auto-update on, and one real output made with `/cochl-design`.

## Before the session (send 2 days ahead)

1. Claude Code installed and signed in.
2. GitHub access to `hjkimkk/cochl-presentation-skills`, with git credentials that work without a prompt: `gh auth login` then `gh auth setup-git`.
3. Bring one real request you'd use this week (a deck, a review, a proposal).

### Invite email (copy, fill the brackets, send 2 days ahead)

> **Subject:** 30 min: set up the Cochl design toolkit ([Team], [Date, Time])
>
> Hi [Team],
>
> On [Date] at [Time] ([Room / link]) we'll spend 30 minutes setting up the Cochl design toolkit, one Claude Code plugin for decks, brochures, banners, design reviews, proposals and the design system. You'll leave with it installed, updating itself, and one real output made with `/cochl-design`.
>
> Before the session, please:
> 1. Install Claude Code and sign in.
> 2. Check GitHub access to `hjkimkk/cochl-presentation-skills`, and set up git credentials so they work without a prompt: run `gh auth login`, then `gh auth setup-git`.
> 3. Bring one real request you'd use this week, for example [team example: "a QBR deck with these numbers" / "a research position paper deck" / "a proposal review" / "apply @cochlearai/ui in a page"].
>
> Team hub (install, commands, help): https://hjkimkk.github.io/cochl-presentation-skills/
>
> Thanks,
> HJ

## Common agenda (all teams)

| Min | Part | Done when |
|---|---|---|
| 0–5 | Why: one install, one command, one brand source, automatic updates | — |
| 5–12 | Install live. New: `claude plugin marketplace add hjkimkk/cochl-presentation-skills` → `claude plugin install cochl-design@cochl --scope user` → `/plugin` → Marketplaces → cochl → Enable auto-update. Old install: `bash scripts/migrate-to-plugin.sh` | `/cochl-design` shows the menu |
| 12–25 | Team demo (below), then each person runs their own request | one output per person |
| 25–30 | Where to get help, how to request a template, feedback form | questions logged |

## Team demos

| Team | Demo request | Skill it routes to |
|---|---|---|
| Business | "QBR deck for Q3 with these numbers…" or a B2B proposal deck; banner for LinkedIn | `cochl-presentation` (decks, social kit) |
| Research | "Research position paper deck", "101 class lecture on sound event detection" | `cochl-presentation` (research, 101 lecture) |
| Design | Proposal review deck from a brief; a proposal document; drift check `/design-sync` on Button | `design-review`, `proposal-doc`, `design-sync` |
| Dev | Apply `@cochlearai/ui` in a React page; read the Figma → code mapping (`Type=Red` → `<Button color="danger">`); open the drift dashboard | `design-system`, `design-sync` |

## Troubleshooting

| Symptom | Fix |
|---|---|
| `/cochl-design` not found | Restart Claude Code; `claude plugin list` should show `cochl-design@cochl` |
| Old template shows up | v1 copies still in `~/.claude/skills/` → run `bash scripts/migrate-to-plugin.sh` |
| Install asks for a password or fails | git credentials: `gh auth login && gh auth setup-git` |
| Bare `/cochl-presentation` runs an old copy | Use `/cochl-design:cochl-presentation`, then run the migration script |

## Attendance log

| Team | Date | People | Installed | Output made | Notes |
|---|---|---|---|---|---|
| Business | | | / | / | |
| Research | | | / | / | |
| Design | | | / | / | |
| Dev | | | / | / | |
