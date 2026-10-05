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
    editor_height_helper: "Ignored in panel view, where the card fills the whole height.",
    editor_map_type: "Map type",
    editor_map_style: "Map style (JSON)",
    editor_map_style_helper:
      "Google's JSON styling: a list of rules with featureType, elementType and stylers. Paste the JSON from Google's styling wizard or snazzymaps.com.",
    editor_map_id: "Map ID (cloud styling)",
    editor_map_id_helper:
      "Optional map ID from the Google Cloud console. When set, Google applies the cloud style and ignores the JSON style.",
    editor_show_traffic: "Show traffic",
    editor_show_controls: "Show map type and traffic buttons on the map",
    map_type_roadmap: "Map",
    map_type_satellite: "Satellite",
    map_type_hybrid: "Satellite with labels",
    map_type_terrain: "Terrain",
    traffic: "Traffic",
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
    editor_height_helper: "Wird in der Panel-Ansicht ignoriert, dort füllt die Karte die volle Höhe.",
    editor_map_type: "Kartentyp",
    editor_map_style: "Kartenstil (JSON)",
    editor_map_style_helper:
      "Googles JSON-Styling: eine Liste von Regeln mit featureType, elementType und stylers. Füge das JSON aus Googles Styling-Assistent oder von snazzymaps.com ein.",
    editor_map_id: "Map-ID (Cloud-Styling)",
    editor_map_id_helper:
      "Optionale Map-ID aus der Google Cloud Console. Ist sie gesetzt, verwendet Google den Cloud-Stil und ignoriert den JSON-Stil.",
    editor_show_traffic: "Verkehrslage anzeigen",
    editor_show_controls: "Kartentyp- und Verkehr-Knöpfe auf der Karte anzeigen",
    map_type_roadmap: "Karte",
    map_type_satellite: "Satellit",
    map_type_hybrid: "Satellit mit Beschriftung",
    map_type_terrain: "Gelände",
    traffic: "Verkehr",
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
