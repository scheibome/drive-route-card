import type { HassEntity, HomeAssistant } from "./types.ts";

/** The integration's fastest travel time sensors are the only ones carrying `routes`. */
export function isRouteSensor(entity: HassEntity | undefined): boolean {
  return (
    !!entity && entity.entity_id.startsWith("sensor.") && Array.isArray(entity.attributes.routes)
  );
}

export function findRouteSensors(hass: HomeAssistant): string[] {
  return Object.values(hass.states)
    .filter(isRouteSensor)
    .map((entity) => entity!.entity_id)
    .sort();
}
