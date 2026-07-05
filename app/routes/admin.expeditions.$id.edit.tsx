import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getArray, parseJsonField } from "~/lib/admin";
import { ItineraryEditor, FaqEditor } from "~/components/admin-form-editors";
import type { ItineraryDay, FaqItem } from "~/components/admin-form-editors";

const DIFFICULTY_OPTIONS = [
  "EASY",
  "MODERATE",
  "CHALLENGING",
  "EXPERT",
] as const;

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const expedition = await prisma.expedition.findUnique({
    where: { id: params.id },
  });
  if (!expedition) throw new Response("Not Found", { status: 404 });
  return expedition;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    await prisma.expedition.delete({ where: { id: params.id } });
    return redirect("/admin/expeditions");
  }

  await prisma.expedition.update({
    where: { id: params.id },
    data: {
      title: getString(formData, "title"),
      region: getString(formData, "region"),
      duration: getString(formData, "duration"),
      altitude: getString(formData, "altitude"),
      difficulty: getString(formData, "difficulty") as
        | "EASY"
        | "MODERATE"
        | "CHALLENGING"
        | "EXPERT",
      bestSeason: getString(formData, "bestSeason"),
      heroImage: getString(formData, "heroImage"),
      overview: getString(formData, "overview"),
      technicalRating: getString(formData, "technicalRating"),
      highlights: getArray(formData, "highlights"),
      gallery: getArray(formData, "gallery"),
      gear: getArray(formData, "gear"),
      itinerary: parseJsonField<
        Array<{ day: number; title: string; description: string }>
      >(getString(formData, "itinerary"), []),
      faqs: parseJsonField<Array<{ question: string; answer: string }>>(
        getString(formData, "faqs"),
        [],
      ),
    },
  });

  return redirect("/admin/expeditions");
}

export default function AdminEditExpedition() {
  const expedition = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Expedition</h1>
        <Link
          to="/admin/expeditions"
          className="text-gray-400 hover:text-white transition"
        >
          Cancel
        </Link>
      </div>

      <Form method="post" className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={expedition.title}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Region
            </label>
            <input
              id="region"
              name="region"
              type="text"
              required
              defaultValue={expedition.region}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Duration
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              required
              defaultValue={expedition.duration}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="altitude"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Altitude
            </label>
            <input
              id="altitude"
              name="altitude"
              type="text"
              required
              defaultValue={expedition.altitude}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              defaultValue={expedition.difficulty}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="bestSeason"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Best Season
            </label>
            <input
              id="bestSeason"
              name="bestSeason"
              type="text"
              required
              defaultValue={expedition.bestSeason}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="heroImage"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Hero Image URL
            </label>
            <input
              id="heroImage"
              name="heroImage"
              type="url"
              required
              defaultValue={expedition.heroImage}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="technicalRating"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Technical Rating
            </label>
            <input
              id="technicalRating"
              name="technicalRating"
              type="text"
              required
              defaultValue={expedition.technicalRating}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="overview"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Overview
          </label>
          <textarea
            id="overview"
            name="overview"
            rows={5}
            required
            defaultValue={expedition.overview}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="highlights"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Highlights
              <span className="text-gray-600 text-xs block font-normal">
                One per line
              </span>
            </label>
            <textarea
              id="highlights"
              name="highlights"
              rows={6}
              defaultValue={expedition.highlights.join("\n")}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="gallery"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Gallery
              <span className="text-gray-600 text-xs block font-normal">
                One image URL per line
              </span>
            </label>
            <textarea
              id="gallery"
              name="gallery"
              rows={6}
              defaultValue={expedition.gallery.join("\n")}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="gear"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Gear
              <span className="text-gray-600 text-xs block font-normal">
                One item per line
              </span>
            </label>
            <textarea
              id="gear"
              name="gear"
              rows={6}
              defaultValue={expedition.gear.join("\n")}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Itinerary
          </label>
          <ItineraryEditor
            name="itinerary"
            defaultValue={
              (expedition.itinerary ?? []) as unknown as ItineraryDay[]
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            FAQs
          </label>
          <FaqEditor
            name="faqs"
            defaultValue={(expedition.faqs ?? []) as unknown as FaqItem[]}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Save Changes
            </button>
            <Link
              to="/admin/expeditions"
              className="px-6 py-2 text-gray-400 hover:text-white transition"
            >
              Cancel
            </Link>
          </div>
          <button
            type="submit"
            name="_action"
            value="delete"
            className="px-6 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition font-semibold"
            onClick={(e) => {
              if (
                !confirm("Are you sure you want to delete this expedition?")
              ) {
                e.preventDefault();
              }
            }}
          >
            Delete
          </button>
        </div>
      </Form>
    </div>
  );
}
