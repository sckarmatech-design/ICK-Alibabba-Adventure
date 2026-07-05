import { redirect, Form, Link } from "react-router";
import type { ActionFunctionArgs } from "react-router";
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

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  await prisma.fAQ.create({
    data: {
      category: getString(formData, "category") as (typeof FAQ_CATEGORIES)[number],
      question: getString(formData, "question"),
      answer: getString(formData, "answer"),
      sortOrder: getNumber(formData, "sortOrder"),
    },
  });

  return redirect("/admin/faqs");
}

export default function AdminFaqsNew() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Add FAQ</h1>
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
            defaultValue={0}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Create FAQ
          </button>
          <Link
            to="/admin/faqs"
            className="text-gray-400 hover:text-white transition"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
