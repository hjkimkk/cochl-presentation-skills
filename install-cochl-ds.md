# Cochl Design System — Installation & Application Skill

## 1. When to Use This Skill

Use this skill when:

- A new React/Vite project needs the Cochl Design System applied from scratch
- An existing project needs `@cochlearai/ui` or `@cochlearai/util` added
- You encounter 404 or 401 errors resolving `@cochlearai` scoped packages
- You need to wrap a React app with `BaseTheme` and `ThemeType`
- You are adding a first design system component to verify the integration works
- You need to preserve existing app layout while introducing the design system

Do **not** use this skill to redesign unrelated UI, change routing logic, or
restructure components that already work.

---

## 2. Required Packages

| Package | Purpose |
|---|---|
| `@cochlearai/ui` | Component library — Button, Card, Input, Badge, etc. |
| `@cochlearai/util` | Shared utilities, types, and theme helpers |

Both packages are published to GitHub Packages under the `@cochlearai` scope.
They are **not** available on the public npm registry.

---

## 3. Registry Setup

### Step 1 — Create `.npmrc` in the project root

```ini
@cochlearai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${COCHLEARAI_NPM_TOKEN}
```

The token is read from the environment at install time.
**Never** paste a raw token value into `.npmrc`.

### Step 2 — Add `.npmrc` to `.gitignore`

Even with an env variable reference, add `.npmrc` to `.gitignore` to prevent
accidental commits if the file is ever edited locally with a real token.

```
# .gitignore
.npmrc
```

### Step 3 — Export the token in your shell

```bash
export COCHLEARAI_NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

For CI/CD, add the token as a repository secret named `COCHLEARAI_NPM_TOKEN`
and inject it at install time.

---

## 4. Installation Commands

### Yarn
```bash
yarn add @cochlearai/ui @cochlearai/util
```

### npm
```bash
npm install @cochlearai/ui @cochlearai/util
```

### pnpm
```bash
pnpm add @cochlearai/ui @cochlearai/util
```

If the install fails with a 401 or 404:
1. Confirm `COCHLEARAI_NPM_TOKEN` is exported in the current shell
2. Confirm `.npmrc` exists at the project root with the correct registry line
3. Confirm the token has `read:packages` scope on GitHub

---

## 5. BaseTheme Setup

Wrap the root component (usually `App.tsx` or `main.tsx`) with `BaseTheme`.
Import `ThemeType` to select light or dark mode.

```tsx
// App.tsx
import { BaseTheme, ThemeType } from '@cochlearai/ui';

export default function App() {
  return (
    <BaseTheme theme={ThemeType.LIGHT}>
      {/* existing app content */}
    </BaseTheme>
  );
}
```

**Rules:**
- Place `BaseTheme` as high in the tree as possible — ideally at the root
- Do not nest multiple `BaseTheme` providers
- `ThemeType.LIGHT` is the default; use `ThemeType.DARK` for dark mode
- Do not remove existing providers (Router, QueryClient, etc.) — wrap around them or place `BaseTheme` inside them if needed

---

## 6. Component Usage Example

After `BaseTheme` is in place, import components directly from `@cochlearai/ui`:

```tsx
import { Button } from '@cochlearai/ui';

function TestButton() {
  return (
    <Button variant="primary" onClick={() => console.log('Cochl DS works')}>
      Design System Active
    </Button>
  );
}
```

Add this component temporarily to the app's main page to confirm the
integration is working. Remove or replace it once verified.

See `examples/base-theme-example.tsx` for a full working pattern.

---

## 7. Safety Rules

| Rule | Reason |
|---|---|
| Never hardcode `COCHLEARAI_NPM_TOKEN` in any file | Tokens committed to git are a security incident |
| Never commit `.npmrc` if it may contain a token | Use `.gitignore` to exclude it |
| Do not modify unrelated components | The goal is integration, not redesign |
| Do not remove existing layout structure | Wrap — do not replace |
| Do not add `BaseTheme` more than once | Multiple providers cause theme conflicts |
| Do not change routing, auth, or data-fetching logic | Out of scope for this skill |
| Always run a build check after installation | Catch type or peer-dep errors early |

---

## 8. Verification Checklist

Run through this list after installation before marking the task complete:

- [ ] `.npmrc` exists at project root with `@cochlearai:registry` line
- [ ] `.npmrc` uses `${COCHLEARAI_NPM_TOKEN}` — no raw token value present
- [ ] `.npmrc` is listed in `.gitignore`
- [ ] `@cochlearai/ui` and `@cochlearai/util` appear in `package.json` dependencies
- [ ] `BaseTheme` wraps the root component with `ThemeType.LIGHT`
- [ ] A test `Button` from `@cochlearai/ui` renders without console errors
- [ ] `npm run build` (or `yarn build` / `pnpm build`) completes with no errors
- [ ] `npm run dev` starts and the app loads in the browser
- [ ] No unrelated components or layout changes were made
- [ ] No token or secret appears in any staged or committed file
