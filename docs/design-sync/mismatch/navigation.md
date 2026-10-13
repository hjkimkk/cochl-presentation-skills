# Navigation: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-13
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `1185:1204` "Navigation v1".
  - Set `Navigation` `3602:1114`: 48 variants. theme Light | Dark × type GNB | LNB | Footer | ProjectNav × size xl | lg | md | sm | xs | mobile (state Default only).
  - Sub-components: `NavButton` `6535:417` (theme × selected), used in the GNB menu. `PageButton` `6533:2777` (theme × selected × beta), used in ProjectNav.
  - The LNB tabs are plain frames, not a component.
- **Code (`beta` @ `55a4cd4`, same as `main` for these files):**
  - `GNB` + `GNBLink`
  - `LNB` + `LNBTab` + `LNBTabItem`
  - `FNB`
  - `ProjectNavi` + `ProjectNaviItem`
- **Storybook:** title `Disclosure/Navigation` has 9 stories: `gnb-story`, `states`, `projects`, `sub-page`, `project-navi-story`, `with-beta`, `fnb-story`, `projects-page`, `project-detail-page`.

Theme tokens below are the code names; Light / Dark hex come from `lib/Colors.ts`.

## 1. GNB (`type=GNB`)

| Property | Figma L / D | Code | Result |
|---|---|---|---|
| Height / bg | 66, #ffffff / #1c1d1e (`white`) | 66, `white` | ✓ |
| Content width | 1200 (xl, lg, md); 880 (sm, 60px side padding) | `media.size.lg` (1200) at every width | ✗ no sm/xs/mobile |
| Logo | 96×20 | 96.3×20 | ✓ |
| Menu gap / menu → icons | 50 / 50 | 50 / `margin-left: 50px` | ✓ |
| Icons gap | 26 (bell 25, user 25) | 25 | ≈ 1px |
| **Link font** (`NavButton`) | Roboto Regular 18/32 in **both** states | Roboto 18/32, **700** when selected or hovered | ✗ selected must not be bold |
| Link colour | selected #131313 / #ffffff (`black`); idle #727273 / #73787a (`grey[80]`) | same tokens | ✓ |
| xs / mobile | logo + **hamburger** (`menu` frame), no links (960 / 768) | none | ✗ missing |

**Live check (dashboardstorybook.cochl.ai, `project-detail-page`):** the links render **IBM Plex Sans 500 14/18**, not Roboto 18/32.
- **Cause:** `src/lib/globalStyle.ts` sets `button { font-weight: 500 !important; font-size: 14px !important; line-height: 18px !important; font-family: "IBM Plex Sans" !important }`. `GNBLink` is a `<button>`, so the global rule wins over its own styles.
- **Impact:** this applies wherever `GlobalStyle` is mounted, so it probably affects the app too, not only Storybook.

## 2. LNB (`type=LNB`)

| Property | Figma L / D | Code | Result |
|---|---|---|---|
| **Background** | #f1f1f2 / #111112 (`semantic.grey[20]`) | `white` | ✗ |
| Padding top / height | 80 / 204 | 80 / content | ✓ |
| Content width | 1200; sm 880; xs 910; mobile 718 | 1200 always | ✗ |
| Title | `dashboard/h1` IBM Plex Medium 32/42 | `Typo h1` | ✓ |
| Title row → tabs | 40 | `margin-bottom: 40px` | ✓ |
| Bottom rule | 2px #f1f1f2 / #242526 (`grey[20]`) | none | ✗ (invisible in Light, visible in Dark) |
| Tab gap | 42 | 42 | ✓ |
| Tab label | `dashboard/h4` 18/28; selected `black`, idle #a5a5a6 / #6a6e70 (`grey[60]`) | `Typo h4`; `black` / `grey[60]` | ✓ |
| Label → underline | 12, 2px `blue[60]` | `padding-bottom: 12px`, 2px `blue[60]` | ✓ |
| Count badge | 23 high, radius 74, 12/15; selected `blue[60]` + white text; idle `grey[30]` + `grey[80]` text | 24 high, min-width 35; same colours | ≈ 1px |
| Label → badge | 8 (selected) / 12 (idle) in Figma | 8 | Figma inconsistent |

## 3. Footer (`type=Footer`, code `FNB`)

| Property | Figma L / D | Code | Result |
|---|---|---|---|
| Height / bg | 66, #ffffff / #1c1d1e (`white`) | 17 + 32 + 17 = 66, `white` | ✓ |
| **Text** | Roboto Regular **14**/32, `black` | Roboto **18**/32 | ✗ |
| Text | "© 2024 Cochl Inc" | story: "© 2024 Cochl Inc." | ≈ |
| Content width | 1200 | 1200 always | ✗ for sm and smaller |

## 4. ProjectNav (`type=ProjectNav`, code `ProjectNavi`)

| Property | Figma L / D | Code | Result |
|---|---|---|---|
| Height / bg / padding top | 162, `semantic.grey[20]`, 50 | same | ✓ |
| Title → items | 30 | `margin-top: auto` in a fixed 162 box → 30 | ✓ |
| **Item gap** | **40** | **50** | ✗ |
| Item (`PageButton`) | `dashboard/h4`, `black` in both states; 10 → 2px underline, `blue[60]` when selected | `Typo h4`; `padding-bottom: 10px`; 2px `blue[60]` | ✓ |
| Beta chip, selected | `blue[60]` @5% fill, `blue[70]` text, 1px #f1f1f2 stroke, gap 4 | same fill and text; margin 4 | ✓ (stroke comes from `Chip`) |
| Beta chip, idle | #f9f9fa / #171717 (`grey[10]`) fill, `black` text | `grey[10]` fill, `black` text | ✓ |
| Disabled | not in Figma | `disabled` → opacity 0.4 | code-only |
| Content width | 1200; sm 960, xs 920, mobile 746 (20px side padding) | 1200 always | ✗ |

## 5. Storybook

- **Names don't match Figma:**
  - stories are "GNB Story", "FNB Story", "Project Navi Story", "Projects", "Sub Page", "States", "With Beta";
  - Figma types are `GNB`, `LNB`, `Footer`, `ProjectNav`.
- **Missing coverage:**
  - no Figma design links;
  - no responsive sizes and no mobile hamburger;
  - Dark relies on the theme switcher only (fine), but nothing shows `PageButton` beta + idle.
- **Misleading "States" story:** it is labelled "HOVERED / SELECTED" but shows the bold selected style, which Figma doesn't have.
- **Broken doc links:** the `@see` links in code point at ids that don't exist:
  - `navigation-gnb--default`, `navigation-lnb--projects`, `navigation-fnb--default` and `navigation-project-navi--default`;
  - the real ids are `disclosure-navigation--…`.

## 6. Figma

- **Leftovers on the page:**
  - legacy frames `Navigation Bar/Dark` `1185:1205` and `Navigation Bar/Light` `1185:1274`, plus `Frame 1269` `3350:1467`;
  - two screenshots (`5809:746`, `5809:748`) and a loose logo group `8064:2789`.
- **Breakpoints differ by type:**
  - sm: GNB/LNB 60px side padding (880) vs ProjectNav 20px (960);
  - xs: GNB 20 vs LNB 25;
  - mobile: ProjectNav frame is 786 wide, the others 768;
  - LNB height is 204 (xl, xs, mobile) vs 206 (lg, md, sm).
- **Duplicate beta property:** `PageButton` has both a `beta` variant and a `beta` BOOLEAN property.
- **LNB tab is not a component:** the tab, with its count badge, is plain frames; label → badge gap is 8 (selected) vs 12 (idle).

## 7. Suggested fix

- **Code:**
  - `GNBLink`: keep font weight 400 when selected or hovered (colour only, as in Figma), and stop the global `button` rule from overriding it. Either render it as a non-`button` element with `role="link"` / `<a>`, or narrow the global rule (e.g. `button:where(:not([data-gnb-link]))`).
  - `LNB`: background `semantic.grey[20]`, 2px bottom rule `grey[20]`.
  - `FNB`: 14/32 text.
  - `ProjectNaviItem`: 40px gap.
  - GNB icon gap 26; badge height 23.
  - Fix the `@see` links.
- **Responsive (larger change, design to confirm):** side padding per breakpoint (sm 60 or 20, xs/mobile 20–25) and the GNB hamburger at xs/mobile.
- **Stories:** one per Figma type, named `GNB`, `LNB`, `Footer`, `ProjectNav`, each with its Figma link. Keep the full-page examples. Rename "States" to the Figma `NavButton` states (Default / Selected).
- **Figma (NS):** archive the leftover frames, align the breakpoint paddings and widths, drop the duplicate `beta` BOOLEAN, and make the LNB tab a component.
