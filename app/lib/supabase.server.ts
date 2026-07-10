import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Architecture decision: This client is for image uploads only.
// Videos are stored as external links (YouTube URLs), never uploaded to Supabase Storage.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).",
  );
}

const SUPABASE_URL = supabaseUrl;
const SUPABASE_KEY = supabaseKey;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKET = "akhtar_hikings";

function getStoragePathFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const projectUrl = new URL(SUPABASE_URL);
    if (urlObj.hostname !== projectUrl.hostname) return null;

    const publicPrefix = `/storage/v1/object/public/${BUCKET}/`;
    if (!urlObj.pathname.startsWith(publicPrefix)) return null;

    return decodeURIComponent(urlObj.pathname.slice(publicPrefix.length));
  } catch {
    return null;
  }
}

export async function deleteImageFromStorage(
  url: string | null | undefined,
): Promise<void> {
  const path = getStoragePathFromUrl(url ?? "");
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error(`Failed to delete storage file ${path}:`, error.message);
  }
}

export async function deleteImagesFromStorage(
  urls: (string | null | undefined)[],
): Promise<void> {
  const paths: string[] = [];
  for (const url of urls) {
    const path = getStoragePathFromUrl(url ?? "");
    if (path) paths.push(path);
  }
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error("Failed to delete storage files:", error.message, paths);
  }
}

export async function uploadImage(
  file: File,
  folder: string = "gallery",
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const extension = mimeToExt[file.type] || file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return publicUrl;
}
