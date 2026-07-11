import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { deleteImagesFromStorage } from "~/lib/supabase.server";
import {
  getString,
  getArray,
  getOptionalNumber,
  parseJsonField,
} from "~/lib/admin";
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

  const existing = await prisma.expedition.findUnique({
    where: { id: params.id },
  });
  if (!existing) throw new Response("Not Found", { status: 404 });

  if (formData.get("_action") === "delete") {
    try {
      await prisma.expedition.delete({ where: { id: params.id } });
      await deleteImagesFromStorage([existing.heroImage, ...existing.gallery]);
    } catch (err) {
      console.error("Failed to delete expedition:", err);
      return {
        ok: false,
        error: "Failed to delete expedition. Please try again.",
      } as const;
    }
    return redirect("/admin/expeditions");
  }

  const newHeroImage = getString(formData, "heroImage");
  const newGallery = getArray(formData, "gallery");

  try {
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
        heroImage: newHeroImage,
        overview: getString(formData, "overview"),
        technicalRating: getString(formData, "technicalRating"),
        highlights: getArray(formData, "highlights"),
        gallery: newGallery,
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

    const imagesToDelete: string[] = [];
    if (existing.heroImage && existing.heroImage !== newHeroImage) {
      imagesToDelete.push(existing.heroImage);
    }
    for (const oldUrl of existing.gallery) {
      if (oldUrl && !newGallery.includes(oldUrl)) {
        imagesToDelete.push(oldUrl);
      }
    }
    await deleteImagesFromStorage(imagesToDelete);

    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to update expedition:", err);
    return {
      ok: false,
      error: "Failed to save expedition. Please try again.",
    } as const;
  }
}

export default function AdminEditExpedition() {
  const expedition = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/expeditions/${expedition.id}/edit` },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Expedition</h1>
        <Link
          to="/admin/expeditions"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form
        method="post"
        id={`expedition-edit-form-${expedition.id}`}
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
              defaultValue={expedition.title}
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
              defaultValue={expedition.region}
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
              defaultValue={expedition.duration}
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
              defaultValue={expedition.altitude}
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
              defaultValue={expedition.difficulty}
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
              defaultValue={expedition.bestSeason}
              className={inputClass}
            />
          </div>

          <div>
            <ImageInput
              name="heroImage"
              label="Hero Image"
              defaultValue={expedition.heroImage}
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
              defaultValue={expedition.technicalRating}
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
            defaultValue={expedition.overview}
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
              defaultValue={expedition.highlights.join("\n")}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="priceIncludes"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Price Includes
              <span className="text-gray-500 font-normal block text-xs">
                One per line
              </span>
            </label>
            <textarea
              id="priceIncludes"
              name="priceIncludes"
              rows={6}
              defaultValue={expedition.priceIncludes?.join("\n") ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="priceExcludes"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Price Excludes
              <span className="text-gray-500 font-normal block text-xs">
                One per line
              </span>
            </label>
            <textarea
              id="priceExcludes"
              name="priceExcludes"
              rows={6}
              defaultValue={expedition.priceExcludes?.join("\n") ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Price (whole number, e.g. 1790)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={expedition.price ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              defaultValue={expedition.currency ?? "USD"}
              className={inputClass}
            >
              <option value="USD">USD</option>
              <option value="PKR">PKR</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="depositAmount"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Deposit Amount (optional)
            </label>
            <input
              id="depositAmount"
              name="depositAmount"
              type="number"
              min={0}
              step={1}
              defaultValue={expedition.depositAmount ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <ImageListInput
              name="gallery"
              label="Gallery Images"
              defaultValues={expedition.gallery}
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
            <textarea
              id="gear"
              name="gear"
              rows={6}
              defaultValue={expedition.gear.join("\n")}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            FAQs
          </label>
          <FaqEditor
            name="faqs"
            defaultValue={(expedition.faqs ?? []) as unknown as FaqItem[]}
          />
        </div>

        <AdminSaveBar
          formId={`expedition-edit-form-${expedition.id}`}
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/expeditions"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: "Delete Expedition",
            confirmMessage: "Delete this expedition? This cannot be undone.",
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
