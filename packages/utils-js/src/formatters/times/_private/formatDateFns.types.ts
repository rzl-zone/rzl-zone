import type { FormatOptions, Locale } from "date-fns";
import type { AnyString, OmitStrict, Prettify } from "@rzl-zone/ts-types-plus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { formatDateFns } from "../formatDateFns";

/** ----------------------------------------------------------------------
 * * ***Options for formatting dates with `date-fns/format`.***
 * ----------------------------------------------------------------------
 *
 * Extends the base **{@link FormatOptions | *`FormatOptions`*}** (without **`locale`**) with extra options
 * for handling output formatting, localization, and parsing non-standard inputs.
 *
 * @private ***types for {@link formatDateFns}.***
 */
export type FormatDateFnsOptions = Prettify<
  OmitStrict<FormatOptions, "locale", true, false> & {
    /** ------------------------------------------------------------
     * * ***Output format string passed to `date-fns/format`.***
     * ------------------------------------------------------------
     * - **Behavior:**
     *    - Determines how the date will be rendered.
     *    - Uses the full power of `date-fns` tokens.
     * - ***Default Value***: `"dd MMM yyyy - HH:mm:ss"`.
     * @example
     * "dd MMMM yyyy, HH:mm:ss" // ➔ "03 September 2025, 10:25:42"
     * @default "dd MMM yyyy - HH:mm:ss"
     */
    format?: string;

    /** ------------------------------------------------------------
     * * ***Locale used for formatting.***
     * ------------------------------------------------------------
     * - **Behavior:**
     *    - If `string`: only accepts `"id"` (Indonesian) or `"en"` (English) - **(default)**.
     *    - If `Locale`: accepts a locale object from `date-fns/locale`.
     * - ***Default Value***: `"en"`.
     * ```ts
     * import { ar } from "date-fns/locale";
     *
     * formatDateFns(new Date(), {
     *    locale: ar,
     *    format: "dd MMMM yyyy"
     * });
     * // ➔ "03 سبتمبر 2025"
     * ```
     * @default "en"
     */
    locale?: "id" | "en" | AnyString | Locale;

    /** ------------------------------------------------------------
     * * ***Input locale used when parsing non-standard string dates.***
     * ------------------------------------------------------------
     * - **Behavior:**
     *    - Required if `date` is a **localized string**
     *      (e.g. `"03 Mei 2025 10:25:42"` in Indonesian).
     *    - Same accepted types as `locale` parameter.
     * - ***Default Value***: `"en"`.
     * ```ts
     * import { ar } from "date-fns/locale";
     *
     * formatDateFns("03 مايو 2025 10:25:42", {
     *    inputFormat: "dd MMMM yyyy HH:mm:ss",
     *    inputLocale: ar,
     *    format: "PPpp"
     * });
     * // ➔ "May 3, 2025 at 10:25:42 AM"
     * ```
     * @default "en"
     */
    inputLocale?: "id" | "en" | AnyString | Locale;

    /** ------------------------------------------------------------
     * * ***Input format string for parsing non-ISO string dates.***
     * ------------------------------------------------------------
     * - **Behavior:**
     *    - Required if `date` is **not ISO-8601** and not a native `Date`.
     *    - Works together with `inputLocale` parameter.
     * -  ***Default Value***: `undefined`.
     * @default undefined
     * @example
     * "dd MMMM yyyy HH:mm:ss" // ➔ "03 May 2025 10:25:42"
     */
    inputFormat?: string;
  }
>;
