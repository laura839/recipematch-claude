import { describe, expect, it } from "vitest";
import { CATEGORY_SLUGS } from "../lib/categories";
import { INGREDIENTS } from "./ingredients";
import { RECIPES } from "./recipes";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("seed data", () => {
  it("has 120–150 recipes", () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(120);
    expect(RECIPES.length).toBeLessThanOrEqual(150);
  });

  it("uses unique, well-formed recipe slugs", () => {
    const slugs = RECIPES.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(SLUG);
  });

  it("uses unique, well-formed ingredient slugs and names", () => {
    const slugs = INGREDIENTS.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(SLUG);
    const names = INGREDIENTS.map((i) => i.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  it("marks exactly salt, black pepper and water as staples", () => {
    const staples = INGREDIENTS.filter((i) => i.isStaple).map((i) => i.slug).sort();
    expect(staples).toEqual(["black-pepper", "salt", "water"]);
  });

  it("only references ingredients that exist, each at most once per recipe", () => {
    const known = new Set(INGREDIENTS.map((i) => i.slug));
    for (const recipe of RECIPES) {
      const used = recipe.ingredients.map(([slug]) => slug);
      for (const slug of used) expect(known.has(slug), `${recipe.slug} → unknown ingredient ${slug}`).toBe(true);
      expect(new Set(used).size, `${recipe.slug} has duplicate ingredients`).toBe(used.length);
    }
  });

  it("gives every recipe a valid category, prep time, quantities and steps", () => {
    for (const recipe of RECIPES) {
      expect(CATEGORY_SLUGS, recipe.slug).toContain(recipe.category);
      expect(recipe.name.trim().length, recipe.slug).toBeGreaterThan(0);
      expect(Number.isInteger(recipe.prepTimeMinutes) && recipe.prepTimeMinutes > 0, recipe.slug).toBe(true);
      expect(recipe.steps.length, recipe.slug).toBeGreaterThanOrEqual(2);
      for (const step of recipe.steps) expect(step.trim().length, recipe.slug).toBeGreaterThan(0);
      for (const [, quantity] of recipe.ingredients) expect(quantity.trim().length, recipe.slug).toBeGreaterThan(0);
    }
  });

  it("gives every recipe at least one non-staple ingredient", () => {
    const staples = new Set(INGREDIENTS.filter((i) => i.isStaple).map((i) => i.slug));
    for (const recipe of RECIPES) {
      expect(recipe.ingredients.some(([slug]) => !staples.has(slug)), recipe.slug).toBe(true);
    }
  });

  it("covers every category with several recipes", () => {
    for (const category of CATEGORY_SLUGS) {
      expect(RECIPES.filter((r) => r.category === category).length, category).toBeGreaterThanOrEqual(10);
    }
  });

  it("has no unused ingredients", () => {
    const used = new Set(RECIPES.flatMap((r) => r.ingredients.map(([slug]) => slug)));
    for (const ingredient of INGREDIENTS) expect(used.has(ingredient.slug), ingredient.slug).toBe(true);
  });
});
