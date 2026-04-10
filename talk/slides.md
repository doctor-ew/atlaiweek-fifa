---
theme: seriph
background: '#0d1117'
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## From Prompt to Production
  Atlanta AI Week · April 2026
drawings:
  persist: false
transition: slide-left
title: From Prompt to Production
mdc: true
---

# From Prompt to Production

**Building a FIFA Fan App with Claude Code**

<div class="mt-6 text-amber-400 font-semibold text-xl">Atlanta AI Week · April 2026</div>

<div class="mt-4 text-gray-400">Drew Schillinger · Enterprise Architect · @doctorew</div>

<div class="abs-br m-6 text-gray-600 text-sm">⚽ Match Day ATL</div>

---
layout: statement
---

# The Julia Child Method

<div class="text-2xl mt-8 text-gray-300">
The cake is already in the oven.<br>
<span class="text-amber-400">We're going to make one layer live.</span><br>
Then I'll show you the whole thing.
</div>

---
layout: two-cols
---

# The Problem

<div class="mt-4 space-y-4 text-lg">

🏟️ **FIFA World Cup 2026** comes to Atlanta

🚌 **MARTA** is the answer — but fans don't know how to use it

📍 **3 zones** · 8 matches · 1 stadium

❓ *"How do I get to the game from where I am right now?"*

</div>

::right::

<div class="mt-8 ml-8 p-6 bg-gray-800 rounded-xl border border-amber-400/30">

**Mercedes-Benz Stadium**
<div class="text-gray-400 text-sm mt-1">33.7545° N, 84.4025° W</div>

<div class="mt-4 space-y-2 text-sm">
  <div class="flex gap-2"><span class="text-amber-400">●</span> Gold Line → Five Points → stadium</div>
  <div class="flex gap-2"><span class="text-blue-400">●</span> Blue Line → Five Points → stadium</div>
  <div class="flex gap-2"><span class="text-orange-400">●</span> College Park → direct, ~30 min</div>
</div>

</div>

---
layout: center
---

# What We Built

<div class="mt-6 grid grid-cols-3 gap-6 text-center">

<div class="p-4 bg-gray-800 rounded-xl border border-gray-700">
  <div class="text-3xl mb-2">🗺️</div>
  <div class="font-semibold">Live Map</div>
  <div class="text-gray-400 text-sm mt-1">Google Maps · traffic layer · MARTA buses + trains moving in real time</div>
</div>

<div class="p-4 bg-gray-800 rounded-xl border border-amber-400/40">
  <div class="text-3xl mb-2">🤖</div>
  <div class="font-semibold text-amber-400">Claude Routing</div>
  <div class="text-gray-400 text-sm mt-1">Friend-voice AI recommendation streaming live · 3 sentences · no transit-app speak</div>
</div>

<div class="p-4 bg-gray-800 rounded-xl border border-gray-700">
  <div class="text-3xl mb-2">⚡</div>
  <div class="font-semibold">Demo Mode</div>
  <div class="text-gray-400 text-sm mt-1">?inject_delay=gold_line · shows alternate routing live on stage</div>
</div>

</div>

<div class="mt-8 text-amber-400 font-mono text-lg">atl-fifa-navigator-v2.vercel.app</div>

---
layout: center
background: '#161b22'
---

# The Stack

<div class="grid grid-cols-2 gap-8 mt-8 text-left max-w-2xl mx-auto">

<div class="space-y-3">
  <div class="text-amber-400 font-semibold text-sm uppercase tracking-wider">Frontend</div>
  <div class="space-y-2 text-sm">
    <div>⬛ Next.js 16 (App Router)</div>
    <div>🎨 Tailwind 4 · shadcn/ui</div>
    <div>🗺️ Google Maps JS API</div>
    <div>📦 bun (not npm)</div>
  </div>
</div>

<div class="space-y-3">
  <div class="text-amber-400 font-semibold text-sm uppercase tracking-wider">Backend + AI</div>
  <div class="space-y-2 text-sm">
    <div>🤖 Claude (claude-sonnet-4-6)</div>
    <div>⚡ Vercel AI SDK · streamText</div>
    <div>🚌 MARTA GTFS-RT + REST API</div>
    <div>🚀 Vercel (auto-deploy on push)</div>
  </div>
</div>

</div>

---
layout: section
---

# gstack

**Garry Tan's open-source AI software factory**

<div class="mt-4 text-gray-400 text-lg">
Slash commands that give Claude specialized roles.<br>
Not a chat. A workflow.
</div>

---

# The gstack Workflow

<div class="mt-6 space-y-4">

<div class="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border-l-4 border-amber-400">
  <div class="font-mono text-amber-400 w-40 shrink-0">/office-hours</div>
  <div><span class="font-semibold">CEO mode</span> · validates the concept, surfaces gaps, pushes back on bad ideas before a line is written</div>
</div>

<div class="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border-l-4 border-blue-400">
  <div class="font-mono text-blue-400 w-40 shrink-0">/plan-eng-review</div>
  <div><span class="font-semibold">Eng Manager mode</span> · locks architecture, identifies risks, writes the test plan</div>
</div>

<div class="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border-l-4 border-purple-400">
  <div class="font-mono text-purple-400 w-40 shrink-0">/plan-design-review</div>
  <div><span class="font-semibold">Designer mode</span> · 7 passes, rates the plan 0-10, fixes AI slop before it ships</div>
</div>

<div class="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border-l-4 border-green-400">
  <div class="font-mono text-green-400 w-40 shrink-0">/ship</div>
  <div><span class="font-semibold">Release mode</span> · PR created, Vercel deployed, done</div>
</div>

</div>

---
layout: two-cols
---

# The Build Journey

<div class="mt-4 space-y-3 text-sm">

<div class="p-3 bg-gray-800 rounded border-l-2 border-amber-400">
  <div class="text-amber-400 font-mono text-xs">/office-hours</div>
  <div class="mt-1 text-gray-300">Validates concept. Picks Approach B: real API + friend voice + controlled chaos.</div>
</div>

<div class="p-3 bg-gray-800 rounded border-l-2 border-blue-400">
  <div class="text-blue-400 font-mono text-xs">/plan-eng-review</div>
  <div class="mt-1 text-gray-300">13 issues found. 1 critical gap (Zod match schema). Architecture locked.</div>
</div>

<div class="p-3 bg-gray-800 rounded border-l-2 border-purple-400">
  <div class="text-purple-400 font-mono text-xs">/plan-design-review</div>
  <div class="mt-1 text-gray-300">Plan was 4/10 on design. 7 passes later: 8.5/10. Full color palette written. Under 10 minutes.</div>
</div>

<div class="p-3 bg-gray-800 rounded border-l-2 border-green-400">
  <div class="text-green-400 font-mono text-xs">Build → /ship</div>
  <div class="mt-1 text-gray-300">git push → Vercel auto-deploy. Live in 34 seconds.</div>
</div>

</div>

::right::

<div class="ml-6 mt-4 space-y-3">

```
STATUS: ENG CLEARED
13 issues found, all resolved
1 critical gap → TODOS.md
Test plan written
Architecture locked ✓
```

```
Design: 4/10 → 8.5/10
Color palette: ✓
Touch targets: ✓  
All interaction states: ✓
AI slop risks called out: ✓
```

```
Build time: ~2 hours
bun create next-app → 
  components → 
    API routes → 
      Vercel deploy ✓
```

</div>

---
layout: statement
---

# "Wait — the map IS the point."

<div class="text-xl mt-6 text-gray-400 max-w-xl mx-auto">
The design doc said no maps.<br>
<span class="text-amber-400">The user said the map was the whole demo.</span><br>
We pivoted. The map went in. Live MARTA data. Buses moving.
</div>

<div class="mt-8 text-gray-600 text-sm italic">
This is what good AI collaboration looks like — the human has context the AI doesn't.
</div>

---

# Three Decisions That Shaped the App

<div class="mt-6 space-y-5">

<div class="flex gap-6 items-start">
  <div class="text-amber-400 font-bold text-2xl w-8 shrink-0">1</div>
  <div>
    <div class="font-semibold">inject_delay via POST body, not URL param</div>
    <div class="text-gray-400 text-sm mt-1">Client reads <code>?inject_delay=gold_line</code>, forwards it in the API body. Clean separation. The URL triggers; the server routes.</div>
  </div>
</div>

<div class="flex gap-6 items-start">
  <div class="text-amber-400 font-bold text-2xl w-8 shrink-0">2</div>
  <div>
    <div class="font-semibold">No SWR polling — server fetches MARTA inline</div>
    <div class="text-gray-400 text-sm mt-1">Background polling is wasted work. MARTA data is fetched when Claude needs it, not continuously. The map uses its own 10s poll for vehicle positions.</div>
  </div>
</div>

<div class="flex gap-6 items-start">
  <div class="text-amber-400 font-bold text-2xl w-8 shrink-0">3</div>
  <div>
    <div class="font-semibold">8s timeout → pre-baked fallback (not an error)</div>
    <div class="text-gray-400 text-sm mt-1">Conference wifi is hostile. If Claude doesn't respond in 8 seconds, a human-written fallback renders. The user never sees a spinner forever.</div>
  </div>
</div>

</div>

---
layout: center
---

# The Friend Voice Prompt

<div class="mt-6 max-w-2xl mx-auto text-left">

```
System: You are a local Atlanta friend who knows MARTA well.
You help FIFA World Cup fans get to Mercedes-Benz Stadium.
You speak plainly, like someone texting a friend.
Never sound like a transit app.
Never say "Route A", "minutes saved", or "optimal path."
If MARTA is bad, say so and give the real workaround.
Max 3 sentences.

User: I'm in {zone}. The match ({team_a} vs {team_b}) kicks off
in {minutes} minutes. MARTA status: {status}. What should I do?
```

</div>

<div class="mt-6 p-4 bg-gray-800 rounded-lg border border-amber-400/30 max-w-2xl mx-auto text-sm text-gray-300 italic">
"You're golden — hop on the Gold Line at Five Points, it goes straight to Mercedes-Benz Stadium. Takes about 5 minutes. Get there early, the concourse fills up fast."
</div>

---
layout: center
background: '#0d1117'
---

# 🔴 LIVE BUILD

<div class="text-2xl mt-6 text-gray-300">
We're building the <span class="text-amber-400">MARTA Status Card</span> right now.
</div>

<div class="mt-8 space-y-3 text-left max-w-lg mx-auto text-sm text-gray-400">
  <div>1. <code class="text-amber-400">/effort high</code> — think harder before we write anything</div>
  <div>2. Scaffold the component live</div>
  <div>3. <code class="text-amber-400">/simplify</code> — Claude reviews its own work</div>
  <div>4. <code class="text-green-400">/ship</code> — PR + Vercel in one command</div>
</div>

<div class="mt-10 text-gray-600 text-sm">
  Watch what Claude cuts. That's the lesson.
</div>

---
layout: center
---

# The Reveal ⚽

<div class="mt-8 text-4xl font-mono text-amber-400">
atl-fifa-navigator-v2.vercel.app
</div>

<div class="mt-6 text-gray-400">
Scan the QR code · Try it on your phone · Pick a zone, pick a match, ask Claude
</div>

<div class="mt-10 grid grid-cols-3 gap-4 text-sm text-center max-w-lg mx-auto">
  <div class="p-3 bg-gray-800 rounded">
    <div class="text-amber-400 font-semibold">Live MARTA</div>
    <div class="text-gray-400 text-xs mt-1">Real buses + trains, 10s updates</div>
  </div>
  <div class="p-3 bg-gray-800 rounded">
    <div class="text-amber-400 font-semibold">Claude Routing</div>
    <div class="text-gray-400 text-xs mt-1">Streaming friend-voice advice</div>
  </div>
  <div class="p-3 bg-gray-800 rounded">
    <div class="text-amber-400 font-semibold">Demo Mode</div>
    <div class="text-gray-400 text-xs mt-1">?inject_delay=gold_line</div>
  </div>
</div>

---
layout: statement
---

# What This Actually Means

<div class="mt-8 space-y-4 text-left max-w-xl mx-auto">

<div class="flex gap-3">
  <span class="text-amber-400">→</span>
  <div><span class="font-semibold">The bottleneck isn't coding anymore.</span> It's knowing what to build and why.</div>
</div>

<div class="flex gap-3">
  <span class="text-amber-400">→</span>
  <div><span class="font-semibold">Roles collapse.</span> The architect, the engineer, the designer, the QA lead — one person, with the right prompts.</div>
</div>

<div class="flex gap-3">
  <span class="text-amber-400">→</span>
  <div><span class="font-semibold">The human's job is taste and judgment.</span> When to push back. When to pivot. The map IS the point.</div>
</div>

<div class="flex gap-3">
  <span class="text-amber-400">→</span>
  <div><span class="font-semibold">Boil the lake.</span> AI makes completeness near-free. Always do the whole thing.</div>
</div>

</div>

---
layout: center
background: '#0d1117'
---

# Get the Tools

<div class="mt-8 grid grid-cols-2 gap-8 max-w-lg mx-auto text-left">

<div>
  <div class="text-amber-400 font-semibold mb-2">Claude Code</div>
  <div class="font-mono text-sm text-gray-400">claude.ai/code</div>
  <div class="text-xs text-gray-600 mt-1">The CLI we used today</div>
</div>

<div>
  <div class="text-amber-400 font-semibold mb-2">gstack</div>
  <div class="font-mono text-sm text-gray-400">github.com/garrys-list/gstack</div>
  <div class="text-xs text-gray-600 mt-1">The slash commands</div>
</div>

<div>
  <div class="text-amber-400 font-semibold mb-2">This app</div>
  <div class="font-mono text-sm text-gray-400">github.com/doctor-ew/atlaiweek-fifa</div>
  <div class="text-xs text-gray-600 mt-1">Full source, open</div>
</div>

<div>
  <div class="text-amber-400 font-semibold mb-2">Live demo</div>
  <div class="font-mono text-sm text-gray-400">atl-fifa-navigator-v2.vercel.app</div>
  <div class="text-xs text-gray-600 mt-1">Try it · share it</div>
</div>

</div>

<div class="mt-10 text-gray-600">@doctorew · Atlanta AI Week 2026</div>

---
layout: end
---

# ⚽ See you at the match.
