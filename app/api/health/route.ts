import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Railway health check. Only reports healthy when the database is reachable
 * and has been migrated and seeded, so a deploy with an empty or unreachable
 * database is never marked successful.
 */
export async function GET() {
  try {
    const [recipes, ingredients] = await Promise.all([prisma.recipe.count(), prisma.ingredient.count()]);
    if (recipes === 0 || ingredients === 0) {
      return Response.json({ status: "error", reason: "database is empty (seed has not run)", recipes, ingredients }, { status: 503 });
    }
    return Response.json({ status: "ok", recipes, ingredients });
  } catch (error) {
    console.error("Health check: database unavailable", error);
    const reason = process.env.DATABASE_URL ? "database unreachable or not migrated" : "DATABASE_URL is not set";
    return Response.json({ status: "error", reason }, { status: 503 });
  }
}
