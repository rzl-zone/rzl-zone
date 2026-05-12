import { isNaN } from "./isNaN";
import { isArray } from "./isArray";
import { isString } from "./isString";
import { isNumber } from "./isNumber";
import { isEmptyArray } from "./isEmptyArray";
import { isEmptyString } from "./isEmptyString";
import { isObjectOrArray } from "./isObjectOrArray";

/** ----------------------------------------------------------
 * * ***Predicate: `isEmptyDeep`.***
 * ----------------------------------------------------------
 * **Recursively checks whether a value is **deeply empty**.**
 * - **Returns `true` for:**
 *    - Empty objects: `{}`
 *    - Empty arrays: `[]`
 *    - Nested empty structures: `{ a: [], b: {} }`
 *    - Falsy values (except numbers): `null`, `undefined`, `false`, `""`, `NaN`
 * - **Returns `false` for:**
 *    - Non-zero numbers
 *    - Objects or arrays containing non-empty values
 *    - Non-empty strings, `true`, functions, symbols, etc.
 * @param {*} value - The value to deeply check.
 * @returns {boolean} `true` if the value is deeply empty, otherwise `false`.
 * @example
 * isEmptyDeep({});
 * // ➔ true
 * isEmptyDeep([]);
 * // ➔ true
 * isEmptyDeep({ a: {} });
 * // ➔ true
 * isEmptyDeep([[], {}]);
 * // ➔ true
 * isEmptyDeep({ a: [1] });
 * // ➔ false
 * isEmptyDeep([0]);
 * // ➔ false
 * isEmptyDeep("test");
 * // ➔ false
 * isEmptyDeep("");
 * // ➔ true
 * isEmptyDeep(0);
 * // ➔ false
 * isEmptyDeep(NaN);
 * // ➔ true
 */
export const isEmptyDeep = (value: unknown): boolean => {
  if (isString(value)) return isEmptyString(value);
  // Number ➔ only NaN counts as empty
  if (isNumber(value)) return isNaN(value);
  if (isArray(value)) {
    return isEmptyArray(value) || value.every(isEmptyDeep);
  }
  if (isObjectOrArray(value)) {
    const keys = Object.keys(value);
    const symbols = Object.getOwnPropertySymbols(value);
    // return (
    //   [...keys, ...symbols].length === 0 ||
    //   [...keys, ...symbols].every((key) =>
    //     isObject(value) && isString(key) ? isEmptyDeep(value[key]) : key
    //   )
    // );

    if (keys.length === 0 && symbols.length === 0) return true;

    return [...keys, ...symbols].every((key) => isEmptyDeep(value[key]));
  }
  if (!value) return true;

  return false;
};
