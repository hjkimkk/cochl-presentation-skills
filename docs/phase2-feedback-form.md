# Phase 2 feedback form (draft)

Two short forms, built in Google Forms (or any form tool) from the questions below. The link of
form A goes on deck slide 12 (`Feedback form: [NEEDS INPUT]`) and in the session follow-up message.

- **Form A, after the town hall** (2 minutes, everyone, at the end of the town hall): did
  setup work, what will you use, what's missing.
- **Form B, version check** (30 seconds, design team, 7 days after each plugin release): measures
  the success metric "everyone on the design team on the latest version within 7 days of each
  release" (`docs/phase2-retro.md` §1).

Answers feed the retro on Dec 18 (`docs/phase2-retro.md` §1–§4) and the Phase 3 shortlist.

## Form A: after the town hall

| # | Question | Type | Options / note | Feeds |
|---|---|---|---|---|
| 1 | Your team | single choice, required | Business · Research · Design · Dev · Other | attendance log |
| 2 | Is `cochl-design` installed and does `/cochl-design` show the menu? | single choice, required | Yes · Installed, menu doesn't show · Not installed | metric "one install path" |
| 3 | Which version does `claude plugin list` show for `cochl-design`? | short text, required | e.g. `2.1.1`. Copy it from the terminal | version baseline |
| 4 | Is auto-update on for the `cochl` marketplace? | single choice | Yes · No · Not sure | version metric |
| 5 | Did you make one real output in the session? | single choice | Yes · Started, didn't finish · No | session goal |
| 6 | What did you make or try? | checkboxes | Deck · Brochure / 1-pager · Social banner · Press kit · Design review · Proposal doc · `@cochlearai/ui` / Figma → code · Drift check · Other | which modules get used |
| 7 | How likely are you to use `/cochl-design` in the next two weeks? | scale 1–5 | 1 = not at all, 5 = certainly | adoption |
| 8 | What got in the way during setup or use? | paragraph | optional | troubleshooting table, "what didn't work" |
| 9 | Which template or capability is missing for your team? | paragraph | optional | template requests, Phase 3 |
| 10 | Rank what you'd want next | ranking / checkboxes | Visual check of decks before sharing · Accessibility checks (contrast, focus) · Jira tickets from Design QA findings · More templates for my team · Other | Phase 3 candidates (`phase2-retro.md` §4) |
| 11 | Anything else? | paragraph | optional | retro §2 |

## Form B: 7-day version check

Send to the design team 7 days after each release (the release date is on the
[releases page](https://github.com/hjkimkk/cochl-presentation-skills/releases)).

| # | Question | Type | Options / note |
|---|---|---|---|
| 1 | Your name | short text, required | so each person counts once |
| 2 | Which version does `claude plugin list` show for `cochl-design`? | short text, required | e.g. `2.1.1` |
| 3 | If it isn't the latest, what happened? | single choice | Auto-update off · Didn't restart Claude Code · Update failed · Don't know |

**How to read it:** the metric is met for a release when every design-team answer shows that
release's version (or a newer one) within 7 days of the release date. Record the count per release
in the retro, e.g. "v2.1.1 (Oct 20): 4/4 by Oct 27".

| Release | Released | Check date (+7 days) | Result |
|---|---|---|---|
| v2.1.0 | 2026-10-15 | 2026-10-22 | |
| v2.1.1 | 2026-10-20 | 2026-10-27 | |

## Message to send with form A (after the town hall)

> Thanks for joining. Two minutes of feedback helps us decide what to build next:
> [form A link]
> Help and install steps: https://hjkimkk.github.io/cochl-presentation-skills/
