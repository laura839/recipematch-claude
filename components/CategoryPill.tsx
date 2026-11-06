import { getCategory } from "@/lib/categories";

export function CategoryPill({ category }: { category: string }) {
  const c = getCategory(category);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${c.pill}`}>
      {c.name}
    </span>
  );
}
