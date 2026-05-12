import type { AnyFunction } from "@rzl-zone/ts-types-plus";
import { isFunction } from "./isFunction";

const funcToString = Function.prototype.toString;
const reIsNative = /\{\s*\[native code\]\s*\}/;

/** ----------------------------------------------------
 * * ***Type guard: `isNative`.***
 * ----------------------------------------------------------
 * **Checks if a value is a **pristine native function**.**
 * - **ℹ️ Note:**
 *    - This method may not reliably detect native functions when using packages
 *      like `core-js`, as they override native behavior.
 *    - Attempts to detect native functions in such environments may fail or
 *      throw errors.
 *    - This also affects packages like
 *      **[`babel-polyfill`](https://www.npmjs.com/package/babel-polyfill).**
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 * isNative(Array.prototype.push);
 * // ➔ true
 *
 * import * as RzlUtilsJs from "@rzl-zone/utils-js/predicates";
 * isNative(RzlUtilsJs);
 * // ➔ false
 */
export function isNative(value: unknown): value is AnyFunction {
  if (!isFunction(value)) return false;

  try {
    const source = funcToString.call(value);
    return reIsNative.test(source);
  } catch {
    return false;
  }
}
