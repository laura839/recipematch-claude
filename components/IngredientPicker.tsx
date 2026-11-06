"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { IngredientOption } from "@/lib/types";
import { SearchIcon, XIcon } from "./icons";

type Props = {
  options: IngredientOption[];
  optionsStatus: "loading" | "ready" | "error";
  selected: IngredientOption[];
  onChange: (next: IngredientOption[]) => void;
  onRetry: () => void;
};

const MAX_SUGGESTIONS = 8;

export function IngredientPicker({ options, optionsStatus, selected, onChange, onRetry }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const taken = new Set(selected.map((s) => s.slug));
    const starts: IngredientOption[] = [];
    const contains: IngredientOption[] = [];
    for (const option of options) {
      if (taken.has(option.slug)) continue;
      const name = option.name.toLowerCase();
      if (name.startsWith(q)) starts.push(option);
      else if (name.includes(q)) contains.push(option);
    }
    return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
  }, [query, options, selected]);

  const showList = open && query.trim().length > 0;

  function add(option: IngredientOption) {
    onChange([...selected, option]);
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function remove(slug: string) {
    onChange(selected.filter((s) => s.slug !== slug));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      if (showList && suggestions[activeIndex]) {
        event.preventDefault();
        add(suggestions[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Backspace" && query === "" && selected.length > 0) {
      remove(selected[selected.length - 1].slug);
    }
  }

  return (
    <div>
      <label htmlFor={`${listId}-input`} className="sr-only">
        Add an ingredient you have
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          aria-activedescendant={showList && suggestions[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={optionsStatus === "loading" ? "Loading ingredients…" : "Type an ingredient, e.g. eggs, rice, tomatoes"}
          disabled={optionsStatus === "error"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className="h-14 w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-base text-stone-900 shadow-sm ring-1 ring-stone-200 transition placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-50"
        />

        {showList && (
          <ul
            id={`${listId}-list`}
            role="listbox"
            aria-label="Ingredient suggestions"
            className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-stone-200"
          >
            {suggestions.length === 0 ? (
              <li className="px-3 py-3 text-sm text-stone-500">
                {optionsStatus === "loading" ? "Loading…" : <>No ingredient found for “{query.trim()}”.</>}
              </li>
            ) : (
              suggestions.map((option, index) => (
                <li
                  key={option.slug}
                  id={`${listId}-opt-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm ${
                    index === activeIndex ? "bg-emerald-50 text-emerald-800" : "text-stone-700"
                  }`}
                >
                  {option.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {optionsStatus === "error" && (
        <p className="mt-2 text-sm text-rose-600">
          Couldn’t load ingredients.{" "}
          <button type="button" onClick={onRetry} className="font-medium underline underline-offset-2">
            Try again
          </button>
        </p>
      )}

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ul className="contents" aria-label="Selected ingredients">
            {selected.map((item) => (
              <li key={item.slug}>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 py-1 pl-3 pr-1 text-sm font-medium text-white shadow-sm">
                  {item.name}
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    aria-label={`Remove ${item.name}`}
                    className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-white/20"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onChange([])}
            className="px-2 py-1 text-sm font-medium text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
