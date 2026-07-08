import { Form, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const image = getString(formData, "image");
  const title = getString(formData, "title");
  const thumbnail = getOptionalString(formData, "thumbnail");
  const category = getString(formData, "category") as
    | "TREKS"
    | "EXPEDITIONS"
    | "TOURS"
    | "NATURE"
    | "CULTURE";
  const alt = getString(formData, "alt");
  const featured = formData.get("featured") === "on";

  if (!title || !category || !alt) {
    return {
      ok: false,
      error: "Title, category, and alt text are required.",
    } as const;
  }

  if (!image) {
    return { ok: false, error: "Image URL is required." } as const;
  }

  try {
    await prisma.galleryImage.create({
      data: {
        title,
        image,
        thumbnail,
        category,
        alt,
        featured,
      },
    });
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to create gallery image:", err);
    return {
      ok: false,
      error: "Failed to save gallery image. Please try again.",
    } as const;
  }
}

export default function AdminGalleryImageNew() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/gallery/images/new" },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Add Gallery Image</h1>

      <Form
        method="post"
        id="gallery-image-new-form"
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
      >
        <div>
          <label htmlFor="title" className="block text-sm text-gray-400 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <ImageInput
          name="image"
          label="Image"
          folder="gallery"
          required
          onLoadingChange={setUploading}
        />

        <ImageInput
          name="thumbnail"
          label="Thumbnail URL (optional)"
          folder="gallery"
          onLoadingChange={setUploading}
        />

        <div>
          <label
            htmlFor="category"
            className="block text-sm text-gray-400 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          >
            <option value="TREKS">TREKS</option>
            <option value="EXPEDITIONS">EXPEDITIONS</option>
            <option value="TOURS">TOURS</option>
            <option value="NATURE">NATURE</option>
            <option value="CULTURE">CULTURE</option>
          </select>
        </div>

        <div>
          <label htmlFor="alt" className="block text-sm text-gray-400 mb-1">
            Alt Text
          </label>
          <input
            id="alt"
            name="alt"
            type="text"
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="featured" className="text-sm text-gray-300">
            Featured
          </label>
        </div>

        <AdminSaveBar
          formId="gallery-image-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/gallery"
          saveLabel="Save Image"
          submittingLabel="Saving…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
