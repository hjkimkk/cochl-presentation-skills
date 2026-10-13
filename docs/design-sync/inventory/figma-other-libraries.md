# Figma other-libraries lookup (read-only)

Source: file `aUrjRMAnE8ND8o6lAI0VcM` (Cochl Design System), via get_libraries + search_design_system (2026-10-07).
Note: search returns component/set KEYS, not node ids; the "Node id" column holds the key (componentSetKey = set, componentKey = single component).
Abbreviations: CDS = Cochl Design System (subscribed library); ADDS = [DRAFT] Web Dashboard Design System (ADDS); B2C = B2C app.

## Libraries

| Library | Status | Key (prefix) |
|---|---|---|
| Cochl Design System | added to file (team) | lk-db58d5e516d8...5e8b7f5b40 |
| Material 3 Design Kit | available (community) | lk-5a31d104cabc... |
| Simple Design System | available (community) | lk-e0ffcff14368... |
| iOS and iPadOS 26 / watchOS 26 / visionOS 26 / macOS 26 / iOS and iPadOS 27 / macOS 27 | available (community) | (8 community kits total, none relevant) |
| B2C app | surfaced by search (not in get_libraries) | lk-b5bba11202dc... |
| [DRAFT] Web Dashboard Design System (ADDS) | surfaced by search | lk-91f9d3330423... |
| Dashboard_App_Design_System (DADS), Design_System, Dashboard_Ideation, Ideation/Cochl.Labs | surfaced by search (legacy) | lk-b66437f8..., lk-66eb1826..., lk-1d3b5023..., lk-7ff9b337... |

## Components

| Component | Found? | Library / file | Node id (key) | Match name |
|---|---|---|---|---|
| Modal | Yes | CDS; also B2C, ADDS | CDS set 9a9c2b4069a96933eafad3ffbfc8fbc2d35570a7; CDS ModalOverlay b80c81c0200d364126c48955546717c36f2a549b; B2C 282c03c3bffb83cf933b25126cd3dd3c36accf01; ADDS a969194e704f36cd07b606f5ea5e23df5364ed52 | ModalContent, ModalOverlay (CDS); Modal (B2C); Modal/ContinueAbort/Default (ADDS) |
| ConfirmModal | Partial (no exact name; ADDS only, legacy) | ADDS | 534b3a45c3ef5751e564b745e6ff5e99f2dff025 | Modal/ContinueAbort/delete |
| Popover | Yes | CDS (also ADDS) | PopoverList 66aa2d4fa2293ae981a947e8d6880d6cea8c10d9; PopoverItem f1ddcf7ebc9a44a323ca5833c5e765ee4172a970 | PopoverList, PopoverItem (CDS); Popover/text, /action, /divider (ADDS) |
| NumberInput | Yes | CDS | 2d8e568d3d5c4a8ba0f5253c52a9c7bc98e159c5 | Number Input |
| Card | Yes | CDS (also ADDS, B2C) | Card fc949a4f51da2362b539d085c802bd208e1deb6f; Cards/action 0d70d388a8a7cd7da35b6471ab054d265c8813f6; Cards/link 1c10946552925fd8aff946b8509bba0a57154dee | Card, Cards/action, Cards/link (CDS) |
| CodeView | Likely (name differs) | CDS | b709f7a44a9558c65e06964006520a559a4edc2a | code |
| UsageBar | No exact; closest is Progress | CDS | e242317d5a03597c2c3f178efe06ab4118439144 | Progress (not confirmed as usage bar) |
| UserProfile | No (only B2C "Person"/"Setting card"; not equivalent) | - | - | - |
| Avatar | No | - | - | - |
| Skeleton | Yes | CDS | Skeleton c78a2040baabd43bb8c7e7919c38ffbaefdb0a32; SkeletonText 8e515e3cac54e0451b348271db141e045007ff87; SkeletonCircle 38c81d06d40b7b8c6d5ec242d886a04d139250ac | Skeleton, SkeletonText, SkeletonCircle |
| Accordion / Accordian | No | - | - | - |
| GNB | Yes (CDS name differs) | CDS "Navigation"; ADDS "GNB"; B2C "GNB_wh" | CDS 1f48bc9f19b89909450b258bf1615f95c9cbbfb7; ADDS 53b92d303875a6101f4ee52ae4ece614c17f69ca; B2C 6c42a89cc236b8b1dff17f533f6f8bf299854de9 | Navigation (CDS), GNB (ADDS) |
| LNB | Legacy only | ADDS (CDS Navigation may cover) | 88fd669cbd5f22f14194b171e9295e8f2c7ccc38 | LNB |
| FNB | Legacy only | ADDS | 3b06ab1089630c0298555c0b33a9f37796cc6d28 | FNB |
| ProjectNavi / Project Navigation | No exact; related NavButton | CDS | NavButton defbc18eb70b61a49e4e9c360aaa7b079ecffb1a | NavButton (not confirmed) |
| Navigation | Yes | CDS | 1f48bc9f19b89909450b258bf1615f95c9cbbfb7 | Navigation |
| Heatmap | Yes (partial) | CDS | 842ff6de8970d12e3d8992b03fb07de2eaa16600 | Heatmap-value (plus Chart tooltip 701dfee94242b49163eb0d400cb4df3c4ece62c5) |
| PieChart / Pie Chart | No | - | - | - |
| BarChart / Bar Chart | No (B2C "Bar" is a generic bar, not a chart) | - | - | - |
| LineChart / Line Chart / Timeseries | No | - | - | - (CDS "EdgeSDK", "Group 1493" are not chart components) |
| Typography | No (text styles, not components) | - | - | - |
| Color | No (variables/styles, not components) | - | - | - |
| Scroll | No | - | - | - |
| Toast | Legacy / other lib only | ADDS (also B2C) | ADDS d2b412c40cb8fc7bb7cb8a69d4608b471e1f63b7; B2C 36305da2a26d50a2d6ee89cffb38573aad33f6f0 | Toast (ADDS) |
| Banner | No (B2C "Banner 320x100" is an ad size) | - | - | - |
| Notification | Yes (partial) | CDS | NotificationBell fbf58999755c39480578b8cb8e92380827341801 | NotificationBell (B2C has Notification) |
| Date picker | Yes | CDS | 569935bdf11bbd2fd142515d1536cc2e37eae6da | Date picker (+ date range days 8b24717488a61732da8a280dffb71417d5db0cd8) |
| Calendar | Yes (as Date picker) | CDS | 569935bdf11bbd2fd142515d1536cc2e37eae6da | Date picker (B2C has Calendar 99bb9c3c...) |
