# Mismatch audit: foundations (Color, Typography, Spacing)

Sources: Figma `aUrjRMAnE8ND8o6lAI0VcM` (pages 1:172 Color, 4:1132 Typography, 4:1228 Layout & Spacing (TODO), local variables, paint styles, text styles); GitHub `cochlearai/cochl-dashboard@80da7dd` `packages/cochl-ui/src/lib/{Colors,ThemeColors,analyticsColors,globalStyle}.ts`, `src/types/colors.ts`, `src/Typo/Typo.tsx`; stories `stories/foundation/{Colors,Typo}.stories.tsx`. Hex normalized to lowercase 6-digit. Storybook live index.json could not be fetched (sandbox network deny); story ids derived from story titles (`Theme/Color`, `Theme/Typography`).

---
## 1. Color

### Figma
- Page 1:172 frames: `Color/Web/Light` (x2 frames), `Color/Web/Dark`, `Color/Web_Analytics`. Sections: Primary (blue 10-90), Mono (gray 10-90), Service color, Black/White/Red/Red-stroke/Body/Shadow/Code, Semantic (Table bg gray 10/20), Success/Warnings/Information, Global (Product Type, Plan color), Analytics (Heatmap, Timeseries/Top tags, Tag Source).
- Local variables (3 collections, essentially a stub): `Collection 1` (28 color vars, 1 mode: Increase, Decrease, Highest, ..., Timeseries_*, chart/*, Hoverd, Blue100, Gray100), `Palette` (2: Dark/Red/Hovered=#cb2c2b, Green/95=#d9ffe6), `Semantic` (Light/Dark modes; only `Label/Normal` aliasing `Cool Neutral/10` / `Cool Neutral/99`, which do not exist locally, i.e. from another library). No variables for blue/gray/red/etc.
- Real token source is **paint styles** (95): `Light/*`, `Dark/*`, `Light|Dark/Service color/*`, `Product Type/*`, `Plan Color/*`, `Analytics/*`.

### Code
- `Colors.ts` `theme[LIGHT|DARK]`: blue 10-90, grey 10-90, black, white, red, red_stroke, body, shadow, code, semantic.grey{10,20}, plan_color{free,standard,enterprise}, product_type_color{all,api,sdk}, service_color{5 services}. Type: `types/colors.ts` ThemeColor (no success/warning/info keys).
- `ThemeColors.ts` component tokens (button only); one-off hex `#CB2C2B` (button danger hover, both themes).
- `analyticsColors.ts`: `HEATMAP_COLOR` (4), `ANALYTICS_COLOR` (15), theme-independent. `USAGE_COLORS` (blue ramp + alpha steps of blue10).
- Story `Theme/Color` -> `Light`, `Dark` (renders blue, grey, black, white, red, red_stroke, body, shadow, code, semantic grey, plan_color, service_color, USAGE_COLORS). Not shown: product_type_color, analytics/heatmap colors, success/warning/info. Dark story links `node-id=933-1731` and Light `2-308` (not page 1:172 frames; unverified).

### Token name mapping (Figma paint style -> code key)
| Figma | Code |
|---|---|
| Light/Blue/10..90, Dark/Blue/10..90 | `theme[mode].blue[10..90]` |
| Light/Gray/10..90, Dark/Gray/10..90 | `theme[mode].grey[10..90]` |
| Light/White, Dark/White | `.white` |
| Light/Black, Dark/Black | `.black` |
| */Red, */Red stroke | `.red`, `.red_stroke` |
| */Body, */Shadow, */Code | `.body`, `.shadow`, `.code` |
| */Semantic/Gray/10,20 | `.semantic.grey[10,20]` |
| Plan Color/Free,Standard,Enterprise | `.plan_color.free,standard,enterprise` |
| Product Type/Cloud API, Edge SDK | `.product_type_color.api, sdk` (`all` = "" in code; Figma "None/All" has no color) |
| */Service color/emergency,home-context,human-interaction,human-status,vehicle-monitor | `.service_color[SenseServices]` |
| Analytics/Heatmap/{light-blue,dark-blue,light-purple,dark-purple} | `HEATMAP_COLOR[0..3]` |
| Analytics/Timeseries_TopTags/*, Tag source/* | partly `ANALYTICS_COLOR` (see below) |

### Value comparison (all names matched above)
Identical in both modes: blue 10-90, grey 10-90, white, black, red, red_stroke, body, shadow, code, plan colors, product types, service colors, heatmap. Dark blue/grey, dark red etc. verified per mode (e.g. dark blue60 #4057d0, dark grey90 #ffffff, dark black #ffffff / white #1c1d1e).

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Light semantic grey | Figma paint styles `Light/Semantic/Gray/10,20` = #18191a / #111112 (dark values; page text also shows these under the Light frame). Code light = #f9f9fa / #f1f1f2 (same as grey 10/20). Dark matches (#18191a/#111112). Table backgrounds differ visibly in light theme. | Figma paint styles; Colors.ts semantic.grey light | **Fixed 2026-10-12:** Light styles set to #f9f9fa / #f1f1f2; 4 dark date-picker fields that used the Light style moved to `Dark/Semantic/Gray/10`; Color page Light swatches bound to the styles.
| High | Success / Warnings / Information | Figma Color page defines Success #00c853, Warnings #ffab00, Information #4b68ff (light) and #ffab00 (dark); no paint style/variable and no code key (ThemeColor type lacks them). Light vs dark Information differ in Figma (#4b68ff vs #ffab00), likely a Figma typo. | Figma page 1:172 text; types/colors.ts |
| High | Analytics palette (tag source) | Code `ANALYTICS_COLOR` has #dadcff (Figma tag-source blue-20 = #c5c8ff), #303cfb (Figma none; blue-70 = #000cc8), #5498df (not in Figma), and lacks Figma #000cc8, #4c56f6, #8a90fe, #c5c8ff, #119792, #22b2ad, #62e9d3, #4db1ad. Code green set (#205856,#367b78,#0b8580,#17a5a0,#63d7c6) matches Figma `Collection 1` Timeseries_green1-5 variables, not the Color page paint styles; blue set (#335696,#4275b8,#65b3ef,#99d2f5) matches Timeseries_blue4-6 variables only. Figma has three overlapping analytics sources (page/paint styles, `Collection 1` variables, code) that disagree. | analyticsColors.ts; paint styles Analytics/*; Collection 1 |
| High | Figma variables | Variables are not the system of record: no blue/gray/etc. variables, no Light/Dark modes (only `Semantic` has modes, 1 var with unresolved alias to `Cool Neutral/*`). Code's light/dark theme has no variable equivalent. | getLocalVariableCollectionsAsync |
| Medium | Dark paint styles | `Dark/Semantic/Gray/10,20` present; but `Dark/Red/Hovered` exists only as variable `Palette/Dark/Red/Hovered` (#cb2c2b) matching code one-off hex `#CB2C2B` (ThemeColors.ts button danger hover) which is not a theme token; no Figma paint style. | ThemeColors.ts; Palette collection |
| Medium | Tokens only in Figma `Collection 1` | Increase #219653, Decrease #eb5757, chart/blue #000cc8, chart/indigo #4c56f6, chart/purple1 #6871fe, chart/purple2 #8a90fe, Timeseries_blue/purple/green*, Hoverd/Blue100 #4057d0, Gray100 #65696b, Palette/Green/95 #d9ffe6: no code equivalent (Increase/Decrease not in code at all). Several duplicates (Timeseries_Purple/purple1 both #6871fe, purple2/purple3 both #aaaffe, Blue100 = Hoverd). | variable dump |
| Medium | Analytics theming | Figma analytics colors have no Dark variants; code analytics colors are theme-independent. Consistent but untested in dark. | analyticsColors.ts |
| Medium | Code-only keys | `USAGE_COLORS` (blue ramp + alpha overlays #E6..#1A) has no Figma counterpart. `product_type_color.all` = "" has no Figma color. | Colors.ts |
| Medium | Duplicate values in tokens | Dark grey 80 and 70 both #73787a (Figma and code agree; ramp collapses). Dark blue 70/80 unchanged from light while 60/90 differ. | both |
| Medium | Storybook coverage | Story omits product_type_color, heatmap/analytics, semantic labels shown as "semantic grey"; story text color logic `+key < 60` applied to non-numeric plan/service keys (NaN -> always false). | Colors.stories.tsx |
| Low | Naming | Figma `Gray`/`Black`/`red-stroke`/`Red stroke`/`Hoverd` (typo) vs code `grey`/`black`/`red_stroke`. Figma `Light/Service color/*` vs code `service_color` keys use enum strings. `Plan Color` vs `plan_color`. Figma plan Standard #4b68ff = blue60 but code stores literal hex. | names |
| Low | Duplicate frames | Figma page has two `Color/Web/Light` frames, plus `Frame 1269`, `Rectangle 2` leftovers. | page 1:172 |
| Low | Story design links | Story `design.url` points at file named `Dashboard_Design_System_v3`, nodes 2-308 / 933-1731; verify they still resolve to the Color frames. | Colors.stories.tsx |

---
## 2. Typography

### Figma
Page 4:1132 `Typography` (frames `Typo`, `Frame 1269`). Local text styles (12), all IBM Plex Sans:

| Figma style | Weight | Size | LH | LS |
|---|---|---|---|---|
| dashboard/h1 | Medium | 32 | 42px | 0% |
| dashboard/h2 | Medium | 24 | 34px | 0.15px |
| dashboard/h3 | Medium | 20 | 30px | 0 |
| dashboard/h4 | Medium | 18 | 28px | 0 |
| dashboard/h5 | Regular | 16 | 24px | 0.15px |
| dashboard/body | Regular | 14 | 20px | 0.2px |
| dashboard/body_title | Medium | 14 | 20px | 0.2px |
| dashboard/caption 1 | Regular | 12 | 15px | 0% |
| dashboard/caption 2 | SemiBold | 12 | 15px | 0% |
| dashboard/caption 3 | Regular | 10 | 15px | 0% |
| dashboard/button | Medium | 14 | AUTO | 0 |
| caption 4 (no prefix) | SemiBold | 10 | 15px | 0% |

Page also contains un-styled text in Roboto (Medium 20/30, Regular 12; likely header/footer samples) and nodes with empty font (mixed) at 20/12/36 sizes.

### Code
- `Typo.tsx:3-13` `TypoVariant` = h1,h2,h3,h4,h5,body,caption1,caption2,caption3,button. Renders h1-h5 as `<h1..5>`, caption1-3/button as `<p class=variant>`, body `<p>`.
- Values in `lib/globalStyle.ts`: h1 500/32/42; h2 500/24/34; h3 500/20/30; h4 500/18/28; h5 400/16/24; `p` (body) 400/14/20 ls 0.2px; `.button` 500/14/18 !important; `.caption1` 400/12/15; `.caption2` 600/12/15; `.caption3` 400/10/15 (caption inherits p letter-spacing 0.2px). Family `IBM Plex Sans` on body; `header` and `footer` elements use Roboto (18/32, 14/32).
- Story `Theme/Typography` (title in Typo.stories.tsx): stories Body, H1-H5, Button, Caption1-3, Example (all 10 variants rendered in Example).

### Mapping
| Figma | Code `variant` |
|---|---|
| dashboard/h1..h5 | h1..h5 |
| dashboard/body | body |
| dashboard/caption 1/2/3 | caption1/2/3 |
| dashboard/button | button |
| dashboard/body_title | none |
| caption 4 | none |

### Mismatches
| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | body_title | Figma `dashboard/body_title` (Medium 14/20) has no `Typo` variant; used 2x on Figma Typography page. | text styles; TypoVariant |
| High | caption 4 | Figma `caption 4` (SemiBold 10/15) has no code variant; also lacks `dashboard/` prefix. | text styles |
| Medium | button line-height | Figma AUTO (~ font default, 18px at 14px for Plex) vs code 18px. Likely equal in render but not declared. | globalStyle.ts `.button` |
| Medium | letter-spacing h2/h5 | Figma h2 and h5 = 0.15px; code h2/h5 have none (0). | globalStyle.ts h2,h5 |
| Medium | letter-spacing caption1-3 | Figma 0%; code `p` rule gives captions 0.2px (inherited, not reset). Button: Figma 0, code inherits 0.2px. | globalStyle.ts p |
| Medium | Roboto | Code `header` (18/32) and `footer` (14/32) use Roboto; Figma has Roboto only as unstyled text on the Typography page, with no text style; sizes (20/30, 12) do not match. | globalStyle.ts; page 4:1132 |
| Medium | Style naming | Figma `dashboard/caption 1` (space) vs code `caption1`; Figma `body_title` snake case. Mapping must be explicit. | names |
| Low | Page text | Spec labels typo "18x | 28px", "16x | 24px" (should be px). Several unstyled/mixed-font text nodes. | page 4:1132 samples |
| Low | Story metadata | Story title `Theme/Typography` (id `theme-typography--*`) while docs link path `foundation-typo--default` in Typo.tsx JSDoc is stale. Stories link to nodes 4-1147..4-1206 in file `Dashboard_Design_System_v3`. | Typo.tsx:~85, Typo.stories.tsx |
| Low | Story `Example` order | Renders button before captions and body last; cosmetic. | Typo.stories.tsx |
| Low | Weight naming | Code uses numeric weights 500/600/400; Figma "Medium/SemiBold/Regular". Consistent. | -- |

Identical (no mismatch): family, size, weight, line-height for h1-h5, body, caption1-3.

---
## 3. Layout & Spacing (page 4:1228, "Layout & Spacing (TODO)")
- Figma: page is still TODO-labeled. Contains frames `Containers`, `Breakpoints`, `Frame 1269`, `Desktop - 1`, `Spacing Specification`. Content: breakpoints xl/lg/md/sm = 1280/1024/768/640px (also given as 96/80/62/48/30em, 2xl listed), a "Spacing specifications for Cochl webproducts" (v05.24.2024) mock layout. **No spacing variables or styles exist** (variable dump has none; no number variables); spacing only as drawn annotations.
- Code: no spacing tokens in `src/lib` (no spacing/space/breakpoint key; code search for "spacing" only hits Table `border-spacing`, Input `labelGap` doc, letter-spacing). Spacing is hard-coded per component. Breakpoints not defined in lib.
- Storybook: no spacing/layout foundation story (only Colors, Icons, Typo).

| Severity | Where | Mismatch | Evidence |
|---|---|---|---|
| High | Spacing tokens | Neither side has spacing tokens (no Figma number variables, no code scale); conflicts with the repo rule "all spacing must reference tokens". | dumps/search |
| Medium | Breakpoints | Figma lists sm 640 / md 768 / lg 1024 / xl 1280 (+2xl); none in code. | page 4:1228 |
| Medium | Figma page status | Page marked TODO; undefined content-level spec. | page name |
| Low | Storybook | No Layout/Spacing foundation story. | stories/foundation |

---
## Top issues
1. Light `semantic.grey` 10/20: Figma paint styles hold dark values (#18191a/#111112) vs code #f9f9fa/#f1f1f2.
2. Figma variables are not the token source (paint/text styles are); no Light/Dark variable modes and a dangling `Cool Neutral` alias, so no variable-to-code sync is possible yet.
3. Analytics palettes disagree across Figma page, Figma variables, and code (`ANALYTICS_COLOR` has #dadcff/#303cfb/#5498df not in Figma; Figma teal/blue-70 shades missing in code).
4. Success/Warning/Information colors exist only in Figma page text (and Information light/dark mismatch); no code or style.
5. Typography: `body_title` and `caption 4` Figma-only; letter-spacing differs for h2/h5/captions/button; Roboto header/footer undefined in Figma.
6. No spacing tokens or breakpoints anywhere.

Counts: High 7, Medium 15, Low 10 (approx., foundations).
