import {
  type PatternConfig,
  type PatternOptions
} from "@/_internal/libs/fast-globe-options";
import type {
  DefaultPrettifyOptions,
  Prettify,
  PrettifyOptions
} from "@/_internal/types/extra";

export type { PatternConfig, PatternOptions };

/** ----------------------------------------------------------------
 * * ***Flexible input type for value collections.***
 * ----------------------------------------------------------------
 *
 * Represents a value that can be provided either as a single item
 * or as a collection of items.
 *
 * This enables APIs to accept both singular and multiple values
 * without requiring callers to normalize the input beforehand.
 *
 * ----------------------------------------------------------------
 * Supported Forms
 *
 * - A single value (`T`)
 * - An array of values (`T[]`)
 * - A `Set` containing values (`Set<T>`)
 *
 * ----------------------------------------------------------------
 * Type Behavior
 *
 * - Wrapped with `Exclude<..., never>` to prevent accidental
 *   `never` propagation in complex generic transformations.
 *
 * - Uses `Prettify` to normalize and simplify the resulting type
 *   for improved readability.
 *
 * ----------------------------------------------------------------
 * @template T The base value type.
 *
 * @template Options
 *   Configuration options for the `Prettify` utility.
 *   Controls how the resulting type is normalized and displayed
 *   in editor tooltips.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * // default behavior
 * const a: Collection<string> = "value";
 * const b: Collection<string> = ["a", "b", "c"];
 * const c: Collection<string> = new Set(["x", "y", "z"]);
 *
 * // with custom Prettify options
 * type Custom = Collection<string, { skipPrettify: true }>;
 * ```
 */
export type Collection<
  T,
  Options extends PrettifyOptions = DefaultPrettifyOptions
> = Prettify<
  Exclude<T | Prettify<T, Options>[] | Set<Prettify<T, Options>>, never>,
  Options
>;

/** ----------------------------------------------------------------
 * * ***Flexible input type for string collections.***
 * ----------------------------------------------------------------
 *
 * Convenience alias for `Collection<string>`.
 *
 * Useful for APIs that accept either a single string or multiple
 * strings in array or `Set` form.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * const a: StringCollection = "value";
 * const b: StringCollection = ["a", "b", "c"];
 * const c: StringCollection = new Set(["x", "y", "z"]);
 * ```
 */
export type StringCollection = Collection<string>;

/** ----------------------------------------------------------------
 * * ***Special Internal options props.***
 * ----------------------------------------------------------------
 */
export interface InternalOptions {
  /** ----------------------------------------------------------------
   * * ***Command title / identifier.***
   * ----------------------------------------------------------------
   *
   * Used internally to identify the active command name.
   *
   * - ***This value is primarily used for:***
   *       - Displaying the command name in version or header output.
   *       - Rendering consistent command titles / banners.
   *       - Differentiating multiple command entry points within the same package.
   *
   * ⚠️ Internal usage only — not intended for public configuration.
   *
   * @internal
   */
  __commandTitle?: string;
}

/** ----------------------------------------------------------------
 * * ***Supported log verbosity levels.***
 * ----------------------------------------------------------------
 */
export type LogLevel = "silent" | "error" | "info" | "debug";

/** ----------------------------------------------------------------
 * * ***Common logging configuration options.***
 * ----------------------------------------------------------------
 */
export type LoggingOptions = {
  /** ----------------------------------------------------------------
   * * ***Logging verbosity level.***
   * ----------------------------------------------------------------
   *
   * Controls how verbose the logger output should be.
   *
   * - **Supported values:**
   *      - `silent` ➔ no output.
   *      - `error`  ➔ errors only.
   *      - `info` **(default)** ➔ standard informational logs (include `error`).
   *      - `debug`  ➔ verbose / debug logs (include `error`).
   *
   * - **Notes:**
   *      - If an invalid value is provided, it will be **silently coerced**
   *        to the default log level.
   *
   * @default "info"
   */
  logLevel?: LogLevel;
};

/** ----------------------------------------------------------------
 * * ***Base configuration options.***
 * ----------------------------------------------------------------
 *
 * Shared option structure used across internal utilities.
 *
 * This type composes several configuration layers commonly required
 * by file-processing utilities:
 *
 * - ***Logging options*** from {@link LoggingOptions | `LoggingOptions`}.
 * - ***Pattern matching configuration*** from {@link PatternConfig | `PatternConfig`}.
 *
 * ----------------------------------------------------------------
 *
 * @template FilesOnly
 * When `true`, directory-related pattern options (`onlyFiles`,
 * `onlyDirectories`) are removed from the public configuration.
 *
 * This is typically used by utilities that must operate strictly
 * on files and should not allow directory matches.
 *
 * @template ForceUnique
 * When `true`, the `unique` option from the underlying
 * {@link PatternOptions | `PatternOptions`} is removed to enforce
 * internally deduplicated glob results.
 *
 * ----------------------------------------------------------------
 *
 * These generics allow higher-level utilities to enforce
 * stricter pattern resolution behavior while still exposing
 * a flexible configuration surface to consumers.
 */
export type BaseOptions<
  FilesOnly extends boolean = false,
  ForceUnique extends boolean = false
> = Prettify<
  LoggingOptions & InternalOptions & PatternConfig<FilesOnly, ForceUnique>
>;
