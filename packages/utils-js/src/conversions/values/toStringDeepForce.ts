import { isMap } from "@/predicates/is/isMap";
import { isNaN } from "@/predicates/is/isNaN";
import { isNil } from "@/predicates/is/isNil";
import { isSet } from "@/predicates/is/isSet";
import { isDate } from "@/predicates/is/isDate";
import { isError } from "@/predicates/is/isError";
import { isArray } from "@/predicates/is/isArray";
import { isBigInt } from "@/predicates/is/isBigInt";
import { isObject } from "@/predicates/is/isObject";
import { isRegExp } from "@/predicates/is/isRegExp";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isSymbol } from "@/predicates/is/isSymbol";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isFunction } from "@/predicates/is/isFunction";
import { isNumberObject } from "@/predicates/is/isNumberObject";
import { isStringObject } from "@/predicates/is/isStringObject";
import { isBooleanObject } from "@/predicates/is/isBooleanObject";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { safeStableStringify } from "../stringify/safeStableStringify";

/** ----------------------------------------------------------
 * * ***Utility: `toStringDeepForce`.***
 * ---------------------------------------------
 * **Recursively converts a value into a string based on the `forceToString` options.**
 * - **Rules `forceToString` options:**
 *    - `"stringOrNumber"`: Converts strings and numbers to strings.
 *    - `"primitives"`: Converts all primitives (number, string, boolean, bigint, undefined, null, NaN) to strings.
 *    - `"all"`: Converts everything, including symbols, functions, Dates, RegExp, Maps, Sets, Errors, Promises,
 *       boxed primitives box (new Number, new String, new Boolean), and deeply all object properties, to strings.
 *    - `false`: Leaves everything unchanged.
 * - **Special behaviors:**
 *    - `NaN` ➔ `"NaN"` only in `"primitives"` or `"all"` mode.
 *    - `Date` ➔ ISO string only in `"all"` mode.
 *    -  ***Primitives Boxed*** (`new Number`, `new String`, `new Boolean`):
 *       - For `new String` we convert everything to string (behavior JS of new String):
 *         - `new String("hi")` ➔ `.valueOf()` ➔ `"hi"`.
 *         - `new String(true)` ➔ `.valueOf()` ➔ `"true"`.
 *       - For `new Boolean` we convert to boolean (behavior JS of new Boolean) then convert to string:
 *         - `new Boolean(true)` ➔ `.valueOf()` ➔ `true` ➔ `true.toString()` ➔ `"true"`.
 *         - Special behavior JS of new Boolean, return `false` **(convert to string: `"false"`)**
 *           for `false`, (`0` / `-0`), `""` (empty-string), `null`, `undefined`, `NaN`, otherwise
 *           `true` **(convert to string: `"true"`)**.
 *       - For `new Number`:
 *         - `new Number(42)` ➔ `.valueOf()` ➔ `42` ➔ `42.toString()` ➔ `"42"`.
 *         - `new Number(NaN)` ➔ `.valueOf()` ➔ `NaN` ➔ `NaN.toString()` ➔ `"NaN"`.
 *         - `new Number(null)` ➔ `.valueOf()` ➔ `0` (`null` is `0` behavior JS of new Number) ➔ `0.toString()` ➔ `"0"`.
 *         - `new Number(undefined)` ➔ `.valueOf()` ➔ `NaN` ➔ `NaN.toString()` ➔ `"NaN"`.
 *         - `new Number(Infinity)` ➔ `Infinity` ➔ `Infinity` ➔ `Infinity.toString()` ➔ `"Infinity"`.
 *         - `new Number(-Infinity)` ➔ `-Infinity` ➔ `-Infinity` ➔ `-Infinity.toString()` ➔ `"-Infinity"`.
 *    - `RegExp` ➔ Source string (e.g. `/abc/i`) only in `"all"` mode.
 *    - `Symbol` ➔ `Symbol(description)` string only in `"all"` mode.
 *    - `Map` ➔ Array of [key, value] pairs with keys/values stringified deeply (only in `"all"` mode).
 *    - `Set` ➔ Array of values stringified deeply (only in `"all"` mode).
 *    - `Function` ➔ Source code string (e.g. `"() => 1"`) only in `"all"` mode.
 *    - `Error`, `Promise` ➔ Stringified via `.toString()` only in `"all"` mode.
 * @param {*} value
 * * ***The value to process.***
 *    - ***Can be anything:***
 *        - `primitive`.
 *        - `array`.
 *        - `object`.
 *        - `function`.
 *        - `etc`.
 * @param {false | "stringOrNumber" | "primitives" | "all"} forceToString - ***The mode of string conversion.***
 * @returns {unknown} A new value with the conversion applied based on `forceToString`.
 * @example
 * toStringDeepForce(42, "stringOrNumber");
 * // ➔ "42"
 * toStringDeepForce(true, "primitives");
 * // ➔ "true"
 * toStringDeepForce(null, "primitives");
 * // ➔ "null"
 * toStringDeepForce(Symbol("x"), "all");
 * // ➔ "Symbol(x)"
 * toStringDeepForce(new String("hi"), "all");
 * // ➔ "hi"
 * toStringDeepForce(new Number(42), "all");
 * // ➔ "42"
 * toStringDeepForce(new Boolean(true), "all");
 * // ➔ "true"
 * toStringDeepForce({ a: 1, b: [2, NaN] }, "primitives");
 * // ➔ { a: "1", b: ["2", "NaN"] }
 * toStringDeepForce(new Date("2025-01-01"), "all");
 * // ➔ "2025-01-01T00:00:00.000Z"
 * toStringDeepForce(() => 1, "all");
 * // ➔ "() => 1"
 * toStringDeepForce(/abc/i, "all");
 * // ➔ "/abc/i"
 * toStringDeepForce(new Map([["a", 1], ["b", 2]]), "all");
 * // ➔ [["a", "1"], ["b", "2"]]
 * toStringDeepForce(new Set([1, 2, 3]), "all");
 * // ➔ ["1", "2", "3"]
 * toStringDeepForce(new Error("Oops"), "all");
 * // ➔ "Error: Oops"
 * toStringDeepForce(Promise.resolve(1), "all");
 * // ➔ "[object Promise]"
 * toStringDeepForce({ func: () => 123 }, "all");
 * // ➔ { func: "() => 123" }
 * toStringDeepForce([1, "a", { b: 2 }], false);
 * // ➔ [1, "a", { b: 2 }]
 */
export function toStringDeepForce<T>(
  value: unknown,
  forceToString: false | "stringOrNumber" | "primitives" | "all"
): T;
export function toStringDeepForce(
  value: unknown,
  forceToString: false | "stringOrNumber" | "primitives" | "all"
) {
  if (
    !(
      forceToString === false ||
      forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
    )
  ) {
    throw new TypeError(
      `Second parameter \`forceToString\` must be of type \`false\` or \`string\` with value one of "stringOrNumber" | "primitives" | "all", but received: \`${getPreciseType(
        forceToString
      )}\`, with value: \`${safeStableStringify(forceToString, {
        keepUndefined: true
      })}\`.`
    );
  }

  // NaN special
  if (isNaN(value)) {
    return forceToString === "primitives" || forceToString === "all"
      ? "NaN"
      : NaN;
  }

  // string or number
  if (isString(value) || isNumber(value)) {
    return forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
      ? String(value)
      : value;
  }

  // other primitives
  if (isBoolean(value) || isBigInt(value) || isNil(value)) {
    return forceToString === "primitives" || forceToString === "all"
      ? String(value)
      : value;
  }

  // boxed primitives box (new Number, new String, new Boolean)
  if (
    isNumberObject(value) ||
    isBooleanObject(value) ||
    isStringObject(value)
  ) {
    return forceToString === "all" ? value.valueOf().toString() : value;
  }

  // symbol
  if (isSymbol(value)) {
    return forceToString === "all" ? value.toString() : value;
  }

  // function: only convert on "all"
  if (isFunction(value)) {
    return forceToString === "all" ? value.toString() : value;
  }

  // array
  if (isArray(value)) {
    return value.map((v) => toStringDeepForce(v, forceToString));
  }

  // objects
  if (isObjectOrArray(value)) {
    if (isDate(value)) {
      return forceToString === "all" ? value.toISOString() : value;
    }
    if (isRegExp(value)) {
      return forceToString === "all" ? value.toString() : value;
    }
    if (isError(value) || value instanceof Promise) {
      return forceToString === "all" ? value.toString() : value;
    }

    if (isSet(value)) {
      return forceToString === "all"
        ? [...value].map((v) => toStringDeepForce(v, forceToString))
        : value;
    }

    if (isMap(value)) {
      return forceToString === "all"
        ? [...value.entries()].map(([k, v]) => [
            toStringDeepForce(k, forceToString),
            toStringDeepForce(v, forceToString)
          ])
        : value;
    }

    const result: Record<string, unknown> = {};
    if (isObject(value)) {
      for (const key of Object.keys(value)) {
        result[key] = toStringDeepForce(value[key], forceToString);
      }
    }
    return result;
  }

  return value;
}
