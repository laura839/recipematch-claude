"use client";

import { CATEGORIES } from "@/lib/categories";
import { useI18n } from "@/lib/use-i18n";

type Props = { value: string; onChange: (value: string) => void };

export function CategoryFilter({ value, onChange }: Props) {
  const { t } = useI18n();
  const items = [{ slug: "all" as const, icon: "✨" }, ...CATEGORIES];
  return (
    <div role="radiogroup" aria-label={t.find.filterLabel} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {items.map((c) => {
        const active = value === c.slug;
        return (
          <button
            key={c.slug}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(c.slug)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition ${
              active ? "bg-stone-900 text-white ring-stone-900" : "bg-white text-stone-700 ring-stone-200 hover:bg-stone-50"
            }`}
          >
            <span aria-hidden="true">{c.icon}</span>
            {t.categories[c.slug]}
          </button>
        );
      })}
    </div>
  );
}
