# Theme System + UX Polish — Implementation

## Overview

Implement 4 visual themes for Akhtar Abbasi Hiking using CSS custom properties mapped through Tailwind v4's `@theme` block. Refactor 29 public-facing files to use token-based utility classes. Admin CMS stays fixed on Midnight Summit.

---

## Progress Tracking

| Step | Description | Status |
|------|-------------|--------|
| 1 | CSS Variables + Tailwind Mappings | ✅ Complete |
| 2 | ThemeProvider + Cookie Persistence | ✅ Complete |
| 3 | Root Loader & Layout (SSR + admin lock) | ✅ Complete |
| 4 | Theme Switcher UI (desktop + mobile) | ✅ Complete |
| 5 | Header Integration | ✅ Complete |
| 6 | Audit & Refactor 29 Public Files | ✅ Complete |
| 7 | Admin Exclusion (forced `midnight-summit`) | ✅ Complete (handled in Step 3) |
| 8 | Per-Theme Gradient Verification | ✅ Complete (user confirmed all themes render correctly, no muddy gradient) |
| 9 | Final Verification (`typecheck` + `build`) | ✅ Complete (both pass) |

**Last verified state:** All 9 steps complete. User confirmed all 4 themes (Midnight Summit, Golden Hour, Glacier Blue, Pine Shadow) render correctly across the site. `npx tsc --noEmit` and `npm run build` both pass. Admin CMS remains visually locked to Midnight Summit.

**Pause point:** All steps complete. Theme system + UX polish implementation is done.

### Files changed in Steps 1–5

| Action | Path |
|--------|------|
| **Edit** | `app/app.css` — full rewrite with 11 independent `@theme` tokens, 4 `[data-theme]` blocks, body uses `bg-primary text-ink`, `.text-gradient` theme-aware |
| **Create** | `app/lib/theme.tsx` — `ThemeProvider`, `useTheme`, `parseThemeFromCookieHeader`, `DEFAULT_THEME`, `THEMES` |
| **Edit** | `app/root.tsx` — loader reads cookie + forces `midnight-summit` for `/admin/*`; `Layout` sets `data-theme` on `<html>`; `App` wraps in `<ThemeProvider>` |
| **Create** | `app/components/ThemeSwitcher.tsx` — desktop dropdown pill + mobile dots row, click-outside + Escape close |
| **Edit** | `app/components/Header.tsx` — added `<ThemeSwitcher variant="desktop" />` to top info bar, `<ThemeSwitcher variant="mobile" />` inside mobile nav |

---

## Final Approved Palette

### CSS Variable Tokens

| Token | Purpose |
|-------|---------|
| `--color-bg` | Page background |
| `--color-surface` | Card/section backgrounds |
| `--color-border` | Borders, dividers |
| `--color-ink` | Primary text (headings, body) |
| `--color-muted` | Secondary/muted text |
| `--color-accent` | Primary accent — leads links, highlights, badges, focus rings |
| `--color-accent-hover` | Hover state for accent |
| `--color-cta` | **Brand green fixed** — CTA/WhatsApp buttons only |
| `--color-cta-hover` | Hover state for CTA |
| `--color-secondary` | Warm/amber — ratings, difficulty badges, warnings |
| `--color-secondary-hover` | Hover state for secondary |

### Tailwind Utility Mappings

> **Naming rule:** `--color-primary` exists in `@theme` only to power the `bg-primary` utility (it points to `var(--color-bg)`). Tailwind will auto-generate a `text-primary` utility from that same variable, but **`text-primary` must NEVER be used** — it would resolve to the page background color. Use `text-ink` for all text color. If `text-primary` appears anywhere in a component, treat it as a bug and replace with `text-ink`.

| Token Class | CSS Variable |
|-------------|--------------|
| `bg-primary` | `var(--color-bg)` |
| `bg-surface` | `var(--color-surface)` |
| `border-surface` | `var(--color-border)` |
| `text-ink` | `var(--color-ink)` |
| `text-muted` | `var(--color-muted)` |
| `text-accent` / `border-accent` / `bg-accent` / `ring-accent` / `from-accent` | `var(--color-accent)` |
| `hover:bg-accent-hover` / `hover:text-accent-hover` | `var(--color-accent-hover)` |
| `bg-cta` / `text-cta` / `border-cta` | `var(--color-cta)` |
| `hover:bg-cta-hover` | `var(--color-cta-hover)` |
| `text-secondary` / `border-secondary` / `bg-secondary` / `to-secondary` | `var(--color-secondary)` |
| `hover:text-secondary-hover` | `var(--color-secondary-hover)` |

---

### Theme 1: Midnight Summit *(Dark — Default)*

- Concept: Deep mountain night under a star-filled sky
- Preserves the existing brand palette 1:1

```
--color-bg:              #0a0f1a
--color-surface:         #111827
--color-border:          #1f2937
--color-text:            #f9fafb
--color-muted:           #9ca3af
--color-accent:          #16a34a
--color-accent-hover:    #15803d
--color-cta:             #16a34a
--color-cta-hover:       #15803d
--color-secondary:       #d97706
--color-secondary-hover: #b45309
```

### Theme 2: Golden Hour *(Light-Warm)*

- Concept: Warm sunset light on the peaks of Hunza Valley
- Replaces green with burnt orange; CTA stays brand green

```
--color-bg:              #faf7f2
--color-surface:         #ffffff
--color-border:          #e8ddd0
--color-text:            #1c1917
--color-muted:           #78716c
--color-accent:          #c2410c
--color-accent-hover:    #9a3412
--color-cta:             #16a34a    ← brand green fixed
--color-cta-hover:       #15803d
--color-secondary:       #f59e0b
--color-secondary-hover: #d97706
```

### Theme 3: Glacier Blue *(Light-Cool)*

- Concept: Crystalline ice and glacial melt under a high-altitude sky
- Replaces green with sky blue; CTA stays brand green; amber kept for ratings

```
--color-bg:              #f0f9ff
--color-surface:         #ffffff
--color-border:          #dbeafe
--color-text:            #1e293b
--color-muted:           #64748b
--color-accent:          #0284c7
--color-accent-hover:    #0369a1
--color-cta:             #16a34a    ← brand green fixed
--color-cta-hover:       #15803d
--color-secondary:       #d97706    ← amber kept distinct from cool palette
--color-secondary-hover: #b45309
```

### Theme 4: Pine Shadow *(Dark-Warm)*

- Concept: Ancient deodar forests and earthy mountain trails
- Fresh green-500 leads; warm gold for ratings

```
--color-bg:              #0f1a0f
--color-surface:         #1a2a1a
--color-border:          #2a3f2a
--color-text:            #f0faf0
--color-muted:           #9ca3af
--color-accent:          #22c55e
--color-accent-hover:    #16a34a
--color-cta:             #16a34a
--color-cta-hover:       #15803d
--color-secondary:       #f59e0b    ← warm gold (not violet)
--color-secondary-hover: #d97706
```

---

## Implementation Steps

### Step 1 — CSS Variables + Tailwind Mappings ✅ Complete

**File:** `app/app.css`

- Remove hardcoded `bg-[#0a0f1a]` / `text-[#f9fafb]` from `html`/`body` rules
- Define `:root` with Midnight Summit token values
- Add `[data-theme="midnight-summit"]`, `[data-theme="golden-hour"]`, `[data-theme="glacier-blue"]`, `[data-theme="pine-shadow"]` blocks overriding the 11 tokens
- Map all tokens into the `@theme` block as `--color-*` so Tailwind generates `bg-primary`, `text-ink`, `text-accent`, etc. Note: `--color-primary` exists only to power the `bg-primary` utility; `--color-ink` is the dedicated text-color token (see naming rule above).
- Update `body` to use `bg-primary text-ink`
- Update `.text-gradient` to be theme-aware (per-theme `from`/`to` stops)
- Update `input`/`textarea`/`select` defaults to use token variables
- Update `a` link defaults to use token variables
- Remove hardcoded `color-scheme: dark` — use token or inline per-theme `color-scheme`

### Step 2 — ThemeProvider + Cookie Persistence ✅ Complete

**New file:** `app/lib/theme.tsx`

- React Context with `{ theme, setTheme }`
- `setTheme(name)`: writes cookie `theme=<name>; Max-Age=31536000; Path=/; SameSite=Lax`, sets `data-theme` on `<html>`
- On mount: reads cookie, falls back to `"midnight-summit"`
- Export `ThemeProvider` component (wraps children) and `useTheme` hook

### Step 3 — Root Loader & Layout ✅ Complete

**File:** `app/root.tsx`

- Root `loader` reads `theme` cookie from `request.headers.get("Cookie")`
- Returns `theme` alongside existing data
- `Layout()` sets `data-theme={theme}` on `<html>` — SSR renders correct theme immediately, no FOUC
- `App()` wraps content in `<ThemeProvider>` (client-only hydration context)
- Utility: `parseCookies()` helper in root or inline

### Step 4 — Theme Switcher UI ✅ Complete

**New file:** `app/components/ThemeSwitcher.tsx`

Props: `variant: "desktop" | "mobile"`

Desktop:
- Small dropdown pill showing current theme name + color swatch
- On click: reveals 4 options with name + small dot swatch
- Clicking an option calls `setTheme()`
- Positioned in the header top info bar next to location/email/phone

Mobile:
- Compact row with 4 theme dots (no labels, or short labels)
- Clicking a dot calls `setTheme()`
- Rendered inside the mobile nav menu below nav items

### Step 5 — Header Integration ✅ Complete

**File:** `app/components/Header.tsx`

- Add `<ThemeSwitcher variant="desktop" />` to the top info bar (`hidden md:flex` row)
- Add `<ThemeSwitcher variant="mobile" />` inside the mobile nav menu, below nav items and above the Contact Us button
- No layout structure changes, only insertion points

### Step 6 — Audit & Refactor Public Files ✅ Complete

Replace hardcoded hex/Tailwind colors with CSS variable token classes in 29 files:

**12 Components:**
1. `Accordion.tsx`
2. `Breadcrumb.tsx`
3. `DetailSidebar.tsx`
4. `DestinationCard.tsx`
5. `Footer.tsx`
6. `Header.tsx`
7. `HeroSection.tsx`
8. `Lightbox.tsx`
9. `SectionTitle.tsx`
10. `StatsBar.tsx`
11. `TripCard.tsx`
12. `WhatsAppButton.tsx`

**17 Route files:**
1. `root.tsx`
2. `routes/_index.tsx`
3. `routes/about.tsx`
4. `routes/blog._index.tsx`
5. `routes/blog.$slug.tsx`
6. `routes/contact.tsx`
7. `routes/expeditions._index.tsx`
8. `routes/expeditions.$slug.tsx`
9. `routes/faq.tsx`
10. `routes/gallery.tsx`
11. `routes/login.tsx`
12. `routes/tours._index.tsx`
13. `routes/tours.$slug.tsx`
14. `routes/trips._index.tsx`
15. `routes/trips.$slug.tsx`

**Refactor rules per file:**
- `bg-[#0a0f1a]` or `bg-gray-950` → `bg-primary`
- `bg-[#111827]` or `bg-gray-900` → `bg-surface`
- `border-[#1f2937]` or `border-gray-800` → `border-surface`
- `text-[#f9fafb]` or `text-white` → `text-ink` (NEVER `text-primary` — that's a bg color)
- `text-[#9ca3af]` or `text-gray-400` → `text-muted`
- `text-[#16a34a]` or `text-green-500` → `text-accent`
- `bg-[#16a34a]` or `bg-green-600` → `bg-accent` (non-CTA) or `bg-cta` (CTA buttons)
- `hover:bg-[#15803d]` or `hover:bg-green-700` → `hover:bg-accent-hover` or `hover:bg-cta-hover`
- `focus:border-[#16a34a]` or `focus:ring-[#16a34a]` → `focus:border-accent focus:ring-accent`
- `text-[#d97706]` or `text-yellow-400` → `text-secondary`
- `text-[#6b7280]` or `text-gray-500` → `text-muted` (unify to one muted token)
- `placeholder-[#6b7280]` or `placeholder-gray-500` → `placeholder-muted`

**CTA button identification** (these use `bg-cta` / `hover:bg-cta-hover`):
- WhatsAppButton.tsx (floating chat button)
- Header.tsx "Contact Us" button (both desktop and mobile)
- TripCard.tsx "View Details" button
- DetailSidebar.tsx "Enquire Now" button
- Any primary CTA button on contact page, home page hero, etc.
- All other green buttons (badges, category tags, icon highlights) use `bg-accent` not `bg-cta`

### Step 7 — Admin Exclusion ✅ Complete (handled in Step 3 — `loader` forces `DEFAULT_THEME` for any `/admin/*` URL)

**No changes to:**
- `app/routes/admin.tsx`
- `app/routes/admin.*.tsx` (all 14+ admin route files)
- `app/components/admin-form-editors.tsx`
- `app/components/ImageInput.tsx`

Admin layout gets `<html data-theme="midnight-summit">` enforced by its own layout wrapper or by ThemeProvider defaulting to Midnight Summit when no cookie matches admin routes.

### Step 8 — Per-Theme Gradient Verification ✅ Complete — User confirmed all 4 themes render correctly. Glacier Blue `from #0284c7 → to #d97706` gradient is acceptable as-is, no muddy transition.

`.text-gradient` gets per-theme custom stops:

| Theme | `from-` | `to-` |
|-------|---------|-------|
| Midnight Summit | `#16a34a` | `#d97706` |
| Golden Hour | `#c2410c` | `#f59e0b` |
| Glacier Blue | `#0284c7` | `#d97706` |
| Pine Shadow | `#22c55e` | `#f59e0b` |

**Visual check priority:** Glacier Blue's blue→amber gradient. If it looks muddy, adjust Glacier Blue's `to-` to a lighter amber like `#fbbf24` or a warm white. Do NOT change the other themes unless they also look off.

### Step 9 — Verification ✅ Complete — `npx tsc --noEmit` and `npm run build` both pass after Step 6.

```bash
npm run typecheck
npm run build
```

Manual visual checks:
- Home page, trip listing, trip detail, blog, gallery, contact, FAQ, about, login — each with all 4 themes
- CTA/WhatsApp buttons stay green across all themes
- Amber/gold rating token remains distinct in Glacier Blue
- Mobile theme switcher works in mobile nav
- Desktop theme switcher works in top bar
- Theme persists across page reload (cookie)
- No flash of wrong theme on page load (SSR)
- Admin panel completely unchanged

---

## Scope Boundary

| In scope | Out of scope |
|----------|-------------|
| 29 public files refactor | Admin CMS theming |
| CSS variable architecture | Layout/structure changes |
| Theme switcher UI | New route creation |
| Cookie persistence | Business logic changes |
| Per-theme gradient stops | Prisma/backend changes |
| TypeScript type-check pass | Package.json dependency adds |

---

## File Change Summary

| Action | Path |
|--------|------|
| **Edit** | `app/app.css` |
| **Create** | `app/lib/theme.tsx` |
| **Edit** | `app/root.tsx` |
| **Create** | `app/components/ThemeSwitcher.tsx` |
| **Edit** | `app/components/Header.tsx` |
| **Edit** | `app/components/Accordion.tsx` |
| **Edit** | `app/components/Breadcrumb.tsx` |
| **Edit** | `app/components/DetailSidebar.tsx` |
| **Edit** | `app/components/DestinationCard.tsx` |
| **Edit** | `app/components/Footer.tsx` |
| **Edit** | `app/components/HeroSection.tsx` |
| **Edit** | `app/components/Lightbox.tsx` |
| **Edit** | `app/components/SectionTitle.tsx` |
| **Edit** | `app/components/StatsBar.tsx` |
| **Edit** | `app/components/TripCard.tsx` |
| **Edit** | `app/components/WhatsAppButton.tsx` |
| **Edit** | `app/routes/_index.tsx` |
| **Edit** | `app/routes/about.tsx` |
| **Edit** | `app/routes/blog._index.tsx` |
| **Edit** | `app/routes/blog.$slug.tsx` |
| **Edit** | `app/routes/contact.tsx` |
| **Edit** | `app/routes/expeditions._index.tsx` |
| **Edit** | `app/routes/expeditions.$slug.tsx` |
| **Edit** | `app/routes/faq.tsx` |
| **Edit** | `app/routes/gallery.tsx` |
| **Edit** | `app/routes/login.tsx` |
| **Edit** | `app/routes/tours._index.tsx` |
| **Edit** | `app/routes/tours.$slug.tsx` |
| **Edit** | `app/routes/trips._index.tsx` |
| **Edit** | `app/routes/trips.$slug.tsx` |
| **Edit** | `IMPLEMENTATION_PLAN.md` (update PHASE 6/7 status after completion) |
