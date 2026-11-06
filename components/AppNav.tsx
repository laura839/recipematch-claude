"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefIcon, HeartIcon, SearchIcon } from "./icons";
import { useFavorites, useHydrated } from "@/lib/storage";

const LINKS = [
  { href: "/", label: "Find Recipes", Icon: SearchIcon },
  { href: "/favorites", label: "Favorites", Icon: HeartIcon },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" || pathname.startsWith("/recipes") : pathname.startsWith(href);
}

export function AppNav() {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const hydrated = useHydrated();
  const favoriteCount = hydrated ? favorites.length : 0;

  return (
    <>
      {/* Top bar (desktop shows links; mobile shows brand only) */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-stone-900">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <ChefIcon className="h-5 w-5" />
            </span>
            <span className="text-lg">Recipe<span className="text-emerald-600">Match</span></span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ href, label, Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    active ? "bg-emerald-50 text-emerald-700" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {href === "/favorites" && favoriteCount > 0 && (
                    <span className="rounded-full bg-emerald-600 px-1.5 text-xs font-semibold text-white">{favoriteCount}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Bottom tab bar (mobile) */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <div className="grid grid-cols-2">
          {LINKS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                  active ? "text-emerald-700" : "text-stone-500"
                }`}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  {href === "/favorites" && favoriteCount > 0 && (
                    <span className="absolute -right-2.5 -top-1 min-w-4 rounded-full bg-emerald-600 px-1 text-center text-[10px] font-semibold leading-4 text-white">
                      {favoriteCount}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
