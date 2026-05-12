import { isArray } from "@/predicates/is/isArray";
import { isNumber } from "@/predicates/is/isNumber";
import { isStringObject } from "@/predicates/is/isStringObject";
import { isNumberObject } from "@/predicates/is/isNumberObject";
import { isBooleanObject } from "@/predicates/is/isBooleanObject";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Type-Utility: `ClassValue`.***
 * ----------------------------------------------------------
 * **Represents a single valid value that can be converted to a CSS class string.**
 * @description
 * - Supports the following types:
 *    - `string` → literal class names (non-empty only)
 *    - `number | bigint` → numeric class names
 *    - `boolean` → only `true` is considered in objects/arrays
 *    - `null | undefined` → ignored
 *    - `ClassObject` → objects where **keys with truthy values** are included
 *    - `ClassValues` → arrays recursively flattened
 * - Used internally by ***`cx` utility function*** to process mixed input values.
 * @example
 * ```ts
 * const val1: ClassValue = "button";              // ➔ string
 * const val2: ClassValue = 0;                     // ➔ number
 * const val3: ClassValue = ["a", { b: true }];    // ➔ array with object
 * const val4: ClassValue = { d: true, e: false }; // ➔ object
 * const val5: ClassValue = new String("foo");     // ➔ boxed string
 * const val6: ClassValue = new Number("123");     // ➔ boxed number
 * const val7: ClassValue = new Boolean("true");   // ➔ boxed boolean
 * ```
 */
export type ClassValue =
  | ClassValues
  | ClassObject
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;

/** ----------------------------------------------------------
 * * ***Type-Utility: `ClassObject`.***
 * ----------------------------------------------------------
 * **Represents an object whose keys with truthy values are included in the final class string.**
 * @example
 * ```ts
 * const obj: ClassObject = { "text-red": true, "hidden": false };
 * // ➔ "text-red" when processed by cx
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassObject = Record<string, any>;

/** ----------------------------------------------------------
 * * ***Type-Utility: `ClassValues`.***
 * ----------------------------------------------------------
 * **Represents an array of {@link ClassValue | `ClassValue's`}, potentially nested.**
 * @example
 * ```ts
 * const arr: ClassValues = [
 *   "a",
 *   1,
 *   ["b", { c: true, d: false }],
 *   { e: 2 }
 * ];
 * ```
 */
export type ClassValues = ClassValue[];

/** ----------------------------------------------------------
 * * ***Utility: `toStringValue`.***
 * ----------------------------------------------------------
 * **Converts a `ClassValue` into a single space-separated string suitable for CSS class usage.**
 * @param {ClassValue} value The mixed value to process.
 * @returns {string} A string containing all valid class names.
 * @description
 * - Arrays are recursively flattened.
 * - Objects include only keys with truthy values.
 * - Skips `null`, `undefined`, and empty strings.
 * - Numbers, strings, and bigint are included as-is.
 * - Boolean `false` is ignored in objects/arrays.
 * - Boxed primitives (`new String()`, `new Number()`, `new Boolean()`) are supported.
 * - Preserves inherited object keys.
 * @example
 * ```ts
 * toStringValue("btn"); // ➔ "btn"
 * toStringValue(["a", 0, "b"]); // ➔ "a b"
 * toStringValue({ a: true, b: false, c: 1 }); // ➔ "a c"
 * toStringValue(["a", ["b", { c: true, d: false }]]); // ➔ "a b c"
 * toStringValue(new String("foo")); // ➔ "foo"
 * toStringValue(new Number(42));    // ➔ "42"
 * toStringValue(new Boolean(true)); // ➔ "true"
 * toStringValue(new Boolean(false));// ➔ ""
 * ```
 */
function toStringValue(value: ClassValue): string {
  let str = "";

  if (isNonEmptyString(value) || isNumber(value)) {
    str += value;
  } else if (isObjectOrArray(value)) {
    if (
      isStringObject(value) ||
      isNumberObject(value) ||
      isBooleanObject(value)
    ) {
      const val = value.valueOf();
      if (val) str += val; // skip falsy
    } else if (isArray(value)) {
      for (const item of value) {
        if (!item) continue; // skip falsy
        const y = toStringValue(item);
        if (!y) continue;
        if (str) str += " ";
        str += y;
      }
    } else {
      for (const key in value) {
        if (!value[key]) continue; // skip falsy
        if (str) str += " ";
        str += key;
      }
    }
  }

  return str;
}

/** ----------------------------------------------------------
 * * ***Utility: `cx`.***
 * ----------------------------------------------------------
 * **Merge multiple class values into a single, space-separated string suitable for CSS usage.**
 * @description
 * - Supports **nested combinations** of arrays and objects, recursively.
 * - **Falsy values** are skipped:
 *   - `false`, `null`, `undefined`, empty strings `""` are ignored anywhere.
 *   - Numbers `0` are ignored inside nested arrays/objects.
 * - **Boxed primitives** are correctly unwrapped to their primitive value.
 * - **Inherited object keys** are included in the final class string.
 * - Optimized for **CSS class merging** where conditional inclusion is common.
 * @param {ClassValues} values
 *   A list of mixed class values, which can include:
 *   - **Strings** → literal class names.
 *   - **Numbers** → numeric class names.
 *   - **BigInt** → numeric class names larger than JS safe integer limit.
 *   - **Arrays** → recursively flattened, can contain nested arrays or objects.
 *   - **Objects** → include keys whose values are truthy. Inherited keys are also included.
 *   - **Boxed primitives** (`new String()`, `new Number()`, `new Boolean()`) → automatically unwrapped.
 *   - **Falsy values** (`false`, `null`, `undefined`, `""`, `0`) are ignored according to original behavior.
 * @returns {string}
 *   A single space-separated string containing all valid class names.
 * @example
 * ```ts
 * // Basic string merge
 * cx("btn", "btn-primary");
 * // ➔ "btn btn-primary"
 *
 * // Mixed arrays and objects
 * cx("a", ["b", { c: true, d: false }], { e: 1, f: 0 }, null, 2);
 * // ➔ "a b c e 2"
 *
 * // Empty and falsy values are ignored
 * cx("", null, undefined, false, 0);
 * // ➔ ""
 *
 * // Nested arrays with objects
 * cx(["a", ["b", { c: true, d: false }]]);
 * // ➔ "a b c"
 *
 * // Boxed primitives are unwrapped
 * cx(new String("foo"), new Number(42), new Boolean(true), new Number(0), new Boolean(false));
 * // ➔ "foo 42 true"
 *
 * // Inherited keys from objects are included
 * const proto = { inherited: true };
 * const obj = Object.create(proto);
 * obj.own = true;
 * cx(obj);
 * // ➔ "own inherited"
 * ```
 */
export function cx(...values: ClassValues): string {
  let str = "";

  for (const value of values) {
    if (!value) continue; // skip falsy arguments
    const x = toStringValue(value);
    if (!x) continue;
    if (str) str += " ";
    str += x;
  }

  return str;
}
