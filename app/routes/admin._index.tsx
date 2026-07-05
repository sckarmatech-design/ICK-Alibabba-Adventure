import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const [
    trips,
    expeditions,
    tours,
    blogPosts,
    testimonials,
    teamMembers,
    faqs,
    destinations,
    galleryImages,
    galleryVideos,
  ] = await Promise.all([
    prisma.trip.count(),
    prisma.expedition.count(),
    prisma.tour.count(),
    prisma.blogPost.count(),
    prisma.testimonial.count(),
    prisma.teamMember.count(),
    prisma.fAQ.count(),
    prisma.destination.count(),
    prisma.galleryImage.count(),
    prisma.galleryVideo.count(),
  ]);
  return {
    trips,
    expeditions,
    tours,
    blogPosts,
    testimonials,
    teamMembers,
    faqs,
    destinations,
    galleryImages,
    galleryVideos,
  };
}

const statCards = [
  { label: "Trips", countKey: "trips", href: "/admin/trips" },
  { label: "Expeditions", countKey: "expeditions", href: "/admin/expeditions" },
  { label: "Tours", countKey: "tours", href: "/admin/tours" },
  { label: "Blog Posts", countKey: "blogPosts", href: "/admin/blog" },
  { label: "Testimonials", countKey: "testimonials", href: "/admin/testimonials" },
  { label: "Team Members", countKey: "teamMembers", href: "/admin/team" },
  { label: "FAQs", countKey: "faqs", href: "/admin/faqs" },
  { label: "Destinations", countKey: "destinations", href: "/admin/destinations" },
  { label: "Gallery Images", countKey: "galleryImages", href: "/admin/gallery" },
  { label: "Gallery Videos", countKey: "galleryVideos", href: "/admin/gallery" },
] as const;

export default function AdminDashboard() {
  const counts = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, countKey, href }) => (
          <Link
            key={countKey}
            to={href}
            className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-500 transition"
          >
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-3xl font-bold text-white">
              {counts[countKey]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
