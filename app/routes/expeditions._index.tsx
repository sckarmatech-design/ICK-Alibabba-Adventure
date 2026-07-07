import { useLoaderData } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { TripCard } from "~/components/TripCard";
import { SectionTitle } from "~/components/SectionTitle";
import { Breadcrumb } from "~/components/Breadcrumb";
import prisma from "~/lib/prisma.server";
import { mapExpeditionFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader(_args: LoaderFunctionArgs) {
  const expeditions = await prisma.expedition.findMany({
    orderBy: { title: "asc" },
  });
  return expeditions.map(mapExpeditionFromPrisma);
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Mountain Expeditions | Akhtar Abbasi Hiking",
    description:
      "Expert-guided expeditions to the world's highest peaks in the Karakoram. Nanga Parbat, Rakaposhi, and more.",
    image: "https://akhtarabbasi-hiking.com/images/og/expeditions.webp",
    url: `${SITE_CONFIG.url}/expeditions`,
  }),
  {
    name: "keywords",
    content:
      "mountain expeditions, peak climbing, K2, Nanga Parbat, Rakaposhi, Gilgit Baltistan",
  },
];

export default function ExpeditionsIndex() {
  const expeditions = useLoaderData<typeof loader>();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Expeditions" }]}
      />

      <div className="mt-8 mb-12">
        <SectionTitle
          title="Elite Mountain Expeditions"
          subtitle="Conquer the world's most iconic peaks"
          centered={true}
        />
      </div>

      {/* Filter Section */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-ink mb-4">Filter by Altitude</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "5,500–6,000m", value: "5500-6000" },
            { label: "6,000–6,500m", value: "6000-6500" },
            { label: "6,500–7,000m", value: "6500-7000" },
            { label: "7,000–7,500m", value: "7000-7500" },
            { label: "7,500–8,000m", value: "7500-8000" },
          ].map((range) => (
            <button
              key={range.value}
              className="px-4 py-2 bg-surface border border-border rounded text-muted hover:bg-accent hover:border-accent hover:text-white transition text-sm font-medium"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expeditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expeditions.map((expedition) => (
          <TripCard
            key={expedition.slug}
            slug={expedition.slug}
            title={expedition.title}
            category={expedition.difficulty}
            region={expedition.region}
            duration={expedition.duration}
            difficulty={expedition.difficulty}
            image={expedition.heroImage}
            highlights={expedition.highlights}
            href={`/expeditions/${expedition.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
