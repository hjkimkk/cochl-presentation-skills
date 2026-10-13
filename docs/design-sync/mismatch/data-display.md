# Mismatch audit: data-display

Sources: Figma `aUrjRMAnE8ND8o6lAI0VcM`; GitHub `cochlearai/cochl-dashboard` @ 80da7dd (`packages/cochl-ui`); Storybook files under `packages/cochl-ui/stories/`.
Note: the GitHub API does not return line numbers, so code evidence cites file + symbol. Names below have U+0008 stripped (Figma `size` option `"\bm"` and style options `"\bcustom"`, `"\bmonth of year"` contain it).
Not verified: live Storybook `index.json` ids (not fetched); the story ids below are derived from `title` + export name (Storybook kebab-case).

---

## 1. Card

### 1. Figma
- Page `Card v1` (12:2070). Set `1850:660` "Card", 14 variants.
- Props: `size` = sm | m | fl; `theme` = light | dark; `state` = default | hovered; `type` = basic | card with action | card with items | fullLength | Card with supporting text; TEXT props `title`, `subtitle`, `secondaryText`.
- Variant matrix actually present (not a full cross product):
  - sm: basic (light/dark default, light/dark hovered), card with action (light/dark default), Card with supporting text (light/dark default); 282x220
  - m: basic (light/dark), card with items (light/dark); 540x286
  - fl: fullLength (light/dark); 1200x183
- Standalone components: `1989:245` "Cards/info/fullLength" (1200x183, no props); `1989:434` "Card with items (table,etc)/Default" (540x286, no props). These are the nested content frames used by the set's fullLength and card with items types.
- `hovered` exists only for sm + basic.

### 2. Code
- `src/Card/Card.tsx`: `CardProps extends BaseStyleProps { hoverEffect?: boolean }` (+ `children`, `style`, `className`). Single unstyled-content container: white bg, 4px radius, 1px `grey[20]` border; `:hover` (only if `hoverEffect`) adds `blue[60]` border, 20px blue 0.1 shadow, text color tweaks. Theme comes from `p.theme.colors` (ThemeProvider), not a prop.
- No `size`, `type`, `title`, `subtitle`, `secondaryText` props. All content/types are composed by consumers.
- Related but NOT in the library: `packages/client/src/components/TypeSelectButton/TypeSelectButton.tsx` (props `text, icon, selected, disabled, isBETA, onClick`) is a selectable card-like tile (70px tall, 1px grey[50] -> blue[60] border, blue 0.1 bg when selected, check icon, 0.4 opacity when disabled, composes `Chip` for BETA). It has no Figma counterpart on Card v1, no story, and hardcodes `height: 70px`, `padding: 20px 24px`, `opacity 0.4`. Used by `ProjectCreateModal`.

### 3. Storybook (`stories/data-display/Card.stories.tsx`, title "Data Display/Card")
| Story id (derived) | Shows | Figma link in story |
|---|---|---|
| data-display-card--default | empty 800x400 card with `<h1>` | node 1850-663 (sm/light/default/basic) |
| --example | all 5 templates stacked | none |
| --create-new-project | CreateNewProjectTemplate (icon + "No projects, yet!") | 2596-1837 (type=card with action) |
| --project | ProjectTemplate (title/id/date) | 2594-1699 (type=Card with supporting text) |
| --plan | PlanTemplate 588x288 with action footer | 2164-2483 (Cards/ItemCards instance, card with items) |
| --delete-project | red-border danger card | none |
| --project-info | 2-column info card | none |
- No dark-theme story, no `hovered` story (the `hoverEffect` arg is not exercised by any story).
- Story Figma URLs reference file name "Dashboard_Design_System_v3" (old name) with `t=` tracking params.

### 4. Inferred mapping
| Figma | Code |
|---|---|
| type=basic, state=default | `<Card>` (no hoverEffect) |
| type=basic, state=hovered | `<Card hoverEffect>` (hover is a CSS pseudo-state, not a prop) |
| type=card with action | `<Card>` + composed content (story `CreateNewProject`) |
| type=Card with supporting text | `<Card>` + composed content (story `Project`) |
| type=card with items | `<Card>` + composed content (story `Plan`; note Figma node 2164:2483 is "Cards/ItemCards") |
| type=fullLength | `<Card>` with `width: media.size.lg`, row layout (story `ProjectInfo`) |
| size=sm / m / fl | no prop; width/height set via `style` (282x220 / 540x286 / 1200x183 are not encoded) |
| theme=light / dark | ThemeProvider (`ThemeType.LIGHT/DARK`), no prop |
| title / subtitle / secondaryText | children |

### 5. Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma vs code | Figma defines 5 card types and 3 sizes as one variant set; code has a single generic `Card` with only `hoverEffect`. A "Card with action"/"items"/"supporting text" cannot be requested by prop; only Storybook templates show them. | Card.tsx `CardProps`; Figma set 1850:660 props |
| High | Wrong/unmapped component | `TypeSelectButton` (client app) is a card-like selectable tile with no Figma component and not in the library. | client/src/components/TypeSelectButton/TypeSelectButton.tsx |
| Medium | Stories | No dark-theme story although Figma has dark for every card type. | Card.stories.tsx (no theme decorator/story) |
| Medium | Stories | `hovered` state not shown; `hoverEffect` never set in any story. | Card.stories.tsx |
| Medium | Stories | Figma `fullLength` and `card with items` have no dedicated story; `ProjectInfo` / `Plan` are only approximate and `ProjectInfo` has no Figma link. `DeleteProject` (danger border) has no Figma variant. | Card.stories.tsx; Figma variant list |
| Medium | Stories vs tokens | Templates hardcode colors/sizes (`#f03e3e`, `#edb1b1`, `#6c6b6b`, `#a8a9ae`, `#f6c0c0`, 384px, 588x288...) violating the no-hardcoded-values rule. | Card.stories.tsx styled blocks |
| Medium | Figma naming | Mixed casing in `type`: `Card with supporting text` vs lowercase others; `size` option contains U+0008 (`\bm`); `state` options order differs. Ambiguous for mapping. | Set 1850:660 props |
| Medium | Figma structure | Two standalone components (1989:245, 1989:434) exist outside the set with no props and no theme; duplicates of set content. | node list on Card v1 |
| Low | Stories | Figma links point to "Dashboard_Design_System_v3" file name; `Example` and 2 stories have no `design` parameter. | Card.stories.tsx |
| Low | Docs | JSDoc documents `style`, `hoverEffect`, `className` but not `children`; no mention of theme. | Card.tsx JSDoc |

---

## 2. Chip

### 1. Figma
- Page `Chip v1` (12:2472). Set `1350:640` "Chip", 22 variants (24px tall).
- Props: `theme` = Dark | Light; `type` = Clickable | Closable | Unclickable | Tag chip; `status` = Active | Default; `left-icon` = true | false; `right-icon` = true | false; TEXT `Text`.
- Variant observations (fills read from the set): Clickable Default = neutral (#f9f9fa light), Active = blue tint (#4b68ff @5% light, #4057d0 @10% dark), blue text. Closable Default = blue tint, Active = neutral and wider (63px, close icon). Unclickable = neutral (light) but dark-theme Unclickable is blue tint (inconsistent with light). Unclickable with left-icon=true exists (68px, blue tint). Tag chip Default = blue tint, with a right-icon=true variant (59px); Tag chip Active variants have no fill and are 101x155 (chip plus open dropdown menu frame), corner radius 0.
- Corner radius mixed: r=74 on neutral variants vs r=100 on tinted variants.

### 2. Code
- `src/Chip/Chip.tsx`: `ChipVariant = "clickable" | "closable" | "unclickable" | "tag"`; `ChipProps extends BaseStyleProps { variant?: ChipVariant; selected?: boolean; onClick?; onClose?; leftIcon?: ReactNode; rightIcon?: ReactNode }`.
- Behavior: `variant` undefined = "legacy" (blue tint bg, black text). `tag` always blue tint/black regardless of `selected`. `closable` + `selected` renders a group with close button (neutral); closable unselected = accent. `leftIcon`/`rightIcon` are suppressed for `closable`. 12px/15px font, 4px/10px padding, radius 100px, no theme prop (blueTint alpha 0.05 light / 0.1 dark via `theme.theme`).
- Story and doc link in JSDoc says `actions-chip--clickable` while the file lives in stories/actions but its `title` is "Data Display/Chip".

### 3. Storybook (`stories/actions/Chip.stories.tsx`, title "Data Display/Chip")
| Story | Shows |
|---|---|
| clickable | Default, Active (`selected`) |
| closable | Default, Active (`selected` + onClose) |
| unclickable | Default only |
| tag-chip ("Tag chip") | right-icon true/false and left-icon true, each "default"/"active" implemented as Dropdown closed/open (`defaultOpen`) |
- Only `clickable` has a Figma link (node 1350-482). No dark story. No unclickable-with-icon story.

### 4. Inferred mapping
| Figma | Code |
|---|---|
| type=Clickable / Closable / Unclickable / Tag chip | variant="clickable" / "closable" / "unclickable" / "tag" |
| status=Default / Active | `selected` false / true (for clickable, closable only) |
| left-icon / right-icon = true | `leftIcon` / `rightIcon` node (ignored when closable) |
| theme=Light / Dark | ThemeProvider |
| Text | children |

### 5. Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Tag chip Active | Figma Tag chip `status=Active` is an open-dropdown state (no fill, includes menu). Code `tag` ignores `selected`, so no Active chip style; Storybook fakes "active" by opening a Dropdown (and for right-icon=false the "ACTIVE" story is identical to Default). | Chip.tsx `chipColors` (tag returns fixed color); Chip.stories TagChip |
| Medium | Unclickable | Figma dark Unclickable is blue-tinted while light is neutral; Figma Unclickable Active == Default; code always renders neutral and has no active. Figma also has Unclickable with left-icon=true; code supports icons but no story. | Figma variants; Chip.tsx `variant === "unclickable"` |
| Medium | Legacy variant | `variant` omitted triggers `isLegacy` (blue tint + black text) that does not correspond to any Figma variant. | Chip.tsx `isLegacy` |
| Medium | Stories | No dark theme story; only `clickable` has a design link; Closable/Tag/Unclickable unlinked. | Chip.stories.tsx |
| Medium | Radius | Figma mixes radius 74 and 100; code fixed 100px. | Figma variants vs Chip.tsx |
| Low | Story location/naming | File is in `stories/actions/` but title is "Data Display/Chip"; JSDoc `@see` uses `actions-chip--clickable` (wrong id if title is Data Display). Story name "Tag chip" vs export `TagChip`. | Chip.stories.tsx meta; Chip.tsx JSDoc |
| Low | Naming | Figma `Text#...`, `left-icon` kebab-case props vs code camelCase. Figma status "Active" vs code `selected`. | Figma set props |
| Low | Client | `TypeSelectButton` restyles Chip (`BETAChip`) with color overrides, bypassing the variant system. | TypeSelectButton.tsx |

---

## 3. Table

### 1. Figma
- Page `Table v1` (16:2873). `componentPropertyDefinitions` threw "Component set has existing errors" on all three sets, so variants were read from child names.
- `2068:308` Table: theme = Light|Dark, type = Basic, state = Default (2 variants).
- `2068:319` Table_Header: theme, type = Basic, state = Default (2 variants).
- `2071:158` Table_Body: theme, type = Button | Basic | Secondary | Chip, state = Default, isLastItem = true | false (17 variants; the dark/Basic/isLastItem=true variant is duplicated; every type x theme x isLastItem present otherwise).

### 2. Code
- `src/Table/Table.tsx` `TableProps extends BaseStyleProps` (a `<table>`); `src/TableHead` (`<thead>`), `src/TableBody` (`<tbody>`), `src/TableRow` (`<tr>`, `onClick?`), `src/TableCell` (`component?: "th" | "td"` default "td"; `colSpan?`, note colSpan is applied only to the `td` branch). None take theme, type, selected or isLastItem props; all are unstyled structural wrappers.

### 3. Storybook (`stories/data-display/Table.stories.tsx`, title "Data Display/Table")
- Single story `data-display-table--default`: 3 headers, 4 rows; row 1 `selected` background; header/row/cell styling done by story-local styled components (`semantic.grey[20]`, 12.5px/20px padding, 60px row height, 12px/600 header). Figma link 2068-308 (Table set). No dark story.

### 4. Inferred mapping
| Figma | Code |
|---|---|
| Table (type=Basic) | `<Table>` |
| Table_Header (type=Basic) | `<TableHead><TableRow><TableCell component="th">` |
| Table_Body type=Basic | `<TableBody><TableRow><TableCell>` (text) |
| Table_Body type=Button | TableRow with `onClick` + Button in cell |
| Table_Body type=Secondary | secondary-text cell (no code equivalent) |
| Table_Body type=Chip | `<Chip>` inside `TableCell` |
| isLastItem=true | bottom border on `&:last-child` (story CSS) |
| theme | ThemeProvider |

### 5. Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma vs code | All Table styling (header bg, row borders, padding, row height, typography) lives only in the story's styled components; library components ship no visual styles, so consumers cannot get Figma output from the library. | Table*.tsx are bare wrappers; Table.stories.tsx styled blocks |
| High | Figma types | `type=Button | Secondary | Chip` body variants and clickable-row hover have no code equivalent or story. Only Basic is shown. | Figma set 2071:158; Table.stories.tsx |
| Medium | Selected | Story shows a `selected` row background (grey[10]) that Figma Table_Body has no variant for (state only has Default). | Table.stories.tsx `TableRowContainer` |
| Medium | Figma health | All three sets report "existing errors" (property API throws); Table_Body has a duplicate variant (dark/Basic/true twice). | use_figma error; variant list |
| Medium | Figma state | `state` has only Default (no hovered) even for Button type rows. | Figma variant list |
| Medium | Theme | Story has no dark variant, though Figma has dark for all. | Table.stories.tsx |
| Low | Naming | `isLastItem` (camelCase boolean) vs other props lowercase; `Table_Header` snake vs `TableHead`. | Figma names |
| Low | Docs | `TableCell` `colSpan` ignored for `th`; JSDoc links for all parts point to `data-display-table--default`. | TableCell.tsx |
| Low | Story | Story imports `Table` from `../../src/Table` while others from `../../src`; heading text "cell head 2 " has trailing space. | Table.stories.tsx |

---

## 4. Date picker

### 1. Figma
- Page `Date picker` (1439:1380). Sets:
  - `2447:6741` "Date picker": theme = Dark|Light; style = day of month | custom | month of year | year over year; state = hovered | default (10 variants).
  - `2447:7072` "date range days": theme = dark|light; state = default | hovered | selected; day of a week = weekday; range = none | start | end (10 variants).
  - `2447:6728` "Header": previous true|false; next false|true; theme dark|light (6 variants).
  - `2845:3965` "Header" (second, same name): period = previous month | next; style = rounded; color = dark (2 variants).

### 2. Code
- No library component. Production uses `@cochlearai/calendar` in the client app (per story docs). Story defines `StaticCalendar`, `DatePickerTrigger`, `DayCell` inline.

### 3. Storybook (`stories/data-display/DatePicker.stories.tsx`, title "Data Display/Date picker")
- `data-display-date-picker--default`: trigger only (DropdownButton, "15m" badge, range label). `--active`: trigger + static January 2026 calendar, range 12-15, input row, Confirm/Cancel.
- Hardcoded: 402px panel, 32px cells, `rgba(152,152,152,0.3)` shadow, 10px fonts, hardcoded January 2026. No design link.

### 4. Inferred mapping
| Figma | Story-local |
|---|---|
| Date picker style=custom (default/hovered) | `DatePickerTrigger` / StaticCalendar with input row |
| style=day of month | StaticCalendar day grid |
| style=month of year / year over year | none |
| date range days range=start/end, state=selected | `DayCell $selected` |
| range=none/ in-range | `$inRange` (grey[20]) |
| Header previous/next | ArrowLeftIcon/ArrowRightIcon row |
| theme | none (light only) |

### 5. Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Library | No `DatePicker`/`Calendar` in `@cochlearai/ui`; Figma defines 4 styles and range/day states. The real implementation is in a separate package (`@cochlearai/calendar`) outside this audit's scope. | story docs description; no src/DatePicker |
| High | Stories | `month of year` and `year over year` Figma styles are not represented anywhere in Storybook. | Figma 2447:6741 vs stories |
| Medium | Stories | Day `hovered`, `selected` range start vs end distinction, dark theme not represented; range cell only differentiates selected/in-range. | DayCell styles |
| Medium | Stories | Static hardcoded data/dimensions rather than tokens; Default story shows trigger only. | DatePicker.stories.tsx |
| Medium | Figma | Two sets named "Header" with different property schemas (`previous/next/theme` vs `period/style/color`; second has dark only, lowercase `dark`), plus lowercase vs capitalized theme values across sets ("Dark" vs "dark"). | Figma sets |
| Low | Figma | `day of a week` has single option `weekday`; `custom`/`month of year` options carry U+0008. | Figma props |
| Low | Story | Title "Date picker" vs file name `DatePicker`; no `component` in meta. | DatePicker.stories.tsx |

---

## 5. CodeView

### 1. Figma
- No CodeView component exists. A library search for "code" returns only set `code` (key b709f7a4..., imported id 8201:6873): theme = Light|Dark, 18x18 variants, i.e. a `</>` icon. A scan of Document and Modal pages found no code-block frame. (Only searched via the design-system search and two pages, not every page.)

### 2. Code
- `src/CodeView/CodeView.tsx`: `CodeViewProps extends BaseStyleProps { onClickCopy?: () => void }`. Container is `Scroll` 100% x 556px (450px at `md`), 30px padding, 4px radius, `theme.colors.code` bg, `#ffffff` text, 2px transparent border, hardcoded scrollbar rgba whites; Copy button top 20/right 20, `#e5e5e5`, `CopyIcon` 20px, `Typo variant="button"`.

### 3. Storybook (`stories/data-display/CodeView.stories.tsx`, title "Data Display/Code View")
- `data-display-code-view--default`: `<Typo>Hello</Typo>` child only; no `onClickCopy`, so the copy button never shows; no Figma link.

### 4. Inferred mapping
None; no Figma counterpart. (The Figma `code` set is an icon, not this component.)

### 5. Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma | Code view has no Figma component; a shipped library component is undocumented in the design file. | search_design_system "code" (icon only) |
| Medium | Code | Hardcoded colors (`#ffffff`, `#e5e5e5`, `#E5E5E5`, rgba whites) and sizes (556px, 450px, 30px, 20px) violate token rules; no light/dark behavior (`colors.code` only). | CodeView.tsx |
| Medium | Stories | Copy button state never shown (no `onClickCopy` arg); no long-content/scroll story. | CodeView.stories.tsx |
| Low | Docs | JSDoc omits `onClickCopy`; `<pre>` wraps `Typo` (a block element) in the story. | CodeView.tsx / story |

---

## 6. UsageBar and UsageBarContent

### 1. Figma
- No dedicated component set. Closest: Progress v1 (25:442) set `1424:1266` "Progress" with type = Basic | Small | Round | SoundWave, state = Default | Medium (SoundWave only), theme = Light|Dark (10 variants). Story links point at `1424:1226` (Progress type=Basic, light; children "max usage", "used"), so Basic Progress is the design reference for UsageBar. Usage text frames `Progress_Usage` (283:4334, 283:4386) with `usage` sub-frames (e.g. "112,345 min 12 sec") are page layouts, not components.
- UsageBarContent story links to `3249:3214` which is an instance of `Btn/primary/solid/default/none` ("Contact Us") on Button v1, i.e. the wrong node.

### 2. Code
- `src/UsageBar/UsageBar.tsx` `UsageBarProps<ItemT>`: `className?, currentValueLabel?, currentValueLabelColor?, maxValueLabel?, height?: number (default 20), data?: ItemT[], borderRadius?: number (default 4), renderItem?`. Track `grey[20]`; labels `Typo h5`; max label `grey[50]`, right aligned; 10px bottom margin.
- `src/UsageBarContent/UsageBarContent.tsx` `UsageBarContentProps`: `className?, isFirst?, isLast?, color?: string, width: number (percent), borderRadius? = 4, onMouseOver?, onMouseOut?`. Default fill `blue[60]`, `cursor: pointer`.

### 3. Storybook
- `data-display-usage-bar--default` (title "Data Display/Usage Bar"): label "10 min 30 sec" / "1000 min", one segment width 50, `data` colors (`"black"`) not applied to `UsageBarContent`. Figma link 1424-1226.
- `data-display-usagebarcontent--default`, `--full-width`, `--multiple-segments` (title "Data Display/UsageBarContent"): hardcoded hex colors (#007bff, #28a745, #ffc107, #dc3545), track `#f0f0f0`. Default links to 3249-3214 (wrong node).

### 4. Inferred mapping
| Figma | Code |
|---|---|
| Progress type=Basic, state=Default | `UsageBar` + one `UsageBarContent` |
| "max usage" text | `maxValueLabel` |
| "used" text / bar | `currentValueLabel`, `UsageBarContent width` |
| theme Light/Dark | ThemeProvider |
| Progress type=Small / Round / SoundWave | no UsageBar equivalent (belongs to feedback/Progress group) |

### 5. Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma | No dedicated UsageBar/UsageBarContent component; mapping to Progress Basic is inferred only from a story link. Multi-segment bar (several colors) not designed in Figma. | Figma 1424:1266 variants |
| High | Stories | UsageBarContent Default story links to a Button instance (3249:3214), wrong node. | story `design.url` |
| Medium | Stories | Hardcoded hex colors and track color bypass tokens; UsageBar story `data` is unused by `renderItem`. | UsageBarContent.stories.tsx; UsageBar.stories.tsx |
| Medium | Code | `UsageBarContent` has `cursor: pointer` and hover handlers but no hover state in Figma; `color` is free string (no semantic tokens); no dark-specific handling beyond theme colors. | UsageBarContent.tsx |
| Low | Naming | Story titles inconsistent: "Usage Bar" vs "UsageBarContent"; `SenseUsageBar` internal name; non-`$` prop `height`/`isMaxUnit` forwarded to DOM styled components. | UsageBar.tsx |
| Low | Docs | JSDoc `@see` ids (`data-display-usagebarcontent--default`) should match story titles. | UsageBarContent.tsx |

---

## Totals
- High: 10 (Card 2, Chip 1, Table 2, Date picker 2, CodeView 1, UsageBar 2)
- Medium: 20 (Card 5, Chip 4, Table 4, Date picker 3, CodeView 2, UsageBar 2)
- Low: 13

## Top issues
1. Table, Card, Chip(tag) and Date picker: the library ships no Figma-level visual API. Table styling lives only in stories; Card types/sizes are not props; Date picker is not in the library at all.
2. No Figma components for CodeView or UsageBar/UsageBarContent; UsageBarContent story links to a Button node (3249:3214).
3. Chip Tag chip Active (open dropdown) has no code state; `TypeSelectButton` (client) is an unmapped card-like tile.
