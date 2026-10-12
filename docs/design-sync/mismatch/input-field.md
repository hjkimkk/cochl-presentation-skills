# Input Field: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-12
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `52:720` "Input Field v1", component set `1174:283` `Input Field`, 50 variants.
  - Axes: theme Light | Dark; type Basic | withIcon | SmallwithIcon (renamed from `smIcon` on 2026-10-12) | TagChipInput | NonEditable; state Default | Focus | Active | Filled | Error | DefaultLabel | smDesc | withIcon | bigLabel; isDisabled true | false.
  - Properties: `Text`, `Label`, `undertext` (TEXT), `icon` (INSTANCE_SWAP).
- **Code:** `cochlearai/cochl-dashboard` `beta` @ `083f601`, `packages/cochl-ui`: `src/Input/Input.tsx`, `src/TagChipInput/TagChipInput.tsx`, `src/Chip/Chip.tsx`, `src/lib/globalStyle.ts` (Typo sizes).
- **Storybook:** `stories/form/Input.stories.tsx` (`Form/Input Field`). The Chromatic build needs a Chromatic login, so the stories were compared from source; Dark comes from the Chromatic theme modes.

Values: L = Light, D = Dark. Token names are `theme.colors.*`. ✓ = matches, ✗ = differs, — = not present.

## 1. Variant coverage

| Figma type × state | Figma | Storybook story / cell | Code API |
|---|---|---|---|
| Basic / Default, Focus, Active, Filled, Error, Disabled | ✓ | `basic`: all six (Focus/Active mocked with a CSS wrapper) | `<Input>`, `validated={false}` + `error` for Error |
| Basic / DefaultLabel | ✓ | `basic` "Default with label" | `label` |
| Basic / bigLabel | ✓ | `big-label` | `label` + `labelGap={10}` |
| withIcon / Default, Disabled | ✓ | `with-icon`: Default only | `rightIcon` |
| SmallwithIcon / Default, Focus, Active, Disabled, smDesc | ✓ | `small-with-icon`: all five | `size="small"` + `leftIcon` + `description` |
| TagChipInput / Default, Focus, Disabled, Active, DefaultLabel | ✓ | `tag-chip-input-story`: all five (Focus = copy of Default) | `<TagChipInput>` |
| NonEditable / Default, Focus, Active, Disabled, withIcon | ✓ | `non-editable`: all five (Focus = copy of Default) | `readOnly` |
| — | not in Figma | — | `validated={true}` (blue border), `error` message text |

Missing in Storybook: withIcon Disabled. Missing in Figma: Error for withIcon, SmallwithIcon, TagChipInput; the error message; the "validated" state.

## 2. Basic, withIcon, Filled, Error, Disabled

| Property | Figma L | Figma D | Code | Result |
|---|---|---|---|---|
| Height / padding | 60, pad 20 | 60, pad 20 | input pad 20, line-height 20 → 62 incl. border | ✓ (±2px border) |
| Radius | 4 | 4 | 4 | ✓ |
| Fill | #ffffff | #1c1d1e | `white` (L #ffffff, D #1c1d1e) | ✓ |
| Border, Default | #e5e5e5 | #303233 | `grey[30]` | ✓ |
| Border, Focus | #131313 (+ caret) | #303233 (no change) | `black` on `:focus-within` (D #ffffff) | ✓ L; ✗ D (Figma Dark Focus doesn't change) |
| Border, Active | #131313 | #ffffff | `black` | ✓ |
| Border, Filled | #e5e5e5 | **#ffffff** | `grey[30]` | ✓ L; ✗ D (Figma Dark Filled is white: inconsistent with Light) |
| Border, Error | #e02e2e | #b54444 | `red` (via `aria-invalid="false"`) | ✓ colour; ✗ semantics, see §6 |
| Disabled | opacity 0.4, border #e4e4e5 | opacity 0.4 | opacity 0.4, border `grey[30]` | ✓ (Figma #e4e4e5 is a non-token near-duplicate) |
| Placeholder | 14 Regular #a5a5a6 | #6a6e70 | `grey[60]` (L #a5a5a6, D #6a6e70) | ✓ |
| Value text | 14 Regular #131313 | #ffffff | `black` | ✓ |
| Error message | — | — | `caption3` 10px `red`, 5px below | ✗ code only |
| Right icon (withIcon) | 20px cancel icon, 20 from right | same | `RightIconSlot` margin-right 20 | ✓ |

## 3. Labels and description

| Property | Figma | Code | Result |
|---|---|---|---|
| DefaultLabel text | 16 Regular, #000000 (L) / #ffffff (D), gap 4 | `caption1` = 12/15 Regular, `black`, gap 4 | ✗ size 16 vs 12; Figma #000000 isn't a token (`black` = #131313) |
| bigLabel text | 18 **Medium**, gap 10 | `caption1` 12 Regular, `labelGap={10}` | ✗ size and weight (Figma 18 Medium = `h4`) |
| smDesc (description) | 10 Regular, L #727273 / D #73787a (`grey[80]`), right-aligned, 4px below | `caption1` 12 Regular, `grey[60]`, right-aligned, 4px below | ✗ size 10 vs 12, colour `grey[80]` vs `grey[60]` |

## 4. SmallwithIcon

| Property | Figma | Code (`size="small"`) | Result |
|---|---|---|---|
| Height | 31 | pad 8 + line 20 → ~38 | ✗ |
| Left inset to icon | 20 | 8 (`LeftIconSlot` margin-left 8) | ✗ |
| Icon | 12px search | 12px (story) | ✓ |
| Icon → text gap | 8 | 8 | ✓ |
| Text size | 12 Regular / line 15 | inherits 14 / line 20 | ✗ |
| Placeholder | L #8c8c8c (`grey[70]`), D #6a6e70 (`grey[60]`) | `grey[60]` | ✗ L (`grey[70]` vs `grey[60]`); ✓ D. Figma uses different tokens per theme. |
| Border Default / Active | #e5e5e5 → #131313 (L); #303233 → #ffffff (D) | `grey[30]` → `black` | ✓ |
| Focus | same as Default (no border change) in both themes | `black` border on focus | ✗ Figma Focus ≠ Basic Focus |

## 5. NonEditable

| Property | Figma L | Figma D | Code (`readOnly`) | Result |
|---|---|---|---|---|
| Fill | #f9f9fa | #171717 | `grey[10]` | ✓ |
| Border | **none** | none | `grey[30]` 1px | ✗ |
| Text | #727273 (`grey[80]`) | Default #73787a, others **#727273** | `black` | ✗ code; Figma Dark uses the Light hex on 4 of 5 states |
| Focus / Active | same as Default | same (hidden outer fill #73787a / #727273 under the rect) | `:focus-within` → `black` border | ✗ |
| Disabled | no opacity change | none | opacity 0.4 | ✗ (Figma likely missing) |
| withIcon | cancel icon 20px; text layer "ket text" | same | `rightIcon` (story uses `CopyIcon`) | ? icon intent unclear |

## 6. TagChipInput

| Property | Figma | Code | Result |
|---|---|---|---|
| Field height / padding / gap | 30, pad 3/9, chip gap 4 | min-height 30, pad 3px 9px, gap 4 | ✓ |
| Field fill / border / radius | L #ffffff / #e5e5e5; D #1c1d1e / #303233; r4 | `white` / `grey[30]` / 4 | ✓ |
| Chip size | 24 high, pad 4.5/10, r100 | pad 4/10 + line 15 → 23, r100 | ✓ (±1px) |
| **Chip fill** | **blue[60] @ 5%** (L #4b68ff, D #4057d0) | `TagChip` forces `grey[20]` | ✗ The `Chip` `tag` variant already renders the Figma look (blue tint) but TagChipInput overrides it to grey. Dark tint: Figma 5%, `Chip` 10%. |
| Chip text | 12 Regular, L #131313 / D #ffffff | 12/15, `black` | ✓ |
| Focus | identical to Default | no focus style | ✓ (both static); story FOCUS duplicates DEFAULT |
| Disabled | **no visual change** | opacity 0.4 | ✗ (Figma likely missing the 0.4) |
| Active (expanded), Light | collapsed field + **separate bordered panel below** (pad 6/16, wrap, gap 4), "+20 more tags" | single container wraps in place, pad 3/16/6 | ✗ |
| Active (expanded), Dark | field itself grows to 58 and wraps (pad 3/9); no panel | same as above | ≈ (Figma Light and Dark disagree) |
| "+N more tags" | 12 Regular #989899 (no token) | `caption1` `grey[60]` #a5a5a6 | ✗ (Figma colour isn't a token) |
| **Label** | 12 Regular **outside** the field, left, 10 gap; L #000000 | `caption1` **inside** the bordered container, margin-left 16 | ✗ layout |
| **Right action** | separate **30×30 bordered button** (pad 6/8) with 14px filter icon, 10 gap after the field | `rightIcon` **inside** the container, margin-right 10; story uses a 20px icon | ✗ layout and icon size |
| Behaviour | not editable in Figma either (no caret/text) | display only, no `onChange` / `onRemove`; container `cursor: pointer` even though nothing is clickable | ✓ scope; ✗ cursor |

## 7. Code and story issues (independent of Figma)

1. **`aria-invalid` is inverted.** `validated={false}` (error) renders `aria-invalid="false"`, and `validated={true}` renders `aria-invalid="true"`. Screen readers announce valid input as invalid and stay silent on errors. The CSS selectors are inverted in the same way, so the colours look right and hide the bug. `NumberInput` copies the same pattern (`aria-invalid="false"` for error).
2. **Stale links:**
   - `@see` links use `form-input--basic` / `form-input--tag-chip-input`; the live ids are `form-input-field--*`.
   - Only the `basic` story has a Figma link, and it points at node `1174-266` in the old "Dashboard_Design_System_v3" URL, not the set `1174:283`.
3. **Mocked states:** Focus/Active are mocked with a CSS wrapper. Tag chip FOCUS and Non-editable FOCUS are copies of DEFAULT.
4. **Non-token colours in Figma:** label #000000, disabled border #e4e4e5, "+N more tags" #989899, Dark NonEditable text #727273 (Light `grey[80]`).

## 8. Figma structure issues

1. **`state` mixes states and layouts.** DefaultLabel, bigLabel, smDesc and withIcon are layouts, not states, so e.g. "Label + Error" or "Small + description + Focus" can't be picked. Recommended axes:
   - `type` (Basic | SmallwithIcon | TagChipInput | NonEditable)
   - `state` (Default | Focus | Active | Filled | Error | Disabled)
   - booleans `label`, `description`, `rightIcon`
   - variant `labelSize` (Default | Big)
   - drop `isDisabled` into `state`.
2. **Light vs Dark disagree:**
   - Basic Focus (Dark doesn't change the border)
   - Basic Filled (Dark border white)
   - TagChipInput Active (Light uses a panel, Dark grows in place)
   - SmallwithIcon placeholder token (`grey[70]` vs `grey[60]`)
3. **Missing:**
   - Error for withIcon, SmallwithIcon and TagChipInput
   - Disabled opacity for NonEditable and TagChipInput
   - the error message text
4. **Messy layers:** a text layer named "ket text"; hidden outer fills on Dark NonEditable Focus/Active; 3 nested wrapper frames around every TagChipInput.

## 9. Suggested split

- **Design (NS), first:**
  - decide the Dark Focus/Filled borders, the TagChipInput Active layout, the error message, and whether "validated" exists;
  - restructure the axes (§8.1);
  - replace the 4 non-token colours.
- **Code (Dev), safe now, all backward compatible:**
  - `aria-invalid` fix (Input and NumberInput);
  - label 16/Regular and big label 18/Medium;
  - description 10px `grey[80]`;
  - small size: 31 high, 20 inset, 12px text, focus behaviour per Figma;
  - NonEditable: no border, `grey[80]` text, no focus border;
  - TagChipInput: drop the grey override so chips use the `tag` blue tint, `cursor: default`;
  - fix the `@see` and Figma links.
- **Code, after design decisions:** TagChipInput label/action layout and expanded panel; error message and validated state.
- **Stories:** mirror the Figma matrix per type × state; add withIcon Disabled; link each story to `1174:283`.
