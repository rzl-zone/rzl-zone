import { isNil } from "@/predicates/is/isNil";
import { isNaN } from "@/predicates/is/isNaN";
import { isDate } from "@/predicates/is/isDate";
import { isString } from "@/predicates/is/isString";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `getGMTOffset`.***
 * ----------------------------------------------------------
 * **Returns the formatted GMT offset (e.g., `+0700`, `-0500`) for a given date.**
 *  - **Features:**
 *    - If `date` is **not provided** or empty string, it defaults to the current date/time.
 *    - If `date` is **invalid** or of wrong type (like object or number), it returns `"0"`.
 *    - The returned string follows the **GMT offset format** (`±HHMM`), where:
 *      - `±` is `+` if ahead of UTC, `-` if behind.
 *      - `HH` is two-digit hours.
 *      - `MM` is two-digit minutes.
 * @param {string | Date | null} [date]
 *  ***The date to get the GMT offset from.***
 *   - Accepts `Date` object or ISO date string (e.g., `"2024-01-01T12:00:00Z"`).
 *   - If `null`, `undefined`, or empty string, uses current system date.
 *   - If invalid date or wrong type (like `123` or `{}`), returns `"0"`.
 * @returns {string} The GMT offset string in format `±HHMM`,
 *   e.g. `"+0700"`, `"-0530"`, or `"0"` if invalid.
 * @example
 * getGMTOffset();
 * // ➔ "+0700" (depends on your system timezone)
 * getGMTOffset(new Date("2024-02-09T12:00:00Z"));
 * // ➔ "+0000"
 * getGMTOffset("2024-02-09");
 * // ➔ "+0700" (depends on your system timezone)
 * getGMTOffset("invalid-date");
 * // ➔ "0"
 * getGMTOffset(123);
 * // ➔ "0"
 */
export const getGMTOffset = (date?: string | Date | null): string => {
  try {
    if (isNil(date) || (isString(date) && isEmptyString(date))) {
      date = new Date(); // Default to current date
    } else if (!(isDate(date) || isNonEmptyString(date))) {
      return "0"; // Invalid type
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "0"; // Handle invalid dates

    const padZero = (num: number) => num.toString().padStart(2, "0");

    let offset = parsedDate.getTimezoneOffset();
    const sign = offset < 0 ? "+" : "-";
    offset = Math.abs(offset);

    return `${sign}${padZero(Math.floor(offset / 60))}${padZero(offset % 60)}`;
  } catch {
    return "0";
  }
};
