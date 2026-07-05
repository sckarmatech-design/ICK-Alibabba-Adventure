import { redirect, Form, Link, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString, getNumber } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";

export async function action({
  request,
}: ActionFunctionArgs): Promise<{ error: string } | Response> {
  await requireAdmin(request);
  const formData = await request.formData();

  const image = getOptionalString(formData, "image");

  await prisma.teamMember.create({
    data: {
      name: getString(formData, "name"),
      role: getString(formData, "role"),
      bio: getString(formData, "bio"),
      image,
      specialization: getOptionalString(formData, "specialization"),
      experience: getOptionalString(formData, "experience"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
  });

  return redirect("/admin/team");
}

export default function AdminTeamNew() {
  const actionData = useActionData<typeof action>();
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Add Team Member</h1>
        <Link
          to="/admin/team"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      {actionData?.error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-100">
          {actionData.error}
        </div>
      )}

      <Form
        method="post"
        className="max-w-2xl space-y-6 bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Role
          </label>
          <input
            id="role"
            name="role"
            type="text"
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <ImageInput
          name="image"
          label="Image (optional)"
          folder="team"
          onLoadingChange={setUploading}
        />

        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Specialization (optional)
          </label>
          <input
            id="specialization"
            name="specialization"
            type="text"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Experience (optional)
          </label>
          <input
            id="experience"
            name="experience"
            type="text"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Sort Order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Member
          </button>
          <Link
            to="/admin/team"
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
