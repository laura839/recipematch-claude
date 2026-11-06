import { describe, expect, it } from "vitest";
import { normalizeForSearch, searchIngredients } from "./ingredient-search";
import type { IngredientOption } from "./types";

const opt = (slug: string, en: string, et: string): IngredientOption => ({ slug, name: { en, et } });

const OPTIONS = [
  opt("eggs", "Eggs", "Munad"),
  opt("apples", "Apples", "Õunad"),
  opt("butter", "Butter", "Või"),
  opt("peanut-butter", "Peanut butter", "Maapähklivõi"),
  opt("mushrooms", "Mushrooms", "Seened"),
  opt("milk", "Milk", "Piim"),
  opt("bell-pepper", "Bell pepper", "Paprika"),
  opt("paprika", "Paprika", "Paprikapulber"),
];

const slugs = (list: IngredientOption[]) => list.map((o) => o.slug);

describe("searchIngredients", () => {
  it("finds ingredients by their Estonian name", () => {
    expect(slugs(searchIngredients(OPTIONS, "mun", "et"))).toEqual(["eggs"]);
  });

  it("finds ingredients by their English name in either language", () => {
    expect(slugs(searchIngredients(OPTIONS, "eggs", "et"))).toEqual(["eggs"]);
    expect(slugs(searchIngredients(OPTIONS, "munad", "en"))).toEqual(["eggs"]);
  });

  it("ignores case and Estonian diacritics", () => {
    expect(slugs(searchIngredients(OPTIONS, "OUN", "et"))).toEqual(["apples"]);
    expect(slugs(searchIngredients(OPTIONS, "voi", "et"))).toEqual(["butter", "peanut-butter"]);
  });

  it("ranks prefix matches in the active language first", () => {
    // "paprika": Estonian prefix matches bell pepper ("Paprika") and paprika powder ("Paprikapulber").
    expect(slugs(searchIngredients(OPTIONS, "paprika", "et"))).toEqual(["bell-pepper", "paprika"]);
    // In English, "Paprika" (the spice) is the exact prefix match; bell pepper only matches via Estonian.
    expect(slugs(searchIngredients(OPTIONS, "paprika", "en"))).toEqual(["paprika", "bell-pepper"]);
  });

  it("puts prefix matches before substring matches", () => {
    expect(slugs(searchIngredients(OPTIONS, "butter", "en"))).toEqual(["butter", "peanut-butter"]);
  });

  it("excludes already selected ingredients and respects the limit", () => {
    expect(slugs(searchIngredients(OPTIONS, "butter", "en", new Set(["butter"])))).toEqual(["peanut-butter"]);
    expect(searchIngredients(OPTIONS, "e", "en", new Set(), 2)).toHaveLength(2);
  });

  it("returns nothing for an empty query", () => {
    expect(searchIngredients(OPTIONS, "   ", "et")).toEqual([]);
  });

  it("normalizes text for search", () => {
    expect(normalizeForSearch("  Õunad Gruyère ")).toBe("ounad gruyere");
  });
});
