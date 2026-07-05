# Software Requirements Specification (SRS)
## Akhtar Abbasi Hiking — Frontend Website
**Version:** 2.0  
**Date:** 2026-06-24  
**Prepared by:** TPM/BA  
**Reference Site:** https://skardutrekkers.com/  
**Scope:** Frontend Only (No Backend Logic)

---

## 1. Project Overview

### 1.1 Purpose
This document defines the frontend requirements for the **Akhtar Abbasi Hiking** website — a professionally designed static/SSG frontend showcasing hiking and travel services in Gilgit Baltistan, Pakistan.

### 1.2 Company Description
- **Company Name:** Akhtar Abbasi Hiking
- **Services:** Hiking and travel services across Gilgit Baltistan
- **Language:** English only
- **Visual Theme:** Dark/mountain adventure theme (inspired by skardutrekkers.com)

### 1.3 Tech Stack
| Layer | Technology |
|---|---|
| Framework | React Router v7 (Framework Mode) |
| Runtime | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | File-based via `app/routes/` convention |
| Deployment Target | Netlify / Cloudflare Pages / Vercel (static adapter) |
| Content | Static data files (JSON/TS) in `app/data/` |
| Images | Standard `<img>` with lazy loading + WebP |
| Icons | Lucide React or Heroicons |

### 1.4 Guiding Principles
- Frontend only — zero backend logic, no database, no auth
- All data (trips, FAQs, blogs, testimonials) stored in local static JSON/TS files under `app/data/`
- Fully responsive: mobile-first design
- SEO-optimised via React Router v7 `meta` export function per route
- Dark mountain aesthetic: deep navy/charcoal backgrounds, white text, earthy accent colors (forest green or amber)

---

## 2. Site Architecture

### 2.1 Pages

| Page | Route | RR7 File |
|---|---|---|
| Home | `/` | `app/routes/_index.tsx` |
| Trips | `/trips` | `app/routes/trips._index.tsx` |
| Trip Detail | `/trips/:slug` | `app/routes/trips.$slug.tsx` |
| Expeditions | `/expeditions` | `app/routes/expeditions._index.tsx` |
| Expedition Detail | `/expeditions/:slug` | `app/routes/expeditions.$slug.tsx` |
| Tours | `/tours` | `app/routes/tours._index.tsx` |
| Tour Detail | `/tours/:slug` | `app/routes/tours.$slug.tsx` |
| Gallery | `/gallery` | `app/routes/gallery.tsx` |
| About | `/about` | `app/routes/about.tsx` |
| FAQ | `/faq` | `app/routes/faq.tsx` |
| Blog | `/blog` | `app/routes/blog._index.tsx` |
| Blog Post | `/blog/:slug` | `app/routes/blog.$slug.tsx` |
| Contact | `/contact` | `app/routes/contact.tsx` |

### 2.2 Navigation Structure

**Top Bar (above main nav):**
- Location: Gilgit Baltistan
- Email: info@akhtarabbasi.com
- Phone: [client to provide]

**Main Navigation:**
- Home
- Trips (dropdown: All Trips, Short Treks, Multi-Day Treks)
- Expeditions (dropdown: by altitude range)
- Tours (dropdown: Gilgit, Hunza, Skardu)
- Gallery
- About (dropdown: About Us, FAQ)
- Blog
- Contact Us

> **Route conventions:** React Router v7 uses dot-separated flat file naming. Nested layouts share a parent layout file (e.g. `app/routes/trips.tsx` as layout wrapping all `/trips/*` routes). Dynamic segments use `$param` syntax instead of `[param]`.

**Mobile Nav:** Hamburger menu, full-screen slide-in drawer

---

## 3. Page-by-Page Requirements

---

### 3.1 Home Page (`/`)

#### 3.1.1 Hero Section
- Full-screen video or image slider (3–5 slides)
- Each slide: background mountain image, headline, sub-headline, CTA button ("Explore Trips", "View Expeditions")
- Overlay gradient (dark-to-transparent) for text legibility
- Animated text entrance on slide load

#### 3.1.2 Search/Filter Bar
- Destination dropdown (Skardu, Hunza, Gilgit, Nanga Parbat, etc.)
- Month selector (June–November)
- Trip Type selector (Trek, Expedition, Tour)
- "Search" CTA button

#### 3.1.3 Featured Trips Section
- Section heading: "Featured Hiking & Travel Packages"
- Sub-heading: "Discover Gilgit Baltistan"
- Trip cards grid (3 columns desktop, 1 column mobile)
- Each card: image, category tag, trip name, duration, "Enquire Now" button
- No pricing displayed

#### 3.1.4 About Snippet Section
- Left: stacked images (mountain/guide photos)
- Right: company intro text, mission statement, vision statement
- Three icon blocks: "Direct Local Pricing", "Our Vision", "Our Mission"
- CTA: "Discover More" → `/about`

#### 3.1.5 Why Choose Us Section
- 3-column icon grid
- Items: Best Price Guarantee, Easy & Quick Booking, Experienced Guides
- Dark background with card layout

#### 3.1.6 Destinations / Tours Showcase
- Tabbed or grid layout for tour categories:
  - Gilgit Baltistan Tours
  - Hunza Tours
  - Skardu City
  - Khaplu Valley
- Each destination: image card with name and trip count, link to tours page

#### 3.1.7 Peak Range Section
- 5 visual cards for altitude-based peak categories:
  - 5,500–6,000m Peaks
  - 6,000–6,500m Peaks
  - 6,500–7,000m Peaks
  - 7,000–7,500m Peaks
  - 7,500–8,000m Peaks
- Each card: image, label, link to expeditions filtered list

#### 3.1.8 Gallery Preview Section
- Masonry or grid layout: 6–8 images
- "View Full Gallery" CTA → `/gallery`

#### 3.1.9 Testimonials Section
- Carousel or card grid (3 visible)
- Each card: customer name, country flag, star rating, review text, trip name
- Auto-scroll with manual navigation dots

#### 3.1.10 WhatsApp Floating CTA
- Fixed floating button (bottom-right)
- WhatsApp icon + "Chat with us"
- Links to WhatsApp number

#### 3.1.11 Latest Blog Preview
- 3 latest blog cards: image, date, title, excerpt, "Read More" link

#### 3.1.12 Newsletter / Enquiry CTA Banner
- Full-width banner: "Ready to Explore Gilgit Baltistan?"
- CTA button: "Contact Us" → `/contact`

---

### 3.2 Trips Page (`/trips`)

- Page heading + sub-heading
- Filter bar: by region, by duration, by trip type
- Trip card grid (same card component as homepage)
- Each card: image, category, name, duration, highlights tags, "View Details" button
- No pricing displayed
- Pagination or "Load More" button

---

### 3.3 Trip Detail Page (`/trips/:slug`)

- Hero image (full width)
- Breadcrumb navigation
- Trip title, region tag, duration badge
- Tab navigation: Overview | Itinerary | Highlights | Gallery | FAQs
- **Overview:** Description paragraphs, difficulty level badge, best season
- **Itinerary:** Day-by-day accordion list (Day 1: Islamabad → Gilgit, etc.)
- **Highlights:** Bullet list of key experiences
- **Gallery:** Image grid (lightbox on click)
- **FAQs:** Accordion for trip-specific questions
- Sidebar (sticky on desktop):
  - "Enquire Now" button (links to `/contact` or opens WhatsApp)
  - Trip summary: Duration, Difficulty, Start/End point, Group size
- Related Trips section at bottom (3 cards)

---

### 3.4 Expeditions Page (`/expeditions`)

- Page hero with heading "Elite Mountain Expeditions"
- Filter by altitude range (4000–6000m, 6000–6500m, etc.)
- Card grid: image, expedition name, duration, altitude badge, "View Details" button
- No pricing displayed

---

### 3.5 Expedition Detail Page (`/expeditions/:slug`)

- Same structure as Trip Detail page
- Additional fields: Summit altitude badge, technical difficulty rating, required gear list
- Sidebar CTA: "Request Expedition Quote" → contact form

---

### 3.6 Tours Page (`/tours`)

- Page heading: "Gilgit Baltistan Tours"
- Tab or dropdown filter: Skardu, Hunza, Gilgit, Khaplu, Shigar
- Tour cards: image, name, duration, highlights, "View Details" button
- No pricing displayed

---

### 3.7 Tour Detail Page (`/tours/:slug`)

- Same layout as Trip Detail
- Includes: accommodation type info, meal plan info, transport type
- CTA: "Book This Tour" → WhatsApp / contact

---

### 3.8 Gallery Page (`/gallery`)

- Page heading: "Our Adventures in Photos"
- Filter tabs: All | Treks | Expeditions | Tours | Nature
- Masonry image grid with lightbox (click to open full-size)
- Video embeds section (YouTube iframes, lazy-loaded)
- Responsive: 3 cols desktop, 2 cols tablet, 1 col mobile

---

### 3.9 About Page (`/about`)

- Hero section: company name + tagline
- Story section: "Who We Are" — paragraphs + side image
- Mission & Vision blocks (icon + heading + text)
- Team section: guide/staff cards (photo, name, role, bio snippet)
- Stats bar: Years of Experience | Treks Completed | Happy Clients | Peaks Summited (animated counters)
- License/Certifications display
- CTA: "Trek with Us" → `/contact`

---

### 3.10 FAQ Page (`/faq`)

Accordion-based FAQ covering the following categories derived from the reference site:

**General:**
- How to register / enquire?
- Do you organise solo treks?
- Do you organise private group treks?

**Preparation:**
- How to prepare for a trek?
- What vaccinations are needed?
- What is the weather like?

**Logistics:**
- What is the baggage allowance?
- Can equipment be rented?
- What meals are provided?
- What is the accommodation like?

**Safety:**
- Is Pakistan safe for foreigners?
- Is the Karakoram Highway safe?

**Finance:**
- How much money should I carry?
- How much to tip porters?

Each FAQ item: animated expand/collapse, smooth transition

---

### 3.11 Blog Page (`/blog`)

- Page heading: "Stories from the Trail"
- Grid of blog cards: featured image, date, author, title, excerpt, "Read More"
- Category filter tags: Trekking | Expeditions | Travel Tips | Culture
- Pagination

---

### 3.12 Blog Post Page (`/blog/:slug`)

- Hero image
- Author, date, reading time, category tag
- Article body (rendered from markdown or static content)
- Related posts (3 cards at bottom)
- Social share buttons (WhatsApp, Facebook, Twitter/X)

---

### 3.13 Contact Page (`/contact`)

- Page heading: "Get in Touch"
- Two-column layout:
  - **Left:** Contact form fields:
    - Full Name (required)
    - Email (required)
    - Phone/WhatsApp
    - Trip of Interest (dropdown from trip list)
    - Preferred Travel Month (dropdown)
    - Group Size
    - Message / Questions
    - Submit button (links to mailto or WhatsApp prefill — no backend)
  - **Right:** Contact info cards:
    - WhatsApp: click-to-chat link
    - Email: mailto link
    - Phone: tel link
    - Location: Gilgit Baltistan, Pakistan
    - Google Maps embed (iframe)
- Social media links row: Facebook, Instagram, YouTube

---

## 4. Global Components

### 4.1 Header
- Logo (top-left)
- Top info bar (location, email, phone)
- Main navigation with dropdowns
- Mobile hamburger menu
- Sticky on scroll (with background blur)

### 4.2 Footer
- Logo + company description
- Navigation columns: Quick Links, Services, Destinations
- Contact info block
- Social media icons
- Copyright line + License number
- "Back to top" button

### 4.3 Trip Card Component (Reusable)
- Props: image, category, title, duration, slug, highlights[]
- No pricing prop
- "View Details" or "Enquire Now" CTA

### 4.4 WhatsApp Floating Button
- Fixed position, bottom-right
- Visible on all pages
- Opens WhatsApp chat link in new tab

### 4.5 Lightbox Component
- Used in gallery and trip detail gallery tabs
- Keyboard navigable (arrow keys, ESC to close)

### 4.6 Accordion Component
- Used in FAQ and itinerary sections
- Smooth open/close animation

### 4.7 SEO Metadata (per route)
- Title tag
- Meta description
- Open Graph image
- Canonical URL
- Implemented via React Router v7 `meta` export function on each route file:
```ts
export const meta: MetaFunction = () => [
  { title: "K2 Base Camp Trek | Akhtar Abbasi Hiking" },
  { name: "description", content: "..." },
  { property: "og:image", content: "/images/og/k2.webp" },
];
```

---

## 5. Data Structure (Static Files)

All content stored in `app/data/` as TypeScript files. Data is imported directly into route `loader` functions — React Router v7's `loader` runs at request time (SSR) or build time (pre-rendering) and passes data to the component via `useLoaderData()`.

```
app/
  data/
    trips.ts          → All hiking trip records
    expeditions.ts    → All expedition records
    tours.ts          → All tour records
    faqs.ts           → FAQ items by category
    testimonials.ts   → Customer reviews
    blog-posts.ts     → Blog article metadata
    destinations.ts   → Destination cards data
    gallery.ts        → Image/video gallery items
    team.ts           → Staff/guide profiles
    nav.ts            → Navigation menu structure
  routes/
    _index.tsx        → Home
    trips._index.tsx  → Trips listing
    trips.$slug.tsx   → Trip detail
    ...
```

**Route loader pattern:**
```ts
// app/routes/trips.$slug.tsx
import { trips } from "~/data/trips";

export async function loader({ params }: LoaderFunctionArgs) {
  const trip = trips.find((t) => t.slug === params.slug);
  if (!trip) throw new Response("Not Found", { status: 404 });
  return trip;
}

export default function TripDetail() {
  const trip = useLoaderData<typeof loader>();
  return <div>{trip.title}</div>;
}
```

**Sample Trip Object:**
```ts
{
  slug: "k2-base-camp-trek",
  title: "K2 Base Camp Trek",
  category: "Multi-Day Trek",
  region: "The Karakoram",
  duration: "17 Days",
  difficulty: "Challenging",
  bestSeason: "June – September",
  heroImage: "/images/trips/k2-base-camp.webp",
  gallery: ["/images/trips/k2-01.jpg"],
  highlights: ["Baltoro Glacier", "Concordia", "K2 View"],
  itinerary: [
    { day: 1, title: "Islamabad Arrival", description: "..." },
  ],
  faqs: [],
  overview: "Full description text here...",
}
```

---

## 6. Design Tokens

| Token | Value |
|---|---|
| Primary Background | `#0a0f1a` (deep navy) |
| Secondary Background | `#111827` (dark gray) |
| Card Background | `#1f2937` |
| Primary Accent | `#16a34a` (forest green) or `#d97706` (amber) |
| Text Primary | `#f9fafb` (white) |
| Text Secondary | `#9ca3af` (gray-400) |
| Font Heading | `Montserrat` or `Poppins` (Google Fonts) |
| Font Body | `Inter` (Google Fonts) |
| Border Radius | `rounded-xl` (12px) |
| Max Content Width | `1280px` |

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | 1 column |
| Tablet | 640px–1024px | 2 columns |
| Desktop | > 1024px | 3–4 columns |

---

## 8. Performance Requirements

- Lighthouse score target: 90+ on all categories
- Images: Next.js `<Image>` with lazy loading and WebP format
- Fonts: `next/font` for zero layout shift
- No unused CSS (Tailwind purge enabled)
- YouTube videos: lazy iframe embed (load on interaction)

---

## 9. Out of Scope (Frontend Only)

The following are explicitly excluded from this project:

| Feature | Reason |
|---|---|
| User authentication / login | Backend required |
| Online payment / booking engine | Backend required |
| CMS / admin panel | Backend required |
| Real-time availability | Backend required |
| Email sending (form submission) | Backend required — use WhatsApp/mailto as interim |
| Database | Backend required |

---

## 10. Deliverables

| Deliverable | Description |
|---|---|
| Next.js project scaffold | App Router, Tailwind configured |
| All page routes | As defined in Section 2.1 |
| Reusable component library | Cards, accordions, lightbox, nav, footer |
| Static data files | All content in `/src/data/` |
| Responsive layouts | Mobile-first, all breakpoints |
| SEO metadata | Per-page via `generateMetadata()` |
| Deployment-ready build | `next build` passes with zero errors |

---

## 11. Reference

- **Reference Website:** https://skardutrekkers.com/
- **Inspiration:** Layout structure, navigation hierarchy, trip card design, FAQ content categories, hero slider approach
- **Original Content:** All text, images, and brand identity must be replaced with Akhtar Abbasi Hiking's own content

---

*End of SRS v1.0 — Akhtar Abbasi Hiking Frontend*