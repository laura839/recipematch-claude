import type { Metadata, Viewport } from "next";
import { AppNav } from "@/components/AppNav";
import { LanguageSync } from "@/components/LanguageSync";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RecipeMatch — koka sellest, mis kodus olemas", template: "%s · RecipeMatch" },
  description:
    "Sisesta koostisosad, mis sul kodus olemas on, ja RecipeMatch leiab retseptid. Available in Estonian and English.",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body className="min-h-dvh font-sans">
        <LanguageSync />
        <AppNav />
        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:pb-16 md:pt-10">{children}</main>
      </body>
    </html>
  );
}
