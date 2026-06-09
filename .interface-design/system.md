# KeepLocal Design System: Cybernetic Studio Deck

This document saves the visual language, design constraints, and layout tokens used in the **keeplocal** workspace.

---

## 1. Direction and Feel
* **Concept:** *Cybernetic Studio Deck* — Evoking vintage rack-mount studio recording equipment, analog console boards, and physical tape decks, but executed with ultra-sleek, modern cybernetic aesthetics (glassmorphism, subtle glowing boundaries, and smooth status transitions).
* **Tone:** Highly secure, private, technical, air-gapped, and local-first.

---

## 2. Color Palette & Semantics
All colors are derived from a dark Obsidian-based canvas.

| Token Name | Tailwind/HEX | HSL Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-[#0f1013]` | `225 10% 6%` | Page-wide root canvas |
| **Deck Surface-1** | `bg-[#18191e]` | `230 11% 10%` | Primary panels, control card surfaces |
| **Inset Surface-2** | `bg-zinc-950` | `240 6% 4%` | Viewfinder screens, input dropdowns, nested lists |
| **Recording Red** | `text-rose-500` / `bg-rose-500` | `348 77% 50%` | Active recording indicators, stop/pause triggers |
| **Terminal Cyan** | `text-teal-400` / `bg-teal-500` | `173 80% 35%` | Default safe states, active selectors, live level meter |
| **Analog Amber** | `text-amber-500` / `bg-amber-500` | `35 92% 44%` | Warning state, buffer threshold notifications |
| **Panel Border** | `border-zinc-800/60` | `240 5% 15%` | Subtle container grid lines |

---

## 3. Spacing & Typography
* **Base Spacing Unit:** `4px`
  * Gaps and spacing strictly scale to multiples of 4:
    * Micro elements (icon-text): `gap-1.5` (6px) or `gap-2` (8px)
    * Medium containers (inputs): `p-3.5` or `p-4`
    * Major panels (viewfinder, decks): `p-6` or `p-8`
    * Layout grids: `gap-6` or `gap-8`
* **Typography Scale:**
  * **Default UI & Descriptions:** Sans-serif (`Geist` / `font-sans`) with light weights (`font-light` / `font-medium`) for body copy and uppercase labels.
  * **Telemetry & Counters:** Monospace (`Geist Mono` / `font-mono`) for numerical values, timers, RAM buffer size, status states, and hardware descriptions to guarantee aligned column spacing.

---

## 4. Depth & Borders
* **Depth Strategy:** *Borders-only* layout.
  * Avoid heavy shadows or drop shadows in a dark theme. Instead, rely on micro-elevation shifts (lightness differences between surfaces) and borders.
  * Interactive components utilize a border transition from muted Slate to glowing Cyan/Teal to show focus states rather than changing backgrounds dramatically.
* **Borders:** Low-opacity rgba/hsla borders to allow dark background tones to shine through container boundaries.

---

## 5. Key Component Patterns
1. **Viewfinder Screens:** Rounded aspect-ratio boxes (`rounded-2xl bg-black`) with absolute-positioned status badges in the upper corner, and monospace telemetry metrics docked at the bottom.
2. **Tactile Decks:** Control panels resemble physical modules (`bg-[#18191e] border border-zinc-800/60 p-6 rounded-2xl`). Sub-sections wrap input groupings inside a darker, inset viewport (`bg-zinc-950/80 border border-zinc-900 rounded-xl`).
3. **Live VU Equalizer:** Linear meter transitioning voice levels smoothly.
