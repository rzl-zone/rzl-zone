/* eslint-disable @typescript-eslint/no-unused-vars */
import type { formatCurrency } from "./formatCurrency";

type NegativeFormatOptionCustom = {
  /** Custom formatter function for the final formatted negative string.
   *  If provided, it ***OVERRIDES*** style & space entirely. */
  custom: (formatted: string) => string;
  style?: never;
  space?: never;
};

type NegativeFormatOptionUnCustom = {
  custom?: never;
  /** Use style & optional spacing for negative numbers.
   *
   * @default "dash"
   */
  style?: "dash" | "brackets" | "abs";
  /** Whether to include space inside brackets or after dash.
   *
   * Default: false
   * @default false
   */
  space?: boolean;
};

/** ---------------------------------------------------------------------------
 * * ***Type for negative number formatting options.***
 * ---------------------------------------------------------------------------
 */
type NegativeFormatOption =
  | "dash"
  | "brackets"
  | "abs"
  | NegativeFormatOptionCustom
  | NegativeFormatOptionUnCustom;

/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link formatCurrency|`formatCurrency`}.***
 * ---------------------------------------------------------------------------
 */
export type FormatCurrencyOptions = {
  /** ---------------------------------------------------------------------------
   * * ***Prefix currency string.***
   * ---------------------------------------------------------------------------
   * **Does not auto-keep input symbols.**
   * - ***DefaultValue:** `""`.*
   * - **Example:** `"Rp "` ➔ `Rp 1.000`.
   *
   * @default ""
   */
  suffixCurrency?: string;
  /** ---------------------------------------------------------------------------
   * * ***Thousands separator.***
   * ---------------------------------------------------------------------------
   * - ***DefaultValue:** `"."`.*
   * - **Example:** `"."` ➔ `1.000.000`.
   * @default "."
   */
  separator?: string;
  /** ---------------------------------------------------------------------------
   * * ***Prefix currency string.***
   * ---------------------------------------------------------------------------
   * **Whether to show decimals, if `false`, decimals are truncated.**
   * - ***DefaultValue:** `false`.*
   * @default false
   */
  decimal?: boolean;
  /** ---------------------------------------------------------------------------
   * * ***Total decimal digits.***
   * ---------------------------------------------------------------------------
   * **If `decimal: true` & `roundedDecimal: false`, simply cuts.**
   * - ***DefaultValue:** `2`.*
   * @default 2
   */
  totalDecimal?: number;
  /** ---------------------------------------------------------------------------
   * * ***Actually append `suffixDecimal`.***
   * ---------------------------------------------------------------------------
   * - ***DefaultValue:** `true`.*
   * @default true
   */
  endDecimal?: boolean;
  /** ---------------------------------------------------------------------------
   * * ***Text appended after decimals.***
   * ---------------------------------------------------------------------------
   * - ***DefaultValue:** `""`.*
   * - **Example:**
   *    -  `".-"` ➔ `1.000,00.-`.
   *    -  `" USD"` ➔ `1.000,00 USD`.
   * @default ""
   */
  suffixDecimal?: string;
  /** ---------------------------------------------------------------------------
   * * ***Rounding mode for decimals.***
   * ---------------------------------------------------------------------------
   * - **Behavior:**
   *     - `"round"` ➔ nearest.
   *     - `"ceil"` ➔ always up.
   *     - `"floor"` ➔ always down.
   *     - `false` ➔ truncate.
   * - ***DefaultValue:** `"round"`.*
   * @default "round"
   */
  roundedDecimal?: "round" | "ceil" | "floor" | false;
  /** ---------------------------------------------------------------------------
   * * ***Decimal separator.***
   * ---------------------------------------------------------------------------
   * - ***DefaultValue:** `","`.*
   * - **Example:** `","` ➔ `1.000,10`.
   * @default ","
   */
  separatorDecimals?: string;
  /** ---------------------------------------------------------------------------
   * * ***Negative formatting option.***
   * ---------------------------------------------------------------------------
   * **Can be string ("dash" | "brackets" | "abs") or object with custom formatter.**
   * - **Behavior:**
   *    - `"dash"` ➔ `-15.000`.
   *    - `"brackets"` ➔ `(15.000)`.
   *    - `"abs"` ➔ `15.000` (always positive).
   *    - Or object:
   *         `{
   *            style: "dash"|"brackets"|"abs",
   *            space: true|false,
   *            custom: (formatted) => string
   *         }`.
   * - ***DefaultValue:** `"dash"`.*
   *
   * @default "dash"
   */
  negativeFormat?: NegativeFormatOption;
  /** ---------------------------------------------------------------------------
   * * ***Applies Indian Format.***
   * ---------------------------------------------------------------------------
   * - **Behavior:**
   *    - If `true`, formats as Indian: `12,34,567`.
   *    - Also forces `separator: ","`, `separatorDecimals: "."`.
   * - ***DefaultValue:** `false`.*
   * @default false
   */
  indianFormat?: boolean;
};
