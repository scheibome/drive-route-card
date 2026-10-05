import { LitElement, css, html, nothing, render, svg, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";

import { toCssColor } from "./config.ts";
import { EDITOR_TYPE } from "./editor.ts";
import { findRouteSensors } from "./entities.ts";
import { loadGoogleMaps, onAuthFailure } from "./google-maps.ts";
import { localize } from "./localize.ts";
import { pickLabelPoints } from "./labels.ts";
import { decodePolyline } from "./polyline.ts";
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
const ALTERNATIVE_COLOR = "#9e9e9e";
const FALLBACK_PRIMARY = "#03a9f4";
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
  @state() private _config?: DriveRouteCardConfig;
  @state() private _error?: string;
  @state() private _authFailed = false;
  private _unsubscribeAuth?: () => void;

  private _map?: google.maps.Map;
  private _mapLoading = false;
  private _polylines: google.maps.Polyline[] = [];
  private _labels: google.maps.OverlayView[] = [];
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
    this._error = undefined;
    this._drawnQuery = undefined;
  }

  connectedCallback(): void {
    super.connectedCallback();
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
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      this._map = new Map(container, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      });
      new ResizeObserver(() => {
        if (this._bounds) this._map?.fitBounds(this._bounds, 32);
      }).observe(container);
      this._error = undefined;
      this._drawRoutes();
    } catch (err) {
      this._error = (err as Error).message;
    } finally {
      this._mapLoading = false;
    }
  }

  private _drawRoutes(): void {
    const map = this._map;
    const entity = this._entity;
    if (!map || !entity || !this._config) return;

    const { show_alternatives: showAlternativesConfig, show_labels: showLabelsConfig } =
      this._config;
    const fastestColor = toCssColor(this._config.fastest_color);
    const alternativeColor = toCssColor(this._config.alternative_color) ?? ALTERNATIVE_COLOR;
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

    const primary =
      fastestColor ||
      getComputedStyle(this).getPropertyValue("--primary-color").trim() ||
      FALLBACK_PRIMARY;
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
      this._polylines.push(
        new google.maps.Polyline({
          map,
          path,
          strokeColor: isFastest ? primary : alternativeColor,
          strokeOpacity: isFastest ? 1 : 0.8,
          strokeWeight: isFastest ? 6 : 4,
          zIndex: isFastest ? 2 : 1,
          // Origin and destination markers without the deprecated Marker class.
          icons: isFastest ? endpointIcons(primary) : undefined,
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

  /** Configured colors as CSS variables for legend and sketch. */
  private _colorStyle(): string {
    const fastest = toCssColor(this._config?.fastest_color);
    const alternative = toCssColor(this._config?.alternative_color);
    return [
      fastest ? `--drc-fastest-color: ${fastest}` : "",
      alternative ? `--drc-alternative-color: ${alternative}` : "",
    ]
      .filter(Boolean)
      .join("; ");
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
        <div id="map" style="height: ${height}px" ?hidden=${!apiKey}></div>
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
        style="height: ${Math.min(height, 250)}px"
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
      stroke: var(--drc-alternative-color, ${unsafeCSS(ALTERNATIVE_COLOR)});
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .sketch .line.fastest {
      stroke: var(--drc-fastest-color, var(--primary-color, ${unsafeCSS(FALLBACK_PRIMARY)}));
      stroke-width: 6;
    }
    .sketch .endpoint {
      stroke: #ffffff;
      stroke-width: 2;
    }
    .sketch .start {
      fill: #ffffff;
      stroke: var(--drc-fastest-color, var(--primary-color, ${unsafeCSS(FALLBACK_PRIMARY)}));
    }
    .sketch .end {
      fill: var(--drc-fastest-color, var(--primary-color, ${unsafeCSS(FALLBACK_PRIMARY)}));
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
      background: var(--drc-alternative-color, ${unsafeCSS(ALTERNATIVE_COLOR)});
    }
    .fastest .swatch {
      background: var(--drc-fastest-color, var(--primary-color, ${unsafeCSS(FALLBACK_PRIMARY)}));
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

function formatMinutes(seconds: number): string {
  return String(Math.round(seconds / 60));
}

function formatKm(meters: number, lang: string): string {
  return (meters / 1000).toLocaleString(lang, { maximumFractionDigits: 1 });
}

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, DriveRouteCard);

  const registry = ((window as unknown as { customCards?: unknown[] }).customCards ??= []);
  registry.push({
    type: CARD_TYPE,
    name: "Drive Route Card",
    description: "Shows the fastest route and alternatives between two zones.",
    preview: true,
    documentationURL: "https://github.com/scheibome/drive-route-card",
  });
}
