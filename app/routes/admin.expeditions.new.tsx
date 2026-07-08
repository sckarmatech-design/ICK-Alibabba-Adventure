import { Form, Link, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getArray, parseJsonField, slugify } from "~/lib/admin";
import { ItineraryEditor, FaqEditor } from "~/components/admin-form-editors";
import type { ItineraryDay, FaqItem } from "~/components/admin-form-editors";
import { ImageInput, ImageListInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

const DIFFICULTY_OPTIONS = [
  "EASY",
  "MODERATE",
  "CHALLENGING",
  "EXPERT",
] as const;

const inputClass =
  "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  try {
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
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to create expedition:", err);
    return {
      ok: false,
      error: "Failed to create expedition. Please try again.",
    } as const;
  }
}

export default function AdminNewExpedition() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/expeditions/new" },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">New Expedition</h1>
        <Link
          to="/admin/expeditions"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form
        method="post"
        id="expedition-new-form"
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
              placeholder="e.g. 14 Days"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="altitude"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Altitude
            </label>
            <input
              id="altitude"
              name="altitude"
              type="text"
              required
              placeholder="e.g. 7,788 m"
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
              className={inputClass}
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
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Best Season
            </label>
            <input
              id="bestSeason"
              name="bestSeason"
              type="text"
              required
              placeholder="e.g. July – September"
              className={inputClass}
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
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Technical Rating
            </label>
            <input
              id="technicalRating"
              name="technicalRating"
              type="text"
              required
              placeholder="e.g. AD (Assez Difficile)"
              className={inputClass}
            />
          </div>
        </div>

        <div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="highlights"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Highlights
              <span className="text-gray-500 font-normal block text-xs">
                One per line
              </span>
            </label>
            <textarea
              id="highlights"
              name="highlights"
              rows={6}
              className={inputClass}
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
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Gear
              <span className="text-gray-500 font-normal block text-xs">
                One item per line
              </span>
            </label>
            <textarea id="gear" name="gear" rows={6} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Itinerary
          </label>
          <ItineraryEditor
            name="itinerary"
            defaultValue={[] as ItineraryDay[]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            FAQs
          </label>
          <FaqEditor name="faqs" defaultValue={[] as FaqItem[]} />
        </div>

        <AdminSaveBar
          formId="expedition-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/expeditions"
          saveLabel="Create Expedition"
          submittingLabel="Creating…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
