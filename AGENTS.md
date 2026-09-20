# FolioCuts Frontend — Design System & Animation Guidelines

## Color Palette

All colors derive from the landing page brand. Use CSS variables — never hardcode hex values in components.

### Core Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--ink` | `#08251a` | Primary text, headings |
| `--forest` | `#063b26` | Primary brand, dark backgrounds, buttons |
| `--lime` | `#cfff92` | Accent, highlights, CTAs, active states |
| `--yellow` | `#ffeb69` | Secondary accent, badges, warnings |
| `--peach` | `#ffc091` | Tertiary accent, warm highlights |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper` | `#f5f6f4` | Card backgrounds, muted surfaces |
| `--muted` | `#5b6961` | Secondary text, placeholders |
| `--line` | `#e1e6df` | Borders, dividers |
| `--background` | `#ffffff` | Page background |

### Semantic Mapping (Tailwind/shadcn)

```
--primary        → #063b26 (forest)
--primary-foreground → #ffffff
--secondary      → #cfff92 (lime)
--secondary-foreground → #08251a (ink)
--accent         → #cfff92 (lime)
--accent-foreground → #08251a (ink)
--muted          → #f5f6f4 (paper)
--muted-foreground → #5b6961
--destructive    → #e63946
--border         → #e1e6df (line)
--input          → #f5f6f4 (paper)
--ring           → #063b26 (forest)
--card           → #ffffff
--card-foreground → #08251a (ink)
```

### Dark Theme

```
--background     → #0a1f15
--foreground     → #f5f6f4 (paper)
--primary        → #cfff92 (lime — inverted emphasis)
--primary-foreground → #063b26 (forest)
--card           → #0f2b1d
--card-foreground → #f5f6f4
--muted          → #132e20
--muted-foreground → #8fa698
--border         → #1a3d2a
--input          → #132e20
--ring           → #cfff92
--accent         → #cfff92
--accent-foreground → #063b26
--sidebar        → #0a1f15
--sidebar-foreground → #f5f6f4
--sidebar-primary → #cfff92
--sidebar-primary-foreground → #063b26
--sidebar-accent → #132e20
--sidebar-accent-foreground → #f5f6f4
--sidebar-border → #1a3d2a
```

### Chart Colors

```
--chart-1 → #063b26 (forest)
--chart-2 → #cfff92 (lime)
--chart-3 → #ffeb69 (yellow)
--chart-4 → #ffc091 (peach)
--chart-5 → #5b6961 (muted)
```

---

## Typography

**Font**: Inter (variable) — `var(--font-inter), Arial, sans-serif`

### Scale

| Use | Size | Weight | Letter-spacing |
|-----|------|--------|----------------|
| H1 (page) | clamp(48px, 5.5vw, 76px) | 700 | -4.1px |
| H2 (section) | clamp(32px, 3.35vw, 46px) | 700 | -1.9px |
| H3 (card) | 20–24px | 600 | -0.3px |
| Body | 17–18px | 400 | 0 |
| Body small | 14–15px | 400 | 0 |
| Caption | 12–13px | 500 | 0 |
| Eyebrow | 12px uppercase | 600 | 1.65px |

### Line Heights

| Context | Value |
|---------|-------|
| Headings (h1) | 1.05 |
| Headings (h2/h3) | 1.15 |
| Body | 1.65 |
| UI labels | 1.4 |

---

## Spacing

**Container**: `min(1280px, calc(100% - 64px))` centered.

Section padding: ~100–115px block. Cards: 14–16px border-radius. Gaps: 8px base unit (8, 16, 24, 32, 48).

---

## Animation Guidelines

Source: Emil Kowalski's 7 Practical Animation Tips + landing page patterns.

### Easing Curves — Use These Exact Values

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entrances, exits */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen movement */
```

Built-in CSS `ease-out` is too weak. Always use these custom curves.

**Never use `ease-in` on UI elements.** It starts slow at the exact moment user is watching.

### Duration

| Element | Duration |
|---------|----------|
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| **All UI animations** | **Under 300ms** |

180ms dropdown > 400ms dropdown. Faster = more responsive.

### Properties — Only These

Animate **`transform` and `opacity` only**. They skip layout/paint and run on GPU.

Never animate: `width`, `height`, `margin`, `padding`, `top`, `left`.

Exception: `clip-path` (sanctioned fourth), `height` (accordions only).

### Hard Rules

1. **Never `scale(0)`**. Start from `scale(0.95–0.97)` + `opacity: 0`. Nothing appears from nothing.
2. **Button press**: `scale(0.97)` on `:active`. Makes interface feel immediately responsive.
3. **Transform-origin at trigger** for popovers/dropdowns/menus. Modals exempt (centered).
4. **No delay on subsequent tooltips** — once one opens, others appear instantly.
5. **Exit the way it entered** — slide in from bottom, leave through bottom.
6. **Blur as last resort** — `filter: blur(2px)` bridges visual gaps when easing alone fails.

### Frequency Gate — Should It Animate At All?

| Frequency | Decision |
|-----------|----------|
| 100+/day (keyboard shortcuts, toggles) | **No animation. Ever.** |
| Tens/day (hover, list nav) | Near-imperceptible only |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, success) | Delight budget lives here |

### Reduced Motion & Hover Gating

Ship with every animation:

```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; }
}

@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); }
}
```

Reduced motion = fewer and gentler, not zero.

### Spring Configs (for motion.dev / framer-motion)

```js
// Apple-style spring
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Traditional physics
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

Bounce: 0.1–0.3. Avoid bounce in most UI — reserve for drag-to-dismiss and playful interactions.

### Motion Library: Use Full Transform Strings

```jsx
// BAD — drops frames under load
<motion.div animate={{ x: 100 }} />

// GOOD — hardware accelerated
<motion.div animate={{ transform: "translateX(100px)" }} />
```

### Stagger

Lists/grids: 30–80ms stagger between children. Never enter everything at once.

### Never Ship

- `transition: all` — name exact properties
- `scale(0)` entrance — use `scale(0.95)` + `opacity: 0`
- `ease-in` on UI — use `ease-out`
- Built-in `ease-out` — use `cubic-bezier(0.23, 1, 0.32, 1)`
- UI duration over 300ms without reason
- Keyframes on rapidly-triggered elements — use transitions
- Ungated `:hover` — wrap in `@media (hover: hover)`
- Missing `prefers-reduced-motion`

---

## Component Patterns

### Borders & Radius

| Component | Radius |
|-----------|--------|
| Small (badges, pills) | 4–6px |
| Inputs, small cards | 10px |
| Cards | 14–16px |
| Sections, large cards | 20–28px |
| Avatars, circles | 50% |

### Shadows

```css
/* Subtle card */
box-shadow: 0 6px 20px #13331a04;

/* Elevated card (hover) */
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);

/* Modal/overlay */
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12);
```

### Z-Index Stack

```
10  — mobile nav
20  — site header
100 — skip link / overlays
```
