import { useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import {
  redirect,
  Form,
  useLoaderData,
  Link,
  useActionData,
} from "react-router";
import type { BlogCategory } from "@prisma/client";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { slugify, getString, getOptionalString, getNumber } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";

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
    await prisma.blogPost.delete({ where: { id } });
    return redirect("/admin/blog");
  }

  const title = getString(formData, "title");
  const errors: Record<string, string> = {};

  if (!title.trim()) errors.title = "Title is required";
  if (!getString(formData, "author").trim())
    errors.author = "Author is required";
  if (!getString(formData, "date")) errors.date = "Date is required";
  if (!getString(formData, "excerpt").trim())
    errors.excerpt = "Excerpt is required";
  if (!getString(formData, "content").trim())
    errors.content = "Content is required";
  if (!getString(formData, "image").trim())
    errors.image = "Image URL is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

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

  return redirect("/admin/blog");
}

export default function AdminBlogEdit() {
  const post = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const [uploading, setUploading] = useState(false);

  const inputClass =
    "w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/blog"
            className="text-gray-400 hover:text-white transition"
          >
            Back to list
          </Link>
          <Form method="post" className="inline">
            <button
              type="submit"
              name="_action"
              value="delete"
              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition font-medium"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>

      <Form
        method="post"
        className="space-y-6 max-w-4xl bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post.title}
              className={inputClass}
            />
            {errors?.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              required
              defaultValue={post.author}
              className={inputClass}
            />
            {errors?.author && (
              <p className="mt-1 text-sm text-red-400">{errors.author}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={post.date.toISOString().split("T")[0]}
              className={inputClass}
            />
            {errors?.date && (
              <p className="mt-1 text-sm text-red-400">{errors.date}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={post.category}
              className={inputClass}
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
            {errors?.image && (
              <p className="mt-1 text-sm text-red-400">{errors.image}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="readingTime"
              className="block text-sm font-medium text-gray-400 mb-2"
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
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="videoUrl"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Video URL (optional)
            </label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={post.videoUrl ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            required
            defaultValue={post.excerpt}
            className={inputClass}
          />
          {errors?.excerpt && (
            <p className="mt-1 text-sm text-red-400">{errors.excerpt}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            defaultValue={post.content}
            className={inputClass}
          />
          {errors?.content && (
            <p className="mt-1 text-sm text-red-400">{errors.content}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/admin/blog"
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </Form>
    </div>
  );
}
