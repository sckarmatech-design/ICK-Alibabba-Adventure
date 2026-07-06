# Implementation Plan — Akhtar Abbasi Hiking (Full-Stack Conversion)

**Project:** Convert static React Router v7 frontend to database-backed full-stack app
**Date:** 2026-07-04
**Total Phases:** 7

---

## How to use this document

Each phase is completely self-contained. An AI agent can start from any phase without needing prior conversation history. The agent should:
1. Read the full phase text below
2. Check the "Entry checkpoint" section to verify the phase prerequisites are met
3. Execute all tasks in order
4. Verify with the "Verification" steps
5. Mark the phase complete in this file (update the status line)

---

## PHASE 1 — Prisma Schema + Supabase Setup + Seed Data

**Status:** ✅ Complete
**Dependencies:** None (project already exists with React Router v7)

### Entry checkpoint

- [x] `app/data/trips.ts` exists with Trip[] export
- [x] `app/data/expeditions.ts` exists with Expedition[] export
- [x] `app/data/tours.ts` exists with Tour[] export
- [x] `app/data/faqs.ts` exists with FAQItem[] export
- [x] `app/data/testimonials.ts` exists with Testimonial[] export
- [x] `app/data/blog-posts.ts` exists with BlogPost[] export
- [x] `app/data/destinations.ts` exists with Destination[] export
- [x] `app/data/gallery.ts` exists with GalleryItem[] + VideoItem[] exports
- [x] `app/data/team.ts` exists with TeamMember[] export
- [x] `app/data/nav.ts` exists with mainNav, footerLinks, companyInfo exports
- [x] `package.json` scripts include `build`, `dev`, `typecheck`

### Tasks

#### 1.1 Install dependencies

```bash
npm install prisma @prisma/client
npm install -D tsx
```

#### 1.2 Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma`
- `.env` (overwrite with values below)

#### 1.3 Write `.env`

Replace the `.env` file with:

```env
# Supabase PostgreSQL — POOLED connection (port 6543, pgbouncer/transaction mode)
# Used at runtime by Prisma in loaders/actions
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"

# Supabase PostgreSQL — DIRECT connection (port 5432)
# Used ONLY for `prisma migrate deploy`
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-[REGION].supabase.com:5432/postgres"

# Session / JWT secret for auth (Phase 2)
JWT_SECRET="change-me-to-a-random-64-char-string"
```

**IMPORTANT:** Replace `xxx`, `[PASSWORD]`, `[REGION]` with actual Supabase project credentials.

#### 1.4 Write `prisma/schema.prisma`

Overwrite the auto-generated schema with the following:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ===== ENUMS =====

enum TripCategory {
  SHORT_TREK
  MULTI_DAY_TREK
  DAY_HIKE
}

enum Difficulty {
  EASY
  MODERATE
  CHALLENGING
  EXPERT
}

enum BlogCategory {
  TREKKING
  EXPEDITIONS
  TRAVEL_TIPS
  CULTURE
}

enum FAQCategory {
  GENERAL
  PREPARATION
  LOGISTICS
  SAFETY
  FINANCE
}

enum GalleryItemCategory {
  TREKS
  EXPEDITIONS
  TOURS
  NATURE
  CULTURE
}

// ===== AUTH (used in Phase 2) =====

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ===== TRIPS =====

model Trip {
  id         String         @id @default(cuid())
  slug       String         @unique
  title      String
  category   TripCategory
  region     String
  duration   String
  difficulty Difficulty
  bestSeason String
  heroImage  String
  overview   String
  groupSize  String?
  startPoint String?
  endPoint   String?
  highlights String[]
  gallery    String[]
  itinerary  Json
  faqs       Json
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt
}

// ===== EXPEDITIONS =====

model Expedition {
  id              String     @id @default(cuid())
  slug            String     @unique
  title           String
  region          String
  duration        String
  altitude        String
  difficulty      Difficulty
  bestSeason      String
  heroImage       String
  overview        String
  technicalRating String
  highlights      String[]
  gallery         String[]
  itinerary       Json
  gear            String[]
  faqs            Json
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

// ===== TOURS =====

model Tour {
  id            String     @id @default(cuid())
  slug          String     @unique
  title         String
  region        String
  duration      String
  difficulty    Difficulty
  bestSeason    String
  heroImage     String
  overview      String
  accommodation String?
  mealPlan      String?
  transport     String?
  highlights    String[]
  gallery       String[]
  itinerary     Json
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

// ===== BLOG =====

model BlogPost {
  id          String       @id @default(cuid())
  slug        String       @unique
  title       String
  author      String
  date        DateTime
  category    BlogCategory
  excerpt     String
  content     String
  image       String
  readingTime Int
  videoUrl    String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

// ===== FAQS (standalone) =====

model FAQ {
  id        String      @id @default(cuid())
  category  FAQCategory
  question  String
  answer    String
  sortOrder Int         @default(0)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

// ===== TESTIMONIALS =====

model Testimonial {
  id          String   @id @default(cuid())
  name        String
  country     String
  countryCode String
  rating      Int
  review      String
  tripName    String
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ===== DESTINATIONS =====

model Destination {
  id          String   @id @default(cuid())
  name        String
  region      String
  image       String
  tripCount   Int      @default(0)
  description String
  highlights  String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ===== GALLERY =====

model GalleryImage {
  id        String              @id @default(cuid())
  title     String
  image     String
  thumbnail String?
  category  GalleryItemCategory
  alt       String
  featured  Boolean             @default(false)
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt
}

model GalleryVideo {
  id        String   @id @default(cuid())
  title     String
  videoUrl  String
  thumbnail String?
  alt       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ===== TEAM =====

model TeamMember {
  id             String   @id @default(cuid())
  name           String
  role           String
  bio            String
  image          String?
  specialization String?
  experience     String?
  sortOrder      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// ===== SITE SETTINGS =====

model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique
  value Json
}
```

#### 1.5 Create Prisma singleton

Create `app/lib/prisma.server.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

**Important:** Only import this file in `.server.ts` files or routes (loaders/actions). Never import it in client components (React Router enforces this with `.server` convention, but be disciplined).

#### 1.6 Run migration

```bash
npx prisma migrate dev --name init
```

This creates all tables in your Supabase PostgreSQL database.

#### 1.7 Create seed script

Create `prisma/seed.ts` that:
- Imports PrismaClient directly
- Reads all data from `app/data/*.ts` files and inserts into corresponding tables
- Maps enum strings to Prisma enums (e.g. `"Short Trek"` → `TripCategory.SHORT_TREK`)
- Converts date strings to `Date` objects

**Enum mapping reference:**

| Data file string | Prisma enum value |
|---|---|
| `"Short Trek"` | `TripCategory.SHORT_TREK` |
| `"Multi-Day Trek"` | `TripCategory.MULTI_DAY_TREK` |
| `"Day Hike"` | `TripCategory.DAY_HIKE` |
| `"Easy"` | `Difficulty.EASY` |
| `"Moderate"` | `Difficulty.MODERATE` |
| `"Challenging"` | `Difficulty.CHALLENGING` |
| `"Expert"` | `Difficulty.EXPERT` |
| `"Trekking"` | `BlogCategory.TREKKING` |
| `"Expeditions"` | `BlogCategory.EXPEDITIONS` |
| `"Travel Tips"` | `BlogCategory.TRAVEL_TIPS` |
| `"Culture"` | `BlogCategory.CULTURE` |
| `"General"` | `FAQCategory.GENERAL` |
| `"Preparation"` | `FAQCategory.PREPARATION` |
| `"Logistics"` | `FAQCategory.LOGISTICS` |
| `"Safety"` | `FAQCategory.SAFETY` |
| `"Finance"` | `FAQCategory.FINANCE` |

**Seed file structure:**

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear all existing data (optional, useful for re-seeding)
  await prisma.$transaction([
    prisma.trip.deleteMany(),
    prisma.expedition.deleteMany(),
    prisma.tour.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.fAQ.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.destination.deleteMany(),
    prisma.galleryImage.deleteMany(),
    prisma.galleryVideo.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.siteSetting.deleteMany(),
  ]);

  // --- TRIPS ---
  // Map each item from app/data/trips.ts and create via prisma.trip.create()
  // Slug must match existing URL slugs (k2-base-camp-trek, fairy-meadows-trek, etc.)

  // --- EXPEDITIONS ---
  // Map from app/data/expeditions.ts

  // --- TOURS ---
  // Map from app/data/tours.ts

  // --- BLOG POSTS ---
  // Map from app/data/blog-posts.ts
  // Convert date string "2026-06-15" → new Date("2026-06-15")

  // --- FAQS ---
  // Map from app/data/faqs.ts
  // Set sortOrder sequentially (0, 1, 2, ...)

  // --- TESTIMONIALS ---
  // Map from app/data/testimonials.ts
  // rating is already 1-5

  // --- DESTINATIONS ---
  // Map from app/data/destinations.ts

  // --- GALLERY IMAGES ---
  // Map from app/data/gallery.ts → galleryImages array
  // Note: image field uses the full Unsplash URL

  // --- GALLERY VIDEOS ---
  // Map from app/data/gallery.ts → videos array
  // videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`

  // --- TEAM MEMBERS ---
  // Map from app/data/team.ts
  // Set sortOrder sequentially

  // --- SITE SETTINGS ---
  // Create three entries:
  await prisma.siteSetting.create({
    data: {
      key: "mainNav",
      value: /* JSON from app/data/nav.ts → mainNav */,
    },
  });
  await prisma.siteSetting.create({
    data: {
      key: "footerLinks",
      value: /* JSON from app/data/nav.ts → footerLinks */,
    },
  });
  await prisma.siteSetting.create({
    data: {
      key: "companyInfo",
      value: /* JSON from app/data/nav.ts → companyInfo */,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Important:** The seed file must be runnable with `tsx`. Since the data files use `~` path aliases, do NOT try to import from them directly. Instead, copy-paste the data arrays into the seed file (it is a one-time script).

#### 1.8 Configure seed in package.json

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

#### 1.9 Run seed

```bash
npx prisma db seed
```

#### 1.10 Generate Prisma client

```bash
npx prisma generate
```

### Verification

- [x] `prisma/schema.prisma` has all 14 models + all enums
- [x] `app/lib/prisma.server.ts` exports a singleton PrismaClient
- [x] `.env` has `DATABASE_URL` (port 6543) and `DIRECT_URL` (port 5432)
- [x] Tables exist in Supabase (verified via `npx prisma migrate dev` and seed query)
- [x] Seed ran without errors: all 10 content types have data
- [x] `npx prisma studio` shows populated tables (verified via count query)
- [x] `npm run typecheck` passes (may need to ignore `prisma/` directory if it causes issues)

### Implementation notes

- The `prisma/seed.ts` file should be standalone with hardcoded data arrays, not imports from `app/data/`
- All JSON fields (itinerary, faqs) should use the exact same structure as the current TypeScript types
- For gallery videos: convert `youtubeId` field to a full URL: `https://www.youtube.com/watch?v=${youtubeId}`
- For blog post `date`: convert string to `new Date(string)`
- The `image` field on TeamMember currently uses local paths like `/images/team/akhtar-abbasi.webp` — store as-is (these are public assets)

---

## PHASE 2 — Authentication (Login, JWT Cookie, Admin Middleware)

**Status:** ✅ Complete
**Dependencies:** Phase 1 complete (AdminUser model exists, prisma client works)

### Entry checkpoint

- [ ] Phase 1 is fully complete and verified
- [ ] `app/lib/prisma.server.ts` exists and imports correctly
- [ ] `AdminUser` model exists in the database

### Tasks

#### 2.1 Install dependencies

```bash
npm install jose bcryptjs
```

#### 2.2 Create auth utilities

Create `app/lib/auth.server.ts`:

```typescript
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "react-router";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ sub: string; role: string }> {
  const { payload } = await jwtVerify(token, SECRET);
  return { sub: payload.sub as string, role: payload.role as string };
}

export async function getSessionUser(
  request: Request
): Promise<{ sub: string; role: string } | null> {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    })
  );
  const token = cookies["session"];
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(request: Request): Promise<string> {
  const user = await getSessionUser(request);
  if (!user || user.role !== "admin") {
    throw redirect("/login");
  }
  return user.sub;
}

export function createSessionCookie(token: string): string {
  const maxAge = 8 * 60 * 60; // 8 hours
  return `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
```

#### 2.3 Create admin seed script

Create `prisma/seed-admin.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@akhtarabbasi.com";
  const password = "admin123"; // CHANGE after first login
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      name: "Admin",
    },
  });

  console.log(`Admin user created: ${email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:
```bash
npx tsx prisma/seed-admin.ts
```

**Delete this file after use** (or at least change the password).

#### 2.4 Create login page

Create `app/routes/login.tsx`:

The login page should have:
- A public route (no auth gate)
- A form with email + password fields
- An `action` function that:
  1. Parses FormData (email, password)
  2. Looks up `AdminUser` via Prisma by email
  3. Compares password with `bcrypt.compare`
  4. If match: creates JWT via `createToken`, returns redirect with `Set-Cookie` header using `createSessionCookie`
  5. If no match: returns form with error message
- A `loader` function that redirects to `/admin` if already logged in
- A simple, clean form UI (can use Tailwind, match the site's dark theme)

**Route file naming:** `app/routes/login.tsx`

**Important implementation details for the action:**

```typescript
// The action must return a redirect with Set-Cookie header
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email or password" };
  }

  const token = await createToken(user.id);
  const cookie = createSessionCookie(token);

  return redirect("/admin", {
    headers: { "Set-Cookie": cookie },
  });
}
```

#### 2.5 Create admin layout with auth gate

Create `app/routes/admin.tsx` — this is the layout file for all `/admin/*` routes:

```typescript
import { Outlet, useLoaderData, Link, Form } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAdmin(request);
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  return { user };
}

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
        <div className="text-xl font-bold mb-8">
          <span className="text-green-500">Akhtar</span> CMS
        </div>
        <nav className="space-y-2">
          <Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-800">
            Dashboard
          </Link>
          <Link to="/admin/trips" className="block px-3 py-2 rounded hover:bg-gray-800">
            Trips
          </Link>
          <Link to="/admin/expeditions" className="block px-3 py-2 rounded hover:bg-gray-800">
            Expeditions
          </Link>
          <Link to="/admin/tours" className="block px-3 py-2 rounded hover:bg-gray-800">
            Tours
          </Link>
          <Link to="/admin/blog" className="block px-3 py-2 rounded hover:bg-gray-800">
            Blog
          </Link>
          <Link to="/admin/gallery" className="block px-3 py-2 rounded hover:bg-gray-800">
            Gallery
          </Link>
          <Link to="/admin/testimonials" className="block px-3 py-2 rounded hover:bg-gray-800">
            Testimonials
          </Link>
          <Link to="/admin/team" className="block px-3 py-2 rounded hover:bg-gray-800">
            Team
          </Link>
          <Link to="/admin/faqs" className="block px-3 py-2 rounded hover:bg-gray-800">
            FAQs
          </Link>
          <Link to="/admin/destinations" className="block px-3 py-2 rounded hover:bg-gray-800">
            Destinations
          </Link>
          <Link to="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-800">
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">{user?.name}</p>
          <Form method="post" action="/admin/logout">
            <button type="submit" className="text-sm text-red-400 hover:text-red-300 mt-1">
              Logout
            </button>
          </Form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

**Note:** The sidebar links won't work yet (routes don't exist) — they will in Phase 4.

#### 2.6 Create admin dashboard

Create `app/routes/admin._index.tsx`:

A simple dashboard showing summary counts from each content type. Loader calls prisma to get counts:

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAdmin(request);
  const [trips, expeditions, tours, blogPosts, testimonials, teamMembers, faqs, destinations, galleryImages, galleryVideos] =
    await Promise.all([
      prisma.trip.count(),
      prisma.expedition.count(),
      prisma.tour.count(),
      prisma.blogPost.count(),
      prisma.testimonial.count(),
      prisma.teamMember.count(),
      prisma.fAQ.count(),
      prisma.destination.count(),
      prisma.galleryImage.count(),
      prisma.galleryVideo.count(),
    ]);
  return { trips, expeditions, tours, blogPosts, testimonials, teamMembers, faqs, destinations, galleryImages, galleryVideos };
}
```

Render a grid of stat cards.

#### 2.7 Create logout action

Create `app/routes/admin.logout.tsx`:

```typescript
import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { clearSessionCookie } from "~/lib/auth.server";

export async function action(_request: ActionFunctionArgs) {
  return redirect("/login", {
    headers: { "Set-Cookie": clearSessionCookie() },
  });
}

export async function loader() {
  return redirect("/login");
}
```

#### 2.8 Register admin routes in `app/routes.ts`

Add to the existing route config:

```typescript
// Auth
route("login", "routes/login.tsx"),

// Admin layout + routes
layout("routes/admin.tsx", [
  route("admin", "routes/admin._index.tsx"),
  route("admin/logout", "routes/admin.logout.tsx"),
  // Phase 4 will add more routes here
]),
```

**Important:** The admin layout must wrap all `/admin/*` routes so the auth check runs once.

### Verification

- [x] `GET /login` renders login form
- [x] `POST /login` with valid credentials sets cookie and redirects to `/admin`
- [x] `POST /login` with invalid credentials returns error without redirect
- [x] `GET /admin` without cookie redirects to `/login`
- [x] `GET /admin` with valid cookie renders dashboard with correct counts
- [x] Logout clears cookie and redirects to `/login`
- [x] `npm run typecheck` passes

---

## PHASE 3 — Public Routes (Convert Static Data → Prisma Loaders)

**Status:** ✅ Complete
**Dependencies:** Phase 1 complete (all tables have data), Phase 2 complete (but not strictly needed — auth is admin-only)

### Entry checkpoint

- [x] Phase 1 verified — database has all seed data
- [x] `app/lib/prisma.server.ts` works
- [x] All public routes currently import from `app/data/*.ts`

### Strategy

For each public route, the pattern is:

1. **Remove** the `import { data } from "~/data/file"` line
2. **Add** `import prisma from "~/lib/prisma.server"` to the loader
3. **Rewrite the loader** to call the corresponding Prisma `findMany` or `findUnique`
4. **Keep the component unchanged** — `useLoaderData` types must match
5. For detail pages, query by `slug` (not `id`)

### Route conversion order (do in sequence):

#### 3.1 Trips listing — `app/routes/trips._index.tsx`

```typescript
// Old:
// import { trips } from "~/data/trips";

// New loader:
export async function loader() {
  const trips = await prisma.trip.findMany({
    orderBy: { title: "asc" },
  });
  return trips;
}
```

#### 3.2 Trip detail — `app/routes/trips.$slug.tsx`

```typescript
// Old:
// import { trips } from "~/data/trips";
// const trip = trips.find((t) => t.slug === params.slug);

// New loader:
export async function loader({ params }: LoaderFunctionArgs) {
  const trip = await prisma.trip.findUnique({
    where: { slug: params.slug },
  });
  if (!trip) throw new Response("Not Found", { status: 404 });
  return trip;
}
```

#### 3.3 Expeditions listing — `app/routes/expeditions._index.tsx`

Same pattern as trips listing, using `prisma.expedition.findMany()`.

#### 3.4 Expedition detail — `app/routes/expeditions.$slug.tsx`

Same pattern as trip detail, using `prisma.expedition.findUnique({ where: { slug } })`.

#### 3.5 Tours listing — `app/routes/tours._index.tsx`

Using `prisma.tour.findMany()`.

#### 3.6 Tour detail — `app/routes/tours.$slug.tsx`

Using `prisma.tour.findUnique({ where: { slug } })`.

#### 3.7 Blog listing — `app/routes/blog._index.tsx`

Using `prisma.blogPost.findMany({ orderBy: { date: "desc" } })`.

#### 3.8 Blog detail — `app/routes/blog.$slug.tsx`

Using `prisma.blogPost.findUnique({ where: { slug } })`.

#### 3.9 Gallery — `app/routes/gallery.tsx`

Load both images and videos:

```typescript
export async function loader() {
  const [images, videos] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryVideo.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return { images, videos };
}
```

The component currently imports `galleryImages` and `videos` directly. Update to use `useLoaderData`.

#### 3.10 About — `app/routes/about.tsx`

Load team members:

```typescript
export async function loader() {
  const team = await prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return team;
}
```

#### 3.11 FAQ — `app/routes/faq.tsx`

```typescript
export async function loader() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return faqs;
}
```

#### 3.12 Home page — `app/routes/_index.tsx`

This loads multiple data sources. Convert to:

```typescript
export async function loader() {
  const [trips, testimonials, blogPosts, destinations] = await Promise.all([
    prisma.trip.findMany({ orderBy: { title: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({ orderBy: { date: "desc" }, take: 3 }),
    prisma.destination.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { trips, testimonials, blogPosts, destinations };
}
```

Update the component to use `useLoaderData` instead of direct imports.

#### 3.13 Contact — `app/routes/contact.tsx`

Load site settings for company info:

```typescript
export async function loader() {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return map as { companyInfo: Record<string, unknown> };
}
```

### 3.14 Root layout — `app/root.tsx`

The root layout provides Header and Footer which currently import from `~/data/nav`. To avoid every page needing its own loader for nav data, add a root-level loader:

```typescript
export async function loader() {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return map as {
    mainNav: Array<{ label: string; href?: string; submenu?: Array<{ label: string; href: string }> }>;
    footerLinks: Array<{ category: string; links: Array<{ label: string; href: string }> }>;
    companyInfo: {
      name: string; email: string; phone: string; location: string;
      description: string; whatsapp: string;
      socialMedia: { facebook: string; instagram: string; youtube: string };
    };
  };
}
```

Then pass these as props to Header, Footer, and WhatsAppButton instead of having those components import from `~/data/nav`.

**Refactor Header.tsx:**
- Accept `mainNav` and `companyInfo` as props
- Remove `import { companyInfo, mainNav } from "~/data/nav"`

**Refactor Footer.tsx:**
- Accept `footerLinks` and `companyInfo` as props
- Remove `import { companyInfo, footerLinks } from "~/data/nav"`

**Refactor WhatsAppButton.tsx:**
- Accept `companyInfo` as prop
- Remove `import { companyInfo } from "~/data/nav"`

### Verification

- [x] Every public page renders correctly with data from database
- [x] No remaining `import { ... } from "~/data/"` in any route file (data files stay — they serve as the seed source)
- [x] Detail pages work with correct slugs
- [x] 404s work for missing slugs
- [x] Gallery shows both images and videos
- [x] Home page shows all sections (trips, testimonials, blog, destinations)
- [x] Header and Footer show correct nav/company info from SiteSettings
- [x] `npm run typecheck` passes
- [x] `npm run dev` works without errors

---

## PHASE 4 — Admin CRUD Routes

**Status:** ✅ Complete
**Dependencies:** Phase 2 (auth middleware), Phase 3 (prisma patterns established)

### Entry checkpoint

- [x] Auth middleware (`requireAdmin`) works in admin layout
- [x] Public routes all use Prisma successfully
- [x] Route patterns established

### Strategy

For each content type, create 3 admin routes:
1. **List** (`_index.tsx`) — table with edit/delete buttons
2. **New** (`new.tsx`) — form, action creates record
3. **Edit** (`$id.edit.tsx`) — pre-filled form, action updates record

**Generic patterns (apply to every content type):**

**List page pattern:**
```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const items = await prisma.contentType.findMany({ orderBy: { createdAt: "desc" } });
  return items;
}
// Renders a table with columns and edit/delete actions
```

**New form pattern:**
```typescript
export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  // Parse all fields
  await prisma.contentType.create({ data: { ... } });
  return redirect("/admin/content-type");
}
// Renders a form matching the content type fields
```

**Edit form pattern:**
```typescript
export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const item = await prisma.contentType.findUnique({ where: { id: params.id } });
  if (!item) throw new Response("Not Found", { status: 404 });
  return item;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  await prisma.contentType.update({ where: { id: params.id }, data: { ... } });
  return redirect("/admin/content-type");
}
// Renders same form as new, pre-filled with loader data
```

**Delete action:** Add a delete handler (either via a dedicated action or a form button with `_action` discriminator):
```typescript
if (formData.get("_action") === "delete") {
  await prisma.contentType.delete({ where: { id: params.id } });
  return redirect("/admin/content-type");
}
```

### Content types to implement

Create CRUD for these (in this order):

| # | Content Type | List Route | New Route | Edit Route |
|---|---|---|---|---|
| 1 | Trips | `admin.trips._index.tsx` | `admin.trips.new.tsx` | `admin.trips.$id.edit.tsx` |
| 2 | Expeditions | `admin.expeditions._index.tsx` | `admin.expeditions.new.tsx` | `admin.expeditions.$id.edit.tsx` |
| 3 | Tours | `admin.tours._index.tsx` | `admin.tours.new.tsx` | `admin.tours.$id.edit.tsx` |
| 4 | Blog | `admin.blog._index.tsx` | `admin.blog.new.tsx` | `admin.blog.$id.edit.tsx` |
| 5 | Gallery Images | `admin.gallery._index.tsx` | `admin.gallery.images.new.tsx` | `admin.gallery.$id.edit.tsx` |
| 6 | Gallery Videos | (same list page) | `admin.gallery.videos.new.tsx` | (same edit page) |
| 7 | Testimonials | `admin.testimonials._index.tsx` | `admin.testimonials.new.tsx` | `admin.testimonials.$id.edit.tsx` |
| 8 | Team | `admin.team._index.tsx` | `admin.team.new.tsx` | `admin.team.$id.edit.tsx` |
| 9 | FAQs | `admin.faqs._index.tsx` | `admin.faqs.new.tsx` | `admin.faqs.$id.edit.tsx` |
| 10 | Destinations | `admin.destinations._index.tsx` | `admin.destinations.new.tsx` | `admin.destinations.$id.edit.tsx` |
| 11 | Settings | N/A | N/A | `admin.settings.tsx` |

### Special handling

**Settings form** (`admin.settings.tsx`):
- Single form with 3 sections (mainNav, footerLinks, companyInfo)
- Loader fetches all 3 SiteSetting records
- Action updates them
- Each section has a JSON textarea or structured form fields

**Gallery list** (`admin.gallery._index.tsx`):
- Shows both images (with thumbnail) and videos
- Has "Add Image" and "Add Video" buttons
- Each row has edit/delete

**JSON fields** (itinerary, faqs, highlights, gear, gallery on Trip/Expedition/Tour):
- In the form, use a textarea that accepts JSON
- In the action, parse with `JSON.parse()` and validate
- Pre-fill the textarea in edit mode with `JSON.stringify(data, null, 2)`

**Slug generation:**
- When creating a new Trip/Expedition/Tour/BlogPost, auto-generate slug from title:
  ```typescript
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  ```

### Route registration

Add all admin routes to `app/routes.ts` inside the admin layout:

```typescript
layout("routes/admin.tsx", [
  route("admin", "routes/admin._index.tsx"),
  route("admin/logout", "routes/admin.logout.tsx"),

  // Trips
  route("admin/trips", "routes/admin.trips._index.tsx"),
  route("admin/trips/new", "routes/admin.trips.new.tsx"),
  route("admin/trips/:id/edit", "routes/admin.trips.$id.edit.tsx"),

  // Expeditions
  route("admin/expeditions", "routes/admin.expeditions._index.tsx"),
  route("admin/expeditions/new", "routes/admin.expeditions.new.tsx"),
  route("admin/expeditions/:id/edit", "routes/admin.expeditions.$id.edit.tsx"),

  // Tours
  route("admin/tours", "routes/admin.tours._index.tsx"),
  route("admin/tours/new", "routes/admin.tours.new.tsx"),
  route("admin/tours/:id/edit", "routes/admin.tours.$id.edit.tsx"),

  // Blog
  route("admin/blog", "routes/admin.blog._index.tsx"),
  route("admin/blog/new", "routes/admin.blog.new.tsx"),
  route("admin/blog/:id/edit", "routes/admin.blog.$id.edit.tsx"),

  // Gallery
  route("admin/gallery", "routes/admin.gallery._index.tsx"),
  route("admin/gallery/images/new", "routes/admin.gallery.images.new.tsx"),
  route("admin/gallery/videos/new", "routes/admin.gallery.videos.new.tsx"),
  route("admin/gallery/:id/edit", "routes/admin.gallery.$id.edit.tsx"),

  // Testimonials
  route("admin/testimonials", "routes/admin.testimonials._index.tsx"),
  route("admin/testimonials/new", "routes/admin.testimonials.new.tsx"),
  route("admin/testimonials/:id/edit", "routes/admin.testimonials.$id.edit.tsx"),

  // Team
  route("admin/team", "routes/admin.team._index.tsx"),
  route("admin/team/new", "routes/admin.team.new.tsx"),
  route("admin/team/:id/edit", "routes/admin.team.$id.edit.tsx"),

  // FAQs
  route("admin/faqs", "routes/admin.faqs._index.tsx"),
  route("admin/faqs/new", "routes/admin.faqs.new.tsx"),
  route("admin/faqs/:id/edit", "routes/admin.faqs.$id.edit.tsx"),

  // Destinations
  route("admin/destinations", "routes/admin.destinations._index.tsx"),
  route("admin/destinations/new", "routes/admin.destinations.new.tsx"),
  route("admin/destinations/:id/edit", "routes/admin.destinations.$id.edit.tsx"),

  // Settings
  route("admin/settings", "routes/admin.settings.tsx"),
]),
```

### Verification

- [ ] Every content type has working list/new/edit/delete
- [ ] Creating a new record inserts into DB and redirects to list
- [ ] Editing pre-fills form with existing data
- [ ] Deleting removes record and redirects
- [ ] Invalid form data returns errors (not crashes)
- [ ] Unauthenticated requests redirect to `/login`
- [ ] Blog post date picker works
- [ ] JSON fields (itinerary, etc.) save and load correctly
- [x] Settings page saves nav/footer/company changes
- [x] `npm run typecheck` passes

---

## PHASE 5 — Image Upload to Supabase Storage

**Status:** ✅ Complete
**Dependencies:** Phase 4 (admin gallery routes exist)

> Verified — bucket created, live upload tested successfully on 2026-07-05.

### Entry checkpoint

- [x] Phase 4 gallery admin routes exist
- [x] `.env` has `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- [x] Supabase project created with `images` bucket (set to public)

### Tasks

#### 5.1 Install Supabase client

```bash
npm install @supabase/supabase-js
```

#### 5.2 Create Supabase server client

Create `app/lib/supabase.server.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKET = "images";

export async function uploadImage(
  file: File,
  folder: string = "gallery"
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return publicUrl;
}
```

#### 5.3 Update the gallery image create action

In `app/routes/admin.gallery.images.new.tsx`:

```typescript
import { uploadImage } from "~/lib/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const file = formData.get("image") as File;
  const title = formData.get("title") as string;
  const alt = formData.get("alt") as string;
  const category = formData.get("category") as GalleryItemCategory;

  if (!file || file.size === 0) {
    return { error: "Image file is required" };
  }

  // Upload to Supabase Storage
  const imageUrl = await uploadImage(file, "gallery");

  // Save URL to database
  await prisma.galleryImage.create({
    data: { title, image: imageUrl, alt, category },
  });

  return redirect("/admin/gallery");
}
```

#### 5.4 Update team member form for image upload

In `app/routes/admin.team.new.tsx` and `$id.edit.tsx`:
- The form must use `encType="multipart/form-data"`
- The action uploads the image file to Supabase Storage and stores the returned URL

#### 5.5 Supabase Storage setup

These steps must be done manually in the Supabase dashboard:
1. Create a bucket named `images`
2. Set bucket to **public** (so URLs are accessible without signed tokens)
3. Optionally set up size limits and allowed MIME types in bucket settings

### Verification

- [x] Uploading an image from `/admin/gallery/images/new` creates a file in Supabase Storage
- [x] The public URL is stored in the `GalleryImage.image` field
- [x] The image displays correctly on the public gallery page
- [x] Uploading a team member image works the same way
- [x] `npm run typecheck` passes

---

## PHASE 6 — Video URL Embed

**Status:** 🔄 In progress
**Dependencies:** Phase 3 (gallery and blog public routes work)

> **Architecture decision:** Videos are external links only (YouTube URLs). They are never uploaded to Supabase Storage; only images use Supabase Storage. This applies project-wide and in all future phases.

### Entry checkpoint

- [ ] Gallery page renders images from DB (Phase 3)
- [ ] Blog detail page renders from DB (Phase 3)
- [ ] `GalleryVideo` model has `videoUrl` field

### Tasks

#### 6.1 Create video URL helper

Create `app/lib/video.ts` (not `.server` — used in client components too):

```typescript
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube patterns
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // YouTube Shorts
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // Facebook video patterns
  if (
    url.includes("facebook.com") ||
    url.includes("fb.com") ||
    url.includes("fb.watch")
  ) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
  }

  return null;
}
```

#### 6.2 Update gallery page to render video embeds

In `app/routes/gallery.tsx`, add a video section. The component already imports `videos` from data — now it receives `videos` from `useLoaderData`.

For each video, render:
```tsx
<div key={video.id} className="aspect-video">
  {getVideoEmbedUrl(video.videoUrl) ? (
    <iframe
      src={getVideoEmbedUrl(video.videoUrl)}
      title={video.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full rounded-lg"
      loading="lazy"
    />
  ) : (
    <p className="text-gray-400">Invalid video URL</p>
  )}
</div>
```

#### 6.3 Update blog detail page for video

In `app/routes/blog.$slug.tsx`, if the blog post has a `videoUrl`, render it below the content:

```tsx
{post.videoUrl && getVideoEmbedUrl(post.videoUrl) && (
  <div className="mt-8 aspect-video">
    <iframe
      src={getVideoEmbedUrl(post.videoUrl)}
      title={post.title}
      allowFullScreen
      className="w-full h-full rounded-lg"
    />
  </div>
)}
```

#### 6.4 Verify admin form has video URL field

In `app/routes/admin.gallery.videos.new.tsx`, the form should have:
```tsx
<input type="url" name="videoUrl" placeholder="https://www.youtube.com/watch?v=..." required />
```

In `app/routes/admin.blog.new.tsx` and `$id.edit.tsx`, add an optional video URL field.

### Verification

- [ ] Gallery page shows video embeds for all YouTube URLs
- [ ] Gallery page shows video embeds for Facebook URLs
- [ ] Embed URLs render as responsive iframes
- [ ] Blog detail page shows video if post has `videoUrl`
- [ ] Invalid URLs don't crash the page (show nothing or fallback)
- [ ] `npm run typecheck` passes

---

## PHASE 7 — Deploy to Vercel

**Status:** 🔄 In progress
**Dependencies:** All phases 1-6 complete

### Entry checkpoint

- [ ] All phases 1-6 verified locally
- [ ] Supabase project is active
- [ ] Vercel account is set up and connected to the GitHub repo

### Tasks

#### 7.1 Configure React Router for Vercel

Install the Vercel preset:
```bash
npm install @vercel/react-router
```

Update `react-router.config.ts`:
```typescript
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Vercel preset is auto-detected, no manual config needed
} satisfies Config;
```

Note: `@vercel/react-router` is auto-detected by the build system. You may not need to explicitly configure it.

#### 7.2 Update build command

The project already has `"build": "react-router build"` in package.json.

For Vercel, ensure the build command includes Prisma client generation:
```
prisma generate && react-router build
```

Set this in Vercel project settings → Build & Development Settings → Build Command.

#### 7.3 Configure environment variables in Vercel

Add these in Vercel dashboard → Project Settings → Environment Variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Pooled connection string (port 6543, `?pgbouncer=true&connection_limit=5`) |
| `DIRECT_URL` | Direct connection string (port 5432) |
| `JWT_SECRET` | Random 64-char string |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` (the Supabase project URL, not the Storage/S3 endpoint) |
| `SUPABASE_SECRET_KEY` | Service role / secret key with elevated access for Storage uploads |
| `SUPABASE_SERVICE_ROLE_KEY` | Backward-compatible fallback for `SUPABASE_SECRET_KEY` |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key, if needed by any client-side Supabase usage |

**Environment:** Add to both "Production" and "Preview" (or use "All").

#### 7.4 Run database migration in production

Before or after the first deploy, run migrations manually:

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Pull production env vars
vercel env pull

# Run migration using DIRECT_URL (not pooled)
npx prisma migrate deploy
```

Or use the Vercel dashboard → run a one-off command via Vercel CLI:
```bash
vercel run prisma migrate deploy
```

Alternatively, add a post-deploy script. The cleanest approach is to run `prisma migrate deploy` as a **separate step** (not part of build).

#### 7.5 Verify Prisma client generation in build

The Vercel build log should show:
```
> prisma generate
> Environment variables loaded from .env
> Prisma Client generated
> react-router build
```

If `prisma generate` fails during build, verify that the Prisma CLI is available (it's a devDependency, and Vercel installs devDependencies by default for builds).

#### 7.6 Handle edge case: Prisma in serverless functions

Prisma requires the query engine binary to be bundled. With Vercel and `@prisma/client`, this typically works automatically, but if you encounter issues:

1. Ensure `prisma generate` runs during build
2. If using Prisma v6+, it uses the `library` engine by default (not `binary`), which is smaller and works better with serverless

If you encounter "Cannot find module" errors with the Prisma engine on Vercel, add to `prisma/schema.prisma`:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = []
}
```

#### 7.7 Test in production

After deployment, test every URL:

- [ ] `https://your-domain.vercel.app/` — home page loads
- [ ] `/trips` — trips list loads
- [ ] `/trips/k2-base-camp-trek` — trip detail loads
- [ ] `/expeditions` — expeditions list loads
- [ ] `/expeditions/nanga-parbat-expedition` — expedition detail loads
- [ ] `/tours` — tours list loads
- [ ] `/gallery` — gallery loads with images and videos
- [ ] `/about` — about page loads with team
- [ ] `/faq` — FAQ page loads
- [ ] `/blog` — blog list loads
- [ ] `/blog/preparing-for-k2-base-camp` — blog detail loads
- [ ] `/contact` — contact page loads
- [ ] `/login` — login form loads
- [ ] `/admin` — admin dashboard loads after login
- [ ] `/admin/trips` — admin trips list works
- [ ] `/admin/trips/new` — create trip works
- [ ] Admin logout works

#### 7.8 Verify connection pooling

Check Supabase dashboard → Database → Pooling:
- Active connections should stay low (≤ 3)
- If you see 5+ connections, reduce `connection_limit` in `DATABASE_URL`

#### 7.9 Set up custom domain (optional)

In Vercel dashboard → Domains, add your custom domain (e.g., `akhtarabbasi-hiking.com`).

### Verification

- [ ] `npm run build` completes without errors
- [ ] `prisma generate` runs during build
- [ ] Database migration succeeds in production
- [ ] All public routes work in production
- [ ] All admin routes work in production
- [ ] Image upload works in production
- [ ] Video thumbnails render and click-through navigation works in production
- [ ] Connection pooling keeps connections within Supabase free tier limits
- [ ] No hardcoded secrets or keys in the codebase

---

## Architecture Reference

### File structure after all phases

```
app/
├── lib/
│   ├── prisma.server.ts        # Prisma singleton (Phase 1)
│   ├── auth.server.ts          # JWT create/verify/requireAdmin (Phase 2)
│   ├── supabase.server.ts      # Supabase storage client (Phase 5)
│   └── video.ts               # Video embed URL helper (Phase 6)
├── routes/
│   ├── _index.tsx              # Home (Phase 3)
│   ├── login.tsx               # Login (Phase 2)
│   ├── admin.tsx               # Admin layout with auth gate (Phase 2)
│   ├── admin._index.tsx        # Admin dashboard (Phase 2)
│   ├── admin.logout.tsx        # Logout (Phase 2)
│   ├── admin.trips._index.tsx  # Trip list (Phase 4)
│   ├── admin.trips.new.tsx     # Trip create (Phase 4)
│   ├── admin.trips.$id.edit.tsx # Trip edit (Phase 4)
│   ├── ... (all other admin CRUD routes)
│   ├── trips._index.tsx        # Public trips (Phase 3)
│   ├── trips.$slug.tsx         # Public trip detail (Phase 3)
│   ├── ... (all other public routes)
├── routes.ts                   # Route config (updated each phase)
├── root.tsx                    # Root layout with loader (Phase 3)
├── components/
│   ├── Header.tsx              # Props-driven (Phase 3 refactor)
│   ├── Footer.tsx              # Props-driven (Phase 3 refactor)
│   └── WhatsAppButton.tsx      # Props-driven (Phase 3 refactor)
prisma/
├── schema.prisma               # Full schema (Phase 1)
├── seed.ts                     # Seed script (Phase 1)
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
