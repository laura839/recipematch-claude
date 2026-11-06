import type { CategorySlug } from "./categories";
import type { Lang, Localized } from "./types";

export const LANGUAGES: readonly Lang[] = ["et", "en"];
export const DEFAULT_LANGUAGE: Lang = "et";

export function isLang(value: unknown): value is Lang {
  return value === "et" || value === "en";
}

export function pick(text: Localized, lang: Lang): string {
  return text[lang] || text.en;
}

const en = {
  langName: "English",
  languageLabel: "Language",
  switchTo: "Switch language",
  meta: {
    title: "RecipeMatch — cook with what you have",
    favoritesTitle: "Favorites",
  },
  nav: { find: "Find Recipes", favorites: "Favorites", home: "RecipeMatch home" },
  categories: {
    all: "All Categories",
    breakfast: "Breakfast",
    pasta: "Pasta",
    soups: "Soups",
    salads: "Salads",
    "main-dishes": "Main Dishes",
    vegetarian: "Vegetarian",
    desserts: "Desserts",
  } satisfies Record<CategorySlug | "all", string>,
  find: {
    title: "What’s in your kitchen?",
    subtitle: "Add the ingredients you have and we’ll find recipes you can cook right now.",
    inputLabel: "Add an ingredient you have",
    placeholder: "Type an ingredient, e.g. eggs, rice, tomatoes",
    placeholderLoading: "Loading ingredients…",
    suggestions: "Ingredient suggestions",
    noIngredientFound: (query: string) => `No ingredient found for “${query}”.`,
    loading: "Loading…",
    loadIngredientsError: "Couldn’t load ingredients.",
    tryAgain: "Try again",
    selected: "Selected ingredients",
    remove: (name: string) => `Remove ${name}`,
    clearAll: "Clear all",
    staplesHint: "Salt, pepper and water are assumed — no need to add them.",
    filterLabel: "Filter by category",
  },
  results: {
    count: (total: number, ingredients: number) =>
      `${total} ${total === 1 ? "recipe matches" : "recipes match"} your ${ingredients} ${ingredients === 1 ? "ingredient" : "ingredients"}`,
    browsing: (category: string) => `Browsing all ${category} recipes. Add ingredients to see what you can cook.`,
    noMatchesTitle: "No matches yet",
    noMatchesCategory: (category: string) =>
      `No ${category} recipes match your ingredients. Try All Categories or add more ingredients.`,
    noMatchesAll: "No recipes match your ingredients yet. Try adding a few more.",
    errorTitle: "Something went wrong",
    errorBody: "We couldn’t load recipes right now.",
    showMore: (left: number) => `Show more (${left} left)`,
    loading: "Loading…",
  },
  empty: {
    title: "Add what’s in your fridge to get started",
    body: "Pick a few ingredients above and we’ll rank recipes by how much you already have — and show what’s missing.",
    browseHint: "Or choose a category to browse recipes.",
  },
  card: {
    match: (percent: number) => `${percent}% match`,
    missing: (count: number) => `Missing ${count}:`,
    haveEverything: "You have everything",
    minutes: (minutes: number) => `${minutes} min`,
  },
  favorite: {
    save: (name: string) => `Save ${name} to favorites`,
    remove: (name: string) => `Remove ${name} from favorites`,
    saved: "Saved",
    saveShort: "Save",
  },
  favorites: {
    title: "Favorites",
    subtitle: "Recipes you’ve saved on this device.",
    matchNote: "Match percentages use your current ingredients.",
    emptyTitle: "No favorites yet",
    emptyBody: "Tap the heart on any recipe to save it here for later.",
    findRecipes: "Find recipes",
    loadError: "We couldn’t load your favorites right now.",
  },
  detail: {
    back: "Back to recipes",
    ingredients: "Ingredients",
    instructions: "Instructions",
    haveOf: (matched: number, total: number) => `You have ${matched} of ${total} ingredients`,
    available: "Available",
    missing: "Missing",
    staples: "Staples (assumed)",
    noneAvailable: "None of your ingredients are used here.",
    nothingMissing: "Nothing missing — you’re ready to cook!",
  },
  notFound: {
    title: "Recipe not found",
    body: "This page doesn’t exist or the recipe has moved.",
    back: "Back to recipes",
  },
  error: {
    title: "Something went wrong",
    body: "Please try again in a moment.",
    retry: "Try again",
  },
};

export type Messages = typeof en;

const et: Messages = {
  langName: "Eesti",
  languageLabel: "Keel",
  switchTo: "Vaheta keelt",
  meta: {
    title: "RecipeMatch — koka sellest, mis kodus olemas",
    favoritesTitle: "Lemmikud",
  },
  nav: { find: "Leia retsepte", favorites: "Lemmikud", home: "RecipeMatch avaleht" },
  categories: {
    all: "Kõik kategooriad",
    breakfast: "Hommikusöök",
    pasta: "Pasta",
    soups: "Supid",
    salads: "Salatid",
    "main-dishes": "Pearoad",
    vegetarian: "Taimetoit",
    desserts: "Magustoidud",
  },
  find: {
    title: "Mis sul köögis on?",
    subtitle: "Lisa koostisosad, mis sul kodus olemas on, ja me leiame retseptid, mida saad kohe valmistada.",
    inputLabel: "Lisa koostisosa, mis sul olemas on",
    placeholder: "Kirjuta koostisosa, nt munad, riis, tomatid",
    placeholderLoading: "Koostisosade laadimine…",
    suggestions: "Koostisosade soovitused",
    noIngredientFound: (query: string) => `Koostisosa „${query}“ ei leitud.`,
    loading: "Laadimine…",
    loadIngredientsError: "Koostisosade laadimine ebaõnnestus.",
    tryAgain: "Proovi uuesti",
    selected: "Valitud koostisosad",
    remove: (name: string) => `Eemalda ${name}`,
    clearAll: "Tühjenda kõik",
    staplesHint: "Sool, pipar ja vesi on eeldatavasti olemas — neid pole vaja lisada.",
    filterLabel: "Filtreeri kategooria järgi",
  },
  results: {
    count: (total: number, ingredients: number) =>
      `Leitud ${total} ${total === 1 ? "retsept" : "retsepti"} sinu ${ingredients} koostisosa põhjal`,
    browsing: (category: string) =>
      `Kõik retseptid kategoorias „${category}“. Lisa koostisosad, et näha, mida saad valmistada.`,
    noMatchesTitle: "Sobivaid retsepte veel pole",
    noMatchesCategory: (category: string) =>
      `Kategoorias „${category}“ ei leidu sinu koostisosadega sobivaid retsepte. Vali „Kõik kategooriad“ või lisa koostisosi.`,
    noMatchesAll: "Sinu koostisosadega sobivaid retsepte veel pole. Proovi lisada veel mõni.",
    errorTitle: "Midagi läks valesti",
    errorBody: "Retseptide laadimine ebaõnnestus.",
    showMore: (left: number) => `Näita rohkem (veel ${left})`,
    loading: "Laadimine…",
  },
  empty: {
    title: "Alustamiseks lisa, mis sul külmkapis on",
    body: "Vali ülalt mõned koostisosad ja me järjestame retseptid selle järgi, kui palju sul juba olemas on — ning näitame, mis puudu jääb.",
    browseHint: "Või vali kategooria, et retsepte sirvida.",
  },
  card: {
    match: (percent: number) => `${percent}% sobivus`,
    missing: (count: number) => `Puudu (${count}):`,
    haveEverything: "Kõik on olemas",
    minutes: (minutes: number) => `${minutes} min`,
  },
  favorite: {
    save: (name: string) => `Lisa „${name}“ lemmikutesse`,
    remove: (name: string) => `Eemalda „${name}“ lemmikutest`,
    saved: "Salvestatud",
    saveShort: "Salvesta",
  },
  favorites: {
    title: "Lemmikud",
    subtitle: "Selles seadmes salvestatud retseptid.",
    matchNote: "Sobivuse protsent arvestab sinu praegu valitud koostisosi.",
    emptyTitle: "Lemmikuid veel pole",
    emptyBody: "Puuduta mis tahes retsepti juures südant, et see siia hilisemaks salvestada.",
    findRecipes: "Leia retsepte",
    loadError: "Lemmikute laadimine ebaõnnestus.",
  },
  detail: {
    back: "Tagasi retseptide juurde",
    ingredients: "Koostisosad",
    instructions: "Valmistamine",
    haveOf: (matched: number, total: number) => `Sul on olemas ${matched} koostisosa ${total}-st`,
    available: "Olemas",
    missing: "Puudu",
    staples: "Põhiained (eeldatavasti olemas)",
    noneAvailable: "Ühtegi sinu koostisosa siin ei kasutata.",
    nothingMissing: "Midagi pole puudu — võid kohe alustada!",
  },
  notFound: {
    title: "Retsepti ei leitud",
    body: "Seda lehte ei ole olemas või retsept on teisaldatud.",
    back: "Tagasi retseptide juurde",
  },
  error: {
    title: "Midagi läks valesti",
    body: "Palun proovi mõne hetke pärast uuesti.",
    retry: "Proovi uuesti",
  },
};

export const MESSAGES: Record<Lang, Messages> = { en, et };
