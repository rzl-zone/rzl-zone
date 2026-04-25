// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Module } from "node:module";
import { isFunction, isObject } from "@/_internal/utils/helper";

/** ----------------------------------------------------------------
 * * ***Typed mapping of commonly-used Node.js builtin module identifiers
 * (including `node:`-prefixed and legacy aliases).***
 * ----------------------------------------------------------------
 *
 * This is a **best-effort typing helper**, not a canonical or version-
 * exhaustive list of all Node.js builtins.
 *
 * - ***⚠️ Note:***
 *      - This map provides **type-level hints only**.
 *      - Presence in this map does **not guarantee runtime availability**.
 *      - Availability of entries depends on the installed TypeScript version and `@types/node`.
 *
 * Consumers must ensure a Node.js runtime before calling `require`
 * with these identifiers.
 */
export type NodeBuiltinModuleMap = {
  // ======================
  // Filesystem
  // ======================
  "node:fs": typeof import("node:fs");
  fs: typeof import("node:fs");
  "node:fs/promises": typeof import("node:fs/promises");
  "fs/promises": typeof import("node:fs/promises");

  // ======================
  // Path / URL
  // ======================
  "node:path": typeof import("node:path");
  path: typeof import("node:path");
  "node:url": typeof import("node:url");
  url: typeof import("node:url");

  // ======================
  // OS / Process
  // ======================
  "node:os": typeof import("node:os");
  os: typeof import("node:os");
  "node:process": typeof import("node:process");
  process: typeof import("node:process");

  // ======================
  // Module system
  // ======================
  "node:module": typeof import("node:module");
  module: typeof import("node:module");

  // ======================
  // Buffer / Timers
  // ======================
  "node:buffer": typeof import("node:buffer");
  buffer: typeof import("node:buffer");
  "node:timers": typeof import("node:timers");
  timers: typeof import("node:timers");
  "node:timers/promises": typeof import("node:timers/promises");
  "timers/promises": typeof import("node:timers/promises");

  // ======================
  // Streams
  // ======================
  "node:stream": typeof import("node:stream");
  stream: typeof import("node:stream");
  "node:stream/promises": typeof import("node:stream/promises");
  "stream/promises": typeof import("node:stream/promises");
  "node:stream/consumers": typeof import("node:stream/consumers");
  "stream/consumers": typeof import("node:stream/consumers");
  "node:stream/web": typeof import("node:stream/web");
  "stream/web": typeof import("node:stream/web");

  // ======================
  // Crypto / Net / TLS
  // ======================
  "node:crypto": typeof import("node:crypto");
  crypto: typeof import("node:crypto");
  "node:net": typeof import("node:net");
  net: typeof import("node:net");
  "node:tls": typeof import("node:tls");
  tls: typeof import("node:tls");

  // ======================
  // HTTP
  // ======================
  "node:http": typeof import("node:http");
  http: typeof import("node:http");
  "node:https": typeof import("node:https");
  https: typeof import("node:https");
  "node:http2": typeof import("node:http2");
  http2: typeof import("node:http2");

  // ======================
  // Child / Worker
  // ======================
  "node:child_process": typeof import("node:child_process");
  child_process: typeof import("node:child_process");
  "node:worker_threads": typeof import("node:worker_threads");
  worker_threads: typeof import("node:worker_threads");

  // ======================
  // Events / Util / Assert
  // ======================
  "node:events": typeof import("node:events");
  events: typeof import("node:events");
  "node:util": typeof import("node:util");
  util: typeof import("node:util");
  "node:assert": typeof import("node:assert");
  assert: typeof import("node:assert");
  "node:assert/strict": typeof import("node:assert/strict");
  "assert/strict": typeof import("node:assert/strict");

  // ======================
  // Diagnostics / Debug
  // ======================
  "node:diagnostics_channel": typeof import("node:diagnostics_channel");
  diagnostics_channel: typeof import("node:diagnostics_channel");
  "node:inspector": typeof import("node:inspector");
  inspector: typeof import("node:inspector");

  // ======================
  // Encoding
  // ======================
  "node:string_decoder": typeof import("node:string_decoder");
  string_decoder: typeof import("node:string_decoder");

  // ======================
  // Readline / REPL
  // ======================
  "node:readline": typeof import("node:readline");
  readline: typeof import("node:readline");
  "node:readline/promises": typeof import("node:readline/promises");
  "readline/promises": typeof import("node:readline/promises");
  "node:repl": typeof import("node:repl");
  repl: typeof import("node:repl");

  // ======================
  // DNS
  // ======================
  "node:dns": typeof import("node:dns");
  dns: typeof import("node:dns");
  "node:dns/promises": typeof import("node:dns/promises");
  "dns/promises": typeof import("node:dns/promises");

  // ======================
  // Zlib
  // ======================
  "node:zlib": typeof import("node:zlib");
  zlib: typeof import("node:zlib");

  // ======================
  // VM / V8
  // ======================
  "node:vm": typeof import("node:vm");
  vm: typeof import("node:vm");
  "node:v8": typeof import("node:v8");
  v8: typeof import("node:v8");

  // ======================
  // Performance / Trace
  // ======================
  "node:perf_hooks": typeof import("node:perf_hooks");
  perf_hooks: typeof import("node:perf_hooks");
  "node:trace_events": typeof import("node:trace_events");
  trace_events: typeof import("node:trace_events");

  // ======================
  // Async / Legacy
  // ======================
  "node:async_hooks": typeof import("node:async_hooks");
  async_hooks: typeof import("node:async_hooks");
  "node:domain": typeof import("node:domain");
  domain: typeof import("node:domain");

  // ======================
  // Constants
  // ======================
  "node:constants": typeof import("node:constants");
  constants: typeof import("node:constants");
};

/** ----------------------------------------------------------------
 * * ***Callable `require`-like interface (runtime-safe).***
 * ----------------------------------------------------------------
 *
 * Represents a **minimal, honest abstraction** of Node.js `require`
 * that is safe to reference in mixed runtimes (CJS, ESM, bundlers,
 * and non-Node environments).
 *
 * - ***This type intentionally:***
 *       - Requires only the callable signature `(id: string) => any`.
 *       - Treats all standard `require` properties (`resolve`, `cache`,
 *         `main`, etc.) as **optional**.
 *
 * This avoids lying to the type system while still allowing
 * property access when a real Node.js `require` is available.
 *
 */
type RequireCallable = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (id: string): any;
} & Partial<NodeJS.Require>;

/** ------------------------------------------------------------------------
 * * Global object shape exposing a `require` function.
 * -------------------------------------------------------------------------
 *
 * Describes environments where a global `require` function may exist.
 *
 * This is commonly used for **runtime detection**, such as checking
 * whether `require` is available before attempting to use it.
 *
 * @example
 * ```ts
 * const g = globalThis as typeof globalThis & GlobalWithRequire;
 *
 * if (typeof g.require === "function") {
 *   const fs = g.require("fs");
 * }
 * ```
 */
type GlobalWithRequire = { require: RequireCallable };

/** ----------------------------------------------------------------
 * * ***Runtime type guard for a global `require` function.***
 * ----------------------------------------------------------------
 *
 * Determines whether a given value exposes a **callable `require`
 * property** at runtime.
 *
 * This guard does **not assume a Node.js environment** and does not
 * rely on environment heuristics such as `process`, `Node`, or
 * `process.versions.node`.
 *
 * - ***Instead, it performs a **pure runtime structural check**:***
 *       - The value must be an object.
 *       - It must expose a `require` property.
 *       - That property must be callable.
 *
 * - ***This makes the guard safe to use in:***
 *       - Node.js (CommonJS).
 *       - Node.js (ESM / loader contexts).
 *       - Bundler execution environments.
 *       - Browsers (where it will correctly return `false`).
 *
 * Implemented as a **user-defined type guard** to enable proper
 * TypeScript narrowing, allowing safe access to `value.require`
 * without repeated casting.
 *
 * @param value - Any value to test for a global `require` function.
 * @returns `true` if the value exposes a callable `require` property.
 *
 */
export const hasGlobalRequire = (value: unknown): value is GlobalWithRequire =>
  isObject(value) && isFunction(value.require);

/** ----------------------------------------------------------------
 * * ***Safely resolve the global `require` function.***
 * ----------------------------------------------------------------
 *
 * Attempts to retrieve the global CommonJS `require` function
 * if and only if it is **actually available at runtime**.
 *
 * Unlike naive Node checks (e.g. `process.versions.node`),
 * this function avoids false positives in environments such as:
 * - Node.js ESM loaders.
 * - Build-time execution environments.
 * - Bundler config evaluation.
 *
 * If `require` is not present, this function returns `undefined`
 * instead of throwing.
 *
 * ----------------------------------------------------------------
 * - ***⚠️ Note:***
 *    - This helper intentionally does not attempt to detect
 *      loader-injected or sandboxed `require` bindings.
 * ----------------------------------------------------------------
 *
 * @returns The global `require` function if available; otherwise `undefined`.
 */
export const getRuntimeRequire = (): RequireCallable | undefined => {
  if (!hasGlobalRequire(globalThis)) return undefined;
  return globalThis.require;
};

/** ----------------------------------------------------------------
 * * ***Deferred runtime `require` accessor.***
 * ----------------------------------------------------------------
 *
 * Provides a **lazy, runtime-resolved accessor** for a `require`
 * function without creating a static reference.
 *
 * - ***Intended for:***
 *       - Runtime-agnostic tooling.
 *       - Build / bundler utilities.
 *       - CLI infrastructure.
 * - ***Behavior:***
 *       - Delegates to a real `require` function *only if one exists at runtime*.
 *       - Avoids top-level `require` references that bundlers may rewrite.
 *       - Remains callable even when `require` is absent.
 *
 * When `Proxy` is available, property access (e.g. `require.resolve`)
 * is dynamically forwarded to the real `require` once it becomes
 * available.
 *
 * If invoked in an environment that does not expose `require`,
 * the call fails with a descriptive runtime error.
 *
 * ⚠️ Typed overloads do not guarantee that the requested module
 * exists or can be resolved at runtime.
 *
 * Runtime errors may still occur depending on the execution environment.
 *
 * ⚠️ This is **not** a polyfill and does **not** emulate Node.js
 * CommonJS resolution. It merely defers access to an existing
 * `require` function when present.
 *
 * ⚠️ When accessed before a real `require` is available,
 * properties such as `resolve`, `cache`, or `main`
 * may be `undefined`.
 */
export const __runtimeRequire: {
  <K extends keyof NodeBuiltinModuleMap>(id: K): NodeBuiltinModuleMap[K];
  (id: string): unknown;
} = ((x: RequireCallable) => {
  const r = getRuntimeRequire();

  if (r) return r;

  if (typeof Proxy !== "undefined") {
    return new Proxy(x, {
      get(target, prop: keyof RequireCallable) {
        const r2 = getRuntimeRequire();
        return r2 ? r2[prop] : target[prop];
      }
    });
  }

  return x;
})(function (this: unknown, id: string) {
  const r = getRuntimeRequire();
  if (r) return r.call(this, id);

  throw new Error(
    `Calling \`require\` for "${id}" in an environment that doesn't expose the \`require\` function.`
  );
});

/** ----------------------------------------------------------------
 * * ***Lazily resolves Node.js `createRequire`.***
 * ----------------------------------------------------------------
 *
 * Lazily resolves Node.js {@link Module.createRequire | **`createRequire`**}
 * **at runtime** using a strategy that is safe across mixed execution
 * environments (CJS, ESM, bundlers, and tooling contexts).
 *
 * - ***This helper intentionally avoids:***
 *       - Static ESM imports that may execute during build time.
 *       - Direct top-level `require` access that bundlers can rewrite or hoist.
 *
 * - ***Resolution strategy:***
 *       - If a global CommonJS `require` is available at runtime, the
 *          `node:module` builtin is loaded through the deferred.
 *          {@link __runtimeRequire | **`__runtimeRequire`**} accessor.
 *       - Otherwise, falls back to a dynamic `import("node:module")`,
 *          which is safe in ESM-only or bundled environments.
 *
 * This function does **not** assume a Node.js environment at evaluation
 * time, but **does require Node.js at runtime**. It will throw if the
 * `node:module` builtin cannot be resolved by either strategy.
 *
 * - ***Intended for:***
 *       - Tooling that operates across mixed CJS / ESM runtimes.
 *       - Bundler or compiler internals.
 *       - CLI configuration and plugin loaders.
 *
 * @returns
 * A reference to Node.js {@link Module.createRequire | **`createRequire`**}.
 *
 * @throws
 * Throws if the `node:module` builtin cannot be resolved at runtime.
 *
 * @example
 * ***ESM / bundler-safe usage:***
 * ```ts
 * const createRequire = await getCreateRequire();
 *
 * const require = createRequire(import.meta.url);
 *
 * const fs = require("fs");
 * const path = require("path");
 *
 * console.log(fs.existsSync(path.resolve("package.json")));
 * ```
 *
 * @example
 * ***Loading CommonJS or JSON config from ESM:***
 * ```ts
 * const createRequire = await getCreateRequire();
 *
 * const require = createRequire(process.cwd() + "/");
 *
 * const config = require("./my.config.cjs");
 * const pkg = require("./package.json");
 * ```
 *
 * @example
 * ***CommonJS (Node.js – compatibility usage):***
 *
 * In pure CommonJS environments this helper is usually unnecessary.
 * This example demonstrates interoperability with the same runtime-safe API.
 *
 * ```js
 * (async () => {
 *   const { getCreateRequire } = await import("./getCreateRequire.js");
 *
 *   const createRequire = await getCreateRequire();
 *   const requireFromHere = createRequire(__filename);
 *
 *   const pkg = requireFromHere("some-cjs-only-package");
 *   console.log(pkg);
 * })();
 * ```
 *
 * @example
 * ***UMD / IIFE (Node execution):***
 * ```js
 * const createRequire = await getCreateRequire();
 *
 * const requireFromHere =
 *   typeof __filename !== "undefined"
 *     ? createRequire(__filename)
 *     : createRequire(import.meta.url);
 *
 * const pkg = requireFromHere("some-cjs-only-package");
 * ```
 */
export async function getCreateRequire(): Promise<
  typeof import("node:module").createRequire
> {
  const r = getRuntimeRequire();
  if (r) {
    return __runtimeRequire("node:module").createRequire;
  }

  // ESM-safe fallback (unrun / tsdown / bundlers)
  const mod = await import("node:module");
  return mod.createRequire;
}
