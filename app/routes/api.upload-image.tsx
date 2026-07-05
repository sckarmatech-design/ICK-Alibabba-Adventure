import type { ActionFunctionArgs } from "react-router";
import { requireAdmin } from "~/lib/auth.server";
import { getString } from "~/lib/admin";
import { uploadImage } from "~/lib/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = getString(formData, "folder") || "misc";

  if (!file || file.size === 0) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const url = await uploadImage(file, folder);
    return Response.json({ url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Image upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
