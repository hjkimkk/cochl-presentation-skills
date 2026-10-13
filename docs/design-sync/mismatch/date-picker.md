# Date picker: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-13
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `1439:1380` "Date picker"
  - `Date picker` `2447:6741`: 10 variants. theme Dark | Light × style day of month | custom | month of year | year over year × state default | hovered.
  - `date range days` `2447:7072`: 10 variants. theme × state default | hovered | selected × range none | start | end.
  - Two `Header` sets: `2447:6728` (previous / next / theme) and `2845:3965` (period / style / color).
  - Loose component `7529:3604` "Date picker/Light/day of month/default".
  - Usage frames: `Calendar_Usage` ×4, `/Light`, `/Dark`.
- **Code:** the real date picker isn't in `@cochlearai/ui`. It's in **`@cochlearai/calendar`** (`packages/cochl-calendar`):
  - `Calendar`: `react-dates` `DayPickerRangeController` restyled with theme tokens, plus a bottom bar for inputs/buttons;
  - `MonthYearPicker`: a custom 4-column grid;
  - `DayPickerRangeControllerInputs`, `DayPickerRangeControllerPopover`, `CalendarBottomButtons`.
- **Storybook:** `@cochlearai/calendar` has **no stories**. The only story is `cochl-ui/stories/data-display/DatePicker.stories.tsx` (`Data Display/Date picker`: `default`, `active`). It's a **static mock** built from `@cochlearai/ui` primitives; its own docs note says production uses `@cochlearai/calendar`.

## 1. Day of month (the main style)

| Property | Figma L / D | `@cochlearai/calendar` `Calendar` | Story mock | Result |
|---|---|---|---|---|
| Panel | 402×477, `white`, r4 | `white`, r4, min-height 352 | 402 wide, `white`, r4, **shadow** | code ✓; story adds a shadow |
| Month title | 16/24 Regular, `black` | 16/24, `black` | `Typo body` (14/20) | code ✓; story ✗ |
| Weekday labels | 12/15, #e5e5e5 (`grey[30]`) | 12/15, `grey[30]` | 10px, `grey[60]` | code ✓; story ✗ |
| Day text | 12/15, `black` | 12/15, `black` | 12/15, `black` | ✓ |
| Outside / disabled days | #b2b2b2 (`grey[50]`) | blocked `grey[50]`; outside `grey[30]` | `grey[50]` | ≈ |
| Selected (single / start / end) | 32px `blue[60]` circle, text `white` | text `white`; circle not set in this wrapper (react-dates default; needs checking in the app) | 32px `blue[60]` circle | story ✓; code unverified |
| In-range days | **square band** `grey[10]` (#f9f9fa / #171717), text `blue[60]` | `grey[10]` band, text `blue[60]` | **circles** `grey[20]`, text `black` | code ✓; story ✗ |
| Hovered day | `grey[10]` square + `blue[60]` text | `white` + `blue[60]` text | `blue[60]` text only | ✗ both (no grey hover square) |
| Inputs | 2 × 169×30 at the **bottom**, placeholder `mm / dd / yyyy`, r4, fill `white` / #18191a | `renderInputComponents` slot in the bottom bar ✓ | at the **top**, filled with date + time | story ✗ |
| Buttons | none in day of month; **custom** has `Cancel` (grey) then `Confirm` (blue) at bottom right | `renderButtonComonents` slot, `row-reverse` | `Confirm` then `Cancel` (order reversed) | story ✗ |
| Row height | ~49px per week row (402×477 panel) | react-dates cell size | 32px cells + 4px gap (shorter panel) | story ✗ |

## 2. Other styles

| Figma style | Code | Story |
|---|---|---|
| month of year (402×196: 4-col grid, items 41×32 r2, selected `blue[60]`) | `MonthYearPicker`: 402 wide, items 41×32 r2, selected `blue[60]`, title `h5` 16/24 ✓; arrows `grey[70]` (Figma `grey[80]`) | — |
| year over year (402×243) | `MonthYearPicker` with year values ✓ | — |
| custom (618×351: two months + inputs + Cancel 14 Medium `grey[80]`) | `Calendar` with 2 months + `CalendarBottomButtons` | — |
| date range days (cell 50×49) | react-dates cells | `DayCell` 32 + grid gap |

## 3. Issues

### Storybook
- **The real component isn't documented:** `@cochlearai/calendar` has no stories at all. The cochl-ui story is a hand-built mock that differs from both Figma and the real `Calendar`:
  - in-range circles instead of a band;
  - 14px title;
  - 10px weekdays;
  - an extra shadow.
- **The mock's trigger isn't a Figma Date picker part:** it's the Dropdown "Time Picker" trigger (15m badge).
- **No stories** for month of year, year over year, or custom.

### Code
- **Hover:** `CalendarDay__default:hover` keeps a `white` background. Figma shows a `grey[10]` square.
- **Selected circle:** the wrapper only sets the text colour. The blue circle must come from elsewhere (react-dates default is teal), so check it in the client.
- **Arrows:** `MonthYearPicker` arrows are `grey[70]`; Figma uses `grey[80]`.

### Figma
0. **Content typo:** "month of year" shows "Feb" twice; the third month should be "Mar".
1. **Invisible backspace characters** in property names and values: `\bprevious` (Header `2447:6728`), `\bcustom` and `\bmonth of year` (Date picker `2447:6741`). This is the same problem as Card's `\bsize` / `\bm`.
2. **Incomplete matrix:** custom, month of year and year over year exist only as `hovered`. There are no `default` variants for them.
3. **Duplicates:**
   - two different `Header` sets;
   - a loose component `7529:3604` that duplicates the Light day-of-month variant.
4. **Dark range-day colour:** Dark `range=none` default day text is #e5e5e5, the Light `grey[30]`. It should be a Dark token (white/`black`).

## 4. Suggested fix
- **Storybook:** add stories for the real `@cochlearai/calendar` components that mirror the Figma styles:
  - day of month, custom (two months), month of year, year over year;
  - each in default and hovered.
  - This can be a small Storybook in `packages/cochl-calendar`, or calendar stories inside the cochl-ui Storybook (a dev-only import, since calendar depends on ui).
  - Then retire the cochl-ui mock, or rename it to the Time Picker trigger it actually shows.
- **Code:**
  - `Calendar` hover → `grey[10]` background;
  - set the selected circle explicitly to `blue[60]`;
  - `MonthYearPicker` arrows → `grey[80]`.
- **Figma (NS):**
  - retype the three `\b` names;
  - add default variants;
  - merge the two Header sets;
  - archive `7529:3604`;
  - fix the Dark day colour.
