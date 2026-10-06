import assert from "node:assert/strict";
import { test } from "node:test";

import { defineElement } from "../src/register.ts";

/** Minimal stand-in for CustomElementRegistry. */
class FakeRegistry {
  readonly defined = new Map<string, CustomElementConstructor>();
  private readonly waiting = new Map<string, () => void>();

  get(tag: string): CustomElementConstructor | undefined {
    return this.defined.get(tag);
  }

  define(tag: string, element: CustomElementConstructor): void {
    if (this.defined.has(tag)) throw new Error(`${tag} already defined`);
    this.defined.set(tag, element);
    this.waiting.get(tag)?.();
  }

  whenDefined(tag: string): Promise<void> {
    if (this.defined.has(tag)) return Promise.resolve();
    return new Promise((resolve) => this.waiting.set(tag, resolve));
  }
}

const Element = class {} as unknown as CustomElementConstructor;
const globals = globalThis as unknown as { customElements: FakeRegistry };

function useRegistry(registry: FakeRegistry): void {
  globals.customElements = registry;
}

test("defines the element once", () => {
  useRegistry(new FakeRegistry());
  assert.equal(defineElement("my-card", Element), true);
  assert.equal(defineElement("my-card", Element), false);
});

test("defines again when HA replaces the registry before its root element", async () => {
  const native = new FakeRegistry();
  useRegistry(native);
  defineElement("my-card", Element);

  // app.js installs the scoped registry polyfill, then defines its root
  // element, which the polyfill also registers natively.
  const polyfill = new FakeRegistry();
  useRegistry(polyfill);
  polyfill.define("home-assistant", Element);
  native.define("home-assistant", Element);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(polyfill.get("my-card"), Element);
});

test("leaves an unchanged registry alone", async () => {
  const registry = new FakeRegistry();
  registry.define("home-assistant", Element);
  useRegistry(registry);

  defineElement("my-card", Element);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(registry.get("my-card"), Element);
});
