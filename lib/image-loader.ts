import type { ImageLoaderProps } from "next/image";

const UNSPLASH_HOST = "images.unsplash.com";

export function isUnsplashUrl(src: string): boolean {
  try {
    return new URL(src).hostname === UNSPLASH_HOST;
  } catch {
    return false;
  }
}

/**
 * Responsive image URLs served by Unsplash's image CDN: next/image asks for
 * each width in its srcset and the CDN resizes, crops and converts to
 * WebP/AVIF (auto=format). This keeps image work off the Railway server.
 */
export function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  return url.toString();
}
