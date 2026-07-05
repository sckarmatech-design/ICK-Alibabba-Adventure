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

  // Admin layout + routes
  layout("routes/admin.tsx", [
    route("admin", "routes/admin._index.tsx"),
    route("admin/logout", "routes/admin.logout.tsx"),
    // Phase 4 will add more routes here
  ]),
] satisfies RouteConfig;
