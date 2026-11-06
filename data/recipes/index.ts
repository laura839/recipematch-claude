import type { SeedRecipe } from "../types";
import { breakfast } from "./breakfast";
import { pasta } from "./pasta";
import { soups } from "./soups";
import { salads } from "./salads";
import { mainDishes } from "./main-dishes";
import { vegetarian } from "./vegetarian";
import { desserts } from "./desserts";

export const RECIPES: SeedRecipe[] = [
  ...breakfast,
  ...pasta,
  ...soups,
  ...salads,
  ...mainDishes,
  ...vegetarian,
  ...desserts,
];
