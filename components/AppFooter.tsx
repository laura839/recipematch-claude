"use client";

import { useI18n } from "@/lib/use-i18n";

export function AppFooter() {
  const { t } = useI18n();

  return (
    // Extra bottom padding on mobile keeps the text clear of the fixed bottom tab bar.
    <footer className="border-t border-stone-200/80 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-stone-500">{t.footer.copyright}</div>
    </footer>
  );
}
