import { useActionData, useLoaderData, Form, redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import bcrypt from "bcryptjs";
import prisma from "~/lib/prisma.server";
import {
  createSessionCookie,
  createToken,
  getSessionUser,
} from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getSessionUser(request);
  if (user) {
    return redirect("/admin");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email or password" };
  }

  const token = await createToken(user.id);
  const cookie = createSessionCookie(token);

  return redirect("/admin", {
    headers: { "Set-Cookie": cookie },
  });
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111827] border border-[#1f2937] rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-[#16a34a]">Akhtar</span> CMS
          </h1>
          <p className="text-[#9ca3af] mt-2">Sign in to manage your content</p>
        </div>

        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#9ca3af] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
              placeholder="admin@akhtarabbasi.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#9ca3af] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
              placeholder="••••••••"
            />
          </div>

          {actionData?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {actionData.error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-semibold"
          >
            Sign In
          </button>
        </Form>
      </div>
    </div>
  );
}
