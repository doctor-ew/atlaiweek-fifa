# SPEC: GH-2 — MartaStatusCard

**Issue:** [#2 — feat: MartaStatusCard — real-time MARTA service status for Match Day sidebar](https://github.com/doctor-ew/atlaiweek-fifa/issues/2)
**Mode:** Story
**Branch:** main
**Commit:** 68c53c4

---

## Problem Statement

Fans using Match Day ATL can get transit directions from Claude, but have no way to know whether their MARTA line is currently running *before* they ask. The sidebar has match selector, zone picker, and a CTA — but no live transit health signal. `MartaStatusCard` fills this gap: a compact, auto-refreshing card showing Gold, Blue, and College Park line status derived from the existing `/api/marta` vehicle feed.

---

## Technical Constraints

- Next.js 16 App Router, bun, Tailwind 4 (no semantic CSS tokens — uses Tailwind gray palette)
- Sidebar (`src/components/Sidebar.tsx`) is `w-80` fixed — card must fit without overflow or layout shift
- **Reuse `useMartaData` hook** — SWR dedupes by key, zero second fetch
- `useMartaData` `refreshInterval: 10000` (10s) — keep unchanged
- Type is `Vehicle` (not `TransitVehicle`) from `src/types/index.ts`
- Route field values: `'Gold Line'`, `'Blue Line'` for trains (full strings from `LINE_NAME_MAP`); buses have route strings like `'Route 110'`
- TypeScript strict — no `any`
- No new dependencies

---

## Solution Design

### Status derivation

Filter `Vehicle[]` from `useMartaData()`:

| Line | Filter predicate | Color token |
|------|-----------------|-------------|
| Gold Line | `v.type === 'train' && v.route === 'Gold Line'` | `text-amber-400` |
| Blue Line | `v.type === 'train' && v.route === 'Blue Line'` | `text-blue-400` |
| College Park | `v.type === 'bus'` | `text-orange-400` |

Status thresholds (vehicle count per line):
- 🟢 **On Schedule** — ≥ 2 vehicles → `text-green-500`
- 🟡 **Minor Delays** — 1 vehicle → `text-yellow-500`
- 🔴 **Major Delays** — 0 vehicles → `text-red-500`

When `isError`: show "Status unavailable" banner — no crash.
When `isLoading`: render three skeleton rows (`animate-pulse bg-gray-700`).

### "Last updated" timestamp

Track locally: `useState<Date | null>(null)`, updated in `useEffect` watching `vehicles` — when vehicles changes from a non-error state, set `new Date()`. Display as `HH:MM` via `toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`.

### Component tree

```
MartaStatusCard                          ← default export, 'use client'
  ├── header: "MARTA Service" + "Updated HH:MM" (text-gray-400, text-xs)
  ├── <LineRow> × 3
  │     ├── colored dot  (green/yellow/red)
  │     ├── line name    (text-amber-400 / text-blue-400 / text-orange-400)
  │     └── status label (text-gray-400, text-xs)
  ├── loading: three skeleton rows (animate-pulse, bg-gray-700 rounded)
  └── error: "Status unavailable" (text-gray-500, text-xs, text-center)
```

### Insertion point in Sidebar.tsx

Insert after the `ZonePicker` section, before the CTA button. Add a top border divider to match existing sidebar section pattern:

```tsx
<div className="border-t border-gray-800" />
<MartaStatusCard />
```

---

## Files to Change

| File | Change |
|------|--------|
| `src/components/MartaStatusCard.tsx` | CREATE — new component |
| `src/components/Sidebar.tsx` | EDIT — import + insert between ZonePicker and button |

---

## Acceptance Criteria

**GIVEN** `useMartaData` returns vehicles including a Gold Line train and Blue Line train
**WHEN** MartaStatusCard renders
**THEN** Gold row shows amber label + 🟢 On Schedule; Blue row shows blue label + 🟢 On Schedule; College Park shows orange label + 🔴 Major Delays (0 buses)

**GIVEN** `/api/marta` returns an error (`isError: true`)
**WHEN** MartaStatusCard renders
**THEN** "Status unavailable" shown — no throw, sidebar layout intact

**GIVEN** data is loading (`isLoading: true`)
**WHEN** MartaStatusCard renders
**THEN** three skeleton rows visible with animate-pulse

**GIVEN** data loaded successfully
**WHEN** MartaStatusCard renders
**THEN** "Updated HH:MM" timestamp visible in muted text

**GIVEN** sidebar is w-80 (320px)
**WHEN** MartaStatusCard is present
**THEN** no horizontal overflow, no layout shift

**GIVEN** TypeScript compiler runs
**WHEN** MartaStatusCard.tsx included
**THEN** zero `any`, zero type errors

---

## Risks

| Risk | Mitigation |
|------|-----------|
| College Park has no dedicated bus route ID | Use `type === 'bus'` as proxy — acceptable for demo |
| SWR dedup window | Confirmed `dedupingInterval: 5000` — second consumer gets cached data free |
| Sidebar height on small screens | Card is ~88px — test at 768px |

---

## Model Router

2 files, same module layer, no shared contract change, standard UI addition.

**Decision:** Sonnet / General Engineer

---

## Sources

- `src/hooks/useMartaData.ts:1-36` (branch: main, commit: 68c53c4) — confirms SWR wiring, `refreshInterval: 10000`, `dedupingInterval: 5000`, return shape `{ vehicles, isLoading, isError }`
- `src/types/index.ts:1-8` (branch: main, commit: 68c53c4) — confirms `Vehicle` interface: `id`, `type: VehicleType ('bus'|'train')`, `route: string`, `lat`, `lng`; also `MartaApiResponse`
- `src/lib/marta.ts:9-14` (branch: main, commit: 68c53c4) — confirms `LINE_NAME_MAP` route values: `'Gold Line'`, `'Blue Line'`, `'Red Line'`, `'Green Line'` — NOT short codes like `'GOLD'`
- `src/lib/marta.ts:17-23` (branch: main, commit: 68c53c4) — confirms `MOCK_VEHICLES` uses `route: 'Gold Line'`, `route: 'Blue Line'` for trains; buses use `route: 'Route 110'` pattern
- `src/components/Sidebar.tsx:1-63` (branch: main, commit: 68c53c4) — confirms insertion point between ZonePicker and button; design uses `bg-gray-900`, `border-gray-800`, `text-gray-400`; no semantic tokens
- `src/app/api/marta/route.ts:1-20` (branch: main, commit: 68c53c4) — confirms `/api/marta` returns `MartaApiResponse`; falls back to `MOCK_VEHICLES` on error
