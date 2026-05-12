import { isNumber } from "@/predicates/is/isNumber";
import { isString } from "@/predicates/is/isString";

/** ----------------------------------------------------------
 * * ***Utility: `extractDigits`.***
 * ---------------------------------------------
 * **Extracts digits from a string or number input.**
 * - **Behavior:**
 *    - Converts the input to a string, trims whitespace, and removes any characters that are not digits (`0-9`).
 *    - Returns the cleaned numeric value as a `number`.
 *    - If the input is a `null`, `undefined`, results in no digits, or not a `string` (or empty-string) or `number`, it safely return `0`.
 * @param {*} [value]
 *    **The value to process.**
 *    - Accepts a string, number, `null`, or `undefined`.
 * @returns {number} The numeric value after extracting digits (returns `0` if input is invalid or contains no digits).
 * @example
 * extractDigits(12345);       // ➔ 12345
 * extractDigits("9A8B7C6X1"); // ➔ 98761
 * extractDigits("123abc456"); // ➔ 123456
 * extractDigits("$1,234.56"); // ➔ 123456
 * extractDigits(NaN);         // ➔ 0
 * extractDigits(null);        // ➔ 0
 * extractDigits(undefined);   // ➔ 0
 * extractDigits(Infinity);    // ➔ 0
 * extractDigits(-Infinity);   // ➔ 0
 * extractDigits({});          // ➔ 0
 * extractDigits([]);          // ➔ 0
 * extractDigits("");          // ➔ 0
 * extractDigits(" ");         // ➔ 0
 * extractDigits("abc");       // ➔ 0
 * extractDigits("   00a  ");  // ➔ 0
 */
export const extractDigits = (value: unknown): number => {
  if (!isString(value) && !isNumber(value)) return 0;

  const cleaned = String(value)
    .trim()
    .replace(/[^0-9]/g, "");

  return Number(cleaned) || 0;
};
