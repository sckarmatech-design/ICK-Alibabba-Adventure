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
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ink">
            <span className="text-accent">Akhtar</span> CMS
          </h1>
          <p className="text-muted mt-2">Sign in to manage your content</p>
        </div>

        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded placeholder-muted hover:border-accent focus:outline-none focus:border-accent transition"
              placeholder="admin@akhtarabbasi.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-muted mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded placeholder-muted hover:border-accent focus:outline-none focus:border-accent transition"
              placeholder="••••••••"
            />
          </div>

          {actionData?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {actionData.error}
            </div>
          )}

          {/* CTA — fixed brand green */}
          <button
            type="submit"
            className="w-full px-6 py-2 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-semibold"
          >
            Sign In
          </button>
        </Form>
      </div>
    </div>
  );
}
