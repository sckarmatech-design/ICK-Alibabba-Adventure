import { Form, redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString } from "~/lib/admin";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const title = getString(formData, "title");
  const image = getString(formData, "image");
  const thumbnail = getOptionalString(formData, "thumbnail");
  const category = getString(formData, "category") as
    | "TREKS"
    | "EXPEDITIONS"
    | "TOURS"
    | "NATURE"
    | "CULTURE";
  const alt = getString(formData, "alt");
  const featured = formData.get("featured") === "on";

  if (!title || !image || !category || !alt) {
    return { error: "Title, image URL, category, and alt text are required." };
  }

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

  return redirect("/admin/gallery");
}

export default function AdminGalleryImageNew() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Add Gallery Image</h1>

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
          <label htmlFor="image" className="block text-sm text-gray-400 mb-1">
            Image URL
          </label>
          <input
            id="image"
            name="image"
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

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Save Image
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
