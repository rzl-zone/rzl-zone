import "@rzl-zone/node-only";

import type {
  InlineConfig as _InlineConfig,
  UserConfig as _UserConfig,
  DepsConfig as _DepsConfig
} from "tsdown";

import type {
  Arrayable,
  StrictAwaitable,
  OverrideTypes,
  Prettify
} from "@/_internal/types/extra";

import semver from "semver";
import * as _tsDown from "tsdown";
// import {resolveUserConfig,mergeConfig ,defineConfig,Rolldown,} from "tsdown";

import { isArray, isFunction, toArray } from "@/_internal/utils/helper";

import { getPackageJson } from "@/core/get";
import { generatePackageBanner } from "@/core/generate/package-banner";

export type InlineConfig = _InlineConfig;

/** ----------------------------------------------------------------
 * * ***Override the default user config.***
 * ----------------------------------------------------------------
 *
 * Represents the user-facing configuration that can override
 * the library's internal defaults.
 *
 * All fields are optional and will be merged with the base defaults.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | `tsdown`} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this type
 * to be resolved correctly.
 *
 * ❌ **If `tsdown` is not installed**, TypeScript will fail to resolve
 * the underlying types (e.g.
 * `Cannot find module "tsdown" or its corresponding type declarations`),
 * and the related types may degrade to `any`.
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**}.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * import { type UserConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const config: UserConfig = {
 *   dts: false,
 *   minify: "esbuild",
 *   format: ["esm"]
 * };
 * ```
 */
export type UserConfig = Omit<
  _UserConfig,
  | "dts"
  | "clean"
  | "minify"
  | "sourcemap"
  | "format"
  | "fixedExtension"
  | "banner"
  | "deps"
> &
  UserConfigDefault;

/** ----------------------------------------------------------------
 * * ***Base user config without overridden defaults.***
 * ----------------------------------------------------------------
 *
 * A strict version of {@link UserConfig | **`UserConfig`**} with internal default-controlled
 * options omitted.
 *
 * - ***These fields are intentionally managed by the default config layer:***
 *       - `dts`.
 *       - `minify`.
 *       - `clean`.
 *       - `inlineOnly`.
 *       - `sourcemap`.
 *       - `format`.
 *       - `fixedExtension`.
 *       - `banner`.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | `tsdown`} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this type
 * to be resolved correctly.
 *
 * ❌ **If `tsdown` is not installed**, TypeScript will fail to resolve
 * the underlying types (e.g.
 * `Cannot find module "tsdown" or its corresponding type declarations`),
 * and the related types may degrade to `any`.
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**.}
 */
type InternalUserConfigBase = Omit<
  UserConfig,
  | "dts"
  | "minify"
  | "clean"
  | "deps"
  | "sourcemap"
  | "format"
  | "fixedExtension"
  | "banner"
>;

/** Deps option from `UserConfig.deps`  */
export type DepsConfig = Omit<_DepsConfig, "onlyAllowBundle" | "onlyBundle"> & {
  /** Whitelist of dependencies allowed to be bundled from `node_modules`.
   * Throws an error if any unlisted dependency is bundled.
   *
   * - `undefined`: Show warnings for bundled dependencies.
   * - `false` **(default)**: Suppress all warnings about bundled dependencies.
   *
   * Note: Be sure to include all required sub-dependencies as well.
   *
   * - **⚠️ Warning:**
   *       - Only effective in tsdown v0.21.1 or bellow.
   *       - Versions v0.21.1+ use {@link DepsConfig.onlyBundle | `onlyBundle`} instead, because these options is deprecated.
   *
   * @see {@link https://github.com/rolldown/tsdown/releases/tag/v0.21.2}
   */
  onlyAllowBundle?: Arrayable<string | RegExp> | false;
  /** Whitelist of dependencies allowed to be bundled from `node_modules`.
   * Throws an error if any unlisted dependency is bundled.
   *
   * - `undefined`: Show warnings for bundled dependencies.
   * - `false` **(default)**: Suppress all warnings about bundled dependencies.
   *
   * Note: Be sure to include all required sub-dependencies as well.
   *
   * - **⚠️ Warning:**
   *       - Only effective in tsdown v0.21.2 or later.
   *       - Versions below v0.21.2 use {@link DepsConfig.onlyAllowBundle | `onlyAllowBundle`}, because will ignore these options.
   *
   * @see {@link https://github.com/rolldown/tsdown/releases/tag/v0.21.2}
   */
  onlyBundle?: Arrayable<string | RegExp> | false;
};

type UserConfigDefault = {
  /** Enables generation of TypeScript declaration files (`.d.ts`).
   *
   * By default, this option is true, also auto-detected based on your project's `package.json`:
   * - If the `types` field is present, or if the main `exports` contains a `types` entry, declaration file generation is enabled by default.
   * - Otherwise, declaration file generation is disabled by default.
   *
   * @default true
   */
  dts?: _UserConfig["dts"];

  /** Clean directories before build.
   *
   * Default to output directory.
   * @default ["dist/*"]
   */
  clean?: _UserConfig["clean"];

  /** Minification strategy.
   *
   * @default false
   */
  minify?: _UserConfig["minify"];

  /** Bundle only the dependencies listed here; throw an error if any others are missing.
   *
   * - `undefined`: Show warnings for bundled dependencies.
   * - `false` **(default)**: Suppress all warnings about `inlineOnly` option.
   *
   * Note: Be sure to include all required sub-dependencies as well.
   *
   * ----------------------------------------------------------------
   * ⚠️ Version Compatibility
   *
   * - Only effective in **tsdown below v0.21.0**.
   * - Versions **v0.21.0** **`>=`** **v0.21.01**:
   *    - Use {@link DepsConfig.onlyAllowBundle | **`deps.onlyAllowBundle`**}.
   *      - ***Example:***
   *        ```json
   *        {
   *          deps: {
   *            onlyAllowBundle: true
   *          }
   *        }
   *        ```
   * - Versions **v0.21.2** or higher use
   *    - Use {@link DepsConfig.onlyBundle | **`deps.onlyBundle`**}
   *      as the transitional option.
   *      - ***Example:***
   *        ```json
   *        {
   *          deps: {
   *            onlyBundle: true
   *          }
   *        }
   *        ```
   *
   * ----------------------------------------------------------------
   * @see {@link https://github.com/rolldown/tsdown/releases/tag/v0.21.0}
   * @see {@link https://github.com/rolldown/tsdown/releases/tag/v0.21.2}
   */
  inlineOnly?: _UserConfig["inlineOnly"];

  /** Whether to generate source map files.
   *
   * Note that this option will always be `true` if you have
   * [`declarationMap`](https://www.typescriptlang.org/tsconfig/#declarationMap)
   * option enabled in your `tsconfig.json`.
   *
   * @default true
   */
  sourcemap?: _UserConfig["sourcemap"];

  /** Output formats to generate.
   *
   * - Available formats are:
   *    - `esm`: ESM.
   *    - `cjs`: CommonJS.
   *    - `iife`: IIFE.
   *    - `umd`: UMD.
   * @default ["cjs", "esm"]
   */
  format?: _UserConfig["format"];

  /** Use a fixed extension for output files.
   * - If `true`, the extension will always be `.cjs` or `.mjs`.
   * - Otherwise, it will depend on the package type.
   *
   * @default false
   */
  fixedExtension?: _UserConfig["fixedExtension"];

  /** Custom banner string injected into output files.
   *
   * Defaults to the value generated by **`generatePackageBanner`**.
   *
   * Set to `false` if you want to disable automatic banner injection.
   */
  banner?: _UserConfig["banner"] | false;

  /** Dependency handling options.
   *
   * - **⚠️ Warning:**
   *      - Only effective in tsdown **v0.21.0** or later.
   *      - Versions below **v0.21.0** will ignore these options.
   */
  deps?: DepsConfig;
};
type UserConfigInternal = InternalUserConfigBase & UserConfigDefault;

type UserConfigOptionsResult = Prettify<
  OverrideTypes<UserConfigInternal, { banner?: UserConfig["banner"] }>
>;

/** ----------------------------------------------------------------
 * * ***Default config input variants.***
 * ----------------------------------------------------------------
 *
 * - ***Supported forms:***
 *       - Single config object.
 *       - Array of config objects.
 *       - Async config resolver function.
 *       - Promise resolving to any of the above.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | `tsdown`} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this type
 * to be resolved correctly.
 *
 * ❌ **If `tsdown` is not installed**, TypeScript will fail to resolve
 * the underlying types (e.g.
 * `Cannot find module "tsdown" or its corresponding type declarations`),
 * and the related types may degrade to `any`.
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**}.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * resolveDefaultConfig({
 *   dts: false,
 *   format: ["esm"]
 * });
 *
 *
 * resolveDefaultConfig([
 *   { format: ["cjs"] },
 *   { format: ["esm"] }
 * ]);
 *
 * resolveDefaultConfig(async () => ({
 *   sourcemap: false
 * }));
 *
 * resolveDefaultConfig((_, ctx) => [
 * { format: ["esm"] },
 *   ctx.ci ? { minify: true } : { sourcemap: true }
 * ]);
 * ```
 */
export type ConfigOptions = StrictAwaitable<
  UserConfigFn | Arrayable<UserConfig>
>;

/** ----------------------------------------------------------------
 * * ***User config override function.***
 * ----------------------------------------------------------------
 *
 * Allows dynamic configuration based on build context.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | `tsdown`} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this type
 * to be resolved correctly.
 *
 * ❌ **If `tsdown` is not installed**, TypeScript will fail to resolve
 * the underlying types (e.g.
 * `Cannot find module "tsdown" or its corresponding type declarations`),
 * and the related types may degrade to `any`.
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**}.
 *
 * ----------------------------------------------------------------
 * @example
 * ```ts
 * import { type UserConfigFn } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const overrideConfig: UserConfigFn = (inline, ctx) => {
 *   if (ctx.ci) {
 *     return {
 *       sourcemap: false,
 *       minify: true
 *     };
 *   }
 *
 *   return {
 *     sourcemap: true
 *   };
 * };
 * ```
 */
export type UserConfigFn = (
  inlineConfig: InlineConfig,
  context: {
    ci: boolean;
  }
) => StrictAwaitable<Arrayable<UserConfig>>;

/** ----------------------------------------------------------------
 * * ***Config export variants.***
 * ----------------------------------------------------------------
 *
 * Represents all supported **exported configuration forms**
 * that a user can provide to the config resolver.
 *
 * This type mirrors the typical patterns used in modern
 * build tools and bundlers where configuration can be:
 *
 * - A **static config object**
 * - An **array of config objects**
 * - A **config resolver function**
 * - A **Promise resolving to either of the above**
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | `tsdown`} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this type
 * to be resolved correctly.
 *
 * ❌ **If `tsdown` is not installed**, TypeScript will fail to resolve
 * the underlying types (e.g.
 * `Cannot find module "tsdown" or its corresponding type declarations`),
 * and the related types may degrade to `any`.
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**}.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * // Static config
 * const config: UserConfigExport = {
 *   format: ["esm"]
 * };
 *
 * // Multiple configs
 * const config: UserConfigExport = [
 *   { format: ["esm"] },
 *   { format: ["cjs"] }
 * ];
 *
 * // Dynamic config
 * const config: UserConfigExport = (_, ctx) => ({
 *   sourcemap: !ctx.ci
 * });
 *
 * // Async config
 * const config: UserConfigExport = Promise.resolve({
 *   minify: true
 * });
 * ```
 */
export type UserConfigExport =
  | UserConfigFn
  | Arrayable<UserConfig>
  | Promise<UserConfigFn | Arrayable<UserConfig>>;

type TsdownCompat = {
  useOnlyBundle: boolean;
  useOnlyAllowBundle: boolean;
  allowInlineOnly: boolean;
};
function resolveTsdownCompat(version?: string): TsdownCompat {
  if (typeof version !== "string") {
    return {
      useOnlyBundle: true,
      useOnlyAllowBundle: false,
      allowInlineOnly: false
    };
  }

  return {
    useOnlyBundle: semver.gte(version, "0.21.2"),
    useOnlyAllowBundle: semver.lt(version, "0.21.2"),
    allowInlineOnly: semver.lt(version, "0.21.0")
  };
}

/** ----------------------------------------------------------------
 * * ***Base default configuration.***
 * ----------------------------------------------------------------
 *
 * Used as the foundation for all resolved configurations.
 *
 */
export const BASE_DEFAULT_CONFIG = {
  dts: true,
  minify: false,
  clean: ["dist/*"],
  sourcemap: true,
  format: ["cjs", "esm"],
  banner: undefined,
  // inlineOnly: false,
  // deps: {
  //   onlyBundle: false
  // },
  fixedExtension: false
} as const satisfies UserConfig;

let _cachedCompat: TsdownCompat | null = null;

async function getTsdownCompat(): Promise<TsdownCompat> {
  if (_cachedCompat) return _cachedCompat;

  const pkg = await getPackageJson();

  const raw =
    pkg.dependencies?.tsdown ||
    pkg.devDependencies?.tsdown ||
    pkg.peerDependencies?.tsdown;

  const version = raw ? semver.coerce(raw)?.version : undefined;

  _cachedCompat = resolveTsdownCompat(version);

  return _cachedCompat;
}

async function createInternalDefaultConfig(): Promise<UserConfigOptionsResult> {
  const defaultBanner = await generatePackageBanner();
  const compat = await getTsdownCompat();

  return {
    ...BASE_DEFAULT_CONFIG,

    // INLINE ONLY
    ...(compat.allowInlineOnly && {
      inlineOnly: false
    }),

    // DEPS (dynamic)
    deps: {
      ...(compat.useOnlyBundle && { onlyBundle: false }),
      ...(compat.useOnlyAllowBundle && { onlyAllowBundle: false })
    },

    banner: defaultBanner
  };
}

const isDisableBanner = (
  banner?: UserConfigInternal["banner"]
): banner is false => {
  return banner === false;
};

/** ----------------------------------------------------------------
 * * ***Resolve default configuration.***
 * ----------------------------------------------------------------
 *
 * Normalizes all supported config input shapes into a resolved config.
 *
 * This function is designed to act as a **config composition layer**
 * on top of bundler configuration tools such as
 * {@link https://github.com/rolldown/tsdown | **`tsdown`**}.
 *
 * - *Behavior:*
 *     - Merges user configuration with `INTERNAL_DEFAULT_CONFIG`.
 *     - Automatically injects a banner generated by `generatePackageBanner`.
 *     - Set `options.banner` to `false` to disable automatic banner injection.
 *
 * - *Supported input forms:*
 *     - Plain config object.
 *     - Array of config objects.
 *     - Resolver function returning a config or config array.
 *     - Promise resolving to any of the above.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | **`tsdown`**} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this export
 * to resolve correctly.
 *
 * ❌ **If {@link https://github.com/rolldown/tsdown | **`tsdown`**} is not installed**, importing this module will
 * result in a **runtime module resolution error** (e.g. `Cannot find module "tsdown"`).
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**.}
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Node.js only.***
 *
 * **DO NOT import this module in browser or client-side code.**
 *
 * - {@link https://github.com/rolldown/tsdown | **`tsdown`**} relies on Node.js–specific features such as:
 *    - filesystem access.
 *    - process environment variables.
 *    - native module resolution.
 * ----------------------------------------------------------------
 *
 * @param options
 * User-provided configuration or resolver.
 *
 * - **May be:**
 *      - A config object.
 *      - An array of config objects.
 *      - A resolver function returning a config or config array.
 *      - A Promise resolving to any of the above.
 *
 * ----------------------------------------------------------------
 *
 * @returns
 * A resolved configuration object or an array of configs,
 * depending on the original input shape.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Basic usage**
 *
 * ```ts
 * import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const config = await resolveDefaultConfig({
 *   entry: "src/index.ts",
 *   dts: false
 * });
 *
 * // ➔ returns an array of configs
 * // ➔ each item is merged with BASE_DEFAULT_CONFIG
 * ```
 * @see {@link BASE_DEFAULT_CONFIG | **`BASE_DEFAULT_CONFIG`**}.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Direct usage in `tsdown.config.ts`**
 *
 * `resolveDefaultConfig` can be exported directly as the config.
 *
 * ```ts
 * import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * export default resolveDefaultConfig({
 *   entry: ["src/index.ts"]
 * });
 * ```
 *
 * This works because `tsdown` accepts **awaitable config values**
 * (objects, arrays, promises, or resolver functions).
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ❌ **Invalid (nested resolver — will throw in tsdown)**
 *
 * ```ts
 * export default defineConfig(async () =>
 *   resolveDefaultConfig(async (_, ctx) => ({
 *     entry: ["src/index.ts"],
 *     sourcemap: !ctx.ci
 *   }))
 * );
 * ```
 *
 * ✅ **Valid**
 *
 * ```ts
 * export default defineConfig(
 *   resolveDefaultConfig(async (_, ctx) => ({
 *     entry: ["src/index.ts"],
 *     sourcemap: !ctx.ci
 *   }))
 * );
 * ```
 *
 * Resolver functions must be passed **directly** to `defineConfig`.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Promise-based configuration**
 *
 * ```ts
 * import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const config = await resolveDefaultConfig(
 *   Promise.resolve({
 *     entry: ["src/index.ts"],
 *     sourcemap: false
 *   })
 * );
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Conditional configuration (CI-aware)**
 *
 * ```ts
 * import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const config = await resolveDefaultConfig((_, ctx) => {
 *   return ctx.ci
 *     ? { entry: ["src/index.ts"], sourcemap: false, minify: true }
 *     : { entry: ["src/index.ts"], sourcemap: true };
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Conditional resolver returning multiple configs**
 *
 * ```ts
 * import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const configs = await resolveDefaultConfig((_, ctx) => [
 *   { format: ["esm"] },
 *   ctx.ci
 *     ? { minify: true }
 *     : { sourcemap: true }
 * ]);
 *
 * // ➜ returns an array of configs
 * // ➜ each item is merged with BASE_DEFAULT_CONFIG
 * ```
 *
 * @see {@link BASE_DEFAULT_CONFIG | **`BASE_DEFAULT_CONFIG`**}.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Multiple entry configurations**
 *
 * ```ts
 * import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const configs = await resolveDefaultConfig([
 *   {
 *     entry: ["src/index.ts"]
 *   },
 *   {
 *     entry: ["src/cli/*"],
 *     outDir: "dist/cli",
 *     format: ["cjs"],
 *     dts: false
 *   }
 * ]);
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Usage with `defineConfig` from `tsdown`**
 *
 * ```ts
 * import { defineConfig } from "tsdown";
 * import { resolveDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * export default defineConfig(
 *   resolveDefaultConfig([
 *     { entry: ["src/index.ts"] },
 *     {
 *       entry: ["src/cli/*"],
 *       outDir: "dist/cli",
 *       format: ["cjs"],
 *       dts: false
 *     }
 *   ])
 * );
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Usage with the bundled `tsdown` facade**
 *
 * ```ts
 * import {
 *   tsdown,
 *   resolveDefaultConfig
 * } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * export default tsdown.defineConfig(
 *   resolveDefaultConfig({
 *     entry: ["src/index.ts"]
 *   })
 * );
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @environment `node`
 *
 * @remarks
 *
 * - This function intentionally **preserves the input shape**
 *   (single object or array) to allow flexible composition.
 *
 * - The resolver performs a **shallow merge only**, nested objects are not deeply merged.
 */
export async function resolveDefaultConfig(
  options: UserConfigFn
): Promise<UserConfigFn>;
export async function resolveDefaultConfig(
  options: UserConfig[]
): Promise<UserConfig>;
export async function resolveDefaultConfig(
  options: UserConfig
): Promise<UserConfig[]>;
export async function resolveDefaultConfig(
  options: UserConfigExport
): Promise<UserConfigExport>;
export async function resolveDefaultConfig(
  options: UserConfig | UserConfig[] | UserConfigFn | UserConfigExport
): Promise<UserConfigExport> {
  const resolved = await Promise.resolve(options);
  // const defaultBanner = await generatePackageBanner();

  // const _BASE_DEFAULT_CONFIG: UserConfigOptionsResult = {
  //   ...BASE_DEFAULT_CONFIG,
  //   banner: defaultBanner
  // };

  const _BASE_DEFAULT_CONFIG = await createInternalDefaultConfig();

  async function mergeDefaultConfig(
    input: Arrayable<StrictAwaitable<UserConfigInternal>>
  ) {
    const resolvedList = await Promise.all(toArray(input));
    const data: UserConfigOptionsResult[] = [];

    for (const opts of resolvedList) {
      if (!opts || typeof opts !== "object") continue;

      data.push({
        ..._BASE_DEFAULT_CONFIG,
        ...opts,
        banner: isDisableBanner(opts.banner)
          ? undefined
          : (opts.banner ?? _BASE_DEFAULT_CONFIG.banner)
      });
    }

    return data;

    // const list = toArray(input);

    // const resolvedList: UserConfigInternal[] = [];
    // for (const item of list) {
    //   resolvedList.push(await item);
    // }

    // const data: UserConfigOptionsResult[] = [];

    // for (const opts of resolvedList) {
    //   if (!opts || typeof opts !== "object") continue;

    //   data.push({
    //     ..._BASE_DEFAULT_CONFIG,
    //     ...opts,
    //     banner: isDisableBanner(opts.banner) ? undefined : opts.banner
    //   });
    // }

    // return data;
  }

  // Promise
  if (isFunction(resolved)) {
    return async (inline, ctx) => {
      const next = await resolved(inline, ctx);

      if (isFunction(next)) {
        throw new Error(
          "resolveDefaultConfig(): Nested resolver functions are not supported."
        );
      }

      const merged = await mergeDefaultConfig(next);

      return merged;
    };
  }

  // Array
  if (isArray(resolved)) {
    if (resolved.length === 0) {
      return [_BASE_DEFAULT_CONFIG];
    }

    return mergeDefaultConfig(resolved);
  }

  // Object
  if (resolved) {
    return {
      ..._BASE_DEFAULT_CONFIG,
      ...resolved,
      banner: isDisableBanner(resolved.banner)
        ? undefined
        : (resolved.banner ?? _BASE_DEFAULT_CONFIG.banner)
    };
  }

  // Empty
  return _BASE_DEFAULT_CONFIG;
}

/** ----------------------------------------------------------------
 * * ***Create default config.***
 * ----------------------------------------------------------------
 *
 * Shorthand helper for merging user overrides with the internal
 * base default configuration.
 *
 * This helper mirrors the typical **`resolveDefaultConfig()`**
 * pattern commonly used in bundler `defineConfig()` factories.
 *
 * Unlike {@link resolveDefaultConfig | `resolveDefaultConfig`}, this helper is intended for
 * **static configuration objects only**.
 *
 * ----------------------------------------------------------------
 *
 * @description
 * - Designed for **simple configuration factories**.
 * - Accepts a single config object and merges it with
 *   `INTERNAL_DEFAULT_CONFIG`.
 * - Does **not support resolver functions** or contextual
 *   configuration.
 *
 * If you need dynamic configuration based on environment or CI
 * context, use {@link resolveDefaultConfig | `resolveDefaultConfig`} instead.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | **`tsdown`**} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this export
 * to resolve correctly.
 *
 * ❌ **If {@link https://github.com/rolldown/tsdown | **`tsdown`**} is not installed**, importing this module will
 * result in a **runtime module resolution error** (e.g. `Cannot find module "tsdown"`).
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**.}
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Node.js only.***
 *
 * **DO NOT import this module in browser or client-side code.**
 *
 * - {@link https://github.com/rolldown/tsdown | **`tsdown`**} relies on Node.js–specific features such as:
 *    - filesystem access.
 *    - process environment variables.
 *    - native module resolution.
 * ----------------------------------------------------------------
 *
 * @param options
 * User config overrides.
 *
 * ----------------------------------------------------------------
 *
 * @returns
 * A configuration object merged with `INTERNAL_DEFAULT_CONFIG`.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Basic usage**
 *
 * ```ts
 * import { createDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * const config = await createDefaultConfig({
 *   entry: ["src/index.ts"],
 *   format: ["esm"]
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Usage with `defineConfig` (direct import)**
 *
 * ```ts
 * import { defineConfig } from "tsdown";
 * import { createDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * export default defineConfig([
 *   await createDefaultConfig({
 *     entry: ["src/browser.ts"],
 *     format: "umd",
 *     sourcemap: false
 *   }),
 *   await createDefaultConfig({
 *     entry: ["src/index.ts"]
 *   })
 * ]);
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Usage with bundled `tsdown` facade**
 *
 * ```ts
 * import { tsdown, createDefaultConfig } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 * export default tsdown.defineConfig([
 *   await createDefaultConfig({
 *     entry: ["src/browser.ts"],
 *     format: "umd",
 *     sourcemap: false
 *   }),
 *   await createDefaultConfig({
 *     entry: ["src/index.ts"]
 *   })
 * ]);
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Mixed usage with `resolveDefaultConfig`**
 *
 * ```ts
 * import { defineConfig } from "tsdown";
 * import {
 *   createDefaultConfig,
 *   resolveDefaultConfig
 * } from "@rzl-zone/build-tools/bundler/tsdown";
 *
 *
 * // When wrapped with `resolveDefaultConfig`, configuration entries
 * // may be provided either synchronously or asynchronously,
 * // as the resolver accepts Awaitable values.
 * export default defineConfig(
 *   resolveDefaultConfig([
 *     await createDefaultConfig({
 *       entry: ["src/browser.ts"],
 *       format: "umd",
 *       sourcemap: false
 *     }),
 *     createDefaultConfig({
 *       entry: ["src/index.ts"]
 *     })
 *   ])
 * );
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @see {@link resolveDefaultConfig | `resolveDefaultConfig`}
 * @environment `node`
 */
export const createDefaultConfig = async (
  options: UserConfig
): Promise<UserConfigOptionsResult> => {
  const base = await createInternalDefaultConfig();

  const finalBanner = isDisableBanner(options.banner)
    ? undefined
    : (options.banner ?? base.banner);

  return {
    ...base,
    ...options,

    deps: {
      ...base.deps,
      ...options.deps
    },

    banner: finalBanner
  };

  // return {
  //   ...BASE_DEFAULT_CONFIG,
  //   ...options,
  //   banner: finalBanner
  // };
};

type TsDown = typeof _tsDown;

/** ----------------------------------------------------------------
 * * ***Package `tsdown` bundler API (Node.js only).***
 * ----------------------------------------------------------------
 * Thin namespace re-export of the {@link https://github.com/rolldown/tsdown | **`tsdown`**} package.
 *
 * - This export is provided as a **convenience facade** only.
 * - The actual implementation is resolved from the consumer's
 * dependency graph.
 * - *Typical use cases:*
 *     - `defineConfig()` usage.
 *     - Programmatic bundler configuration.
 *     - Build pipelines and tooling.
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Peer dependency required.***
 *
 * {@link https://github.com/rolldown/tsdown | **`tsdown`**} is declared as a
 * **peer dependency** of this package.
 *
 * You **MUST install it explicitly** in your project for this export
 * to resolve correctly.
 *
 * ❌ **If {@link https://github.com/rolldown/tsdown | **`tsdown`**} is not installed**, importing this module will
 * result in a **runtime module resolution error** (e.g. `Cannot find module "tsdown"`).
 *
 * @see {@link https://tsdown.dev/guide/getting-started#installation | **`tsdown installation guide`**.}
 *
 * ----------------------------------------------------------------
 * ⚠️ ***Node.js only.***
 *
 * **DO NOT import this module in browser or client-side code.**
 *
 * - {@link https://github.com/rolldown/tsdown | **`tsdown`**} relies on Node.js–specific features such as:
 *    - filesystem access.
 *    - process environment variables.
 *    - native module resolution.
 * ----------------------------------------------------------------
 *
 * @see {@link https://tsdown.dev | **`https://tsdown.dev`**.}
 * @environment `node`.
 *
 */
export const tsdown: TsDown = _tsDown;

/** ----------------------------------------------------------------
 * * ***Filter process warnings at runtime.***
 * ----------------------------------------------------------------
 *
 * Monkey-patches `process.stderr.write` to suppress specific noisy
 * warnings emitted by tooling such as `tsdown`, `rolldown`,
 * or other build-time utilities that bypass the official logger API.
 *
 * These warnings are written directly to stderr, making them
 * impossible to silence using standard logger hooks.
 *
 * ----------------------------------------------------------------
 *
 * @description
 *
 * - Intercepts all `process.stderr.write` calls.
 * - Extracts string content from the output chunk.
 * - Suppresses messages that match configured patterns.
 * - Forwards all other messages to the original stderr writer.
 *
 * This utility acts as a **last-resort filtering mechanism**
 * when upstream tooling does not expose proper logging hooks.
 *
 * ----------------------------------------------------------------
 *
 * @remarks
 *
 * This utility is **not tied to any specific config helper**.
 *
 * - Can be used with:
 *    - `resolveDefaultConfig`
 *    - `createDefaultConfig`
 *    - native `tsdown` config (`defineConfig`)
 *    - direct `build()` API
 *    - or any custom build script
 *
 * It works by patching the global `process.stderr.write`,
 * so it applies to **any tool emitting warnings to stderr**.
 *
 * ----------------------------------------------------------------
 *
 * @param patterns
 * Additional patterns used to match and suppress warnings.
 *
 * - Each pattern is matched using `String.prototype.includes`.
 * - Invalid values (non-string, empty, or whitespace-only) are **ignored at runtime**.
 * - Patterns are automatically **trimmed and sanitized**.
 *
 * ----------------------------------------------------------------
 *
 * @param options
 * Optional configuration for filter behavior.
 *
 * ----------------------------------------------------------------
 *
 * @returns
 * `void`
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Basic usage (default behavior)**
 *
 * ```ts
 * applyWarningFilter();
 * ```
 *
 * Filters:
 * - `[MISSING_EXPORT] Warning`
 * - `[PLUGIN_TIMINGS] Warning`
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Extend default filter**
 *
 * ```ts
 * applyWarningFilter([
 *   "[ANOTHER_WARNING]"
 * ]);
 * ```
 *
 * Filters:
 * - `[MISSING_EXPORT] Warning`
 * - `[PLUGIN_TIMINGS] Warning`
 * - `[ANOTHER_WARNING]`
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Override default filters**
 *
 * ```ts
 * applyWarningFilter(
 *   ["[ANOTHER_WARNING]"],
 *   {
 *     includeMissingExportWarning: false,
 *     includePluginTimingsWarning: false
 *   }
 * );
 * ```
 *
 * Filters:
 * - `[ANOTHER_WARNING]`
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Partial match (recommended)**
 *
 * ```ts
 * applyWarningFilter([
 *   "MISSING_EXPORT",
 *   "PLUGIN_TIMINGS"
 * ]);
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Usage (top-level, recommended)**
 *
 * Apply the filter once at the top of your config file:
 *
 * ```ts
 * applyWarningFilter();
 *
 * export default resolveDefaultConfig({
 *   entry: ["src/index.ts"]
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Usage inside config resolver**
 *
 * You can also call the filter inside a resolver function.
 * This is useful when applying dynamic configuration:
 *
 * ```ts
 * export default resolveDefaultConfig(() => {
 *   applyWarningFilter(
 *     ["[ANOTHER_WARNING]"]
 *   );
 *
 *   return [
 *     {
 *       entry: {
 *         index: "src/index.ts"
 *       }
 *     }
 *   ];
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Usage with native tsdown config**
 *
 * ```ts
 * import { defineConfig } from "tsdown";
 *
 * applyWarningFilter(["MISSING_EXPORT"]);
 *
 * export default defineConfig({
 *   entry: ["src/index.ts"]
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @example
 * **Programmatic usage (build script)**
 *
 * ```ts
 * import { build } from "tsdown";
 *
 * applyWarningFilter();
 *
 * await build({
 *   entry: ["src/index.ts"]
 * });
 * ```
 *
 * ----------------------------------------------------------------
 *
 * ⚠️ ***Important Notes***
 *
 * - This modifies global process behavior (**side-effect**).
 * - Must be executed **before** build tools emit logs.
 * - Not recommended for long-running applications.
 *
 * ----------------------------------------------------------------
 *
 * ⚠️ ***Node.js only***
 *
 * **DO NOT use this in browser or client-side environments.**
 *
 * ----------------------------------------------------------------
 *
 * @category Build Utilities
 * @environment `node`
 *
 * ----------------------------------------------------------------
 *
 * @remarks
 *
 * This utility is **not tied to any specific configuration helper**.
 *
 * - It can be used with:
 *    - `resolveDefaultConfig`
 *    - `createDefaultConfig`
 *    - native `tsdown` config (`defineConfig`)
 *    - direct `build()` API
 *    - or any custom Node.js build script
 *
 * ----------------------------------------------------------------
 *
 * Internally, this function patches the global `process.stderr.write`,
 * meaning it will affect **all warnings emitted to stderr** during
 * the current process lifecycle.
 *
 * - As a result:
 *    - The filter applies globally across all tools.
 *    - It is not limited to `tsdown` or any specific bundler.
 *    - It may also suppress warnings from unrelated libraries if
 *      they match the provided patterns.
 *
 * ----------------------------------------------------------------
 *
 * For predictable behavior, it is recommended to call this function:
 *    - once
 *    - as early as possible (before any build or logging starts)
 *
 * ----------------------------------------------------------------
 */
export function applyWarningFilter(
  patterns?: readonly string[],
  options?: {
    /** ----------------------------------------------------------------
     * * ***Include `[MISSING_EXPORT]` warning filter.***
     * ----------------------------------------------------------------
     *
     * Controls whether the built-in filter for:
     *
     * ```txt
     * [MISSING_EXPORT] Warning
     * ```
     *
     * is applied.
     *
     * ----------------------------------------------------------------
     *
     * @remarks
     *
     * - When `true` **(default)**, this pattern is included and merged
     *   with user-provided `patterns`.
     * - When `false`, it is excluded unless explicitly provided.
     *
     * ----------------------------------------------------------------
     *
     * This warning is typically emitted by underlying tooling
     * (e.g. dts bundling or rolldown internals) and may not be
     * configurable through official `tsdown` options.
     *
     * In such cases, filtering the output is the only practical way
     * to suppress this warning.
     *
     * ----------------------------------------------------------------
     *
     * This utility only suppresses warnings at the output level.
     * It does not disable the underlying checks or warning generation.
     *
     * ----------------------------------------------------------------
     *
     * @default true
     */
    includeMissingExportWarning?: boolean;

    /** ----------------------------------------------------------------
     * * ***Include `[PLUGIN_TIMINGS]` warning filter.***
     * ----------------------------------------------------------------
     *
     * Controls whether the built-in filter for:
     *
     * ```txt
     * [PLUGIN_TIMINGS] Warning
     * ```
     *
     * is applied.
     *
     * ----------------------------------------------------------------
     *
     * @remarks
     *
     * - When `true` **(default)**, this pattern is included and merged
     *   with user-provided `patterns`.
     * - When `false`, it is excluded unless explicitly provided.
     *
     * ----------------------------------------------------------------
     *
     * This warning can also be disabled via the official `tsdown`
     * configuration:
     *
     * ```ts
     * checks: {
     *   pluginTimings: false
     * }
     * ```
     *
     * In such cases, using the built-in configuration is preferred
     * over filtering the output.
     *
     * ----------------------------------------------------------------
     *
     * This utility only suppresses warnings at the output level.
     * It does not disable the underlying checks or warning generation.
     *
     * ----------------------------------------------------------------
     *
     * @default true
     */
    includePluginTimingsWarning?: boolean;
  }
): void {
  const DEFAULT_PATTERNS: string[] = [];

  if (options?.includeMissingExportWarning ?? true) {
    DEFAULT_PATTERNS.push("[MISSING_EXPORT] Warning");
  }

  if (options?.includePluginTimingsWarning ?? true) {
    DEFAULT_PATTERNS.push("[PLUGIN_TIMINGS] Warning");
  }

  const safePatterns = (patterns ?? [])
    .filter((p): p is string => typeof p === "string")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const finalPatterns = Array.from(
    new Set([...DEFAULT_PATTERNS, ...safePatterns])
  );

  const orig = process.stderr.write.bind(process.stderr);

  process.stderr.write = ((
    ...args: Parameters<typeof process.stderr.write>
  ): ReturnType<typeof process.stderr.write> => {
    const [chunk] = args;

    let text = "";

    if (typeof chunk === "string") {
      text = chunk;
    } else if (Buffer.isBuffer(chunk)) {
      text = chunk.toString("utf8");
    }

    if (finalPatterns.some((p) => text.includes(p))) {
      return true;
    }

    return orig(...args);
  }) as typeof process.stderr.write;
}
