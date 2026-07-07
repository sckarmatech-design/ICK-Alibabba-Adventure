import { useLoaderData } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { TripCard } from "~/components/TripCard";
import { SectionTitle } from "~/components/SectionTitle";
import { Breadcrumb } from "~/components/Breadcrumb";
import prisma from "~/lib/prisma.server";
import { mapTourFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader(_args: LoaderFunctionArgs) {
  const tours = await prisma.tour.findMany({
    orderBy: { title: "asc" },
  });
  return tours.map(mapTourFromPrisma);
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Gilgit Baltistan Tours | Akhtar Abbasi Hiking",
    description:
      "Explore cultural and scenic tours across Gilgit Baltistan. Skardu, Hunza, Gilgit, and more destinations.",
    image: "https://akhtarabbasi-hiking.com/images/og/tours.webp",
    url: `${SITE_CONFIG.url}/tours`,
  }),
  {
    name: "keywords",
    content:
      "tours, cultural tours, Skardu, Hunza, Gilgit, Gilgit Baltistan travel",
  },
];

export default function ToursIndex() {
  const tours = useLoaderData<typeof loader>();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tours" }]} />

      <div className="mt-8 mb-12">
        <SectionTitle
          title="Gilgit Baltistan Tours"
          subtitle="Experience culture, adventure, and natural beauty"
          centered={true}
        />
      </div>

      {/* Filter Section */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-ink mb-4">Filter by Region</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "All Tours", value: "all" },
            { label: "Skardu", value: "skardu" },
            { label: "Hunza", value: "hunza" },
            { label: "Gilgit", value: "gilgit" },
            { label: "Khaplu", value: "khaplu" },
          ].map((region) => (
            <button
              key={region.value}
              className="px-4 py-2 bg-surface border border-border rounded text-muted hover:bg-accent hover:border-accent hover:text-white transition text-sm font-medium"
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TripCard
            key={tour.slug}
            slug={tour.slug}
            title={tour.title}
            category="Tour"
            region={tour.region}
            duration={tour.duration}
            difficulty={tour.difficulty}
            image={tour.heroImage}
            highlights={tour.highlights}
            href={`/tours/${tour.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
