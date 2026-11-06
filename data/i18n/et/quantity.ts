/**
 * Rule-based translation of recipe quantities into Estonian.
 * Numbers and metric units stay as they are; household units are translated,
 * using the singular after "1" and the partitive form after other amounts
 * (e.g. "1 pc" → "1 tk", "2 cloves" → "2 küünt", "1 clove" → "1 küüs").
 */

type Unit = { one: string; many: string };

const UNITS: Record<string, Unit> = {
  pc: { one: "tk", many: "tk" },
  pcs: { one: "tk", many: "tk" },
  tbsp: { one: "spl", many: "spl" },
  tsp: { one: "tl", many: "tl" },
  g: { one: "g", many: "g" },
  kg: { one: "kg", many: "kg" },
  ml: { one: "ml", many: "ml" },
  l: { one: "l", many: "l" },
  "g cooked": { one: "g keedetud", many: "g keedetud" },
  can: { one: "purk", many: "purki" },
  clove: { one: "küüs", many: "küünt" },
  cloves: { one: "küüs", many: "küünt" },
  fillets: { one: "filee", many: "fileed" },
  frozen: { one: "külmutatud", many: "külmutatud" },
  ripe: { one: "küps", many: "küpset" },
  large: { one: "suur", many: "suurt" },
  handful: { one: "peotäis", many: "peotäit" },
  handfuls: { one: "peotäis", many: "peotäit" },
  "small handful": { one: "väike peotäis", many: "väikest peotäit" },
  head: { one: "pea", many: "pead" },
  "large head": { one: "suur pea", many: "suurt pead" },
  "small head": { one: "väike pea", many: "väikest pead" },
  leaves: { one: "leht", many: "lehte" },
  sheet: { one: "leht", many: "lehte" },
  slices: { one: "viil", many: "viilu" },
  pinch: { one: "näpuotsatäis", many: "näpuotsatäit" },
  sprig: { one: "oks", many: "oksa" },
  sprigs: { one: "oks", many: "oksa" },
  stalk: { one: "vars", many: "vart" },
  stalks: { one: "vars", many: "vart" },
  thumb: { one: "pöidlasuurune tükk", many: "pöidlasuurust tükki" },
  "small piece": { one: "väike tükk", many: "väikest tükki" },
};

const PHRASES: Record<string, string> = {
  "to taste": "maitse järgi",
};

export function translateQuantityEt(quantity: string): string {
  const trimmed = quantity.trim();
  if (PHRASES[trimmed]) return PHRASES[trimmed];

  const match = /^(\d+(?:[.,]\d+)?(?:\/\d+)?)\s*(.*)$/.exec(trimmed);
  if (!match) throw new Error(`Cannot translate quantity "${quantity}"`);
  const [, amount, unitText] = match;
  const amountEt = amount.replace(".", ",");
  if (unitText === "") return amountEt;

  const unit = UNITS[unitText];
  if (!unit) throw new Error(`Unknown quantity unit "${unitText}" in "${quantity}"`);
  return `${amountEt} ${amount === "1" ? unit.one : unit.many}`;
}
