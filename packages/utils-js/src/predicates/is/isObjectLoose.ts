import { isNil } from "./isNil";
import { isFunction } from "./isFunction";
import { isObjectOrArray } from "./isObjectOrArray";

/** ----------------------------------------------------------
 * * ***Type guard: `isObjectLoose`.***
 * ----------------------------------------------------------
 * **Checks if a value is the
 * [ECMAScript language type ***Object***](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types).**
 * - **✅ Returns `true` for:**
 *    - Plain objects (`{}`)
 *    - Arrays (`[]`)
 *    - Functions
 *    - Regexes (`/abc/`)
 *    - Boxed primitives:
 *      - `new Number(0)`
 *      - `new String("")`
 *      - `new Boolean(false)`
 * - **❌ Returns `false` for:**
 *    - `null`
 *    - `undefined`
 *    - Primitives:
 *      - `string`
 *      - `number`
 *      - `boolean`
 *      - `symbol`
 *      - `bigint`
 * - **ℹ️ Note:**
 *    - **For More Strict Object Use ***`isObject`*** or ***`isPlainObject` utility function*** instead.**
 * @template T - The type of the value being checked.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 * isObjectLoose({});
 * // ➔ true
 * isObjectLoose([1, 2, 3]);
 * // ➔ true
 * isObjectLoose(()=> {});
 * // ➔ true
 * isObjectLoose(null);
 * // ➔ false
 * isObjectLoose(undefined);
 * // ➔ false
 */
export function isObjectLoose<T = object>(value: unknown): value is T {
  return !isNil(value) && (isObjectOrArray(value) || isFunction(value));
}
