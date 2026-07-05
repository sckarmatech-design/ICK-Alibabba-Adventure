import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import {
  getString,
  getOptionalString,
  getArray,
  parseJsonField,
} from "~/lib/admin";
import { ItineraryEditor } from "~/components/admin-form-editors";
import type { ItineraryDay } from "~/components/admin-form-editors";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
  });
  if (!tour) throw new Response("Not Found", { status: 404 });
  return tour;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    await prisma.tour.delete({ where: { id: params.id } });
    return redirect("/admin/tours");
  }

  await prisma.tour.update({
    where: { id: params.id },
    data: {
      title: getString(formData, "title"),
      region: getString(formData, "region"),
      duration: getString(formData, "duration"),
      difficulty: getString(formData, "difficulty") as
        | "EASY"
        | "MODERATE"
        | "CHALLENGING"
        | "EXPERT",
      bestSeason: getString(formData, "bestSeason"),
      heroImage: getString(formData, "heroImage"),
      overview: getString(formData, "overview"),
      accommodation: getOptionalString(formData, "accommodation"),
      mealPlan: getOptionalString(formData, "mealPlan"),
      transport: getOptionalString(formData, "transport"),
      highlights: getArray(formData, "highlights"),
      gallery: getArray(formData, "gallery"),
      itinerary: parseJsonField(getString(formData, "itinerary"), []),
    },
  });

  return redirect("/admin/tours");
}

export default function AdminEditTour() {
  const tour = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Tour</h1>
        <Link
          to="/admin/tours"
          className="text-gray-400 hover:text-white transition"
        >
          Cancel
        </Link>
      </div>

      <Form
        method="post"
        className="space-y-6 max-w-4xl bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={tour.title}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Region
            </label>
            <input
              id="region"
              name="region"
              type="text"
              required
              defaultValue={tour.region}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Duration
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              required
              defaultValue={tour.duration}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              defaultValue={tour.difficulty}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
            >
              <option value="EASY">Easy</option>
              <option value="MODERATE">Moderate</option>
              <option value="CHALLENGING">Challenging</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="bestSeason"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Best Season
            </label>
            <input
              id="bestSeason"
              name="bestSeason"
              type="text"
              required
              defaultValue={tour.bestSeason}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="heroImage"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Hero Image URL
            </label>
            <input
              id="heroImage"
              name="heroImage"
              type="url"
              required
              defaultValue={tour.heroImage}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="overview"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Overview
            </label>
            <textarea
              id="overview"
              name="overview"
              rows={5}
              required
              defaultValue={tour.overview}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="accommodation"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Accommodation
            </label>
            <input
              id="accommodation"
              name="accommodation"
              type="text"
              defaultValue={tour.accommodation ?? ""}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="mealPlan"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Meal Plan
            </label>
            <input
              id="mealPlan"
              name="mealPlan"
              type="text"
              defaultValue={tour.mealPlan ?? ""}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="transport"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Transport
            </label>
            <input
              id="transport"
              name="transport"
              type="text"
              defaultValue={tour.transport ?? ""}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="highlights"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Highlights (one per line)
            </label>
            <textarea
              id="highlights"
              name="highlights"
              rows={4}
              defaultValue={tour.highlights.join("\n")}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="gallery"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Gallery URLs (one per line)
            </label>
            <textarea
              id="gallery"
              name="gallery"
              rows={4}
              defaultValue={tour.gallery.join("\n")}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Itinerary
            </label>
            <ItineraryEditor
              name="itinerary"
              defaultValue={tour.itinerary as unknown as ItineraryDay[]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              Save Changes
            </button>
            <Link
              to="/admin/tours"
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </Link>
          </div>

          <button
            type="submit"
            name="_action"
            value="delete"
            onClick={(event) => {
              if (!confirm("Delete this tour?")) {
                event.preventDefault();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Delete
          </button>
        </div>
      </Form>
    </div>
  );
}
