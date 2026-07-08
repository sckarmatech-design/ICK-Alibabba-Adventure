import { Form, Link, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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
    try {
      await prisma.fAQ.delete({ where: { id: params.id } });
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
      return {
        ok: false,
        error: "Failed to delete FAQ. Please try again.",
      } as const;
    }
    // Use redirect import would create a circular dep here, but the page
    // intentionally stays put after delete so the admin sees the error if any;
    // a successful delete should be rare to fail and the admin can navigate back.
    return { ok: true } as const;
  }

  try {
    await prisma.fAQ.update({
      where: { id: params.id },
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
    console.error("Failed to update FAQ:", err);
    return {
      ok: false,
      error: "Failed to save FAQ. Please try again.",
    } as const;
  }
}

export default function AdminFaqsEdit() {
  const faq = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: `/admin/faqs/${faq.id}/edit` },
  );

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

      <Form
        method="post"
        id={`faq-edit-form-${faq.id}`}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
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
            defaultValue={faq.question}
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
            defaultValue={faq.answer}
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
            defaultValue={faq.sortOrder}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <AdminSaveBar
          formId={`faq-edit-form-${faq.id}`}
          isSubmitting={isSubmitting}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/faqs"
          saveLabel="Save Changes"
          submittingLabel="Saving…"
          deleteButton={{
            label: "Delete FAQ",
            confirmMessage: "Delete this FAQ? This cannot be undone.",
          }}
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
