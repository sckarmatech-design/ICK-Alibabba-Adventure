import { Form, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
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
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

const CATEGORIES = ["SHORT_TREK", "MULTI_DAY_TREK", "DAY_HIKE"] as const;
const DIFFICULTIES = ["EASY", "MODERATE", "CHALLENGING", "EXPERT"] as const;

type Errors = Record<string, string>;

function validateTrip(formData: FormData): Errors {
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

  return errors;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const errors = validateTrip(formData);
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
    return { ok: true } as const;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { errors: { title: "A trip with this title already exists" } };
    }
    console.error("Failed to create trip:", error);
    return {
      ok: false,
      error: "Failed to create trip. Please try again.",
    } as const;
  }
}

const inputClass =
  "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500";

export default function AdminTripsNew() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/trips/new" },
  );
  const errors: Errors = actionData?.errors ?? {};
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">New Trip</h1>
      </div>

      <Form
        method="post"
        id="trip-new-form"
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
              className={inputClass}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
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
              className={inputClass}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-400">{errors.category}</p>
            )}
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
              className={inputClass}
            >
              <option value="">Select difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.difficulty && (
              <p className="mt-1 text-sm text-red-400">{errors.difficulty}</p>
            )}
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
              className={inputClass}
            />
            {errors.region && (
              <p className="mt-1 text-sm text-red-400">{errors.region}</p>
            )}
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
              className={inputClass}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-400">{errors.duration}</p>
            )}
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
              className={inputClass}
            />
            {errors.bestSeason && (
              <p className="mt-1 text-sm text-red-400">{errors.bestSeason}</p>
            )}
          </div>

          <div>
            <ImageInput
              name="heroImage"
              label="Hero Image"
              folder="trips"
              required
              onLoadingChange={setUploading}
            />
            {errors.heroImage && (
              <p className="mt-1 text-sm text-red-400">{errors.heroImage}</p>
            )}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
            />
            {errors.overview && (
              <p className="mt-1 text-sm text-red-400">{errors.overview}</p>
            )}
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
              className={inputClass}
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
            {errors.itinerary && (
              <p className="mt-1 text-sm text-red-400">{errors.itinerary}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              FAQs
            </label>
            <FaqEditor name="faqs" defaultValue={[] as FaqItem[]} />
            {errors.faqs && (
              <p className="mt-1 text-sm text-red-400">{errors.faqs}</p>
            )}
          </div>
        </div>

        <AdminSaveBar
          formId="trip-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/trips"
          saveLabel="Create Trip"
          submittingLabel="Creating…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
