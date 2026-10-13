# Mismatch audit: navigation-icons

Sources: Figma `aUrjRMAnE8ND8o6lAI0VcM` (read-only), GitHub `cochlearai/cochl-dashboard` @ sha 80da7dd (`packages/cochl-ui`), live Storybook index.json.
Paths below are relative to `packages/cochl-ui/`. Line numbers are not available from the GitHub reader; symbols are quoted instead.

Live story ids (index.json): `disclosure-tabs--{full-menu,states,with-count-badge,with-beta-chip}`, `disclosure-navigation--{gnb-story,states,projects,sub-page,project-navi-story,with-beta,fnb-story,projects-page,project-detail-page}`, `disclosure-accordian--default`, `overlay-user-profile--{small-profile,medium-profile}`, `theme-icons--{all-icons,large-icons,thumbs-down-variants}`.

---

## 1. Tabs

1. **Figma**: page `Tabs v1` (25:444); set `Tabs` 1516:1973 (6 variants). Props: `theme` Dark|Light, `type` Basic, `state` Default|Focus|Active, text prop `Text`. No hover, disabled, count or beta.
2. **Code**: `src/Tab/Tab.tsx` `TabProps extends BaseStyleProps` (no own props; renders `<ul>` in `Scroll`, bottom border `grey[30]`). `src/Tab/TabItem.tsx` `TabItemProps { selected?: boolean; onClick?: MouseEventHandler<HTMLLIElement> }`. Hover underline is CSS only. Colors: selected `blue[60]`, idle `grey[70]`, via `p.theme.colors` (no Dark theme map in the component).
3. **Storybook** (`stories/navigation/Tab.stories.tsx`, title `Disclosure/Tabs`): `full-menu` (5 items, interactive), `states` (Default, Focus via `FocusTabItem` styled override, Active), `with-count-badge` (local `CountBadge` styled span, not a library component), `with-beta-chip` (uses `Chip`).
4. **Mapping**

| Figma | Code |
|---|---|
| state=Default | `<TabItem>` |
| state=Active | `<TabItem selected>` |
| state=Focus | none (story hack `FocusTabItem`) |
| theme=Light/Dark | none (theme comes from styled-components ThemeProvider) |
| type=Basic | `Tab` + `TabItem` |

5. **Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Code | Figma `state=Focus` has no code prop or `:focus-visible` style. TabItem is an `li` with onClick only, so it is not keyboard focusable. | TabItem.tsx has no tabIndex or focus CSS; story fakes it with `border-bottom-color !important` |
| Medium | Code vs Figma | Figma Dark theme variants exist; the component has no theme prop and relies on the global theme object. | Figma `theme` Dark/Light; Tab.tsx uses `p.theme.colors.*` |
| Medium | Storybook | Count badge and beta chip stories are built from local styled spans, not library components. `LNBTabItem` and `ProjectNaviItem` do the same thing in the library, so the pattern is duplicated. | Tab.stories.tsx `CountBadge` duplicates LNBTabItem `CountBadge` |
| Medium | Storybook | Hover state exists in code but not in Figma or Storybook. | TabItem.tsx `&:hover` |
| Low | Figma | Spec frames on the Tabs page are misnamed `InputField_Specs` (copy-paste). | Task brief |
| Low | Code docs | JSDoc `@see` URLs use `navigation-tab--full-menu`; the live id is `disclosure-tabs--full-menu`. | Tab.tsx and TabItem.tsx JSDoc vs index.json |
| Low | Code | TabItem forces `font-weight: 400 !important` over Typo (`button` variant). | TabItem.tsx |

---

## 2. Navigation (GNB / LNB / FNB / ProjectNavi)

1. **Figma**: page `Navigation v1` (1185:1204).
   - Set `Navigation` 3602:1114 (48 variants). Props: `theme` Dark|Light, `type` GNB|LNB|Footer|ProjectNav, `state` Default, `size` xl|lg|md|sm|xs|mobile, text prop `project name`. Light and Dark each have 24 variants (4 types x 6 sizes).
   - Widths: xl 1920, lg 1440, md 1280, sm 1000, xs 960, mobile 768 (ProjectNav mobile is 786, which looks like a typo). Heights: GNB 66, LNB 206, Footer 66, ProjectNav 162.
   - Set `PageButton` 6533:2777 (8 variants): `theme` Light|Dark, `selected` false|true, `beta` true|false (and a BOOLEAN `beta`, which duplicates the variant prop), text `Text`.
   - Set `NavButton` 6535:417 (4 variants): `theme`, `selected`, text `Text`.
   - Also loose frames: `Navigation Bar/Dark` 1185:1205, `Navigation Bar/Light` 1185:1274, `Frame 1269:3350`, `Frame 39868:7091`, group `Group 812:8064`, and two screenshots. Leftover legacy content.
   - Composition: GNB has a logo (`logo_circlegrad_grey` rects), a `menu` frame, and instances of `NotificationBell` + `UserIcon` (25x25). LNB has the title text "Projects", a `Button` instance, tab frames, and a count group ("40"). ProjectNav has the title text, and `PageButton` instances (Overview, Upload, Speaker Recognition, Analytics, History, Post Actions, Settings). Footer is `FNB/Light` with the text "© 2024 Cochl Inc".
2. **Code**
   - `src/GNB/GNB.tsx` `GNBProps { logo: ReactNode; notification?: ReactNode; profile?: ReactNode }`, height 66px, inner width `media.size.lg`. `src/GNB/GNBLink.tsx` `GNBLinkProps { selected?, onClick? }` (18px, weight 700 selected/hover).
   - `src/LNB/LNB.tsx` `LNBProps { title: string; action?: ReactNode }` (padding-top 80, h1). `LNBTab.tsx` (no own props). `LNBTabItem.tsx` `{ label: string; count?: number; selected?; onClick? }`.
   - `src/FNB/FNB.tsx` `FNBProps { copyrightText: string }`.
   - `src/ProjectNavi/ProjectNavi.tsx` `ProjectNaviProps { title: string; titleAddon?: ReactNode }`, height 162, bg `semantic.grey[20]`. `ProjectNaviItem.tsx` `{ selected?, disabled?, isBeta?, onClick? }`.
3. **Storybook** (`stories/navigation/*.stories.tsx`, all title `Disclosure/Navigation`)
   - GNB: `gnb-story`, `states` (default and selected `GNBLink`, labelled "HOVERED / SELECTED").
   - LNB: `projects` (action button + count tabs), `sub-page`.
   - FNB: `fnb-story`.
   - ProjectNavi: `project-navi-story` (with `UserProfile` titleAddon), `with-beta`.
   - FullLayout: `projects-page`, `project-detail-page`.
   - No story shows `ProjectNaviItem disabled`. No Dark theme, no responsive sizes, no mobile.
4. **Inferred mapping**

| Figma | Code |
|---|---|
| `Navigation` type=GNB | `GNB` + `GNBLink` children (+ `Notification`, `UserProfile` slots) |
| type=LNB | `LNB` + `LNBTab` + `LNBTabItem` |
| type=Footer | `FNB` |
| type=ProjectNav | `ProjectNavi` + `ProjectNaviItem` |
| `PageButton` selected=true/false | `ProjectNaviItem selected` |
| `PageButton` beta=true | `ProjectNaviItem isBeta` |
| `NavButton` selected=true/false | `GNBLink selected` (best guess; no Figma-side usage seen in Navigation sets, so unverified) |
| `NavButton` / `LNB` tab count group | `LNBTabItem count` |
| theme Light/Dark | none (global theme) |
| size xl..mobile | none (fixed `media.size.lg` width) |

5. **Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Code | Figma defines sizes xl/lg/md/sm/xs/mobile (1920 down to 768). Code hardcodes `width: media.size.lg` in GNB, LNB, FNB and ProjectNavi, so there is no responsive behavior. | GNB.tsx, LNB.tsx, FNB.tsx and ProjectNavi.tsx `Inner` |
| High | Code | Figma has Dark variants for all four nav types and for PageButton/NavButton. Code containers use `theme.colors.white` or `semantic.grey[20]` and there is no dark story. | GNB.tsx `Container`; no Dark story |
| High | Code | Figma `PageButton` has no disabled state, but code `ProjectNaviItem` has `disabled` (opacity 0.4). Not covered by Figma or Storybook. | ProjectNaviItem.tsx |
| Medium | Figma | `PageButton` has both a VARIANT `beta` and a BOOLEAN `beta#6533:55`, so mapping is ambiguous. | Figma componentPropertyDefinitions |
| Medium | Figma | `NavButton` set exists but no instance appears in the Navigation set variants for GNB. The GNB `menu` frame is not componentized (no GNBLink equivalent), so GNBLink has no clear Figma master. | GNB variant tree: `Frame 817 > menu > Frame 39839 > Group 1132, icons` |
| Medium | Figma vs code | Figma GNB shows `UserIcon` (silhouette) and `NotificationBell` icons. Code stories pass `<UserProfile text="J" size="small">` (black circle with initial) and `<Notification />`. | GNB.stories.tsx vs Figma GNB variant |
| Medium | Figma vs code | LNB count badge: Figma uses a `Group 814` with rectangle + text. Code uses a 35px-min pill (`CountBadge`) with an unselected `grey[30]` fill. Selected count styling is not defined in Figma. | LNBTabItem.tsx |
| Medium | Figma | `state` has only Default. No hover (GNBLink bold, tab underline), focus or active states are defined for nav. | `state` options |
| Medium | Figma vs code | ProjectNav sample items include "Speaker Recognition", "Analytics", "History", "Post Actions" (7 items). Stories show only Overview, Upload, Settings. | Variant tree vs ProjectNavi.stories.tsx |
| Medium | Storybook | All five navigation components share one title `Disclosure/Navigation` (and Tabs is `Disclosure/Tabs`). Story ids are `gnb-story`, `fnb-story` and `project-navi-story` rather than `default`. | index.json |
| Low | Code docs | JSDoc `@see` links are stale: `navigation-gnb--default`, `navigation-lnb--projects`, `navigation-fnb--default` and `navigation-project-navi--default`. The live ids are `disclosure-navigation--gnb-story`, `--projects`, `--fnb-story`, `--project-navi-story`. | GNB.tsx, LNB.tsx, FNB.tsx and ProjectNavi.tsx JSDoc |
| Low | Figma | ProjectNav mobile width is 786 (the other mobile variants are 768). Variant `xs` is listed after `mobile` in ordering. Legacy loose frames and screenshots remain on the page. | Figma node sizes |
| Low | Code | FNB, GNBLink and ProjectNaviItem have no JSDoc `@param` for props (CLAUDE.md rule "all props documented"). FNB typography is hand-coded (Roboto, 18px) instead of `Typo`. | FNB.tsx, GNBLink.tsx |

Code nav components with no Figma variant: none are completely absent. All four code containers map to a Figma type. Code-only subcomponents with no Figma master are `GNBLink`, `LNBTab`/`LNBTabItem` (count) and `ProjectNaviItem disabled`. Figma-only: `NavButton` (no clear code consumer), PageButton dark/beta combos. Note FNB is called `Footer` in Figma and ProjectNavi is `ProjectNav`.

---

## 3. Accordian

1. **Figma**: no component. Name search for "accord|collaps|expand" over the Tabs, Dropdown, Card, Table and Document pages returned nothing, and no Figma page is named for it (page list checked). Inferred absent; not every page was scanned (Menu and Navigation pages also checked: no hits).
2. **Code**: `src/Accordian/Accordian.tsx` `AccordianProps extends BaseStyleProps { panelContent: ReactNode }` plus `children` as the header. Internal `useState` for open state, uncontrolled (no `defaultOpen`, `open` or `onChange`). Uses `ArrowDownIcon` rotated 180 degrees, `fill={colors.black}`. There is also an `AccordionIcon` in Icons (spelled correctly).
3. **Storybook**: `disclosure-accordian--default` only (closed state). Title `Disclosure/Accordian`. `parameters.design.url` is `""`.
4. **Mapping**: none.
5. **Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma | No Accordion/Accordian component in Figma, so code has no design spec (open, closed, hover, focus unknown). | Name search, empty `design.url` in story |
| Medium | Code | Misspelling `Accordian` (should be `Accordion`) in folder, component, props type, story title and docs URL. The icon is correctly `AccordionIcon`. Renaming is breaking. | `src/Accordian`, Accordian.stories.tsx |
| Medium | Code | The header is a clickable `div` with no button role, `aria-expanded` or keyboard handling. | Accordian.tsx `Content` |
| Low | Code docs | JSDoc mentions `@param onClose` which does not exist. The `@see` URL is `misc-accordian--default`; the live id is `disclosure-accordian--default`. The story file sits in `stories/misc/` but its title is `Disclosure/`. | Accordian.tsx, Accordian.stories.tsx |
| Low | Storybook | No open-state story. | stories file |

---

## 4. UserProfile

1. **Figma**: no `UserProfile` component set. Related items found:
   - On `Menu v1`: loose GROUPs named `user` (204:1595, 208:1671, 1699:917; 25x25) and `Group 1260` (1758:1288). These are what the story `design.url` values point to (node-ids 1699-917, 1758-1288). They are raw groups, not components.
   - `UserMenu` variants of the `Menu` set 1765:1692 (`type` Notification|UserMenu|Basic, `state` Default|Empty, `notifOn`, `theme`).
   - Icon set `UserIcon` 2734:1359 (`theme`, `type` Main|Gray|Pending), used in the Navigation GNB (25x25).
   - No avatar with a letter was found as a component.
2. **Code**: `src/UserProfile/UserProfile.tsx` `UserProfileProps extends ComponentPropsWithoutRef<"div">, BaseStyleProps { text: string; onClick?: () => void; size?: "small" | "medium" }` (`UserProfileSize`, default `medium`). small: 25px black circle, 14px normal text. medium: 48px `grey[40]` circle, 24px bold. `data-testid="@cochl-ui/user-pofile"` (typo).
3. **Storybook**: `overlay-user-profile--small-profile`, `overlay-user-profile--medium-profile`. Story file path is `stories/data-display/` but the title is `Overlay/User Profile`. The JSDoc `@see` uses `data-display-user-profile--default`, which does not exist.
4. **Inferred mapping**

| Figma | Code |
|---|---|
| group `user` 25x25 (Menu v1) | `UserProfile size="small"` |
| `Group 1260` (Menu v1) | `UserProfile size="medium"` |
| `UserIcon` type=Main/Gray/Pending | none (UserIcon is a silhouette, not a letter avatar) |

5. **Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Figma | No formal UserProfile component. Sizes and colors exist only as ungrouped layers on the Menu page. | `user` GROUP nodes, not COMPONENT |
| Medium | Figma vs code | GNB Figma uses the `UserIcon` silhouette; code GNB stories use a letter-based `UserProfile small`. | Figma GNB instances vs GNB.stories.tsx |
| Medium | Code | `UserIcon` types Main/Gray/Pending have no code equivalent; code UserProfile has no color/status prop (stories override background via styled wrapper `SharedProfile $color="#4B68FF"`). | ProjectNavi.stories.tsx |
| Low | Code | `data-testid` typo `user-pofile`. `UserProfile` forwards no rest props to the div despite extending `ComponentPropsWithoutRef<"div">`. | UserProfile.tsx |
| Low | Storybook | Title `Overlay/User Profile` and folder `data-display` disagree; JSDoc link is stale (see above). | stories file |

---

## 5. Icons

1. **Figma**: page `Icons v1` (1166:305). 24 icon sets plus 1 loose component. Every set has `theme` Dark|Light. Extra props: `ArrowDown` also has `size` lg|sm; `UserIcon` has `type` Main|Gray|Pending; `NotificationBell` has `notifOn` off|true; `CheckCircle` uses `Property 1` Light|Dark instead of `theme`.
   Sets: Plus, Minus, ArrowDown, Arrow, Close, ThreeDots, Filter, Refresh, Search, Time, Copy, Redirect, Edit, CloudAPI, EdgeSDK, Info, UserIcon, NotificationBell, CheckCircle, Upload, Mic, code, SpeakerRec, CheckX. Loose: `*ic/Security`.
2. **Code**: `src/Icons/index.ts` exports 67 icon components (`FC<SVGProps<SVGSVGElement>>`; props are the SVG props, size via `width`/`height`, default 25x25, colors hardcoded `#131313` or via `fill`) plus type `ThumbsDownIconVariant` (`default|hover|active`) and the `./Card` set (Amex, Diners, Discover, JCB, Master, Unionpay, Visa).
   Exported: Accordion, ArrowDown, ArrowForward, ArrowLeft, ArrowRightBar, ArrowRight, Calendar, CardAdd, Chrome, CloudAPI, Code, Copy, Delete, DropdownArrow, EdgeSDK, Edit, External, Filter, File, Hamburger, HeaderLogo, History, Hook, Info, InputCancel, Invitation, Line, Medium, Minus, ModalClose, More, NotFound, Noti, PaginationFirst/Last/Next/Previous, Pause, Play, Plus, Progress, Record, RectangleLayer, Refresh, RoundClose, Search, SharedUser, ShowMoreArrowDown, SmallLayer, SpeakerProfilesHero, SR, ToastCheck, ToastClose, ToastError, ThumbsDown, Transfer, Trash, Tuning, UploadFile, Upload, UploadResultSoundEventTab, UploadResultSummaryTab, UploadSummarySkipBackward, UploadSummarySkipForward, User, VerticalMore, Voice, WhiteLogo.
   Note: the Icons story imports neither `SpeakerProfilesHeroIcon`, `UploadResultSoundEventTabIcon`, `UploadResultSummaryTabIcon`, `UploadSummarySkipBackwardIcon` nor `UploadSummarySkipForwardIcon`, although all are exported.
3. **Storybook** (`stories/foundation/Icons.stories.tsx`, title `Theme/Icons`): `all-icons` (24px, 59 core icons plus 7 card icons), `large-icons` (32px), `thumbs-down-variants` (default/hover/active). The grid contains no Light/Dark switch. Its `design.url` points to node 3249-3214, which is a Button instance on `Button v1`, not the Icons page.
4. **Inferred name mapping (normalized)**

| Figma | Code | Confidence |
|---|---|---|
| Plus, Minus, Filter, Refresh, Search, Copy, Edit, Info, CloudAPI, EdgeSDK, Upload | same name + `Icon` | exact |
| ArrowDown | ArrowDownIcon (Figma has `size` lg/sm; code uses width/height) | exact |
| UserIcon | UserIcon | exact (types Main/Gray/Pending missing) |
| NotificationBell | NotiIcon | renamed; `notifOn` off missing in code |
| code | CodeIcon | exact (lowercase in Figma) |
| Redirect | ExternalIcon | probable |
| Time | HistoryIcon | probable |
| ThreeDots | MoreIcon (horizontal) / VerticalMoreIcon | probable |
| Close | ModalCloseIcon (or InputCancel/RoundClose) | ambiguous |
| Arrow | ArrowRightIcon (or ArrowLeft/Forward/RightBar) | ambiguous |
| CheckCircle | ToastCheckIcon | probable |
| CheckX | ToastErrorIcon or ToastCloseIcon | ambiguous |
| Mic | VoiceIcon or RecordIcon | ambiguous |
| SpeakerRec | SRIcon (speaker recognition) | probable |
| ic/Security | none | |

5. **One-sided icons**
   - Figma only (no clear code icon): `ic/Security`. Everything else has at least a candidate (see ambiguous rows).
   - Code only (no Figma icon): Accordion, ArrowForward, ArrowLeft, ArrowRightBar, Calendar, CardAdd, Chrome, Delete, DropdownArrow, File, Hamburger, HeaderLogo, Hook, InputCancel, Invitation, Line, Medium, ModalClose (if Close is not it), NotFound, Pagination x4, Pause, Play, Progress, Record, RectangleLayer, RoundClose, SharedUser, ShowMoreArrowDown, SmallLayer, SpeakerProfilesHero, ThumbsDown (+3 variants), Transfer, Trash, Tuning, UploadFile, UploadResult x2, UploadSummarySkip x2, VerticalMore, WhiteLogo, plus the 7 card brand icons.
   - Story gap: the 4 `UploadResult*`/`UploadSummary*` icons and `SpeakerProfilesHeroIcon` are exported from `index.ts` but missing from the `IconGrid` list.

6. **Mismatches**

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Code vs Figma | Figma icons all have Dark and Light variants; code icons are hardcoded `#131313` (`UserIcon`, `NotiIcon`) with no theme handling, so Dark is not renderable without a `fill` override. | UserIcon.tsx, NotiIcon.tsx |
| High | Code | Figma `NotificationBell notifOn=off|true` has no code equivalent: `NotiIcon` always draws the dot (third path). | NotiIcon.tsx |
| High | Code | Figma `UserIcon type=Main|Gray|Pending` has no code prop. | UserIcon.tsx |
| Medium | Both | About 45 code icons have no Figma component; the Figma set is 24 and the code set is 67. Figma Icons v1 is not the full source of truth. | Counts |
| Medium | Both | Naming mismatches: NotificationBell/NotiIcon, Redirect/ExternalIcon, Time/HistoryIcon, ThreeDots/MoreIcon, CheckCircle/ToastCheckIcon, CheckX/Toast*Icon, SpeakerRec/SRIcon, Mic/VoiceIcon. Figma names are PascalCase except `code`, `ic/Security` and `UserIcon`; code suffix `Icon` everywhere. | See table |
| Medium | Figma | `CheckCircle` uses `Property 1` instead of `theme` (inconsistent). The ArrowDown `size` variant (sm|lg) is not mirrored in code (width/height only). `ic/Security` is loose and not in a set. | Figma |
| Medium | Storybook | `all-icons` has no Dark view. Its `design.url` points at the wrong node (3249-3214, a Button). Five exported icons are missing from the grid. | Icons.stories.tsx |
| Low | Code | Inconsistent default fill handling (some icons accept `fill`, some hardcode paths). `ThumbsDownIcon` is the only icon with a `variant` prop. | Icons.stories.tsx `ThumbsDownVariants` |
| Low | Code | `AccordionIcon` (correct spelling) vs the `Accordian` component. | index.ts |

---

## Top issues

1. High: No Dark theme in code for any Figma nav, tab or icon variant. Responsive sizes (xl to mobile) are also absent: all nav containers are fixed to `media.size.lg`.
2. High: Missing in code/Figma pairs: Figma Tabs `Focus` has no code state; `ProjectNaviItem disabled` and `Accordian` have no Figma spec; Figma `NotificationBell notifOn=off` and `UserIcon type` have no code prop.
3. High: `UserProfile` is not a Figma component (only loose groups on Menu v1), and Figma GNB shows `UserIcon` where code stories show a letter `UserProfile`.
4. Medium: Icon name mapping is ambiguous for Arrow, Close, CheckX and Mic. Roughly 45 code icons have no Figma component, and `ic/Security` has no code equivalent.
5. Low: Stale `@see` story URLs across Tab, GNB, LNB, FNB, ProjectNavi, Accordian, UserProfile; typos `Accordian` and `user-pofile`; story title and folder disagreements.

Counts (rows in the mismatch tables): High 9, Medium 18, Low 13.
