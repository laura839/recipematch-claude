"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="text-5xl" aria-hidden="true">😕</span>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Something went wrong</h1>
      <p className="mt-2 text-stone-600">Please try again in a moment.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Try again
      </button>
    </div>
  );
}
