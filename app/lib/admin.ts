export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getString(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (value === null) return "";
  return String(value);
}

export function getOptionalString(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  if (value === null || String(value) === "") return undefined;
  return String(value);
}

export function getNumber(formData: FormData, name: string): number {
  const value = formData.get(name);
  if (value === null) return 0;
  return Number(value) || 0;
}

export function getArray(formData: FormData, name: string): string[] {
  const value = formData.get(name);
  if (value === null || String(value) === "") return [];
  return String(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseJsonField<T>(value: string, fallback: T): T {
  if (!value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formatJsonField(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
