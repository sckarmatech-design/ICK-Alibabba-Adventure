import { useState } from "react";
import { useLoaderData, LoaderFunctionArgs } from "react-router";
import type { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { Accordion } from "~/components/Accordion";
import { Lightbox } from "~/components/Lightbox";
import { DetailSidebar } from "~/components/DetailSidebar";
import { HeroSection } from "~/components/HeroSection";
import { expeditions } from "~/data/expeditions";

export async function loader({ params }: LoaderFunctionArgs) {
  const expedition = expeditions.find((e) => e.slug === params.slug);
  if (!expedition) throw new Response("Not Found", { status: 404 });
  return expedition;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${data?.title} | Akhtar Abbasi Hiking` },
  {
    name: "description",
    content: data?.overview.substring(0, 160),
  },
];

export default function ExpeditionDetail() {
  const expedition = useLoaderData<typeof loader>();
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

  const accordionItems = expedition.itinerary.map((day) => ({
    id: `day-${day.day}`,
    title: `Day ${day.day}: ${day.title}`,
    content: day.description,
  }));

  const faqItems = (expedition.faqs || []).map((faq) => ({
    id: faq.question,
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={expedition.title}
        subtitle={`${expedition.altitude} • ${expedition.duration} • ${expedition.difficulty}`}
        image={expedition.heroImage}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Expeditions", href: "/expeditions" },
            { label: expedition.title },
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
                  <h3 className="text-2xl font-bold text-white mb-4">
                    About This Expedition
                  </h3>
                  <p className="text-[#9ca3af] leading-relaxed">
                    {expedition.overview}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-[#111827] p-4 rounded-lg border border-[#1f2937]">
                    <p className="text-sm text-[#9ca3af] mb-1">Altitude</p>
                    <p className="text-lg font-semibold text-[#f9fafb]">
                      {expedition.altitude}
                    </p>
                  </div>
                  <div className="bg-[#111827] p-4 rounded-lg border border-[#1f2937]">
                    <p className="text-sm text-[#9ca3af] mb-1">Duration</p>
                    <p className="text-lg font-semibold text-[#f9fafb]">
                      {expedition.duration}
                    </p>
                  </div>
                  <div className="bg-[#111827] p-4 rounded-lg border border-[#1f2937]">
                    <p className="text-sm text-[#9ca3af] mb-1">Technical Rating</p>
                    <p className="text-lg font-semibold text-[#d97706]">
                      {expedition.technicalRating}
                    </p>
                  </div>
                </div>

                {expedition.gear && expedition.gear.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Required Gear
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {expedition.gear.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-[#9ca3af]">
                          <span className="w-2 h-2 bg-[#16a34a] rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "itinerary" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Day-by-Day Itinerary
                </h3>
                <Accordion items={accordionItems} defaultOpen="day-1" />
              </div>
            )}

            {selectedTab === "highlights" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {expedition.highlights.map((highlight, index) => (
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

            {selectedTab === "gallery" && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {expedition.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                      className="relative overflow-hidden rounded-lg h-48 bg-[#111827] hover:opacity-75 transition"
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
                <h3 className="text-2xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h3>
                {faqItems.length > 0 ? (
                  <Accordion items={faqItems} />
                ) : (
                  <p className="text-[#9ca3af]">
                    No FAQs available. Contact us for more information.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <DetailSidebar
              altitude={expedition.altitude}
              duration={expedition.duration}
              difficulty={expedition.difficulty}
              ctaText="Request Expedition Quote"
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
          images={expedition.gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
