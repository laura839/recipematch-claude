"use client";

import { computeMatch, type MatchIngredient } from "@/lib/match";
import { useHydrated, useSelectedIngredients } from "@/lib/storage";
import { CheckIcon, XIcon } from "./icons";
import { matchTone } from "./MatchBadge";

type Props = { ingredients: MatchIngredient[]; quantities: Record<string, string> };

export function IngredientGroups({ ingredients, quantities }: Props) {
  const hydrated = useHydrated();
  const [selected] = useSelectedIngredients();
  const selectedSlugs = new Set(hydrated ? selected.map((s) => s.slug) : []);

  // No ingredients selected → plain, complete list without grouping.
  if (selectedSlugs.size === 0) {
    return (
      <ul className="divide-y divide-stone-100">
        {ingredients.map((i) => <Row key={i.slug} ingredient={i} quantity={quantities[i.slug]} />)}
      </ul>
    );
  }

  const match = computeMatch({ slug: "", name: "", prepTimeMinutes: 0, ingredients }, selectedSlugs);
  const available = match?.available ?? [];
  const missing = match?.missing ?? [];
  const staples = ingredients.filter((i) => i.isStaple);

  return (
    <div className="space-y-5">
      {match && (
        <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-100">
          <span className="text-sm text-stone-700">
            You have <strong>{match.matchedCount}</strong> of <strong>{match.totalCount}</strong> ingredients
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${matchTone(match.percent)}`}>{match.percent}%</span>
        </div>
      )}
      <Group title="Available" tone="text-emerald-700" items={available} quantities={quantities} icon="check" empty="None of your ingredients are used here." />
      <Group title="Missing" tone="text-rose-600" items={missing} quantities={quantities} icon="x" empty="Nothing missing — you’re ready to cook!" />
      {staples.length > 0 && (
        <Group title="Staples (assumed)" tone="text-stone-500" items={staples} quantities={quantities} />
      )}
    </div>
  );
}

function Group({
  title, tone, items, quantities, icon, empty,
}: {
  title: string; tone: string; items: MatchIngredient[]; quantities: Record<string, string>; icon?: "check" | "x"; empty?: string;
}) {
  return (
    <div>
      <h3 className={`mb-1 text-xs font-semibold uppercase tracking-wide ${tone}`}>
        {title} <span className="font-normal text-stone-400">({items.length})</span>
      </h3>
      {items.length === 0 ? (
        <p className="py-2 text-sm text-stone-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {items.map((i) => <Row key={i.slug} ingredient={i} quantity={quantities[i.slug]} icon={icon} />)}
        </ul>
      )}
    </div>
  );
}

function Row({ ingredient, quantity, icon }: { ingredient: MatchIngredient; quantity?: string; icon?: "check" | "x" }) {
  return (
    <li className="flex items-center gap-3 py-2 text-sm">
      {icon === "check" && <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600" />}
      {icon === "x" && <XIcon className="h-4 w-4 shrink-0 text-rose-500" />}
      <span className="flex-1 text-stone-800">{ingredient.name}</span>
      {quantity && <span className="shrink-0 text-stone-500">{quantity}</span>}
    </li>
  );
}
