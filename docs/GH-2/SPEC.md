# SPEC: GH-2 — MartaStatusCard

**Issue:** [#2 — feat: MartaStatusCard — real-time MARTA service status for Match Day sidebar](https://github.com/doctor-ew/atlaiweek-fifa/issues/2)  
**Mode:** Story  
**Branch:** demo-test0

---

## Problem Statement

Fans using the Match Day ATL app can get transit directions from Claude, but have no way to know whether their MARTA line is currently running *before* they ask. The sidebar has match selector, zone picker, and CTA — but no live transit health signal. `MartaStatusCard` fills this gap: a compact, auto-refreshing card showing Gold, Blue, and College Park line status derived from the existing `/api/marta` vehicle feed.

**Demo constraint:** 20-minute live demo on `demo-test0` branch. Card must be visually complete and never crash.

---

## Technical Constraints

- Next.js 16 App Router, bun, Tailwind 4
- Sidebar is `w-80` (320px) — card must fit without overflow or layout shift
- **Reuse `useMartaData` hook** — do not create a second SWR call to `/api/marta`
- `useMartaData` uses `refreshInterval: 10000` (10s) — faster than PRD's 30s; keep existing config unchanged
- Design tokens: semantic only — `bg-surface`, `border-border`, `text-text`, `text-muted`, `text-accent` (amber/Gold), `text-delay` (orange/College Park), Tailwind `text-blue-400` (Blue line), Tailwind `text-green-500` / `text-yellow-500` / `text-red-500` (status dots only)
- TypeScript strict — no `any`
- No new dependencies

---

## Solution Design

### Status derivation

Filter `TransitVehicle[]` from `useMartaData()` per line:

| Line | Filter | Route ID |
|------|--------|----------|
| Gold | `v.type === 'train' && v.route === 'GOLD'` | `"GOLD"` |
| Blue | `v.type === 'train' && v.route === 'BLUE'` | `"BLUE"` |
| College Park | `v.type === 'bus'` | proxy — no dedicated route ID in API |

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
  ├── header row: "MARTA Service"  +  "Updated HH:MM" (text-muted, text-xs)
  ├── <LineRow> × 3
  │     ├── colored dot  (status: green/yellow/red)
  │     ├── line name    (color: text-accent / text-blue-400 / text-delay)
  │     └── status label (text-muted, text-xs)
  ├── loading state: three skeleton rows  (animate-pulse, bg-border)
  └── error state: "Status unavailable"  (text-muted, text-xs, text-center)
```

### Insertion point in HomeClient

Insert after the zone picker section (after `</div>` closing line 117), before CTA section (line 119). Pattern follows existing section dividers.

```tsx
{/* Divider */}
<div className="border-t border-border mx-4 my-3" />

{/* MARTA status */}
<div className="px-4 pb-2">
  <MartaStatusCard />
</div>
```

---

## Files to Change

| File | Change | Notes |
|------|--------|-------|
| `src/components/MartaStatusCard.tsx` | CREATE | New component; `"use client"` not needed — consumes `useMartaData` which handles client state |
| `src/app/HomeClient.tsx` | EDIT lines 117–119 | Add divider + section + `<MartaStatusCard />` import |

---

## Acceptance Criteria

**GIVEN** the sidebar renders with vehicle data  
**WHEN** `useMartaData` returns `[TRAIN001/GOLD, TRAIN002/BLUE]`  
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

1. Mock `useMartaData` returning `[TRAIN001/GOLD, TRAIN002/BLUE]` → Gold On Schedule, Blue On Schedule, College Park Major Delays
2. Mock returning empty `[]` → all three lines show 🔴 Major Delays
3. Mock `isError: true` → "Status unavailable" shown, no throw
4. Mock `isLoading: true` → skeleton rows shown
5. Render in 320px container → no overflow
6. TypeScript `tsc --noEmit` → zero errors

---

## Model Router

Files to change: 2 (`src/components/` + `src/app/`). No architecture decision. No shared contract change (component is self-contained, `useMartaData` signature unchanged). Standard UI component addition pattern.

**Decision:** Sonnet / General Engineer

---

## Sources

- `src/hooks/useMartaData.ts:1-36` (branch: demo-test0, commit: c0e0fd9) — confirms SWR wiring, `refreshInterval: 10000`, return shape `{ vehicles, isLoading, isError }`
- `src/app/api/marta/route.ts:5-11` (branch: demo-test0, commit: c0e0fd9) — confirms `TransitVehicle.route` values `"GOLD"`, `"BLUE"` for trains; buses have numeric route IDs `"1"`, `"2"`, `"3"`
- `src/app/api/marta/route.ts:59-72` (branch: demo-test0, commit: c0e0fd9) — confirms live train data uses `t.LINE` mapped to `route` field; no College Park route ID present
- `src/lib/types.ts:1-7` (branch: demo-test0, commit: c0e0fd9) — confirms `TransitVehicle` interface: `id`, `type: "bus" | "train"`, `latitude`, `longitude`, `route: string`
- `src/app/HomeClient.tsx:82` (branch: demo-test0, commit: c0e0fd9) — confirms sidebar `w-80`, `overflow-hidden`
- `src/app/HomeClient.tsx:111-117` (branch: demo-test0, commit: c0e0fd9) — confirms insertion point: after zone picker `</div>` at line 117, before CTA `<div>` at line 119
- `src/app/globals.css:1-42` (branch: demo-test0, commit: c0e0fd9) — confirms semantic token map: `text-accent` = amber `#e8a838`, `text-delay` = orange `#f0883e`, `text-muted`, `bg-surface`, `border-border`; no raw gray/amber tokens present
