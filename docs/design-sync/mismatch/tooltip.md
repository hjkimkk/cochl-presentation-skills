# Tooltip: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-13
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `27:446` "Tooltip v1", set `Tooltip` `3117:3637`: 16 variants.
  - theme Light | Dark × type top-left | top-middle | top-right | bottom-left | bottom-middle | bottom-right | side-left | side-right.
  - TEXT `Text`.
- **Code (`beta` @ `55a4cd4`):** `src/InfoTooltip/InfoTooltip.tsx`: `react-tiny-popover` + `ArrowContainer`.
  - Props `open`, `text`, `position` top | bottom | left | right, `onMouseOver/Out`, `children` (trigger; default 20px `InfoIcon` in `grey[50]`).
- **Storybook:** `stories/feedback/InfoTooltip.stories.tsx`, title `Overlay/Tooltip`, one story `overlay-tooltip--default`: closed until hovered.

## 1. Values

| Property | Figma L / D | Code | Result |
|---|---|---|---|
| Fill | #333333 / #ffffff (`grey[90]`) | `grey[90]` | ✓ |
| Text | 14/20 Regular, #ffffff / #1c1d1e (`white`) | `Typo body` 14/20, `white` | ✓ |
| Padding / radius | 16 / 4 | 16 / 4 | ✓ |
| Width | 280 (top/bottom), 451 (side; one line) | `max-width: 286px` | ≈ (side tooltips wrap at 286 instead of staying one line) |
| **Shadow** | `0 0 5px #989898` @30% | none (`boxShadow: unset`) | ✗ |
| Arrow | 10×10 square rotated 45°, sticking out ~7px | `arrowSize={6}` triangle | ≈ |
| **Arrow alignment** | left / middle / right: arrow **23px** from the box edge for left/right | `align="center"` only; arrow always centred | ✗ no left/right variants |
| Placements | top-*, bottom-*, side-left, side-right | `position` top / bottom / left / right | ✓ (×3 alignment missing) |

## 2. Storybook
- **One story, closed by default:** it opens only on hover, so the docs page and Chromatic show just the info icon. None of the 8 Figma placements is visible.
- **Wrong doc link:** the `@see` link in the code is `feedback-info-tooltip--default`; the real story id is `overlay-tooltip--default`.
- **Old Figma link:** it uses the old file URL and the top-left variant (`3117-3627`), not the set `3117:3637`.

## 3. Figma
- **Small inconsistencies:**
  - the Light top-left arrow is 9×9 (the others are 10×10);
  - the Dark side-right arrow inset is 19px (Light 23px).
- **Unclear naming:** `top-middle` means the arrow (and so the trigger) is on top, i.e. the tooltip opens **below** the trigger. It's the opposite of the code's `position="top"`, which opens **above**. Agree one convention.

## 4. Suggested fix
- **Code (backward compatible):**
  - add the Figma shadow;
  - add `align?: "start" | "center" | "end"` with the arrow 23px from the edge;
  - let side tooltips use `max-width: 451px`;
  - fix the `@see` link.
- **Stories:** one story per Figma type (`top-left` … `side-right`), rendered **open** so docs and Chromatic show them, in both themes; Figma link to `3117:3637`.
- **Figma (NS):** align the arrow sizes and insets; confirm the naming convention (arrow side vs opening side).
