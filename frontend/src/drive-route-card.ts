import { LitElement, type PropertyValues, css, html, nothing, render, svg } from "lit";
import { property, state } from "lit/decorators.js";

import {
  DEFAULT_ALTERNATIVE_COLOR,
  DEFAULT_FASTEST_COLOR,
  parseMapStyle,
  toCssColor,
} from "./config.ts";
import { EDITOR_TYPE } from "./editor.ts";
import { findRouteSensors } from "./entities.ts";
import { loadGoogleMaps, onAuthFailure } from "./google-maps.ts";
import { localize } from "./localize.ts";
import { pickLabelPoints } from "./labels.ts";
import { decodePolyline } from "./polyline.ts";
import { defineElement } from "./register.ts";
import { createRouteLabel } from "./route-label.ts";
import { buildSketch } from "./sketch.ts";
import {
  DEFAULT_HEIGHT,
  type DriveRouteCardConfig,
  type HassEntity,
  type HomeAssistant,
  type Position,
  type RouteAttribute,
} from "./types.ts";

const CARD_TYPE = "drive-route-card";
/** Darker edge drawn under every route, like Google Maps. */
const OUTLINE_COLOR = "#000000";
const OUTLINE_OPACITY = 0.25;
/** Delay from which a route's time is shown in red, like Google Maps. */
const DELAYED_SECONDS = 300;
const TRAVEL_MODE_ICONS: Record<string, string> = {
  drive: "mdi:car",
  two_wheeler: "mdi:motorbike",
  bicycle: "mdi:bike",
  walk: "mdi:walk",
};

class DriveRouteCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  /** Set by HA's panel view; the card then fills the whole view height. */
  @property({ type: Boolean, reflect: true }) isPanel = false;
  /** True while the dashboard is edited; leaves room for HA's edit buttons in panel view. */
  @property({ type: Boolean, reflect: true }) editMode = false;
  @state() private _config?: DriveRouteCardConfig;
  @state() private _error?: string;
  @state() private _authFailed = false;
  private _unsubscribeAuth?: () => void;

  private _map?: google.maps.Map;
  private _trafficLayer?: google.maps.TrafficLayer;
  private _trafficButton?: HTMLButtonElement;
  /** Traffic shown right now; starts from `show_traffic`, toggled with the map button. */
  @state() private _trafficOn = false;
  private _mapLoading = false;
  private _polylines: google.maps.Polyline[] = [];
  private _labels: google.maps.OverlayView[] = [];
  private _appliedMapType?: string;
  /** Map ID the current map was created with; Google can't change it afterwards. */
  private _mapId?: string;
  private _resizeObserver?: ResizeObserver;
  @state() private _styleError?: string;
  /** Last fitted area; refitted when the card is resized (e.g. laid out after the map was created). */
  private _bounds?: google.maps.LatLngBounds;
  /** last_query of the drawn routes; avoids redrawing on unrelated state changes. */
  private _drawnQuery?: string;

  static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TYPE);
  }

  static getStubConfig(hass: HomeAssistant): Partial<DriveRouteCardConfig> {
    // Missing entity/api_key are shown as hints, so the card can be set up in the editor.
    return { entity: findRouteSensors(hass)[0] ?? "", api_key: "" };
  }

  setConfig(config: DriveRouteCardConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration");
    }
    this._config = config;
    this._trafficOn = config.show_traffic ?? false;
    this._error = undefined;
    this._drawnQuery = undefined;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // HA re-creates the wrappers when toggling edit mode, so checking on connect is enough.
    // Not every HA version sets `editMode` on the card itself.
    if (insideEditWrapper(this)) this.editMode = true;
    this._unsubscribeAuth = onAuthFailure(() => {
      this._authFailed = true;
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeAuth?.();
  }

  getCardSize(): number {
    return Math.ceil((this._config?.height ?? DEFAULT_HEIGHT) / 50) + 2;
  }

  private get _entity(): HassEntity | undefined {
    const entityId = this._config?.entity;
    return entityId ? this.hass?.states[entityId] : undefined;
  }

  private get _routes(): RouteAttribute[] {
    return (this._entity?.attributes.routes as RouteAttribute[] | undefined) ?? [];
  }

  private get _fastestIndex(): number {
    const route = this._entity?.attributes.route;
    return typeof route === "number" ? route - 1 : 0;
  }

  protected updated(): void {
    if (!this._config?.api_key) return;
    if (this._map && (this._config.map_id || undefined) !== this._mapId) {
      this._destroyMap();
    }
    if (this._map) {
      this._drawRoutes();
    } else if (!this._mapLoading && !this._error) {
      // After a load error only a config change (setConfig) retries.
      this._initMap();
    }
  }

  private async _initMap(): Promise<void> {
    const container = this.renderRoot.querySelector<HTMLElement>("#map");
    if (!container || !this._config?.api_key) return;
    this._mapLoading = true;
    try {
      await loadGoogleMaps(this._config.api_key);
      const { Map, TrafficLayer } = (await google.maps.importLibrary(
        "maps",
      )) as google.maps.MapsLibrary;
      this._mapId = this._config.map_id || undefined;
      this._map = new Map(container, {
        // Cloud-based styling; when set, Google ignores the JSON `styles`.
        mapId: this._mapId,
        center: { lat: 0, lng: 0 },
        zoom: 2,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: this._gestureHandling,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
          mapTypeIds: ["roadmap", "satellite"],
        },
      });
      this._trafficLayer = new TrafficLayer();
      this._trafficButton = this._createTrafficButton();
      this._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._trafficButton);
      this._applyMapOptions();
      this._resizeObserver = new ResizeObserver(() => {
        if (this._bounds) this._map?.fitBounds(this._bounds, 32);
      });
      this._resizeObserver.observe(container);
      this._error = undefined;
      this._drawRoutes();
    } catch (err) {
      this._error = (err as Error).message;
    } finally {
      this._mapLoading = false;
    }
  }

  /** Drop the Google map so the next update creates a new one (needed when the map ID changes). */
  private _destroyMap(): void {
    this._resizeObserver?.disconnect();
    this._polylines.forEach((line) => line.setMap(null));
    this._labels.forEach((label) => label.setMap(null));
    this._trafficLayer?.setMap(null);
    this._polylines = [];
    this._labels = [];
    this._map = undefined;
    this._trafficLayer = undefined;
    this._trafficButton = undefined;
    this._bounds = undefined;
    this._appliedMapType = undefined;
    this._drawnQuery = undefined;
    this.renderRoot.querySelector("#map")?.replaceChildren();
  }

  /** Full-height panel map can take all gestures; elsewhere scrolling the page must keep working. */
  private get _gestureHandling(): string {
    return this.isPanel && !this.editMode ? "greedy" : "cooperative";
  }

  protected willUpdate(changed: PropertyValues): void {
    if (this._map && (changed.has("isPanel") || changed.has("editMode"))) {
      this._map.setOptions({ gestureHandling: this._gestureHandling });
    }
    if (this._map && (changed.has("_config") || changed.has("_trafficOn"))) {
      this._applyMapOptions();
    }
  }

  /** Map type, traffic layer and on-map controls; independent of the routes. */
  private _applyMapOptions(): void {
    const map = this._map;
    if (!map || !this._config) return;
    const showControls = this._config.show_controls ?? true;
    let styles: google.maps.MapTypeStyle[] | undefined;
    try {
      styles = parseMapStyle(this._config.map_style);
      this._styleError = undefined;
    } catch (err) {
      this._styleError = (err as Error).message;
    }
    // `null` resets a previously set style.
    map.setOptions({ mapTypeControl: showControls, styles: styles ?? null });
    // Only follow the config when it changes, so the on-map switch isn't overridden on every update.
    const mapType = this._config.map_type ?? "roadmap";
    if (mapType !== this._appliedMapType) {
      this._appliedMapType = mapType;
      map.setMapTypeId(mapType);
    }
    this._trafficLayer?.setMap(this._trafficOn ? map : null);
    if (this._trafficButton) {
      this._trafficButton.hidden = !showControls;
      this._trafficButton.setAttribute("aria-pressed", String(this._trafficOn));
      this._trafficButton.textContent = localize(this.hass?.language ?? "en", "traffic");
    }
  }

  private _createTrafficButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-control";
    button.addEventListener("click", () => {
      this._trafficOn = !this._trafficOn;
    });
    return button;
  }

  private _drawRoutes(): void {
    const map = this._map;
    const entity = this._entity;
    if (!map || !entity || !this._config) return;

    const { show_alternatives: showAlternativesConfig, show_labels: showLabelsConfig } =
      this._config;
    const { fastest: fastestColor, alternative: alternativeColor } = this._colors;
    const query = [
      entity.attributes.last_query,
      showAlternativesConfig,
      showLabelsConfig,
      fastestColor,
      alternativeColor,
    ].join("|");
    if (query === this._drawnQuery) return;
    this._drawnQuery = query;

    this._polylines.forEach((line) => line.setMap(null));
    this._polylines = [];
    this._labels.forEach((label) => label.setMap(null));
    this._labels = [];

    const fastest = this._fastestIndex;
    const showAlternatives = showAlternativesConfig ?? true;
    const bounds = new google.maps.LatLngBounds();
    const visible = this._routes
      .map((route, index) => ({ route, index, path: decodePolyline(route.polyline) }))
      .filter(({ index }) => showAlternatives || index === fastest);
    const labelPoints = pickLabelPoints(visible.map(({ path }) => path));
    const lang = this.hass?.language ?? "en";
    const icon = TRAVEL_MODE_ICONS[String(entity.attributes.travel_mode)] ?? TRAVEL_MODE_ICONS.drive;

    visible.forEach(({ route, index, path }, position) => {
      const isFastest = index === fastest;
      path.forEach((point) => bounds.extend(point));
      const labelPoint = labelPoints[position];
      if ((showLabelsConfig ?? true) && labelPoint) {
        const label = createRouteLabel(labelPoint, this._labelElement(route, isFastest, icon, lang));
        label.setMap(map);
        this._labels.push(label);
      }
      const weight = isFastest ? 6 : 5;
      // Fastest route on top; each route gets a darker edge drawn just below it.
      const zIndex = isFastest ? 4 : 2;
      this._polylines.push(
        new google.maps.Polyline({
          map,
          path,
          strokeColor: OUTLINE_COLOR,
          strokeOpacity: OUTLINE_OPACITY,
          strokeWeight: weight + 3,
          zIndex: zIndex - 1,
          clickable: false,
        }),
        new google.maps.Polyline({
          map,
          path,
          strokeColor: isFastest ? fastestColor : alternativeColor,
          strokeOpacity: 1,
          strokeWeight: weight,
          zIndex,
          clickable: false,
          // Origin and destination markers without the deprecated Marker class.
          icons: isFastest ? endpointIcons(fastestColor) : undefined,
        }),
      );
    });

    if (bounds.isEmpty()) {
      for (const key of ["origin", "destination"]) {
        const position = entity.attributes[key] as Position | undefined;
        if (position) bounds.extend({ lat: position.latitude, lng: position.longitude });
      }
    }
    if (!bounds.isEmpty()) {
      this._bounds = bounds;
      map.fitBounds(bounds, 32);
    }
  }

  private _labelElement(
    route: RouteAttribute,
    isFastest: boolean,
    icon: string,
    lang: string,
  ): HTMLElement {
    const element = document.createElement("div");
    element.classList.add("route-label");
    element.classList.toggle("fastest", isFastest);
    element.classList.toggle("delayed", route.delay >= DELAYED_SECONDS);
    render(
      html`<ha-icon .icon=${icon}></ha-icon>
        <div>
          <div class="time">${formatMinutes(route.duration)} ${localize(lang, "min")}</div>
          <div class="distance">${formatKm(route.distance, lang)} km</div>
        </div>`,
      element,
    );
    return element;
  }

  private get _colors(): { fastest: string; alternative: string } {
    return {
      fastest: toCssColor(this._config?.fastest_color) ?? DEFAULT_FASTEST_COLOR,
      alternative: toCssColor(this._config?.alternative_color) ?? DEFAULT_ALTERNATIVE_COLOR,
    };
  }

  /** Route colors as CSS variables for legend and sketch. */
  private _colorStyle(): string {
    const { fastest, alternative } = this._colors;
    return `--drc-fastest-color: ${fastest}; --drc-alternative-color: ${alternative}`;
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const entity = this._entity;
    const height = this._config.height ?? DEFAULT_HEIGHT;
    const lang = this.hass.language;
    const { entity: entityId, api_key: apiKey } = this._config;

    return html`
      <ha-card .header=${this._config.title} style=${this._colorStyle()}>
        ${this._error ? html`<div class="warning">${this._error}</div>` : nothing}
        ${this._styleError ? html`<div class="warning">${this._styleError}</div>` : nothing}
        ${this._authFailed
          ? html`<div class="warning">${localize(lang, "auth_failed")}</div>`
          : nothing}
        ${!entityId
          ? html`<div class="hint">${localize(lang, "no_entity")}</div>`
          : !entity
            ? html`<div class="warning">${localize(lang, "entity_missing")}: ${entityId}</div>`
            : nothing}
        ${entityId && !apiKey
          ? html`<div class="hint">${localize(lang, "no_api_key")}</div>`
          : nothing}
        <div
          id="map"
          style=${this.isPanel ? "" : `height: ${height}px`}
          ?hidden=${!apiKey}
        ></div>
        ${apiKey ? nothing : this._renderSketch(height)}
        ${this._config.show_legend ?? true ? this._renderLegend(lang) : nothing}
      </ha-card>
    `;
  }

  /** Schematic of the routes without Google, used until an API key is set (e.g. card picker preview). */
  private _renderSketch(height: number) {
    const showAlternatives = this._config?.show_alternatives ?? true;
    const fastest = this._fastestIndex;
    const polylines = this._routes.map((route) => route.polyline);
    const sketch = showAlternatives
      ? buildSketch(polylines, fastest, 400, 250)
      : buildSketch(polylines[fastest] ? [polylines[fastest]] : [], 0, 400, 250);
    const fastestLine = sketch.lines.find((line) => line.fastest);

    return html`
      <svg
        class="sketch"
        style=${this.isPanel ? "" : `height: ${Math.min(height, 250)}px`}
        viewBox="0 0 ${sketch.width} ${sketch.height}"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        ${sketch.lines.map(
          (line) =>
            svg`<path d=${line.d} class=${line.fastest ? "line fastest" : "line"}></path>`,
        )}
        ${fastestLine
          ? svg`
              <circle class="endpoint start" cx=${fastestLine.start[0]} cy=${fastestLine.start[1]} r="6"></circle>
              <circle class="endpoint end" cx=${fastestLine.end[0]} cy=${fastestLine.end[1]} r="6"></circle>`
          : nothing}
      </svg>
    `;
  }

  private _renderLegend(lang: string) {
    const fastest = this._fastestIndex;
    const showAlternatives = this._config?.show_alternatives ?? true;
    const routes = this._routes
      .map((route, index) => ({ route, index }))
      .filter(({ index }) => showAlternatives || index === fastest);
    if (!routes.length) return nothing;

    return html`
      <ul class="legend">
        ${routes.map(
          ({ route, index }) => html`
            <li class=${index === fastest ? "fastest" : ""}>
              <span class="swatch"></span>
              <span class="name">${route.description || `${localize(lang, "route")} ${index + 1}`}</span>
              <span class="value">${formatMinutes(route.duration)} ${localize(lang, "min")}</span>
              <span class="value">${formatKm(route.distance, lang)} km</span>
              ${route.delay >= 60
                ? html`<span class="delay">+${formatMinutes(route.delay)} ${localize(lang, "min")}</span>`
                : nothing}
            </li>
          `,
        )}
      </ul>
    `;
  }

  static styles = css`
    #map {
      width: 100%;
    }
    ha-card {
      overflow: hidden;
    }
    /* Panel view: fill the view; map (or sketch) takes the space left by title, hints and legend. */
    :host([ispanel]) {
      display: block;
      height: 100%;
    }
    :host([ispanel]) ha-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    /* Leave room for the edit buttons HA shows below the card while editing. */
    :host([ispanel][editmode]) ha-card {
      height: calc(100% - 64px);
    }
    :host([ispanel]) #map,
    :host([ispanel]) .sketch {
      flex: 1 1 auto;
      min-height: 200px;
    }
    :host([ispanel]) .legend {
      flex: none;
    }
    /* Matches Google's own map controls. */
    .map-control {
      margin: 10px;
      padding: 0 17px;
      height: 40px;
      border: none;
      border-radius: 2px;
      background: #ffffff;
      color: #565656;
      box-shadow: rgba(0, 0, 0, 0.3) 0 1px 4px -1px;
      font: 18px Roboto, Arial, sans-serif;
      cursor: pointer;
    }
    .map-control[aria-pressed="true"] {
      color: #000000;
      font-weight: 500;
    }
    .warning,
    .hint {
      padding: 8px 16px;
      color: var(--error-color);
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    [hidden] {
      display: none;
    }
    /* Labels live inside the Google map, which is always light. */
    .route-label {
      position: absolute;
      transform: translate(-50%, calc(-100% - 10px));
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 6px;
      background: #ffffff;
      color: #202124;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      font: 12px/1.3 Roboto, Arial, sans-serif;
      white-space: nowrap;
      pointer-events: none;
    }
    .route-label::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -6px;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #ffffff;
      border-bottom: 0;
    }
    .route-label.fastest {
      z-index: 1;
    }
    .route-label ha-icon {
      --mdc-icon-size: 18px;
      color: #5f6368;
    }
    .route-label .time {
      font-size: 13px;
      font-weight: 600;
    }
    .route-label.fastest .time {
      color: #188038;
    }
    .route-label.delayed:not(.fastest) .time {
      color: #d93025;
    }
    .route-label .distance {
      color: #5f6368;
    }
    .sketch {
      display: block;
      width: 100%;
      background: var(--secondary-background-color);
    }
    .sketch .line {
      fill: none;
      stroke: var(--drc-alternative-color);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .sketch .line.fastest {
      stroke: var(--drc-fastest-color);
      stroke-width: 6;
    }
    .sketch .endpoint {
      stroke: #ffffff;
      stroke-width: 2;
    }
    .sketch .start {
      fill: #ffffff;
      stroke: var(--drc-fastest-color);
    }
    .sketch .end {
      fill: var(--drc-fastest-color);
    }
    .legend {
      list-style: none;
      margin: 0;
      padding: 8px 16px 12px;
    }
    .legend li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      color: var(--secondary-text-color);
    }
    .legend li.fastest {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .swatch {
      flex: none;
      width: 16px;
      height: 4px;
      border-radius: 2px;
      background: var(--drc-alternative-color);
    }
    .fastest .swatch {
      background: var(--drc-fastest-color);
    }
    .name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .value {
      white-space: nowrap;
    }
    .delay {
      white-space: nowrap;
      color: var(--warning-color);
    }
  `;
}

function endpointIcons(color: string): google.maps.IconSequence[] {
  const icon = (fillColor: string): google.maps.Symbol => ({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 7,
    fillColor,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
  });
  return [
    { icon: icon("#ffffff"), offset: "0%" },
    { icon: icon(color), offset: "100%" },
  ];
}

/** HA wraps cards in these elements while a dashboard is edited (panel/masonry and sections). */
const EDIT_WRAPPERS = new Set(["HUI-CARD-OPTIONS", "HUI-CARD-EDIT-MODE"]);

function insideEditWrapper(element: Element): boolean {
  let node: Node | null = element;
  for (let depth = 0; node && depth < 10; depth++) {
    if (node instanceof Element && EDIT_WRAPPERS.has(node.tagName)) return true;
    node = node.parentNode ?? (node instanceof ShadowRoot ? node.host : null);
  }
  return false;
}

function formatMinutes(seconds: number): string {
  return String(Math.round(seconds / 60));
}

function formatKm(meters: number, lang: string): string {
  return (meters / 1000).toLocaleString(lang, { maximumFractionDigits: 1 });
}

if (defineElement(CARD_TYPE, DriveRouteCard)) {
  // The integration serves the bundle with `?v=<manifest version>`.
  const version = new URL(import.meta.url).searchParams.get("v") ?? "dev";
  console.info(
    `%c DRIVE-ROUTE-CARD %c ${version} `,
    "color: white; background: #1a73e8; font-weight: 700",
    "color: #1a73e8; background: white; font-weight: 700",
  );

  const customCards = ((window as unknown as { customCards?: unknown[] }).customCards ??= []);
  customCards.push({
    type: CARD_TYPE,
    name: "Drive Route Card",
    description: "Shows the fastest route and alternatives between two zones.",
    preview: true,
    documentationURL: "https://github.com/scheibome/drive-route-card",
  });
}
