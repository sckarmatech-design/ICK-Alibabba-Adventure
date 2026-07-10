import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).",
  );
  process.exit(1);
}

const BUCKET = "akhtar_hikings";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata?: { size?: number; mimetype?: string };
}

async function listAllFiles(prefix = ""): Promise<StorageFile[]> {
  const files: StorageFile[] = [];
  let cursor: string | undefined;

  do {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, {
        limit: 1000,
        offset: cursor ? parseInt(cursor, 10) : 0,
      });

    if (error) {
      throw new Error(`Failed to list prefix "${prefix}": ${error.message}`);
    }

    if (!data || data.length === 0) break;

    for (const item of data) {
      // Folders return an object with no id/size metadata; recurse into them.
      if (!item.id) {
        const subPrefix = prefix ? `${prefix}/${item.name}` : item.name;
        const subFiles = await listAllFiles(subPrefix);
        files.push(...subFiles);
      } else {
        files.push({
          name: prefix ? `${prefix}/${item.name}` : item.name,
          id: item.id,
          updated_at: item.updated_at,
          created_at: item.created_at,
          metadata: item.metadata as StorageFile["metadata"],
        });
      }
    }

    // If we got a full page, there may be more; otherwise we're done.
    cursor = data.length === 1000 ? String((cursor ? parseInt(cursor, 10) : 0) + 1000) : undefined;
  } while (cursor);

  return files;
}

async function main() {
  console.log(`Listing files in bucket: ${BUCKET}`);
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log("-".repeat(80));

  const files = await listAllFiles();
  const sorted = files.sort((a, b) => a.name.localeCompare(b.name));

  for (const file of sorted) {
    const size = file.metadata?.size ?? 0;
    const sizeDisplay =
      size > 1024 * 1024
        ? `${(size / (1024 * 1024)).toFixed(2)} MB`
        : size > 1024
          ? `${(size / 1024).toFixed(2)} KB`
          : `${size} B`;
    console.log(`${file.name} (${sizeDisplay})`);
  }

  console.log("-".repeat(80));
  console.log(`Total files: ${sorted.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
