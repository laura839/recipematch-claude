import { describe, expect, it } from "vitest";
import { isUnsplashUrl, unsplashLoader } from "./image-loader";

describe("unsplashLoader", () => {
  it("requests a resized, auto-format image from the Unsplash CDN", () => {
    const url = new URL(unsplashLoader({ src: "https://images.unsplash.com/photo-1612182062633-9ff3b3598e96", width: 640 }));
    expect(url.hostname).toBe("images.unsplash.com");
    expect(url.pathname).toBe("/photo-1612182062633-9ff3b3598e96");
    expect(url.searchParams.get("w")).toBe("640");
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("fit")).toBe("crop");
    expect(url.searchParams.get("q")).toBe("70");
  });

  it("respects an explicit quality and replaces existing size params", () => {
    const url = new URL(unsplashLoader({ src: "https://images.unsplash.com/photo-1?w=9999", width: 384, quality: 50 }));
    expect(url.searchParams.get("w")).toBe("384");
    expect(url.searchParams.get("q")).toBe("50");
  });

  it("recognizes only Unsplash CDN URLs", () => {
    expect(isUnsplashUrl("https://images.unsplash.com/photo-1")).toBe(true);
    expect(isUnsplashUrl("https://example.com/photo.jpg")).toBe(false);
    expect(isUnsplashUrl("not a url")).toBe(false);
  });
});
