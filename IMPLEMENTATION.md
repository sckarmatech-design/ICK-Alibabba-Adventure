## PHASE 8 — Hero Slides Admin Control

**Status:** ✅ Complete
**Dependencies:** Phase 4 (admin CRUD patterns, ImageInput, AdminSaveBar), Phase 3 (home page loader)

### Background

The homepage hero carousel currently uses **3 hardcoded slides** in `app/routes/_index.tsx` (lines 53–75). A partial implementation was attempted: a Prisma migration `20260707103451_add_hero_slides` already exists and creates a `HeroSlide` table in the database, and three admin route files were written (`admin.hero._index.tsx`, `admin.hero.new.tsx`, `admin.hero.$id.edit.tsx`). However, the implementation was left incomplete — the `HeroSlide` model is missing from `schema.prisma`, routes are not registered in `routes.ts`, no sidebar link exists, and the frontend still uses hardcoded data.

**Current hardcoded slide structure (used by the carousel component):**
```
{ image: string, headline: string, subheadline: string, cta: string, href: string }
```

**Database column structure (already migrated):**
```
id, title, subtitle, image, cta, ctaLink, sortOrder, createdAt, updatedAt
```

The mapping between them is: `title`→`headline`, `subtitle`→`subheadline`, `ctaLink`→`href`.

### Entry checkpoint

- [x] Phase 3 complete — home page loader exists at `app/routes/_index.tsx`
- [x] Phase 4 complete — admin CRUD patterns, `ImageInput`, `AdminSaveBar` exist
- [x] Migration `20260707103451_add_hero_slides` exists (table created in DB)
- [x] Admin hero route files exist at `app/routes/admin.hero.*.tsx` (list, new, edit+delete)

### Tasks

#### 8.1 Add `HeroSlide` model to Prisma schema

Add the following model to `prisma/schema.prisma` (after the `SiteSetting` model):

```prisma
// ===== HERO SLIDES (added in Phase 8) =====

model HeroSlide {
  id        String   @id @default(cuid())
  title     String
  subtitle  String
  image     String
  cta       String
  ctaLink   String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

This model matches the existing migration exactly.

#### 8.2 Regenerate Prisma client

```bash
npx prisma generate
```

This will create the `prisma.heroSlide` type used by the existing admin route files.

#### 8.3 Register hero routes in `routes.ts`

Add to `app/routes.ts` inside the admin layout (after the settings route):

```typescript
// Hero
route("admin/hero", "routes/admin.hero._index.tsx"),
route("admin/hero/new", "routes/admin.hero.new.tsx"),
route("admin/hero/:id/edit", "routes/admin.hero.$id.edit.tsx"),
```

#### 8.4 Add "Hero" link to admin sidebar

In `app/routes/admin.tsx`, add a "Hero Slides" link to the sidebar nav (between "Destinations" and "Inquiries", alphabetical order):

```tsx
<Link
  to="/admin/hero"
  className="block px-3 py-2 rounded hover:bg-gray-800"
>
  Hero
</Link>
```

#### 8.5 Convert home page hero carousel to DB-driven

In `app/routes/_index.tsx`:

- **Loader:** Add `prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } })` to the existing `Promise.all` loader. Return the slides mapped to the frontend's expected shape:
  ```typescript
  heroSlides: slides.map(s => ({
    image: s.image,
    headline: s.title,
    subheadline: s.subtitle,
    cta: s.cta,
    href: s.ctaLink,
  }))
  ```
- **Component:** Change `HeroSlider` to receive slides as props (or use `useLoaderData`). Remove the hardcoded `slides` array and the static image imports (`import k2BaseCamp from "..."`, etc.).
- If no slides exist in the DB, render nothing or a placeholder.

#### 8.6 Seed default hero slides

Update `prisma/seed.ts` to create 3 default `HeroSlide` records matching the original hardcoded content:

```typescript
await prisma.heroSlide.createMany({
  data: [
    {
      title: "K2 Base Camp Trek",
      subtitle: "Walk across the legendary Baltoro Glacier",
      image: "/images/hero/k2-base-camp.webp",
      cta: "Explore Trek",
      ctaLink: "/trips/k2-base-camp-trek",
      sortOrder: 0,
    },
    {
      title: "Fairy Meadows Adventure",
      subtitle: "Experience the magic of alpine meadows",
      image: "/images/hero/toomas-tartes-Yizrl9N_eDA-unsplash.jpg",
      cta: "View Expedition",
      ctaLink: "/expeditions",
      sortOrder: 1,
    },
    {
      title: "Hunza Valley Tour",
      subtitle: "Discover the secrets of longevity",
      image: "/images/hero/sebastien-goldberg-BKLHxgbYFDI-unsplash.jpg",
      cta: "Explore Tours",
      ctaLink: "/tours",
      sortOrder: 2,
    },
  ],
});
```

### Verification

- [x] `prisma generate` succeeds and produces `HeroSlide` type
- [x] `GET /admin/hero` lists hero slides with edit/delete actions
- [x] `GET /admin/hero/new` renders the creation form with ImageInput
- [x] `POST /admin/hero/new` creates a slide and redirects
- [x] `GET /admin/hero/:id/edit` pre-fills the form with existing data
- [x] `POST /admin/hero/:id/edit` updates the slide
- [x] Delete action removes the slide and redirects
- [x] Home page hero carousel reads slides from the database (not hardcoded)
- [x] All 3 default slides exist after re-seeding
- [x] "Hero" link appears in the admin sidebar
- [x] `npm run typecheck` passes

---

## PHASE 9 — Public Page Responsiveness

**Status:** ❌ Not started
**Dependencies:** Phase 3 (public routes all work), Phase 8 (hero carousel is DB-driven)

### Background

The public-facing pages have reasonable responsiveness thanks to Tailwind breakpoint classes applied during the initial development. All card grids (trips, destinations, testimonials, blog) already use proper responsive patterns like `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. The footer stacks correctly. The search/filter bar uses `grid-cols-1 md:grid-cols-4`.

**The main gap is the hero carousel** — it was never given mobile-responsive treatment and breaks at smaller viewports. Other components need only minor adjustments.

### Responsiveness audit (at 375px and 768px)

| Component | 375px (mobile) | 768px (tablet) | Issue |
|---|---|---|---|
| **Hero carousel** | ⚠️ Broken | ⚠️ Tight | `h-screen` too tall, `text-5xl` headline too large, `px-8 py-3` CTA too wide, 32px nav arrows oversized |
| **Hero carousel subheadline** | ⚠️ Too large | ✅ Fine | Fixed `text-xl` (20px) on all screens — needs `text-base sm:text-lg md:text-xl` |
| **Header info bar** | ✅ Hidden | ✅ Visible | Uses `hidden md:block` — intentionally hidden on mobile, acceptable |
| **Header CTA button** | ✅ Hidden | ✅ Visible | Uses `hidden sm:inline-block` — replaced in mobile menu, acceptable |
| **Header logo** | ⚠️ Slightly small | ⚠️ Slightly small | Fixed `h-10` on all sizes — could be larger on desktop |
| **Card grids** | ✅ Fine | ✅ Fine | Proper responsive column patterns already applied |
| **Footer** | ✅ Fine | ✅ Fine | Stacks to 1-col on mobile, 4-col on desktop |
| **Nav mobile menu** | ✅ Works | ✅ Works | Hamburger toggle, dropdowns, theme switcher, CTA button |

### Entry checkpoint

- [x] Phase 3 complete — all public routes work
- [x] Phase 8 complete — hero carousel is DB-driven (ready for responsive edits)

### Tasks

#### 9.1 Hero carousel — responsive height

In `app/routes/_index.tsx` — the `HeroSlider` container (currently `h-screen`):

- Change `h-screen` to `min-h-[60vh] md:h-screen` (or `min-h-[50vh] sm:min-h-[70vh] md:h-screen`)
- This prevents the hero from being taller than the viewport on mobile while keeping full-screen on desktop

#### 9.2 Hero carousel — responsive headline text

Change the headline `<h1>` classes from:
```
text-5xl md:text-6xl
```
to:
```
text-3xl sm:text-4xl md:text-5xl lg:text-6xl
```

This gives: 30px on 375px phones, 36px on larger phones, 48px on tablets, 60px on desktop.

#### 9.3 Hero carousel — responsive subheadline

Change the subheadline `<p>` classes from:
```
text-xl
```
to:
```
text-base sm:text-lg md:text-xl
```

This gives: 16px on phones, 18px on larger phones, 20px on desktop.

#### 9.4 Hero carousel — responsive CTA button padding

Change the CTA `<a>` classes from:
```
px-8 py-3
```
to:
```
px-6 sm:px-8 py-2 sm:py-3
```

This reduces button width and height on very small screens.

#### 9.5 Hero carousel — smaller nav arrows on mobile

The `<ChevronLeft>` and `<ChevronRight>` icons use fixed `size={32}`. On mobile, reduce these.

Option 1: Remove `size={32}` and use responsive CSS via a wrapper:
```
className="... p-1 sm:p-2"
```
And set the icon via a responsive container. Since lucide-react `size` prop doesn't support responsive values, either:
- Wrap in a `<div>` with font-size control (icons scale with font-size)
- Or render two icon instances with `className="sm:hidden"` / `className="hidden sm:block"` at different sizes

Simplest approach: use `className="sm:hidden"` for a `size={24}` icon and `className="hidden sm:block"` for `size={32}`.

#### 9.6 Hero carousel — tighter bottom spacing on mobile

The dots container uses `bottom-8`. Change to `bottom-4 md:bottom-8` to move them closer to the bottom on mobile.

The content container uses `p-8 md:p-12`. Change to `p-6 sm:p-8 md:p-12` for tighter inset padding on small screens.

#### 9.7 Header — responsive logo height

In `app/components/Header.tsx`, line 55:
```
className="h-10 w-auto max-w-45 object-contain"
```
Change to:
```
className="h-10 md:h-12 w-auto max-w-48 object-contain"
```

This gives 40px on mobile, 48px on desktop, with a slightly wider max width.

### Verification

- [ ] Home page hero carousel renders correctly at 375px (no overflow, readable text, usable CTA)
- [ ] Home page hero carousel renders correctly at 768px (proportional to viewport)
- [ ] Home page hero carousel renders correctly at 1440px (full-screen, large text)
- [ ] Nav arrows are touch-friendly on mobile (not oversized)
- [ ] Logo renders at 40px height on mobile, 48px on desktop
- [ ] All card grids reflow correctly at all breakpoints (no horizontal scroll)
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes

---

## PHASE 10 — Admin Dashboard Responsiveness

**Status:** ❌ Not started
**Dependencies:** Phase 4 (admin CRUD routes, admin.tsx layout)

### Background

The admin layout (`app/routes/admin.tsx`) has **zero responsive handling**. The sidebar uses a fixed `w-64` (256px) with no breakpoint variants, no mobile hamburger toggle, and no overlay/drawer pattern. On a 375px phone, the sidebar (256px) + the main content padding (`p-8` = 32px each side) leaves roughly 55px of usable content width. The sidebar will either overflow the viewport or squeeze the content to unreadable narrowness.

The forms within admin pages already use `grid-cols-1 md:grid-cols-2` patterns, so they will stack correctly once the layout shell is fixed.

### Responsiveness audit (at 375px and 768px)

| Element | 375px (mobile) | 768px (tablet) | Issue |
|---|---|---|---|
| **Sidebar** | ⚠️ Broken | ⚠️ Broken | Always visible at 256px, dominates viewport |
| **Mobile menu toggle** | ❌ Missing | ❌ Missing | No hamburger button exists |
| **Main content padding** | ⚠️ Too large | ⚠️ Moderate | `p-8` = 32px on all sides — too much on mobile |
| **Form grids** | ✅ Fine | ✅ Fine | Already use `grid-cols-1 md:grid-cols-2` |
| **Top bar (brand + user)** | ❌ Missing | ❌ Missing | No collapsible top bar pattern |

### Entry checkpoint

- [x] Phase 4 complete — admin layout and all CRUD routes exist
- [x] Phase 8 complete — hero sidebar link added (can be included in the responsive sidebar)

### Tasks

#### 10.1 Add responsive sidebar with mobile drawer

Modify `app/routes/admin.tsx`:

**Add state for sidebar open/close:**
```typescript
const [sidebarOpen, setSidebarOpen] = useState(false);
```

**Desktop sidebar (lg: 1024px+):**
- Keep the existing `w-64` sidebar as a permanent column
- Wrap it in `hidden lg:flex` (hidden below lg, flex at lg+)

**Mobile sidebar (below lg):**
- Render as an overlay drawer: absolute/fixed position on the left, full-height, with a semi-transparent backdrop
- Slide in/out using a CSS transition (`translate-x` transform)
- Show/hide based on `sidebarOpen` state
- Clicking the backdrop closes the drawer

**Top bar (visible on all screens, but only has hamburger on mobile):**
- At the top of the main content area, render a flex row with:
  - `lg:hidden` hamburger button (`<Menu size={24} />` / `<X size={24} />`)
  - `lg:hidden` brand text ("Akhtar CMS")
  - User name + logout (visible on desktop, optionally on mobile)

**Sidebar structure for mobile drawer:**
```
<aside className={`
  fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col
  transform transition-transform duration-200 ease-in-out
  lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
`}>
  {/* (same sidebar content as before) */}
</aside>
{/* Backdrop (mobile only) */}
{sidebarOpen && (
  <div
    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}
```

**Note:** The sidebar should remain a flex column on desktop. The `fixed` positioning + `translate-x` animation only applies below `lg:`.

#### 10.2 Responsive main content padding

Change the `<main>` element's classes from:
```
flex-1 p-8 overflow-auto
```
to:
```
flex-1 p-4 md:p-6 lg:p-8 overflow-auto
```

#### 10.3 Verify admin form responsiveness

Check a complex form (e.g., Edit Trip with itinerary, highlights, gallery) at 375px. The form fields should already stack vertically via `grid-cols-1 md:grid-cols-2`. If any field has a fixed width that causes overflow, add `w-full` or `max-w-full` overrides.

#### 10.4 Ensure sidebar scrolls properly on mobile

The admin sidebar contains ~12 nav links plus user info. On a small phone, the sidebar content may exceed the viewport height. Ensure the sidebar has `overflow-y-auto` so all links remain reachable by scrolling.

The existing sidebar already has `flex flex-col` structure but lacks `overflow-y-auto` — add it to the sidebar container.

### Verification

- [ ] At 1440px: sidebar is permanently visible on the left, main content fills the rest (unchanged behavior)
- [ ] At 768px (tablet): sidebar is hidden by default, hamburger button is visible, clicking it slides in the drawer, clicking backdrop closes it
- [ ] At 375px (phone): same behavior as tablet, sidebar content is scrollable if it overflows viewport
- [ ] Main content padding is reasonable at all sizes (not excessive on mobile)
- [ ] All admin forms render correctly in the responsive layout (no horizontal overflow)
- [ ] Logout still works
- [ ] `npm run typecheck` passes

---

## PHASE 11 — Logo Sizing Fix

**Status:** ❌ Not started
**Dependencies:** Phase 9 (Header responsiveness for the logo)

### Background

When a logo image is uploaded via `/admin/settings`, it renders at `h-10` (40px height) in the header. When no logo is set, the text fallback renders at `text-2xl` (24px font, roughly 32–36px total height with line-height). The text fallback appears visually larger and more prominent than a 40px-tall logo image, especially if the logo has a horizontal/wide aspect ratio. Additionally, the `max-w-45` (180px) constraint can clip wider logos.

The `object-contain` class on the `<img>` does preserve aspect ratio correctly — the issue is purely the fixed height being too small to match the visual weight of the text fallback or the nav links next to it.

### Entry checkpoint

- [x] Phase 9 complete — header logo has responsive `h-10 md:h-12` class (or ready to adjust)

### Tasks

#### 11.1 Confirm current logo CSS

The current logo `<img>` in `Header.tsx` uses:
```tsx
className="h-10 w-auto max-w-45 object-contain"
```

If Phase 9 has been applied, this is already:
```tsx
className="h-10 md:h-12 w-auto max-w-48 object-contain"
```

#### 11.2 Fine-tune logo height if needed

If after Phase 9 the logo still appears too small relative to the brand text fallback, increase the base height:

- Change `h-10` to `h-11` (44px base) or `h-12` (48px base)
- Keep `md:h-12` or increase to `md:h-14` (56px) on desktop
- Keep `w-auto` for aspect ratio preservation
- Keep `max-w-48` (192px) or increase to `max-w-56` (224px) if the logo is very wide

**Recommended conservative values:**
```
className="h-10 md:h-12 w-auto max-w-48 object-contain"
```

This provides:
- 40px on mobile (matches nav link height, keeps header compact)
- 48px on desktop (visually balances with the brand text fallback)
- 192px max width (can accommodate most logo aspect ratios)

#### 11.3 Test with an actual uploaded logo

Upload a non-square logo image (e.g., a horizontal banner or a tall icon-style logo) via `/admin/settings` → Company Info → Logo.

- Verify the image renders at the correct height without distortion (`object-contain` handles this)
- Verify the header layout doesn't break (logo doesn't push nav items off-screen)
- Verify on mobile (375px) the logo scales down appropriately
- Verify on desktop (1440px) the logo is prominent but not oversized

### Verification

- [ ] Logo `<img>` renders at a sensible height (40px mobile, 48px desktop)
- [ ] `object-contain` preserves aspect ratio (no stretching)
- [ ] `max-w-48` prevents oversized logos from breaking the header layout
- [ ] Logo appears visually balanced with the brand text fallback (if present) and nav links
- [ ] Text fallback (no logo uploaded) still looks correct — no regressions
- [ ] Header layout is not broken at any breakpoint
- [ ] `npm run typecheck` passes

---

### File structure after all phases

```
app/
├── lib/
│   ├── prisma.server.ts        # Prisma singleton (Phase 1)
│   ├── auth.server.ts          # JWT create/verify/requireAdmin (Phase 2)
│   ├── supabase.server.ts      # Supabase storage client (Phase 5)
│   └── video.ts               # Video embed URL helper (Phase 6)
├── routes/
│   ├── _index.tsx              # Home — hero carousel now DB-driven (Phase 3 → Phase 8)
│   ├── login.tsx               # Login (Phase 2)
│   ├── admin.tsx               # Admin layout + responsive sidebar (Phase 2 → Phase 10)
│   ├── admin._index.tsx        # Admin dashboard (Phase 2)
│   ├── admin.logout.tsx        # Logout (Phase 2)
│   ├── admin.trips._index.tsx  # Trip list (Phase 4)
│   ├── admin.trips.new.tsx     # Trip create (Phase 4)
│   ├── admin.trips.$id.edit.tsx # Trip edit (Phase 4)
│   ├── admin.hero._index.tsx   # Hero slide list (Phase 8)
│   ├── admin.hero.new.tsx      # Hero slide create (Phase 8)
│   ├── admin.hero.$id.edit.tsx # Hero slide edit/delete (Phase 8)
│   ├── ... (all other admin CRUD routes)
│   ├── trips._index.tsx        # Public trips (Phase 3)
│   ├── trips.$slug.tsx         # Public trip detail (Phase 3)
│   ├── ... (all other public routes)
├── routes.ts                   # Route config (updated each phase)
├── root.tsx                    # Root layout with loader (Phase 3)
├── components/
│   ├── Header.tsx              # Props-driven + responsive logo (Phase 3 → Phase 9/11)
│   ├── Footer.tsx              # Props-driven (Phase 3 refactor)
│   └── WhatsAppButton.tsx      # Props-driven (Phase 3 refactor)
prisma/
├── schema.prisma               # Full schema + HeroSlide model (Phase 1 → Phase 8)
├── seed.ts                     # Seed script incl. HeroSlides (Phase 1 → Phase 8)
└── migrations/                 # Auto-generated by Prisma
```

### Key env vars reference

| Variable | Where used | Required for |
|---|---|---|
| `DATABASE_URL` (pooled) | `schema.prisma`, runtime | All app queries in loaders/actions |
| `DIRECT_URL` (direct) | `schema.prisma` only | `prisma migrate deploy` |
| `JWT_SECRET` | `auth.server.ts` | Creating/verifying session tokens |
| `SUPABASE_URL` | `supabase.server.ts` | Supabase Storage client |
| `SUPABASE_SERVICE_ROLE_KEY` | `supabase.server.ts` | Server-side uploads to Storage |

### How to update this plan

When a phase is completed, update its status line at the top of the phase section from `❌ Not started` to `✅ Complete`.

When encountering blockers, add a `### Blockers` subsection at the bottom of the affected phase and describe the issue.

---

*End of Implementation Plan*
