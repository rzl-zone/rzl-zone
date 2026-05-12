// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanParsedData } from "../../cleanParsedData";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { parseCustomDate } from "../../parseCustomDate";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { safeJsonParse } from "../../safeJsonParse";

/** --------------------------------------------------
 * * ***Options for cleaning and transforming parsed JSON data.***
 * --------------------------------------------------
 *
 * @private Type Options Validation for Function: {@link cleanParsedData | `cleanParsedData`}, {@link parseCustomDate | `parseCustomDate`} and {@link safeJsonParse | `safeJsonParse`}.
 */
export type ParseParsedDataOptions = {
  /** --------------------------------------------------
   * * ***Convert numeric strings to numbers (e.g., `"42"` ➔ `42`), defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  convertNumbers?: boolean;

  /** --------------------------------------------------
   * * ***Convert numeric strings `"NaN"` to `NaN` (e.g., `"NaN"` ➔ `NaN`), defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  convertNaN?: boolean;

  /** --------------------------------------------------
   * * ***Convert `"true"` / `"false"` strings to boolean values, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  convertBooleans?: boolean;

  /** --------------------------------------------------
   * * ***Convert valid date strings into `Date` objects, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  convertDates?: boolean;

  /** --------------------------------------------------
   * * ***Custom date formats to be parsed (e.g., `["DD/MM/YYYY", "MM/DD/YYYY"]`), defaultValue: `[]`.***
   * --------------------------------------------------
   *
   * @default []
   */
  customDateFormats?: string[];

  /** --------------------------------------------------
   * * ***Remove `null` values from objects and arrays, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  removeNulls?: boolean;

  /** --------------------------------------------------
   * * ***Remove `undefined` values from objects and arrays, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * - ***Behavior:***
   *    - `false` (**default**): replaces `undefined` with `null`.
   *    - `true`: removes keys with `undefined` values.
   *
   * @default false
   */
  removeUndefined?: boolean;

  /** --------------------------------------------------
   * * ***Remove empty objects `{}` from the final output, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  removeEmptyObjects?: boolean;

  /** --------------------------------------------------
   * * ***Remove empty arrays `[]` from the final output, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  removeEmptyArrays?: boolean;

  /** --------------------------------------------------
   * * ***Removes values that do not match selected conversions, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  strictMode?: boolean;

  /** --------------------------------------------------
   * * ***Enable error logging if JSON parsing fails, defaultValue: `false`.***
   * --------------------------------------------------
   *
   * @default false
   */
  loggingOnFail?: boolean;

  /** --------------------------------------------------
   * * ***Custom error handler function.***
   * --------------------------------------------------
   *
   * - ***Behavior:***
   *    - If provided, it will be called with the error.
   *    - If not provided, defaults to `undefined` in type, but internally a no-op function is used.
   *
   * @param error - Error instance thrown during fail on execution.
   * @default undefined
   */
  onError?: (error: Error) => void;

  /** --------------------------------------------------
   * * ***Whether to check symbol properties when checking empty objects.***
   * --------------------------------------------------
   *
   * @default false
   */
  checkSymbols?: boolean;
};
