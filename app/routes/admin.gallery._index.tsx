import { Form, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const [images, videos] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryVideo.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return { images, videos };
}

export default function AdminGalleryIndex() {
  const { images, videos } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Gallery</h1>
        <div className="flex gap-3">
          <Link
            to="/admin/gallery/images/new"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Add Image
          </Link>
          <Link
            to="/admin/gallery/videos/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Add Video
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category / URL</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {images.map((image) => (
              <tr key={image.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-400">Image</td>
                <td className="px-4 py-3">
                  <img
                    src={image.thumbnail || image.image}
                    alt={image.alt}
                    className="h-12 w-16 object-cover rounded border border-gray-700"
                  />
                </td>
                <td className="px-4 py-3 text-white min-w-0 truncate">
                  {image.title}
                </td>
                <td className="px-4 py-3 text-gray-400 min-w-0 truncate">
                  {image.category}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {image.featured ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/gallery/${image.id}/edit`}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/gallery/${image.id}/edit`}
                      className="inline"
                      onSubmit={(e) => {
                        if (!confirm("Delete this image?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="_action" value="delete" />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
            {videos.map((video) => (
              <tr key={video.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-400">Video</td>
                <td className="px-4 py-3">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.alt}
                      className="h-12 w-16 object-cover rounded border border-gray-700"
                    />
                  ) : (
                    <div className="h-12 w-16 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                      Video
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-white min-w-0 truncate">
                  {video.title}
                </td>
                <td className="px-4 py-3 text-gray-400 min-w-0 truncate">
                  {video.videoUrl}
                </td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/gallery/${video.id}/edit`}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/gallery/${video.id}/edit`}
                      className="inline"
                      onSubmit={(e) => {
                        if (!confirm("Delete this video?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="_action" value="delete" />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
            {images.length === 0 && videos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No gallery items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Type
                </p>
                <p className="text-gray-300">Image</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Preview
                </p>
                <img
                  src={image.thumbnail || image.image}
                  alt={image.alt}
                  className="h-12 w-16 object-cover rounded border border-gray-700"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Title
                </p>
                <p className="text-white truncate">{image.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Category / URL
                </p>
                <p className="text-gray-400 truncate">{image.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Featured
                </p>
                <p className="text-gray-400">{image.featured ? "Yes" : "No"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                to={`/admin/gallery/${image.id}/edit`}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
              >
                Edit
              </Link>
              <Form
                method="post"
                action={`/admin/gallery/${image.id}/edit`}
                className="inline"
                onSubmit={(e) => {
                  if (!confirm("Delete this image?")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="_action" value="delete" />
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        ))}
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Type
                </p>
                <p className="text-gray-300">Video</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Preview
                </p>
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.alt}
                    className="h-12 w-16 object-cover rounded border border-gray-700"
                  />
                ) : (
                  <div className="h-12 w-16 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                    Video
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Title
                </p>
                <p className="text-white truncate">{video.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Category / URL
                </p>
                <p className="text-gray-400 truncate">{video.videoUrl}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Featured
                </p>
                <p className="text-gray-400">—</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                to={`/admin/gallery/${video.id}/edit`}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
              >
                Edit
              </Link>
              <Form
                method="post"
                action={`/admin/gallery/${video.id}/edit`}
                className="inline"
                onSubmit={(e) => {
                  if (!confirm("Delete this video?")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="_action" value="delete" />
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        ))}
        {images.length === 0 && videos.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-500">
            No gallery items yet.
          </div>
        )}
      </div>
    </div>
  );
}
