/**
 * base-theme-example.tsx
 *
 * Reference pattern for applying Cochl Design System BaseTheme
 * to a Vite + React + TypeScript app.
 *
 * Rules:
 * - BaseTheme wraps the entire app exactly once
 * - ThemeType.LIGHT is the default; swap to ThemeType.DARK for dark mode
 * - Existing providers (Router, QueryClient, etc.) are preserved inside BaseTheme
 * - The DesignSystemTest component is temporary — remove after verification
 */

import React, { useState } from 'react';
import { BaseTheme, ThemeType, Button } from '@cochlearai/ui';

// ── Temporary verification component ─────────────────────────────────────────
// Add this to your main page to confirm the design system is active.
// Remove or replace once integration is verified.

function DesignSystemTest() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      background: 'rgba(0,200,160,0.06)',
    }}>
      <Button
        variant="primary"
        onClick={() => {
          setConfirmed(true);
          console.log('[Cochl DS] BaseTheme active — ThemeType.LIGHT applied');
        }}
      >
        {confirmed ? '✓ Design System Active' : 'Verify Design System'}
      </Button>

      {confirmed && (
        <span style={{ fontSize: '13px', color: '#00C8A0', fontFamily: 'monospace' }}>
          @cochlearai/ui loaded
        </span>
      )}
    </div>
  );
}

// ── Root app with BaseTheme ───────────────────────────────────────────────────

export default function App() {
  return (
    // BaseTheme must be the outermost wrapper.
    // Change ThemeType.LIGHT to ThemeType.DARK for dark mode.
    <BaseTheme theme={ThemeType.LIGHT}>

      {/*
        Preserve ALL existing providers here.
        Example with Router + QueryClient:

        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <YourExistingRoutes />
          </BrowserRouter>
        </QueryClientProvider>

        Only add BaseTheme — do not remove or reorder existing providers.
      */}

      {/* Verification: place DesignSystemTest in your main page temporarily */}
      <div style={{ padding: '24px' }}>
        <DesignSystemTest />
      </div>

    </BaseTheme>
  );
}

// ── Theme switching pattern (optional) ───────────────────────────────────────
// If the app needs runtime theme switching, lift the theme state up:

export function AppWithThemeToggle() {
  const [theme, setTheme] = useState<ThemeType>(ThemeType.LIGHT);

  return (
    <BaseTheme theme={theme}>
      <button onClick={() => setTheme(t => t === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT)}>
        Toggle theme
      </button>
      {/* existing app content */}
    </BaseTheme>
  );
}
