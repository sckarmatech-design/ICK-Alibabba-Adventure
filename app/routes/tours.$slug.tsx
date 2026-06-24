import { useState } from "react";
import { useLoaderData, LoaderFunctionArgs } from "react-router";
import type { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { Lightbox } from "~/components/Lightbox";
import { DetailSidebar } from "~/components/DetailSidebar";
import { HeroSection } from "~/components/HeroSection";
import { tours } from "~/data/tours";

export async function loader({ params }: LoaderFunctionArgs) {
  const tour = tours.find((t) => t.slug === params.slug);
  if (!tour) throw new Response("Not Found", { status: 404 });
  return tour;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.title} | Akhtar Abbasi Hiking` },
  {
    name: "description",
    content: data?.overview.substring(0, 160),
  },
];

export default function TourDetail() {
  const tour = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState<"overview" | "itinerary" | "highlights">(
    "overview"
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
            <div className="flex gap-2 mb-8 overflow-x-auto border-b border-[#1f2937]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-3 font-semibold whitespace-nowrap border-b-2 transition ${
                    selectedTab === tab.id
                      ? "border-[#16a34a] text-[#16a34a]"
                      : "border-transparent text-[#9ca3af] hover:text-[#f9fafb]"
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
                  <h3 className="text-2xl font-bold text-white mb-4">About This Tour</h3>
                  <p className="text-[#9ca3af] leading-relaxed">{tour.overview}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-[#111827] p-4 rounded-lg border border-[#1f2937]">
                    <p className="text-sm text-[#9ca3af] mb-1">Duration</p>
                    <p className="text-lg font-semibold text-[#f9fafb]">
                      {tour.duration}
                    </p>
                  </div>
                  {tour.accommodation && (
                    <div className="bg-[#111827] p-4 rounded-lg border border-[#1f2937]">
                      <p className="text-sm text-[#9ca3af] mb-1">Accommodation</p>
                      <p className="text-sm text-[#f9fafb]">{tour.accommodation}</p>
                    </div>
                  )}
                  {tour.mealPlan && (
                    <div className="bg-[#111827] p-4 rounded-lg border border-[#1f2937]">
                      <p className="text-sm text-[#9ca3af] mb-1">Meals</p>
                      <p className="text-sm text-[#f9fafb]">{tour.mealPlan}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "itinerary" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Day-by-Day Itinerary
                </h3>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="bg-[#111827] p-4 rounded-lg border border-[#1f2937]"
                    >
                      <h4 className="font-semibold text-white mb-2">
                        Day {day.day}: {day.title}
                      </h4>
                      <p className="text-[#9ca3af]">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "highlights" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {tour.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[#9ca3af]"
                    >
                      <span className="text-[#16a34a] font-bold mt-1">✓</span>
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
