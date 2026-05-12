import { isNil } from "@/predicates/is/isNil";
import { isArray } from "@/predicates/is/isArray";
import { isObject } from "@/predicates/is/isObject";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isNonEmptyValue } from "@/predicates/is/isNonEmptyValue";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ---------------------------------
 * * ***Utility: `toBooleanContent`.***
 * ---------------------------------------------
 * **Converts a given value into a boolean (***strict***).**
 * - **This is stricter than normal JS coercion:**
 *    - `null` and `undefined` return `false`.
 *    - Empty strings return `false`, non-empty strings return `true`.
 *    - Numbers: `0` is `false`, others `true`.
 *    - Booleans returned as-is.
 *    - Arrays: `[]` is `false`, non-empty is `true`.
 *    - Objects: `{}` is `false`, object with keys is `true`.
 * @param {*} value - The value to be converted.
 * @returns {boolean} Return `true` if the value is considered non-empty, otherwise `false`.
 * @example
 * toBooleanContent(null);      // ➔ false
 * toBooleanContent(undefined); // ➔ false
 * toBooleanContent("");        // ➔ false
 * toBooleanContent("  ");      // ➔ false
 * toBooleanContent("abc");     // ➔ true
 * toBooleanContent(" asd ");   // ➔ true
 * toBooleanContent(0);         // ➔ false
 * toBooleanContent(42);        // ➔ true
 * toBooleanContent(NaN);       // ➔ true
 * toBooleanContent([]);        // ➔ false
 * toBooleanContent([1]);       // ➔ true
 * toBooleanContent({});        // ➔ false
 * toBooleanContent({ a: 1 });  // ➔ true
 * toBooleanContent({[Symbol("key")]: 123}); // ➔ false
 */
export const toBooleanContent = (value: unknown): boolean => {
  if (isNil(value)) return false;
  if (isString(value)) return isNonEmptyString(value);
  if (isBoolean(value)) return value;
  if (isNumber(value, { includeNaN: true })) return value !== 0;
  if (isArray(value) || isObject(value)) return isNonEmptyValue(value);
  return Boolean(value);
};
