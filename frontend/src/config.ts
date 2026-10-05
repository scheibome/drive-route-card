import { DEFAULT_HEIGHT } from "./types.ts";

/** Google Maps-like defaults; deliberately not theme colors so editor preview and dashboard match. */
export const DEFAULT_FASTEST_COLOR = "#1a73e8";
export const DEFAULT_ALTERNATIVE_COLOR = "#8ab4f8";

/** Values the editor shows when the config doesn't set them. */
export const EDITOR_DEFAULTS: Record<string, unknown> = {
  height: DEFAULT_HEIGHT,
  show_alternatives: true,
  show_legend: true,
  show_labels: true,
  fastest_color: [26, 115, 232],
  alternative_color: [138, 180, 248],
  map_type: "roadmap",
  show_traffic: false,
  show_controls: true,
};

/** Keep the YAML minimal: drop empty values and values equal to the defaults. */
export function normalizeConfig(config: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(config).filter(
      ([key, value]) =>
        value !== undefined &&
        value !== "" &&
        // JSON comparison so [r, g, b] colors equal to the default are dropped too.
        JSON.stringify(EDITOR_DEFAULTS[key]) !== JSON.stringify(value),
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

/**
 * Google's JSON map styling (https://developers.google.com/maps/documentation/javascript/style-reference):
 * a list of { featureType?, elementType?, stylers: [...] } rules. Accepts the list itself (YAML or the
 * editor's code field) or the JSON as a string. Throws with a readable message when it can't be used.
 */
export function parseMapStyle(value: unknown): google.maps.MapTypeStyle[] | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  let styles = value;
  if (typeof value === "string") {
    try {
      styles = JSON.parse(value);
    } catch (err) {
      throw new Error(`map_style is not valid JSON: ${(err as Error).message}`);
    }
  }
  if (!Array.isArray(styles)) {
    throw new Error("map_style must be a list of style rules");
  }
  styles.forEach((rule, index) => {
    if (!rule || typeof rule !== "object" || !Array.isArray((rule as { stylers?: unknown }).stylers)) {
      throw new Error(`map_style rule ${index + 1} needs a "stylers" list`);
    }
  });
  return styles as google.maps.MapTypeStyle[];
}
