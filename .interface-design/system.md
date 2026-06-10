# KeepLocal Design System: Cybernetic Studio Deck

This document saves the visual language, design constraints, and layout tokens used in the **keeplocal** workspace.

---

## 1. Direction and Feel
* **Concept:** *Cybernetic Studio Deck* — Evoking vintage rack-mount studio recording equipment, analog console boards, and physical tape decks, but executed with ultra-sleek, modern cybernetic aesthetics (glassmorphism, subtle glowing boundaries, and smooth status transitions).
* **Tone:** Highly secure, private, technical, air-gapped, and local-first.
* **Refinement (2026):** Delicate minimalism — near-black canvas, hairline borders (`white/6–10%`), mesh gradient atmosphere, pill CTAs, bento grids. Color enters through soft washes (brand teal, emerald, sky, violet) — never decorative rainbow icons.
* **Signature Element:** *Signal Path* — Browser → RAM Buffer → Local Download with a "no server" indicator. Styled as studio signal routing.

---

## 2. Color Palette & Semantics

All colors are defined as CSS custom properties in `src/app/globals.css` and mapped to Tailwind via `@theme inline`.

| Token | HSL | Use Case |
| :--- | :--- | :--- |
| `--canvas` | `0 0% 0%` | Pure near-black page canvas |
| `--surface-1` | `230 11% 10%` | Primary panels, control card surfaces |
| `--surface-2` | `240 6% 4%` | Viewfinder screens, input dropdowns, nested lists |
| `--surface-footer` | `225 12% 5%` | Footer background |
| `--viewfinder` | `220 15% 3%` | Viewfinder screen black |
| `--foreground-primary` | `0 0% 100%` | Headlines, primary text |
| `--foreground-secondary` | `240 5% 65%` | Body copy, descriptions |
| `--foreground-tertiary` | `240 4% 46%` | Metadata, labels |
| `--foreground-muted` | `240 5% 34%` | Disabled, placeholders |
| `--brand` | `173 80% 35%` | Terminal cyan — safe states, CTAs, live meter |
| `--recording` | `348 77% 50%` | REC indicators, privacy emphasis |
| `--warning` | `35 92% 44%` | Warning state, buffer threshold |
| `--border-subtle` | `0 0% 100% / 0.06` | Hairline separation |
| `--border-default` | `0 0% 100% / 0.10` | Standard container borders |
| `--accent-emerald` | `160 60% 45%` | Delicate mesh / VU spectrum |
| `--accent-sky` | `200 70% 55%` | Delicate mesh washes |
| `--accent-violet` | `260 50% 58%` | Hero atmosphere accent |

**Accent rule:** One primary accent (brand/teal). Recording red and warning amber are semantic only — never decorative rainbow icons.

---

## 3. Spacing & Typography
* **Base Spacing Unit:** `4px`
  * Micro elements (icon-text): `gap-1.5` (6px) or `gap-2` (8px)
  * Medium containers (inputs): `p-3.5` or `p-4`
  * Major panels (viewfinder, decks): `p-6` or `p-8`
  * Layout grids: `gap-6` or `gap-8`
* **Typography Scale:**
  * **Default UI & Descriptions:** Sans-serif (`Geist` / `font-sans`) with light weights for body copy.
  * **Telemetry & Counters:** Monospace (`Geist Mono` / `font-mono`) for numerical values, timers, RAM buffer size, status states, step numbers, and trust badges.

---

## 4. Depth & Borders
* **Depth Strategy:** *Borders-only* layout.
  * Avoid heavy shadows except on viewfinder/product preview (subtle `shadow-black/50`).
  * Interactive components utilize border transition from muted to glowing brand/emphasis rather than dramatic background shifts.
* **Ambient texture:** `.canvas-texture` — dot grid + soft brand glow at top.
* **Hero atmosphere:** `.hero-atmosphere` + `HeroAtmosphere` orbs — mesh gradients (brand, emerald, sky, violet).
* **Surfaces:** `.bento-card` — `white/2%` fill, hairline border, hover brightens subtly.
* **Buttons:** `.btn-primary` (white pill + brand shadow), `.btn-secondary` (ghost pill).
* **Spectrum:** `.spectrum-wash` — viewfinder/preview color refraction.

---

## 5. Key Component Patterns

### Layout
1. **SiteHeader:** Sticky, backdrop-blur, LogoBadge + language switcher. Tool variant adds back navigation.
2. **SiteFooter:** Three-column grid (brand, tools, links) on desktop.
3. **KeeplocalLogo / LogoBadge:** Vector mark — studio module frame, signal rings, inward local loop. Used in header, footer, favicon (`src/app/icon.svg`, `public/icon.svg`).

### Marketing (Landing)
3. **HeroSection:** Split layout — copy left, ToolsPreview right (dual tool mocks). Dual CTAs for Record Once + Screen to GIF.
4. **ToolsPreview:** Stacked mini previews for Record Once and Screen to GIF.
5. **SignalPath:** Three-step flow with animated connector lines and "no server" pill.
6. **ToolCard:** Featured tool with badges, description, and mini deck icons.
7. **HowItWorks:** Three rack-style modules with monospace step numbers (01, 02, 03).
8. **FeatureCard:** Unified accent system — brand, recording, warning, or neutral.
9. **TrustStrip:** Pill badges in monospace for trust claims.

### Recorder
10. **Viewfinder Screens:** Rounded aspect-ratio boxes with status badges and monospace telemetry.
11. **Tactile Decks:** Control panels on `surface-1` with inset sub-sections on `surface-2`.
12. **Live VU Equalizer:** Linear meter with brand gradient.

### Animations
* `.rec-pulse` — REC indicator opacity pulse (1.5s)
* `.vu-bar-animate` — Idle VU meter width animation (2.4s)
* `.signal-flow` — Dashed connector stroke animation (1.2s)

---

## 6. Border Radius Scale
* `--radius-sm`: 0.5rem — inputs, small controls
* `--radius-md`: 0.75rem — buttons
* `--radius-lg` / `--radius-xl`: 1rem–1.25rem — cards, panels
* `rounded-2xl`: viewfinder, major sections
