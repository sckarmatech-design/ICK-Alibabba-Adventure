/**
 * SEO Configuration & Utilities
 * Centralized SEO metadata for all pages
 */

export const SITE_CONFIG = {
  name: "ICK Alibabba Adventure",
  url: "https://ickalibabbaadventure.com",
  description:
    "Experience world-class trekking and expeditions in Gilgit Baltistan. Expert guides, unforgettable adventures, and breathtaking mountain views await.",
  locale: "en_US",
  logo: "https://ickalibabbaadventure.com/images/logo.webp",
  image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=630&fit=crop",
  social: {
    twitter: "@akhtarabbasi",
    facebook: "akhtarabbasi.hiking",
    instagram: "@akhtarabbasi_hiking",
  },
};

export interface SEOMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  jsonLd?: Record<string, unknown>;
}

export const generateMetaTags = (meta: SEOMetadata) => {
  const url = meta.url || SITE_CONFIG.url;
  const image = meta.image || SITE_CONFIG.image;
  const type = meta.type || "website";

  const tags: Array<Record<string, unknown>> = [
    { title: meta.title },
    { name: "description", content: meta.description },
    { name: "theme-color", content: "#0a0f1a" },

    // Open Graph
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_CONFIG.name },
    { property: "og:locale", content: SITE_CONFIG.locale },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
    { name: "twitter:image", content: image },
    { name: "twitter:creator", content: SITE_CONFIG.social.twitter },

    // Additional SEO
    { name: "canonical", content: url },
    { name: "robots", content: "index, follow" },
  ];

  // Add article-specific tags
  if (type === "article") {
    if (meta.publishedDate) {
      tags.push({
        property: "article:published_time",
        content: meta.publishedDate,
      });
    }
    if (meta.modifiedDate) {
      tags.push({
        property: "article:modified_time",
        content: meta.modifiedDate,
      });
    }
    if (meta.author) {
      tags.push({ property: "article:author", content: meta.author });
    }
  }

  return tags;
};

export const generateJsonLd = (data: Record<string, unknown>) => {
  return JSON.stringify(data);
};

/**
 * Page-specific SEO metadata
 */
export const PAGE_SEO: Record<string, SEOMetadata> = {
  home: {
    title: "ICK Alibabba Adventure",
    description:
      "Experience world-class trekking and expeditions in Gilgit Baltistan. Expert guides, unforgettable adventures, and breathtaking mountain views await.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com",
  },
  trips: {
    title: "Hiking Trips | ICK Alibabba Adventure",
    description:
      "Explore our collection of carefully curated hiking trips across Gilgit Baltistan. From short day hikes to challenging multi-day treks.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/trips",
  },
  expeditions: {
    title: "Mountain Expeditions | ICK Alibabba Adventure",
    description:
      "Join high-altitude mountain expeditions in Gilgit Baltistan. Summit some of the world's most spectacular peaks with experienced mountaineers.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/expeditions",
  },
  tours: {
    title: "Cultural Tours | ICK Alibabba Adventure",
    description:
      "Discover the rich culture and stunning landscapes of Gilgit Baltistan through guided cultural tours and regional experiences.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/tours",
  },
  gallery: {
    title: "Gallery | ICK Alibabba Adventure",
    description:
      "View stunning photographs and videos from our trekking expeditions and mountain adventures in Gilgit Baltistan.",
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/gallery",
  },
  about: {
    title: "About Us | ICK Alibabba Adventure",
    description:
      "Learn about ICK Alibabba Adventure — our mission, vision, experienced guides, and commitment to unforgettable mountain adventures.",
    image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/about",
  },
  faq: {
    title: "FAQ | ICK Alibabba Adventure",
    description:
      "Frequently asked questions about our trekking trips, expeditions, safety measures, and booking process.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/faq",
  },
  blog: {
    title: "Blog | ICK Alibabba Adventure",
    description:
      "Stories from the trail, trekking tips, and travel guides from our mountain adventures.",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/blog",
  },
  contact: {
    title: "Contact Us | ICK Alibabba Adventure",
    description:
      "Get in touch with ICK Alibabba Adventure. Contact us via email, phone, WhatsApp, or fill out our contact form.",
    image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/contact",
  },
};
