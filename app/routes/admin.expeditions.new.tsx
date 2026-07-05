import { useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { slugify, getString, getArray, parseJsonField } from "~/lib/admin";
import { ItineraryEditor, FaqEditor } from "~/components/admin-form-editors";
import type { ItineraryDay, FaqItem } from "~/components/admin-form-editors";
import { ImageInput, ImageListInput } from "~/components/ImageInput";

const DIFFICULTY_OPTIONS = [
  "EASY",
  "MODERATE",
  "CHALLENGING",
  "EXPERT",
] as const;

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const title = getString(formData, "title");
  const slug = slugify(title);

  await prisma.expedition.create({
    data: {
      slug,
      title,
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

export default function AdminNewExpedition() {
  useLoaderData<typeof loader>();
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">New Expedition</h1>
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
              placeholder="e.g. 14 Days"
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
              placeholder="e.g. 7,788 m"
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
              placeholder="e.g. July – September"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <ImageInput
              name="heroImage"
              label="Hero Image"
              folder="expeditions"
              required
              onLoadingChange={setUploading}
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
              placeholder="e.g. AD (Assez Difficile)"
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
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <ImageListInput
              name="gallery"
              label="Gallery Images"
              defaultValues={[]}
              folder="gallery"
              onLoadingChange={setUploading}
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
            defaultValue={[] as ItineraryDay[]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            FAQs
          </label>
          <FaqEditor name="faqs" defaultValue={[] as FaqItem[]} />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition font-semibold"
          >
            Create Expedition
          </button>
          <Link
            to="/admin/expeditions"
            className="px-6 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
