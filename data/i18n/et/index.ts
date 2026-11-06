import type { RecipeTranslation } from "../types";
import { breakfastEt } from "./breakfast";
import { dessertsEt } from "./desserts";
import { mainDishesEt } from "./main-dishes";
import { pastaEt } from "./pasta";
import { saladsEt } from "./salads";
import { soupsEt } from "./soups";
import { vegetarianEt } from "./vegetarian";

export { INGREDIENT_NAMES_ET } from "./ingredients";
export { translateQuantityEt } from "./quantity";

/** Estonian recipe names and steps, keyed by language-independent recipe slug. */
export const RECIPE_TRANSLATIONS_ET: Record<string, RecipeTranslation> = {
  ...breakfastEt,
  ...pastaEt,
  ...soupsEt,
  ...saladsEt,
  ...mainDishesEt,
  ...vegetarianEt,
  ...dessertsEt,
};
