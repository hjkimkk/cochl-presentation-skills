# UNMATCHED backlog → live-site Design QA (handover to YJ)

- **Date:** 2026-10-13 · **From:** HJ · **To:** YJ (live-site Design QA, Step ④) · **Decisions pending:** NS (D2)
- **Source of truth:** `design-sync/config/mapping.json`, `config/figma-families.json`, `node design-sync/scripts/coverage.mjs`
- **Coverage today:** 20/20 Figma families mapped (15 checked by `sync`, 5 pending), 0 AMBIGUOUS.

These are the items the mapping can't close. In the live-site audit, treat each as "no Figma reference" (code-only) or "no code reference" (Figma-only) instead of reporting it as drift.

## 1. Code-only components (published `@cochlearai/ui@1.0.5`, no Figma set)

| Component | What it is | Proposed (D2, NS decides) |
|---|---|---|
| `Accordian` (source only) | Disclosure list; name typo vs `AccordionIcon` | Add to Figma |
| `CodeView` | Code block (API key / snippet) | Add to Figma |
| `UsageBar`, `UsageBarContent` | Plan usage meter; Figma has `Progress_Usage` frames, not a component | Add to Figma (as Progress type=Usage?) |
| `Banner` | Full-width gradient banner, shares the Feedback/Alert story group | Add to Figma |
| `UserProfile` | Avatar letter; Figma has only loose layers on Menu v1 | Add to Figma |
| `Notification` | The GNB bell (`confirmed` flag); Figma draws it as the `NotificationBell` icon | Mark code-only: covered by Icons/NotificationBell |
| `CardSortingItem` | Sortable card row | Ask NS |
| `Typo` | Typography primitive | Mark code-only: Foundations (typography tokens), not a component |
| `Scroll` | Internal scroll utility | **Excluded** (D5) |

App-only (in `packages/client`, not the library): `TypeSelectButton`; delete-project, webhook, edge-device and price-plan modals; `ProjectCreateModal` (Figma "Modal with subtitles and cta").

## 2. Figma-only items (no code)

| Figma | Notes |
|---|---|
| Progress `type=Small` (thin linear bar) | No code component |
| Menu trigger | Not defined on either side |
| `*ic/Security` icon (4992:276) | Loose symbol, no code icon |
| Figma states with no code prop | Tabs `Focus`; Dropdown `disabled`/`Focus`; Chip Tag chip `Active`; Radio `withLabel=false`; Tooltip corner placements; NotificationBell `notifOn=off`; UserIcon `type`; Navigation sizes xl…mobile |

## 3. Mapped, but confirm before relying on it

- **Icons:** 8 `probable` and 1 `ambiguous` matches in `mapping.json` → `Icons.mapping.iconMap` (Arrow, Close, ThreeDots, Time, Redirect, CheckCircle, CheckX, SpeakerRec; Mic). Check visually.
- **Structure-only entries** (no value comparisons yet, so `sync` shows SYNC by default): Popover, Card, Skeleton, Modal, Icons.
- **Stale snapshots:** the 10 original snapshots date from 2026-09-22. Refresh needs `FIGMA_TOKEN` (repo secret) → `node scripts/capture.mjs`.

## 4. Pending (mapped, waiting on code)

| Entry | Waiting on |
|---|---|
| NumberInput, Tabs, Menu, Navigation | Next `@cochlearai/ui` publish (they're on `cochl-dashboard` main) |
| DatePicker | Engine support for `code.package` = `@cochlearai/calendar` (YJ) |
| Icons: Upload, Code, Voice, SR | Next publish |
