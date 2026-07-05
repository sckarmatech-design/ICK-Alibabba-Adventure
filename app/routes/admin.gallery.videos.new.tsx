import { Form, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString } from "~/lib/admin";
import { getYoutubeThumbnailUrl } from "~/lib/video";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const title = getString(formData, "title");
  const videoUrl = getString(formData, "videoUrl");
  let thumbnail = getOptionalString(formData, "thumbnail");
  const alt = getString(formData, "alt");

  if (!title || !videoUrl || !alt) {
    return { error: "Title, video URL, and alt text are required." };
  }

  if (!thumbnail) {
    thumbnail = getYoutubeThumbnailUrl(videoUrl) ?? undefined;
  }

  await prisma.galleryVideo.create({
    data: {
      title,
      videoUrl,
      thumbnail,
      alt,
    },
  });

  return redirect("/admin/gallery");
}

export default function AdminGalleryVideoNew() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Add Gallery Video</h1>

      <Form
        method="post"
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
            YouTube Video URL
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="thumbnail"
            className="block text-sm text-gray-400 mb-1"
          >
            Thumbnail URL (optional)
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          />
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

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Save Video
          </button>
          <a
            href="/admin/gallery"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Cancel
          </a>
        </div>
      </Form>
    </div>
  );
}
