import { randomInt } from "./randomInt";
import { isInteger } from "@/predicates/is/isInteger";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

type OptionsRandomIntByLength = {
  /** * Minimum length of the random number, the `allowed minimal value` `integer` is `1` `and not bigger than value of` `maxLength`, defaultValue: `1`.
   *
   * @default 1
   */
  minLength?: number;
  /** * Maximum length of the random number, the `allowed maximal value` `integer` is `16`, defaultValue: `16`.
   *
   * @default 16
   */
  maxLength?: number;
  /** * If true, prevents the result from being zero, defaultValue: `false`.
   *
   * @default false
   */
  avoidZero?: boolean;
};

/** ----------------------------------------------------------------------------
 * * ***Utility: `randomIntByLength`.***
 * -----------------------------------------------------------------------------
 * **Generates a random integer within a specified range of digit lengths.**
 * @description
 * This function allows generating random integers that strictly conform to a specified minimum and
 * maximum digit length, it is useful for scenarios such as generating realistic-looking IDs, codes,
 * or random test data.
 * - **The function ensures:**
 *    - `minLength` is at least 1 and not greater than `maxLength`.
 *    - `maxLength` is no more than 16 (due to JavaScript's `Number.MAX_SAFE_INTEGER`).
 *    - If `avoidZero` is `true`, ensures that `0` is never returned.
 * @param {OptionsRandomIntByLength} [options] - Configuration options.
 * @param {OptionsRandomIntByLength["minLength"]} [options.minLength=1] - Minimum number of digits (must be ≥ `1` and ≤ `maxLength`).
 * @param {OptionsRandomIntByLength["maxLength"]} [options.maxLength=16] - Maximum number of digits (must be ≤ `16`).
 * @param {OptionsRandomIntByLength["avoidZero"]} [options.avoidZero=false] - If true, will ensure the result is never zero.
 * @returns {number} A randomly generated integer within the specified constraints.
 * @throws **{@link TypeError | `TypeError`}** if parameters are invalid, such as:
 * - `minLength` < `1`
 * - `maxLength` > `16`
 * - `minLength` > `maxLength`
 * - non-integer values for `minLength` or `maxLength`
 * @example
 * randomIntByLength({ minLength: 3, maxLength: 5 });
 * // ➔ `4829` (random), `192` (random) or `71492` (random).
 * randomIntByLength({ minLength: 4, maxLength: 4 });
 * // ➔ `5930` (exact 4 digits)
 * randomIntByLength({ avoidZero: true });
 * // ➔ never 0
 */
export const randomIntByLength = (
  options?: OptionsRandomIntByLength
): number => {
  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) {
    options = {};
  }

  const { minLength = 1, maxLength = 16, avoidZero = false } = options;

  assertIsBoolean(avoidZero, {
    message({ currentType, validType }) {
      return `Parameters \`avoidZero\` must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  // Validate `minLength` & `maxLength` type
  if (!isInteger(minLength) || !isInteger(maxLength)) {
    throw new TypeError(
      `Parameters \`minLength\` and \`maxLength\` must be of type \`integer-number\`, but received: ['minLength': \`${getPreciseType(
        minLength
      )}\` - (with value: ${safeStableStringify(minLength, {
        keepUndefined: true
      })}), 'maxLength': \`${getPreciseType(
        maxLength
      )}\` - (with value: ${safeStableStringify(maxLength, {
        keepUndefined: true
      })})].`
    );
  }

  // Validate `minLength` & `maxLength` range.
  if (minLength < 1 || maxLength > 16 || minLength > maxLength) {
    throw new RangeError(
      `Invalid range at parameters \`minLength\` must be ≥ 1, \`maxLength\` must be ≤ 16, and \`minLength\` ≤ \`maxLength\`, but received: ['minLength': \`${minLength}\`, 'maxLength': \`${maxLength}\`].`
    );
  }

  // Generate a random length between minLength and maxLength
  const randomLength =
    minLength === maxLength ? minLength : randomInt(minLength, maxLength);

  // Define min and max value based on the selected length
  const minValue = 10 ** (randomLength - 1); // Example: minLength=3 ➔ minValue=100
  const maxValue = 10 ** randomLength - 1; // Example: maxLength=4 ➔ maxValue=9999

  // Generate a random number within the valid range
  let result = randomInt(minValue, maxValue);

  // Ensure the number is not zero if `avoidZero` is true
  if (avoidZero && result === 0) {
    result = minValue; // Assign the smallest valid number instead of looping
  }

  return result;
};
