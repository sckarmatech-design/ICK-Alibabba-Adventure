import { Form, Link, useActionData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { useState } from "react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, getNumber } from "~/lib/admin";
import { ImageInput } from "~/components/ImageInput";
import { AdminSaveBar } from "~/components/AdminSaveBar";
import { useAdminSaveState } from "~/lib/use-admin-save-state";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  try {
    await prisma.heroSlide.create({
      data: {
        title: getString(formData, "title"),
        subtitle: getString(formData, "subtitle"),
        image: getString(formData, "image"),
        cta: getString(formData, "cta"),
        ctaLink: getString(formData, "ctaLink"),
        sortOrder: getNumber(formData, "sortOrder"),
      },
    });
    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to create hero slide:", err);
    return {
      ok: false,
      error: "Failed to create hero slide. Please try again.",
    } as const;
  }
}

export default function AdminHeroNew() {
  const actionData = useActionData<typeof action>();
  const { isSubmitting, successVisible, setSuccessVisible } = useAdminSaveState(
    actionData,
    { formAction: "/admin/hero/new" },
  );
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">New Hero Slide</h1>
        <Link
          to="/admin/hero"
          className="text-gray-400 hover:text-white transition"
        >
          Back to list
        </Link>
      </div>

      <Form
        method="post"
        id="hero-new-form"
        className="max-w-3xl bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="K2 Base Camp Trek"
            />
          </div>

          <div>
            <label
              htmlFor="subtitle"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Subtitle
            </label>
            <input
              id="subtitle"
              name="subtitle"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="Walk across the legendary Baltoro Glacier"
            />
          </div>

          <div>
            <label
              htmlFor="cta"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              CTA Button Text
            </label>
            <input
              id="cta"
              name="cta"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="Explore Trek"
            />
          </div>

          <div>
            <label
              htmlFor="ctaLink"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              CTA Link
            </label>
            <input
              id="ctaLink"
              name="ctaLink"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="/trips/k2-base-camp-trek"
            />
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Display Order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              required
              defaultValue={0}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <ImageInput
              name="image"
              label="Hero Image"
              folder="hero"
              onLoadingChange={setUploading}
            />
          </div>
        </div>

        <AdminSaveBar
          formId="hero-new-form"
          isSubmitting={isSubmitting}
          isUploading={uploading}
          successVisible={successVisible}
          errorMessage={
            actionData && "ok" in actionData && !actionData.ok
              ? actionData.error
              : undefined
          }
          cancelHref="/admin/hero"
          saveLabel="Create Slide"
          submittingLabel="Creating…"
          onDismissSuccess={() => setSuccessVisible(false)}
        />
      </Form>
    </div>
  );
}
