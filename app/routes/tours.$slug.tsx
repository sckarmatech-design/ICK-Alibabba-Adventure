import { useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { DetailSidebar } from "~/components/DetailSidebar";
import { HeroSection } from "~/components/HeroSection";
import prisma from "~/lib/prisma.server";
import { mapTourFromPrisma } from "~/lib/mappers";
import type { Tour } from "~/data/tours";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const tour = await prisma.tour.findUnique({
    where: { slug: params.slug },
  });
  if (!tour) throw new Response("Not Found", { status: 404 });
  return mapTourFromPrisma(tour);
}

export const meta: MetaFunction = ({ loaderData }) => {
  const tour = loaderData as Tour | undefined;
  if (!tour) return [];
  return [
    ...generateMetaTags({
      title: `${tour.title} | Akhtar Abbasi Hiking`,
      description: tour.overview.substring(0, 160),
      image:
        tour.heroImage ||
        "https://akhtarabbasi-hiking.com/images/og/tours.webp",
      url: `${SITE_CONFIG.url}/tours/${tour.slug}`,
    }),
    {
      name: "keywords",
      content: `${tour.title}, tour, ${tour.region}, Gilgit Baltistan travel guide`,
    },
  ];
};

export default function TourDetail() {
  const tour = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "itinerary" | "highlights"
  >("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "highlights", label: "Highlights" },
  ] as const;

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={tour.title}
        subtitle={`${tour.duration} • ${tour.region}`}
        image={tour.heroImage}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tours", href: "/tours" },
            { label: tour.title },
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
                    About This Tour
                  </h3>
                  <p className="text-muted leading-relaxed">{tour.overview}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted mb-1">Duration</p>
                    <p className="text-lg font-semibold text-ink">
                      {tour.duration}
                    </p>
                  </div>
                  {tour.accommodation && (
                    <div className="bg-surface p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted mb-1">Accommodation</p>
                      <p className="text-sm text-ink">{tour.accommodation}</p>
                    </div>
                  )}
                  {tour.mealPlan && (
                    <div className="bg-surface p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted mb-1">Meals</p>
                      <p className="text-sm text-ink">{tour.mealPlan}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "itinerary" && (
              <div>
                <h3 className="text-2xl font-bold text-ink mb-4">
                  Day-by-Day Itinerary
                </h3>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="bg-surface p-4 rounded-lg border border-border"
                    >
                      <h4 className="font-semibold text-ink mb-2">
                        Day {day.day}: {day.title}
                      </h4>
                      <p className="text-muted">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "highlights" && (
              <div>
                <h3 className="text-2xl font-bold text-ink mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {tour.highlights.map((highlight, index) => (
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
          </div>

          {/* Sidebar */}
          <div>
            <DetailSidebar
              duration={tour.duration}
              difficulty={tour.difficulty}
              ctaText="Book This Tour"
              onCTA={() => {
                window.location.href = "/contact";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
