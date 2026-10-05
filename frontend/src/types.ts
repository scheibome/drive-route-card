export const DEFAULT_HEIGHT = 400;

/** Minimal subset of Home Assistant's frontend types used by the card. */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  language: string;
}

export interface DriveRouteCardConfig {
  type: string;
  /** The integration's "fastest travel time" sensor; it carries the map data. */
  entity?: string;
  /** Browser key for the Maps JavaScript API (restrict it to your HA URL). */
  api_key?: string;
  title?: string;
  /** Map height in pixels. */
  height?: number;
  show_alternatives?: boolean;
  show_legend?: boolean;
  /** Time/distance bubbles on the routes, like Google Maps. */
  show_labels?: boolean;
  /** Any CSS color, or [r, g, b] from the editor. Defaults to the theme's primary color. */
  fastest_color?: string | number[];
  /** Any CSS color, or [r, g, b] from the editor. Defaults to gray. */
  alternative_color?: string | number[];
  /** Initial map type; can be switched on the map unless show_controls is false. */
  map_type?: "roadmap" | "satellite" | "hybrid" | "terrain";
  /** Show Google's live traffic layer initially; toggled with the map's traffic button. */
  show_traffic?: boolean;
  /** Map type switch and traffic button on the map. */
  show_controls?: boolean;
  /** Google JSON map styling: a list of { featureType, elementType, stylers } rules, or that JSON as a string. */
  map_style?: unknown;
  /** Map ID for Google's cloud-based map styling; overrides map_style. */
  map_id?: string;
}

/** Shape of one item in the sensor's `routes` attribute (see sensor.py). */
export interface RouteAttribute {
  duration: number;
  static_duration: number;
  delay: number;
  distance: number;
  description: string | null;
  polyline: string;
}

export interface Position {
  latitude: number;
  longitude: number;
}
