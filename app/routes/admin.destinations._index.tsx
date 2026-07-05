import { useLoaderData, Link, Form } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
  });
  return destinations;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  if (formData.get("_action") === "delete") {
    const id = formData.get("id") as string;
    await prisma.destination.delete({ where: { id } });
    return { ok: true };
  }
  return null;
}

export default function AdminDestinationsIndex() {
  const destinations = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Destinations</h1>
        <Link
          to="/admin/destinations/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          Add Destination
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">Trips</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {destinations.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No destinations yet.
                </td>
              </tr>
            )}
            {destinations.map((destination) => (
              <tr key={destination.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-white">{destination.name}</td>
                <td className="px-4 py-3 text-gray-300">{destination.region}</td>
                <td className="px-4 py-3 text-gray-300">{destination.tripCount}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link
                    to={`/admin/destinations/${destination.id}/edit`}
                    className="text-sm px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                  >
                    Edit
                  </Link>
                  <Form method="post" className="inline">
                    <input type="hidden" name="id" value={destination.id} />
                    <button
                      type="submit"
                      name="_action"
                      value="delete"
                      className="text-sm px-3 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
                      onClick={(e) => {
                        if (!confirm("Delete this destination?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
