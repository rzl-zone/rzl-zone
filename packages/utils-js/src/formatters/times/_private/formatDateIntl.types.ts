import type { SupportedLocales } from "./SupportedLocales.types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { formatDateIntl } from "../formatDateIntl";

/** ----------------------------------------------------------------
 * * ***Options for formatting dates with `Intl.DateTimeFormat`.***
 * ----------------------------------------------------------------
 * **Extends the native
 * **{@link Intl.DateTimeFormatOptions | `Intl.DateTimeFormatOptions`}** with
 * an additional `locale` property that is validated against **{@link SupportedLocales | `SupportedLocales`}**.**
 * @private ***types for {@link formatDateIntl}.***
 */
export type FormatDateIntlOptions = Intl.DateTimeFormatOptions & {
  /** ------------------------------------------------------------
   * * ***Locale for date formatting.***
   * ------------------------------------------------------------
   * - **Behavior:**
   *    - Must be a valid [***BCP-47 locale***](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument),
   *      validated against {@link SupportedLocales | **`SupportedLocales`**}.
   *    - If `locale` is `undefined` or an empty string (after trimming),
   *      it will **default to `"en-US"`**.
   * @default "en-US"
   * @example
   * { year: "numeric", month: "long" }
   * // Unset locale, default locale ➔ "en-US"
   * { locale: "fr-FR", ...}
   * // Explicit locale
   * { locale: "   ", ...}
   * // Empty string locale ➔ defaults to "en-US"
   * { locale: " en-GB ", ...}
   * // Value will trimming ➔ "en-GB"
   *
   */
  locale?: SupportedLocales;
};
