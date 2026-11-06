import { describe, expect, it } from "vitest";
import { CATEGORY_SLUGS } from "./categories";
import { DEFAULT_LANGUAGE, isLang, LANGUAGES, MESSAGES, pick } from "./i18n";

type Tree = { [key: string]: unknown };

function shape(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) return shape(value as Tree, path);
    return [`${path}:${typeof value}`];
  });
}

function leaves(tree: Tree): unknown[] {
  return Object.values(tree).flatMap((v) => (typeof v === "object" && v !== null ? leaves(v as Tree) : [v]));
}

describe("UI translations", () => {
  it("supports exactly Estonian and English, defaulting to Estonian", () => {
    expect([...LANGUAGES].sort()).toEqual(["en", "et"]);
    expect(DEFAULT_LANGUAGE).toBe("et");
  });

  it("has identical keys (and value types) in both languages", () => {
    expect(shape(MESSAGES.et as unknown as Tree).sort()).toEqual(shape(MESSAGES.en as unknown as Tree).sort());
  });

  it("has no empty strings", () => {
    for (const lang of LANGUAGES) {
      for (const value of leaves(MESSAGES[lang] as unknown as Tree)) {
        if (typeof value === "string") expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("actually translates (Estonian differs from English for most texts)", () => {
    const enLeaves = leaves(MESSAGES.en as unknown as Tree).filter((v): v is string => typeof v === "string");
    const etLeaves = leaves(MESSAGES.et as unknown as Tree).filter((v): v is string => typeof v === "string");
    const same = enLeaves.filter((v, i) => v === etLeaves[i]);
    // Only language-neutral words like "Pasta" may coincide.
    expect(same.length).toBeLessThanOrEqual(2);
  });

  it("names every category in both languages", () => {
    for (const lang of LANGUAGES) {
      for (const slug of [...CATEGORY_SLUGS, "all"] as const) {
        expect(MESSAGES[lang].categories[slug].length).toBeGreaterThan(0);
      }
    }
  });

  it("formats dynamic texts in both languages", () => {
    expect(MESSAGES.en.card.match(83)).toBe("83% match");
    expect(MESSAGES.et.card.match(83)).toBe("83% sobivus");
    expect(MESSAGES.en.results.count(1, 1)).toBe("1 recipe matches your 1 ingredient");
    expect(MESSAGES.en.results.count(23, 4)).toBe("23 recipes match your 4 ingredients");
    expect(MESSAGES.et.results.count(1, 1)).toBe("Leitud 1 retsept sinu 1 koostisosa põhjal");
    expect(MESSAGES.et.results.count(23, 4)).toBe("Leitud 23 retsepti sinu 4 koostisosa põhjal");
    expect(MESSAGES.et.detail.haveOf(5, 7)).toBe("Sul on olemas 5 koostisosa 7-st");
  });

  it("validates language codes and picks localized text with English fallback", () => {
    expect(isLang("et")).toBe(true);
    expect(isLang("en")).toBe(true);
    expect(isLang("de")).toBe(false);
    expect(isLang(null)).toBe(false);
    expect(pick({ en: "Eggs", et: "Munad" }, "et")).toBe("Munad");
    expect(pick({ en: "Eggs", et: "Munad" }, "en")).toBe("Eggs");
    expect(pick({ en: "Eggs", et: "" }, "et")).toBe("Eggs");
  });
});
