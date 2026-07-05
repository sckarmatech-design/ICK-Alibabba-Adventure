import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { trips } from "../app/data/trips.js";
import { expeditions } from "../app/data/expeditions.js";
import { tours } from "../app/data/tours.js";
import { blogPosts } from "../app/data/blog-posts.js";
import { faqs } from "../app/data/faqs.js";
import { testimonials } from "../app/data/testimonials.js";
import { destinations } from "../app/data/destinations.js";
import { galleryImages, videos } from "../app/data/gallery.js";
import { team } from "../app/data/team.js";
import { mainNav, footerLinks, companyInfo } from "../app/data/nav.js";
import type {
  TripCategory,
  Difficulty,
  BlogCategory,
  FAQCategory,
  GalleryItemCategory,
} from "@prisma/client";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function mapTripCategory(category: string): TripCategory {
  switch (category) {
    case "Short Trek":
      return "SHORT_TREK";
    case "Multi-Day Trek":
      return "MULTI_DAY_TREK";
    case "Day Hike":
      return "DAY_HIKE";
    default:
      throw new Error(`Unknown trip category: ${category}`);
  }
}

function mapDifficulty(difficulty: string): Difficulty {
  switch (difficulty) {
    case "Easy":
      return "EASY";
    case "Moderate":
      return "MODERATE";
    case "Challenging":
      return "CHALLENGING";
    case "Expert":
      return "EXPERT";
    default:
      throw new Error(`Unknown difficulty: ${difficulty}`);
  }
}

function mapBlogCategory(category: string): BlogCategory {
  switch (category) {
    case "Trekking":
      return "TREKKING";
    case "Expeditions":
      return "EXPEDITIONS";
    case "Travel Tips":
      return "TRAVEL_TIPS";
    case "Culture":
      return "CULTURE";
    default:
      throw new Error(`Unknown blog category: ${category}`);
  }
}

function mapFAQCategory(category: string): FAQCategory {
  switch (category) {
    case "General":
      return "GENERAL";
    case "Preparation":
      return "PREPARATION";
    case "Logistics":
      return "LOGISTICS";
    case "Safety":
      return "SAFETY";
    case "Finance":
      return "FINANCE";
    default:
      throw new Error(`Unknown FAQ category: ${category}`);
  }
}

function mapGalleryCategory(category: string): GalleryItemCategory {
  switch (category) {
    case "Treks":
      return "TREKS";
    case "Expeditions":
      return "EXPEDITIONS";
    case "Tours":
      return "TOURS";
    case "Nature":
      return "NATURE";
    case "Culture":
      return "CULTURE";
    default:
      throw new Error(`Unknown gallery category: ${category}`);
  }
}

async function main() {
  // Clear all existing data
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
  for (const trip of trips) {
    await prisma.trip.create({
      data: {
        slug: trip.slug,
        title: trip.title,
        category: mapTripCategory(trip.category),
        region: trip.region,
        duration: trip.duration,
        difficulty: mapDifficulty(trip.difficulty),
        bestSeason: trip.bestSeason,
        heroImage: trip.heroImage,
        overview: trip.overview,
        groupSize: trip.groupSize ?? null,
        startPoint: trip.startPoint ?? null,
        endPoint: trip.endPoint ?? null,
        highlights: trip.highlights,
        gallery: trip.gallery,
        itinerary: trip.itinerary as unknown as Prisma.InputJsonValue,
        faqs: trip.faqs as unknown as Prisma.InputJsonValue,
      },
    });
  }

  // --- EXPEDITIONS ---
  for (const expedition of expeditions) {
    await prisma.expedition.create({
      data: {
        slug: expedition.slug,
        title: expedition.title,
        region: expedition.region,
        duration: expedition.duration,
        altitude: expedition.altitude,
        difficulty: mapDifficulty(expedition.difficulty),
        bestSeason: expedition.bestSeason,
        heroImage: expedition.heroImage,
        overview: expedition.overview,
        technicalRating: expedition.technicalRating,
        highlights: expedition.highlights,
        gallery: expedition.gallery,
        itinerary: expedition.itinerary as unknown as Prisma.InputJsonValue,
        gear: expedition.gear ?? [],
        faqs: (expedition.faqs ?? []) as unknown as Prisma.InputJsonValue,
      },
    });
  }

  // --- TOURS ---
  for (const tour of tours) {
    await prisma.tour.create({
      data: {
        slug: tour.slug,
        title: tour.title,
        region: tour.region,
        duration: tour.duration,
        difficulty: mapDifficulty(tour.difficulty),
        bestSeason: tour.bestSeason,
        heroImage: tour.heroImage,
        overview: tour.overview,
        accommodation: tour.accommodation ?? null,
        mealPlan: tour.mealPlan ?? null,
        transport: tour.transport ?? null,
        highlights: tour.highlights,
        gallery: tour.gallery,
        itinerary: tour.itinerary as unknown as Prisma.InputJsonValue,
      },
    });
  }

  // --- BLOG POSTS ---
  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        author: post.author,
        date: new Date(post.date),
        category: mapBlogCategory(post.category),
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        readingTime: post.readingTime,
        videoUrl: null,
      },
    });
  }

  // --- FAQS ---
  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];
    await prisma.fAQ.create({
      data: {
        category: mapFAQCategory(faq.category),
        question: faq.question,
        answer: faq.answer,
        sortOrder: i,
      },
    });
  }

  // --- TESTIMONIALS ---
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        name: testimonial.name,
        country: testimonial.country,
        countryCode: testimonial.countryCode,
        rating: testimonial.rating,
        review: testimonial.review,
        tripName: testimonial.tripName,
        image: testimonial.image ?? null,
      },
    });
  }

  // --- DESTINATIONS ---
  for (const destination of destinations) {
    await prisma.destination.create({
      data: {
        name: destination.name,
        region: destination.region,
        image: destination.image,
        tripCount: destination.tripCount,
        description: destination.description,
        highlights: destination.highlights,
      },
    });
  }

  // --- GALLERY IMAGES ---
  for (const image of galleryImages) {
    await prisma.galleryImage.create({
      data: {
        title: image.title,
        image: image.image,
        thumbnail: image.thumbnail ?? null,
        category: mapGalleryCategory(image.category),
        alt: image.alt,
        featured: image.featured ?? false,
      },
    });
  }

  // --- GALLERY VIDEOS ---
  for (const video of videos) {
    await prisma.galleryVideo.create({
      data: {
        title: video.title,
        videoUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
        thumbnail: video.thumbnail,
        alt: video.alt,
      },
    });
  }

  // --- TEAM MEMBERS ---
  for (let i = 0; i < team.length; i++) {
    const member = team[i];
    await prisma.teamMember.create({
      data: {
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image ?? null,
        specialization: member.specialization ?? null,
        experience: member.experience ?? null,
        sortOrder: i,
      },
    });
  }

  // --- SITE SETTINGS ---
  await prisma.siteSetting.create({
    data: {
      key: "mainNav",
      value: mainNav as unknown as Prisma.InputJsonValue,
    },
  });
  await prisma.siteSetting.create({
    data: {
      key: "footerLinks",
      value: footerLinks as unknown as Prisma.InputJsonValue,
    },
  });
  await prisma.siteSetting.create({
    data: {
      key: "companyInfo",
      value: companyInfo as unknown as Prisma.InputJsonValue,
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
