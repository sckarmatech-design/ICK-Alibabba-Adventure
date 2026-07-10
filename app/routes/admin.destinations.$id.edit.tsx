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
import { getString, getNumber, getArray } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

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
    try {
      await prisma.destination.delete({ where: { id: params.id } });
    } catch (err) {
      console.error("Failed to delete destination:", err);
      return {
        ok: false,
        error: "Failed to delete destination. Please try again.",
      } as const;
    }
    return redirect("/admin/destinations");
  }

  try {
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
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to update destination:", err);
    return {
      ok: false,
      error: "Failed to save destination. Please try again.",
    } as const;
  }
}

export default function AdminDestinationsEdit() {
  const destination = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/destinations/${destination.id}/edit` },
  );
  const [uploading, setUploading] = useState(false);

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

      <Form
        method="post"
        id={`destination-edit-form-${destination.id}`}
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
            defaultValue={destination.name}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
          <ImageInput
            name="image"
            label="Image"
            defaultValue={destination.image}
            folder="destinations"
            required
            onLoadingChange={setUploading}
          />
        </div>

        <div>
          <label
            htmlFor="tripCount"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
          <label
            htmlFor="highlights"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Highlights
            <span className="text-gray-500 font-normal ml-2">
              (one per line)
            </span>
          </label>
          <textarea
            id="highlights"
            name="highlights"
            rows={5}
            defaultValue={destination.highlights.join("\n")}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <AdminSaveBar
          formId={`destination-edit-form-${destination.id}`}
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/destinations"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: "Delete Destination",
            confirmMessage: "Delete this destination? This cannot be undone.",
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
