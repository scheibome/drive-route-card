/** Custom element that HA's app.js defines once its frontend is set up. */
const HA_ROOT_ELEMENT = "home-assistant";

/**
 * Define a custom element, and again if `window.customElements` is replaced later.
 *
 * In browsers without native scoped registries (e.g. Firefox), HA's app.js
 * installs the scoped custom element registry polyfill, which replaces
 * `window.customElements` with an empty registry. Extra modules and dashboard
 * resources load in parallel with app.js, so this bundle can run first. Its
 * definitions then only exist in the replaced registry, and HA shows
 * "Custom element doesn't exist" until the page is reloaded.
 *
 * Returns whether the element was defined now (false if it already existed).
 */
export function defineElement(tag: string, element: CustomElementConstructor): boolean {
  const define = (): boolean => {
    if (globalThis.customElements.get(tag)) return false;
    globalThis.customElements.define(tag, element);
    return true;
  };

  const registry = globalThis.customElements;
  const defined = define();
  // The polyfill is installed before app.js defines its root element.
  void registry.whenDefined(HA_ROOT_ELEMENT).then(() => {
    if (globalThis.customElements !== registry) define();
  });
  return defined;
}
