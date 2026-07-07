import { Form, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString } from "~/lib/admin";
import { getYoutubeThumbnailUrl } from "~/lib/video";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

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

  try {
    await prisma.galleryVideo.create({
      data: {
        title,
        videoUrl,
        thumbnail,
        alt,
      },
    });
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to create gallery video:", err);
    return {
      ok: false,
      error: "Failed to save gallery video. Please try again.",
    } as const;
  }
}

export default function AdminGalleryVideoNew() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/gallery/videos/new" },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Add Gallery Video</h1>

      <Form
        method="post"
        id="gallery-video-new-form"
        className="max-w-2xl bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
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
            placeholder="https://..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Auto-thumbnail only works for YouTube links — for other platforms,
            please upload a thumbnail image below.
          </p>
        </div>

        <ImageInput
          name="thumbnail"
          label="Thumbnail (optional)"
          folder="gallery"
          onLoadingChange={setUploading}
        />

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

        <AdminSaveBar
          formId="gallery-video-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/gallery"
          saveLabel="Save Video"
          submittingLabel="Saving…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
