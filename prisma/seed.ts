/**
 * Idempotent seed: runs on every Railway deploy (pre-deploy step).
 * - Ingredients and recipes are upserted by their unique slug.
 * - Nothing is ever deleted: recipes or ingredients removed from the seed
 *   files simply stay in the database.
 * - A recipe's ingredient list is replaced with the one from the seed file,
 *   so edits to quantities or ingredients are applied on the next deploy.
 */
import { PrismaClient } from "@prisma/client";
import { INGREDIENTS } from "../data/ingredients";
import { RECIPES } from "../data/recipes";

const prisma = new PrismaClient();

async function main() {
  const ingredientIds = new Map<string, number>();

  for (const ingredient of INGREDIENTS) {
    const data = { name: ingredient.name, isStaple: ingredient.isStaple ?? false };
    const row = await prisma.ingredient.upsert({
      where: { slug: ingredient.slug },
      create: { slug: ingredient.slug, ...data },
      update: data,
      select: { id: true },
    });
    ingredientIds.set(ingredient.slug, row.id);
  }

  for (const recipe of RECIPES) {
    const links = recipe.ingredients.map(([slug, quantity], position) => {
      const ingredientId = ingredientIds.get(slug);
      if (ingredientId === undefined) {
        throw new Error(`Recipe "${recipe.slug}" uses unknown ingredient "${slug}"`);
      }
      return { ingredientId, quantity, position };
    });

    const data = {
      name: recipe.name,
      category: recipe.category,
      prepTimeMinutes: recipe.prepTimeMinutes,
      steps: [...recipe.steps],
      imageUrl: recipe.imageUrl ?? null,
    };

    await prisma.recipe.upsert({
      where: { slug: recipe.slug },
      create: { slug: recipe.slug, ...data, ingredients: { create: links } },
      update: { ...data, ingredients: { deleteMany: {}, create: links } },
    });
  }

  console.log(`Seed complete: ${INGREDIENTS.length} ingredients, ${RECIPES.length} recipes upserted.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
