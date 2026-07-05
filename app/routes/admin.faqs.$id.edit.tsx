import { redirect, Form, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getNumber } from "~/lib/admin";

const FAQ_CATEGORIES = [
  "GENERAL",
  "PREPARATION",
  "LOGISTICS",
  "SAFETY",
  "FINANCE",
] as const;

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const faq = await prisma.fAQ.findUnique({
    where: { id: params.id },
  });
  if (!faq) throw new Response("Not Found", { status: 404 });
  return faq;
}

export async function action({ params, request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    await prisma.fAQ.delete({ where: { id: params.id } });
    return redirect("/admin/faqs");
  }

  await prisma.fAQ.update({
    where: { id: params.id },
    data: {
      category: getString(formData, "category") as (typeof FAQ_CATEGORIES)[number],
      question: getString(formData, "question"),
      answer: getString(formData, "answer"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
  });

  return redirect("/admin/faqs");
}

export default function AdminFaqsEdit() {
  const faq = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Edit FAQ</h1>
        <Link
          to="/admin/faqs"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form method="post" className="max-w-2xl space-y-6 bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={faq.category}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            {FAQ_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-1">
            Question
          </label>
          <input
            id="question"
            name="question"
            type="text"
            required
            defaultValue={faq.question}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-300 mb-1">
            Answer
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={6}
            required
            defaultValue={faq.answer}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-300 mb-1">
            Sort Order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={faq.sortOrder}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              Save Changes
            </button>
            <Link
              to="/admin/faqs"
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </Link>
          </div>
          <button
            type="submit"
            name="_action"
            value="delete"
            className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg transition"
            onClick={(e) => {
              if (!confirm("Delete this FAQ?")) {
                e.preventDefault();
              }
            }}
          >
            Delete
          </button>
        </div>
      </Form>
    </div>
  );
}
