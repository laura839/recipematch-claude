"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/storage";

/** Keeps <html lang> in sync with the selected language (for screen readers and hyphenation). */
export function LanguageSync() {
  const [lang] = useLanguage();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
