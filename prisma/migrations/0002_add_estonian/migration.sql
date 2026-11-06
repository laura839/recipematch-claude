-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "nameEt" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "nameEt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stepsEt" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "quantityEt" TEXT NOT NULL DEFAULT '';

