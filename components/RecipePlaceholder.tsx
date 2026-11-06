"use client";

import Image from "next/image";
import { useState } from "react";
import { getCategory } from "@/lib/categories";
import { isUnsplashUrl, unsplashLoader } from "@/lib/image-loader";

type Props = { category: string; imageUrl?: string | null; name: string; size?: "card" | "hero" };

const SIZES = {
  card: "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw",
  hero: "(min-width: 768px) 768px, 100vw",
};

/**
 * Recipe photo with the category placeholder underneath. The placeholder stays
 * visible while the photo loads, and permanently if there is no photo or it
 * fails to load.
 */
export function RecipePlaceholder({ category, imageUrl, name, size = "card" }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const height = size === "hero" ? "h-56 sm:h-80" : "h-40";
  const showPhoto = Boolean(imageUrl) && !failed;

  return (
    <div className={`relative ${height} w-full overflow-hidden`}>
      <CategoryTile category={category} size={size} />
      {showPhoto && imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes={SIZES[size]}
          priority={size === "hero"}
          loader={isUnsplashUrl(imageUrl) ? unsplashLoader : undefined}
          unoptimized={!isUnsplashUrl(imageUrl)}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-cover transition duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

function CategoryTile({ category, size }: { category: string; size: "card" | "hero" }) {
  const c = getCategory(category);
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${c.tile}`} aria-hidden="true">
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/25" />
      <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-white/20" />
      <div className="absolute inset-0 grid place-items-center">
        <span
          className={`grid place-items-center rounded-full bg-white/70 shadow-sm ring-1 ring-white ${
            size === "hero" ? "h-24 w-24 text-5xl" : "h-16 w-16 text-3xl"
          }`}
        >
          {c.icon}
        </span>
      </div>
    </div>
  );
}
