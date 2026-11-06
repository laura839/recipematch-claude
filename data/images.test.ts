import { describe, expect, it } from "vitest";
import { photoPageUrl, photoUrl, RECIPE_PHOTOS } from "./images";
import { RECIPES } from "./recipes";

const entries = Object.entries(RECIPE_PHOTOS);

describe("recipe photos", () => {
  it("covers 85 of the 134 recipes; the rest keep placeholders", () => {
    expect(entries).toHaveLength(85);
    expect(RECIPES.filter((r) => !RECIPE_PHOTOS[r.slug])).toHaveLength(RECIPES.length - 85);
  });

  it("only references existing recipes", () => {
    const slugs = new Set(RECIPES.map((r) => r.slug));
    for (const [slug] of entries) expect(slugs.has(slug), slug).toBe(true);
  });

  it("uses a different photo for every recipe", () => {
    const ids = entries.map(([, p]) => p.photoId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses well-formed Unsplash CDN ids and photo pages, with a credited photographer", () => {
    for (const [slug, photo] of entries) {
      expect(photo.photoId, slug).toMatch(/^photo-\d+-[0-9a-f]{12}$/);
      expect(photo.page, slug).toMatch(/^[\w-]+$/);
      expect(photo.photographer.trim().length, slug).toBeGreaterThan(0);
      expect(photoUrl(photo)).toBe(`https://images.unsplash.com/${photo.photoId}`);
      expect(photoPageUrl(photo)).toMatch(/^https:\/\/unsplash\.com\/photos\/[\w-]+$/);
    }
  });

  it("prioritizes common dishes", () => {
    for (const slug of ["fluffy-pancakes", "spaghetti-bolognese", "classic-carbonara", "greek-salad", "caesar-salad", "chicken-curry", "beef-tacos", "chocolate-chip-cookies", "banana-bread", "tomato-soup"]) {
      expect(RECIPE_PHOTOS[slug], slug).toBeDefined();
    }
  });
});
