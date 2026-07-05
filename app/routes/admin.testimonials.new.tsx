import type { ActionFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link, useActionData } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getNumber, getOptionalString } from "~/lib/admin";

const ratings = [1, 2, 3, 4, 5];

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const errors: Record<string, string> = {};

  if (!getString(formData, "name").trim()) errors.name = "Name is required";
  if (!getString(formData, "country").trim()) errors.country = "Country is required";
  if (!getString(formData, "countryCode").trim()) errors.countryCode = "Country code is required";
  if (!getString(formData, "review").trim()) errors.review = "Review is required";
  if (!getString(formData, "tripName").trim()) errors.tripName = "Trip name is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  await prisma.testimonial.create({
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

export default function AdminTestimonialNew() {
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;

  const inputClass =
    "w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded text-white placeholder-gray-500 hover:border-green-500 focus:outline-none focus:border-green-500 transition";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">New Testimonial</h1>
        <Link
          to="/admin/testimonials"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
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
              className={inputClass}
              placeholder="Reviewer name"
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
              className={inputClass}
              placeholder="Country"
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
              className={inputClass}
              placeholder="PK"
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
              defaultValue={5}
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
              className={inputClass}
              placeholder="e.g. K2 Base Camp Trek"
            />
            {errors?.tripName && (
              <p className="mt-1 text-sm text-red-400">{errors.tripName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Image URL (optional)
            </label>
            <input
              id="image"
              name="image"
              type="url"
              className={inputClass}
              placeholder="https://..."
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
            className={inputClass}
            placeholder="Review text"
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
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Create Testimonial
          </button>
        </div>
      </Form>
    </div>
  );
}
