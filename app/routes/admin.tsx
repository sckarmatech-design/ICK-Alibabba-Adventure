import { useState } from "react";
import { Outlet, useLoaderData, Link, Form } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Menu, X } from "lucide-react";
import prisma from "~/lib/prisma.server";
import { requireAdmin } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAdmin(request);
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  return { user };
}

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/trips", label: "Trips" },
  { to: "/admin/expeditions", label: "Expeditions" },
  { to: "/admin/tours", label: "Tours" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/faqs", label: "FAQs" },
  { to: "/admin/destinations", label: "Destinations" },
  { to: "/admin/hero", label: "Hero" },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar: mobile drawer + desktop permanent column */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col overflow-y-auto
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="text-xl font-bold mb-8">
          <span className="text-green-500">Akhtar</span> CMS
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* User info is duplicated in the desktop top bar; show here only on mobile drawer */}
        <div className="mt-auto pt-8 border-t border-gray-800 lg:hidden">
          <p className="text-sm text-gray-400">{user?.name}</p>
          <Form method="post" action="/admin/logout">
            <button
              type="submit"
              className="text-sm text-red-400 hover:text-red-300 mt-1"
            >
              Logout
            </button>
          </Form>
        </div>
      </aside>

      {/* Backdrop (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between p-4 border-b border-gray-800 lg:justify-end">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            className="lg:hidden text-white p-2 rounded hover:bg-gray-800"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="lg:hidden text-xl font-bold">
            <span className="text-green-500">Akhtar</span> CMS
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <p className="text-sm text-gray-400">{user?.name}</p>
            <Form method="post" action="/admin/logout">
              <button
                type="submit"
                className="text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </Form>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
