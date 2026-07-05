import { Form, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import type { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { getString, parseJsonField } from "~/lib/admin";
import {
  MainNavEditor,
  FooterLinksEditor,
  CompanyInfoEditor,
} from "~/components/admin-form-editors";
import type { NavItem, FooterLink, CompanyInfo } from "~/data/nav";

const SETTING_KEYS = ["mainNav", "footerLinks", "companyInfo"] as const;

type SettingsMap = {
  mainNav: Prisma.JsonValue;
  footerLinks: Prisma.JsonValue;
  companyInfo: Prisma.JsonValue;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [...SETTING_KEYS] } },
  });

  const map: Partial<SettingsMap> = {};
  for (const key of SETTING_KEYS) {
    const setting = settings.find((s) => s.key === key);
    map[key] = setting?.value ?? {};
  }

  return map as SettingsMap;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();

  const values = {
    mainNav: parseJsonField<Prisma.JsonValue>(
      getString(formData, "mainNav"),
      [],
    ),
    footerLinks: parseJsonField<Prisma.JsonValue>(
      getString(formData, "footerLinks"),
      [],
    ),
    companyInfo: parseJsonField<Prisma.JsonValue>(
      getString(formData, "companyInfo"),
      {},
    ),
  };

  await Promise.all(
    SETTING_KEYS.map((key) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: values[key] as Prisma.InputJsonValue },
        create: { key, value: values[key] as Prisma.InputJsonValue },
      }),
    ),
  );

  return { ok: true };
}

export default function AdminSettings() {
  const settings = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <Form
        method="post"
        className="max-w-3xl bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6"
      >
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Main Navigation
          </label>
          <MainNavEditor
            name="mainNav"
            defaultValue={settings.mainNav as unknown as NavItem[]}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Footer Links
          </label>
          <FooterLinksEditor
            name="footerLinks"
            defaultValue={settings.footerLinks as unknown as FooterLink[]}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Company Info
          </label>
          <CompanyInfoEditor
            name="companyInfo"
            defaultValue={settings.companyInfo as unknown as CompanyInfo}
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Save Settings
          </button>
        </div>
      </Form>
    </div>
  );
}
