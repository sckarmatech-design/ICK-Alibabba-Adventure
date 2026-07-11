import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";
import { deleteImageFromStorage } from "~/lib/supabase.server";
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

type ActionResult = { ok: true } | { ok: false; error: string } | undefined;

const TABS = [
  { id: "main-nav", label: "Main Navigation" },
  { id: "footer-links", label: "Footer Links" },
  { id: "company-info", label: "Company Info" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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

  try {
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

    const existingCompanyInfo = await prisma.siteSetting.findUnique({
      where: { key: "companyInfo" },
    });
    const oldCompanyInfo =
      existingCompanyInfo && typeof existingCompanyInfo.value === "object"
        ? (existingCompanyInfo.value as Record<string, unknown>)
        : {};
    const oldLogo =
      typeof oldCompanyInfo.logo === "string" ? oldCompanyInfo.logo : "";
    const oldAboutImage =
      typeof oldCompanyInfo.aboutImage === "string"
        ? oldCompanyInfo.aboutImage
        : "";

    const newCompanyInfo =
      values.companyInfo && typeof values.companyInfo === "object"
        ? (values.companyInfo as Record<string, unknown>)
        : {};
    const newLogo =
      typeof newCompanyInfo.logo === "string" ? newCompanyInfo.logo : "";
    const newAboutImage =
      typeof newCompanyInfo.aboutImage === "string"
        ? newCompanyInfo.aboutImage
        : "";

    await Promise.all(
      SETTING_KEYS.map((key) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: values[key] as Prisma.InputJsonValue },
          create: { key, value: values[key] as Prisma.InputJsonValue },
        }),
      ),
    );

    console.log("Settings image cleanup:", {
      oldLogo,
      newLogo,
      oldAboutImage,
      newAboutImage,
      willDeleteLogo: !!(oldLogo && oldLogo !== newLogo),
      willDeleteAboutImage: !!(oldAboutImage && oldAboutImage !== newAboutImage),
    });

    if (oldLogo && oldLogo !== newLogo) {
      await deleteImageFromStorage(oldLogo);
    }
    if (oldAboutImage && oldAboutImage !== newAboutImage) {
      await deleteImageFromStorage(oldAboutImage);
    }

    return { ok: true } as const;
  } catch (err) {
    console.error("Failed to save settings:", err);
    return {
      ok: false,
      error: "Failed to save settings. Please try again.",
    } as const;
  }
}

export default function AdminSettings() {
  const settings = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionResult;
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state !== "idle" &&
    navigation.formMethod === "POST" &&
    navigation.formAction === "/admin/settings";

  const [activeTab, setActiveTab] = useState<TabId>("main-nav");

  // Auto-dismiss success after 4 seconds
  const [successVisible, setSuccessVisible] = useState(false);
  const lastActionRef = useRef<ActionResult>(undefined);
  useEffect(() => {
    if (actionData && actionData !== lastActionRef.current) {
      lastActionRef.current = actionData;
      if (actionData.ok) {
        setSuccessVisible(true);
        const timer = setTimeout(() => setSuccessVisible(false), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [actionData]);

  // Reset success visibility on a new submission attempt
  useEffect(() => {
    if (isSubmitting) {
      setSuccessVisible(false);
    }
  }, [isSubmitting]);

  const showError = actionData && !actionData.ok;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <Form
        method="post"
        className="bg-gray-900 border border-gray-800 rounded-lg p-6"
      >
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Settings sections"
          className="flex flex-wrap gap-1 mb-6 border-b border-gray-800"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-t ${
                  isActive
                    ? "border-green-500 text-white"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* All editors stay mounted so their state is preserved across
            tab switches; inactive panels are hidden, not unmounted. */}
        <div
          role="tabpanel"
          id="panel-main-nav"
          aria-labelledby="tab-main-nav"
          className={activeTab === "main-nav" ? "" : "hidden"}
        >
          <label className="block text-sm text-gray-400 mb-3">
            Main Navigation
          </label>
          <MainNavEditor
            name="mainNav"
            defaultValue={settings.mainNav as unknown as NavItem[]}
          />
        </div>

        <div
          role="tabpanel"
          id="panel-footer-links"
          aria-labelledby="tab-footer-links"
          className={activeTab === "footer-links" ? "" : "hidden"}
        >
          <label className="block text-sm text-gray-400 mb-3">
            Footer Links
          </label>
          <FooterLinksEditor
            name="footerLinks"
            defaultValue={settings.footerLinks as unknown as FooterLink[]}
          />
        </div>

        <div
          role="tabpanel"
          id="panel-company-info"
          aria-labelledby="tab-company-info"
          className={activeTab === "company-info" ? "" : "hidden"}
        >
          <label className="block text-sm text-gray-400 mb-3">
            Company Info
          </label>
          <CompanyInfoEditor
            name="companyInfo"
            defaultValue={settings.companyInfo as unknown as CompanyInfo}
          />
        </div>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 px-6 py-4 bg-gray-900/95 backdrop-blur border-t border-gray-800 rounded-b-lg flex flex-wrap items-center justify-between gap-4">
          <div className="grow min-w-0">
            {showError && (
              <div
                role="alert"
                className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                  className="shrink-0 mt-0.5"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M9 5v5M9 13v.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="grow">{actionData.error}</span>
              </div>
            )}
            {successVisible && !showError && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="8"
                    fill="currentColor"
                    opacity="0.2"
                  />
                  <path
                    d="M5 9l3 3 5-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="grow">Settings saved successfully</span>
                <button
                  type="button"
                  onClick={() => setSuccessVisible(false)}
                  className="text-green-300/70 hover:text-green-200 text-xs"
                  aria-label="Dismiss"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="shrink-0 px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg transition font-medium inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            {isSubmitting && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="animate-spin"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M8 2a6 6 0 0 1 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </Form>
    </div>
  );
}
