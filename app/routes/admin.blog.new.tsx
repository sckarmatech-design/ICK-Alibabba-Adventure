import { Form, Link, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
import type { BlogCategory } from "@prisma/client";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { slugify, getString, getOptionalString, getNumber } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

const categories: { value: BlogCategory; label: string }[] = [
  { value: "TREKKING", label: "Trekking" },
  { value: "EXPEDITIONS", label: "Expeditions" },
  { value: "TRAVEL_TIPS", label: "Travel Tips" },
  { value: "CULTURE", label: "Culture" },
];

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  try {
    const title = getString(formData, "title");
    await prisma.blogPost.create({
      data: {
        slug: slugify(title),
        title,
        author: getString(formData, "author"),
        date: new Date(getString(formData, "date")),
        category: getString(formData, "category") as BlogCategory,
        excerpt: getString(formData, "excerpt"),
        content: getString(formData, "content"),
        image: getString(formData, "image"),
        readingTime: getNumber(formData, "readingTime"),
        videoUrl: getOptionalString(formData, "videoUrl"),
      },
    });
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to create blog post:", err);
    return {
      ok: false,
      error: "Failed to create blog post. Please try again.",
    } as const;
  }
}

export default function AdminBlogNew() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/blog/new" },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">New Blog Post</h1>
        <Link
          to="/admin/blog"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form
        method="post"
        id="blog-new-form"
        className="max-w-4xl bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
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
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="Post title"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="Author name"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
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
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <ImageInput
              name="image"
              label="Image URL"
              folder="blog"
              required
              onLoadingChange={setUploading}
            />
          </div>

          <div>
            <label
              htmlFor="readingTime"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Reading Time (minutes)
            </label>
            <input
              id="readingTime"
              name="readingTime"
              type="number"
              min={1}
              required
              defaultValue={5}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="videoUrl"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Video URL (optional)
            </label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Auto-thumbnail only works for YouTube links — for other platforms,
              the blog post's hero image will be used as the video thumbnail.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            placeholder="Short summary"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            placeholder="Full post content"
          />
        </div>

        <AdminSaveBar
          formId="blog-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/blog"
          saveLabel="Create Post"
          submittingLabel="Creating…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
