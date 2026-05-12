import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { safeStableStringify } from "../stringify/safeStableStringify";

/** --------------------------------------------------
 * * ***Utility: `parseCustomDate`.***
 * ---------------------------------------------
 * **Parses custom date formats like "DD/MM/YYYY" or "MM/DD/YYYY".**
 * @param {string} dateString - Date string to parse.
 * @param {string} format - Date format to match.
 * @returns {Date | null} Returns a `Date` object if valid, otherwise `null`.
 * @throws **{@link TypeError | `TypeError`}** if `dateString` **(first parameter)** and `format` **(second parameter)** is not a string or empty-string.
 * @example
 * // Valid: European format (DD/MM/YYYY)
 * const date1 = parseCustomDate("03/09/2025", "DD/MM/YYYY");
 * console.log(date1); // ➔ Date { Wed Sep 03 2025 ... }
 *
 * // Valid: US format (MM/DD/YYYY)
 * const date2 = parseCustomDate("09/03/2025", "MM/DD/YYYY");
 * console.log(date2); // ➔ Date { Wed Sep 03 2025 ... }
 *
 * // Invalid: wrong format
 * const date3 = parseCustomDate("2025-09-03", "DD/MM/YYYY");
 * console.log(date3); // ➔ null
 *
 * // Invalid: non-date string
 * const date4 = parseCustomDate("hello", "DD/MM/YYYY");
 * console.log(date4); // ➔ null
 *
 * // Throws: wrong parameter types or empty-string
 * parseCustomDate(123, "DD/MM/YYYY");
 * // ➔ TypeError: Parameter `dateString` and `format` must be of type `string`...
 */
export const parseCustomDate = (
  dateString: string,
  format: string
): Date | null => {
  if (!isNonEmptyString(dateString) || !isNonEmptyString(format)) {
    throw new TypeError(
      `Parameter \`dateString\` and \`format\` must be of type \`string\` and not empty-string, but received: "['dateString': \`${getPreciseType(
        dateString
      )}\` - (current value: \`${safeStableStringify(dateString, {
        keepUndefined: true
      })}\`), 'format': \`${getPreciseType(
        format
      )}\` - (current value: \`${safeStableStringify(format, {
        keepUndefined: true
      })}\`)]".`
    );
  }

  const dateParts = dateString.split(/[-/]/).map(Number);
  if (dateParts.length !== 3 || dateParts.some(isNaN)) return null;

  let day: number, month: number, year: number;

  if (format === "DD/MM/YYYY") {
    [day, month, year] = dateParts;
  } else if (format === "MM/DD/YYYY") {
    [month, day, year] = dateParts;
  } else {
    return null;
  }

  month -= 1;
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};
