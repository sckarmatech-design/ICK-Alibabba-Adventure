import { useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { Accordion } from "~/components/Accordion";
import { Lightbox } from "~/components/Lightbox";
import { DetailSidebar } from "~/components/DetailSidebar";
import { HeroSection } from "~/components/HeroSection";
import prisma from "~/lib/prisma.server";
import { mapTripFromPrisma } from "~/lib/mappers";
import type { Trip } from "~/data/trips";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const trip = await prisma.trip.findUnique({
    where: { slug: params.slug },
  });
  if (!trip) throw new Response("Not Found", { status: 404 });
  return mapTripFromPrisma(trip);
}

export const meta: MetaFunction = ({ loaderData }) => {
  const trip = loaderData as Trip | undefined;
  if (!trip) return [];
  return [
    ...generateMetaTags({
      title: `${trip.title} | Akhtar Abbasi Hiking`,
      description: trip.overview.substring(0, 160),
      image:
        trip.heroImage ||
        "https://akhtarabbasi-hiking.com/images/og/trips.webp",
      url: `${SITE_CONFIG.url}/trips/${trip.slug}`,
    }),
    {
      name: "keywords",
      content: `${trip.title}, trekking, hiking, ${trip.region}, Gilgit Baltistan`,
    },
  ];
};

export default function TripDetail() {
  const trip = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "itinerary" | "highlights" | "gallery" | "faqs"
  >("overview");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "highlights", label: "Highlights" },
    { id: "gallery", label: "Gallery" },
    { id: "faqs", label: "FAQs" },
  ] as const;

  const accordionItems = trip.itinerary.map((day) => ({
    id: `day-${day.day}`,
    title: `Day ${day.day}: ${day.title}`,
    content: day.description,
  }));

  const faqItems = trip.faqs.map((faq) => ({
    id: faq.question,
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={trip.title}
        subtitle={`${trip.duration} • ${trip.region} • ${trip.difficulty}`}
        image={trip.heroImage}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Trips", href: "/trips" },
            { label: trip.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-3 font-semibold whitespace-nowrap border-b-2 transition ${
                    selectedTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {selectedTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-ink mb-4">
                    About This Trek
                  </h3>
                  <p className="text-muted leading-relaxed">{trip.overview}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted mb-1">Duration</p>
                    <p className="text-lg font-semibold text-ink">
                      {trip.duration}
                    </p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted mb-1">Difficulty</p>
                    <p className="text-lg font-semibold text-secondary">
                      {trip.difficulty}
                    </p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted mb-1">Best Season</p>
                    <p className="text-lg font-semibold text-ink">
                      {trip.bestSeason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "itinerary" && (
              <div>
                <h3 className="text-2xl font-bold text-ink mb-4">
                  Day-by-Day Itinerary
                </h3>
                <Accordion items={accordionItems} defaultOpen="day-1" />
              </div>
            )}

            {selectedTab === "highlights" && (
              <div>
                <h3 className="text-2xl font-bold text-ink mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {trip.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted"
                    >
                      <span className="text-accent font-bold mt-1">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === "gallery" && (
              <div>
                <h3 className="text-2xl font-bold text-ink mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trip.gallery
                    .filter((image) => Boolean(image))
                    .map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLightboxIndex(index);
                          setLightboxOpen(true);
                        }}
                        className="relative overflow-hidden rounded-lg h-48 bg-surface hover:opacity-75 transition"
                      >
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition"
                          loading="lazy"
                        />
                      </button>
                    ))}
                </div>
              </div>
            )}

            {selectedTab === "faqs" && (
              <div>
                <h3 className="text-2xl font-bold text-ink mb-4">
                  Frequently Asked Questions
                </h3>
                {faqItems.length > 0 ? (
                  <Accordion items={faqItems} />
                ) : (
                  <p className="text-muted">
                    No FAQs available for this trek. Contact us for more
                    information.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <DetailSidebar
              duration={trip.duration}
              difficulty={trip.difficulty}
              groupSize={trip.groupSize}
              startPoint={trip.startPoint}
              endPoint={trip.endPoint}
              price={trip.price}
              currency={trip.currency}
              depositAmount={trip.depositAmount}
              priceIncludes={trip.priceIncludes}
              priceExcludes={trip.priceExcludes}
              ctaText="Enquire Now"
              onCTA={() => {
                window.location.href = "/contact";
              }}
            />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={trip.gallery.filter((image) => Boolean(image))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
