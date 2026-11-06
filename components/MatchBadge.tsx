"use client";

import { useI18n } from "@/lib/use-i18n";

export function matchTone(percent: number) {
  if (percent >= 80) return "bg-emerald-600 text-white";
  if (percent >= 50) return "bg-amber-400 text-amber-950";
  return "bg-white text-stone-700 ring-1 ring-stone-200";
}

export function MatchBadge({ percent }: { percent: number }) {
  const { t } = useI18n();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${matchTone(percent)}`}>
      {t.card.match(percent)}
    </span>
  );
}
