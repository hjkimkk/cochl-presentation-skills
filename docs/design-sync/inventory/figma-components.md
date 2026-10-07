# Figma component inventory: Cochl Design System (aUrjRMAnE8ND8o6lAI0VcM)

Pages scanned: 14 of 15. Skipped: Welcome (0:1; cover page, only instances of components, no definitions).
All design pages carry a "v1" suffix except "Date picker". No v2 duplicates found. Progress and Date picker pages could not be read via get_metadata (output truncation error); see rows.

| Family | Page | Frame id | Variants | Symbols | Notes |
|---|---|---|---|---|---|
| Tabs | Tabs v1 (25:444) | 1516:1973 | theme: Light|Dark; type: Basic; state: Default|Focus|Active | 6 | Page name carries v1 suffix. Spec frames on page are mis-named 'InputField_Specs/Light' (copy-paste from Input Field page); 'Frame 1269' is ... |
| Alert | Alert v1 (25:441) | 1372:2003 | theme: Light|Dark; type: Basic|Link; state: Success|Error | 8 | Page name carries v1 suffix.  |
| Alert_Icons | Alert v1 (25:441) | 3132:5485 | theme: Light|Dark; state: Success|Error | 4 | Page name carries v1 suffix. Sub-component of Alert. |
| Progress | Progress v1 (25:442) | - | - | 0 | Page name carries v1 suffix. INCOMPLETE: get_metadata for this page fails deterministically (SSE JSON truncation at ~45KB), so frame id, var... |
| Menu | Menu v1 (27:445) | 1765:1692 | theme: Light|Dark; type: Notification|UserMenu|Basic; state: Default|Empty; notifOn: true|false | 10 | Page name carries v1 suffix.  |
| MenuItem | Menu v1 (27:445) | 1821:1070 | theme: Light|Dark; type: Basic; state: Default|LastItem; notifOn: true|false | 8 | Page name carries v1 suffix. Sub-component of Menu. |
| Tooltip | Tooltip v1 (27:446) | 3117:3637 | theme: Light|Dark; type: top-left|top-middle|top-right|side-left|side-right|bottom-left|bottom-middle|bottom-right | 16 | Page name carries v1 suffix. Page also has non-component spec frames 'Tooltip/light' and 'Tooltip/dark' (frames 208:1619, 3116:3394) with to... |
| Chip | Chip v1 (12:2472) | 1350:640 | theme: Light|Dark; type: Clickable|Closable|Unclickable|Tag chip; status: Default|Active; left-icon: false|true; right-icon: false|true | 22 | Page name carries v1 suffix.  |
| Table | Table v1 (16:2873) | 2068:308 | theme: Light|Dark; type: Basic; state: Default | 2 | Page name carries v1 suffix.  |
| Table_Header | Table v1 (16:2873) | 2068:319 | theme: Light|Dark; type: Basic; state: Default | 2 | Page name carries v1 suffix. Sub-component of Table. |
| Table_Body | Table v1 (16:2873) | 2071:158 | theme: Light|Dark; type: Button|Basic|Secondary|Chip; state: Default; isLastItem: true|false | 17 | Page name carries v1 suffix. Sub-component of Table. |
| Date picker | Date picker (1439:1380) | - | - | 0 | Unversioned page name. INCOMPLETE: get_metadata for this page fails deterministically (SSE truncation at ~20KB), so frame ids/variants/symbo... |
| Checkbox | Checkbox v1 (52:717) | 136:109 | isChecked: True|False; theme: Light|Dark | 4 | Page name carries v1 suffix. Two separate component sets on page: box (16x16) and 'Option' (checkbox with label). |
| Checkbox/Option | Checkbox v1 (52:717) | 136:179 | isChecked: True|False; theme: Light|Dark | 4 | Page name carries v1 suffix. Checkbox with label; frame name is 'Option'. |
| Button | Button v1 (52:718) | 3251:7381 | theme: Light|Dark; category: Primary|Secondary; type: Basic|Red|md|sm|lg|Link|ComplexButton; state: Default|Disabled|Hovered; leftIcon: false|true; rightIcon: false|true | 210 | Page name carries v1 suffix. Large set; type mixes style (Basic/Red/Link/ComplexButton) and size (sm/md/lg); verify combos per category. |
| Input Field | Input Field v1 (52:720) | 1174:283 | theme: Light|Dark; type: Basic|withIcon|smIcon|TagChipInput|NonEditable; state: Default|Focus|Active|Filled|Error|DefaultLabel|smDesc|withIcon|bigLabel; isDisabled: true|false | 50 | Page name carries v1 suffix. state mixes interaction states with layout variants (DefaultLabel, smDesc, withIcon, bigLabel); likely messy. |
| Dropdown | Dropdown v1 (28:538) | 1259:1277 | theme: Light|Dark; type: sm|timePicker|emailSelect; state: Default|Focus|Active|ActiveFocus|disabled|Filled|FilledActive|FilledFocus | 34 | Page name carries v1 suffix. State coverage differs by type: sm and timePicker use Default/Focus/Active/ActiveFocus/disabled; emailSelect ad... |
| Radio | Radio v1 (52:723) | 3116:3045 | theme: Light|Dark; type: Basic; state: Default|Hovered|Selected; withLabel: true|false | 12 | Page name carries v1 suffix. Spec frames on page are misnamed 'Chip'; note on page says light theme has no current usage so values may be in... |
| Icons | Icons v1 (1166:305) | 2731:635 | theme: Light|Dark; size: sm|lg; type: Main|Gray|Pending; notifOn: off|true | 56 | Page name carries v1 suffix. Icon library: 24 sub-families, each its own frame with theme=Light|Dark symbols (Plus, Minus, ArrowDown[size], ... |
