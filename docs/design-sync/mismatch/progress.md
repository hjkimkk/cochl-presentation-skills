# Progress: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-13
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `25:442` "Progress v1", set `Progress` `1424:1266`: 10 variants.
  - Axes: theme Light | Dark × type SoundWave | Round | Small | Basic × state Default | Medium.
  - `Medium` only exists for SoundWave.
- **Code (`beta` @ `55a4cd4`):**
  - `ProgressIndicator` (`size` large | medium, `color`): the 5-bar sound-wave spinner.
  - `CircleProgress` (`percent`, children): a ring drawn with `conic-gradient`.
  - `UsageBar` (`height`, `borderRadius`, `data` + `renderItem`, labels): a segmented track.
- **Storybook:**
  - `Feedback/Progress` → `large`, `medium` (ProgressIndicator), `circle-progress-story` (CircleProgress).
  - `Data Display/Usage Bar`.

## 1. Mapping

| Figma type | Code | Story |
|---|---|---|
| SoundWave / Default (53×54) | `ProgressIndicator size="large"` | `Feedback/Progress → Large` |
| SoundWave / Medium (31×28) | `ProgressIndicator size="medium"` | `→ Medium` |
| Round (50×50) | `CircleProgress` | `→ Circle progress story` |
| Small (453×2 linear bar) | — **no component** (closest: `UsageBar height={2} borderRadius={0}`) | — |
| Basic (453×20 segmented usage bar) | `UsageBar` + segments via `renderItem` (`USAGE_COLORS`) | `Data Display/Usage Bar` (not under Progress) |

## 2. Values

| Type | Figma L / D | Code | Result |
|---|---|---|---|
| SoundWave Default | 5 bars 5px wide, heights 54/34/18, gap 7, r2.5; `#131313` / `#ffffff` | 5×54, gap 7, r2.5; `black` (L #131313 / D #ffffff); animated | ✓ |
| SoundWave Medium | 3px bars, heights 28/18/8, gap 4, r1.5; `#8c8c8c` / `#73787a` | 3×28, gap 4, r1.5; `grey[70]` (#8c8c8c / #73787a) | ✓ |
| Round track | 4px ring, L `#f1f1f2` (`grey[20]`), **D `#edf0f1`** | `grey[20]` (L #f1f1f2 / D #242526); ring = 7.5% of size (3.75px at 50px) | ✓ L; Figma Dark uses a light colour |
| Round arc | `blue[60]` (#4b68ff / #4057d0), **round caps** | `blue[60]`, square ends (`conic-gradient`) | ≈ caps differ |
| Round centre | empty | `children` slot (e.g. a % label) | code adds a slot |
| Small | 2px track `grey[20]` (#f1f1f2 / #242526), fill `blue[60]`, no radius | — | ✗ missing |
| Basic track | 20px, `grey[20]`, **r4 (L) / r0 (D)** | 20px, `grey[20]`, r4 | ✓ L; Figma Dark has no radius |
| Basic segments | blue 90 / 80 / 70 / 60 / 40 / 30 | `USAGE_COLORS` blue 90 → 10 (app picks per item) | ✓ |

## 3. Code issues
1. **`ProgressIndicator` sizes clash (real bug):** it styles its bars with `createGlobalStyle` on the shared class `.line-scale-pulse-out`. Every mounted instance injects a global rule, so with a large and a medium indicator on the same page, the last one mounted resizes and recolours **both**. Each story shows only one, which hides it.
2. **`"undefined"` class name:** `ProgressIndicator` adds an `undefined` class when no `className` is passed (`` `line-scale-pulse-out ${className}` ``).
3. **No Small component:** no component for the Figma Small (2px linear) progress.

## 4. Storybook
- **Basic isn't under Progress:** the Figma Basic type lives under `Data Display/Usage Bar`, and Small has no story.
- **Old links:** the Figma links point at the old file URL (nodes are still right: `1424-1260`, `1424-1258`, `1424-1235`).
- **Story file name:** `CircleProcess.stories.tsx` is misspelled (Process → Progress).

## 5. Figma
1. **Dark Round track:** `#edf0f1`, a light colour; it should be the dark `grey[20]` (#242526) like the Small/Basic tracks.
2. **Dark Basic radius:** the Dark track has radius 0, Light has 4.
3. **`state` axis:** `Default | Medium` is really a SoundWave size. Round / Small / Basic only have `Default`.
4. **Instance vs drawn layers:** the Light SoundWave Default is an instance of `Progress/loading_large`, while the Dark one is drawn layers.

## 6. Suggested fix
- **Code (backward compatible):**
  - `ProgressIndicator`: replace the global style with a scoped styled component so sizes and colours can't clash; drop the `undefined` class.
  - Add `LinearProgress` (`percent`, 2px, `grey[20]` track, `blue[60]` fill) for Figma Small. Alternatively, document `UsageBar height={2} borderRadius={0}`.
  - Optional: round caps on `CircleProgress` (an SVG ring instead of `conic-gradient`).
- **Stories:** one `Feedback/Progress` page that mirrors Figma (SoundWave Default/Medium, Round, Small, Basic), with links to `1424:1266`. Rename `CircleProcess.stories.tsx`.
- **Figma (NS):** Dark Round track colour; Dark Basic radius; rename `state` to `size` for SoundWave.
