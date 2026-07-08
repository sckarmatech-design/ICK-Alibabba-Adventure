import type { LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: "desc" },
  });
  return tours;
}

export default function AdminToursIndex() {
  const tours = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Tours</h1>
        <Link
          to="/admin/tours/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          New Tour
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-white min-w-0 truncate">
                  {tour.title}
                </td>
                <td className="px-4 py-3 min-w-0 truncate">{tour.region}</td>
                <td className="px-4 py-3 min-w-0 truncate">{tour.duration}</td>
                <td className="px-4 py-3 min-w-0 truncate">
                  {tour.difficulty}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/admin/tours/${tour.id}/edit`}
                      className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/tours/${tour.id}/edit`}
                      className="inline"
                      onSubmit={(event) => {
                        if (!confirm("Delete this tour?")) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="_action" value="delete" />
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No tours yet.{" "}
                  <Link
                    to="/admin/tours/new"
                    className="text-green-500 hover:underline"
                  >
                    Create one
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
