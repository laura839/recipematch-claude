import type { Metadata, Viewport } from "next";
import { AppNav } from "@/components/AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RecipeMatch — cook with what you have", template: "%s · RecipeMatch" },
  description:
    "Enter the ingredients you already have and RecipeMatch finds recipes ranked by how much you can cook right now.",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh font-sans">
        <AppNav />
        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:pb-16 md:pt-10">{children}</main>
      </body>
    </html>
  );
}
