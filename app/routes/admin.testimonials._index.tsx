import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, Link } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
  return testimonials;
}

export default function AdminTestimonialsIndex() {
  const testimonials = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Testimonials</h1>
        <Link
          to="/admin/testimonials/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          New Testimonial
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-100 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Trip</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {testimonials.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No testimonials yet.
                </td>
              </tr>
            )}
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-white">
                  {testimonial.name}
                </td>
                <td className="px-4 py-3">
                  {testimonial.country} ({testimonial.countryCode})
                </td>
                <td className="px-4 py-3">
                  <span className="text-yellow-400">{"★".repeat(testimonial.rating)}</span>
                  <span className="text-gray-600">{"★".repeat(5 - testimonial.rating)}</span>
                </td>
                <td className="px-4 py-3">{testimonial.tripName}</td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {testimonial.review}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-3">
                    <Link
                      to={`/admin/testimonials/${testimonial.id}/edit`}
                      className="text-green-400 hover:text-green-300 font-medium"
                    >
                      Edit
                    </Link>
                    <Form
                      method="post"
                      action={`/admin/testimonials/${testimonial.id}/edit`}
                      className="inline"
                    >
                      <button
                        type="submit"
                        name="_action"
                        value="delete"
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
