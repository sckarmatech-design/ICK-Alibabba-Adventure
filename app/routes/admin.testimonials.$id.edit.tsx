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
import { getString, getNumber, getOptionalString } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

const ratings = [1, 2, 3, 4, 5];

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new Response("Not Found", { status: 404 });
  return testimonial;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });

  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    try {
      await prisma.testimonial.delete({ where: { id } });
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      return {
        ok: false,
        error: "Failed to delete testimonial. Please try again.",
      } as const;
    }
    return redirect("/admin/testimonials");
  }

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name: getString(formData, "name"),
        country: getString(formData, "country"),
        countryCode: getString(formData, "countryCode"),
        rating: getNumber(formData, "rating"),
        review: getString(formData, "review"),
        tripName: getString(formData, "tripName"),
        image: getOptionalString(formData, "image"),
      },
    });
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to update testimonial:", err);
    return {
      ok: false,
      error: "Failed to save testimonial. Please try again.",
    } as const;
  }
}

export default function AdminTestimonialEdit() {
  const testimonial = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/testimonials/${testimonial.id}/edit` },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Testimonial</h1>
        <Link
          to="/admin/testimonials"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form
        method="post"
        id={`testimonial-edit-form-${testimonial.id}`}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              defaultValue={testimonial.name}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              defaultValue={testimonial.country}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="countryCode"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Country Code
            </label>
            <input
              id="countryCode"
              name="countryCode"
              type="text"
              required
              defaultValue={testimonial.countryCode}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              required
              defaultValue={testimonial.rating}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              {ratings.map((rating) => (
                <option key={rating} value={rating}>
                  {rating} star{rating > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tripName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Trip Name
            </label>
            <input
              id="tripName"
              name="tripName"
              type="text"
              required
              defaultValue={testimonial.tripName}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <ImageInput
              name="image"
              label="Image (optional)"
              defaultValue={testimonial.image}
              folder="testimonials"
              onLoadingChange={setUploading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Review
          </label>
          <textarea
            id="review"
            name="review"
            rows={6}
            required
            defaultValue={testimonial.review}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <AdminSaveBar
          formId={`testimonial-edit-form-${testimonial.id}`}
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/testimonials"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: "Delete Testimonial",
            confirmMessage: "Delete this testimonial? This cannot be undone.",
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
