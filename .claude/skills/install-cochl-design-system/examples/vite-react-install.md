# Vite + React — Cochl Design System Installation Guide

This example walks through the full installation on a fresh Vite + React + TypeScript project.

---

## Prerequisites

- Node.js ≥ 18
- A GitHub Personal Access Token with `read:packages` scope
- The token exported as `COCHLEARAI_NPM_TOKEN` in your shell

---

## Step 1 — Export the token

```bash
export COCHLEARAI_NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

> In CI, set this as a repository secret and inject it via your workflow file.

---

## Step 2 — Create `.npmrc` at the project root

```bash
cat > .npmrc << 'EOF'
@cochlearai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${COCHLEARAI_NPM_TOKEN}
EOF
```

---

## Step 3 — Add `.npmrc` to `.gitignore`

```bash
echo ".npmrc" >> .gitignore
```

---

## Step 4 — Install the packages

**npm:**
```bash
npm install @cochlearai/ui @cochlearai/util
```

**Yarn:**
```bash
yarn add @cochlearai/ui @cochlearai/util
```

**pnpm:**
```bash
pnpm add @cochlearai/ui @cochlearai/util
```

Expected output: both packages resolved from `npm.pkg.github.com`, no 401/404.

---

## Step 5 — Wrap the app with BaseTheme

Open `src/App.tsx` (or the equivalent root component) and add `BaseTheme`:

```tsx
import { BaseTheme, ThemeType } from '@cochlearai/ui';

export default function App() {
  return (
    <BaseTheme theme={ThemeType.LIGHT}>
      {/* existing content here — do not remove */}
    </BaseTheme>
  );
}
```

If the project already has providers (e.g. `BrowserRouter`, `QueryClientProvider`),
place `BaseTheme` outside them or directly inside — whichever keeps the existing
hierarchy intact:

```tsx
// Example: BaseTheme outside Router
<BaseTheme theme={ThemeType.LIGHT}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</BaseTheme>
```

---

## Step 6 — Add a verification Button

In the main page component, temporarily add:

```tsx
import { Button } from '@cochlearai/ui';

// Inside the component JSX:
<Button variant="primary" onClick={() => console.log('Cochl DS active')}>
  Verify Design System
</Button>
```

---

## Step 7 — Run dev server and verify

```bash
npm run dev
```

1. Open the browser — the Button should render with Cochl styling
2. Check the console for errors
3. Confirm no existing layout has broken

---

## Step 8 — Run build check

```bash
npm run build
```

Must complete with exit code 0. Fix any TypeScript or peer-dependency errors
before considering the installation complete.

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Token not exported or expired | Re-export `COCHLEARAI_NPM_TOKEN` |
| `404 Not Found` | Registry line missing in `.npmrc` | Check `.npmrc` exists at project root |
| `Cannot find module '@cochlearai/ui'` | Package not installed | Re-run install command |
| `ThemeType is not exported` | Wrong import path | Import from `@cochlearai/ui`, not a subpath |
| Peer dependency warning | React version mismatch | Check `@cochlearai/ui` peer deps and align |
