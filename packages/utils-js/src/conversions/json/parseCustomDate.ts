import { createMessage } from "@/_private/logger";

import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { safeStableStringify } from "../stringify/safeStableStringify";

/** ---------------------------------------------------------------------------------------
 * * ***Utility: `parseCustomDate`.***
 * ----------------------------------------------------------------------------------------
 * **Parses custom date formats like `"DD/MM/YYYY"` or `"MM/DD/YYYY"`.**
 *
 * ---
 * @param {string} dateString - Date string to parse.
 * @param {string} format - Date format to match.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `dateString` **(first parameter)** and
 *         `format` **(second parameter)** is not a string or empty-string.
 *
 * ---
 * @returns {Date | null} Returns a `Date` object if valid, otherwise `null`.
 *
 * ---
 * @example
 * 1. #### Parse European date format:
 *    ```ts
 *    const date1 = parseCustomDate(
 *      "03/09/2025",
 *      "DD/MM/YYYY"
 *    );
 *
 *    console.log(date1);
 *    // ➔ Date { Wed Sep 03 2025 ... }
 *    ```
 *    ---
 * 2. #### Parse US date format:
 *    ```ts
 *    const date2 = parseCustomDate(
 *      "09/03/2025",
 *      "MM/DD/YYYY"
 *    );
 *
 *    console.log(date2);
 *    // ➔ Date { Wed Sep 03 2025 ... }
 *    ```
 *    ---
 * 3. #### Invalid date format:
 *    ```ts
 *    const date3 = parseCustomDate(
 *      "2025-09-03",
 *      "DD/MM/YYYY"
 *    );
 *
 *    console.log(date3);
 *    // ➔ null
 *    ```
 *    ---
 * 4. #### Invalid date string:
 *    ```ts
 *    const date4 = parseCustomDate(
 *      "hello",
 *      "DD/MM/YYYY"
 *    );
 *
 *    console.log(date4);
 *    // ➔ null
 *    ```
 *    ---
 * 5. #### Invalid parameter types:
 *    ```ts
 *    parseCustomDate(
 *      123,
 *      "DD/MM/YYYY"
 *    );
 *
 *    // ➔ TypeError: Parameter `dateString` and `format` must be of type `string`...
 *    ```
 */
export const parseCustomDate = (
  dateString: string,
  format: string
): Date | null => {
  if (!isNonEmptyString(dateString) || !isNonEmptyString(format)) {
    throw new TypeError(
      createMessage(
        "parseCustomDate",
        `Parameter \`dateString\` and \`format\` must be of type \`string\` and not empty-string, but received: "['dateString': \`${getPreciseType(
          dateString
        )}\` - (current value: \`${safeStableStringify(dateString, {
          keepUndefined: true
        })}\`), 'format': \`${getPreciseType(
          format
        )}\` - (current value: \`${safeStableStringify(format, {
          keepUndefined: true
        })}\`)]".`
      )
    );
  }

  const dateParts = dateString.split(/[-/]/).map(Number);
  if (dateParts.length !== 3 || dateParts.some(isNaN)) return null;

  let day: number | undefined,
    month: number | undefined,
    year: number | undefined;

  if (format === "DD/MM/YYYY") {
    [day, month, year] = dateParts;
  } else if (format === "MM/DD/YYYY") {
    [month, day, year] = dateParts;
  } else {
    return null;
  }

  if (month) month -= 1;
  const date = year && month && day ? new Date(year, month, day) : undefined;

  if (
    !date ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};
