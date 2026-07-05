import type {
  Trip as PrismaTrip,
  Expedition as PrismaExpedition,
  Tour as PrismaTour,
  BlogPost as PrismaBlogPost,
  FAQ as PrismaFAQ,
  GalleryImage as PrismaGalleryImage,
  GalleryVideo as PrismaGalleryVideo,
  TeamMember as PrismaTeamMember,
  Testimonial as PrismaTestimonial,
  Destination as PrismaDestination,
} from "@prisma/client";
import type { Trip } from "~/data/trips";
import type { Expedition } from "~/data/expeditions";
import type { Tour } from "~/data/tours";
import type { BlogPost } from "~/data/blog-posts";
import type { FAQItem } from "~/data/faqs";
import type { GalleryItem, VideoItem } from "~/data/gallery";
import type { TeamMember } from "~/data/team";
import type { Testimonial } from "~/data/testimonials";
import type { Destination } from "~/data/destinations";

function mapTripCategory(category: PrismaTrip["category"]): Trip["category"] {
  switch (category) {
    case "SHORT_TREK":
      return "Short Trek";
    case "MULTI_DAY_TREK":
      return "Multi-Day Trek";
    case "DAY_HIKE":
      return "Day Hike";
    default:
      return category;
  }
}

function mapDifficulty(
  difficulty: "EASY" | "MODERATE" | "CHALLENGING" | "EXPERT",
): string {
  switch (difficulty) {
    case "EASY":
      return "Easy";
    case "MODERATE":
      return "Moderate";
    case "CHALLENGING":
      return "Challenging";
    case "EXPERT":
      return "Expert";
    default:
      return difficulty;
  }
}

function mapBlogCategory(
  category: PrismaBlogPost["category"],
): BlogPost["category"] {
  switch (category) {
    case "TREKKING":
      return "Trekking";
    case "EXPEDITIONS":
      return "Expeditions";
    case "TRAVEL_TIPS":
      return "Travel Tips";
    case "CULTURE":
      return "Culture";
    default:
      return category;
  }
}

function mapFAQCategory(category: PrismaFAQ["category"]): FAQItem["category"] {
  switch (category) {
    case "GENERAL":
      return "General";
    case "PREPARATION":
      return "Preparation";
    case "LOGISTICS":
      return "Logistics";
    case "SAFETY":
      return "Safety";
    case "FINANCE":
      return "Finance";
    default:
      return category;
  }
}

function mapGalleryCategory(
  category: PrismaGalleryImage["category"],
): GalleryItem["category"] {
  switch (category) {
    case "TREKS":
      return "Treks";
    case "EXPEDITIONS":
      return "Expeditions";
    case "TOURS":
      return "Tours";
    case "NATURE":
      return "Nature";
    case "CULTURE":
      return "Culture";
    default:
      return category;
  }
}

export function mapTripFromPrisma(trip: PrismaTrip): Trip {
  return {
    slug: trip.slug,
    title: trip.title,
    category: mapTripCategory(trip.category),
    region: trip.region,
    duration: trip.duration,
    difficulty: mapDifficulty(trip.difficulty) as Trip["difficulty"],
    bestSeason: trip.bestSeason,
    heroImage: trip.heroImage,
    gallery: trip.gallery,
    highlights: trip.highlights,
    overview: trip.overview,
    itinerary: trip.itinerary as unknown as Trip["itinerary"],
    faqs: trip.faqs as unknown as Trip["faqs"],
    groupSize: trip.groupSize ?? undefined,
    startPoint: trip.startPoint ?? undefined,
    endPoint: trip.endPoint ?? undefined,
  };
}

export function mapExpeditionFromPrisma(
  expedition: PrismaExpedition,
): Expedition {
  return {
    slug: expedition.slug,
    title: expedition.title,
    region: expedition.region,
    duration: expedition.duration,
    altitude: expedition.altitude,
    difficulty: mapDifficulty(
      expedition.difficulty,
    ) as Expedition["difficulty"],
    bestSeason: expedition.bestSeason,
    heroImage: expedition.heroImage,
    gallery: expedition.gallery,
    highlights: expedition.highlights,
    overview: expedition.overview,
    itinerary: expedition.itinerary as unknown as Expedition["itinerary"],
    technicalRating: expedition.technicalRating,
    gear: expedition.gear,
    faqs: (expedition.faqs ?? []) as unknown as Expedition["faqs"],
  };
}

export function mapTourFromPrisma(tour: PrismaTour): Tour {
  return {
    slug: tour.slug,
    title: tour.title,
    region: tour.region,
    duration: tour.duration,
    difficulty: mapDifficulty(tour.difficulty) as Tour["difficulty"],
    bestSeason: tour.bestSeason,
    heroImage: tour.heroImage,
    gallery: tour.gallery,
    highlights: tour.highlights,
    overview: tour.overview,
    accommodation: tour.accommodation ?? undefined,
    mealPlan: tour.mealPlan ?? undefined,
    transport: tour.transport ?? undefined,
    itinerary: tour.itinerary as unknown as Tour["itinerary"],
  };
}

export function mapBlogPostFromPrisma(post: PrismaBlogPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    author: post.author,
    date: post.date.toISOString().split("T")[0],
    category: mapBlogCategory(post.category),
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    readingTime: post.readingTime,
  };
}

export function mapFAQFromPrisma(faq: PrismaFAQ): FAQItem {
  return {
    id: faq.id,
    category: mapFAQCategory(faq.category),
    question: faq.question,
    answer: faq.answer,
  };
}

export function mapGalleryImageFromPrisma(
  image: PrismaGalleryImage,
): GalleryItem {
  return {
    id: image.id,
    title: image.title,
    image: image.image,
    thumbnail: image.thumbnail ?? undefined,
    category: mapGalleryCategory(image.category),
    alt: image.alt,
    featured: image.featured,
  };
}

export function mapGalleryVideoFromPrisma(
  video: PrismaGalleryVideo,
): VideoItem {
  const match = video.videoUrl.match(/v=([^&]+)/);
  const youtubeId = match ? match[1] : "";
  return {
    id: video.id,
    title: video.title,
    youtubeId,
    thumbnail: video.thumbnail ?? "",
    alt: video.alt,
  };
}

export function mapTeamMemberFromPrisma(member: PrismaTeamMember): TeamMember {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    image: member.image ?? undefined,
    specialization: member.specialization ?? undefined,
    experience: member.experience ?? undefined,
  };
}

export function mapTestimonialFromPrisma(
  testimonial: PrismaTestimonial,
): Testimonial {
  return {
    id: testimonial.id,
    name: testimonial.name,
    country: testimonial.country,
    countryCode: testimonial.countryCode,
    rating: testimonial.rating,
    review: testimonial.review,
    tripName: testimonial.tripName,
    image: testimonial.image ?? undefined,
  };
}

export function mapDestinationFromPrisma(
  destination: PrismaDestination,
): Destination {
  return {
    id: destination.id,
    name: destination.name,
    region: destination.region,
    image: destination.image,
    tripCount: destination.tripCount,
    description: destination.description,
    highlights: destination.highlights,
  };
}
