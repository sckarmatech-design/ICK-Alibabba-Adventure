import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return slides;
}

export default function AdminHeroIndex() {
  const slides = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Hero Slides</h1>
        <Link
          to="/admin/hero/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          New Slide
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Subtitle</th>
              <th className="px-4 py-3">CTA</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {slides.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hero slides yet.
                </td>
              </tr>
            )}
            {slides.map((slide) => (
              <tr key={slide.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-400">{slide.sortOrder}</td>
                <td className="px-4 py-3 font-medium text-white">
                  {slide.title}
                </td>
                <td className="px-4 py-3 min-w-0 truncate">{slide.subtitle}</td>
                <td className="px-4 py-3 min-w-0 truncate">{slide.cta}</td>
                <td className="px-4 py-3 min-w-0 truncate text-gray-400">
                  {slide.image.length > 40
                    ? slide.image.slice(0, 40) + "..."
                    : slide.image}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Link
                      to={`/admin/hero/${slide.id}/edit`}
                      className="text-green-400 hover:text-green-300 font-medium"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/hero/${slide.id}/edit`}
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
