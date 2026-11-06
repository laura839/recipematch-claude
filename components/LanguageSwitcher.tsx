"use client";

import { LANGUAGES, MESSAGES } from "@/lib/i18n";
import { useHydrated } from "@/lib/storage";
import { useI18n } from "@/lib/use-i18n";

/** Segmented ET / EN control. Switching only changes the stored language. */
export function LanguageSwitcher() {
  const { lang, setLanguage, t } = useI18n();
  const hydrated = useHydrated();

  return (
    <div
      role="radiogroup"
      aria-label={t.languageLabel}
      className={`relative inline-flex rounded-full bg-stone-100 p-0.5 ring-1 ring-stone-200 transition-opacity ${hydrated ? "" : "opacity-0"}`}
    >
      {LANGUAGES.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={MESSAGES[code].langName}
            lang={code}
            onClick={() => setLanguage(code)}
            className={`min-w-10 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              active ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
