import { useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import {
  getArray,
  getOptionalString,
  getString,
  parseJsonField,
  slugify,
} from "~/lib/admin";
import { ItineraryEditor, FaqEditor } from "~/components/admin-form-editors";
import type { ItineraryDay, FaqItem } from "~/components/admin-form-editors";
import { ImageInput, ImageListInput } from "~/components/ImageInput";

const CATEGORIES = ["SHORT_TREK", "MULTI_DAY_TREK", "DAY_HIKE"] as const;
const DIFFICULTIES = ["EASY", "MODERATE", "CHALLENGING", "EXPERT"] as const;

type Errors = Record<string, string>;

function validateTrip(formData: FormData): { errors: Errors; data?: unknown } {
  const errors: Errors = {};

  const title = getString(formData, "title").trim();
  const category = getString(formData, "category");
  const region = getString(formData, "region").trim();
  const duration = getString(formData, "duration").trim();
  const difficulty = getString(formData, "difficulty");
  const bestSeason = getString(formData, "bestSeason").trim();
  const heroImage = getString(formData, "heroImage").trim();
  const overview = getString(formData, "overview").trim();

  if (!title) errors.title = "Title is required";
  if (!category) errors.category = "Category is required";
  if (!region) errors.region = "Region is required";
  if (!duration) errors.duration = "Duration is required";
  if (!difficulty) errors.difficulty = "Difficulty is required";
  if (!bestSeason) errors.bestSeason = "Best season is required";
  if (!heroImage) errors.heroImage = "Hero image URL is required";
  if (!overview) errors.overview = "Overview is required";

  const rawItinerary = getString(formData, "itinerary");
  const rawFaqs = getString(formData, "faqs");

  if (rawItinerary.trim()) {
    try {
      JSON.parse(rawItinerary);
    } catch {
      errors.itinerary = "Itinerary must be valid JSON";
    }
  }
  if (rawFaqs.trim()) {
    try {
      JSON.parse(rawFaqs);
    } catch {
      errors.faqs = "FAQs must be valid JSON";
    }
  }

  return { errors };
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const { errors } = validateTrip(formData);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const title = getString(formData, "title").trim();
  const slug = slugify(title);

  try {
    await prisma.trip.create({
      data: {
        slug,
        title,
        category: getString(formData, "category") as
          | "SHORT_TREK"
          | "MULTI_DAY_TREK"
          | "DAY_HIKE",
        region: getString(formData, "region").trim(),
        duration: getString(formData, "duration").trim(),
        difficulty: getString(formData, "difficulty") as
          | "EASY"
          | "MODERATE"
          | "CHALLENGING"
          | "EXPERT",
        bestSeason: getString(formData, "bestSeason").trim(),
        heroImage: getString(formData, "heroImage").trim(),
        overview: getString(formData, "overview").trim(),
        groupSize: getOptionalString(formData, "groupSize"),
        startPoint: getOptionalString(formData, "startPoint"),
        endPoint: getOptionalString(formData, "endPoint"),
        highlights: getArray(formData, "highlights"),
        gallery: getArray(formData, "gallery"),
        itinerary: parseJsonField(getString(formData, "itinerary"), []),
        faqs: parseJsonField(getString(formData, "faqs"), []),
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { errors: { title: "A trip with this title already exists" } };
    }
    throw error;
  }

  return redirect("/admin/trips");
}

export default function AdminTripsNew() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const errors = actionData?.errors ?? {};
  const isSubmitting = navigation.state === "submitting";
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">New Trip</h1>
        <Link
          to="/admin/trips"
          className="text-gray-400 hover:text-white transition"
        >
          &larr; Back to Trips
        </Link>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-100">
          <p className="font-semibold mb-1">Please fix the following errors:</p>
          <ul className="list-disc list-inside text-sm">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <Form
        method="post"
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
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
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
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
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Select difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
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
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
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
              placeholder="e.g. 5 days / 4 nights"
              required
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            />
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
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <ImageInput
              name="heroImage"
              label="Hero Image"
              folder="trips"
              required
              onLoadingChange={setUploading}
            />
          </div>

          <div>
            <label
              htmlFor="groupSize"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Group Size
            </label>
            <input
              id="groupSize"
              name="groupSize"
              type="text"
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="startPoint"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Start Point
            </label>
            <input
              id="startPoint"
              name="startPoint"
              type="text"
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="endPoint"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              End Point
            </label>
            <input
              id="endPoint"
              name="endPoint"
              type="text"
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
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
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="md:col-span-2">
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
              className="w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <ImageListInput
              name="gallery"
              label="Gallery Images"
              defaultValues={[]}
              folder="gallery"
              onLoadingChange={setUploading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Itinerary
            </label>
            <ItineraryEditor
              name="itinerary"
              defaultValue={[] as ItineraryDay[]}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              FAQs
            </label>
            <FaqEditor name="faqs" defaultValue={[] as FaqItem[]} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-800">
          <Link
            to="/admin/trips"
            className="px-4 py-2 text-gray-300 hover:text-white transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white rounded-md font-medium transition"
          >
            {isSubmitting ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </Form>
    </div>
  );
}
