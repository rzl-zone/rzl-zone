import "@rzl-zone/node-only";

import type { OmitStrict, Prettify } from "../types/extra";

import os from "node:os";
import * as fg from "fast-glob";

import {
  isPlainObject,
  safeStableStringify,
  type SafeStableStringifyOptions
} from "@/_internal/utils/helper";

type IfTrueGeneric<T extends boolean, K> = T extends true ? K : never;

/** ----------------------------------------------------------------
 * * ***Supported pattern matching options.***
 * ----------------------------------------------------------------
 * Defines the subset of {@link fg | `fast-glob`} options exposed by
 * this module for pattern-based file resolution.
 *
 * This type intentionally omits several low-level or environment-
 * controlled fields to ensure predictable and safe behavior.
 *
 * ----------------------------------------------------------------
 *
 * *Excluded options (managed internally):*
 *
 * - `fs`
 * - `cwd`
 * - `stats`
 * - `deep`
 * - `extglob`
 * - `suppressErrors`
 * - `braceExpansion`
 *
 * These fields are controlled by the runtime environment and should
 * not be overridden by consumers.
 *
 * ----------------------------------------------------------------
 * @template FilesOnly
 * When `true`, directory filtering options (`onlyFiles`, `onlyDirectories`)
 * are removed from the public API surface, preventing consumers from
 * modifying directory matching behavior.
 *
 * @template ForceUnique
 * When `true`, the `unique` option is removed from the public API to enforce internal uniqueness handling.
 *
 * This allows higher-level utilities to guarantee that matched results
 * are always deduplicated.
 *
 * ----------------------------------------------------------------
 *
 * This type serves as the public configuration contract used when
 * resolving glob patterns.
 */
export type PatternOptions<
  FilesOnly extends boolean = false,
  ForceUnique extends boolean = false
> = OmitStrict<
  fg.Options,
  | "fs"
  | "cwd"
  | "stats"
  | "deep"
  | "extglob"
  | "suppressErrors"
  | "braceExpansion"
  | "dot"
  | IfTrueGeneric<FilesOnly, "onlyFiles" | "onlyDirectories">
  | IfTrueGeneric<ForceUnique, "unique">,
  { skipPrettify: true }
> & {
  /** Allow patterns to match entries that begin with a period (`.`).
   *
   * @default true
   */
  dot?: boolean;
};

/** ----------------------------------------------------------------
 * * ***Pattern configuration wrapper.***
 * ----------------------------------------------------------------
 *
 * Provides an optional container for {@link PatternOptions | `PatternOptions`}.
 *
 * This wrapper allows pattern matching configuration to be composed
 * within higher-level configuration objects without flattening
 * the option namespace.
 *
 * ----------------------------------------------------------------
 *
 * @template FilesOnly
 * When `true`, directory-related options (`onlyFiles`, `onlyDirectories`)
 * are removed from the public configuration to enforce file-only matching.
 *
 * @template ForceUnique
 * When `true`, the `unique` option is removed from the underlying
 * {@link PatternOptions | `PatternOptions`} to guarantee deduplicated results.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * const config: PatternConfig = {
 *   patternOptions: {
 *     dot: true
 *   }
 * };
 * ```
 */
export type PatternConfig<
  FilesOnly extends boolean = false,
  ForceUnique extends boolean = false
> = Prettify<{
  /** ----------------------------------------------------------------
   * * ***Pattern matching options.***
   * ----------------------------------------------------------------
   *
   * Optional configuration for controlling file pattern resolution.
   *
   * When provided, these options are sanitized and merged with
   * the internal default configuration before being passed to
   * {@link fg | `fast-glob`}.
   *
   * @see {@link PatternOptions | `PatternOptions`} for supported fields.
   */
  patternOptions?: PatternOptions<FilesOnly, ForceUnique>;
}>;

/** ----------------------------------------------------------------
 * * ***Default pattern matching configuration.***
 * ----------------------------------------------------------------
 *
 * Represents the canonical baseline configuration used when
 * resolving pattern options.
 *
 * These values are applied whenever a user does not explicitly
 * provide overrides.
 *
 * This object also acts as the runtime source of truth for
 * allowed pattern option keys.
 */
export const defaultPatternOptions: PatternOptions = {
  absolute: false,
  baseNameMatch: false,
  caseSensitiveMatch: true,
  concurrency: os.cpus().length,
  dot: true,
  followSymbolicLinks: true,
  globstar: true,
  ignore: [],
  markDirectories: false,
  objectMode: false,
  onlyDirectories: false,
  onlyFiles: true,
  unique: true,
  throwErrorOnBrokenSymbolicLink: false
};

/** ----------------------------------------------------------------
 * * ***Determines whether a pattern option key is allowed.***
 * ----------------------------------------------------------------
 *
 * Evaluates whether a given {@link PatternOptions | `PatternOptions`}
 * key is permitted under the provided runtime policy.
 *
 * This function enforces restrictions such as:
 *
 * - Disallowing directory-related options when `filesOnly` is enabled.
 * - Preventing external control over the `unique` option when
 *   `forceUnique` is enabled.
 *
 * ----------------------------------------------------------------
 *
 * @param key
 * A candidate {@link PatternOptions | `PatternOptions`} property key.
 *
 * @param policy
 * Optional runtime policy controlling which keys are allowed.
 *
 * @returns
 * `true` if the key is permitted under the current policy,
 * otherwise `false`.
 *
 * @internal
 */
function isKeyAllowed(
  key: keyof PatternOptions,
  policy?: PatternRuntimePolicy<boolean, boolean>
): boolean {
  if (!policy) return true;

  if (policy.filesOnly && (key === "onlyFiles" || key === "onlyDirectories"))
    return false;

  if (policy.forceUnique && key === "unique") return false;

  return true;
}

/** ----------------------------------------------------------------
 * * ***Runtime whitelist of allowed pattern option keys.***
 * ----------------------------------------------------------------
 *
 * Derived directly from {@link defaultPatternOptions | `defaultPatternOptions`}.
 *
 * This ensures strict synchronization between:
 *
 * - The static {@link PatternOptions | `PatternOptions`} type.
 * - Runtime validation logic used during option sanitization.
 *
 * By deriving the key list from the default configuration,
 * this module avoids manual duplication of allowed option names.
 *
 * ----------------------------------------------------------------
 *
 * This whitelist is used internally to:
 *
 * - Remove unknown properties from user-provided configuration.
 * - Guarantee that only supported options are passed to
 *   {@link fg | `fast-glob`}.
 *
 * ----------------------------------------------------------------
 *
 * @internal
 */
const PATTERN_OPTION_KEYS = new Set<keyof PatternOptions>(
  Object.keys(defaultPatternOptions) as (keyof PatternOptions)[]
);

/** ----------------------------------------------------------------
 * * ***Assigns a validated pattern option property.***
 * ----------------------------------------------------------------
 *
 * Performs a type-safe assignment from a source object into a
 * partial {@link PatternOptions | `PatternOptions`} result object.
 *
 * A generic constraint is used to preserve proper indexed access
 * typing and avoid union assignment limitations in TypeScript.
 *
 * This helper assumes that:
 *
 * - The provided `key` has already been validated against
 *   {@link PATTERN_OPTION_KEYS | `PATTERN_OPTION_KEYS`}.
 * - The property exists on the `source` object.
 *
 * ----------------------------------------------------------------
 *
 * @template K
 * A valid key of {@link PatternOptions | `PatternOptions`}.
 *
 * @param key
 * The validated pattern option key to assign.
 *
 * @param source
 * The original input object containing the property value.
 *
 * @param target
 * The partial result object receiving the assigned value.
 *
 * @internal
 */
function assignIfAllowed<K extends keyof PatternOptions>(
  key: K,
  source: Record<string, unknown>,
  target: Partial<PatternOptions>
) {
  target[key] = source[key] as PatternOptions[K];
}

/** ----------------------------------------------------------------
 * * ***Runtime policy controlling pattern option exposure.***
 * ----------------------------------------------------------------
 *
 * Defines runtime constraints that restrict which fields from
 * {@link PatternOptions | `PatternOptions`} are allowed to appear
 * in the final resolved configuration.
 *
 * This policy is primarily used by higher-level utilities that
 * enforce stricter behavior than the raw {@link fg | `fast-glob`} API.
 *
 * ----------------------------------------------------------------
 *
 * *Supported policies:*
 *
 * - `filesOnly`
 *   Prevents directory-related configuration from being externally
 *   controlled.
 *
 * - `forceUnique`
 *   Ensures that uniqueness behavior is handled internally and
 *   cannot be overridden by user configuration.
 *
 * ----------------------------------------------------------------
 *
 * These policies influence both:
 *
 * - Runtime sanitization of user-provided pattern options.
 * - Final resolution of merged configuration values.
 *
 * ----------------------------------------------------------------
 *
 * @template FilesOnly
 * Indicates whether directory-related options should be excluded.
 *
 * @template ForceUnique
 * Indicates whether the `unique` option should be excluded.
 */
export type PatternRuntimePolicy<
  FilesOnly extends boolean = boolean,
  ForceUnique extends boolean = boolean
> = {
  /** ----------------------------------------------------------------
   * * ***Restricts directory-related pattern options.***
   * ----------------------------------------------------------------
   *
   * When enabled, directory filtering options are excluded from the
   * final configuration produced by the pattern resolution process.
   *
   * This prevents external configuration from modifying whether
   * directories or files are matched by the underlying
   * {@link fg | `fast-glob`} operation.
   *
   * ----------------------------------------------------------------
   *
   * *Affected options:*
   *
   * - `onlyFiles`
   * - `onlyDirectories`
   *
   * ----------------------------------------------------------------
   *
   * When `true`, these options are ignored during sanitization and
   * removed from the final resolved configuration.
   *
   * ----------------------------------------------------------------
   * @default false
   */
  filesOnly?: FilesOnly;

  /** ----------------------------------------------------------------
   * * ***Enforces internal uniqueness behavior.***
   * ----------------------------------------------------------------
   *
   * When enabled, the `unique` option is excluded from user-provided
   * configuration and controlled internally by the runtime.
   *
   * This ensures that result deduplication behavior cannot be
   * overridden by external configuration.
   *
   * ----------------------------------------------------------------
   *
   * *Affected option:*
   *
   * - `unique`
   *
   * ----------------------------------------------------------------
   *
   * When `true`, this option is ignored during sanitization and
   * removed from the final resolved configuration.
   *
   * ----------------------------------------------------------------
   * @default false
   */
  forceUnique?: ForceUnique;
};

/** ----------------------------------------------------------------
 * * ***Sanitizes pattern options by removing unknown keys.***
 * ----------------------------------------------------------------
 *
 * Ensures that the provided object only contains keys that exist in
 * {@link defaultPatternOptions | `defaultPatternOptions`}, any unknown keys will be removed.
 *
 * This function is intended for API boundary validation to prevent
 * unsafe or unexpected configuration injection.
 *
 * - *Behavior:*
 *    - Ignores non-object values (returns empty object).
 *    - Removes keys not present in {@link defaultPatternOptions | `defaultPatternOptions`}.
 *    - Does NOT mutate the original object.
 *
 * ----------------------------------------------------------------
 *
 * @param input
 * The value to sanitize.
 *
 * @param policy
 * Optional runtime policy restricting which pattern options
 * are allowed during sanitization.
 *
 * @returns
 * A new object containing only allowed pattern option keys.
 *
 * @example
 * ```ts
 * const userOptions = {
 *   absolute: true,
 *   dot: true,
 *   fakeKey: 123
 * };
 *
 * const clean = sanitizePatternOptions(userOptions);
 *
 * // Result:
 * // {
 * //   absolute: true,
 * //   dot: true
 * // }
 * ```
 */
export function sanitizePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<false, false>
): Partial<PatternOptions<false, false>>;
export function sanitizePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<true, false>
): Partial<PatternOptions<true, false>>;
export function sanitizePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<false, true>
): Partial<PatternOptions<false, true>>;
export function sanitizePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<true, true>
): Partial<PatternOptions<true, true>>;
export function sanitizePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<false, false>
): Partial<PatternOptions<false, false>>;
export function sanitizePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<boolean, boolean>
): Partial<PatternOptions>;
export function sanitizePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<boolean, boolean>
): Partial<PatternOptions> {
  if (!isPlainObject(input)) return {};

  const source = input as Record<string, unknown>;
  const result: Partial<PatternOptions> = {};

  for (const key of Object.keys(source) as (keyof PatternOptions)[]) {
    if (PATTERN_OPTION_KEYS.has(key) && isKeyAllowed(key, policy)) {
      assignIfAllowed(key, source, result);
    }
  }

  return result;
}

/** ----------------------------------------------------------------
 * * ***Resolves pattern options with default values.***
 * ----------------------------------------------------------------
 *
 * Applies {@link sanitizePatternOptions | `sanitizePatternOptions`} to the provided input and merges
 * the result with `defaultPatternOptions`.
 *
 * - Unknown keys are removed.
 * - Missing keys fall back to defaults.
 *
 * Guarantees a fully-formed {@link PatternOptions | `PatternOptions`} object safe for direct
 * usage with `fast-glob`.
 *
 * ----------------------------------------------------------------
 *
 * @param input
 * Optional user-provided pattern options.
 *
 * @param policy
 * Optional runtime policy restricting which configuration
 * fields are allowed in the final resolved options.
 *
 * @returns
 * A complete and validated
 * {@link PatternOptions | `PatternOptions`} object ready for
 * direct usage with {@link fg | `fast-glob`}.
 *
 * @example
 * ```ts
 * const options = resolvePatternOptions({
 *   dot: true,
 *   fakeKey: 123
 * });
 *
 * // Result:
 * // {
 * //   absolute: false,
 * //   baseNameMatch: false,
 * //   ...
 * //   dot: true,
 * //   ...
 * // }
 *
 * const matched = await fastGlobe(patterns, options);
 * ```
 */
export function resolvePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<false, false>
): PatternOptions<false, false>;
export function resolvePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<true, false>
): PatternOptions<true, false>;
export function resolvePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<false, true>
): PatternOptions<false, true>;
export function resolvePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<true, true>
): PatternOptions<true, true>;
export function resolvePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<false, false>
): PatternOptions<false, false>;
export function resolvePatternOptions(
  input: unknown,
  policy?: PatternRuntimePolicy<boolean, boolean>
): PatternOptions {
  const clean = sanitizePatternOptions(input, policy);

  const options: PatternOptions = {
    ...defaultPatternOptions,
    ...clean
  };

  if (policy?.filesOnly) {
    delete options.onlyFiles;
    delete options.onlyDirectories;
  }

  if (policy?.forceUnique) {
    delete options.unique;
  }

  return options;
}

/** ----------------------------------------------------------------
 * * ***Stable structural equality detector.***
 * ----------------------------------------------------------------
 *
 * Determines whether two values are structurally identical using
 * deterministic serialization via `safeStableStringify`.
 *
 * - *This comparison:*
 *    - Preserves `undefined` values.
 *    - Sorts object keys.
 *    - Sorts arrays (optional structural normalization).
 *
 * - *Ensures stable equality checks for configuration objects where:*
 *    - Property order may differ.
 *    - Object references are not identical.
 *    - Deep comparison is required.
 *
 * ----------------------------------------------------------------
 *
 * @template T - Value type being compared.
 *
 * @param value - The current runtime value.
 * @param defaultValue - The default reference value.
 *
 * @returns
 * - `"default"` ➔ If values are structurally identical.
 * - `"overridden"` ➔ If values differ.
 *
 * @example
 * ```ts
 * const source = sourceOfPatternOptions(
 *   cleanPatternOptions,
 *   defaultPatternOptions
 * );
 *
 * // ➔ "default" | "overridden"
 * ```
 *
 * @internal
 */
export function sourceOfPatternOptions<T>(
  value: T,
  defaultValue: T
): "default" | "overridden" {
  const stableStringifyOptions = {
    keepUndefined: true,
    sortArray: true,
    sortKeys: true
  } satisfies SafeStableStringifyOptions;

  const a = safeStableStringify(value, stableStringifyOptions);

  const b = safeStableStringify(defaultValue, stableStringifyOptions);

  return a === b ? "default" : "overridden";
}
