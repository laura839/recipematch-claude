"use client";

import { useEffect } from "react";
import { MESSAGES, pick } from "./i18n";
import { useLanguage } from "./storage";
import type { Localized } from "./types";

/** Current language, its messages, and a helper to pick localized text. */
export function useI18n() {
  const [lang, setLanguage] = useLanguage();
  return {
    lang,
    setLanguage,
    t: MESSAGES[lang],
    pick: (text: Localized) => pick(text, lang),
  };
}

/** Keeps the browser tab title in sync with the selected language. */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    if (title) document.title = title.includes("RecipeMatch") ? title : `${title} · RecipeMatch`;
  }, [title]);
}
