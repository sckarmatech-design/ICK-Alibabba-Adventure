import { redirect, Form, Link } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getNumber, getArray } from "~/lib/admin";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  await prisma.destination.create({
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

export default function AdminDestinationsNew() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Add Destination</h1>
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
            defaultValue={0}
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
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Create Destination
          </button>
          <Link
            to="/admin/destinations"
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
