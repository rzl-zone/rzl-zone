import { isEmptyValue } from "./isEmptyValue";

type IsNonEmptyValueOptions = {
  /** ----------------------------------------------------------
   * * ***Whether to check symbol properties when checking empty objects, default: `false`.***
   * -----------------------------------------------------------
   *
   * @default false
   */
  checkSymbols?: boolean;
};

/** ----------------------------------------------------------
 * * ***Predicated: `isNonEmptyValue`.***
 * -----------------------------------------------------------
 * **Determines if a value is a **non-empty** object (`{}` with props), **non-empty** array (`[]` with items) or generally truthy.**
 *
 * ---
 * - #### *Behavior:*
 *      - #### Returns `true` for:
 *           - Objects **with properties**.
 *           - Arrays **with items**.
 *           - Non-empty, non-whitespace strings.
 *           - Numbers (except `NaN`, includes `0`).
 *           - Functions.
 *           - `true`.
 *           ---
 *      - #### Returns `false` for:
 *           - Empty objects (`{}`).
 *           - Empty arrays (`[]`).
 *           - `null` or `undefined`.
 *           - Empty strings (`""`) or whitespace-only strings (`"  "`).
 *           - `false`.
 *           - `NaN`.
 *      - #### Safely handles `null`, `undefined`, and non-object types without throwing.
 *
 * ---
 * @param {*} value - The value to evaluate.
 * @param {IsNonEmptyValueOptions} [options] - Optional settings.
 *
 * ---
 * @returns {boolean} Return `true` if the value is considered non-empty/truthy, otherwise `false`.
 *
 * ---
 * @example
 * isNonEmptyValue({});
 * // ➔ false
 * isNonEmptyValue([]);
 * // ➔ false
 * isNonEmptyValue({ key: "value" });
 * // ➔ true
 * isNonEmptyValue({ [Symbol("foo")]: 123 });
 * // ➔ false (default `checkSymbols` is `false`)
 * isNonEmptyValue({ [Symbol("foo")]: 123 }, { checkSymbols: true });
 * // ➔ true
 * isNonEmptyValue([1, 2, 3]);
 * // ➔ true
 * isNonEmptyValue(NaN);
 * // ➔ false
 * isNonEmptyValue(true);
 * // ➔ true
 * isNonEmptyValue(false);
 * // ➔ false
 * isNonEmptyValue(null);
 * // ➔ false
 * isNonEmptyValue(undefined);
 * // ➔ false
 * isNonEmptyValue("");
 * // ➔ false
 * isNonEmptyValue("   ");
 * // ➔ false
 * isNonEmptyValue(0);
 * // ➔ true
 * isNonEmptyValue(-1);
 * // ➔ true
 * isNonEmptyValue(2);
 * // ➔ true
 * isNonEmptyValue(() => {});
 * // ➔ true
 */
export const isNonEmptyValue = (
  value: unknown,
  options: IsNonEmptyValueOptions = {}
): boolean => {
  return !isEmptyValue(value, options);
};
