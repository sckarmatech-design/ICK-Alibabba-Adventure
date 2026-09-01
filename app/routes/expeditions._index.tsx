import { useLoaderData, Link, useSearchParams } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { TripCard } from "~/components/TripCard";
import { SectionTitle } from "~/components/SectionTitle";
import { Breadcrumb } from "~/components/Breadcrumb";
import prisma from "~/lib/prisma.server";
import { mapExpeditionFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";
import { parseAltitude } from "~/lib/filters";

const ALTITUDE_RANGES = [
  { label: "5,500–6,000m", value: "5500-6000", min: 5500, max: 6000 },
  { label: "6,000–6,500m", value: "6000-6500", min: 6000, max: 6500 },
  { label: "6,500–7,000m", value: "6500-7000", min: 6500, max: 7000 },
  { label: "7,000–7,500m", value: "7000-7500", min: 7000, max: 7500 },
  { label: "7,500–8,000m", value: "7500-8000", min: 7500, max: 8000 },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const altitudeParam = url.searchParams.get("altitude") || "";

  const range = ALTITUDE_RANGES.find((r) => r.value === altitudeParam);

  const allExpeditions = await prisma.expedition.findMany({
    orderBy: { title: "asc" },
  });

  const expeditions = allExpeditions.map(mapExpeditionFromPrisma).filter((expedition) => {
    if (!range) return true;
    const altitude = parseAltitude(expedition.altitude);
    if (altitude === null) return false;
    return altitude >= range.min && altitude <= range.max;
  });

  return { expeditions, altitudeParam };
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Mountain Expeditions | Akhtar Abbasi Hiking",
    description:
      "Expert-guided expeditions to the world's highest peaks in the Karakoram. Nanga Parbat, Rakaposhi, and more.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=630&fit=crop",
    url: `${SITE_CONFIG.url}/expeditions`,
  }),
  {
    name: "keywords",
    content:
      "mountain expeditions, peak climbing, K2, Nanga Parbat, Rakaposhi, Gilgit Baltistan",
  },
];

export default function ExpeditionsIndex() {
  const { expeditions, altitudeParam } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const hasFilter = searchParams.has("altitude");

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="font-semibold text-ink">Filter by Altitude</h3>
          {hasFilter && (
            <Link
              to="/expeditions"
              className="text-sm text-accent hover:underline font-medium"
            >
              Clear filter
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ALTITUDE_RANGES.map((range) => {
            const isActive = altitudeParam === range.value;
            return (
              <Link
                key={range.value}
                to={`?altitude=${range.value}`}
                className={`px-4 py-2 border rounded text-sm font-medium transition text-center ${
                  isActive
                    ? "bg-accent border-accent text-white"
                    : "bg-surface border-border text-muted hover:bg-accent hover:border-accent hover:text-white"
                }`}
              >
                {range.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {hasFilter && (
        <p className="text-sm text-muted mb-4">
          {expeditions.length} result{expeditions.length === 1 ? "" : "s"} found
        </p>
      )}

      {/* Expeditions Grid */}
      {expeditions.length > 0 ? (
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
              price={expedition.price}
              currency={expedition.currency}
              href={`/expeditions/${expedition.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted">
            No expeditions found matching your criteria.
          </p>
          <Link
            to="/expeditions"
            className="inline-block mt-4 text-accent hover:underline font-medium"
          >
            Clear filter
          </Link>
        </div>
      )}
    </div>
  );
}
