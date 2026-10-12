# Popover: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-12
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `3751:1864` "Popover v1"
  - `PopoverList` `3752:305`: theme Light | Dark × type Default | Divider | RightButton | LeftButton.
  - `PopoverItem` `3752:407`: theme × state Default | Selected; TEXT `Text`.
- **Code (`beta` @ `083f601`):**
  - `src/Popover/Popover.tsx`: wrapper around `react-tiny-popover` that only styles the floating container.
  - No PopoverList or PopoverItem component. The list is built in the story from `DropdownItem` + `MenuDivider` + a story-only `PopoverListContainer`.
- **Storybook:** `stories/feedback/Popover.stories.tsx`, title `Form/Popover`: `form-popover--popover-item`, `form-popover--popover-list`. Checked on the live site (built from `main`).
- **App usage of `Popover`:**
  - `AllTagPopover`
  - `ProfilePopover`
  - `NotificationPopover`
  - `ResultFeedbackButton`
  - `AnalyticsFileSource`

## 1. Coverage

| Figma | Code | Storybook |
|---|---|---|
| PopoverItem Default | `DropdownItem` | `popover-item` DEFAULT |
| PopoverItem Selected | — (only `:hover` grey[20]; no selected prop) | `popover-item` ACTIVE (story-styled copy) |
| PopoverList Default | story-only `PopoverListContainer` | `popover-list` DEFAULT |
| PopoverList Divider | `MenuDivider` (from Menu) + story margin | `popover-list` DIVIDER |
| PopoverList RightButton / LeftButton | `<Popover align="end"/"start" padding={6}>` around a `Button` | `popover-list` RIGHT-BUTTON / LEFT-BUTTON |
| Dark | theme tokens | not viewable until #462 |

## 2. Values

| Property | Figma L / D | Code | Result |
|---|---|---|---|
| List fill | #ffffff / #1c1d1e | `white` | ✓ |
| List radius | 4 | 4 | ✓ |
| List shadow | 0 0 5 `#989898` @30% (both themes) | `0px 0px 5px rgba(152,152,152,.3)` **hard-coded**, both in `Popover.tsx` and the story | ✓ value; ✗ not a token (theme has `shadow`: L #989898 / D #131313) |
| List padding | 8 top/bottom, 0 sides | story: `padding: 8px 0` | ✓ (story only) |
| List width | hugs content (101), or 195 under a button | story `min-width: 200px`, and **stretches to full width** live | ✗ |
| Item padding / height | 8/16, 36 high | `DropdownItem` 8/16 | ✓ |
| Item text | 14 Regular, L #131313 / D #ffffff | `Typo body` (14/20), `black` | ✓ |
| Item Selected fill | L #f1f1f2 / D #242526 (`grey[20]`) | `:hover` → `grey[20]`; no selected state | ≈ colour matches; state missing |
| Divider | 1px `grey[20]` (L #f1f1f2 / D #242526), 8px above/below, inset 1px | `MenuDivider` 1px `grey[20]`, full width; story adds `margin: 8px 0` | ✓ (story only) |
| Button → list gap | 6 | `padding={6}` | ✓ |
| Button | Primary / Basic (72×41) | unsized `<Button color="primary">` → **16px-high full-width bar** live | ✗ (use `size="basic"` after #460) |
| Right / Left alignment | list aligned to the button's right / left edge | `align="end"` / `"start"` | ✓ intent; ✗ live: the RIGHT-BUTTON list overlaps the LEFT-BUTTON section |

## 3. Issues

### Figma
1. **Dark PopoverList is built from Light items:** its items are instances of `PopoverItem theme=Light`, recoloured by overrides.
2. **Same shadow in both themes:** Dark uses `#989898` @30%; the Dark `shadow` token is `#131313`. Decide whether the Dark shadow should differ.
3. **No hover state:** code uses a grey[20] hover, the same colour as Selected.

### Code
1. **No library components for the list or the item:** apps rebuild the list from `DropdownItem` + `MenuDivider` (a Menu export), with their own container padding/width.
2. **No selected state:** `DropdownItem` has no `selected` prop, so "Selected" is only a story style.
3. **Hard-coded shadow** in `Popover.tsx` instead of the `shadow` token.

### Storybook
1. **Layout bugs on the live site:**
   - the lists stretch to full width;
   - the buttons render as thin full-width bars;
   - the right-aligned popover overlaps the next section.
2. **Naming and links don't line up:**
   - The title is `Form/Popover`, but the file lives in `stories/feedback/`.
   - The `@see` link points at `feedback-popover--default`, which doesn't exist.
   - The Figma link points at node `3117-3627` in the old file (that area is Tooltip), not `3752:305` / `3752:407`.
3. **State name differs:** "ACTIVE" in the story vs "Selected" in Figma.

## 4. Suggested fix (code + stories, no visual change for app popovers)
- Add **`PopoverList`** (container: white, radius 4, shadow token, 8px vertical padding, hug width) and **`PopoverItem`** (8/16, 14 Regular, `selected` prop → grey[20], hover grey[20]) to `@cochlearai/ui`. `PopoverItem` can wrap `DropdownItem` so existing dropdowns are untouched.
- Add a **`PopoverDivider`** (1px grey[20] with 8px margins), or document `MenuDivider` + margin.
- Use the `shadow` token in `Popover.tsx` (light is unchanged; dark becomes `#131313` unless design says otherwise).
- Stories:
  - mirror the Figma sets (Item Default/Selected; List Default/Divider/RightButton/LeftButton) with hug width;
  - use a `size="basic"` Button and fixed-height sections so the popovers don't overlap;
  - Figma links to `3752:305` / `3752:407`;
  - fix the `@see` link.
- **Design (NS):** rebuild the Dark list from Dark items; decide the Dark shadow; add a hover state if it should differ from Selected.
