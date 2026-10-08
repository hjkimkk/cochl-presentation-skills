# Design-system mismatch audit: Figma ↔ GitHub ↔ Storybook

- **Date:** 2026-10-08
- **Sources:**
  - Figma `Cochl Design System` (`aUrjRMAnE8ND8o6lAI0VcM`, 38 pages), read-only Plugin API
  - `cochlearai/cochl-dashboard` @ `80da7dd`: `packages/cochl-ui` (library and stories) and `packages/client` (app)
  - dashboardstorybook.cochl.ai
- **Detail files:** [form](form.md) · [data-display](data-display.md) · [feedback-overlay](feedback-overlay.md) · [navigation-icons](navigation-icons.md) · [foundations](foundations.md). Each file has, per component: Figma variants, code props, story ids, the inferred Figma→code mapping (input for `mapping.json`), and a mismatch table.

## Totals

| Group | Components | High | Medium | Low |
|---|---|---|---|---|
| Form | Button, Input Field (+TagChipInput), Number Input, Checkbox, Radio, Dropdown, Popover | 9 | 25 | 20 |
| Data display | Card, Chip, Table, Date picker, CodeView, UsageBar | 10 | 20 | 13 |
| Feedback / Overlay | Alert, Progress, Skeleton, Menu, Tooltip, Modal | 9 | 22 | 16 |
| Navigation / Icons | Tabs, Navigation (GNB/LNB/FNB/ProjectNavi), Accordian, UserProfile, Icons | 9 | 18 | 13 |
| Foundations | Color, Typography, Spacing | 7 | 14 | 8 |
| **Total** | **~30** | **44** | **99** | **70** |

## Five patterns behind most High findings

### 1. Figma variants live only in story files, not in the library (13 High)
The library ships bare components. The Figma look is rebuilt inside each story with styled overrides, so apps can't get it from the library.
- **Button:** sm/md/lg sizes
- **Dropdown:** sm and timePicker fields
- **Popover:** List and Item
- **Card:** 5 types and 3 sizes
- **Table:** all styling, plus the Button, Secondary and Chip rows
- **Modal:** "with subtitles and cta"
- **Date picker:** not in `@cochlearai/ui` at all; it lives in a separate `@cochlearai/calendar` package

→ **Fix in code:** promote these to props or components in `cochl-ui`.

### 2. Dark theme can't be rendered from code (8 High)
Figma has Light/Dark for almost everything. The code hard-codes colours or has no theme branch:
- **Checkbox and Radio:** `#4b68ff`, `#e5e5e6`
- **Tooltip:** always a dark `grey[90]` box
- **Navigation containers:** always white
- **Icons:** `#131313`
- **Toast:** hard-coded hex values

This also breaks the repo rule "no hardcoded colors".
→ **Fix in code:** read colours from theme tokens.

### 3. Figma states and props the code can't express (10 High)
- **Interaction states:** Dropdown `disabled`/`Focus`; Tabs `Focus` (TabItem isn't keyboard-focusable); Chip Tag chip `Active`
- **Variants with no matching prop:** Radio `withLabel=false`; Tooltip corner placements (code has no `align`); HyperlinkButton disabled/hover
- **Responsive sizes:** Navigation `xl` down to `mobile` (code is fixed to `lg`)
- **Icon options:** NotificationBell `notifOn` (code always draws the dot); UserIcon `type`

The reverse also happens: code `ProjectNaviItem disabled` has no Figma design.

### 4. Components on one side only (9 High)
| Exists only in | Components |
|---|---|
| Code | `Accordian`, `CodeView`, `UsageBar`/`UsageBarContent`, `Banner`, `UserProfile` (Figma has only loose layers) |
| Code, and only in the app (`packages/client`) | `TypeSelectButton`; the delete-project, webhook, device and price-plan modals |
| Figma | Progress `Small` linear bar; Menu trigger (undefined on both sides); Date picker month-of-year and year-over-year styles |

### 5. Foundations drift (7 High)
- **Light grey:** Figma Light `semantic.grey` 10/20 holds the **dark** values. The code is right; Figma needs fixing.
- **Semantic colours:** Success, Warning and Information appear only as text on the Figma Color page; there is no style and no code token.
- **Analytics palette:** the Figma page, the Figma variables and the code all differ.
- **Variables:** Figma variables are not the token source. The styles are; the variables have no Light/Dark modes.
- **Text styles:** `body_title` and `caption 4` exist only in Figma.
- **Spacing:** neither side has spacing tokens.

## Cross-cutting low-effort fixes
- **Stale links:**
  - Several JSDoc `@see` links in the code use story ids that don't exist, e.g. `actions-button--*` and `feedback-popover--default`. This explains YJ's report that the Storybook links on Button, Input and Table don't work.
  - Story `design.url` links are wrong in two places: the Icons story points to a Button node, and UsageBarContent points to a Button instance.
- **Typos:**
  - Code: `Accordian`, testid `user-pofile`
  - Figma: "FiiledActive"; Tabs and Radio spec frames are misnamed
- **Story titles:** Modal, ConfirmModal, Tooltip and Menu sit under `Overlay/*`, while `Feedback/Alert` mixes Toast, Banner and the Notification bell. Align the titles with the Figma families.

## Corrections to earlier notes
- The Figma file has **38 pages**, not 15. Modal, Card, Navigation, Skeleton, Number Input and Popover **do** exist in Figma. Charts (Heatmap, Timeseries, PieChart, Barchart) have pages, but only private part components (names starting with ".").
- `mapping.json` `Alert → Toast` is correct (Figma Alert = toast). Toast `severity="info"` corresponds to Figma `state=Success`.

## Not verified (see detail files)
- **Line numbers:** the GitHub reader returns none, so code evidence is cited by file and symbol.
- **Story ids:** taken from titles in some groups, not from the live `index.json`.
- **Table:** Figma's component-property API fails on the Table sets ("existing errors"), so their variants were read from child names.
- **Two Figma details are unconfirmed:** the Alert close icon and the Logout row in UserMenu.
