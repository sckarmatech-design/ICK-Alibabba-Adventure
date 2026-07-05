import { useLoaderData } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { TripCard } from "~/components/TripCard";
import { SectionTitle } from "~/components/SectionTitle";
import { Breadcrumb } from "~/components/Breadcrumb";
import prisma from "~/lib/prisma.server";
import { mapTripFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader(_args: LoaderFunctionArgs) {
  const trips = await prisma.trip.findMany({
    orderBy: { title: "asc" },
  });
  return trips.map(mapTripFromPrisma);
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Hiking Trips | Akhtar Abbasi Hiking",
    description:
      "Explore our collection of carefully curated hiking trips across Gilgit Baltistan. From short day hikes to challenging multi-day treks.",
    image: "https://akhtarabbasi-hiking.com/images/og/trips.webp",
    url: `${SITE_CONFIG.url}/trips`,
  }),
  {
    name: "keywords",
    content:
      "hiking trips, trekking, Gilgit Baltistan, day hikes, multi-day treks",
  },
];

export default function TripsIndex() {
  const trips = useLoaderData<typeof loader>();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Trips" }]} />

      <div className="mt-8 mb-12">
        <SectionTitle
          title="Hiking Trips & Treks"
          subtitle="Explore our collection of carefully curated adventures"
          centered={true}
        />
      </div>

      {/* Filter Section */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-white mb-4">Filter Trips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="filter-region"
              className="block text-sm text-[#9ca3af] mb-2"
            >
              Region
            </label>
            <select
              id="filter-region"
              name="filter-region"
              className="w-full px-4 py-2 bg-[#1f2937] border border-[#1f2937] rounded text-white hover:border-[#16a34a] transition focus:outline-none focus:border-[#16a34a]"
            >
              <option value="">All Regions</option>
              <option value="karakoram">The Karakoram</option>
              <option value="nanga-parbat">Nanga Parbat</option>
              <option value="hunza">Hunza</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-duration"
              className="block text-sm text-[#9ca3af] mb-2"
            >
              Duration
            </label>
            <select
              id="filter-duration"
              name="filter-duration"
              className="w-full px-4 py-2 bg-[#1f2937] border border-[#1f2937] rounded text-white hover:border-[#16a34a] transition focus:outline-none focus:border-[#16a34a]"
            >
              <option value="">All Durations</option>
              <option value="short">Short Treks</option>
              <option value="multi">Multi-Day Treks</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-difficulty"
              className="block text-sm text-[#9ca3af] mb-2"
            >
              Difficulty
            </label>
            <select
              id="filter-difficulty"
              name="filter-difficulty"
              className="w-full px-4 py-2 bg-[#1f2937] border border-[#1f2937] rounded text-white hover:border-[#16a34a] transition focus:outline-none focus:border-[#16a34a]"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
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

      {/* Empty State */}
      {trips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-[#9ca3af]">
            No trips found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
