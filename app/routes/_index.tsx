import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import { useLoaderData } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { TripCard } from "~/components/TripCard";
import { DestinationCard } from "~/components/DestinationCard";
import { SectionTitle } from "~/components/SectionTitle";
import prisma from "~/lib/prisma.server";
import {
  mapTripFromPrisma,
  mapTestimonialFromPrisma,
  mapBlogPostFromPrisma,
  mapDestinationFromPrisma,
} from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader(_args: LoaderFunctionArgs) {
  const [trips, testimonials, blogPosts, destinations] = await Promise.all([
    prisma.trip.findMany({ orderBy: { title: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({ orderBy: { date: "desc" }, take: 3 }),
    prisma.destination.findMany({ orderBy: { name: "asc" } }),
  ]);
  return {
    trips: trips.map(mapTripFromPrisma),
    testimonials: testimonials.map(mapTestimonialFromPrisma),
    blogPosts: blogPosts.map(mapBlogPostFromPrisma),
    destinations: destinations.map(mapDestinationFromPrisma),
  };
}
import k2BaseCamp from "~/images/hero/k2-base-camp.webp";
import hunzaValley from "~/images/hero/sebastien-goldberg-BKLHxgbYFDI-unsplash.jpg";
import fairyMeadows from "~/images/hero/toomas-tartes-Yizrl9N_eDA-unsplash.jpg";
export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Akhtar Abbasi Hiking | Trekking & Expeditions in Gilgit Baltistan",
    description:
      "Experience world-class trekking and expeditions in Gilgit Baltistan. Expert guides, unforgettable adventures, and breathtaking mountain views await.",
    image: "https://akhtarabbasi-hiking.com/images/og/home.webp",
    url: SITE_CONFIG.url,
  }),
  {
    name: "keywords",
    content:
      "trekking, hiking, expeditions, Gilgit Baltistan, K2, mountains, adventure, Pakistan",
  },
];

// Hero Slider Component
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: `${k2BaseCamp}`,
      headline: "K2 Base Camp Trek",
      subheadline: "Walk across the legendary Baltoro Glacier",
      cta: "Explore Trek",
      href: "/trips/k2-base-camp-trek",
    },
    {
      image: `${fairyMeadows}`,
      headline: "Fairy Meadows Adventure",
      subheadline: "Experience the magic of alpine meadows",
      cta: "View Expedition",
      href: "/expeditions",
    },
    {
      image: `${hunzaValley}`,
      headline: "Hunza Valley Tour",
      subheadline: "Discover the secrets of longevity",
      cta: "Explore Tours",
      href: "/tours",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden rounded-lg mb-12">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div
              className={`transform transition-all duration-500 ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {slide.headline}
              </h1>
              <p className="text-xl text-[#9ca3af] mb-8 max-w-2xl">
                {slide.subheadline}
              </p>
              <a
                href={slide.href}
                className="inline-block px-8 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-semibold"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentSlide ? "bg-[#16a34a]" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Search/Filter Bar Component
function SearchBar() {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 mb-12">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Filter size={20} className="text-[#16a34a]" />
        Find Your Adventure
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="search-destination"
            className="block text-sm text-[#9ca3af] mb-2"
          >
            Destination
          </label>
          <select
            id="search-destination"
            name="destination"
            className="w-full px-4 py-2 bg-[#1f2937] border border-[#1f2937] rounded text-white hover:border-[#16a34a] transition focus:outline-none focus:border-[#16a34a]"
          >
            <option value="">Select destination</option>
            <option value="skardu">Skardu</option>
            <option value="hunza">Hunza</option>
            <option value="gilgit">Gilgit</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="search-month"
            className="block text-sm text-[#9ca3af] mb-2"
          >
            Month
          </label>
          <select
            id="search-month"
            name="month"
            className="w-full px-4 py-2 bg-[#1f2937] border border-[#1f2937] rounded text-white hover:border-[#16a34a] transition focus:outline-none focus:border-[#16a34a]"
          >
            <option value="">Select month</option>
            <option value="june">June</option>
            <option value="july">July</option>
            <option value="august">August</option>
            <option value="september">September</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="search-type"
            className="block text-sm text-[#9ca3af] mb-2"
          >
            Type
          </label>
          <select
            id="search-type"
            name="type"
            className="w-full px-4 py-2 bg-[#1f2937] border border-[#1f2937] rounded text-white hover:border-[#16a34a] transition focus:outline-none focus:border-[#16a34a]"
          >
            <option value="">Select type</option>
            <option value="trek">Trek</option>
            <option value="expedition">Expedition</option>
            <option value="tour">Tour</option>
          </select>
        </div>

        <div className="flex items-end">
          <button className="w-full px-6 py-2 bg-[#16a34a] text-white rounded hover:bg-[#15803d] transition font-semibold">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { trips, testimonials, blogPosts, destinations } =
    useLoaderData<typeof loader>();
  const featuredTrips = trips.slice(0, 3);
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSlider />
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <SearchBar />
      </div>

      {/* Featured Trips */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <SectionTitle
          title="Featured Hiking & Travel Packages"
          subtitle="Discover Gilgit Baltistan"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTrips.map((trip) => (
            <TripCard
              key={trip.slug}
              slug={trip.slug}
              title={trip.title}
              category={trip.category}
              region={trip.region}
              duration={trip.duration}
              difficulty={trip.difficulty}
              image={trip.heroImage}
              highlights={trip.highlights}
              href={`/trips/${trip.slug}`}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/trips"
            className="inline-block px-8 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-semibold"
          >
            View All Trips
          </a>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <SectionTitle
          title="Explore Our Destinations"
          subtitle="Choose from our most popular regions"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              image={dest.image}
              name={dest.name}
              tripCount={dest.tripCount}
              href={`/tours?region=${dest.id}`}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <SectionTitle
          title="What Our Adventurers Say"
          subtitle="Real experiences from real trekkers"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#111827] rounded-lg border border-[#1f2937] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <p className="font-semibold text-[#f9fafb]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#9ca3af]">
                    {testimonial.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating
                        ? "text-[#d97706]"
                        : "text-[#1f2937]"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-[#9ca3af] text-sm mb-3 italic">
                "{testimonial.review}"
              </p>
              <p className="text-xs text-[#16a34a] font-medium">
                {testimonial.tripName}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Blog */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <SectionTitle title="Latest from Our Blog" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-[#111827] rounded-lg border border-[#1f2937] overflow-hidden hover:border-[#16a34a] transition"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#16a34a] font-medium mb-2">
                  {post.date}
                </p>
                <h3 className="font-semibold text-[#f9fafb] mb-2 line-clamp-2 group-hover:text-[#16a34a] transition">
                  {post.title}
                </h3>
                <p className="text-sm text-[#9ca3af] line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#111827] border-y border-[#1f2937] mb-16">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore Gilgit Baltistan?
          </h2>
          <p className="text-lg text-[#9ca3af] mb-8 max-w-2xl mx-auto">
            Start your mountain adventure today. Our expert guides and
            experienced team are ready to make your trek unforgettable.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-semibold"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
}
