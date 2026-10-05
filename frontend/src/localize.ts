const STRINGS = {
  en: {
    route: "Route",
    min: "min",
    entity_missing: "Entity not found",
    no_entity: "Select a route sensor in the card editor.",
    no_api_key: "Enter a Google Maps JavaScript API key in the card editor.",
    auth_failed:
      "Google Maps rejected the API key. The exact reason is in the browser console (F12), e.g. RefererNotAllowedMapError or ApiNotActivatedMapError.",
    editor_entity: "Route",
    editor_entity_helper: "The \"Fastest travel time\" sensor of a Drive Route Card entry.",
    editor_api_key: "Google Maps JavaScript API key",
    editor_api_key_helper:
      "Browser key restricted to your Home Assistant URL. Changing the key requires a page reload.",
    editor_title: "Title",
    editor_height: "Map height",
    editor_show_alternatives: "Show alternative routes",
    editor_show_legend: "Show legend",
    editor_show_labels: "Show time and distance on the routes",
    editor_fastest_color: "Fastest route color",
    editor_alternative_color: "Alternative routes color",
    editor_no_sensors:
      "No route sensors found. Add a route under Settings → Devices & services → Drive Route Card first.",
  },
  de: {
    route: "Route",
    min: "Min.",
    entity_missing: "Entität nicht gefunden",
    no_entity: "Wähle im Karteneditor einen Routen-Sensor aus.",
    no_api_key: "Gib im Karteneditor einen API-Key für die Google Maps JavaScript API ein.",
    auth_failed:
      "Google Maps hat den API-Key abgelehnt. Der genaue Grund steht in der Browser-Konsole (F12), z. B. RefererNotAllowedMapError oder ApiNotActivatedMapError.",
    editor_entity: "Route",
    editor_entity_helper: "Der Sensor „Schnellste Fahrzeit“ eines Drive-Route-Card-Eintrags.",
    editor_api_key: "Google-Maps-JavaScript-API-Key",
    editor_api_key_helper:
      "Browser-Key mit Einschränkung auf deine Home-Assistant-Adresse. Nach einem Key-Wechsel muss die Seite neu geladen werden.",
    editor_title: "Titel",
    editor_height: "Kartenhöhe",
    editor_show_alternatives: "Alternativrouten anzeigen",
    editor_show_legend: "Legende anzeigen",
    editor_show_labels: "Fahrzeit und Distanz an den Routen anzeigen",
    editor_fastest_color: "Farbe der schnellsten Route",
    editor_alternative_color: "Farbe der Alternativrouten",
    editor_no_sensors:
      "Keine Routen-Sensoren gefunden. Lege zuerst unter Einstellungen → Geräte & Dienste → Drive Route Card eine Route an.",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["en"];

export function localize(language: string, key: StringKey): string {
  const base = language.split("-")[0] as keyof typeof STRINGS;
  return (STRINGS[base] ?? STRINGS.en)[key] ?? key;
}
