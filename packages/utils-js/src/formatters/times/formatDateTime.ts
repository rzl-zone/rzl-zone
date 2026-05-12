import { isNaN } from "@/predicates/is/isNaN";
import { isNil } from "@/predicates/is/isNil";
import { isDate } from "@/predicates/is/isDate";
import { isString } from "@/predicates/is/isString";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `formatDateTime`.***
 * ----------------------------------------------------------
 * **Formats a date and time into a custom string format.**
 *  - **Features:**
 *    - Supports only `YYYY`, `MM`, `DD`, `hh`, `mm`, and `ss` as placeholders.
 *    - Uses a simple string replace (no locale).
 *    - Returns `null` if the date is invalid or not provided.
 *    - Defaults to `"YYYY-MM-DD hh:mm:ss"` format if none is specified.
 * @param {string | Date | null| undefined} date - The date to format.
 * @param {string} [format="YYYY-MM-DD hh:mm:ss"] - The desired date format, if format is `null` or `undefined` will force to defaultValue, defaultValue is: `"YYYY-MM-DD hh:mm:ss"`.
 * @returns {string | null} The formatted date string or `null` if invalid.
 * @example
 * formatDateTime(new Date());
 * // ➔ "2024-02-09 14:30:45" (example output with current time)
 * formatDateTime("2023-07-01T14:30:45");
 * // ➔ "2023-07-01 14:30:45"
 * formatDateTime("2023-07-01T14:30:45", "DD/MM/YYYY");
 * // ➔ "01/07/2023"
 * formatDateTime("2023-07-01T14:30:45", "YYYY/MM/DD hh-mm-ss");
 * // ➔ "2023/07/01 14-30-45"
 * formatDateTime("2023-07-01T14:30:45", "hh:mm");
 * // ➔ "14:30"
 * formatDateTime("2023-07-01T14:30:45", "DATE: YYYY.MM.DD");
 * // ➔ "DATE: 2023.07.01"
 * formatDateTime("2023-07-01T14:30:45", "Year: YYYY, Time: hh:mm:ss");
 * // ➔ "Year: 2023, Time: 14:30:45"
 * formatDateTime("2023-07-01T14:30:45", "YYYY-MM");
 * // ➔ "2023-07"
 * formatDateTime("2023-07-01T14:30:45", "YYYYYYYY");
 * // ➔ "20232023"
 * formatDateTime("2023-07-01T14:30:45", "hh:mm:ss:ss");
 * // ➔ "14:30:45:45"
 * formatDateTime("invalid-date");
 * // ➔ null
 * formatDateTime(null);
 * // ➔ null
 * formatDateTime(undefined);
 * // ➔ null
 */
export const formatDateTime = (
  date: string | Date | null | undefined,
  format?: string
): string | null => {
  if (isNil(format)) {
    format = "YYYY-MM-DD hh:mm:ss";
  }

  if (!isString(format)) return null;

  // Handle missing or invalid date input type
  if (isNil(date) || !(isDate(date) || isNonEmptyString(date))) {
    return null;
  }

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null; // Handle invalid dates

    const pad2 = (n: number) => n.toString().padStart(2, "0");

    const map: Record<string, string> = {
      YYYY: parsedDate.getFullYear().toString(),
      MM: pad2(parsedDate.getMonth() + 1),
      DD: pad2(parsedDate.getDate()),
      hh: pad2(parsedDate.getHours()),
      mm: pad2(parsedDate.getMinutes()),
      ss: pad2(parsedDate.getSeconds())
    };

    const result = Object.entries(map).reduce(
      (prev, [key, value]) => prev.split(key).join(value),
      format
    );

    return !result.includes("NaN") ? result : null;
  } catch {
    return null;
  }
};
