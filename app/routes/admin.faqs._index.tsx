import { useLoaderData, Link, Form } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return faqs;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  if (formData.get("_action") === "delete") {
    const id = formData.get("id") as string;
    await prisma.fAQ.delete({ where: { id } });
    return { ok: true };
  }
  return null;
}

const categoryLabels: Record<string, string> = {
  GENERAL: "General",
  PREPARATION: "Preparation",
  LOGISTICS: "Logistics",
  SAFETY: "Safety",
  FINANCE: "Finance",
};

export default function AdminFaqsIndex() {
  const faqs = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">FAQs</h1>
        <Link
          to="/admin/faqs/new"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          Add FAQ
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Question</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {faqs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No FAQs yet.
                </td>
              </tr>
            )}
            {faqs.map((faq) => (
              <tr key={faq.id} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-white max-w-md truncate">{faq.question}</td>
                <td className="px-4 py-3 text-gray-300">
                  {categoryLabels[faq.category] || faq.category}
                </td>
                <td className="px-4 py-3 text-gray-300">{faq.sortOrder}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link
                    to={`/admin/faqs/${faq.id}/edit`}
                    className="text-sm px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                  >
                    Edit
                  </Link>
                  <Form method="post" className="inline">
                    <input type="hidden" name="id" value={faq.id} />
                    <button
                      type="submit"
                      name="_action"
                      value="delete"
                      className="text-sm px-3 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
                      onClick={(e) => {
                        if (!confirm("Delete this FAQ?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
