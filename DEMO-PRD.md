# PRD: MARTA Status Card

**Paste this at the start of the live demo session.**

---

## What we're building

A `MartaStatusCard` React component for the Match Day ATL sidebar.

It shows real-time service status for the three MARTA routes that serve
Mercedes-Benz Stadium, so fans know at a glance whether their line is running
before they ask Claude for directions.

---

## Context

- App: `atl-fifa-navigator-v2` — Next.js 16 App Router, bun, Tailwind 4, shadcn/ui
- Sidebar already has: MatchSelector, NeighborhoodPicker, RecommendationCard
- MARTA data already available at `/api/marta` (returns buses + trains with positions)
- Design tokens: `text-amber-400` accent, `bg-gray-800/80` panels, `text-gray-300` body

---

## The component

**Location:** `src/components/MartaStatusCard.tsx`  
**Used in:** `src/app/HomeClient.tsx` sidebar, above the CTA button

**Shows status for three lines:**

| Line | Color | Route |
|------|-------|-------|
| Gold Line | amber | Doraville ↔ Five Points ↔ Stadium |
| Blue Line | blue | Indian Creek ↔ Five Points ↔ Stadium |
| College Park | orange | Airport direct, ~30 min |

**Status levels (derive from MARTA vehicle data):**

- 🟢 **On Schedule** — vehicles running, no significant gaps
- 🟡 **Minor Delays** — gaps detected or crowding reported
- 🔴 **Major Delays** — significant gaps or service disruption

**UX rules:**

- Card refreshes every 30 seconds (use SWR with `refreshInterval: 30000`)
- Show "Last updated HH:MM" timestamp in muted text
- If `/api/marta` fails, show a neutral "Status unavailable" state — never crash
- Compact: fits in the `w-80` sidebar without scrolling

---

## What this is NOT

- No push notifications
- No historical data
- No per-vehicle tracking (that's the map's job)
- No animations beyond a subtle pulse on the refresh indicator

---

## Acceptance criteria

1. Component renders three line rows with correct colors
2. Status badge updates correctly from live MARTA data
3. 30s auto-refresh works without user interaction
4. Graceful error state when API is down
5. Fits sidebar without layout shift
6. TypeScript — no `any`
