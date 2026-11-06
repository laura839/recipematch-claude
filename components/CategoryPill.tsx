"use client";

import { getCategory } from "@/lib/categories";
import { useI18n } from "@/lib/use-i18n";

export function CategoryPill({ category }: { category: string }) {
  const { t } = useI18n();
  const c = getCategory(category);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${c.pill}`}>
      {t.categories[c.slug]}
    </span>
  );
}
