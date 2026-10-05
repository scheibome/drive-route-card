import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { EDITOR_DEFAULTS, normalizeConfig } from "./config.ts";
import { findRouteSensors } from "./entities.ts";
import { localize, type StringKey } from "./localize.ts";
import type { DriveRouteCardConfig, HomeAssistant } from "./types.ts";

export const EDITOR_TYPE = "drive-route-card-editor";

interface SchemaItem {
  name: string;
  type?: "grid";
  required?: boolean;
  selector?: Record<string, unknown>;
  schema?: SchemaItem[];
}

interface CardHelpers {
  createCardElement(config: Record<string, unknown>): Promise<HTMLElement>;
}

/**
 * `ha-form` is part of the HA frontend but only loaded on demand. Creating a
 * built-in card's editor forces it to load before ours renders.
 */
async function ensureHaForm(): Promise<void> {
  if (customElements.get("ha-form")) return;
  const loadCardHelpers = (window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> })
    .loadCardHelpers;
  if (!loadCardHelpers) return;
  const helpers = await loadCardHelpers();
  const card = await helpers.createCardElement({ type: "tile", entity: "sun.sun" });
  await (card.constructor as unknown as { getConfigElement?: () => Promise<unknown> })
    .getConfigElement?.();
}

class DriveRouteCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: DriveRouteCardConfig;
  @state() private _formReady = !!customElements.get("ha-form");

  setConfig(config: DriveRouteCardConfig): void {
    this._config = config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._formReady) {
      ensureHaForm().finally(() => {
        this._formReady = true;
      });
    }
  }

  private _schema(routeSensors: string[]): SchemaItem[] {
    return [
      {
        name: "entity",
        required: true,
        selector: { entity: { include_entities: routeSensors } },
      },
      { name: "api_key", required: true, selector: { text: {} } },
      { name: "title", selector: { text: {} } },
      {
        name: "height",
        selector: {
          number: { min: 150, max: 1200, step: 10, mode: "box", unit_of_measurement: "px" },
        },
      },
      {
        name: "",
        type: "grid",
        schema: [
          { name: "show_alternatives", selector: { boolean: {} } },
          { name: "show_legend", selector: { boolean: {} } },
        ],
      },
    ];
  }

  protected render() {
    if (!this.hass || !this._config || !this._formReady) return nothing;
    const lang = this.hass.language;
    const routeSensors = findRouteSensors(this.hass);

    return html`
      ${routeSensors.length
        ? nothing
        : html`<div class="hint">${localize(lang, "editor_no_sensors")}</div>`}
      <ha-form
        .hass=${this.hass}
        .data=${{ ...EDITOR_DEFAULTS, ...this._config }}
        .schema=${this._schema(routeSensors)}
        .computeLabel=${(item: SchemaItem) => localize(lang, `editor_${item.name}` as StringKey)}
        .computeHelper=${(item: SchemaItem) => this._helper(lang, item.name)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _helper(lang: string, name: string): string | undefined {
    if (name === "entity" || name === "api_key") {
      return localize(lang, `editor_${name}_helper`);
    }
    return undefined;
  }

  private _valueChanged(ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    ev.stopPropagation();
    const config = normalizeConfig({ ...ev.detail.value, type: this._config!.type });
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = css`
    .hint {
      margin-bottom: 16px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.12);
      color: var(--primary-text-color);
    }
  `;
}

if (!customElements.get(EDITOR_TYPE)) {
  customElements.define(EDITOR_TYPE, DriveRouteCardEditor);
}
