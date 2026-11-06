const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Parses a comma-separated list of slugs, dropping anything invalid. */
export function parseSlugList(value: string | null, max = 100): string[] {
  if (!value) return [];
  const unique = new Set<string>();
  for (const part of value.split(",")) {
    const slug = part.trim().toLowerCase();
    if (slug.length > 0 && slug.length <= 80 && SLUG_PATTERN.test(slug)) unique.add(slug);
    if (unique.size >= max) break;
  }
  return [...unique];
}

/** Parses a non-negative integer with an upper bound; falls back on invalid input. */
export function parseBoundedInt(value: string | null, fallback: number, max: number): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) return fallback;
  return Math.min(n, max);
}
