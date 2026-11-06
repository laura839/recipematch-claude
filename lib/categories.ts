export type CategorySlug =
  | "breakfast"
  | "pasta"
  | "soups"
  | "salads"
  | "main-dishes"
  | "vegetarian"
  | "desserts";

export type Category = {
  slug: CategorySlug;
  name: string;
  icon: string;
  /** Tailwind classes for the placeholder tile background */
  tile: string;
  /** Tailwind classes for small category pills */
  pill: string;
};

export const CATEGORIES: readonly Category[] = [
  { slug: "breakfast", name: "Breakfast", icon: "🍳", tile: "from-amber-100 to-orange-200", pill: "bg-amber-50 text-amber-800 ring-amber-200" },
  { slug: "pasta", name: "Pasta", icon: "🍝", tile: "from-yellow-100 to-amber-200", pill: "bg-yellow-50 text-yellow-800 ring-yellow-200" },
  { slug: "soups", name: "Soups", icon: "🍲", tile: "from-orange-100 to-rose-200", pill: "bg-orange-50 text-orange-800 ring-orange-200" },
  { slug: "salads", name: "Salads", icon: "🥗", tile: "from-lime-100 to-emerald-200", pill: "bg-lime-50 text-lime-800 ring-lime-200" },
  { slug: "main-dishes", name: "Main Dishes", icon: "🍗", tile: "from-rose-100 to-red-200", pill: "bg-rose-50 text-rose-800 ring-rose-200" },
  { slug: "vegetarian", name: "Vegetarian", icon: "🥦", tile: "from-emerald-100 to-teal-200", pill: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  { slug: "desserts", name: "Desserts", icon: "🍰", tile: "from-pink-100 to-fuchsia-200", pill: "bg-pink-50 text-pink-800 ring-pink-200" },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as string[]).includes(value);
}

export function getCategory(slug: string): Category {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}
