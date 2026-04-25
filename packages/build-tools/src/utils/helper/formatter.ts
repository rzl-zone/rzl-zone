import type { Colors } from "picocolors/types";
import pcr from "picocolors";

import {
  isArray,
  isBoolean,
  isMap,
  isNil,
  isNonEmptyString,
  isNumber,
  isObject,
  isPlainObject,
  isRegExp,
  isSet,
  isString
} from "@/_internal/utils/helper";
import { __runtimeRequire, hasGlobalRequire } from "./node-require";

type Picocolors = Colors & {
  createColors: (enabled?: boolean) => Colors;
};

/** ----------------------------------------------------------------
 * * ***Re-export of the `picocolors` default export.***
 * ----------------------------------------------------------------
 * This utility provides a lightweight and dependency-free
 * terminal color formatting helper, identical to the
 * original `picocolors` package export.
 *
 * - **It is re-exported to:**
 *      - Provide a stable internal import path.
 *      - Avoid direct dependency imports in consumers.
 *      - Ensure consistent color handling across the codebase.
 *
 * @see {@link https://github.com/alexeyraspopov/picocolors | **`picocolors repository`**.}
 */
export const picocolors: Picocolors = pcr;

/** ----------------------------------------------------------------
 * * ***Normalized newline character.***
 * ----------------------------------------------------------------
 *
 * Represents a single line feed character (`\n`), used as a
 * **consistent newline** across all platforms.
 *
 * This value is intentionally **not platform-specific** and does
 * not vary between operating systems (e.g. Windows CRLF vs POSIX LF).
 * It is suitable for generated files, formatters, and build tools
 * where deterministic output is required.
 *
 * The value is base64-encoded to avoid embedding a literal newline
 * in the bundled output during minification.
 *
 * @type {string}
 */
export const NEWLINE: string = atob("Cg==");

/** ----------------------------------------------------------------
 * * ***Platform-specific end-of-line character.***
 * ----------------------------------------------------------------
 *
 * Resolves to the operating system's default end-of-line sequence:
 * - `\n` on POSIX systems (Linux, macOS)
 * - `\r\n` on Windows
 *
 * Used to ensure generated multiline strings are compatible
 * with the host environment.
 *
 * In non-Node environments, this value falls back to `\n`.
 * The fallback is encoded to avoid embedding a literal newline
 * in the bundled output during minification.
 *
 * @type {string}
 */
export const EOL: string = hasGlobalRequire(globalThis)
  ? __runtimeRequire("node:os").EOL
  : NEWLINE;

/** -------------------------------------------------------
 * * ***Utility Function: `plural`.***
 * -------------------------------------------------------
 * **Returns the correct singular or plural form of a word
 * based on a numeric count.**
 *
 * This helper is commonly used when generating human-readable
 * CLI messages where a word must change depending on quantity.
 *
 * By default, the function pluralizes a word by appending `"s"`
 * when the `count` is not equal to `1`.
 *
 * For irregular plural forms, a custom `pluralWord` may be
 * provided explicitly.
 *
 * ⚠️ This utility performs **simple English pluralization only**.
 * It does **not** automatically handle irregular plural forms
 * such as `person ➔ people` or `child ➔ children` unless the
 * plural form is provided manually.
 *
 * - **Behavior:**
 *      - If `count === 1` ➔ returns the singular `word`.
 *      - Otherwise ➔ returns `pluralWord` if provided,
 *        or `${word}s` by default.
 *
 * @param count - The numeric count used to determine pluralization.
 * @param word - The singular form of the word.
 * @param pluralWord - Optional explicit plural form.
 *
 * @returns The appropriate singular or plural word form.
 *
 * @example
 * ```ts
 * plural(1, "file");
 * // ➔ "file"
 *
 * plural(3, "file");
 * // ➔ "files"
 * ```
 *
 * @example
 * ```ts
 * plural(1, "person", "people");
 * // ➔ "person"
 *
 * plural(5, "person", "people");
 * // ➔ "people"
 * ```
 *
 * @example
 * ```ts
 * const count = 2;
 * console.log(`${count} ${plural(count, "file")} copied`);
 * // ➔ "2 files copied"
 * ```
 */
export function plural(
  count: number,
  word: string,
  pluralWord?: string
): string {
  if (count === 1) return word;
  return pluralWord ?? `${word}s`;
}

/** ----------------------------------------------------------------
 * * ***Conditionally pads a value with leading and/or trailing spaces.***
 * ----------------------------------------------------------------
 *
 * Formats a value by optionally prepending and/or appending a single
 * space character (`" "`), depending on the provided options.
 *
 * Only **valid non-empty strings** are padded.
 * A value is considered **invalid** when it is:
 * - not a string.
 * - an empty string (`""`).
 * - a string containing only whitespace.
 *
 * When the value is invalid, this utility can optionally return
 * a single space instead of an empty string.
 *
 * @param {unknown} value - The value to be padded.
 * @param {{ start?: boolean; end?: boolean; padOnInvalid?: boolean; }} options - Padding behavior configuration.
 * @param options.start - Prepend a single space before the value.
 * @param options.end - Append a single space after the value.
 * @param options.padOnInvalid - Return a single space when the value
 * is not a valid non-empty string.
 *
 * @returns A formatted string with optional leading and/or trailing
 * spaces, or a single space / empty string when the input is invalid.
 *
 * @example
 * ```ts
 * padText("hello");
 * // ➔ " hello "
 * ```
 *
 * @example
 * ```ts
 * padText("hello", { start: true, end: false });
 * // ➔ " hello"
 * ```
 *
 * @example
 * ```ts
 * padText("", { padOnInvalid: true });
 * // ➔ " "
 * ```
 *
 * @example
 * ```ts
 * padText(null, { padOnInvalid: false });
 * // ➔ ""
 * ```
 */
export function padText(
  value: unknown,
  options: {
    /**
     * Whether to prepend a single space to the output.
     *
     * @default true
     */
    start?: boolean;

    /**
     * Whether to append a single space to the output.
     *
     * @default true
     */
    end?: boolean;

    /**
     * Return a single space when the input is not a valid non-empty string.
     *
     * This applies to non-string values, empty strings,
     * or strings containing only whitespace.
     *
     * @default true
     */
    padOnInvalid?: boolean;
  } = {}
): string {
  const { start = true, end = true, padOnInvalid = true } = options;
  if (!isNonEmptyString(value)) return padOnInvalid ? " " : "";
  return `${start ? " " : ""}${value}${end ? " " : ""}`;
}

/** ----------------------------------------------------------------
 * * ***Joins text segments into a compact space-separated string.***
 * ----------------------------------------------------------------
 *
 * Joins multiple values into a single string separated by a
 * **single space character** (`" "`).
 *
 * This utility removes all non-renderable values before joining,
 * producing a compact inline string without unintended spacing.
 *
 * - *Filtering behavior:*
 *     - `false`, `null`, and `undefined` are removed.
 *     - Empty strings (`""`) are also removed.
 *
 * This makes the output suitable for inline text composition
 * where line breaks and extra spacing are not desired.
 *
 * - *Useful for:*
 *     - Inline CLI messages.
 *     - Error summaries.
 *     - Concatenating optional labels or fragments.
 *     - Single-line log output.
 *
 * @param {Array<string | false | null | undefined>} text - A list of
 * strings or falsy values to be joined. Empty strings are excluded
 * to prevent extra spaces in the output.
 *
 * @returns {string} A single string with values joined by a
 * single space character.
 *
 * @example
 * ```ts
 * joinInline("Hello", false, "", "world");
 * // ➔ "Hello world"
 * ```
 *
 * @example
 * ```ts
 * joinInline(
 *   "Error:",
 *   undefined,
 *   "Invalid",
 *   null,
 *   "input"
 * );
 * // ➔ "Error: Invalid input"
 * ```
 */
export function joinInline(
  ...text: Array<string | false | null | undefined>
): string {
  return text.filter(Boolean).join(" ");
}

/** ----------------------------------------------------------------
 * * ***Joins text lines into a compact newline-separated string.***
 * ----------------------------------------------------------------
 *
 * Joins multiple values into a single string separated by the
 * platform-specific end-of-line character ({@link EOL | **`EOL`**}).
 *
 * This utility removes all non-renderable values before joining,
 * ensuring a compact output with no unintended blank lines.
 *
 * - *Filtering behavior:*
 *     - `false`, `null`, and `undefined` are removed.
 *     - Empty strings (`""`) are also removed.
 *
 * This makes the output dense and suitable for cases where
 * vertical spacing should not be preserved.
 *
 * - *Useful for:*
 *     - CLI error messages.
 *     - Compact help or status output.
 *     - Multi-line logs without spacing gaps.
 *
 * @param {Array<string | false | null | undefined>} text - A list of
 * strings or falsy values to be joined. Empty strings are excluded
 * to prevent blank lines in the output.
 *
 * @returns {string} A single string joined using the OS-specific
 * end-of-line character.
 *
 * @example
 * ```ts
 * joinLines("Line 1", false, "", "Line 2");
 * // ➔ "Line 1\nLine 2"
 * ```
 *
 * @example
 * ```ts
 * joinLines(
 *   "Header",
 *   undefined,
 *   "",
 *   "Body",
 *   null,
 *   "Footer"
 * );
 * // ➔ "Header\nBody\nFooter"
 * ```
 */
export function joinLines(
  ...text: Array<string | false | null | undefined>
): string {
  return text.filter(Boolean).join(EOL);
}

/** ----------------------------------------------------------------
 * * ***Joins text lines while preserving explicit empty lines.***
 * ----------------------------------------------------------------
 *
 * Joins multiple values into a single string separated by the
 * platform-specific end-of-line character ({@link EOL | **`EOL`**}).
 *
 * Unlike {@link joinLines | **`joinLines`**}, this variant **preserves empty strings**
 * (`""`) to intentionally create blank lines in the output.
 *
 * - *Filtering behavior:*
 *     - `false`, `null`, and `undefined` are removed.
 *     - Empty strings (`""`) are kept as-is.
 *
 * This allows precise control over vertical spacing when composing
 * formatted text.
 *
 * - *Useful for:*
 *     - CLI help output with paragraph separation.
 *     - Multi-section descriptions.
 *     - Human-readable documentation formatting.
 *
 * @param {Array<string | false | null | undefined>} text - A list of
 * strings or falsy values to be joined. Empty strings are preserved
 * to produce blank lines in the output.
 *
 * @returns {string} A single string joined using the OS-specific
 * end-of-line character.
 *
 * @example
 * ```ts
 * joinLinesLoose(
 *   "Line one",
 *   "Line two",
 *   "",
 *   "New paragraph"
 * );
 * // ➔ "Line one\nLine two\n\nNew paragraph"
 * ```
 *
 * @example
 * ```ts
 * joinLinesLoose(
 *   "Header",
 *   null,
 *   "",
 *   "Body",
 *   false,
 *   null,
 *   undefined
 * );
 * // ➔ "Header\n\nBody"
 * ```
 */
export function joinLinesLoose(
  ...text: Array<string | false | null | undefined>
): string {
  return text
    .filter((v): v is string => v !== false && v !== null && v !== undefined)
    .join(EOL);
}

type FormatOptionValueOptions = {
  /** @default false */
  pretty?: boolean;
  /** @default 2 */
  indent?: number;
  /** @default false */
  sortKeys?: boolean;
  /** @default false */
  sortArray?: boolean;
};

/** ----------------------------------------------------------------
 * * Formats a value into a compact, colorized CLI representation.
 * ----------------------------------------------------------------
 *
 * Recursively converts an arbitrary value into a human-readable,
 * ANSI-colored string intended strictly for terminal output.
 *
 * This formatter is designed for developer-facing CLI diagnostics
 * and must NOT be used for logging, serialization, persistence,
 * or programmatic comparison.
 *
 * - *Behavior:*
 *     - Arrays are rendered inline: `[a, b, c]`.
 *     - `Set` values are converted to arrays before rendering.
 *     - `Map` values are converted to plain objects via `Object.fromEntries`.
 *     - Plain objects are rendered inline: `{ key: value }`.
 *     - `RegExp` values are colorized by delimiter, source, and flags.
 *     - Strings are wrapped in double quotes.
 *     - Numbers (including `NaN`) and booleans are highlighted.
 *     - `null` and `undefined` are red-bright color.
 *     - Other objects fall back to `Object.prototype.toString`.
 *
 * - *Characteristics:*
 *     - Recursive.
 *     - Compact (single-line).
 *     - No pretty-print indentation.
 *     - No key or array sorting.
 *     - No JSON serialization.
 *     - No circular reference handling.
 *
 * @param value - The value to format for CLI display.
 *
 * @returns A colorized string optimized for terminal readability.
 *
 * @example
 * formatOptionValue(["a", "b"]);
 * // ➔ [ "a", "b" ]
 *
 * @example
 * formatOptionValue({ foo: 1, bar: true });
 * // ➔ { foo: 1, bar: true }
 *
 * @example
 * formatOptionValue(new Set(["dist/**"]));
 * // ➔ [ "dist/**" ]
 *
 * @example
 * formatOptionValue(/abc/i);
 * // ➔ /abc/i (colorized segments)
 */
export function formatOptionValue(
  value: unknown,
  options?: FormatOptionValueOptions
): string {
  const {
    pretty = false,
    indent = 2,
    sortKeys = false,
    sortArray = false
  } = options ?? {};

  const indentUnit = " ".repeat(indent);

  function formatRecursive(input: unknown, depth = 0): string {
    const currentIndent = indentUnit.repeat(depth);
    const nextIndent = indentUnit.repeat(depth + 1);
    const joinInline = picocolors.dim(", ");
    const joinPretty = `,${EOL}`;

    /* ------------------------------------------------------------ */
    /* Set ➔ Array */
    /* ------------------------------------------------------------ */
    if (isSet(input)) {
      return formatRecursive([...input], depth);
    }

    /* ------------------------------------------------------------ */
    /* Map ➔ Plain Object */
    /* ------------------------------------------------------------ */
    if (isMap(input)) {
      return formatRecursive(Object.fromEntries(input), depth);
    }

    /* ------------------------------------------------------------ */
    /* Array */
    /* ------------------------------------------------------------ */
    if (isArray(input)) {
      const arr = sortArray ? [...input].sort() : input;

      if (arr.length === 0) return picocolors.gray("[]");

      if (!pretty) {
        const items = arr
          .map((v) => formatRecursive(v, depth))
          .join(joinInline);
        return picocolors.gray("[") + items + picocolors.gray("]");
      }

      const items = arr
        .map((v) => nextIndent + formatRecursive(v, depth + 1))
        .join(joinPretty);

      return (
        picocolors.gray(`[${EOL}`) +
        items +
        EOL +
        currentIndent +
        picocolors.gray("]")
      );
    }

    /* ------------------------------------------------------------ */
    /* Plain Object */
    /* ------------------------------------------------------------ */
    if (isPlainObject(input)) {
      let entries = Object.entries(input);

      if (sortKeys) {
        entries = entries.sort(([a], [b]) => a.localeCompare(b));
      }

      if (entries.length === 0) return picocolors.gray("{}");

      if (!pretty) {
        const props = entries
          .map(([key, val]) => {
            return (
              picocolors.dim(key) +
              picocolors.gray(": ") +
              formatRecursive(val, depth)
            );
          })
          .join(joinInline);

        return picocolors.gray("{ ") + props + picocolors.gray(" }");
      }

      const props = entries
        .map(([key, val]) => {
          return (
            nextIndent +
            picocolors.dim(key) +
            picocolors.gray(": ") +
            formatRecursive(val, depth + 1)
          );
        })
        .join(joinPretty);

      return (
        picocolors.gray(`{${EOL}`) +
        props +
        EOL +
        currentIndent +
        picocolors.gray("}")
      );
    }

    /* ------------------------------------------------------------ */
    /* RegExp */
    /* ------------------------------------------------------------ */
    if (isRegExp(input)) {
      return (
        picocolors.greenBright("/") +
        picocolors.redBright(input.source) +
        picocolors.greenBright("/") +
        picocolors.magentaBright(input.flags)
      );
    }

    /* ------------------------------------------------------------ */
    /* Primitive */
    /* ------------------------------------------------------------ */
    if (isString(input)) {
      return picocolors.gray(`"${input}"`);
    }

    if (isNumber(input, { includeNaN: true })) {
      return picocolors.redBright(String(input));
    }

    if (isBoolean(input)) {
      return picocolors.redBright(String(input));
    }

    if (isNil(input)) {
      return picocolors.redBright(String(input));
    }

    if (isObject(input)) {
      return picocolors.cyanBright(Object.prototype.toString.call(input));
    }

    return picocolors.cyanBright(String(input));
  }

  return formatRecursive(value);
}
