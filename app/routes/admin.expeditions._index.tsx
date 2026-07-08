import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const expeditions = await prisma.expedition.findMany({
    orderBy: { createdAt: "desc" },
  });
  return expeditions;
}

export default function AdminExpeditionsIndex() {
  const expeditions = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Expeditions</h1>
        <Link
          to="/admin/expeditions/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          New Expedition
        </Link>
      </div>

      {/* Desktop table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Region</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Altitude</th>
              <th className="px-4 py-3 font-semibold">Difficulty</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {expeditions.map((expedition) => (
              <tr key={expedition.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-white font-medium min-w-0 truncate">
                  {expedition.title}
                </td>
                <td className="px-4 py-3 text-gray-400 min-w-0 truncate">
                  {expedition.region}
                </td>
                <td className="px-4 py-3 text-gray-400 min-w-0 truncate">
                  {expedition.duration}
                </td>
                <td className="px-4 py-3 text-gray-400 min-w-0 truncate">
                  {expedition.altitude}
                </td>
                <td className="px-4 py-3 text-gray-400 min-w-0 truncate">
                  {expedition.difficulty}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/expeditions/${expedition.id}/edit`}
                      className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/expeditions/${expedition.id}/edit`}
                      className="inline"
                      onSubmit={(e) => {
                        if (
                          !confirm(
                            "Are you sure you want to delete this expedition?",
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="_action" value="delete" />
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/30 transition"
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
        {expeditions.map((expedition) => (
          <div
            key={expedition.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Title
                </p>
                <p className="text-white font-medium truncate">
                  {expedition.title}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Region
                </p>
                <p className="text-gray-400 truncate">{expedition.region}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Duration
                </p>
                <p className="text-gray-400 truncate">{expedition.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Altitude
                </p>
                <p className="text-gray-400 truncate">{expedition.altitude}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Difficulty
                </p>
                <p className="text-gray-400 truncate">
                  {expedition.difficulty}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/admin/expeditions/${expedition.id}/edit`}
                className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition"
              >
                Edit
              </Link>
              <Form
                method="post"
                action={`/admin/expeditions/${expedition.id}/edit`}
                className="inline"
                onSubmit={(e) => {
                  if (
                    !confirm("Are you sure you want to delete this expedition?")
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="_action" value="delete" />
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/30 transition"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        ))}
        {expeditions.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-500">
            No expeditions yet.
          </div>
        )}
      </div>
    </div>
  );
}
