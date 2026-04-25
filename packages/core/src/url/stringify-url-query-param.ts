import { isBoolean, isNumber, isString } from "@rzl-zone/utils-js/predicates";

/** -------------------------------------------------------------------
 * * ***Safely stringifies a URL query parameter into a valid string value.***
 * --------------------------------------------------------------------
 *
 * This helper normalizes a single query parameter value into a string
 * representation suitable for inclusion in a URL.
 *
 * Only primitive, URL-safe scalar types are supported. Any unsupported
 * value types will be discarded and converted to an empty string.
 *
 * - **Behavior:**
 *    - Returns the value directly when `param` is a string
 *    - Converts numbers and booleans using `String(...)`
 *    - Returns an empty string for all other types (objects, arrays, null, undefined)
 *
 * This is useful when serializing query parameters that may originate
 * from untyped or loosely typed sources.
 *
 * @param param - A single query parameter value of unknown type.
 *
 * @returns A string representation of the parameter, or an empty string
 * when the value cannot be safely stringified.
 *
 * @example
 * ```ts
 * stringifyUrlQueryParam("hello");
 * // => "hello"
 *
 * stringifyUrlQueryParam(42);
 * // => "42"
 *
 * stringifyUrlQueryParam(true);
 * // => "true"
 *
 * stringifyUrlQueryParam({ a: 1 });
 * // => ""
 * ```
 */
export function stringifyUrlQueryParam(param: unknown): string {
  if (isString(param)) {
    return param;
  }

  if (isNumber(param) || isBoolean(param)) {
    return String(param);
  } else {
    return "";
  }
}
