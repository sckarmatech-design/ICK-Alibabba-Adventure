import { useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import {
  redirect,
  Form,
  useLoaderData,
  Link,
  useActionData,
} from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getNumber, getOptionalString } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";

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
    await prisma.testimonial.delete({ where: { id } });
    return redirect("/admin/testimonials");
  }

  const errors: Record<string, string> = {};

  if (!getString(formData, "name").trim()) errors.name = "Name is required";
  if (!getString(formData, "country").trim())
    errors.country = "Country is required";
  if (!getString(formData, "countryCode").trim())
    errors.countryCode = "Country code is required";
  if (!getString(formData, "review").trim())
    errors.review = "Review is required";
  if (!getString(formData, "tripName").trim())
    errors.tripName = "Trip name is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

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

  return redirect("/admin/testimonials");
}

export default function AdminTestimonialEdit() {
  const testimonial = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const [uploading, setUploading] = useState(false);

  const inputClass =
    "w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Testimonial</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/testimonials"
            className="text-gray-400 hover:text-white transition"
          >
            Back to list
          </Link>
          <Form method="post" className="inline">
            <button
              type="submit"
              name="_action"
              value="delete"
              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition font-medium"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>

      <Form
        method="post"
        className="space-y-6 max-w-3xl bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={testimonial.name}
              className={inputClass}
            />
            {errors?.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              defaultValue={testimonial.country}
              className={inputClass}
            />
            {errors?.country && (
              <p className="mt-1 text-sm text-red-400">{errors.country}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="countryCode"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Country Code
            </label>
            <input
              id="countryCode"
              name="countryCode"
              type="text"
              required
              defaultValue={testimonial.countryCode}
              className={inputClass}
            />
            {errors?.countryCode && (
              <p className="mt-1 text-sm text-red-400">{errors.countryCode}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              required
              defaultValue={testimonial.rating}
              className={inputClass}
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
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Trip Name
            </label>
            <input
              id="tripName"
              name="tripName"
              type="text"
              required
              defaultValue={testimonial.tripName}
              className={inputClass}
            />
            {errors?.tripName && (
              <p className="mt-1 text-sm text-red-400">{errors.tripName}</p>
            )}
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
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Review
          </label>
          <textarea
            id="review"
            name="review"
            rows={6}
            required
            defaultValue={testimonial.review}
            className={inputClass}
          />
          {errors?.review && (
            <p className="mt-1 text-sm text-red-400">{errors.review}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/admin/testimonials"
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </Form>
    </div>
  );
}
