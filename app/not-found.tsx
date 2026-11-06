"use client";

import Link from "next/link";
import { useI18n } from "@/lib/use-i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="text-5xl" aria-hidden="true">🍽️</span>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">{t.notFound.title}</h1>
      <p className="mt-2 text-stone-600">{t.notFound.body}</p>
      <Link href="/" className="mt-6 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        {t.notFound.back}
      </Link>
    </div>
  );
}
