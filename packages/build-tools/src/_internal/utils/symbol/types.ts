/* eslint-disable @typescript-eslint/no-wrapper-object-types */

/** ------------------------------------------------------------------------
 * * Internal registry structure used by SymbolSafe global storage.
 * ------------------------------------------------------------------------
 *
 * This interface defines the bidirectional mapping container used to
 * maintain stable symbol registry resolution.
 *
 * Structure:
 *
 * - `byKey`
 *   - Maps registry identifier strings to generated property keys.
 *   - Used for resolving symbols via registry name lookup.
 *
 * - `byValue`
 *   - Reverse lookup map from property key to registry identifier.
 *   - Enables efficient implementation of `keyFor()`-style resolution.
 *
 * ------------------------------------------------------------------------
 *
 * @internal
 */
export type SymbolRegistry = {
  byKey: Record<string, PropertyKey>;
  byValue: Map<PropertyKey, string>;
};

/** ------------------------------------------------------------------------
 * * Represents a **symbol-like property key**.
 * ------------------------------------------------------------------------
 *
 * `SymbolSafeKey` is the union type used by `SymbolSafe`
 * to represent values that can behave like a `Symbol`.
 *
 * In modern runtimes this will typically be a native `symbol`,
 * while in legacy environments (such as ES5) it may fall back
 * to a generated `string` identifier.
 *
 * ------------------------------------------------------------------------
 *
 * @description
 * This abstraction allows libraries to safely work with
 * **symbol-based property keys** without requiring native
 * `Symbol` support at runtime.
 *
 * When a fallback is required, the generated string key
 * is guaranteed to be **unique within the current runtime**.
 *
 * ------------------------------------------------------------------------
 *
 * @example
 *
 * ```ts
 * const key: SymbolSafeKey = SymbolSafe("internal");
 *
 * const obj: Record<PropertyKey, unknown> = {};
 *
 * obj[key] = "value";
 *
 * console.log(obj[key]);
 * ```
 *
 * ------------------------------------------------------------------------
 *
 * @remarks
 * - Represents either a **native symbol** or a **string fallback key**.
 * - Safe to use as an **object property key**.
 *
 * ------------------------------------------------------------------------
 */
export type SymbolSafeKey = symbol | string;

/** ------------------------------------------------------------------------
 * * Safe Symbol constructor with ES5 fallback support.
 * ------------------------------------------------------------------------
 *
 * `SymbolSafe` provides a **Symbol-compatible API** that works across
 * both modern and legacy JavaScript environments.
 *
 * It mirrors the native `Symbol` constructor and `Symbol.for()` registry
 * while gracefully degrading to string-based keys when `Symbol`
 * is unavailable.
 *
 * ------------------------------------------------------------------------
 *
 * @description
 * The constructor exposes two primary behaviors:
 *
 * #### 1. `SymbolSafe(description?)`
 *
 * Creates a **unique symbol-like key**.
 *
 * - Delegates to `Symbol(description)` when available.
 * - Otherwise generates a unique string identifier.
 *
 * Each invocation returns a **distinct value**.
 *
 * ---
 *
 * #### 2. `SymbolSafe.for(key)`
 *
 * Retrieves or creates a **global symbol-like key**.
 *
 * - Uses `Symbol.for(key)` when supported.
 * - Otherwise uses an internal global registry to emulate the same behavior.
 *
 * Calls with the same key always return the same value.
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
 *
 * @remarks
 * - Designed primarily for **library internals**.
 * - Avoids modifying the global `Symbol` implementation.
 * - Uses native symbols whenever possible.
 * - Provides a safe fallback for **legacy ES5 runtimes**.
 *
 * ------------------------------------------------------------------------
 */
export type SymbolSafeConstructor = {
  /** ------------------------------------------------------------------------
   * * Reference to the `Symbol` prototype.
   * ------------------------------------------------------------------------
   *
   * This property mirrors the native `Symbol.prototype`
   * reference for compatibility with environments that
   * expect constructor-like objects to expose a `prototype`.
   *
   * In fallback environments where `Symbol` does not exist,
   * this still resolves to the `Symbol` type for typing
   * compatibility with modern runtimes.
   *
   * ------------------------------------------------------------------------
   */
  readonly prototype?: Symbol;
  /** ------------------------------------------------------------------------
   * * Creates a new **unique symbol-like key**.
   * ------------------------------------------------------------------------
   *
   * TypeScript identity preservation note:
   *
   * Consumers may optionally apply self-referential assertions to preserve
   * symbol identity narrowing:
   *
   * ```ts
   * const KEY_A: unique symbol = SymbolSafe("cache") as typeof KEY_A;
   * const KEY_B: unique symbol = SymbolSafe("cache") as typeof KEY_B;
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
   * This callable signature behaves similarly to the native `Symbol()` constructor.
   *
   * - When `Symbol` is available, this delegates to `Symbol(description)`.
   * - Otherwise a unique string identifier is generated internally.
   *
   * Each call always returns a **distinct value**.
   *
   * ------------------------------------------------------------------------
   *
   * @param description Optional debugging description.
   *
   * @returns A unique `PropertyKey` suitable for object property usage.
   *
   * ------------------------------------------------------------------------
   *
   * @example
   *
   * ```ts
   * const KEY_A: unique symbol = SymbolSafe("cache") as typeof KEY_A;
   * const KEY_B: unique symbol = SymbolSafe("cache") as typeof KEY_B;
   *
   * console.log(KEY_A === KEY_B); // false
   * ```
   *
   * ------------------------------------------------------------------------
   */
  // @ts-expect-error ignore for return `unique symbol`
  (description?: string | number): unique symbol;

  /** ------------------------------------------------------------------------
   * * Retrieves or creates a **global symbol-like key**.
   * ------------------------------------------------------------------------
   *
   * TypeScript identity preservation note:
   *
   * Consumers may optionally apply self-referential assertions to preserve
   * symbol identity narrowing:
   *
   * ```ts
   * const ROUTER_A: unique symbol = SymbolSafe.for("rzl:router.instance") as typeof ROUTER_A;
   * const ROUTER_B: unique symbol = SymbolSafe.for("rzl:router.instance") as typeof ROUTER_B;
   * ```
   *
   * This pattern allows TypeScript to approximate native `Symbol` intrinsic
   * inference behavior for custom symbol factory functions also type system
   * knows that `ROUTER_A === ROUTER_B`.
   *
   * Usage of explicit `unique symbol` annotations is optional and should
   * only be used when strict identity narrowing is required.
   *
   * ------------------------------------------------------------------------
   *
   * Behaves similarly to `Symbol.for()`.
   *
   * A shared registry is used to ensure that the same `key` always resolves
   * to the same symbol-like value.
   *
   * - Uses `Symbol.for(key)` when available.
   * - Otherwise stores and retrieves values from an internal fallback registry.
   *
   * ------------------------------------------------------------------------
   *
   * @param key Registry identifier.
   *
   * @returns A stable `PropertyKey` associated with the registry entry.
   *
   * ------------------------------------------------------------------------
   *
   * @example
   *
   * ```ts
   * const ROUTER_A: unique symbol = SymbolSafe.for("rzl:router.instance") as typeof ROUTER_A;
   * const ROUTER_B: unique symbol = SymbolSafe.for("rzl:router.instance") as typeof ROUTER_B;
   *
   * console.log(ROUTER_A === ROUTER_B); // true
   * ```
   *
   * ------------------------------------------------------------------------
   */
  // @ts-expect-error ignore for return `unique symbol`
  for(key: string): unique symbol;

  /** ------------------------------------------------------------------------
   * * Retrieves the registry key for a symbol-like value.
   * ------------------------------------------------------------------------
   *
   * Equivalent to the native `Symbol.keyFor()` behavior.
   *
   * Attempts to resolve the **registry key** associated
   * with a symbol-like value previously created via
   * `SymbolSafe.for()`.
   *
   * - Uses `Symbol.keyFor()` when available.
   * - Otherwise performs a lookup in the internal fallback registry.
   *
   * If the symbol is not present in the registry,
   * this method returns `undefined`.
   *
   * ------------------------------------------------------------------------
   *
   * @param sym Symbol-like value to resolve.
   *
   * @returns The registry key if found, otherwise `undefined`.
   *
   * ------------------------------------------------------------------------
   *
   * @example
   *
   * ```ts
   * const TOKEN: unique symbol= SymbolSafe.for("rzl:cache.token") as typeof TOKEN;
   *
   * console.log(SymbolSafe.keyFor(TOKEN));
   * // "rzl:cache.token"
   * ```
   *
   * ------------------------------------------------------------------------
   */
  keyFor(sym: symbol): string | undefined;
};
