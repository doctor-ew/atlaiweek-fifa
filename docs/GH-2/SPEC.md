# SPEC: GH-2 — MartaStatusCard

**Issue:** [#2 — feat: MartaStatusCard — real-time MARTA service status for Match Day sidebar](https://github.com/doctor-ew/atlaiweek-fifa/issues/2)  
**Mode:** Story  
**Branch:** GH-2

---

## Problem Statement

Fans using the Match Day ATL app can get transit directions from Claude, but have no way to know whether their MARTA line is currently running *before* they ask. The sidebar has match selector, zone picker, and CTA — but no live transit health signal. `MartaStatusCard` fills this gap: a compact, auto-refreshing card showing Gold, Blue, and College Park line status derived from the existing `/api/marta` vehicle feed.

**Demo constraint:** 20-minute live demo on `GH-2` branch. Card must be visually complete and never crash.

---

## Technical Constraints

- Next.js 16 App Router, bun, Tailwind 4
- Sidebar is `w-80` (320px) — card must fit without overflow or layout shift
- **Reuse `useMartaData` hook** — do not create a second SWR call to `/api/marta`
- `useMartaData` uses `refreshInterval: 10000` (10s) — faster than PRD's 30s; keep existing config unchanged
- Design tokens: raw Tailwind only — `text-amber-400` (Gold line name), `text-blue-400` (Blue line name), `text-orange-400` (College Park name), `text-gray-400` (muted text), `bg-gray-800` (card background), `border-gray-700` (dividers); `text-green-500` / `text-yellow-500` / `text-red-500` (status dots only). No semantic CSS custom properties exist in `globals.css`.
- TypeScript strict — no `any`
- No new dependencies

---

## Solution Design

### Status derivation

Filter `Vehicle[]` (from `@/types`) from `useMartaData()` per line:

| Line | Filter | Route value |
|------|--------|-------------|
| Gold | `v.type === 'train' && v.route === 'Gold Line'` | `"Gold Line"` (mapped by `LINE_NAME_MAP` in `src/lib/marta.ts`) |
| Blue | `v.type === 'train' && v.route === 'Blue Line'` | `"Blue Line"` (mapped by `LINE_NAME_MAP` in `src/lib/marta.ts`) |
| College Park | `v.type === 'bus'` | proxy — bus `route` values are numeric route IDs, no College Park ID |

Status thresholds (vehicle count per line):
- 🟢 **On Schedule** — ≥ 2 vehicles
- 🟡 **Minor Delays** — 1 vehicle
- 🔴 **Major Delays** — 0 vehicles

When `isError`: show "Status unavailable" banner, no crash.  
When `isLoading`: render three skeleton rows.

### "Last updated" timestamp

Not returned by `/api/marta`. Track locally: `useState<Date | null>` initialized to `null`, updated inside a `useEffect` watching `vehicles` — when `vehicles` changes from a non-error state, set to `new Date()`. Display as `HH:MM` using `toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`.

### Component tree

```
MartaStatusCard                          ← default export
  ├── header row: "MARTA Service"  +  "Updated HH:MM" (text-gray-400, text-xs)
  ├── <LineRow> × 3
  │     ├── colored dot  (status: text-green-500 / text-yellow-500 / text-red-500)
  │     ├── line name    (color: text-amber-400 / text-blue-400 / text-orange-400)
  │     └── status label (text-gray-400, text-xs)
  ├── loading state: three skeleton rows  (animate-pulse, bg-gray-700)
  └── error state: "Status unavailable"  (text-gray-400, text-xs, text-center)
```

### Insertion point in Sidebar

Insert in `src/components/Sidebar.tsx` after `<ZonePicker>` (line 37), before the CTA `<button>` (line 39). Pattern follows the existing `gap-4` flex column — no explicit divider element needed.

```tsx
<MartaStatusCard />
```

Import at top of file:
```tsx
import MartaStatusCard from './MartaStatusCard';
```

---

## Files to Change

| File | Change | Notes |
|------|--------|-------|
| `src/components/MartaStatusCard.tsx` | CREATE | New component; `"use client"` required — uses `useState`, `useEffect`, `useMartaData` |
| `src/components/Sidebar.tsx` | EDIT lines 37–39 | Add `<MartaStatusCard />` between ZonePicker and CTA button; add import |

---

## Acceptance Criteria

**GIVEN** the sidebar renders with vehicle data  
**WHEN** `useMartaData` returns `[{ type:'train', route:'Gold Line' }, { type:'train', route:'Blue Line' }]`  
**THEN** Gold Line row shows amber label + 🟢 On Schedule; Blue Line shows blue label + 🟢 On Schedule; College Park shows orange label + 🔴 Major Delays (0 buses)

**GIVEN** `/api/marta` returns an error  
**WHEN** MartaStatusCard renders  
**THEN** "Status unavailable" text appears — component does not throw, sidebar layout intact

**GIVEN** data is loading (initial mount)  
**WHEN** MartaStatusCard renders  
**THEN** three skeleton rows visible (animate-pulse)

**GIVEN** data loaded successfully  
**WHEN** MartaStatusCard renders  
**THEN** "Updated HH:MM" timestamp visible in muted text

**GIVEN** the sidebar is `w-80` (320px)  
**WHEN** MartaStatusCard is present  
**THEN** no horizontal overflow, no layout shift, no scrollbar introduced

**GIVEN** TypeScript compiler runs  
**WHEN** MartaStatusCard.tsx is included  
**THEN** zero `any` types, zero type errors

---

## Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|-----------|
| No dedicated College Park bus route ID in MARTA API | Inaccurate College Park status | Use `type === 'bus'` as proxy; acceptable for demo |
| `useMartaData` already running in parent — adding second consumer | None — SWR dedupes by key | Confirmed: SWR `dedupingInterval: 5000` at `src/hooks/useMartaData.ts:26` |
| Sidebar height overflow on small screens | CTA pushed off-screen | Card is intentionally compact: ~80px max; test at 768px viewport |

---

## Test Plan

1. Mock `useMartaData` returning `[{ type:'train', route:'Gold Line' }, { type:'train', route:'Blue Line' }]` → Gold On Schedule, Blue On Schedule, College Park Major Delays
2. Mock returning empty `[]` → all three lines show 🔴 Major Delays
3. Mock `isError: true` → "Status unavailable" shown, no throw
4. Mock `isLoading: true` → skeleton rows shown
5. Render in 320px container → no overflow
6. TypeScript `tsc --noEmit` → zero errors

---

## Model Router

Files to change: 2 (`src/components/MartaStatusCard.tsx` CREATE + `src/components/Sidebar.tsx` EDIT). No architecture decision. No shared contract change (component is self-contained, `useMartaData` signature unchanged). Standard UI component addition pattern.

**Decision:** Sonnet / General Engineer

---

## Sources

- `src/hooks/useMartaData.ts:1-36` (branch: GH-2, commit: 68c53c4) — confirms SWR wiring, `refreshInterval: 10000`, return shape `{ vehicles: Vehicle[], isLoading, isError }`
- `src/lib/marta.ts:9-14` (branch: GH-2, commit: 68c53c4) — confirms `LINE_NAME_MAP`: `GOLD → 'Gold Line'`, `BLUE → 'Blue Line'`; route values on `Vehicle.route` are full line names, not raw codes
- `src/lib/marta.ts:16-23` (branch: GH-2, commit: 68c53c4) — confirms mock vehicles use `route: 'Blue Line'`, `route: 'Gold Line'`; bus routes are numeric strings (`'Route 110'`)
- `src/lib/marta.ts:65-73` (branch: GH-2, commit: 68c53c4) — confirms live train `Vehicle.route` is set via `LINE_NAME_MAP[t.LINE]`; no College Park train route present
- `src/types/index.ts:1-9` (branch: GH-2, commit: 68c53c4) — confirms `Vehicle` interface: `id: string`, `type: 'bus' | 'train'`, `route: string`, `lat: number`, `lng: number`
- `src/components/Sidebar.tsx:22` (branch: GH-2, commit: 68c53c4) — confirms sidebar `w-80`, `overflow-y-auto`, `flex-col gap-4`; insertion point after line 37 (`</ZonePicker>`), before line 39 (`<button>`)
- `src/app/globals.css:1-17` (branch: GH-2, commit: 68c53c4) — confirms no semantic token custom properties exist; only `--color-pitch` and `--color-pitch-light`; raw Tailwind classes required throughout
