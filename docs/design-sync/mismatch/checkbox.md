# Checkbox: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-12
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `52:717` "Checkbox v1"
  - `Checkbox` `136:109`: 4 variants, isChecked True | False × theme Light | Dark, no other properties.
  - `Option` `136:179`: box + label, 4 variants, same axes, TEXT `Text`.
  - Doc frame `1390:443`: "0. Default" (box) and "1. Basic" (box + Text), gap 10.
- **Code:** `cochlearai/cochl-dashboard` `beta` @ `083f601`, `packages/cochl-ui/src/Checkbox/Checkbox.tsx`. Props `selected`, `label?`, `onChange?`, `className`, `style`.
- **Storybook:** `stories/form/Checkbox.stories.tsx`: one story `form-checkbox--default` (`selected: true`, toggles on click, no label). Live site checked; it is built from `main`.

## 1. Coverage

| Figma | Storybook | Code |
|---|---|---|
| Checkbox, isChecked=True | `default` (initial) | `selected` |
| Checkbox, isChecked=False | only after clicking `default` | `selected={false}` |
| Option (box + Text), True / False | **not shown** | `label` |
| theme=Dark | not viewable (no theme switcher until #462) | theme tokens |
| — (no Disabled, Focus, Hover, Indeterminate in Figma) | — | — |

## 2. Values

| Property | Figma Light | Figma Dark | Code (L / D) | Result |
|---|---|---|---|---|
| Box size / radius | 16×16, r2 | 16×16, r2 | 16×16, r2 | ✓ |
| Checked fill | #4b68ff | **#4b68ff** | `blue[60]` → #4b68ff / **#4057d0** | ✓ L; ✗ D: Figma Dark reuses the Light hex |
| Checkmark | 8×8 white vector | same | CSS tick 3×7, 1px white border, rotated 35° | ≈ shape differs slightly (CSS approximation, not the Figma vector) |
| Unchecked border | #e5e5e5 1px | **#e5e5e5** | `grey[30]` → #e5e5e5 / **#303233** | ✓ L; ✗ D: Figma Dark reuses the Light hex |
| Unchecked fill | none (transparent) | none | `white` → #ffffff / #1c1d1e | ≈ invisible on white/surface backgrounds; differs on grey backgrounds |
| Label | 14 Regular, #131313 / #ffffff | | `Typo body` 14/20, `black` | ✓ |
| Box → label gap | 10 | 10 | 10 | ✓ |
| Live site (`main`) unchecked border | | | #e5e5e6 | (main's older value; `beta` uses the token) |

## 3. Issues

### Figma
1. **Dark variants aren't dark:** checked fill #4b68ff and unchecked border #e5e5e5 are the Light values. Expected Dark tokens: `blue[60]` #4057d0, `grey[30]` #303233. Only the Option label switches to white.
2. **Option's unchecked variants link the wrong main:** they use the `isChecked=True` Checkbox instance with overrides that make it look unchecked. If the Checkbox main changes, Option False won't follow.
3. **Missing states:** no Disabled, Focus or Hover. Indeterminate is optional.
4. **Leftovers:** a 0-width `#f1f1f2` stroke on the unchecked frame.

### Code
1. **No visible keyboard focus:** the real `<input>` is `opacity: 0` and there's no `:focus-visible` style on the box. Keyboard users can't see where focus is. Verified live: focus moves to the input; outline none.
2. **No `disabled` prop.**
3. **`readOnly` does nothing on a checkbox:** without `onChange` the code sets `readOnly`, but browsers ignore it for checkboxes; React keeps the value controlled, so the only effect is a console warning risk. Minor.

### Storybook
1. **Only one story:** unchecked and labelled (Option) states aren't shown side by side.
2. **Stale Figma link:** it points at node `136-177` in the old "Dashboard_Design_System_v3" URL, not the sets `136:109` / `136:179`.

## 4. Suggested fixes

- **Design (NS):**
  - make the Dark variants use the Dark tokens;
  - re-link Option False to the `isChecked=False` main;
  - add Disabled and Focus;
  - decide transparent vs `white` unchecked fill.
- **Code + stories (one small PR, safe):**
  - `:focus-visible` ring on the box;
  - `disabled` prop (opacity 0.4, `not-allowed`, like Input);
  - story matrix: checked / unchecked × no label / label (+ disabled);
  - Figma links to `136:109` / `136:179`.
