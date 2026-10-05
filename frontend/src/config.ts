import { DEFAULT_HEIGHT } from "./types.ts";

/** Values the editor shows when the config doesn't set them. */
export const EDITOR_DEFAULTS = {
  height: DEFAULT_HEIGHT,
  show_alternatives: true,
  show_legend: true,
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
