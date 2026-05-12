import { isNil } from "@/predicates/is/isNil";
import { isArray } from "@/predicates/is/isArray";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isEmptyString } from "@/predicates/is/isEmptyString";

/** ---------------------------------
 * * ***Utility: `toBooleanLoose`.***
 * ---------------------------------------------
 * **Converts a given value into a boolean (loose).**
 * - **This follows JavaScript's typical truthy/falsy rules with some tweaks:**
 *    - `null` and `undefined` return `false`.
 *    - Empty strings return `false`, non-empty strings return `true`.
 *    - Numbers: `0` is `false`, others `true`.
 *    - Booleans returned as-is.
 *    - Arrays: `[]` is `false`, non-empty is `true`.
 *    - Other objects: uses `Boolean(value)`, so `{}` is `true`.
 * @param {*} value - The value to be converted.
 * @returns {boolean} Return `true` if the value is truthy, otherwise `false`.
 * @example
 * toBooleanLoose(null);     // ➔ false
 * toBooleanLoose("");       // ➔ false
 * toBooleanLoose("abc");    // ➔ true
 * toBooleanLoose(0);        // ➔ false
 * toBooleanLoose(42);       // ➔ true
 * toBooleanLoose([]);       // ➔ false
 * toBooleanLoose([1]);      // ➔ true
 * toBooleanLoose({});       // ➔ true
 * toBooleanLoose({ a: 1 }); // ➔ true
 */
export const toBooleanLoose = (value: unknown): boolean => {
  if (isNil(value)) return false;
  if (isString(value)) return !isEmptyString(value);
  if (isBoolean(value)) return value;
  if (isNumber(value, { includeNaN: true })) return value !== 0;
  if (isArray(value)) return value.length > 0;
  return Boolean(value);
};
