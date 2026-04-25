import type { SymbolRegistry, SymbolSafeConstructor } from "./types";

const hasSymbolConstructor =
  typeof Symbol === "function" &&
  typeof Symbol("x") === "symbol" &&
  typeof Symbol.for === "function" &&
  typeof Symbol.keyFor === "function";

/** ------------------------------------------------------------------------
 * * Global registry key used to store fallback symbol mappings.
 * ------------------------------------------------------------------------
 *
 * In environments where native `Symbol.for()` is unavailable,
 * a shared registry object is attached to the global scope.
 *
 * This constant represents the property name used to store that
 * registry on the global object.
 *
 * The registry ensures that multiple calls to `SymbolSafe.for(key)`
 * return the same value across modules.
 *
 * ------------------------------------------------------------------------
 *
 * @internal
 */
const REGISTRY_KEY = "__rzl_global_symbol_registry__";

/** ------------------------------------------------------------------------
 * * Resolves the current global execution context.
 * ------------------------------------------------------------------------
 *
 * Returns a reference to the global object regardless of runtime
 * environment.
 *
 * This helper supports multiple JavaScript environments:
 *
 * - `globalThis` (modern standard)
 * - `self` (Web Workers)
 * - `window` (browsers)
 * - `global` (Node.js)
 *
 * If none are available, a new object is returned as a fallback.
 *
 * ------------------------------------------------------------------------
 *
 * @returns The detected global object.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getGlobal(): any {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  return {};
}

/** ------------------------------------------------------------------------
 * * Generates a pseudo-unique identifier.
 * ------------------------------------------------------------------------
 *
 * Creates a collision-resistant identifier used internally when
 * generating fallback symbol-like keys in environments without
 * native `Symbol` support.
 *
 * The identifier combines:
 *
 * - two randomized base36 segments
 * - a timestamp component
 *
 * This ensures a sufficiently unique value for runtime property keys.
 *
 * ------------------------------------------------------------------------
 *
 * @returns A pseudo-unique identifier string.
 *
 * @internal
 */
function createUID() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36)
  );
}

/** ------------------------------------------------------------------------
 * * Creates a unique symbol-like key.
 * ------------------------------------------------------------------------
 *
 * Generates a **unique property key** similar to `Symbol(description)`.
 *
 * Runtime behavior depends on environment support:
 *
 * **Modern environments**
 * - Delegates to `Symbol(description)`.
 *
 * **Legacy environments (ES5)**
 * - Returns a unique string identifier in the format:
 *
 * ```
 * `@@rzl/local/<description>/<unique-id>`
 * ```
 *
 * Each invocation returns a **distinct value**.
 *
 * ------------------------------------------------------------------------
 *
 * @param desc - Optional symbol description used for debugging.
 *
 * @returns A unique `PropertyKey`.
 *
 * @internal
 */
function createLocalSymbol(desc?: string | number) {
  if (hasSymbolConstructor) {
    return Symbol(desc);
  }

  return "@@rzl/local/" + (desc ?? "") + "/" + createUID();
}

/** ------------------------------------------------------------------------
 * * Resolves or creates a global symbol-like key.
 * ------------------------------------------------------------------------
 *
 * Provides behavior equivalent to `Symbol.for(key)`.
 *
 * Runtime strategy:
 *
 * **Modern environments**
 * - Delegates directly to `Symbol.for(key)`.
 *
 * **Legacy environments**
 * - Uses a shared registry stored on the global object.
 * - The registry ensures stable key reuse across modules.
 *
 * Fallback format:
 *
 * ```
 * `@@rzl/global/<key>/<unique-id>`
 * ```
 *
 * Subsequent calls with the same `key` return the same value.
 *
 * ------------------------------------------------------------------------
 *
 * @param key - Global registry identifier.
 *
 * @returns A stable `PropertyKey`.
 *
 * @internal
 */
function createGlobalSymbol(key: string) {
  if (hasSymbolConstructor) {
    return Symbol.for(key);
  }

  const registry = getRegistry();

  if (registry.byKey[key]) {
    return registry.byKey[key] as unknown as symbol;
  }
  const value = "@@rzl/global/" + key + "/" + createUID();

  registry.byKey[key] = value;
  registry.byValue.set(value, key);

  return value as unknown as symbol;
}

/** ------------------------------------------------------------------------
 * * Retrieves or initializes the global symbol registry store.
 * ------------------------------------------------------------------------
 *
 * The registry is stored on the global execution context and is used to
 * maintain stable mappings between registry keys and symbol-like property
 * values.
 *
 * Registry Structure:
 *
 * ```ts
 * interface SymbolRegistry {
 *   byKey: Record<string, PropertyKey>;
 *   byValue: Map<PropertyKey, string>;
 * }
 * ```
 *
 * - `byKey`
 *     - Maps registry identifier strings ➔ generated property keys.
 *     - Enables O(1) lookup when resolving global symbols by name.
 *
 * - `byValue`
 *     - Reverse mapping from property key ➔ registry identifier.
 *     - Enables O(1) implementation of `keyFor()`-style resolution.
 *
 * Behavior:
 *
 * - If the registry does not exist on the global object, it will be
 *   initialized automatically.
 *
 * - The registry is shared across modules within the same runtime
 *   context.
 *
 * - The registry uses `Object.create(null)` to avoid prototype pollution
 *   and accidental key shadowing.
 *
 * ------------------------------------------------------------------------
 *
 * @returns
 * The global symbol registry instance.
 *
 * ------------------------------------------------------------------------
 *
 * @internal
 */
function getRegistry() {
  const g = getGlobal();

  if (!g[REGISTRY_KEY]) {
    g[REGISTRY_KEY] = {
      byKey: Object.create(null),
      byValue: new Map()
    } as SymbolRegistry;
  }

  return g[REGISTRY_KEY] as SymbolRegistry;
}

/** ------------------------------------------------------------------------
 * * ***SymbolSafe runtime implementation.***
 * ------------------------------------------------------------------------
 *
 * TypeScript identity preservation note:
 *
 * When using SymbolSafe, consumers may optionally apply self-referential
 * assertions to preserve symbol identity narrowing.
 *
 * Recommended pattern example:
 *
 * ```ts
 * const KEY: unique symbol = SymbolSafe("key") as typeof KEY;
 * const MySimbol: unique symbol = SymbolSafe("my-symbol") as typeof MySimbol;
 * const MyGlobalSimbol: unique symbol = SymbolSafe.for("my-global-symbol") as typeof MyGlobalSimbol;
 * ```
 *
 * This pattern allows TypeScript to approximate native `Symbol` intrinsic
 * inference behavior for custom symbol factory functions.
 *
 * Usage of explicit `unique symbol` annotations is optional and should
 * only be used when strict identity narrowing is required.
 *
 * ------------------------------------------------------------------------
 *
 * The exported `SymbolSafe` object behaves like a function while exposing
 * the `for()` method for global registry access.
 *
 * This mirrors the behavior of the native `Symbol` API.
 *
 * ------------------------------------------------------------------------
 *
 * @example
 *
 * Creating unique symbol-like values
 *
 * ```ts
 * const INTERNAL: unique symbol = SymbolSafe("internal") as typeof INTERNAL;
 *
 * const obj: Record<PropertyKey, unknown> = {};
 *
 * obj[INTERNAL] = { debug: true };
 *
 * console.log(obj[INTERNAL]);
 * ```
 *
 * ------------------------------------------------------------------------
 *
 * @example
 *
 * Using global registry symbols
 *
 * ```ts
 * const ROUTER_KEY: unique symbol = SymbolSafe.for("rzl:router.instance") as typeof ROUTER_KEY;
 * const CACHE_KEY: unique symbol = SymbolSafe.for("rzl:cache.token") as typeof CACHE_KEY;
 *
 * console.log(ROUTER_KEY === CACHE_KEY); // false
 *
 * const ROUTER_A: unique symbol = SymbolSafe.for("rzl:router.instance") as typeof ROUTER_A;
 * const ROUTER_B: unique symbol = SymbolSafe.for("rzl:router.instance") as typeof ROUTER_B;
 *
 * console.log(ROUTER_A === ROUTER_B); // true
 * ```
 *
 * ------------------------------------------------------------------------
 */
export const SymbolSafe: SymbolSafeConstructor = Object.assign(
  function SymbolSafe(description?: string | number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createLocalSymbol(description) as any;
  },
  {
    for(key: string) {
      return createGlobalSymbol(key);
    },

    keyFor(sym: symbol) {
      if (hasSymbolConstructor && typeof sym === "symbol") {
        return Symbol.keyFor(sym);
      }

      const registry = getRegistry();
      return registry.byValue.get(sym);
    }
  }
);
