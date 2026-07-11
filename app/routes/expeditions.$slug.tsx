import { useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { Accordion } from "~/components/Accordion";
import { Lightbox } from "~/components/Lightbox";
import { DetailSidebar } from "~/components/DetailSidebar";
import { HeroSection } from "~/components/HeroSection";
import prisma from "~/lib/prisma.server";
import { mapExpeditionFromPrisma } from "~/lib/mappers";
import type { Expedition } from "~/data/expeditions";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const expedition = await prisma.expedition.findUnique({
    where: { slug: params.slug },
  });
  if (!expedition) throw new Response("Not Found", { status: 404 });
  return mapExpeditionFromPrisma(expedition);
}

export const meta: MetaFunction = ({ loaderData }) => {
  const expedition = loaderData as Expedition | undefined;
  if (!expedition) return [];
  return [
    ...generateMetaTags({
      title: `${expedition.title} | Akhtar Abbasi Hiking`,
      description: expedition.overview.substring(0, 160),
      image:
        expedition.heroImage ||
        "https://akhtarabbasi-hiking.com/images/og/expeditions.webp",
      url: `${SITE_CONFIG.url}/expeditions/${expedition.slug}`,
    }),
    {
      name: "keywords",
      content: `${expedition.title}, expedition, peak climbing, ${expedition.altitude}m, Gilgit Baltistan`,
    },
  ];
};

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
                    About This Expedition
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {expedition.overview}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted mb-1">Altitude</p>
                    <p className="text-lg font-semibold text-ink">
                      {expedition.altitude}
                    </p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted mb-1">Duration</p>
                    <p className="text-lg font-semibold text-ink">
                      {expedition.duration}
                    </p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted mb-1">Technical Rating</p>
                    <p className="text-lg font-semibold text-secondary">
                      {expedition.technicalRating}
                    </p>
                  </div>
                </div>

                {expedition.gear && expedition.gear.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-ink mb-3">
                      Required Gear
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {expedition.gear.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-muted"
                        >
                          <span className="w-2 h-2 bg-accent rounded-full"></span>
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
                  {expedition.highlights.map((highlight, index) => (
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
                  {expedition.gallery
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
              price={expedition.price}
              currency={expedition.currency}
              depositAmount={expedition.depositAmount}
              priceIncludes={expedition.priceIncludes}
              priceExcludes={expedition.priceExcludes}
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
          images={expedition.gallery.filter((image) => Boolean(image))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
