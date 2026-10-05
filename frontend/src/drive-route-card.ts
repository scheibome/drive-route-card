import { LitElement, css, html, nothing, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";

import { EDITOR_TYPE } from "./editor.ts";
import { findRouteSensors } from "./entities.ts";
import { loadGoogleMaps } from "./google-maps.ts";
import { localize } from "./localize.ts";
import { decodePolyline } from "./polyline.ts";
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

class DriveRouteCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: DriveRouteCardConfig;
  @state() private _error?: string;

  private _map?: google.maps.Map;
  private _mapLoading = false;
  private _polylines: google.maps.Polyline[] = [];
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

    const query = `${entity.attributes.last_query}|${this._config.show_alternatives}`;
    if (query === this._drawnQuery) return;
    this._drawnQuery = query;

    this._polylines.forEach((line) => line.setMap(null));
    this._polylines = [];

    const primary =
      getComputedStyle(this).getPropertyValue("--primary-color").trim() || FALLBACK_PRIMARY;
    const fastest = this._fastestIndex;
    const showAlternatives = this._config.show_alternatives ?? true;
    const bounds = new google.maps.LatLngBounds();

    this._routes.forEach((route, index) => {
      const isFastest = index === fastest;
      if (!isFastest && !showAlternatives) return;
      const path = decodePolyline(route.polyline);
      path.forEach((point) => bounds.extend(point));
      this._polylines.push(
        new google.maps.Polyline({
          map,
          path,
          strokeColor: isFastest ? primary : ALTERNATIVE_COLOR,
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
      map.fitBounds(bounds, 32);
    }
  }

  protected render() {
    if (!this._config || !this.hass) return nothing;
    const entity = this._entity;
    const height = this._config.height ?? DEFAULT_HEIGHT;
    const lang = this.hass.language;
    const { entity: entityId, api_key: apiKey } = this._config;

    return html`
      <ha-card .header=${this._config.title}>
        ${this._error ? html`<div class="warning">${this._error}</div>` : nothing}
        ${!entityId
          ? html`<div class="hint">${localize(lang, "no_entity")}</div>`
          : !entity
            ? html`<div class="warning">${localize(lang, "entity_missing")}: ${entityId}</div>`
            : nothing}
        ${!apiKey ? html`<div class="hint">${localize(lang, "no_api_key")}</div>` : nothing}
        <div id="map" style="height: ${height}px" ?hidden=${!apiKey}></div>
        ${this._config.show_legend ?? true ? this._renderLegend(lang) : nothing}
      </ha-card>
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
    }
    [hidden] {
      display: none;
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
      background: ${unsafeCSS(ALTERNATIVE_COLOR)};
    }
    .fastest .swatch {
      background: var(--primary-color, ${unsafeCSS(FALLBACK_PRIMARY)});
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
    preview: false,
    documentationURL: "https://github.com/scheibome/drive-route-card",
  });
}
