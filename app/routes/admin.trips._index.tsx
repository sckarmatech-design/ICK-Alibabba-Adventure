import type { LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
  });
  return trips;
}

export default function AdminTripsIndex() {
  const trips = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Trips</h1>
        <Link
          to="/admin/trips/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition"
        >
          New Trip
        </Link>
      </div>

      {/* Desktop table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Region</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Difficulty</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {trips.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No trips yet.
                </td>
              </tr>
            )}
            {trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-white font-medium min-w-0 truncate">
                  {trip.title}
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  {trip.category}
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  {trip.region}
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  {trip.duration}
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  {trip.difficulty}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/admin/trips/${trip.id}/edit`}
                      className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/trips/${trip.id}/edit`}
                      className="inline"
                      onSubmit={(e) => {
                        if (!confirm("Delete this trip?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="_action" value="delete" />
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-sm bg-red-900/50 hover:bg-red-800 text-red-100 rounded transition"
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Title
                </p>
                <p className="text-white font-medium truncate">{trip.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Category
                </p>
                <p className="text-gray-300 truncate">{trip.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Region
                </p>
                <p className="text-gray-300 truncate">{trip.region}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Duration
                </p>
                <p className="text-gray-300 truncate">{trip.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Difficulty
                </p>
                <p className="text-gray-300 truncate">{trip.difficulty}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/admin/trips/${trip.id}/edit`}
                className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded transition"
              >
                Edit
              </Link>
              <Form
                method="post"
                action={`/admin/trips/${trip.id}/edit`}
                className="inline"
                onSubmit={(e) => {
                  if (!confirm("Delete this trip?")) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="_action" value="delete" />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm bg-red-900/50 hover:bg-red-800 text-red-100 rounded transition"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        ))}
        {trips.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
            No trips yet.
          </div>
        )}
      </div>
    </div>
  );
}
