import "@rzl-zone/node-only";

import type { NonUndefined } from "@/_internal/types/extra";

import * as _rolldown from "rolldown";
import * as _rolldownPlugin from "rolldown/plugins";

import { nodeExternalPatterns } from "./utils";

type Rolldown = typeof _rolldown;
type RolldownPlugin = typeof _rolldownPlugin;

type RolldownEsmExternalRequirePlugin =
  RolldownPlugin["esmExternalRequirePlugin"];

type BuiltinPlugin = ReturnType<RolldownEsmExternalRequirePlugin>;

type EsmExternalRequirePluginOptions = NonUndefined<
  Parameters<RolldownEsmExternalRequirePlugin>[0]
>;

/** ----------------------------------------------------------------
 * * ***Esm external require plugin wrapper.***
 * ----------------------------------------------------------------
 *
 * Creates an `esmExternalRequirePlugin` instance with predefined
 * Node.js-related externals.
 *
 * This ensures that Node built-in modules are not bundled and
 * remain as runtime `require()` calls when targeting CJS/ESM hybrids.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/rolldown | **`rolldown`**} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this export
 * to resolve correctly.
 *
 * ❌ **If {@link https://github.com/rolldown/rolldown | **`rolldown`**} is not installed**, importing this module will
 * result in a **runtime module resolution error** (e.g. `Cannot find module "rolldown"`).
 *
 * @see {@link https://rolldown.rs/guide/getting-started#installation | **`rolldown installation guide`**.}
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Node.js only.***
 *
 * **DO NOT import this module in browser or client-side code.**
 *
 * - {@link https://github.com/rolldown/rolldown | `rolldown`} relies on Node.js–specific features such as:
 *      - filesystem access.
 *      - process environment variables.
 *      - native module resolution.
 * ----------------------------------------------------------------
 *
 * @returns A configured `esmExternalRequirePlugin` instance.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * import { defineConfig } from "tsdown";
 * import { externalEsmRequirePlugin } from "@rzl-zone/build-tools/bundler-rolldown";
 *
 * export default defineConfig({
 *   plugins: [externalEsmRequirePlugin()]
 * });
 *
 * // Or
 * export default defineConfig({
 *   plugins: [externalEsmRequirePlugin({
 *      external: ["react", "react-node"]
 *   })]
 * });
 * ```
 * @environment `node`.
 */
export const externalEsmRequirePlugin = (
  options?: EsmExternalRequirePluginOptions
): BuiltinPlugin => {
  const { external = nodeExternalPatterns, skipDuplicateCheck = true } =
    options || {};

  return _rolldownPlugin.esmExternalRequirePlugin({
    skipDuplicateCheck,
    external
  });
};

/** ----------------------------------------------------------------
 * * ***Rolldown plugin collection (Node.js only).***
 * ----------------------------------------------------------------
 * Namespace re-export of **`rolldown/plugins`**.
 *
 * - This export acts as a **pass-through facade** and does not bundle.
 *      or ship the actual plugin implementations.
 * - ***Typical use cases:***
 *      - Externalization of Node built-ins.
 *      - Hybrid CJS / ESM builds.
 *      - Advanced bundler customization.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/rolldown | **`rolldown`**} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this export
 * to resolve correctly.
 *
 * ❌ **If {@link https://github.com/rolldown/rolldown | **`rolldown`**} is not installed**, importing this module will
 * result in a **runtime module resolution error** (e.g. `Cannot find module "rolldown"`).
 *
 * @see {@link https://rolldown.rs/guide/getting-started#installation | **`rolldown installation guide`**.}
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Node.js only.***
 *
 * **DO NOT import this module in browser or client-side code.**
 *
 * - {@link https://github.com/rolldown/rolldown | `rolldown`} relies on Node.js–specific features such as:
 *      - filesystem access.
 *      - process environment variables.
 *      - native module resolution.
 * ----------------------------------------------------------------
 *
 * @see {@link https://rolldown.rs | **`https://rolldown.rs`**.}
 * @environment `node`.
 */
export const rolldownPlugin: RolldownPlugin = _rolldownPlugin;

/** ----------------------------------------------------------------
 * * ***Rolldown bundler API (Node.js only).***
 * ----------------------------------------------------------------
 * Namespace re-export of **`rolldown`**.
 *
 * - This export acts as a **pass-through facade** and does not bundle
 *   or ship the actual bundler implementation.
 * - ***Typical use cases:***
 *      - Programmatic bundler configuration.
 *      - Custom build pipelines.
 *      - Internal tooling and CLI integrations.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/rolldown | **`rolldown`**} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this export
 * to resolve correctly.
 *
 * ❌ **If {@link https://github.com/rolldown/rolldown | **`rolldown`**} is not installed**, importing this module will
 * result in a **runtime module resolution error**
 * (e.g. `Cannot find module "rolldown"`).
 *
 * @see {@link https://rolldown.rs/guide/getting-started#installation | **`rolldown installation guide`**.}
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Node.js only.***
 *
 * **DO NOT import this module in browser or client-side code.**
 *
 * - {@link https://github.com/rolldown/rolldown | `rolldown`} relies on Node.js–specific features such as:
 *      - filesystem access.
 *      - process environment variables.
 *      - native module resolution.
 * ----------------------------------------------------------------
 *
 * @see {@link https://rolldown.rs | **`https://rolldown.rs`**.}
 * @environment `node`.
 */
export const rolldown: Rolldown = _rolldown;
