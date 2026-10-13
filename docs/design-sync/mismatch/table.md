# Table: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-13
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `16:2873` "Table v1"
  - `Table` `2068:308`: theme Light | Dark × type Basic × state Default. A 1280×340 example: columns of 210px, built from header + body instances.
  - `Table_Header` `2068:319`: theme × Basic × Default; TEXT `Text`.
  - `Table_Body` `2071:158`: 17 variants. theme × type Button | Basic | Secondary | Chip × state Default × isLastItem true | false. **The set is in an error state** (see §4).
  - Frame `Data table` `7899:1751`: a 1140×340 usage example (Header 1–4; Content / long content / grey Content / blue Button columns).
- **Code (`beta` @ `55a4cd4`):** `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell` (`th` | `td`). All of them are **unstyled semantic wrappers** (only `display: table-*`, `border-collapse`). No padding, colours, typography or borders.
- **Storybook:** `stories/data-display/Table.stories.tsx`: one story `data-display-table--default` (3 columns × 4 rows). All styling is defined inside the story.

## 1. Values (Figma vs the story's styles)

| Part | Figma L / D | Story (`Default`) | Result |
|---|---|---|---|
| Header cell fill | #f1f1f2 / #111112 | `semantic.grey[20]` (#f1f1f2 / #111112) | ✓ |
| Header cell padding / height | 12/20, 40 high | 12.5px 20px (→ 40) | ✓ |
| Header text | 12/15 SemiBold, #131313 / #ffffff | 12/15 600, `black` | ✓ |
| Body cell padding / height | 20, 60 high | 20, 60 | ✓ |
| Body fill | #ffffff / #1c1d1e | `white` | ✓ |
| Row divider | 1px bottom #f1f1f2 / #111112 | 1px `semantic.grey[20]` between rows | ✓ |
| **Last row** | `isLastItem=true`: **no** bottom divider | story **adds** a bottom border on `:last-child` | ✗ (Figma's own "Data table" example shows a bottom line, so Figma contradicts itself) |
| Body type **Basic** | 14/20 Regular, #131313 / #ffffff | `Typo body`, `black` | ✓ |
| Body type **Secondary** | 14/20 Regular, #8c8c8c / #73787a (`grey[70]`) | — | ✗ not shown |
| Body type **Button** | 14 Medium, `blue[60]` (#4b68ff / #4057d0) | — | ✗ not shown |
| Body type **Chip** | tag chip, `blue[60]` @5% (L) / @10% (D), radius 74 | — (`Chip variant="tag"` matches, radius 100) | ✗ not shown |
| Selected row | — (not in Figma) | `semantic.grey[10]` fill on the first row | ✗ story-only state |
| Column width | 210 (Data table: varies) | 100px per cell | ≈ layout |

## 2. Code
- **No styling in the components:** every consumer restyles the header cell, body cell, divider and text. The story is the only "spec" in code, and it lives outside the library.
- **No cell type:** no Basic / Secondary / Button / Chip cell variants, no header cell style, no `isLastItem` handling.
- **Typography in the story:** the header text is restyled with raw `font-weight/size/line-height` instead of a Typo variant (`caption2` is exactly 12/15 600).

## 3. Storybook
- **Only one story:** Basic text cells only, plus a "selected" row that isn't in Figma.
- **Old link format:** the Figma link points at `2068-308`, which is correct, but in the old "Dashboard_Design_System_v3" URL format.
- **No examples of** the Secondary, Button or Chip cell types, or of the "Data table" usage frame.

## 4. Figma issues
1. **`Table_Body` is broken:** two variants have the identical name `theme=Dark, type=Basic, state=Default, isLastItem=true` (`3129:10755` and `7527:1219`). Figma flags the whole set as erroring: variant properties can't be read, and swapping instances by property is unreliable. Delete or rename one.
2. **Inconsistent padding:**
   - Dark `Button` body cells use 20px padding while Light uses 12/20;
   - Dark `Secondary` uses 12/20 while Light uses 20;
   - Light `Chip` cells have no `isLastItem=false` stroke on the outer frame (the stroke is on an inner frame).
3. **Chip radius:** 74 vs the library `Chip` 100 (both are pills at 24px height, so visually the same).
4. **Last-row border contradiction:** `isLastItem=true` has no bottom divider, but the "Data table" example shows one under the last row.
5. **`Table` set is only a demo:** it's a 1280×340 composed example, not a reusable component (same as the "Data table" frame).

## 5. Suggested fix
- **Code (additive, existing tables unchanged):**
  - `TableHeaderCell`: 12/20 padding, `semantic.grey[20]` fill, `caption2` text.
  - `TableBodyCell` with `type?: "basic" | "secondary" | "button"`: 20px padding, 60 high, text colour/weight per Figma.
  - `TableRow` divider: 1px `semantic.grey[20]` between rows, with the last-row rule per design's answer.
  - For chips, document using `<Chip variant="tag">` inside a body cell.
- **Stories:** mirror `Table_Header` / `Table_Body` (all 4 types, isLastItem) plus the "Data table" example. Drop the story-only selected row unless design adds it. Fix the Figma link.
- **Design (NS):**
  - remove the duplicate Dark Basic `isLastItem=true` variant (`7527:1219` or `3129:10755`);
  - align the Dark/Light paddings;
  - decide the last-row divider.
