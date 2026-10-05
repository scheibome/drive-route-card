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
