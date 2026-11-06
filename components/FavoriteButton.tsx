"use client";

import { useFavorites, useHydrated } from "@/lib/storage";
import { useI18n } from "@/lib/use-i18n";
import { HeartIcon } from "./icons";

type Props = { slug: string; name: string; variant?: "overlay" | "inline" };

export function FavoriteButton({ slug, name, variant = "overlay" }: Props) {
  const { favorites, toggleFavorite } = useFavorites();
  const hydrated = useHydrated();
  const { t } = useI18n();
  const active = hydrated && favorites.includes(slug);
  const label = active ? t.favorite.remove(name) : t.favorite.save(name);

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => toggleFavorite(slug)}
        aria-pressed={active}
        aria-label={label}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
          active
            ? "bg-rose-50 text-rose-600 ring-rose-200 hover:bg-rose-100"
            : "bg-white text-stone-700 ring-stone-200 hover:bg-stone-50"
        }`}
      >
        <HeartIcon filled={active} className="h-4 w-4" />
        {active ? t.favorite.saved : t.favorite.saveShort}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:scale-110 active:scale-95 ${
        active ? "text-rose-500" : "text-stone-500 hover:text-rose-500"
      }`}
    >
      <HeartIcon filled={active} className="h-5 w-5" />
    </button>
  );
}
