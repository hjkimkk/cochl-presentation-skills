# Design system inventory: Figma ↔ GitHub ↔ Storybook

Checked 2026-10-07.
- **Figma:** `Cochl Design System` (`aUrjRMAnE8ND8o6lAI0VcM`), 14 of 15 pages; the Welcome cover was skipped. Details: `figma-components.md`.
- **GitHub:** `cochlearai/cochl-dashboard` → `packages/cochl-ui/src` (45 component folders; `index.ts` exports).
- **Storybook:** the same package's `stories/` (42 story files) = dashboardstorybook.cochl.ai.
- **mapping.json:** `design-sync/config/mapping.json` (10 entries).

✓ present · ✗ missing · ◐ partial / only inside another file

## 1. Present in all three (14 Figma families)

| Figma family | Code components | Storybook title | In mapping.json | Notes |
|---|---|---|---|---|
| Button (type: Basic, Red, md, sm, lg, **Link**, **ComplexButton**) | `Button`, `HyperlinkButton`, `ComplexButton` | Form/Button | ◐ only `Button` | Link → `HyperlinkButton` (spec example `Type=Link`); ComplexButton not mapped |
| Input Field (type: Basic, withIcon, smIcon, **TagChipInput**, NonEditable) | `Input`, `TagChipInput` | Form/Input Field | ◐ only `Input` | `TagChipInput` appears only inside the Input story |
| Checkbox (+ Option) | `Checkbox` | Form/Checkbox | ✓ | |
| Radio | `RadioButton` | Form/Radio | ✓ | |
| Chip | `Chip` | Data Display/Chip | ✓ | |
| Tooltip | `InfoTooltip` | Overlay/Tooltip | ✓ | |
| Dropdown (type: sm, timePicker, emailSelect) | `MultiSelectDropdown`, `ListDropdown`, `DropdownButton`, `Dropdown`, `DropdownItem` | Form/Dropdown | ✗ AMBIGUOUS (pending fix) | sm/timePicker field styles exist **only in the story file** |
| Table (+ Header, Body) | `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell` | Data Display/Table | ✓ ONE_TO_MANY | No Row/Cell components in Figma; Body has type: Button, Basic, Secondary, Chip |
| Progress | `ProgressIndicator`, `CircleProgress` | Feedback/Progress | ✓ ONE_TO_MANY | Figma page unreadable through the tool (variants not checked) |
| Alert (+ Alert_Icons) | `Toast` (mapping), plus `Banner` and `Notification` | Feedback/Alert (Toast, Banner, Notification together) | ◐ only `Toast` | Which code component Figma Alert type=Basic\|Link corresponds to needs checking |
| Tabs | `Tab` (+`TabItem`) | Disclosure/Tabs | ✗ | Figma spec frame name error ("InputField_Specs") |
| Menu (+ MenuItem; type: Notification, UserMenu, Basic) | `Menu` (`NotificationMenu`, `UserMenu`) | Overlay/Menu | ✗ | |
| Icons | `Icons` | Theme/Icons | ✗ | 24 sub-families |
| Date picker | **✗ none in the library** | Data Display/Date picker | ✗ | `DatePickerTrigger` exists **only inside the story file** |

## 2. In code and Storybook, not in the Figma DS file (18)

| Code | Storybook title | Notes |
|---|---|---|
| `Modal`, `ConfirmModal` | Overlay/Modal | |
| `Popover` | Form/Popover | |
| `NumberInput` | Form/Number Input | Could be a separate type of Figma Input Field |
| `Card` | Data Display/Card | |
| `CodeView` | Data Display/Code View | |
| `UsageBar`, `UsageBarContent` | Data Display/Usage Bar, UsageBarContent | |
| `UserProfile` | Overlay/User Profile | |
| `Skeleton` | Feedback/Skeleton | |
| `Accordian` | Disclosure/Accordian | Spelling (Accordion) |
| `GNB`, `LNB`, `FNB`, `ProjectNavi` | Disclosure/Navigation (+FullLayout) | |
| `Chart` (Heatmap, PieChart, BarChart, LineChart) | Analytics/* | |
| `Typo`, colors (`lib`) | Theme/Typography, Theme/Color | Foundations; Figma has them as styles/variables rather than components |

## 3. Code only (no Figma, no Storybook)
- `Scroll`

## 4. Storybook only (no library component)
- **DatePicker** (`DatePickerTrigger`): exists in Figma too but **missing from code**. Implementation lives inside the story.
- **Dropdown sm / timePicker fields**: in Figma, but the library has only `DropdownButton`; sizes and the time badge are styled in the story.

## 5. Figma file issues
- Spec frame names are wrong: Tabs is named "InputField_Specs", Radio is named "Chip".
- The Dropdown page has ~20 old-style symbols (`Dropdown/<theme>/<type>/<State>/<bool>`), including the typo "FiiledActive".
- Input Field `state` mixes interaction states with layout variants.
- All pages have a "v1" suffix except "Date picker". No v2 pages.
- The Progress and Date picker pages can't be read with Figma MCP `get_metadata` (response truncated). Use a different method (e.g. per-frame queries) to verify them.

## Numbers (input for Workstream C's "total DS component count")
- **Figma component families:** 14 (19 including sub-components)
- **Library components:** 45 folders, 43 exports excluding Icons and lib
- **mapping.json:** 10 entries, of which 7 are complete and 1 is AMBIGUOUS
- **Coverage, based on Figma families:** 9/14 mapped = 64% (target ≥ 80%). Unmapped: Tabs, Menu, Icons, Date picker; Dropdown is pending a fix.
- Whether the 18 components in section 2 count toward the denominator depends on whether there is a separate Figma file for them (ask NS).
