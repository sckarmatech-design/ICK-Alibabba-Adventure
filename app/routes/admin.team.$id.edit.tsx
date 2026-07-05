import { redirect, Form, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString, getNumber } from "~/lib/admin";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id },
  });
  if (!member) throw new Response("Not Found", { status: 404 });
  return member;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    await prisma.teamMember.delete({ where: { id: params.id } });
    return redirect("/admin/team");
  }

  await prisma.teamMember.update({
    where: { id: params.id },
    data: {
      name: getString(formData, "name"),
      role: getString(formData, "role"),
      bio: getString(formData, "bio"),
      image: getOptionalString(formData, "image"),
      specialization: getOptionalString(formData, "specialization"),
      experience: getOptionalString(formData, "experience"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
  });

  return redirect("/admin/team");
}

export default function AdminTeamEdit() {
  const member = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Team Member</h1>
        <Link
          to="/admin/team"
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
            defaultValue={member.name}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
            Role
          </label>
          <input
            id="role"
            name="role"
            type="text"
            required
            defaultValue={member.role}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            required
            defaultValue={member.bio}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
            Image URL (optional)
          </label>
          <input
            id="image"
            name="image"
            type="url"
            defaultValue={member.image || ""}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-1">
            Specialization (optional)
          </label>
          <input
            id="specialization"
            name="specialization"
            type="text"
            defaultValue={member.specialization || ""}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
            Experience (optional)
          </label>
          <input
            id="experience"
            name="experience"
            type="text"
            defaultValue={member.experience || ""}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-300 mb-1">
            Sort Order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={member.sortOrder}
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
              to="/admin/team"
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
              if (!confirm("Delete this team member?")) {
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
