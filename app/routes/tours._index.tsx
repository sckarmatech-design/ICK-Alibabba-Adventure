import { useLoaderData, Link, useSearchParams } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { TripCard } from "~/components/TripCard";
import { SectionTitle } from "~/components/SectionTitle";
import { Breadcrumb } from "~/components/Breadcrumb";
import prisma from "~/lib/prisma.server";
import { mapTourFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

const REGIONS = [
  { label: "All Tours", value: "" },
  { label: "Skardu", value: "skardu" },
  { label: "Hunza", value: "hunza" },
  { label: "Gilgit", value: "gilgit" },
  { label: "Khaplu", value: "khaplu" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const regionParam = url.searchParams.get("region") || "";

  const allTours = await prisma.tour.findMany({
    orderBy: { title: "asc" },
  });

  const tours = allTours.map(mapTourFromPrisma).filter((tour) => {
    if (!regionParam) return true;
    const term = regionParam.toLowerCase();
    const searchable = `${tour.title} ${tour.region} ${tour.overview}`.toLowerCase();
    return searchable.includes(term);
  });

  return { tours, regionParam };
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Gilgit Baltistan Tours | Akhtar Abbasi Hiking",
    description:
      "Explore cultural and scenic tours across Gilgit Baltistan. Skardu, Hunza, Gilgit, and more destinations.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    url: `${SITE_CONFIG.url}/tours`,
  }),
  {
    name: "keywords",
    content:
      "tours, cultural tours, Skardu, Hunza, Gilgit, Gilgit Baltistan travel",
  },
];

export default function ToursIndex() {
  const { tours, regionParam } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const hasFilter = searchParams.has("region");

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="font-semibold text-ink">Filter by Region</h3>
          {hasFilter && (
            <Link
              to="/tours"
              className="text-sm text-accent hover:underline font-medium"
            >
              Clear filter
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {REGIONS.map((region) => {
            const isActive = regionParam === region.value;
            const to = region.value ? `?region=${region.value}` : "/tours";
            return (
              <Link
                key={region.value || "all"}
                to={to}
                className={`px-4 py-2 border rounded text-sm font-medium transition text-center ${
                  isActive
                    ? "bg-accent border-accent text-white"
                    : "bg-surface border-border text-muted hover:bg-accent hover:border-accent hover:text-white"
                }`}
              >
                {region.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {hasFilter && (
        <p className="text-sm text-muted mb-4">
          {tours.length} result{tours.length === 1 ? "" : "s"} found
        </p>
      )}

      {/* Tours Grid */}
      {tours.length > 0 ? (
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
              price={tour.price}
              currency={tour.currency}
              href={`/tours/${tour.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted">
            No tours found matching your criteria.
          </p>
          <Link
            to="/tours"
            className="inline-block mt-4 text-accent hover:underline font-medium"
          >
            Clear filter
          </Link>
        </div>
      )}
    </div>
  );
}
