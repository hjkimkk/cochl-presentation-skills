# Card: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-13
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `12:2070` "Card v1", set `1850:660` `Card`: 14 variants.
  - Axes: `size` sm | m | fl; theme light | dark; state default | hovered; type basic | card with action | Card with supporting text | card with items | fullLength.
  - Properties: TEXT `title`, `subtitle`, `secondaryText`.
  - Doc frame `1989:32`.
  - Loose components: `Cards/info/fullLength` `1989:245`, `Card with items (table,etc)/Default` `1989:434`.
- **Code (`beta` @ `55a4cd4`):** `src/Card/Card.tsx`, a container with props `hoverEffect?`, `className`, `style`.
- **Storybook:** `stories/data-display/Card.stories.tsx` (`Data Display/Card`). Stories: `default`, `example`, `create-new-project`, `project`, `plan`, `delete-project`, `project-info`.

## 1. Figma rules (from the doc frame)
- "card" is the shared name for any container holding page content (info, button, etc.).
- **Card with an action** (button, link): box shadow `#989898` at 10%, blur 20, centred.
- **Information-only card:** no shadow, 1px stroke `#F1F1F2`.
- Sizes at 1920 width: sm 282×220 (action / supporting text), m 540×286 (items), fl 1200×183 (full length).
- Content is centred in the basic layout; usage may differ.

## 2. Values

| Property | Figma L / D | Code `Card` | Result |
|---|---|---|---|
| Fill | #ffffff / #1c1d1e | `white` | ✓ |
| Radius | 4 (supporting-text outer frame 8) | 4 | ✓ (Figma 8 is a stray value) |
| Stroke (default) | 1px #f1f1f2 / #242526 (`grey[20]`) | 1px `grey[20]` | ✓ |
| Hovered | stroke `blue[60]` (#4b68ff / #4057d0), **no shadow** | `hoverEffect`: stroke `blue[60]` **+ shadow `blue[60]` @10%, blur 20**, and recolours text (`p` → `grey[90]`, last `.caption` → `grey[70]`) | ≈ border ✓; ✗ extra blue shadow and text recolour not in Figma |
| Action card elevation | shadow `#989898` @10%, blur 20 (doc rule) | — no option | ✗ missing |
| Sizes sm / m / fl | 282×220 / 540×286 / 1200×183 | — (set per story via `style`) | ✗ not in the component |
| Padding | action 31; items ~50/40; fullLength 40 | — (stories add 40 / 56 / 30 …) | ✗ not in the component |

## 3. Storybook

| Figma type | Story | Notes |
|---|---|---|
| basic | `default` | An `<h1>` in an 800×400 card |
| card with action | `create-new-project` | 384px wide (Figma sm = 282) |
| Card with supporting text | `project` | 384px wide; hard-coded `#6c6b6b`, `#a8a9ae` |
| card with items | `plan` | 588×288 (Figma m = 540×286); hard-coded `#f03e3e`, `#ffffff` |
| fullLength | `project-info` (closest) | Figma fullLength is "Usage cost" with a $ value; the story is a project-info card |
| — | `delete-project` | Danger card with border `#edb1b1` (hard-coded); not in Figma |
| hovered | — | No story uses `hoverEffect` |

Other problems:
- **Light only:** the stories read colours from `theme[ThemeType.LIGHT]` directly, so they stay light even when the theme switcher (#462) is on.
- **Hard-coded hex values:** `#f03e3e`, `#6c6b6b`, `#a8a9ae`, `#edb1b1`, `#f6c0c0`, `#ffffff`.
- **Old link format:** the Figma links use the old "Dashboard_Design_System_v3" URL. They still open the right file (same key), but should point at the set `1850:660`.

## 4. Figma issues
1. **Broken property names:** the `size` property name and its `m` value contain an invisible backspace control character (`\bsize`, `\bm`). They show as `size` / `m` in Figma, but code and plugin lookups by name fail.
2. **Incomplete matrix:**
   - hovered only for sm basic;
   - fullLength only Light/Dark default;
   - card with action and supporting text only sm.
3. **Inconsistent:**
   - Light "card with action" has the stroke, Dark doesn't;
   - the doc rule says action cards use a shadow instead of a stroke;
   - Dark card with items is 288 high vs Light 286;
   - type names mix casing ("Card with supporting text" vs "card with action").
4. **Detached copies:** the two loose components (`Cards/info/fullLength`, `Card with items (table,etc)/Default`) duplicate set variants; the fullLength one still uses the legacy `Btn/hyperlink`.

## 5. Suggested fix
- **Code (backward compatible):**
  - `elevation?: "outline" | "raised"`. Default `outline` (today's look); `raised` = no stroke + `#989898` @10% blur 20, per the doc rule. Use the theme `shadow` colour; confirm the Dark value with design.
  - `hoverEffect`: keep the blue border. Decide with design whether to drop the blue shadow and the text recolour (not in Figma).
  - Optional `size?: "sm" | "m" | "fl"` for the Figma widths, or document widths as layout-owned.
- **Stories:**
  - one per Figma type at the Figma sizes, plus Hovered;
  - theme tokens instead of `theme[LIGHT]` and hex values, so Dark works;
  - links to `1850:660`;
  - keep the app examples (delete project, plan) as a separate "Examples" story.
- **Design (NS):**
  - rename `\bsize` / `\bm` (retype the property name and value);
  - fill the matrix;
  - align the action-card stroke/shadow rule between the doc and the variants.
