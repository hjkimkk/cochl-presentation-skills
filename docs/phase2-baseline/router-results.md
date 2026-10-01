# Router check — /cochl-design (skills/cochl-design/SKILL.md @ ebb6ec6)

One agent saw only the router SKILL.md and answered all 12 cases (ruling R15).

| # | Expected | Got | |
|---|---|---|---|
| 1 | cochl-presentation | cochl-presentation · plex | ✓ |
| 2 | cochl-presentation | cochl-presentation · plex | ✓ |
| 3 | cochl-presentation (pt-template) | cochl-presentation → decks/pt-template · pt-template | ✓ |
| 4 | cochl-presentation (pt-template) | cochl-presentation → decks/pt-template · pt-template | ✓ |
| 5 | design-review | design-review · plex | ✓ |
| 6 | design-review | design-review · plex | ✓ |
| 7 | proposal-doc | proposal-doc · plex | ✓ |
| 8 | proposal-doc | proposal-doc · plex | ✓ |
| 9 | design-system | design-system · @cochlearai/ui tokens | ✓ |
| 10 | design-sync | design-sync · n/a | ✓ |
| 11 | ASK (one multiple-choice question) | ASK — one question listing the six rows (a–f) | ✓ |
| 12 | design-review first, then offer proposal-doc | design-review first; offer proposal-doc after; never both at once | ✓ |

**Result: 12/12.** Case 4 ("Century Gothic pitch deck") still routes to pt-template even though the table no longer names the font.
