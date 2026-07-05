import { Outlet, useLoaderData, Link, Form } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
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

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="text-xl font-bold mb-8">
          <span className="text-green-500">Akhtar</span> CMS
        </div>
        <nav className="space-y-2 flex-1">
          <Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-800">
            Dashboard
          </Link>
          <Link to="/admin/trips" className="block px-3 py-2 rounded hover:bg-gray-800">
            Trips
          </Link>
          <Link to="/admin/expeditions" className="block px-3 py-2 rounded hover:bg-gray-800">
            Expeditions
          </Link>
          <Link to="/admin/tours" className="block px-3 py-2 rounded hover:bg-gray-800">
            Tours
          </Link>
          <Link to="/admin/blog" className="block px-3 py-2 rounded hover:bg-gray-800">
            Blog
          </Link>
          <Link to="/admin/gallery" className="block px-3 py-2 rounded hover:bg-gray-800">
            Gallery
          </Link>
          <Link to="/admin/testimonials" className="block px-3 py-2 rounded hover:bg-gray-800">
            Testimonials
          </Link>
          <Link to="/admin/team" className="block px-3 py-2 rounded hover:bg-gray-800">
            Team
          </Link>
          <Link to="/admin/faqs" className="block px-3 py-2 rounded hover:bg-gray-800">
            FAQs
          </Link>
          <Link to="/admin/destinations" className="block px-3 py-2 rounded hover:bg-gray-800">
            Destinations
          </Link>
          <Link to="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-800">
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">{user?.name}</p>
          <Form method="post" action="/admin/logout">
            <button type="submit" className="text-sm text-red-400 hover:text-red-300 mt-1">
              Logout
            </button>
          </Form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
