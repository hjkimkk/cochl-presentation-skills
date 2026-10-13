# Mismatch audit: group "form"

Sources: Figma `aUrjRMAnE8ND8o6lAI0VcM` (read-only scripts); GitHub `cochlearai/cochl-dashboard` @ 80da7dd, `packages/cochl-ui`; live Storybook `index.json`.
Note on evidence: the GitHub connector returns files without line numbers, so code evidence is cited as `file :: symbol/block` instead of `file:line`.
Not read in detail: `HyperlinkButton.stories.tsx`, `ListDropdown.stories.tsx`, `MultiSelectDropdown.stories.tsx` (story ids taken from live index.json only), and `lib/ThemeColors` (so Button per-state colors per theme are unverified).

---

## 1. Button (+ HyperlinkButton, ComplexButton)

**Figma** page 52:718, set 3251:7381 `Button`, 210 variants.
- theme: Light | Dark
- category: Primary | Secondary
- type: Basic | Red | sm | md | lg | Link | ComplexButton
- state: Default | Disabled | Hovered
- leftIcon / rightIcon: true | false (plus INSTANCE_SWAP left-Icon, right-Icon; TEXT Text, Title, Subtitle)

**Code**
- `src/Button/Button.tsx` :: `ButtonType = "default" | "primary" | "secondary" | "danger"`; `ButtonProps { disabled, color, leftIcon, rightIcon, onClick }`. Hover/disabled via CSS (`&:hover`, `&:disabled { opacity: .4 }`); theme via `ThemeColors.button.*[color][theme]`. No size prop; padding/height are not part of the component.
- `src/HyperlinkButton/HyperlinkButton.tsx` :: `{ text, rightArrow, onClick }`. Hard-coded `theme.colors.blue[60]`, fallback `"#4B68FF"`; no `disabled`, no hover style.
- `src/ComplexButton/ComplexButton.tsx` :: `{ title, subtitle, disabled, onClick }`; hover `grey[20]`, disabled `opacity .4`; fixed `ExternalIcon`.
- `src/DropdownButton` wraps `Button color="secondary"` (see Dropdown).

**Storybook** (live ids): `form-button--primary`, `form-button--secondary`, `form-button--complex-button-story`, `form-button--hyperlink-button-story`.
- Primary: Basic / With icon / Delete(danger) / Link / MD, each Default, Hovered, Disabled.
- Secondary: SM / MD / LG, each Default, Hovered, Disabled.
- ComplexButton: Default, Hovered, Disabled.
- Hovered is simulated with styled overrides in the story (blue[90] bg, `#cb2c2b`, etc.), not a real pseudo-state. No Dark theme story.

**Inferred mapping**

| Figma | Code |
|---|---|
| category=Primary, type=Basic | `<Button color="primary">` |
| category=Secondary, type=Basic | `<Button color="secondary">` |
| type=Red | `<Button color="danger">` (story calls it "DELETE") |
| type=sm / md / lg | no prop; story-only styled overrides (sm: h30 pad 6x8 secondary; md: pad 11x14/20; lg: pad 20x24 full width) |
| type=Link | `<HyperlinkButton text rightArrow>` |
| type=ComplexButton | `<ComplexButton title subtitle>` |
| state=Default / Hovered / Disabled | default / CSS `:hover` / `disabled` |
| leftIcon / rightIcon true | `leftIcon` / `rightIcon` ReactNode |
| theme Light / Dark | `ThemeProvider theme.theme` (ThemeType) |
| (none) | `color="default"` |

**Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Button | Figma sizes sm/md/lg (and category x type matrix) have no code prop; sizing exists only as story overrides, so apps cannot request an sm/md/lg button from the library | Button.tsx :: ButtonProps has no `size`; Button.stories :: `SecondarySmButton`, `PrimaryMdButton`, `SecondaryLgButton` |
| High | HyperlinkButton | Figma Link has Disabled/Hovered/Dark; code has no `disabled` prop, no hover rule, no theme-aware color. Story fakes hover with `blue[60]`, which is the same color as the default, so hover is visually identical | HyperlinkButton.tsx :: `ButtonWrapper`; Button.stories :: `HoveredHyperlink`, `DisabledHyperlink` |
| Medium | Button | Figma `type` conflates style and size and `category` is Primary/Secondary; code uses a single `color` (default/primary/secondary/danger). `Red` -> `danger` and `default` (no Figma twin) make mapping ambiguous | Button.tsx :: `ButtonType` |
| Medium | Button | Story hard-codes hover for danger (`#cb2c2b`) and primary (`blue[90]`) instead of showing real hover; suggests ThemeColors hover tokens may differ from Figma (verify in lib/ThemeColors) | Button.stories :: `HoveredDangerButton`, `HoveredPrimaryBasicButton` |
| Medium | ComplexButton / Hyperlink | Figma Dark theme for these has no story; colors rely on `theme.colors.*` (not ThemeColors table), unverified for Dark | ComplexButton.tsx :: `Container`; Button.stories (no dark) |
| Medium | Button | Figma has no Focus state, code has none (no `:focus-visible` rule) while it is an accessibility gap | Button.tsx :: `Container` |
| Medium | Storybook | Icon-only/left+right icon story shows only left icon (Primary) and right icon only on a hovered LG; Figma leftIcon x rightIcon matrix not covered | Button.stories :: `PrimaryIconButton`, `HoveredSecondaryLgButton` |
| Low | Story naming | File lives in `stories/actions/` but title is `Form/Button`; JSDoc docs links point at `actions-button--default` / `actions-button--complex-button` / `actions-hyperlink-button--default`, none exist (live ids are `form-button--*`) | Button.tsx / ComplexButton.tsx / HyperlinkButton.tsx JSDoc `@see`; index.json |
| Low | Story naming | Story id `hyperlink-button-story` / `complex-button-story` carry a "-story" suffix from export names | index.json |
| Low | Tokens | Hard-coded `#4B68FF` fallback in HyperlinkButton, `#cb2c2b` in story | HyperlinkButton.tsx :: `fill`; Button.stories |
| Low | Figma | Layer-property names mix cases: `leftIcon` (variant) vs `left-Icon` (swap), `Text#`, `Title#` | Figma 3251:7381 |

---

## 2. Input Field (+ TagChipInput)

> Detailed property-by-property comparison (both themes, all types incl. TagChipInput): [input-field.md](input-field.md) (2026-10-12).

**Figma** page 52:720, set 1174:283 `Input Field`, 50 variants.
- theme: Light | Dark
- type: Basic | withIcon | smIcon | TagChipInput | NonEditable
- state: Active | Default | DefaultLabel | Error | Filled | Focus | smDesc | withIcon | bigLabel
- isDisabled: false | true (TEXT Text, undertext, Label; INSTANCE_SWAP icon)

**Code**
- `src/Input/Input.tsx` :: `InputProps { validated?: boolean, rightIcon, leftIcon, error, label, labelGap, description, size?: "default"|"small", readOnly, disabled, ...InputHTMLAttributes }`. Focus via `&:focus-within` (black border); `aria-invalid=true` -> blue border, `aria-invalid=false` -> red; `aria-disabled` -> opacity .4; readOnly -> grey[10] bg.
- `src/TagChipInput/TagChipInput.tsx` :: `{ tags, expanded, label, rightIcon, disabled, visibleTagCount, moreTagsCount }` - display only, no input element, no onChange/onRemove.

**Storybook** (`stories/form/Input.stories.tsx`, title `Form/Input Field`): `form-input-field--basic` (Default, Focus, Active, Filled, Error, Disabled, Default with label), `--with-icon` (default only), `--small-with-icon` (Default, Focus, Active, Disabled, Small description), `--tag-chip-input-story` (Default, Focus, Disabled, Active/expanded, With label), `--non-editable` (Default, Focus, Disabled, Active, With icon), `--big-label`. Focus/Active are mocked with a `MockFocused` CSS wrapper. No Dark theme.

**Inferred mapping**

| Figma | Code |
|---|---|
| type=Basic | `<Input>` |
| type=withIcon / state=withIcon | `rightIcon` (Figma shows trailing cancel icon) |
| type=smIcon | `size="small"` + `leftIcon` |
| state=smDesc | `size="small" description=...` |
| state=DefaultLabel | `label` |
| state=bigLabel | `label` + `labelGap={10}` |
| state=Default / Filled | no value / `value`/`defaultValue` |
| state=Focus / Active | `:focus-within` (not a prop) |
| state=Error | `validated={false}` + `error="..."` |
| isDisabled=true | `disabled` |
| type=NonEditable | `readOnly` |
| type=TagChipInput | `<TagChipInput tags=...>` (display only) |

**Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | TagChipInput | Figma TagChipInput is a field type of Input Field, code component cannot be typed into/edited, has no focus/active states and no onChange/onRemove; story "Focus" is identical to "Default" | TagChipInput.tsx :: `TagChipInputProps`; Input.stories :: `TagChipInputExample` (DEFAULT vs FOCUS) |
| Medium | Input | Error semantics inverted/obscure: `validated={false}` means error (red) and `validated={true}` gives a blue border that Figma does not show. Ambiguous mapping to Figma state=Error | Input.tsx :: `&[aria-invalid="true"]` / `"false"` |
| Medium | Input | Dark theme: Figma has Dark variants; code uses `theme.colors.white/grey` tokens only (no ThemeColors per-theme table), and no Dark story, so Dark parity is unverified | Input.tsx :: `containerStyles`; Input.stories |
| Medium | Input | Figma `Active` (typing) and `Focus` are distinct; code renders both as the same `:focus-within` style, the story separates them only by placeholder vs value | Input.stories :: `MockFocused` |
| Medium | Input | `with Icon` story shows only a default state with a right icon; Figma withIcon state matrix (Focus/Error/Disabled) is not covered. Left icon only exercised in small size | Input.stories :: `WithIcon` |
| Medium | Input | Figma type=NonEditable has Focus/Disabled/Active states; code `readOnly` Focus story is the same as Default (no mock) | Input.stories :: `NonEditable` |
| Low | Input | Prop `validated` vs Figma "Error" naming; `labelGap` has no Figma property (bigLabel is a state) | Input.tsx :: `InputProps` |
| Low | Docs | JSDoc links use `form-input--basic` / `form-input--tag-chip-input`; live ids are `form-input-field--*` | Input.tsx, TagChipInput.tsx `@see`; index.json |
| Low | Story | Story export `Basic` is named "0. Basic" (sort hack) | Input.stories :: `Basic.name` |

---

## 3. Number Input

**Figma** page 52:721, set 1153:404 `Number Input`, 12 variants: theme Light|Dark; type Basic; status Active|Default|Error|Filled|Focus; isDisabled false|true (TEXT Text).

**Code** `src/NumberInput/NumberInput.tsx` :: `NumberInputProps extends Omit<InputHTMLAttributes,"type"> { error?: string, onIncrement, onDecrement }`; renders `InputContainer` + text input (`inputMode="decimal"`) + up/down CounterButtons; error sets `aria-invalid="false"` (red). Disabled via `disabled`.

**Storybook** `form-number-input--basic` (title `Form/Number Input`, name "Number input"): Default, Focus, Active, Filled, Error, Disabled. Focus/Active mocked.

**Inferred mapping**

| Figma | Code |
|---|---|
| status=Default/Filled | empty / `value` |
| status=Focus/Active | `:focus-within` (mocked) |
| status=Error | `error="..."` |
| isDisabled | `disabled` |
| theme | ThemeProvider |

**Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| Medium | Dark | Figma Dark variants; code relies on shared Input tokens, no Dark story | NumberInput.tsx; NumberInput.stories |
| Medium | Behaviour | Component is `type="text"` with decimal keyboard and no min/max/step logic, increments only via callbacks; Figma shows a numeric stepper with no definition of bounds | NumberInput.tsx :: `type="text"`, `onIncrement` |
| Low | Story | ACTIVE/FILLED/ERROR use `defaultValue="Typing text"` (non-numeric) | NumberInput.stories |
| Low | Story | Story has no Figma `design` parameter link (Input/Checkbox/Radio have one) | NumberInput.stories :: `Basic` |

---

## 4. Checkbox

> Detailed comparison against `beta` and the live Storybook (2026-10-12): [checkbox.md](checkbox.md). Since this section was written, `beta` replaced the hard-coded colours with theme tokens.

**Figma** page 52:717. Set 136:109 `Checkbox` (4 variants: isChecked True|False x theme Light|Dark); set 136:179 `Option` (box + label, TEXT Text, same props).

**Code** `src/Checkbox/Checkbox.tsx` :: `CheckBoxProps { selected: boolean, label?: string, onChange }`. Colors hard-coded: `#fff`, `#e5e5e6`, `#4b68ff`, `white`; no theme, no disabled, no hover/focus, no indeterminate.

**Storybook** `form-checkbox--default` only: `selected: true`, no label, no unchecked static, no Dark.

**Inferred mapping**

| Figma | Code |
|---|---|
| Checkbox isChecked=True/False | `<Checkbox selected={true/false}>` |
| Option | `<Checkbox label="...">` |
| theme | none (not supported) |

**Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Checkbox | Figma Dark theme cannot be rendered: all colors are hard-coded hex, no theme access. Also violates "no hardcoded colors" | Checkbox.tsx :: `Check`, `CheckBoxWrapper` (`#4b68ff`, `#e5e5e6`) |
| Medium | Checkbox | Storybook shows only the checked, unlabelled box; Figma `Option` (with label), unchecked and Dark not covered | Checkbox.stories :: `Default` |
| Medium | Naming | Figma `isChecked` (True/False) vs code `selected`; `Option` is a Figma set but a `label` prop in code | Checkbox.tsx :: `CheckBoxProps` |
| Low | Prop | Code has no `disabled`/`checked` pass-through (not in Figma either; note for completeness) | Checkbox.tsx |
| Low | Naming | Exported prop type is `CheckBoxProps`, component `Checkbox` | Checkbox.tsx |

---

## 5. Radio

> Detailed comparison against `beta`, the live Storybook and the app usage (2026-10-12): [radio.md](radio.md).

**Figma** page 52:723, set 3116:3045 `Radio`, 12 variants: theme Dark|Light; type Basic; state Default|Hovered|Selected; withLabel false|true (TEXT Text).

**Code** `src/RadioButton/RadioButton.tsx` :: `RadioButtonProps { name, value, checked?, isBtnType?, onChange }`. The visible label is `value` (no separate label prop); `id={value}`. `isBtnType` renders a button-style pill with hidden radio and blue text when checked. Colors hard-coded (`#ffffff`, `#000000`, box-shadow); no theme, no disabled.

**Storybook** `form-radio--default` only (`name/value="Radio Button"`, toggling `checked`).

**Inferred mapping**

| Figma | Code |
|---|---|
| state=Default / Selected | `checked=false/true` |
| state=Hovered | none (no hover rule) |
| withLabel=true | always (label = `value`) |
| withLabel=false | not supported |
| type=Basic | `isBtnType` false (Figma has no button-type) |
| theme | none |

**Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | RadioButton | Figma withLabel=false cannot be rendered (label is always `value`); no way to set label text different from value | RadioButton.tsx :: `<Typo>{value}</Typo>` |
| High | RadioButton | Dark theme and Hovered not supported: hard-coded colors, no hover style | RadioButton.tsx :: `Label` |
| Medium | RadioButton | Code `isBtnType` pill variant has no Figma counterpart | RadioButton.tsx :: `isBtnType` |
| Medium | RadioButton | Story shows only Default (unchecked/checked toggle); no Hovered, Dark, button type | RadioButton.stories :: `Default` |
| Medium | RadioButton | Label is a wrapper card (shadow, radius 8, padding) while Figma Radio is a bare dot + label; layout likely differs | RadioButton.tsx :: `Label` |
| Low | RadioButton | `id={value}` collides if two groups share a value | RadioButton.tsx |
| Low | Docs | JSDoc link `form-radio-button--default`; live id `form-radio--default` | RadioButton.tsx `@see`; index.json |
| Low | Naming | Component `RadioButton`, folder `RadioButton`, Figma `Radio`, story `Form/Radio` | multiple |

---

## 6. Dropdown (+ DropdownButton, DropdownItem, ListDropdown, MultiSelectDropdown)

**Figma** page 28:538, set 1259:1277 `Dropdown`, 34 variants: theme Light|Dark; type emailSelect|sm|timePicker; state Active|Default|Filled|FilledFocus|Focus|ActiveFocus|FilledActive|disabled (TEXT Text, Chip Text, Email Text, Label, Time). Plus ~20 loose legacy components named `Dropdown/<theme>/<type>/<State>/<bool>` (e.g. `Dropdown/Dark/emailSelect/FiiledActive/false`, with a typo) and two `Group 1493`, `date filter`.

**Code**
- `Dropdown.tsx` :: generic popover wrapper `{ data, renderItem, isOpen, onClickOutside, align, dropdownPadding, containerStyle, contentWidth }` (max-height 200px, bottom only).
- `DropdownButton.tsx` :: secondary `Button` with ArrowDownIcon; `{ onClick }`.
- `DropdownItem.tsx` :: row with hover grey[20]; `{ onClick }`; no selected/disabled.
- `ListDropdown.tsx` :: `{ isOpen, onClose, onClickOutside, data:{label,value,disable?}[], onClickItem, align, selected, fitToContents, dropdownPadding }`.
- `MultiSelectDropdown.tsx` :: react-select; `{ data, value, handleChange, disable, clearAll, onClearAll, placeholder (default "Select tags"), onSelectAll, menuIsOpen, onMenuOpenChange }`.

**Storybook** (title `Form/Dropdown`): `form-dropdown--email-selection` (Default, Focus, Active, Filled, Filled+Active, Filled+Focus, Disabled), `--small-dropdown` (Default, Focus, Active, Active+Focus, Disabled), `--time-picker` (Default, Focus, Active, Active+Focus, Disabled), `--list-dropdown-story`, `--multi-select-dropdown-story` (those two not read). Focus is a CSS `!important` / border override; Disabled for sm and timePicker is `opacity+pointer-events` override.

**Inferred mapping**

| Figma | Code |
|---|---|
| type=emailSelect | `<MultiSelectDropdown>` |
| type=sm | `<ListDropdown>` + trigger `<DropdownButton>` (story-only styles: min-w 127, pad 6x16, "Filter By" label) |
| type=timePicker | `<Dropdown>` + `<DropdownButton>` + `DropdownItem` (story-only `DateBadge`, `TimePickerMenuItem`) |
| state=Default / Filled | `value=[]` / `value=[...]` (+ `clearAll`) |
| state=Active | `menuIsOpen` / `isOpen` |
| state=Focus | no prop; story-only border override |
| state=ActiveFocus / FilledFocus / FilledActive | combination of above (story-only) |
| state=disabled | `disable` (MultiSelect only); sm/timePicker story-only |
| Label / Chip Text / Email Text | `placeholder` / `multiValue` label / option label |

**Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | sm, timePicker | Trigger styles exist only in the story file (min-width, padding, focused border, disabled opacity, DateBadge, TimePickerMenuItem, FilterLabel); no library component, so apps cannot use them (already known) | Dropdown.stories :: `SmallDropdownButton`, `TimePickerButton`, `DateBadge`, `TimePickerMenuItem` |
| High | Dropdown / ListDropdown / DropdownButton | Figma `disabled` and `Focus` states for sm/timePicker cannot be rendered by the components (no `disabled`/`focused` prop on DropdownButton, ListDropdown, Dropdown) | DropdownButton.tsx :: `DropdownButtonProps`; ListDropdown.tsx :: `ListDropdownProps` |
| Medium | Figma | Figma has 8 states x 3 types x 2 themes (34 variants); Dark not covered by any story, and Dropdown/ListDropdown/DropdownItem use `theme.colors` only | Dropdown.stories (no dark); Dropdown.tsx, DropdownItem.tsx |
| Medium | MultiSelectDropdown | Figma state names map to react-select internals: Focus needs `!important` story CSS; `Filled` needs manual `clearAll` flag; default placeholder "Select tags" differs from Figma "Name or email with organization members" (story overrides) | MultiSelectDropdown.tsx :: `placeholder \|\| "Select tags"`; Dropdown.stories :: `EmailFocusedWrap` |
| Medium | DropdownItem | Figma timePicker shows a selected/highlighted row; `DropdownItem` has no `selected` prop (ListDropdown has, DropdownItem does not), story uses `HighlightedDropdownItem` override | DropdownItem.tsx; Dropdown.stories :: `HighlightedDropdownItem` |
| Medium | Figma | ~20 legacy `Dropdown/<theme>/<type>/<State>/<bool>` components duplicate the set and some have state typos (`FiiledActive`); ambiguous source of truth for code mapping | Figma page 28:538 (loose components) |
| Medium | MultiSelectDropdown | `data`/`value` typed `Array<unknown>`; no typed option shape, mapping Figma Chip/Email text to code is by convention only | MultiSelectDropdown.tsx :: `MultiSelectDropdownProps` |
| Low | Dropdown | Dropdown max-height 200px default requires `containerStyle={{maxHeight:"unset"}}` for timePicker | Dropdown.tsx; Dropdown.stories :: `TimePickerExample` |
| Low | Docs | `DropdownButton`, `DropdownItem`, `Dropdown` JSDoc point to `form-dropdown--default` (no such id; live ids are email-selection / small-dropdown / time-picker); `ListDropdown` link `form-listdropdown--default` also stale (live: `form-dropdown--list-dropdown-story`) | *.tsx `@see`; index.json |
| Low | Naming | Figma `type=sm` name does not say "list/filter"; `emailSelect` camelCase vs `MultiSelect` | Figma 1259:1277 |

---

## 7. Popover

**Figma** page 3751:1864. Set 3752:305 `PopoverList` (8 variants: theme Light|Dark; type Default|Divider|RightButton|LeftButton). Set 3752:407 `PopoverItem` (4 variants: theme; state Default|Selected; TEXT Text).

**Code** `src/Popover/Popover.tsx` :: `PopoverProps extends react-tiny-popover PopoverProps` (`isOpen`, `positions`, `align`, `padding`, `content`, `containerStyle`...). Only default container styling (white bg, shadow `0 0 5px rgba(152,152,152,.3)`, radius 4). No list/item/divider components; items use `DropdownItem`, divider uses `MenuDivider` (from Menu).

**Storybook** `form-popover--popover-item` (Default, Active), `form-popover--popover-list` (Default w/ active item 1, Divider, Right-button, Left-button). `PopoverListContainer`, `ActivePopoverItem`, `PopoverDivider` are story-local.

**Inferred mapping**

| Figma | Code |
|---|---|
| PopoverList type=Default | `<Popover content={list}>` + story-only `PopoverListContainer` |
| type=Divider | `MenuDivider` between items (story `PopoverDivider`, margin 8) |
| type=RightButton / LeftButton | `<Popover align="end"/"start">` around a trigger `Button` |
| PopoverItem state=Default | `<DropdownItem>` |
| PopoverItem state=Selected | `DropdownItem` + story-only grey[20] background |
| theme | none |

**Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Popover | PopoverList / PopoverItem are not components in code; list container, divider spacing, selected item exist only in the story, so the Figma sets have no library counterpart | Popover.stories :: `PopoverListContainer`, `ActivePopoverItem`; Popover.tsx |
| Medium | Popover | Figma Dark variants; container uses hard-coded shadow and `colors.white` from theme only, no Dark story | Popover.tsx :: `containerStyle`; Popover.stories |
| Medium | Popover | `DropdownItem` has no `selected` state, so PopoverItem Selected needs an override | DropdownItem.tsx |
| Medium | Popover | RightButton / LeftButton are alignment of the trigger, expressed by `align` and not a component variant; mapping is by convention | Popover.stories :: `PopoverWithButton` |
| Low | Story naming | File in `stories/feedback/` but title `Form/Popover`; JSDoc link `feedback-popover--default` does not exist (live ids `form-popover--popover-item/list`) | Popover.tsx `@see`; index.json |
| Low | Story | Story reads "ACTIVE" for Figma state "Selected"; "RIGHT-BUTTON"/"LEFT-BUTTON" vs Figma `RightButton`/`LeftButton` | Popover.stories |
| Low | Tokens | Shadow `rgba(152,152,152,0.3)` hard-coded in component and story | Popover.tsx |

---

## Totals

| Component | High | Medium | Low |
|---|---|---|---|
| Button / Hyperlink / Complex | 2 | 5 | 4 |
| Input / TagChipInput | 1 | 5 | 3 |
| Number Input | 0 | 2 | 2 |
| Checkbox | 1 | 2 | 2 |
| Radio | 2 | 3 | 3 |
| Dropdown family | 2 | 5 | 3 |
| Popover | 1 | 3 | 3 |
| **Total** | **9** | **25** | **20** |

## Top issues
1. Size, state and theme variants that exist in Figma only live in story-local styled overrides: Button sm/md/lg, HyperlinkButton hover/disabled, Dropdown sm/timePicker triggers (+ DateBadge), PopoverList/PopoverItem containers. These need promotion to library props/components.
2. Checkbox and RadioButton hard-code colors (`#4b68ff`, `#e5e5e6`, `#fff`, `#000`) so Figma Dark theme (and Radio Hovered / withLabel=false) cannot render; Dark is also missing from every Form story.
3. TagChipInput is display-only (no editing, focus, remove) while Figma treats it as an Input Field type; Input error semantics (`validated={false}` = red) and `Focus`/`Active` being story mocks make Figma-state mapping ambiguous.
4. Docs/story id drift: JSDoc `@see` links (`actions-*`, `feedback-popover`, `form-input--*`, `form-radio-button`, `form-dropdown--default`) do not match live ids (`form-button--*`, `form-popover--*`, `form-input-field--*`, `form-radio--default`).
