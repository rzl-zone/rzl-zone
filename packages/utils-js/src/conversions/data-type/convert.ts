import { isNaN } from "@/predicates/is/isNaN";
import { isString } from "@/predicates/is/isString";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `convertType`.***
 * ---------------------------------------------
 * **Converts a value from a string to its corresponding JavaScript primitive type.**
 * - **Supported conversions for string inputs (case-insensitive, trimmed):**
 *    - `"true"`           ➔ `true` (***boolean***).
 *    - `"false"`          ➔ `false` (***boolean***).
 *    - `"null"`           ➔ `null` (***null***).
 *    - `"yes"`            ➔ `true` (***boolean***).
 *    - `"no"`             ➔ `false` (***boolean***).
 *    - `"nan"` or `"NaN"` ➔ `NaN` (***number***).
 *    - `"undefined"`      ➔ `undefined` (***undefined***).
 * - Numeric strings with optional thousands separators (e.g. `"3,567,890.14"`) ➔ `3567890.14` ***as a `number` type***.
 * - Strings containing only whitespace are converted to empty string `""`.
 * - Non-string inputs are returned unchanged.
 * - Strings not matching any special case are trimmed and returned as-is.
 * @param {*} value - The value to convert, usually a string or other type.
 * @returns {*} The converted JavaScript primitive (***`boolean`***, ***`number`***, ***`null`***, ***`undefined`***, ***`NaN`***) or the original value if no conversion applies.
 * @example
 * convertType("true");          // ➔ true
 * convertType(" 42 ");          // ➔ 42
 * convertType("FALSE");         // ➔ false
 * convertType(" null ");        // ➔ null
 * convertType("   ");           // ➔ ""
 * convertType(" Hello World "); // ➔ "Hello World"
 * convertType("NaN");           // ➔ NaN
 * convertType(100);             // ➔ 100
 * convertType(NaN);             // ➔ NaN
 * convertType({});              // ➔ {}
 */
export const convertType = (value: unknown): unknown => {
  const predefinedValues: Record<string, unknown> = {
    undefined: undefined,
    null: null,
    nan: NaN,
    true: true,
    false: false,
    yes: true,
    no: false
  };

  if (isString(value)) {
    const normalized = value.trim().toLowerCase();

    if (Object.prototype.hasOwnProperty.call(predefinedValues, normalized)) {
      return predefinedValues[normalized];
    }

    // Support numbers with thousand separators
    const numericString = normalized.replace(/,/g, "");

    const numberString = Number(numericString);
    if (!isNaN(numberString) && isNonEmptyString(numericString)) {
      return numberString;
    }

    return value.trim();
  }

  return value;
};
