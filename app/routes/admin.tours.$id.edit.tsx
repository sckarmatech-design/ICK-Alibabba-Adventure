import { Form, Link, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useState } from "react";
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
import { ImageInput, ImageListInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

const inputClass =
  "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500";

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
    try {
      await prisma.tour.delete({ where: { id: params.id } });
    } catch (err) {
      console.error("Failed to delete tour:", err);
      return {
        ok: false,
        error: "Failed to delete tour. Please try again.",
      } as const;
    }
    return { ok: true } as const;
  }

  try {
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
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to update tour:", err);
    return {
      ok: false,
      error: "Failed to save tour. Please try again.",
    } as const;
  }
}

export default function AdminEditTour() {
  const tour = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/tours/${tour.id}/edit` },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Tour</h1>
        <Link
          to="/admin/tours"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form
        method="post"
        id={`tour-edit-form-${tour.id}`}
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
              defaultValue={tour.title}
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <ImageInput
              name="heroImage"
              label="Hero Image"
              defaultValue={tour.heroImage}
              folder="tours"
              required
              onLoadingChange={setUploading}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
            />
          </div>

          <div>
            <ImageListInput
              name="gallery"
              label="Gallery Images"
              defaultValues={tour.gallery}
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
              defaultValue={tour.itinerary as unknown as ItineraryDay[]}
            />
          </div>
        </div>

        <AdminSaveBar
          formId={`tour-edit-form-${tour.id}`}
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/tours"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: "Delete Tour",
            confirmMessage: "Delete this tour? This cannot be undone.",
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
