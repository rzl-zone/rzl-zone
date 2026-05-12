import { isNil } from "@/predicates/is/isNil";
import { isArray } from "@/predicates/is/isArray";
import { isObject } from "@/predicates/is/isObject";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** -------------------------------------------------
 * * ***Utility: `toBooleanContentDeep`.***
 * ---------------------------------------------
 * **This function does a deep inspection to determine if the input
 * contains any meaningful / non-empty value.**
 * @description
 * It is stricter than JavaScript's normal truthy checks because it looks *inside*
 * nested arrays & objects (recursively checks).
 * - **Rules:**
 *    - `null` and `undefined` return `false`
 *    - Empty strings `""` return `false`
 *    - `0` returns `false`
 *    - Empty arrays `[]` or empty objects `{}` return `false`
 *    - Checks deeply nested arrays/objects — if any value inside is "non-empty", returns `true`
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the value or anything nested inside is non-empty, otherwise `false`.
 * @example
 * toBooleanContentDeep(null);          // ➔ false
 * toBooleanContentDeep("");            // ➔ false
 * toBooleanContentDeep(0);             // ➔ false
 * toBooleanContentDeep([]);            // ➔ false
 * toBooleanContentDeep({});            // ➔ false
 * toBooleanContentDeep([[], {}]);      // ➔ false
 * toBooleanContentDeep("abc");         // ➔ true
 * toBooleanContentDeep(42);            // ➔ true
 * toBooleanContentDeep(NaN);           // ➔ true
 * toBooleanContentDeep([0, "", 5]);    // ➔ true
 * toBooleanContentDeep([NaN, "", 0]);  // ➔ true
 * toBooleanContentDeep([0, "", null]); // ➔ false
 * toBooleanContentDeep({ a: 0 });      // ➔ false
 * toBooleanContentDeep({ a: 1 });      // ➔ true
 * toBooleanContentDeep({ a: { b: [] }});  // ➔ false
 * toBooleanContentDeep({ a: { b: "x" }}); // ➔ true
 * toBooleanContentDeep({[Symbol("key")]: 123}); // ➔false
 */
export const toBooleanContentDeep = (value: unknown): boolean => {
  if (isNil(value)) return false;
  if (isString(value)) return isNonEmptyString(value);
  if (isBoolean(value)) return value;
  if (isNumber(value, { includeNaN: true })) return value !== 0;
  if (isArray(value)) return value.some(toBooleanContentDeep);
  if (isObject(value)) return Object.values(value).some(toBooleanContentDeep);

  return false;
};
