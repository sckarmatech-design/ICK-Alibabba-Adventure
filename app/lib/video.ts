// Architecture decision: Videos are external links only.
// They are never uploaded to Supabase Storage; only images use Supabase Storage.
// Videos are displayed as click-through thumbnail cards, not inline embeds.

export function getYoutubeThumbnailUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }
  return null;
}
