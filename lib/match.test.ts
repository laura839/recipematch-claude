import { describe, expect, it } from "vitest";
import { compareRanked, computeMatch, rankRecipes, type MatchIngredient, type MatchableRecipe } from "./match";

const ing = (slug: string, isStaple = false): MatchIngredient => ({ slug, name: slug, isStaple });

function recipe(slug: string, ingredients: MatchIngredient[], prepTimeMinutes = 30, name = slug): MatchableRecipe {
  return { slug, name, prepTimeMinutes, ingredients };
}

describe("computeMatch", () => {
  it("calculates the percentage over non-staple ingredients only", () => {
    const r = recipe("omelette", [ing("eggs"), ing("cheddar"), ing("salt", true), ing("black-pepper", true)]);
    const m = computeMatch(r, new Set(["eggs"]))!;
    expect(m.percent).toBe(50);
    expect(m.matchedCount).toBe(1);
    expect(m.totalCount).toBe(2);
  });

  it("never lists staples as missing", () => {
    const r = recipe("soup", [ing("carrots"), ing("water", true), ing("salt", true)]);
    const m = computeMatch(r, new Set())!;
    expect(m.missing.map((i) => i.slug)).toEqual(["carrots"]);
    expect(m.staples.map((i) => i.slug)).toEqual(["water", "salt"]);
  });

  it("treats oil as a regular ingredient", () => {
    const r = recipe("fried-eggs", [ing("eggs"), ing("olive-oil")]);
    const m = computeMatch(r, new Set(["eggs"]))!;
    expect(m.missing.map((i) => i.slug)).toEqual(["olive-oil"]);
    expect(m.percent).toBe(50);
  });

  it("ignores selected staples", () => {
    const r = recipe("pasta", [ing("spaghetti"), ing("salt", true)]);
    const m = computeMatch(r, new Set(["salt"]))!;
    expect(m.matchedCount).toBe(0);
    expect(m.percent).toBe(0);
  });

  it("returns null for staple-only recipes", () => {
    const r = recipe("salt-water", [ing("salt", true), ing("water", true)]);
    expect(computeMatch(r, new Set(["salt", "water"]))).toBeNull();
  });

  it("rounds percentages to whole numbers", () => {
    const r = recipe("three", [ing("a"), ing("b"), ing("c")]);
    expect(computeMatch(r, new Set(["a"]))!.percent).toBe(33);
    expect(computeMatch(r, new Set(["a", "b"]))!.percent).toBe(67);
    expect(computeMatch(r, new Set(["a", "b", "c"]))!.percent).toBe(100);
  });
});

describe("rankRecipes", () => {
  it("only returns recipes with at least one matching ingredient", () => {
    const recipes = [recipe("match", [ing("eggs"), ing("milk")]), recipe("nomatch", [ing("beef"), ing("rice")])];
    expect(rankRecipes(recipes, ["eggs"]).map((r) => r.recipe.slug)).toEqual(["match"]);
  });

  it("excludes staple-only recipes even when staples are selected", () => {
    const recipes = [recipe("brine", [ing("salt", true), ing("water", true)]), recipe("eggs", [ing("eggs")])];
    expect(rankRecipes(recipes, ["salt", "water", "eggs"]).map((r) => r.recipe.slug)).toEqual(["eggs"]);
  });

  it("returns nothing when no ingredients are selected", () => {
    expect(rankRecipes([recipe("a", [ing("eggs")])], [])).toEqual([]);
  });

  it("sorts by highest match percentage first", () => {
    const recipes = [
      recipe("half", [ing("a"), ing("b")]), // 50%
      recipe("full", [ing("a")]), // 100%
      recipe("third", [ing("a"), ing("x"), ing("y")]), // 33%
    ];
    expect(rankRecipes(recipes, ["a"]).map((r) => r.recipe.slug)).toEqual(["full", "half", "third"]);
  });

  it("breaks percentage ties by fewest missing ingredients", () => {
    const recipes = [
      recipe("big", [ing("a"), ing("b"), ing("x"), ing("y")]), // 2/4 = 50%, 2 missing
      recipe("small", [ing("a"), ing("x")]), // 1/2 = 50%, 1 missing
    ];
    expect(rankRecipes(recipes, ["a", "b"]).map((r) => r.recipe.slug)).toEqual(["small", "big"]);
  });

  it("breaks remaining ties by shortest preparation time", () => {
    const recipes = [
      recipe("slow", [ing("a"), ing("x")], 60),
      recipe("fast", [ing("a"), ing("y")], 15),
    ];
    expect(rankRecipes(recipes, ["a"]).map((r) => r.recipe.slug)).toEqual(["fast", "slow"]);
  });

  it("uses exact ratios, not rounded percentages, for ordering", () => {
    // 2/3 = 66.67% vs 67/100 = 67% — both round to 67, but 67/100 is higher.
    const many = Array.from({ length: 100 }, (_, i) => ing(`i${i}`));
    const selected = many.slice(0, 67).map((i) => i.slug);
    const recipes = [recipe("two-thirds", [ing("i0"), ing("i1"), ing("zz")], 5), recipe("hundred", many, 90)];
    expect(rankRecipes(recipes, selected).map((r) => r.recipe.slug)).toEqual(["hundred", "two-thirds"]);
  });

  it("is deterministic for full ties (alphabetical by name)", () => {
    const recipes = [recipe("b", [ing("a")], 10, "Beta"), recipe("a", [ing("a")], 10, "Alpha")];
    expect(rankRecipes(recipes, ["a"]).map((r) => r.recipe.name)).toEqual(["Alpha", "Beta"]);
  });

  it("exposes a comparator consistent with rankRecipes", () => {
    const ranked = rankRecipes([recipe("x", [ing("a")]), recipe("y", [ing("a"), ing("b")])], ["a"]);
    expect(compareRanked(ranked[0], ranked[1])).toBeLessThan(0);
  });
});
