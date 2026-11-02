# Phase 2 onboarding: one town hall for all teams

- **When:** one 50-minute town hall in late November 2026 (date to confirm) · **Host:** HJ · **Material:** this page, [town hall deck](./phase2-townhall-deck.html) (22 slides, Cochl 101 template; editable copy in Figma Slides: https://www.figma.com/slides/Eq5vJ2aUnxQT9m0ECklavm), [README install](../README.md#install-plugin-v2), [Cochl 101 team guide](./cochl-101-team-guide.md). The 30-minute [team session deck](./phase2-onboarding-deck.html) stays for small follow-ups with one team.
- **Goal:** everyone leaves with the plugin installed, auto-update on, and one real output made with `/cochl-design`.

## Format (decided 2026-10-20)

One town hall replaces the four team sessions: same content, every team in one room, with a short
demo per team. Send the calendar invite two weeks ahead and the prep email below two days ahead.

| | |
|---|---|
| Date and time | to confirm |
| Length | 50 minutes |
| Demos | Business and Research: HJ · Design: NS, YJ · Dev: YJ, NS (module owners) |
| Timing | after `@cochlearai/ui` 1.0.6 is published, so the Dev demo runs on the current package |

After the town hall: send form A from [`phase2-feedback-form.md`](./phase2-feedback-form.md) and
fill the attendance log below.

## Before the town hall (send 2 days ahead)

1. Claude Code installed and signed in.
2. GitHub access to `hjkimkk/cochl-presentation-skills`, with git credentials that work without a prompt: `gh auth login` then `gh auth setup-git`.
3. Bring one real request you'd use this week (a deck, a review, a proposal).

### Invite email (copy, fill the brackets, send 2 days ahead)

> **Subject:** Town hall, 50 min: set up the Cochl design toolkit ([Date, Time])
>
> Hi all,
>
> On [Date] at [Time] ([Room / link]) we'll spend 50 minutes, all teams together, setting up the Cochl design toolkit, one Claude Code plugin for decks, brochures, banners, design reviews, proposals and the design system. You'll leave with it installed, updating itself, and one real output made with `/cochl-design`.
>
> Before the town hall, please:
> 1. Install Claude Code and sign in.
> 2. Check GitHub access to `hjkimkk/cochl-presentation-skills`, and set up git credentials so they work without a prompt: run `gh auth login`, then `gh auth setup-git`.
> 3. Bring one real request you'd use this week, for example [team example: "a QBR deck with these numbers" / "a research position paper deck" / "a proposal review" / "apply @cochlearai/ui in a page"].
>
> Team hub (install, commands, help): https://hjkimkk.github.io/cochl-presentation-skills/
>
> Thanks,
> HJ

## Agenda (50 minutes)

| Min | Part | Done when |
|---|---|---|
| 0–5 | Why: one install, one command, one brand source, automatic updates | — |
| 5–15 | Install live, one command for new and old installs alike: `curl -fsSL https://raw.githubusercontent.com/hjkimkk/cochl-presentation-skills/main/scripts/migrate-to-plugin.sh \| bash` (adds the marketplace, installs the plugin, turns auto-update on; rehearsed Oct 27 in an empty config: 4 s, v2.1.2 enabled). Restart Claude Code | `/cochl-design` shows the menu |
| 15–35 | Four team demos (below), about five minutes each | — |
| 35–45 | Each person runs their own request | one output per person |
| 45–50 | Where to get help, how to request a template, feedback form ([form A](./phase2-feedback-form.md#form-a-after-the-town-hall)) | questions logged, form A sent |

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
| Not on the latest version | `/plugin` → Marketplaces → `cochl` → Update, then restart Claude Code |

## Attendance log

| Team | Date | People | Installed | Output made | Notes |
|---|---|---|---|---|---|
| Business | | | / | / | |
| Research | | | / | / | |
| Design | | | / | / | |
| Dev | | | / | / | |
