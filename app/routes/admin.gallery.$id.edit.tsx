import { Form, redirect, useActionData, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { deleteImagesFromStorage } from "~/lib/supabase.server";
import { getString, getOptionalString } from "~/lib/admin";
import { getYoutubeThumbnailUrl } from "~/lib/video";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const id = params.id;
  if (!id) throw new Response("Not Found", { status: 404 });

  const [image, video] = await Promise.all([
    prisma.galleryImage.findUnique({ where: { id } }),
    prisma.galleryVideo.findUnique({ where: { id } }),
  ]);

  if (image) return { kind: "image" as const, item: image };
  if (video) return { kind: "video" as const, item: video };

  throw new Response("Not Found", { status: 404 });
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const id = params.id;
  if (!id) throw new Response("Not Found", { status: 404 });

  const formData = await request.formData();

  const [image, video] = await Promise.all([
    prisma.galleryImage.findUnique({ where: { id } }),
    prisma.galleryVideo.findUnique({ where: { id } }),
  ]);

  if (!image && !video) throw new Response("Not Found", { status: 404 });

  if (formData.get("_action") === "delete") {
    try {
      if (image) {
        await prisma.galleryImage.delete({ where: { id } });
        await deleteImagesFromStorage([image.image, image.thumbnail]);
      } else if (video) {
        await prisma.galleryVideo.delete({ where: { id } });
        await deleteImagesFromStorage([video.thumbnail]);
      }
    } catch (err) {
      if (err instanceof Response) throw err;
      console.error("Failed to delete gallery item:", err);
      return {
        ok: false,
        error: "Failed to delete gallery item. Please try again.",
      } as const;
    }
    return redirect("/admin/gallery");
  }

  try {
    if (image) {
      const title = getString(formData, "title");
      const imageUrl = getString(formData, "image");
      const thumbnail = getOptionalString(formData, "thumbnail");
      const category = getString(formData, "category") as
        | "TREKS"
        | "EXPEDITIONS"
        | "TOURS"
        | "NATURE"
        | "CULTURE";
      const alt = getString(formData, "alt");
      const featured = formData.get("featured") === "on";

      if (!title || !imageUrl || !category || !alt) {
        return {
          ok: false,
          error: "Title, image URL, category, and alt text are required.",
        } as const;
      }

      await prisma.galleryImage.update({
        where: { id },
        data: { title, image: imageUrl, thumbnail, category, alt, featured },
      });

      const imagesToDelete: string[] = [];
      if (image.image && image.image !== imageUrl) {
        imagesToDelete.push(image.image);
      }
      if (image.thumbnail && image.thumbnail !== thumbnail) {
        imagesToDelete.push(image.thumbnail);
      }
      await deleteImagesFromStorage(imagesToDelete);
    } else if (video) {
      const title = getString(formData, "title");
      const videoUrl = getString(formData, "videoUrl");
      let thumbnail = getOptionalString(formData, "thumbnail");
      const alt = getString(formData, "alt");

      if (!title || !videoUrl || !alt) {
        return {
          ok: false,
          error: "Title, video URL, and alt text are required.",
        } as const;
      }

      if (!thumbnail) {
        thumbnail = getYoutubeThumbnailUrl(videoUrl) ?? undefined;
      }

      await prisma.galleryVideo.update({
        where: { id },
        data: { title, videoUrl, thumbnail, alt },
      });

      if (video.thumbnail && video.thumbnail !== thumbnail) {
        await deleteImagesFromStorage([video.thumbnail]);
      }
    }
  } catch (err) {
    if (err instanceof Response) throw err;
    console.error("Failed to update gallery item:", err);
    return {
      ok: false,
      error: "Failed to save gallery item. Please try again.",
    } as const;
  }

  return { ok: true } as const;
}

export default function AdminGalleryEdit() {
  const { kind, item } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/gallery/${item.id}/edit` },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Edit {kind === "image" ? "Image" : "Video"}
      </h1>

      <Form
        method="post"
        id={`gallery-edit-form-${item.id}`}
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
            defaultValue={item.title}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          />
        </div>

        {kind === "image" ? (
          <>
            <ImageInput
              name="image"
              label="Image"
              defaultValue={item.image}
              folder="gallery"
              required
              onLoadingChange={setUploading}
            />

            <ImageInput
              name="thumbnail"
              label="Thumbnail URL (optional)"
              defaultValue={item.thumbnail ?? ""}
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
                defaultValue={item.category}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
              >
                <option value="TREKS">TREKS</option>
                <option value="EXPEDITIONS">EXPEDITIONS</option>
                <option value="TOURS">TOURS</option>
                <option value="NATURE">NATURE</option>
                <option value="CULTURE">CULTURE</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                defaultChecked={item.featured}
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-300">
                Featured
              </label>
            </div>
          </>
        ) : (
          <>
            <div>
              <label
                htmlFor="videoUrl"
                className="block text-sm text-gray-400 mb-1"
              >
                Video URL
              </label>
              <input
                id="videoUrl"
                name="videoUrl"
                type="url"
                required
                defaultValue={item.videoUrl}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-thumbnail only works for YouTube links — for other
                platforms, please upload a thumbnail image below.
              </p>
            </div>

            <ImageInput
              name="thumbnail"
              label="Thumbnail (optional)"
              defaultValue={item.thumbnail ?? ""}
              folder="gallery"
              onLoadingChange={setUploading}
            />
          </>
        )}

        <div>
          <label htmlFor="alt" className="block text-sm text-gray-400 mb-1">
            Alt Text
          </label>
          <input
            id="alt"
            name="alt"
            type="text"
            required
            defaultValue={item.alt}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <AdminSaveBar
          formId={`gallery-edit-form-${item.id}`}
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/gallery"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: `Delete ${kind === "image" ? "Image" : "Video"}`,
            confirmMessage: `Delete this ${kind}? This cannot be undone.`,
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
