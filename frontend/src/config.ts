import { DEFAULT_HEIGHT } from "./types.ts";

/** Values the editor shows when the config doesn't set them. */
export const EDITOR_DEFAULTS = {
  height: DEFAULT_HEIGHT,
  show_alternatives: true,
  show_legend: true,
  show_labels: true,
} as const;

/** Keep the YAML minimal: drop empty values and values equal to the defaults. */
export function normalizeConfig(config: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(config).filter(
      ([key, value]) =>
        value !== undefined &&
        value !== "" &&
        EDITOR_DEFAULTS[key as keyof typeof EDITOR_DEFAULTS] !== value,
    ),
  );
}

/** A color from YAML (any CSS color) or from the editor's color picker ([r, g, b]). */
export type ColorValue = string | number[];

export function toCssColor(value: ColorValue | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value.length === 3 ? `rgb(${value.join(", ")})` : undefined;
  }
  return value?.trim() || undefined;
}

/** The editor's color picker needs [r, g, b]; convert hex strings, keep everything else. */
export function toRgb(value: ColorValue | undefined): ColorValue | undefined {
  if (typeof value !== "string") return value;
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return value;
  const hex =
    match[1].length === 3
      ? [...match[1]].map((c) => c + c).join("")
      : match[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}
