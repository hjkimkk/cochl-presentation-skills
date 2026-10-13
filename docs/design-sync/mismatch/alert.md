# Alert: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-13
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `25:441` "Alert v1"
  - `Alert` `1372:2003`: 8 variants. theme Light | Dark × type Basic | Link × state Success | Error. TEXT `Text`, `Hyperlink`.
  - `Alert_Icons` `3132:5485`: theme × state Success | Error, 14px.
  - Loose on the page: two `Alert` instances (`5294:221`, `5294:222`) and a text node "E02E2E" (`5294:248`).
- **Code (`beta` @ `55a4cd4`):** `src/Toast/Toast.tsx` (`Toast`).
  - `severity` `info | success | warning | error`, `message`, `buttonText` + `onClick`, `open`, `onClose`.
  - Fixed at the bottom centre, auto-closes after 6s, fade animation.
- **Storybook:** `stories/feedback/Toast.stories.tsx`, title `Feedback/Alert`. Stories `error-toast`, `info-toast`, `success-toast`, `warning-toast`.

## 1. Mapping

| Figma | Code |
|---|---|
| `Alert` | `Toast` (renamed; same role) |
| state=Success (**blue**) | `severity="info"` (blue) — **not** `"success"`, which is green `#00C853` |
| state=Error | `severity="error"` |
| — | `severity="success"` (green), `severity="warning"` (amber): **code only** |
| type=Link ("View project", underlined) | `buttonText` + `onClick` (underlined) |

## 2. Values

| Property | Figma (Light; Dark is identical) | Code | Result |
|---|---|---|---|
| Size | 430×50, padding 16/20, r4 | height 50, padding 16/20, r4, width auto | ✓ (width by content) |
| Text | 14 Medium, colour = accent | 14/18 500, colour = accent | ✓ |
| Icon → text gap | 16 | `margin-left: 16px` | ✓ |
| Link → close gap | 10 | `margin-right: 10px` | ✓ |
| Link text | underlined | underlined | ✓ |
| Success accent | **#445ee5** (`blue[70]`) | info: `blue[60]` #4b68ff | ✗ one step lighter |
| Success background | #edf0ff (opaque; ≈ `blue[70]` at 10% on white) | `blue[60]` at 10% alpha (transparent) | ≈ Light; differs on dark |
| Error accent | #e02e2e (`red`) | `red` | ✓ |
| Error background | #fff4f4 (opaque; ≈ `red` at **5%** on white) | `red` at **10%** alpha | ✗ code is about twice as strong |
| Close icon | 12px, accent colour | `ToastCloseIcon`, accent colour | ✓ |
| Dark theme | **same opaque light colours** as Light (only the success icon changes to #4b68ff) | theme tokens + transparent tint (dark-friendly) | ✗ Figma Dark isn't designed |

## 3. Storybook
1. **Link type is never shown:** the story `Template` drops `buttonText` / `onClick`, so no story has the Figma "Link" type.
2. **Fixed position and auto-close:** `Toast` is `position: fixed` at the bottom centre and closes itself after 6 seconds. In Storybook/Chromatic the alert sits at the bottom of the canvas and disappears, so snapshots can be empty.
3. **Names don't line up:** stories are named per code severity (`ErrorToast`, `InfoToast`, …), not Figma (`Basic` / `Link` × `Success` / `Error`). The Figma links point at old nodes (`1372-1895`, `1372-1893`) instead of the set `1372:2003`. Success and Warning stories have no Figma link (code-only states).

## 4. Figma
1. **Dark variants are copies of Light:** same `#edf0ff` / `#fff4f4` backgrounds and Light text colours, and the Dark Error icon variant is `theme=Light`.
2. **Success naming:** "Success" is drawn in blue. Code has a separate green success. Decide whether Figma "Success" = code `info`, or whether code `success` should be blue.
3. **Strays:** two loose `Alert` instances and a text "E02E2E" outside the frames.

## 5. Suggested fix
- **Stories (no component change):**
  - render the alert in place (wrap it so `position: fixed` doesn't apply) and keep it open (no auto-close) for docs and Chromatic;
  - mirror Figma type × state: Basic/Link × Success(info)/Error;
  - add `buttonText` for the Link type;
  - keep the code-only Success (green) / Warning in a separate "Code-only severities" story;
  - Figma link to `1372:2003`.
- **Code, after design decides:**
  - info accent `blue[60]` → `blue[70]` to match Figma Success;
  - error background 10% → 5%.
- **Figma (NS):**
  - design the Dark variants;
  - settle Success naming/colour vs code `success` / `info`;
  - remove the strays.
