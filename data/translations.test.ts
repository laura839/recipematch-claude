import { describe, expect, it } from "vitest";
import { INGREDIENT_NAMES_ET, RECIPE_TRANSLATIONS_ET, translateQuantityEt } from "./i18n/et";
import { INGREDIENTS } from "./ingredients";
import { RECIPES } from "./recipes";

describe("Estonian recipe translations", () => {
  it("translates every recipe, and nothing else", () => {
    const recipeSlugs = RECIPES.map((r) => r.slug).sort();
    expect(Object.keys(RECIPE_TRANSLATIONS_ET).sort()).toEqual(recipeSlugs);
  });

  it("has a name and the same number of non-empty steps as the English version", () => {
    for (const recipe of RECIPES) {
      const et = RECIPE_TRANSLATIONS_ET[recipe.slug];
      expect(et.name.trim().length, recipe.slug).toBeGreaterThan(0);
      expect(et.steps.length, `${recipe.slug} step count`).toBe(recipe.steps.length);
      for (const step of et.steps) expect(step.trim().length, recipe.slug).toBeGreaterThan(0);
    }
  });

  it("actually translates the steps (no step left identical to English)", () => {
    for (const recipe of RECIPES) {
      const et = RECIPE_TRANSLATIONS_ET[recipe.slug];
      et.steps.forEach((step, i) => expect(step, `${recipe.slug} step ${i + 1}`).not.toBe(recipe.steps[i]));
    }
  });

  it("uses unique Estonian recipe names", () => {
    const names = Object.values(RECIPE_TRANSLATIONS_ET).map((t) => t.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  it("keeps English content unchanged alongside Estonian", () => {
    const pancakes = RECIPES.find((r) => r.slug === "fluffy-pancakes")!;
    expect(pancakes.name).toBe("Fluffy Pancakes");
    expect(RECIPE_TRANSLATIONS_ET["fluffy-pancakes"].name).toBe("Kohevad pannkoogid");
  });
});

describe("Estonian ingredient names", () => {
  it("names every ingredient, and nothing else", () => {
    expect(Object.keys(INGREDIENT_NAMES_ET).sort()).toEqual(INGREDIENTS.map((i) => i.slug).sort());
  });

  it("uses non-empty, unique names", () => {
    const names = Object.values(INGREDIENT_NAMES_ET);
    for (const name of names) expect(name.trim().length).toBeGreaterThan(0);
    expect(new Set(names.map((n) => n.toLowerCase())).size).toBe(names.length);
  });

  it("distinguishes bell pepper from paprika powder", () => {
    expect(INGREDIENT_NAMES_ET["bell-pepper"]).toBe("Paprika");
    expect(INGREDIENT_NAMES_ET.paprika).toBe("Paprikapulber");
  });
});

describe("translateQuantityEt", () => {
  it.each([
    ["2 pcs", "2 tk"],
    ["1/2 pc", "1/2 tk"],
    ["2 tbsp", "2 spl"],
    ["1/2 tsp", "1/2 tl"],
    ["200 g", "200 g"],
    ["1.5 l", "1,5 l"],
    ["1 clove", "1 küüs"],
    ["3 cloves", "3 küünt"],
    ["1 handful", "1 peotäis"],
    ["2 handfuls", "2 peotäit"],
    ["4 slices", "4 viilu"],
    ["1 pinch", "1 näpuotsatäis"],
    ["2 stalks", "2 vart"],
    ["1 small head", "1 väike pea"],
    ["1/2 head", "1/2 pead"],
    ["400 g cooked", "400 g keedetud"],
    ["1 can", "1 purk"],
    ["to taste", "maitse järgi"],
  ])("%s → %s", (input, expected) => {
    expect(translateQuantityEt(input)).toBe(expected);
  });

  it("translates every quantity used in the seed data without leftover English units", () => {
    const english = /\b(pcs?|tbsp|tsp|cloves?|handfuls?|slices?|pinch|stalks?|sprigs?|head|small|large|taste|can|fillets|leaves|sheet|thumb|piece|ripe|frozen|cooked)\b/;
    for (const recipe of RECIPES) {
      for (const [slug, quantity] of recipe.ingredients) {
        const et = translateQuantityEt(quantity);
        expect(et, `${recipe.slug}/${slug}: "${quantity}"`).not.toMatch(english);
      }
    }
  });

  it("rejects unknown units instead of guessing", () => {
    expect(() => translateQuantityEt("2 buckets")).toThrow(/Unknown quantity unit/);
  });
});
