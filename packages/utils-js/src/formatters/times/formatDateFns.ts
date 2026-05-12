import type { FormatDateFnsOptions } from "./_private/formatDateFns.types";

import { id, enUS } from "date-fns/locale";
import { format as formatDns, parse } from "date-fns";

import { isNaN } from "@/predicates/is/isNaN";
import { isNil } from "@/predicates/is/isNil";
import { isDate } from "@/predicates/is/isDate";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `formatDateFns`.***
 * ----------------------------------------------------------
 * **Formats a date into a human-readable string using `date-fns`.**
 *  - **Features:**
 *    - Supports custom output formats using `date-fns/format`.
 *    - Can parse localized non-ISO strings via `inputFormat` & `inputLocale`.
 *    - Supports `locale` as `"id"`, `"en"` or `date-fns` `Locale` objects (like `id` or `enUS`).
 *    - Returns `null` if the date is invalid, not provided, or parsing fails.
 * @param {string | Date | null | undefined} date
 *  ***The date input to format, can be:***
 *   - A `Date` object.
 *   - An ISO string (e.g. `"2024-01-01T12:00:00Z"`).
 *   - A localized string (requires `inputFormat` + `inputLocale`).
 * @param {FormatDateFnsOptions} [options] ***Options for formatting and parsing.***
 * @param {FormatDateFnsOptions["format"]} [options.format="dd MMM yyyy - HH:mm:ss"]
 *   ***The output format string (passed to `date-fns/format`), e.g:***
 *    - `"dd MMMM yyyy, HH:mm:ss" ➔ "14 Juli 2025, 17:25:42"`.
 * @param {FormatDateFnsOptions["locale"]} [options.locale="id"]
 *   The output locale. If string, only `"id"` (Indonesian) or `"en"` (English)
 *   is recognized. Or you can pass a `date-fns` `Locale` object.
 *   - Example:
 *   ```ts
 *     import { ar } from "date-fns/locale";
 *     formatDateFns(new Date(), { locale: ar, format: "PPPppp" });
 *   ```
 * @param {FormatDateFnsOptions["inputLocale"]} [options.inputLocale]
 *   Required if `date` is a localized non-ISO string. Used with `inputFormat`.
 *   - Example for Indonesian string:
 *   ```ts
 *     formatDateFns("14 Juli 2025 10:25:42", { inputFormat: "dd MMMM yyyy HH:mm:ss", inputLocale: "id" });
 *   ```
 * @param {FormatDateFnsOptions["inputFormat"]} [options.inputFormat]
 *   The format string to parse `date` if it is a non-ISO string.
 *   Required together with `inputLocale`.
 * @returns {string | null} A formatted date string or `null` if input is invalid.
 * @example
 * formatDateFns(new Date());
 * // ➔ "14 Jul 2025 - 17:25:42"
 * formatDateFns("2025-07-14T10:25:42Z", { format: "dd/MM/yyyy", locale: "en" });
 * // ➔ "14/07/2025"
 * formatDateFns("14 Juli 2025 10:25:42", {
 *   inputFormat: "dd MMMM yyyy HH:mm:ss",
 *   inputLocale: "id",
 *   format: "yyyy-MM-dd"
 * });
 * // ➔ "2025-07-14"
 * formatDateFns(null);
 * // ➔ null
 */
export const formatDateFns = (
  date: string | Date | null | undefined,
  options: FormatDateFnsOptions = {}
): string | null => {
  if (isNil(date) || !(isDate(date) || isNonEmptyString(date))) return null;

  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) {
    options = {};
  }

  const {
    inputFormat,
    locale = "en",
    inputLocale = "en",
    ...restOptions
  } = options;

  const format =
    hasOwnProp(options, "format") && isNonEmptyString(options.format)
      ? options.format
      : "dd MMM yyyy - HH:mm:ss";

  let parsedDate: Date;

  try {
    if (isNonEmptyString(date) && inputFormat && inputLocale) {
      const valueOfInputLocale = isNonEmptyString(inputLocale)
        ? inputLocale === "id"
          ? id
          : enUS
        : inputLocale;

      parsedDate = parse(date, inputFormat, new Date(), {
        locale: valueOfInputLocale
      });
    } else {
      parsedDate = new Date(date);
    }

    if (isNaN(parsedDate.getTime())) return null;

    const valueOfLocale = isNonEmptyString(locale)
      ? locale === "id"
        ? id
        : enUS
      : locale;

    return formatDns(parsedDate, format, {
      ...restOptions,
      locale: valueOfLocale
    });
  } catch {
    return null;
  }
};
