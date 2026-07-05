import { redirect, Form, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getNumber, getArray } from "~/lib/admin";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
  });
  if (!destination) throw new Response("Not Found", { status: 404 });
  return destination;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    await prisma.destination.delete({ where: { id: params.id } });
    return redirect("/admin/destinations");
  }

  await prisma.destination.update({
    where: { id: params.id },
    data: {
      name: getString(formData, "name"),
      region: getString(formData, "region"),
      image: getString(formData, "image"),
      tripCount: getNumber(formData, "tripCount"),
      description: getString(formData, "description"),
      highlights: getArray(formData, "highlights"),
    },
  });

  return redirect("/admin/destinations");
}

export default function AdminDestinationsEdit() {
  const destination = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Destination</h1>
        <Link
          to="/admin/destinations"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form method="post" className="max-w-2xl space-y-6 bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={destination.name}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-1">
            Region
          </label>
          <input
            id="region"
            name="region"
            type="text"
            required
            defaultValue={destination.region}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            required
            defaultValue={destination.image}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="tripCount" className="block text-sm font-medium text-gray-300 mb-1">
            Trip Count
          </label>
          <input
            id="tripCount"
            name="tripCount"
            type="number"
            defaultValue={destination.tripCount}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            defaultValue={destination.description}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="highlights" className="block text-sm font-medium text-gray-300 mb-1">
            Highlights
            <span className="text-gray-500 font-normal ml-2">(one per line)</span>
          </label>
          <textarea
            id="highlights"
            name="highlights"
            rows={5}
            defaultValue={destination.highlights.join("\n")}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              Save Changes
            </button>
            <Link
              to="/admin/destinations"
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </Link>
          </div>
          <button
            type="submit"
            name="_action"
            value="delete"
            className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg transition"
            onClick={(e) => {
              if (!confirm("Delete this destination?")) {
                e.preventDefault();
              }
            }}
          >
            Delete
          </button>
        </div>
      </Form>
    </div>
  );
}
