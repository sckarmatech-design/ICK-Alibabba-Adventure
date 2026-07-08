import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Home
  index("routes/_index.tsx"),

  // Trips
  route("trips", "routes/trips._index.tsx"),
  route("trips/:slug", "routes/trips.$slug.tsx"),

  // Expeditions
  route("expeditions", "routes/expeditions._index.tsx"),
  route("expeditions/:slug", "routes/expeditions.$slug.tsx"),

  // Tours
  route("tours", "routes/tours._index.tsx"),
  route("tours/:slug", "routes/tours.$slug.tsx"),

  // Blog
  route("blog", "routes/blog._index.tsx"),
  route("blog/:slug", "routes/blog.$slug.tsx"),

  // Gallery
  route("gallery", "routes/gallery.tsx"),

  // About
  route("about", "routes/about.tsx"),

  // FAQ
  route("faq", "routes/faq.tsx"),

  // Contact
  route("contact", "routes/contact.tsx"),

  // Auth
  route("login", "routes/login.tsx"),

  // API
  route("api/upload-image", "routes/api.upload-image.tsx"),

  // Admin layout + routes
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
    route(
      "admin/expeditions/:id/edit",
      "routes/admin.expeditions.$id.edit.tsx",
    ),

    // Tours
    route("admin/tours", "routes/admin.tours._index.tsx"),
    route("admin/tours/new", "routes/admin.tours.new.tsx"),
    route("admin/tours/:id/edit", "routes/admin.tours.$id.edit.tsx"),

    // Blog
    route("admin/blog", "routes/admin.blog._index.tsx"),
    route("admin/blog/new", "routes/admin.blog.new.tsx"),
    route("admin/blog/:id/edit", "routes/admin.blog.$id.edit.tsx"),

    // Testimonials
    route("admin/testimonials", "routes/admin.testimonials._index.tsx"),
    route("admin/testimonials/new", "routes/admin.testimonials.new.tsx"),
    route(
      "admin/testimonials/:id/edit",
      "routes/admin.testimonials.$id.edit.tsx",
    ),

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
    route(
      "admin/destinations/:id/edit",
      "routes/admin.destinations.$id.edit.tsx",
    ),

    // Gallery
    route("admin/gallery", "routes/admin.gallery._index.tsx"),
    route("admin/gallery/images/new", "routes/admin.gallery.images.new.tsx"),
    route("admin/gallery/videos/new", "routes/admin.gallery.videos.new.tsx"),
    route("admin/gallery/:id/edit", "routes/admin.gallery.$id.edit.tsx"),

    // Inquiries
    route("admin/inquiries", "routes/admin.inquiries.tsx"),

    // Settings
    route("admin/settings", "routes/admin.settings.tsx"),

    // Hero
    route("admin/hero", "routes/admin.hero._index.tsx"),
    route("admin/hero/new", "routes/admin.hero.new.tsx"),
    route("admin/hero/:id/edit", "routes/admin.hero.$id.edit.tsx"),
  ]),
] satisfies RouteConfig;
