import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Filter } from "lucide-react";
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
  const [trips, testimonials, blogPosts, destinations, slides] =
    await Promise.all([
      prisma.trip.findMany({ orderBy: { title: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.blogPost.findMany({ orderBy: { date: "desc" }, take: 3 }),
      prisma.destination.findMany({ orderBy: { name: "asc" } }),
      prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  return {
    trips: trips.map(mapTripFromPrisma),
    testimonials: testimonials.map(mapTestimonialFromPrisma),
    blogPosts: blogPosts.map(mapBlogPostFromPrisma),
    destinations: destinations.map(mapDestinationFromPrisma),
    heroSlides: slides.map((s) => ({
      image: s.image,
      headline: s.title,
      subheadline: s.subtitle,
      cta: s.cta,
      href: s.ctaLink,
    })),
  };
}

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

type HeroSlide = {
  image: string;
  headline: string;
  subheadline: string;
  cta: string;
  href: string;
};

// Hero Slider Component
function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Respect OS-level reduced-motion preference.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-advance every 5 seconds; pause on hover/focus and resume after.
  // Manual navigation resets the timer because currentSlide is a dependency.
  useEffect(() => {
    if (slides.length <= 1 || isPaused || prefersReducedMotion) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused, prefersReducedMotion, slides.length, nextSlide]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full min-h-[60vh] md:h-screen overflow-hidden rounded-lg mb-8 md:mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
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
          {/* Dark image overlay — not a theme color */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 pb-16 sm:pb-20 md:pb-24">
            <div
              className={`w-full max-w-2xl px-8 sm:px-10 md:px-12 transform transition-all duration-500 ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* text-white on dark image overlay stays */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {slide.headline}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                {slide.subheadline}
              </p>
              <a
                href={slide.href}
                className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-semibold"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons — light overlays on image stay */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="sm:hidden" />
        <ChevronLeft size={32} className="hidden sm:block" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="sm:hidden" />
        <ChevronRight size={32} className="hidden sm:block" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentSlide ? "bg-accent" : "bg-white/50"
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
    <div className="bg-surface border border-border rounded-lg p-6 mb-12">
      <h3 className="text-xl font-semibold text-ink mb-6 flex items-center gap-2">
        <Filter size={20} className="text-accent" />
        Find Your Adventure
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="search-destination"
            className="block text-sm text-muted mb-2"
          >
            Destination
          </label>
          <select
            id="search-destination"
            name="destination"
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-accent transition"
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
            className="block text-sm text-muted mb-2"
          >
            Month
          </label>
          <select
            id="search-month"
            name="month"
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-accent transition"
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
            className="block text-sm text-muted mb-2"
          >
            Type
          </label>
          <select
            id="search-type"
            name="type"
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-accent transition"
          >
            <option value="">Select type</option>
            <option value="trek">Trek</option>
            <option value="expedition">Expedition</option>
            <option value="tour">Tour</option>
          </select>
        </div>

        <div className="flex items-end">
          {/* CTA — fixed brand green */}
          <button className="w-full px-6 py-2 bg-cta text-white rounded hover:bg-cta-hover transition font-semibold">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { trips, testimonials, blogPosts, destinations, heroSlides } =
    useLoaderData<typeof loader>();
  const featuredTrips = trips.slice(0, 3);
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <HeroSlider slides={heroSlides} />
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
          {/* CTA — fixed brand green */}
          <a
            href="/trips"
            className="inline-block px-8 py-3 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-semibold"
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
              className="bg-surface rounded-lg border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <p className="font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-sm text-muted">{testimonial.country}</p>
                </div>
              </div>
              {/* Star ratings — secondary (amber) on Midnight/Golden Hour, with border-color empty stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating ? "text-secondary" : "text-border"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-muted text-sm mb-3 italic">
                "{testimonial.review}"
              </p>
              <p className="text-xs text-accent font-medium">
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
              className="group bg-surface rounded-lg border border-border overflow-hidden hover:border-accent transition"
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
                <p className="text-xs text-accent font-medium mb-2">
                  {post.date}
                </p>
                <h3 className="font-semibold text-ink mb-2 line-clamp-2 group-hover:text-accent transition">
                  {post.title}
                </h3>
                <p className="text-sm text-muted line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-surface border-y border-border mb-16">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            Ready to Explore Gilgit Baltistan?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Start your mountain adventure today. Our expert guides and
            experienced team are ready to make your trek unforgettable.
          </p>
          {/* CTA — fixed brand green */}
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-semibold"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
}
