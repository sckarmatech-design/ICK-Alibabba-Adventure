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
  keywords?: string[];
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
  ];

  if (meta.keywords && meta.keywords.length > 0) {
    tags.push({ name: "keywords", content: meta.keywords.join(", ") });
  }

  tags.push(
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
  );

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
    keywords: [
      "trekking",
      "hiking",
      "expeditions",
      "Gilgit Baltistan",
      "K2",
      "mountains",
      "adventure",
      "Pakistan",
    ],
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com",
  },
  trips: {
    title: "Hiking Trips | ICK Alibabba Adventure",
    description:
      "Explore our collection of carefully curated hiking trips across Gilgit Baltistan. From short day hikes to challenging multi-day treks.",
    keywords: [
      "hiking trips",
      "trekking",
      "Gilgit Baltistan",
      "day hikes",
      "multi-day treks",
    ],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/trips",
  },
  expeditions: {
    title: "Mountain Expeditions | ICK Alibabba Adventure",
    description:
      "Expert-guided expeditions to the world's highest peaks in the Karakoram. Nanga Parbat, Rakaposhi, and more.",
    keywords: [
      "mountain expeditions",
      "peak climbing",
      "K2",
      "Nanga Parbat",
      "Rakaposhi",
      "Gilgit Baltistan",
    ],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/expeditions",
  },
  tours: {
    title: "Gilgit Baltistan Tours | ICK Alibabba Adventure",
    description:
      "Explore cultural and scenic tours across Gilgit Baltistan. Skardu, Hunza, Gilgit, and more destinations.",
    keywords: [
      "tours",
      "cultural tours",
      "Skardu",
      "Hunza",
      "Gilgit",
      "Gilgit Baltistan travel",
    ],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/tours",
  },
  gallery: {
    title: "Gallery | ICK Alibabba Adventure",
    description:
      "Beautiful photos and videos from our trekking and expedition adventures in Gilgit Baltistan.",
    keywords: [
      "trekking photos",
      "hiking pictures",
      "adventure photography",
      "Gilgit Baltistan videos",
    ],
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/gallery",
  },
  about: {
    title: "About Us | ICK Alibabba Adventure",
    description:
      "Learn about ICK Alibabba Adventure — our mission, vision, experienced guides, and commitment to unforgettable mountain adventures.",
    keywords: [
      "about us",
      "our mission",
      "experienced guides",
      "trekking company",
      "Gilgit Baltistan",
    ],
    image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/about",
  },
  faq: {
    title: "FAQ | ICK Alibabba Adventure",
    description:
      "Frequently asked questions about our trekking packages, expeditions, and adventures.",
    keywords: [
      "FAQ",
      "frequently asked questions",
      "trekking information",
      "expedition preparation",
    ],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/faq",
  },
  blog: {
    title: "Blog | ICK Alibabba Adventure",
    description:
      "Stories from the trail, trekking tips, and travel guides from our mountain adventures.",
    keywords: [
      "trekking blog",
      "hiking tips",
      "adventure guides",
      "mountain stories",
      "travel tips",
    ],
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/blog",
  },
  contact: {
    title: "Contact Us | ICK Alibabba Adventure",
    description:
      "Get in touch with ICK Alibabba Adventure. Contact us via email, phone, WhatsApp, or fill out our contact form.",
    keywords: [
      "contact us",
      "email",
      "phone",
      "WhatsApp",
      "inquiry",
      "booking",
    ],
    image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=630&fit=crop",
    url: "https://ickalibabbaadventure.com/contact",
  },
};