# Mismatch audit: feedback-overlay (Alert, Progress, Skeleton, Menu, Tooltip, Modal)

Sources: Figma `aUrjRMAnE8ND8o6lAI0VcM` (pages 25:441, 25:442, 25:443, 27:445, 27:446, 27:447, plus Navigation page 1185:1204 for NavButton); GitHub `cochlearai/cochl-dashboard@80da7dd` `packages/cochl-ui/src/*` and `stories/{feedback,navigation}`; app usage in `packages/client` (code search). Live Storybook index.json was not fetched; story ids are derived from story `title` + export name (Storybook kebab-case).

Note on story titles: Toast/Banner/Notification are all `Feedback/Alert`; Progress and CircleProgress are `Feedback/Progress`; Skeleton `Feedback/Skeleton`. But **Modal, ConfirmModal are `Overlay/Modal`, InfoTooltip is `Overlay/Tooltip`, Menu is `Overlay/Menu`** (not Feedback/ or Navigation/ as the folder suggests).

---
## 1. Alert (Figma page 25:441)

### Figma
- Set `1372:2003` Alert: `theme` Light|Dark, `type` Basic|Link, `state` Error|Success; TEXT props `Text`, `Hyperlink`. 8 variants, each 430x50. Default text "Project key has been reset"; Link type adds a "View project" link.
- Set `3132:5485` Alert_Icons: `theme` Light|Dark, `state` Error|Success (4 variants).
- Page also has Light/Dark spec frames (`Alert/Light` 1372:1876, `Alert/Dark` 1374:2496), colour callouts "Background color #EDF0FF" and "#FF7A00" (the latter is likely an annotation, not the error bg), and two stray instances `5294:221/222`.

### Code (three components share the "Alert" story group)
- `Toast` (`src/Toast/Toast.tsx`): `ToastProps { open: boolean; onClose; onClick?; message: string|ReactNode; severity: "info"|"error"; buttonText?: string }` (Toast.tsx:~95-102). Fixed bottom-centre, 50px tall, auto-dismiss 6000ms, fade animation. Colours hard-coded `#EDF0FF`/`#FFF4F4` backgrounds, `colors.blue[60]` / `colors.red` border and text; theme from styled-components (`useTheme`), no theme prop.
- `Banner` (`src/Banner/Banner.tsx`): `BannerProps { onClose? }` + children; full-width gradient `linear-gradient(90deg,#edf0ff 52.19%,#4b68ff 127.97%)`; no severity.
- `Notification` (`src/Notification/Notification.tsx`): `{ onClick?, className?, confirmed? }`. This is the **bell icon** (red dot vs black), not an alert at all. See Menu section for the Figma counterpart.
- App wrappers: `packages/client/src/components/InfoToast`, `ErrorToast` (wrap Toast with severity info/error; mounted in `App.tsx`).

### Storybook
- `feedback-alert--error-toast`, `--info-toast` (Toast.stories.tsx; each has a Figma node link 1372-1895 / 1372-1893).
- `feedback-alert--banner-story` (Banner.stories.tsx; Figma url is empty string).
- `feedback-alert--notification-story`, `--confirmed`, `--without-click` (Notification; link node 3249-3214).
- No story shows `buttonText`/`onClick` (Link type), no dark theme variant story.

### Inferred mapping
| Figma | Code |
|---|---|
| Alert type=Basic, state=Success | `Toast severity="info"` (no buttonText) |
| Alert type=Basic, state=Error | `Toast severity="error"` |
| Alert type=Link, state=Success/Error | `Toast severity=... buttonText="..." onClick=...` |
| Alert `Text` | `message` |
| Alert `Hyperlink` | `buttonText` |
| Alert_Icons Success/Error | `ToastCheckIcon` / `ToastErrorIcon` |
| theme Light/Dark | styled-components theme (global), not a prop |
| (no Figma) | `Banner` |
| (no Figma alert; see Menu) | `Notification` |
mapping.json current `Alert -> Toast` is right; `Banner` and `Notification` should be mapped separately or flagged unmapped.

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma vs code | `Banner` has no Figma component (stories link is empty) and `Notification` (bell) is filed under Feedback/Alert although Figma Alert has no bell. Three unrelated components share one Storybook group. | Banner.stories.tsx url `""`; Notification.tsx |
| Medium | Naming | Figma state `Success` vs code severity `info`; Figma has no "info" state. | Toast.tsx severity `"info"\|"error"` |
| Medium | Figma vs code | Figma has no close icon in Alert variants (430x50 text + optional link), code always renders `ToastCloseIcon`. Not verified visually; check. | Toast.tsx close icon unconditional |
| Medium | Toast tokens | Background hex hard-coded (`#EDF0FF`, `#FFF4F4`) and `colors.white` overridden; violates "no hardcoded colors"; dark theme appearance unverified (Figma Dark variants exist). | Toast.tsx Container |
| Medium | Storybook | No story for Link type (`buttonText`+`onClick`) nor dark theme. | Toast.stories.tsx |
| Low | Story ids | Story export names `ErrorToast`/`InfoToast` vs Figma `Error`/`Success`. | Toast.stories.tsx |
| Low | Docs | `@see` links point to `feedback-toast--default`, but story title is `Feedback/Alert` (broken id). Same for Banner and Notification docs links. | Toast.tsx doc, Banner.tsx doc |
| Low | Story design links | Story Figma links use file name `Dashboard_Design_System_v3` (old file name); node ids 1372-1893/1895 are not variant ids in the current set. | Toast.stories.tsx |

---
## 2. Progress (Figma page 25:442)

### Figma
- Set `1424:1266` Progress: `theme` Light|Dark, `type` Basic|Round|Small|SoundWave, `state` Default|Medium. 10 variants (not the full 16 matrix):
  - Basic (453x20): `max usage` track + `used` frame (a usage/segmented bar), Default only.
  - Small (453x2): thin bar, Default only.
  - Round (50x50): ellipse, Default only.
  - SoundWave Default (53x54, "loading_large") and Medium (31x28, five bars). Light/SoundWave/Default contains an instance of Progress itself; Dark/SoundWave/Default is a group (inconsistent construction).
- Page also has two `Progress_Usage` frames.

### Code
- `ProgressIndicator` (`src/ProgressIndicator/ProgressIndicator.tsx`): `{ size?: "large"|"medium" (default large); color?: string; className; style }`. 5-bar animated wave. Large = 5x54px bars, medium = 3x28px; default colours black (large) / grey[70] (medium).
- `CircleProgress`: `{ percent: number; children; style; className }`; conic-gradient, ring colour `colors.blue[60]`, remainder hard-coded `#ecf0f1`, inner `colors.white`.
- `UsageBar` (`src/UsageBar/UsageBar.tsx`, data-display): generic `data` + `renderItem`, `height` (default 20), `borderRadius`, labels. This is the closest code match to Figma Basic (453x20) and Small (2px) bars; there is no dedicated linear progress.

### Storybook
- `feedback-progress--large`, `--medium` (ProgressIndicator; node links 1424-1260 / 1424-1258).
- `feedback-progress--circle-progress-story` (CircleProgress, percent 70, 50x50; node 1424-1235). File name is `CircleProcess.stories.tsx` (typo).

### Inferred mapping
| Figma | Code |
|---|---|
| type=SoundWave, state=Default | `ProgressIndicator size="large"` |
| type=SoundWave, state=Medium | `ProgressIndicator size="medium"` |
| type=Round | `CircleProgress percent=N` |
| type=Basic | `UsageBar` (height 20) -- no Progress prop; mapping needs confirmation |
| type=Small | none (UsageBar `height=2` approximates) |
| theme Light/Dark | styled-components theme |

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma vs code | Figma `type=Small` (2px linear bar) has no code component or story. | Figma 1424:1266; no component in src |
| High | Figma vs code | Figma `type=Basic` linear bar maps to `UsageBar` (different component, different story group Data Display); there is no `Progress` code component with linear types. | UsageBar.tsx |
| Medium | Naming | Figma `state=Default|Medium` is really a size axis; code uses `size="large"|"medium"` (Default == large). Figma `type` mixes shape (Round/Basic/Small) and loader (SoundWave). | Figma props; ProgressIndicator.tsx |
| Medium | Split in code | One Figma set maps to three code components (ProgressIndicator, CircleProgress, UsageBar); CircleProgress shows static percent while Figma Round is a 50x50 ellipse group (probably a spinner); behaviour not verified. | CircleProgress.tsx |
| Medium | Dark theme | Figma has Dark for all; code colours resolve via theme but `#ecf0f1` track is hard-coded (wrong on dark). | CircleProgress.tsx |
| Low | Story | Story file typo `CircleProcess.stories.tsx`; story export `CircleProgressStory`. | stories/feedback |
| Low | Props | `color?: string` in ProgressIndicator bypasses tokens. | ProgressIndicator.tsx |

---
## 3. Skeleton (Figma page 25:443)

### Figma
- Sets: `1913:12477` Skeleton (theme Light|Dark; the property name contains a U+0008 char, i.e. `\btheme`), `1913:12479` SkeletonText (theme), `1913:12496` SkeletonCircle (theme). 2 variants each. Frames: Usage 281:1136, Demo 281:2388, Demo 1913:12486.

### Code
- `Skeleton` (`src/Skeleton/Skeleton.tsx`): `{ variant?: "rectangle"|"circle"|"text" (default "text"); width?: number; height?: number; style; className; children }`. Colour `grey[20]`; radius circle 50%, rectangle 0, text 4px. Width/height default to 0px (collapses if omitted).

### Storybook
- `feedback-skeleton--reactangle` (typo in export `Reactangle`), `--text`, `--circle`. Each links to Figma node 281-2389/2390/2391 (old Usage frame nodes, not sets).

### Inferred mapping
| Figma | Code |
|---|---|
| Skeleton | `variant="rectangle"` |
| SkeletonText | `variant="text"` |
| SkeletonCircle | `variant="circle"` |
| theme | global theme |

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| Medium | Figma vs code | Figma has three separate sets; code a single component with `variant`. Rectangle radius in Figma not verified (code 0px but the rectangle story overrides to 4px in two of three rows, suggesting design wants 4px). | Skeleton.stories.tsx Rectangle template |
| Medium | Figma naming | `\btheme` (backspace char) property name in Skeleton set breaks property-name matching. | Figma 1913:12477 |
| Low | Story | Export typo `Reactangle`; doc comment says `reactangle`. | Skeleton.stories.tsx, Skeleton.tsx |
| Low | Props | No default size; width/height 0 means invisible unless set. Figma sizes not recorded. | Skeleton.tsx |
| Low | Dark | No dark story; `grey[20]` token under dark theme not checked against Figma Dark. | Skeleton.stories.tsx |

---
## 4. Menu (Figma page 27:445)

### Figma
- Set `1765:1692` Menu: `theme` Light|Dark, `type` Notification|UserMenu|Basic, `state` Default|Empty, `notifOn` false|true. 10 variants, 310px wide:
  - Notification/Default (310x161, notifOn true and false), Notification/Empty (310x115): header "Notifications" + "Mark all as read", item "You have got an invitation maxmaxmax..." "5 hours ago", empty text "You have no notifications".
  - UserMenu/Default (310x282): avatar "n", "name here", "hello@example.com", "Enterprise", "Upgrade plan", "My account", "Light", "Change theme".
  - Basic/Default (310x212): three "Menu Item" rows.
  - Combos present: Light has Notification x3, UserMenu, Basic; Dark has Notification x3, UserMenu only (no Dark/Basic).
- Set `1821:1070` MenuItem: `Text`, `theme` Dark|Light, `type` Basic, `state` Default|LastItem, `notifOn` false|true (8 variants).
- No closed/trigger state in the Menu set. The trigger: Figma has Navigation `NavButton` (set 6535:417; `theme`, `selected` true|false, text "Projects") which is a **nav text link, not a menu trigger**. No Figma bell button or avatar trigger component found on the Menu page (the Menu usage frame 204:1469 not enumerated further).

### Code (`src/Menu`)
- `Menu` `{ children; className; style }` fixed width 280px, white bg, radius 4, shadow `rgba(152,152,152,0.3)` hard-coded (Menu.tsx).
- `MenuItem` `{ icon?; trailing?; padding?; gap?; collapseTop?; onClick? }`; default padding "20px 30px 20px 20px"; dividers via `& + &` padding trick, no `state` prop.
- `NotificationMenu` `{ notifications: {id,title,time,read?}[]; onMarkAllAsRead?; onNotificationClick? }`: header, divider, items, empty text "You have no notifications"; "Mark all as read" disabled when no unread.
- `NotificationMenuItem`: item divider shown except last (`showDivider`), unread red 6px dot.
- `UserMenu` `{ name; email; planLabel="Enterprise"; themeLabel="light"; onUpgradePlan; onMyAccount; onChangeTheme; onLogout; myAccountLabel; upgradePlanAction; changeThemeAction }`, width 300 (override), includes a "Logout" row.
- Triggers in code: `GNB` takes `notification?: ReactNode` and `profile?: ReactNode` slots (GNB.tsx), filled by `Notification` (bell, `confirmed` flag) and `UserProfile` (avatar, `text`, `size`). No open/closed state is owned by Menu; consumers manage it.

### Storybook (all in `Overlay/Menu`, file `stories/navigation/Menu.stories.tsx`)
- `overlay-menu--basic` (4 items), `--notification` (1 unread + 1 read), `--notification-empty`, `--user-menu-story` ("User Menu"). No dark story, no trigger story, no `NotificationMenuItem`/`MenuItem` isolated story.

### Inferred mapping
| Figma | Code |
|---|---|
| Menu type=Basic | `Menu` + `MenuItem` children |
| Menu type=Notification, state=Default | `NotificationMenu notifications=[...]` |
| Menu type=Notification, state=Empty | `NotificationMenu notifications={[]}` |
| Menu type=UserMenu | `UserMenu` |
| Menu `notifOn` true/false | `NotificationMenuItem notification.read=false/true` (unread dot) |
| MenuItem state=LastItem | `NotificationMenuItem showDivider={false}` (last item), `MenuItem` none |
| MenuItem `Text` | children |
| theme Light/Dark | global theme |

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma vs code | No Figma component for the open/closed trigger of Menu (bell, avatar). In code the triggers are `Notification`/`UserProfile` passed into `GNB` slots. Figma NavButton is unrelated (nav text). Closed state undefined in both. | Figma NavButton 6535:417 props; GNB.tsx |
| High | Dark theme | Figma Menu lacks Dark/Basic variant; Figma Notification Dark `notifOn=false` only in Default... overall Light has 6 variants vs Dark 4, so Dark Basic menu is undesigned while code supports it via theme. | Figma variant list |
| Medium | Width | Figma menus are 310px wide; code `Menu` 280px, `UserMenu` 300px. | Menu.tsx; UserMenu.tsx |
| Medium | Naming | Figma `state=Default|Empty` is a data state; `notifOn` boolean is item-level unread; MenuItem `state=LastItem` is a layout rule (no divider). None exist as code props with those names. | Figma props |
| Medium | Figma vs code | Code `UserMenu` has a "Logout" row and `myAccountLabel`; Figma UserMenu text list shows no "Logout" (may be below the 8-text cap; verify). | UserMenu.tsx |
| Medium | Tokens | Shadow `rgba(152,152,152,0.3)` hard-coded in Menu; `font-family: Roboto` hard-coded in MarkAllButton; dark theme unverified. | Menu.tsx; NotificationMenu.tsx |
| Medium | Figma construction | Figma Menu `Basic` is built with three "Menu Item" instances whose count/labels are fixed (no slots); code accepts any children. Light-theme MenuItem sets for `notifOn=true` exist for `type=Basic`, which is meaningless (notification flag on a Basic item). | Figma 1821:1070 |
| Low | Story naming | `Overlay/Menu` group while Figma page is "Menu" under navigation; folder `stories/navigation` but title Overlay; `UserMenuStory` named "User Menu". | Menu.stories.tsx |
| Low | Docs | Menu components have no `@see` Storybook link; `NotificationMenuItem` undocumented props (`showDivider` etc.). | Menu.tsx, NotificationMenuItem.tsx |
| Low | Defaults | `themeLabel="light"` default shows lowercase text (Figma "Light", CSS capitalises first letter, fine). `planLabel` default hard-codes "Enterprise". | UserMenu.tsx |

---
## 5. Tooltip (Figma page 27:446)

### Figma
- Set `3117:3637` Tooltip: `theme` Dark|Light, `type` side-left|side-right|top-left|top-middle|top-right|bottom-left|bottom-middle|bottom-right (8 placements x 2 themes = 16), TEXT `Text`. Frames Tooltip/light 208:1619, Tooltip/dark 3116:3394.

### Code
- `InfoTooltip` (`src/InfoTooltip/InfoTooltip.tsx`): `{ open: boolean; text: string|ReactNode; position?: "top"|"bottom"|"left"|"right" (default "top"); onMouseOver?; onMouseOut?; style; className; children }`. Built on `Popover` (react-tiny-popover), `align="center"`, arrow size 6, padding 6, max width 286px, bg `grey[90]` with white text regardless of theme. Default trigger = grey[50] `InfoIcon` 20px.

### Storybook
- `overlay-tooltip--default` only (text "Tooltip", position default top, hover to open; node link 3117-3627).

### Inferred mapping
| Figma | Code |
|---|---|
| type=top-middle | `position="top"` (align center) |
| type=bottom-middle | `position="bottom"` |
| type=side-left / side-right | `position="left"` / `"right"` |
| top-left/top-right/bottom-left/bottom-right | none (align is fixed to center) |
| Text | `text` |
| theme Dark/Light | none (always grey[90] bg) |

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma vs code | Four corner placements (top-left, top-right, bottom-left, bottom-right) cannot be produced; code has no `align` prop. | InfoTooltip.tsx `align="center"` |
| High | Theme | Figma has Light and Dark tooltip variants; code always renders dark `grey[90]` box; Light tooltip not possible. (Check grey[90] under dark theme: likely inverts.) | InfoTooltip.tsx InfoPopoverContent |
| Medium | Naming | Figma `side-left/right` + `top-middle` vs code `left/right/top`; mapping needs a normaliser. | Figma props; code type |
| Medium | Behaviour | `reposition` flips the tooltip automatically so rendered placement may differ from the requested one. Not in Figma. | InfoTooltip.tsx `reposition` |
| Medium | Storybook | Single story; no placements, no long text/ReactNode, no dark. Group `Overlay/Tooltip`. | InfoTooltip.stories.tsx |
| Low | Naming | Component is `InfoTooltip` (info-icon trigger) while Figma is generic "Tooltip". | |
| Low | Docs | `@see` link uses `feedback-info-tooltip--default`, but the real id is `overlay-tooltip--default`. | InfoTooltip.tsx |

---
## 6. Modal (Figma page 27:447)

### Figma
- `ModalOverlay` component 1869:1060 (dim overlay).
- Set `1869:1110` ModalContent: `theme` Light|Dark, `type` "Modal with subtitles and cta"|"Modal with heading", `state` Default|Enabled (U+0008 in the property name, i.e. `\bstate`); BOOLEAN `Subtitles`, `CloseToggle`, `Button`; TEXT `Title`, `Subtitles2`. Only 4 variants exist:
  - Light/with subtitles and cta/Enabled 686x526
  - Dark/with subtitles and cta/Enabled 686x526
  - Light/with heading/**Default** 820x276
  - Dark/with heading/**Enabled** 820x276 (state naming inconsistent between Light and Dark).
- Usage frames on the page: `Create project modal` (2439:2747 820x516, 2521:3541 and 2549:3795 686x526), `Edit_device_modal` 2439:2904, `Webhook_Modal_TagList` (2439:2925, 2439:3070), `Delete project modal` (2439:3054, 3068, 3201, 3278), `Analytics_Modal_3` 2439:3203, `Modal/Small` 2439:3527 (540x284), `Modal/ContinueAbort/{Default,addCard,delete}` (3399:725, 692, 706 and 2439:3654), `Price_Plan_Modal` 2439:3549, `Modal/Light` 2514:3183, `Modal/Dark` 2496:1666.

### Code
- `Modal` (`src/Modal/Modal.tsx`): `ModalProps { open: boolean; onClose?; size?: "small"|"medium"|"large" (default medium); dim?: boolean (default true); className; style }`. Dim overlay `rgba(19,19,19,0.4)` hard-coded; Esc and click-outside close; radius 4; shadow from `colors.shadow` @ 0.1. Widths from `MODAL_WIDTH_BY_SIZE` (lib/constants; values not read).
- `ConfirmModal` (`src/ConfirmModal/ConfirmModal.tsx`): `{ open; onClose; onAbort?; onConfirm?; title; subTitle?: string|ReactNode; confirmText?; abortText?; warning?; confirmDisabled?; size?; children }`; wraps Modal (padding 50px), h1 title, close icon, h5 subtitle (red if `warning`), button row (secondary cancel / primary or danger confirm, both 50px high).
- App usage: ConfirmModal used by ~19 client files (delete tag, billing delete card, webhook modal, upload/record voice, edge-sdk device modal, price plan, project settings, etc.). `ProjectCreateModal` lives in client.

### Storybook (`Overlay/Modal`)
- `overlay-modal--default` (Modal, plain "Hello"), `--modal-without-dimmed-background`, `--modal-with-heading` (named "Modal content/Modal with heading"; built with ConfirmModal "Add member"), `--modal-with-subtitles-and-cta` (custom composition with Input and Cloud API/Edge SDK type selector and Create project CTA, built from Modal in the story only), `--confirm-modal-story` (ConfirmModal "Test" with subtitle and Confirm button).

### Inferred mapping
| Figma | Code |
|---|---|
| ModalOverlay | `Modal dim` (default true) |
| ModalContent type="Modal with heading" | `ConfirmModal title subTitle onAbort onConfirm` (story ModalWithHeading) |
| ModalContent type="Modal with subtitles and cta" | story-local composition (`ModalWithSubtitlesAndCtaExample`) -- no library component; the real one is client `ProjectCreateModal` |
| ModalContent `Title` | `title` |
| ModalContent `Subtitles` (bool) / `Subtitles2` (text) | `subTitle` (present or absent) |
| ModalContent `CloseToggle` | none (close icon always rendered, close handled by `onClose`) |
| ModalContent `Button` (bool) | `onAbort` / `onConfirm` presence |
| state Default/Enabled | none (no state) |
| theme Light/Dark | global theme |
| Modal/Small (540x284) | `size="small"` (width unverified) |
| Modal/ContinueAbort/* | `ConfirmModal` (warning for delete) |

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma vs code | "Modal with subtitles and cta" exists only as a story-local component (`ModalWithSubtitlesAndCtaExample`); no library component. Figma usage frames "Create project modal (API/SDK)" map to client `ProjectCreateModal`, not the library. | Modal.stories.tsx; client/components index exports `ProjectCreateModal` |
| High | Figma vs code | Figma `Delete project modal`, `Webhook_Modal_TagList`, `Edit_device_modal`, `Analytics_Modal_3`, `Price_Plan_Modal` have no story. Code equivalents exist only in the app (DeleteTagModal, WebhookModal, EdgeSdkDeviceModal, PricePlan*Modal). Delete/danger modal is covered only via `ConfirmModal warning` with no story showing `warning`. | story list; client search |
| Medium | Figma | `state` property: Default vs Enabled used inconsistently (Light heading = Default, Dark heading = Enabled), and property name carries U+0008; only 4 of 8 possible combos exist (no Light/Dark pairs for either type with same state). | Figma 1869:1110 |
| Medium | Props | Figma `CloseToggle` boolean has no code equivalent (close icon is hard-wired in ConfirmModal; bare `Modal` has no close icon). | ConfirmModal.tsx |
| Medium | Sizes | Figma widths 540 / 686 / 820 / 990 vs code size small/medium/large (constants not read); mapping Figma width to `size` not documented. | Figma frames; Modal.tsx |
| Medium | Tokens | Overlay `rgba(19,19,19,0.4)` hard-coded in Modal; no use of a Figma overlay token (ModalOverlay fill not extracted). | Modal.tsx Background |
| Medium | Naming | Figma "Modal with heading" implies title-only heading + subtitle; code story names the same thing "Modal content/Modal with heading" built from ConfirmModal while `ConfirmModalStory` duplicates it under a different name (two stories for one Figma variant). | stories |
| Low | Story | Both Modal and ConfirmModal stories link to Figma node 2509-2698 for different variants; ConfirmModal link 1869-1077 not a current set id. | stories |
| Low | Docs | `@see` ids: `feedback-modal--default`, `feedback-confirm-modal--default` (actual: `overlay-modal--default`, `overlay-modal--confirm-modal-story`). | Modal.tsx, ConfirmModal.tsx |
| Low | Behaviour | `Modal.dim=false` (no Figma equivalent) has its own story. | Modal.stories.tsx |

---
## Counts
| Component | High | Medium | Low |
|---|---|---|---|
| Alert | 1 | 4 | 3 |
| Progress | 2 | 3 | 2 |
| Skeleton | 0 | 2 | 3 |
| Menu | 2 | 5 | 3 |
| Tooltip | 2 | 3 | 2 |
| Modal | 2 | 5 | 3 |
| **Total** | **9** | **22** | **16** |

Caveats: width/size constants (`MODAL_WIDTH_BY_SIZE`), exact Figma colours/radii per variant, and live Storybook ids were not verified; the Alert close-icon and UserMenu "Logout" findings are unconfirmed (flagged Medium for verification).

## Top issues
1. Tooltip: code supports 4 placements (centre aligned) and only a dark box; Figma has 8 placements x Light/Dark (corner placements and light tooltip impossible).
2. Progress: Figma `Basic` and `Small` linear bars have no Progress component (Basic ~ `UsageBar`, Small nothing); `state=Medium` is really a size.
3. Modal: "Modal with subtitles and cta" and the Create/Delete project, webhook, edit device modals exist only as story-local code or app code; no library component/story; Figma `state` Default/Enabled mislabelled.
4. Menu: no trigger/closed state in Figma (NavButton is unrelated nav text); code triggers live in GNB slots (`Notification`, `UserProfile`); Dark Basic menu missing; widths 310 vs 280/300.
5. Alert group: `Banner` has no Figma node and `Notification` is the bell, not an alert; Toast `severity: info` vs Figma `Success`; hard-coded hex.
