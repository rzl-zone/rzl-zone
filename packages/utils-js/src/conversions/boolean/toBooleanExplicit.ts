import { isNil } from "@/predicates/is/isNil";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isBoolean } from "@/predicates/is/isBoolean";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isPlainObject } from "@/predicates/is/isPlainObject";

import { getPreciseType } from "@/predicates/type/getPreciseType";

type ToBooleanExplicitOptions = {
  /** Whether string comparison ignores case, _defaultValue: `false`_.
   *
   * @default false
   */
  caseInsensitive?: boolean;
  /** Whether to trim whitespace before comparison, _defaultValue: `true`_.
   *
   * @default true
   */
  trimString?: boolean;
  /** Whether to consider the string `"indeterminate"` as `true`, _defaultValue: `false`_.
   *
   * @default false
   */
  includeIndeterminate?: boolean;
};

/** --------------------------------------------
 * * ***Utility: `toBooleanExplicit`.***
 * ---------------------------------------------
 * **Converts a value into a strict boolean.**
 * - **Behavior:**
 *    - It supports various common string representations of truthy values,
 *      including `"true"`, `"on"`, `"yes"`, `"1"`, the number `1`, the boolean `true`,
 *      and optionally the string `"indeterminate"` if enabled.
 * - **ℹ️ Note:**
 *    - Any other value, including `undefined`, `null`, `false`, `0`, and
 *      unrecognized strings will return `false`.
 *    - Supports optional `caseInsensitive` and `trimString` to customize
 *      string normalization.
 * @param {*} value - The value to convert.
 * @param {ToBooleanExplicitOptions} [options] - Options for conversion behavior.
 * @param {ToBooleanExplicitOptions["caseInsensitive"]} [options.caseInsensitive=false] - Whether string comparison ignores case, default: `false`.
 * @param {ToBooleanExplicitOptions["trimString"]} [options.trimString=true] - Whether to trim whitespace before comparison, default: `true`.
 * @param {ToBooleanExplicitOptions["includeIndeterminate"]} [options.includeIndeterminate=false] - If `true`, the string `"indeterminate"` is considered a truthy value, defaults to `false`.
 * @returns {boolean} Return `true` if the value matches a truthy representation, otherwise `false`.
 * @throws **{@link TypeError | `TypeError`}** if any option provided is not a boolean.
 * @example
 * toBooleanExplicit(1);
 * // ➔ true
 * toBooleanExplicit(true);
 * // ➔ true
 * toBooleanExplicit("on");
 * // ➔ true
 * toBooleanExplicit("1");
 * // ➔ true
 * toBooleanExplicit(0);
 * // ➔ false
 * toBooleanExplicit("off");
 * // ➔ false
 * toBooleanExplicit("Yes");
 * // ➔ false (caseInsensitive is false by default)
 * toBooleanExplicit(" yes ");
 * // ➔ true (whitespace trimmed by default)
 * toBooleanExplicit("YES", { caseInsensitive: true });
 * // ➔ true
 * toBooleanExplicit("YES", { caseInsensitive: false });
 * // ➔ false
 * toBooleanExplicit(" YES ", { trimString: false });
 * // ➔ false (whitespace not trimmed)
 * toBooleanExplicit(" YES ", { trimString: true, caseInsensitive: true });
 * // ➔ true
 * toBooleanExplicit(" YES ", { trimString: true, caseInsensitive: false });
 * // ➔ false
 * toBooleanExplicit("indeterminate");
 * // ➔ false (default)
 * toBooleanExplicit("indeterminate", { includeIndeterminate: true });
 * // ➔ true
 */
export const toBooleanExplicit = (
  value: unknown,
  options: ToBooleanExplicitOptions = {}
): boolean => {
  if (isNil(value)) return false;

  if (!isPlainObject(options)) options = {};

  const ci = hasOwnProp(options, "caseInsensitive")
    ? options.caseInsensitive
    : false;
  const ts = hasOwnProp(options, "trimString") ? options.trimString : true;
  const incInd = hasOwnProp(options, "includeIndeterminate")
    ? options.includeIndeterminate
    : false;

  if (!isBoolean(ci) || !isBoolean(ts) || !isBoolean(incInd)) {
    throw new TypeError(
      `Parameters \`caseInsensitive\`, \`trimString\` and \`includeIndeterminate\` property of the \`options\` (second parameter) expected to be a \`boolean\` type, but received: ['caseInsensitive': \`${getPreciseType(
        ci
      )}\`, 'trimString': \`${getPreciseType(
        ts
      )}\`, 'includeIndeterminate': \`${getPreciseType(incInd)}\`].`
    );
  }

  if (isString(value)) {
    let normalized = value;
    if (ts) normalized = normalized.trim();
    if (ci) normalized = normalized.toLowerCase();

    const validTrueStrings = ["true", "on", "yes", "1"];
    if (incInd) validTrueStrings.push("indeterminate");

    return validTrueStrings.includes(normalized);
  }

  if (isNumber(value)) return value === 1;
  if (isBoolean(value)) return value;

  return false;
};
