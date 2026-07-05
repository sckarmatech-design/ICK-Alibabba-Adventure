import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { clearSessionCookie } from "~/lib/auth.server";

export async function action(_request: ActionFunctionArgs) {
  return redirect("/login", {
    headers: { "Set-Cookie": clearSessionCookie() },
  });
}

export async function loader() {
  return redirect("/login");
}
