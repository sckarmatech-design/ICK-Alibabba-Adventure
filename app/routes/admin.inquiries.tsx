import { Form, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { submissions };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const id = formData.get("id");

  if (typeof id === "string") {
    await prisma.contactSubmission.delete({ where: { id } });
  }

  return null;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminInquiries() {
  const { submissions } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Inquiries</h1>
        <Link to="/admin" className="text-gray-400 hover:text-white transition">
          Back to dashboard
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Trip Interest</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-400 min-w-0 truncate">
                  {formatDate(submission.createdAt)}
                </td>
                <td className="px-4 py-3 text-white font-medium min-w-0 truncate">
                  {submission.fullName}
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-green-400 hover:text-green-300 truncate inline-block max-w-full"
                  >
                    {submission.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  {submission.phone ? (
                    <a
                      href={`tel:${submission.phone}`}
                      className="text-green-400 hover:text-green-300 truncate inline-block max-w-full"
                    >
                      {submission.phone}
                    </a>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  {submission.tripInterest || (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-300 min-w-0 truncate">
                  {submission.message || (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Form
                    method="post"
                    className="inline"
                    onSubmit={(e) => {
                      if (!confirm("Delete this inquiry?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={submission.id} />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
                    >
                      Delete
                    </button>
                  </Form>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
