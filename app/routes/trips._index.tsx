import { useLoaderData, Form, useSearchParams } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { TripCard } from "~/components/TripCard";
import { SectionTitle } from "~/components/SectionTitle";
import { Breadcrumb } from "~/components/Breadcrumb";
import prisma from "~/lib/prisma.server";
import { mapTripFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const regionParam = url.searchParams.get("region") || "";
  const durationParam = url.searchParams.get("duration") || "";
  const difficultyParam = url.searchParams.get("difficulty") || "";

  const allTrips = await prisma.trip.findMany({
    orderBy: { title: "asc" },
  });

  const trips = allTrips.map(mapTripFromPrisma).filter((trip) => {
    if (regionParam) {
      const term = regionParam.toLowerCase();
      const searchable = `${trip.title} ${trip.region} ${trip.overview}`.toLowerCase();
      if (!searchable.includes(term)) return false;
    }

    if (durationParam) {
      const category = trip.category.toLowerCase();
      if (durationParam === "short") {
        if (!category.includes("short") && !category.includes("day hike")) {
          return false;
        }
      } else if (durationParam === "multi") {
        if (!category.includes("multi-day")) return false;
      }
    }

    if (difficultyParam) {
      if (trip.difficulty.toLowerCase() !== difficultyParam.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  return { trips, regionParam, durationParam, difficultyParam };
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
  const { trips, regionParam, durationParam, difficultyParam } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const hasFilters =
    searchParams.has("region") ||
    searchParams.has("duration") ||
    searchParams.has("difficulty");

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
      <Form
        method="get"
        className="bg-surface border border-border rounded-lg p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="font-semibold text-ink">Filter Trips</h3>
          {hasFilters && (
            <a
              href="/trips"
              className="text-sm text-accent hover:underline font-medium"
            >
              Clear filters
            </a>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="filter-region"
              className="block text-sm text-muted mb-2"
            >
              Region
            </label>
            <select
              id="filter-region"
              name="region"
              defaultValue={regionParam}
              className="w-full px-4 py-2 rounded focus:outline-none focus:border-accent transition"
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
              className="block text-sm text-muted mb-2"
            >
              Duration
            </label>
            <select
              id="filter-duration"
              name="duration"
              defaultValue={durationParam}
              className="w-full px-4 py-2 rounded focus:outline-none focus:border-accent transition"
            >
              <option value="">All Durations</option>
              <option value="short">Short Treks</option>
              <option value="multi">Multi-Day Treks</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-difficulty"
              className="block text-sm text-muted mb-2"
            >
              Difficulty
            </label>
            <select
              id="filter-difficulty"
              name="difficulty"
              defaultValue={difficultyParam}
              className="w-full px-4 py-2 rounded focus:outline-none focus:border-accent transition"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white rounded font-medium hover:bg-accent/90 transition"
          >
            Search
          </button>
        </div>
      </Form>

      {/* Results count */}
      {hasFilters && (
        <p className="text-sm text-muted mb-4">
          {trips.length} result{trips.length === 1 ? "" : "s"} found
        </p>
      )}

      {/* Trips Grid */}
      {trips.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted">
            No trips found matching your criteria.
          </p>
          <a
            href="/trips"
            className="inline-block mt-4 text-accent hover:underline font-medium"
          >
            Clear filters
          </a>
        </div>
      )}
    </div>
  );
}
