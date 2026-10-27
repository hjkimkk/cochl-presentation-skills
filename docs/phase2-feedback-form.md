# Phase 2 feedback form

Two short forms on one page, live since Oct 22, 2026:

- **Form A, town hall feedback:** https://claude.ai/artifact/7k5KPhmsLDRnWN3ZD46VDg#feedback
- **Form B, version check:** https://claude.ai/artifact/7k5KPhmsLDRnWN3ZD46VDg#version-check

Each answer is saved under the person's Claude account (one per person; they can update it). Only the
page owner sees the Results tab. To let people submit, share the page with the organization as
**Contributor** (Viewers can open it but not send). Form A's link is on
[town hall deck](./phase2-townhall-deck.html) slide 21 and goes in the follow-up message after the town hall.
The questions below are what the page asks.

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
| 1 | Which version does `claude plugin list` show for `cochl-design`? | short text, required | e.g. `2.1.1`. Each person counts once: answers are tied to their Claude account |
| 2 | If it isn't the latest, what happened? | single choice | It is the latest · Auto-update is off · Didn't restart Claude Code · The update failed · Don't know |

**How to read it:** the metric is met for a release when every design-team answer shows that
release's version (or a newer one) within 7 days of the release date. Record the count per release
in the retro, in the form "vX.Y.Z (release date): 4/4 by check date".

Checks start with the **first release after the town hall** (late November), when everyone has
installed the plugin with auto-update on. The October releases are not checked: the forms didn't
exist yet and most people hadn't installed. Add a row per release from then on.

| Release | Released | Check date (+7 days) | Result |
|---|---|---|---|
| first release after the town hall | | | |

## Message to send with form A (after the town hall)

> Thanks for joining. Two minutes of feedback helps us decide what to build next:
> [form A link]
> Help and install steps: https://hjkimkk.github.io/cochl-presentation-skills/
