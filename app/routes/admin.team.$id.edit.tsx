import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getOptionalString, getNumber } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id },
  });
  if (!member) throw new Response("Not Found", { status: 404 });
  return member;
}

export async function action({
  params,
  request,
}: ActionFunctionArgs): Promise<
  { ok: true } | { ok: false; error: string } | Response
> {
  await requireAdmin(request);
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    try {
      await prisma.teamMember.delete({ where: { id: params.id } });
    } catch (err) {
      console.error("Failed to delete team member:", err);
      return {
        ok: false,
        error: "Failed to delete team member. Please try again.",
      };
    }
    return redirect("/admin/team");
  }

  const image = getOptionalString(formData, "image");

  try {
    await prisma.teamMember.update({
      where: { id: params.id },
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
    console.error("Failed to update team member:", err);
    return {
      ok: false,
      error: "Failed to save team member. Please try again.",
    };
  }
}

export default function AdminTeamEdit() {
  const member = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/team/${member.id}/edit` },
  );
  const [uploading, setUploading] = useState(false);

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

      <Form
        method="post"
        id={`team-edit-form-${member.id}`}
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
            defaultValue={member.name}
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
            defaultValue={member.role}
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
            defaultValue={member.bio}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <ImageInput
          name="image"
          label="Image (optional)"
          defaultValue={member.image}
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
            defaultValue={member.specialization || ""}
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
            defaultValue={member.experience || ""}
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
            defaultValue={member.sortOrder}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <AdminSaveBar
          formId={`team-edit-form-${member.id}`}
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/team"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: "Delete Member",
            confirmMessage: "Delete this team member? This cannot be undone.",
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
