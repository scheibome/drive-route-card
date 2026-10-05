const STRINGS = {
  en: {
    route: "Route",
    min: "min",
    entity_missing: "Entity not found",
  },
  de: {
    route: "Route",
    min: "Min.",
    entity_missing: "Entität nicht gefunden",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["en"];

export function localize(language: string, key: StringKey): string {
  const base = language.split("-")[0] as keyof typeof STRINGS;
  return (STRINGS[base] ?? STRINGS.en)[key];
}
