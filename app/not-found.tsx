import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="text-5xl" aria-hidden="true">🍽️</span>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Recipe not found</h1>
      <p className="mt-2 text-stone-600">This page doesn’t exist or the recipe has moved.</p>
      <Link href="/" className="mt-6 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Back to recipes
      </Link>
    </div>
  );
}
