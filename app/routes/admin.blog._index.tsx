import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const posts = await prisma.blogPost.findMany({ orderBy: { date: "desc" } });
  return posts;
}

export default function AdminBlogIndex() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
        <Link
          to="/admin/blog/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          New Post
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Reading</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No blog posts yet.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-white">
                  {post.title}
                </td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">
                  {post.date.toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-3">{post.readingTime} min</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Link
                      to={`/admin/blog/${post.id}/edit`}
                      className="text-green-400 hover:text-green-300 font-medium"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/blog/${post.id}/edit`}
                      className="inline"
                    >
                      <button
                        type="submit"
                        name="_action"
                        value="delete"
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
