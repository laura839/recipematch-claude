import { getCategory } from "@/lib/categories";

type Props = { category: string; imageUrl?: string | null; name: string; size?: "card" | "hero" };

/** Category-themed placeholder tile; shows the recipe photo instead if one exists. */
export function RecipePlaceholder({ category, imageUrl, name, size = "card" }: Props) {
  const c = getCategory(category);
  const height = size === "hero" ? "h-48 sm:h-64" : "h-36";

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt={name} className={`${height} w-full object-cover`} loading="lazy" />
    );
  }

  return (
    <div className={`relative ${height} w-full overflow-hidden bg-gradient-to-br ${c.tile}`} aria-hidden="true">
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/25" />
      <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-white/20" />
      <div className="absolute inset-0 grid place-items-center">
        <span
          className={`grid place-items-center rounded-full bg-white/70 shadow-sm ring-1 ring-white ${
            size === "hero" ? "h-24 w-24 text-5xl" : "h-16 w-16 text-3xl"
          } transition-transform duration-300 group-hover:scale-110`}
        >
          {c.icon}
        </span>
      </div>
    </div>
  );
}
