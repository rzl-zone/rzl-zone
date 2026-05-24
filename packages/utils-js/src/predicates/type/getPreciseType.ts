import { isNaN } from "../is/isNaN";
import { isNull } from "../is/isNull";
import { isError } from "../is/isError";
import { isObject } from "../is/isObject";
import { isBuffer } from "../is/isBuffer";
import { isFunction } from "../is/isFunction";
import { isPlainObject } from "../is/isPlainObject";
import { isNumberObject } from "../is/isNumberObject";
import { isStringObject } from "../is/isStringObject";
import { isBooleanObject } from "../is/isBooleanObject";
import { isObjectOrArray } from "../is/isObjectOrArray";
import { isInfinityNumber } from "../is/isInfinityNumber";

import { ACRONYMS_DATA, PreciseType } from "./_private/getPreciseType.utils";

/** ---------------------------------------------------------------------------
 * * ***Options for controlling how {@link getPreciseType | `getPreciseType`} formats and normalizes detected types.***
 * ----------------------------------------------------------------------------
 * These options customize the string transformation behavior and acronym handling
 * when converting JavaScript type names to human-readable strings.
 */
export type GetPreciseTypeOptions = {
  /** -------------------------------------------------------
   * * ***Specifies the format in which the returned string type should be transformed.***
   * --------------------------------------------------------
   * **ℹ️ For special string literals in `SPECIAL_CASES` (`"-Infinity" | "Infinity" | "NaN"`), which will remain unchanged.**
   *
   * ---
   * - #### Supported formats:
   *    - `"toKebabCase"` (default) — words separated by hyphens.
   *      - ➔ `"result-example-type"`.
   *    - `"toLowerCase"` - converts all letters to lowercase.
   *      - ➔ `"result example type"`.
   *    - `"toDotCase"` — words separated by dots.
   *      - ➔ `"result.example.type"`.
   *    - `"toCamelCase"` — first word lowercase, subsequent words capitalized.
   *      - ➔ `"resultExampleType"`.
   *    - `"toSnakeCase"` — words separated by underscores.
   *      - ➔ `"result_example_type"`.
   *    - `"toPascalCase"` — all words capitalized, no spaces.
   *      - ➔ `"ResultExampleType"`.
   *    - `"toPascalCaseSpace"` — all words capitalized with spaces between words.
   *      - ➔ `"Result Example Type"`.
   *    - `"slugify"` — URL-friendly slug (lowercase with hyphens).
   *      - ➔ `"result-example-type"`.
   *
   * ---
   * @default
   * ```ts
   * "toKebabCase"
   * ```
   *
   * ---
   * @note
   * ⚠️ If an invalid value is provided, the function will automatically fallback to the default `"toKebabCase"`.
   */
  formatCase?:
    | "toPascalCaseSpace"
    | "toPascalCase"
    | "toCamelCase"
    | "toKebabCase"
    | "toSnakeCase"
    | "toDotCase"
    | "slugify"
    | "toLowerCase";

  /** -------------------------------------------------------
   * * ***Control uppercase preservation of recognized acronyms during formatting.***
   * --------------------------------------------------------
   * When enabled (`true`), common technical acronyms (e.g., `"URL"`, `"HTTP"`, `"HTML"`, `"SVG"`, `"XML"`, `"DOM"`)
   * are preserved in their original uppercase form instead of being lowercased or altered by case-formatting utilities.
   *
   * ---
   * ---
   * @description
   * The list of recognized acronyms is defined in {@link AcronymsList | **`AcronymsList`**},
   * including entries like `"URL"`, `"HTTP"`, `"HTML"`, `"SVG"`, `"XML"`, `"DOM"`, and others.
   *
   * ---
   * - ***Behavior:***
   *      - #### When `false` (default):
   *          - Acronyms are treated as normal words and formatted according to the selected `formatCase`.
   *          - Example:
   *            - `HTMLDivElement` ➔ `"html-div-element"` (with `"toKebabCase"`).
   *            - `DOMParser` ➔ `"dom-parser"`.
   *
   *      ---
   *
   *      - #### When `true`:
   *          - Acronyms remain uppercase.
   *          - Example:
   *            - `HTMLDivElement` ➔ `"HTML-div-element"` (with `"toKebabCase"`).
   *            - `DOMParser` ➔ `"DOM-parser"`.
   *
   * ---
   * @default
   * ```ts
   * false
   * ```
   *
   * ---
   * @note
   * ⚠️ This option affects **formatting output only**, not the underlying type detection, acronym preservation is applied **after** detecting and formatting the base type name.
   */
  useAcronyms?: boolean;
};

/** ---------------------------------------------------------------------------
 * * ***Type alias for the list of common acronyms preserved in uppercase.***
 * ----------------------------------------------------------------------------
 *
 * Use this type to reference the full set of recognized acronyms
 * used internally by the {@link getPreciseType | **`getPreciseType`**} function for formatting purposes.
 */
export type AcronymsList = typeof ACRONYMS_DATA;

/** ----------------------------------------------------------
 * * ***Utility-Predicate: `getPreciseType`.***
 * -----------------------------------------------------------
 * **Returns a detailed and normalized type string for the given value.**
 *
 * ---
 * @description
 * The returned string is human-readable ***toKebabCase*** with spaces ***(by default)*** or formatted according to the `options.formatCase` setting.
 * - **Handles:**
 *     - Primitives (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`).
 *     - Built-in objects (`Array`, `Map`, `Set`, `Error subclasses`, `Typed Arrays`, `etc`).
 *     - Objects created with `Object.create(null)`.
 *     - Objects wrapper (`new String`, `new Number`, `new Boolean`).
 *     - DOM Node type (may not be fully accurate outside the browser environment).
 *     - Generator instances.
 *     - Node.js `Buffer` instances.
 *     - Proxy detection (returns `"Proxy"` if detected; detection ***is not 100% accurate***).
 *     - Uses cached mapping table (`FIXES_CASTABLE_TABLE`) for known types to provide consistent naming.
 *     - Falls back to constructor name or `Object.prototype.toString` tag.
 *
 * ---
 * @param {*} value - The value to detect the precise type of.
 * @param {GetPreciseTypeOptions} [options] - Optional configuration.
 * @param {GetPreciseTypeOptions["formatCase"]} [options.formatCase="toLowerCase"]
 *   Specifies how the returned type string should be formatted.
 *      - ⚠️ Special string literals in `SPECIAL_CASES`
 *        (`"-Infinity" | "Infinity" | "NaN"`) will remain
 *        unchanged even if a different `formatCase` is applied.
 * @param {boolean} [options.useAcronyms=false]
 *   Control uppercase preservation of recognized acronyms during formatting.
 *      - When `true`, recognized acronyms such as `"URL"`, `"HTTP"`, `"HTML"`, `"SVG"`, `"XML"`, and `"DOM"`
 *        are preserved in uppercase instead of being lowercased or otherwise transformed.
 *      - When `false` (default), acronyms are formatted like regular words according to `formatCase`.
 *      - ⚠️ This option affects **formatting output only**, not type detection.
 *
 * ---
 * @returns {string} The normalized and formatted type string.
 *
 * ---
 * @example
 * 1. #### Basic Usage:
 *    ```ts
 *    getPreciseType(123);
 *    // ➔ "number"
 *    getPreciseType(null);
 *    // ➔ "null"
 *    getPreciseType(/regex/);
 *    // ➔ "reg-exp"
 *    getPreciseType(/regex/, { formatCase: "toPascalCase" });
 *    // ➔ "RegExp"
 *    getPreciseType(function* () {}, { formatCase: "toCamelCase" });
 *    // ➔ "generatorFunction"
 *    getPreciseType(async function () {}, { formatCase: "toPascalCaseSpace" });
 *    // ➔ "Async Function"
 *    ```
 *    ---
 * 2. #### `SPECIAL_CASES` remain:
 *    ```ts
 *    getPreciseType(NaN, { formatCase: "toLowerCase" });
 *    // ➔ "NaN"
 *    getPreciseType(Infinity, { formatCase: "toLowerCase" });
 *    // ➔ "Infinity"
 *    getPreciseType(-Infinity, { formatCase: "toLowerCase" });
 *    // ➔ "-Infinity"
 *    ```
 *    ---
 * 3. #### `Acronym` usage examples:
 *    ```ts
 *    getPreciseType(new URL("https://example.com"));
 *    // ➔ "url"
 *    getPreciseType(new URL("https://example.com"), { useAcronyms: true });
 *    // ➔ "URL"
 *    getPreciseType(new URLSearchParams, { formatCase: "toPascalCase" });
 *    // ➔ "UrlSearchParams"
 *    getPreciseType(new URLSearchParams, { formatCase: "toPascalCase", useAcronyms: true });
 *    // ➔ "URLSearchParams"
 *    ```
 */
export const getPreciseType: (
  value: unknown,
  options?: GetPreciseTypeOptions
) => string = (() => {
  const cache = new Map<string, PreciseType>();
  const MAX_CACHE_SIZE = 50;

  return (value: unknown, options: GetPreciseTypeOptions = {}): string => {
    if (!isPlainObject(options)) options = {};

    // Create a stable cache key
    const key = JSON.stringify({
      formatCase: options.formatCase || "toKebabCase",
      useAcronyms: options.useAcronyms ?? false
    });

    let ClassPrecise = cache.get(key);

    if (!ClassPrecise) {
      if (cache.size >= MAX_CACHE_SIZE) cache.clear();
      ClassPrecise = new PreciseType(options);
      cache.set(key, ClassPrecise);
    }

    // Handle `null` explicitly because typeof null === "object"
    if (isNull(value)) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("null")] ??
          "Null"
      );
    }

    // Handle NaN and Infinity values
    if (isNaN(value)) return "NaN";
    if (isInfinityNumber(value)) return String(value);

    // Handle wrapper objects like new Number(), new String(), new Boolean(), or BigInt
    if (typeof BigInt !== "undefined" && value === BigInt) {
      return ClassPrecise.converter(
        PreciseType.castableTable[
          PreciseType.normalizeKeyForCase("bigint constructor")
        ] ?? "bigint constructor"
      );
    }
    if (isNumberObject(value) || value === Number) {
      return ClassPrecise.converter(
        PreciseType.castableTable[
          PreciseType.normalizeKeyForCase("number constructor")
        ] ?? "number constructor"
      );
    }
    if (isStringObject(value) || value === String) {
      return ClassPrecise.converter(
        PreciseType.castableTable[
          PreciseType.normalizeKeyForCase("string constructor")
        ] ?? "string constructor"
      );
    }
    if (isBooleanObject(value) || value === Boolean) {
      return ClassPrecise.converter(
        PreciseType.castableTable[
          PreciseType.normalizeKeyForCase("boolean constructor")
        ] ?? "boolean constructor"
      );
    }

    // Handle primitive types other than symbol, function, object, or array
    const prim = typeof value;
    if (!isObjectOrArray(value) && !isFunction(value) && prim !== "symbol") {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase(prim)] ?? prim
      );
    }

    // Handle Symbol types, including special well-known symbols
    if (prim === "symbol") {
      return ClassPrecise.getSymbolName(value as symbol);
    }

    // Detect Node.js EventEmitter instances by constructor name
    if (isObjectOrArray(value) && value.constructor?.name === "EventEmitter") {
      return ClassPrecise.converter(
        PreciseType.castableTable[
          PreciseType.normalizeKeyForCase("event emitter")
        ] ?? "Event Emitter"
      );
    }

    const domType = ClassPrecise.detectDomNodeType(value);
    if (domType) return domType;

    // Detect Node.js Buffer instances
    if (isBuffer(value)) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("buffer")] ??
          "Buffer"
      );
    }

    // Detect Proxy objects by attempting to define/delete a property (may throw)
    if (ClassPrecise.isProxy(value)) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("proxy")] ??
          "Proxy"
      );
    }

    // Detect Generator objects by presence of .next and .throw methods
    if (
      isObject(value) &&
      isFunction(value?.next) &&
      isFunction(value?.throw)
    ) {
      return ClassPrecise.converter(
        PreciseType.castableTable[
          PreciseType.normalizeKeyForCase("generator")
        ] ?? "Generator"
      );
    }

    // Handle Error instances and subclasses, returning their constructor name
    if (isError(value)) {
      const ctorName = value.constructor?.name ?? "Error";
      // Try FIXES_CASTABLE_TABLE dictionary with constructor name, else fallback to spaced PascalCase
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase(ctorName)] ??
          PreciseType.castableTable[
            PreciseType.normalizeKeyForCase(ctorName.replace(/\s+/g, ""))
          ] ??
          ctorName
      );
    }

    if (
      isObjectOrArray(value) &&
      "done" in value &&
      "value" in value &&
      Object.keys(value).length === 2
    ) {
      return ClassPrecise.converter(
        PreciseType.castableTable[
          PreciseType.normalizeKeyForCase("iterator result")
        ] ?? "iterator result"
      );
    }

    // Handle objects created with `Object.create(null)` which have null prototype
    if (isNull(Object.getPrototypeOf(value))) {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase("object")] ??
          "Object"
      );
    }

    // Get the internal [[Class]] tag from Object.prototype.toString, e.g. "Date", "Map"
    const tag = Object.prototype.toString.call(value).slice(8, -1) || "Object";

    // Check if tag has a mapped friendly name in ClassPrecise.FIXES_CASTABLE_TABLE ClassPrecise.dictionary
    const mapped =
      PreciseType.castableTable[PreciseType.normalizeKeyForCase(tag)];
    if (mapped) return ClassPrecise.converter(mapped);

    // Fallback: try to get constructor name and use that if not "Object"
    const ctorName = value?.constructor?.name;
    if (ctorName && ctorName !== "Object") {
      return ClassPrecise.converter(
        PreciseType.castableTable[PreciseType.normalizeKeyForCase(ctorName)] ??
          ctorName
      );
    }

    // Final fallback: format the tag string to spaced PascalCase and return
    return ClassPrecise.converter(tag);
  };
})();
