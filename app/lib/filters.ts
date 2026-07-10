// Shared filtering helpers used by the home page and list routes.

export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export function monthIndex(month: string): number {
  return MONTHS.indexOf(month.toLowerCase() as (typeof MONTHS)[number]);
}

export function parseSeasonRange(
  season: string,
): { start: number; end: number } | null {
  const normalized = season
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  let start = -1;
  let end = -1;

  for (let i = 0; i < MONTHS.length; i++) {
    if (normalized.includes(MONTHS[i])) {
      if (start === -1) start = i;
      end = i;
    }
  }

  if (start === -1 || end === -1) return null;
  return { start, end };
}

export function matchesMonth(season: string, selectedMonth: string): boolean {
  if (!selectedMonth) return true;
  const selected = monthIndex(selectedMonth);
  if (selected === -1) return true;

  const range = parseSeasonRange(season);
  if (!range) {
    // Fallback: literal substring match if range can't be parsed
    return season.toLowerCase().includes(MONTHS[selected]);
  }

  return selected >= range.start && selected <= range.end;
}

export function parseAltitude(altitude: string): number | null {
  const match = altitude.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}
