import { Form, Link, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getNumber } from "~/lib/admin";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

const FAQ_CATEGORIES = [
  "GENERAL",
  "PREPARATION",
  "LOGISTICS",
  "SAFETY",
  "FINANCE",
] as const;

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  try {
    await prisma.fAQ.create({
      data: {
        category: getString(
          formData,
          "category",
        ) as (typeof FAQ_CATEGORIES)[number],
        question: getString(formData, "question"),
        answer: getString(formData, "answer"),
        sortOrder: getNumber(formData, "sortOrder"),
      },
    });
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to create FAQ:", err);
    return {
      ok: false,
      error: "Failed to create FAQ. Please try again.",
    } as const;
  }
}

export default function AdminFaqsNew() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/faqs/new" },
  );
  const [uploading] = useState(false);

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

      <Form
        method="post"
        id="faq-new-form"
        className="max-w-2xl bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
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
            defaultValue={0}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <AdminSaveBar
          formId="faq-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/faqs"
          saveLabel="Create FAQ"
          submittingLabel="Creating…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
