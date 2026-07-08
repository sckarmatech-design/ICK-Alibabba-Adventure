import { Form, Link, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString, getNumber } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

export async function action({
  request,
}: ActionFunctionArgs): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin(request);
  const formData = await request.formData();

  const image = getOptionalString(formData, "image");

  try {
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
    return { ok: true };
  } catch (err) {
    console.error("Failed to create team member:", err);
    return {
      ok: false,
      error: "Failed to create team member. Please try again.",
    };
  }
}

export default function AdminTeamNew() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/team/new" },
  );
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

      <Form
        method="post"
        id="team-new-form"
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
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

        <AdminSaveBar
          formId="team-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/team"
          saveLabel="Create Member"
          submittingLabel="Creating…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
