import type { FormatDateIntlOptions } from "./_private/formatDateIntl.types";

import { isNaN } from "@/predicates/is/isNaN";
import { isNil } from "@/predicates/is/isNil";
import { isDate } from "@/predicates/is/isDate";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `formatDateIntl`.***
 * ----------------------------------------------------------
 * **Formats a date using the `Intl.DateTimeFormat` API.**
 *  - **Features:**
 *    - Supports custom locales (type-safe `SupportedLocales`).
 *    - Accepts additional `Intl.DateTimeFormatOptions` like `timeZone`, `hour12`, etc.
 *    - Defaults to `"en-US"` if `locale` is not provided or is an empty string.
 *    - Returns `null` if the date is invalid, not provided, or options are invalid.
 * @param {string | Date | null | undefined} date
 *  ***The date to format.***
 *    - Can be a `Date` object or an ISO string.
 *    - If invalid or not provided, returns `null`.
 * @param {FormatDateIntlOptions} [options] ***Optional formatting options for `Intl.DateTimeFormat`, use `locale` to specify the language & region format.***
 * @returns {string | null}
 *   - Formatted date string.
 *   - Returns `null` if date is invalid or options are of wrong type.
 * @example
 * formatDateIntl(new Date());
 * // ➔ "7/14/2025"
 * formatDateIntl("2025-07-14T00:00:00Z", { locale: "fr-FR", dateStyle: "long" });
 * // ➔ "14 juillet 2025"
 * formatDateIntl(null);
 * // ➔ null
 * formatDateIntl(new Date(), { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
 * // ➔ "01:30 AM"
 */
export const formatDateIntl = (
  date: string | Date | null | undefined,
  options?: FormatDateIntlOptions
): string | null => {
  if (isNil(date) || !(isDate(date) || isNonEmptyString(date))) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return null; // Handle invalid dates

  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) {
    options = {};
  }

  const { locale = "en-US", ...restProps } = options;

  try {
    return new Intl.DateTimeFormat(
      isNonEmptyString(locale) ? locale.trim() : "en-US",
      restProps
    ).format(parsedDate);
  } catch {
    return null;
  }
};
