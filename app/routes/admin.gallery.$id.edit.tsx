import { Form, redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString } from "~/lib/admin";
import { getYoutubeThumbnailUrl } from "~/lib/video";
import { ImageInput } from "~/components/ImageInput";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const id = params.id;
  if (!id) throw new Response("Not Found", { status: 404 });

  const [image, video] = await Promise.all([
    prisma.galleryImage.findUnique({ where: { id } }),
    prisma.galleryVideo.findUnique({ where: { id } }),
  ]);

  if (image) {
    return { kind: "image" as const, item: image };
  }

  if (video) {
    return { kind: "video" as const, item: video };
  }

  throw new Response("Not Found", { status: 404 });
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const id = params.id;
  if (!id) throw new Response("Not Found", { status: 404 });

  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    const [image, video] = await Promise.all([
      prisma.galleryImage.findUnique({ where: { id } }),
      prisma.galleryVideo.findUnique({ where: { id } }),
    ]);

    if (image) {
      await prisma.galleryImage.delete({ where: { id } });
    } else if (video) {
      await prisma.galleryVideo.delete({ where: { id } });
    } else {
      throw new Response("Not Found", { status: 404 });
    }

    return redirect("/admin/gallery");
  }

  const [image, video] = await Promise.all([
    prisma.galleryImage.findUnique({ where: { id } }),
    prisma.galleryVideo.findUnique({ where: { id } }),
  ]);

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
        error: "Title, image URL, category, and alt text are required.",
      };
    }

    await prisma.galleryImage.update({
      where: { id },
      data: {
        title,
        image: imageUrl,
        thumbnail,
        category,
        alt,
        featured,
      },
    });

    return redirect("/admin/gallery");
  }

  if (video) {
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

    await prisma.galleryVideo.update({
      where: { id },
      data: {
        title,
        videoUrl,
        thumbnail,
        alt,
      },
    });

    return redirect("/admin/gallery");
  }

  throw new Response("Not Found", { status: 404 });
}

export default function AdminGalleryEdit() {
  const { kind, item } = useLoaderData<typeof loader>();
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Edit {kind === "image" ? "Image" : "Video"}
      </h1>

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

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
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
