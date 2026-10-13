# Radio: Figma vs code vs Storybook (detailed)

- **Date:** 2026-10-12
- **Figma:** `aUrjRMAnE8ND8o6lAI0VcM`, page `52:723` "Radio v1", set `3116:3045` `Radio`: 12 variants. theme Light | Dark × type Basic × state Default | Hovered | Selected × withLabel true | false; TEXT `Text`. The doc frame note says: *"There's currently no usage of the radio button in the light theme, so the values may be inaccurate."*
- **Code:** `cochlearai/cochl-dashboard` `beta` @ `083f601`, `packages/cochl-ui/src/RadioButton/RadioButton.tsx`. Props `name`, `value`, `checked?`, `isBtnType?`, `onChange`. Only app usage: `packages/client/src/components/PopupSurvey/QuestionTemplate.tsx`, the customer-satisfaction survey: answer options, plus a 1–5 score row with `isBtnType`.
- **Storybook:** `stories/form/RadioButton.stories.tsx` (`Form/Radio`), one story `form-radio--default`. Checked on the live site.

## 1. They are different components

| | Figma `Radio` | Code `RadioButton` |
|---|---|---|
| What it is | A bare radio control, optionally with a label | A **survey answer card**: white rounded box with a shadow, holding a native radio and the value as text. `isBtnType` hides the radio and makes it a centred button-like card. |
| Control | Custom 16×16 circle, 1px stroke; selected = blue ring + 8×8 blue dot | **Native browser radio** (default OS look, unstyled) |
| Stroke, Default | L `#333333` (`grey[90]`), D `#ffffff` (`grey[90]`) | browser default |
| Stroke, Hovered | `#4b68ff` | browser default |
| Selected | ring + dot `#4b68ff` (both themes) | browser default (`isBtnType`: text turns `blue[60]`) |
| Label | separate text, 14 Regular, L `#131313` / D `#ffffff`, gap **8** | the `value` string is the label (`Typo body`, or `button` when `isBtnType`); gap **24** |
| Container | none | `white` bg, radius 8, `box-shadow 0 2px 1px rgba(0,0,0,.1)`, padding 6/8 (10 for `isBtnType`), width 100% |
| Dark | Default stroke white; Selected keeps the Light `#4b68ff` (dark token would be `#4057d0`) | `white` → `#1c1d1e` card; native radio |

So only the *idea* of a radio matches. There is no visual match.

## 2. Code and story issues

1. **Non-DOM props leak to the label:** `isBtnType` and `checked` are passed to a styled `label` without the `$` prefix, so React warns about an unknown `isBtnType` prop and writes a meaningless `checked` attribute on `<label>`.
2. **Ids aren't unique:** `id={value}` / `htmlFor={value}`. Two groups with the same option text (e.g. "Yes") get duplicate ids, so clicking one label can select the other group's radio.
3. **No label separate from the value:** the visible text is always the submitted `value`.
4. **No disabled state, no visible focus style:** native focus ring only when the radio is visible; none with `isBtnType`, where the radio is `display: none` and can't be reached by keyboard at all.
5. **Story:**
   - a single radio that "toggles" itself (radios can't be unchecked, so it only ever goes from off to on);
   - no group, no `isBtnType` example, no labelled/unlabelled cases;
   - the Figma link points to node `3116-1609` in the old "Dashboard_Design_System_v3" URL instead of set `3116:3045`.
6. **Stale `@see` link:** `form-radio-button--default`; the live id is `form-radio--default`.

## 3. Figma issues

1. The note says the light values may be inaccurate (radio never used in light).
2. Dark Selected and Hovered use the Light `#4b68ff` instead of the Dark `blue[60]` `#4057d0`.
3. No Disabled or Focus states.
4. The unlabelled Default variant wraps the circle in a frame named "Checkbox" with a 0-width `#f1f1f2` stroke (copied from Checkbox).
5. The survey card / score-button look used in the app (`isBtnType`) has no Figma component.

## 4. Options

- **A. Make `RadioButton` match Figma, keep the survey look as an option** (recommended):
  - custom 16px control (token colours, hover, selected dot, focus ring, disabled);
  - optional `label` (falls back to `value`), gap 8;
  - `variant="card"` keeps today's survey card;
  - `isBtnType` stays as a deprecated alias of a `"button"` card;
  - unique ids via `useId`; transient `$` props;
  - the survey keeps working by passing `variant="card"`; that's one line in `QuestionTemplate.tsx`, or make `card` the default for backward compatibility.
- **B. Split:** add a new Figma-matching `Radio` component and rename today's to `SurveyOption` (breaking rename for the one call site).
- **Design (NS), either way:**
  - confirm the light values;
  - use Dark tokens for Selected/Hovered;
  - add Disabled and Focus;
  - decide whether the survey card / score buttons become Figma components (or stay app-only).
