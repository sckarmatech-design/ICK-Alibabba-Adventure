import { Form, Link, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new Response("Not Found", { status: 404 });
  return post;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });

  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    try {
      await prisma.blogPost.delete({ where: { id } });
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      return {
        ok: false,
        error: "Failed to delete blog post. Please try again.",
      } as const;
    }
    return { ok: true } as const;
  }

  try {
    const title = getString(formData, "title");
    await prisma.blogPost.update({
      where: { id },
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
    console.error("Failed to update blog post:", err);
    return {
      ok: false,
      error: "Failed to save blog post. Please try again.",
    } as const;
  }
}

export default function AdminBlogEdit() {
  const post = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/blog/${post.id}/edit` },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
        <Link
          to="/admin/blog"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form
        method="post"
        id={`blog-edit-form-${post.id}`}
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
              defaultValue={post.title}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
              defaultValue={post.author}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
              defaultValue={post.date.toISOString().split("T")[0]}
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
              defaultValue={post.category}
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
              defaultValue={post.image}
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
              defaultValue={post.readingTime}
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
              defaultValue={post.videoUrl ?? ""}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
            defaultValue={post.excerpt}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
            defaultValue={post.content}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <AdminSaveBar
          formId={`blog-edit-form-${post.id}`}
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/blog"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: "Delete Post",
            confirmMessage: "Delete this blog post? This cannot be undone.",
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
