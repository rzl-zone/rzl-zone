// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { isFinite } from "./isFinite";

import { createMessage } from "@/_private/logger";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";

import { isBoolean } from "./isBoolean";
import { isPlainObject } from "./isPlainObject";

export type IsNumberOptions = {
  /** ---------------------------------------------------------
   * * ***If set to `true`, `NaN` will be considered a valid number, defaultValue: `false`.***
   * ----------------------------------------------------------
   *
   * @default false
   */
  includeNaN?: boolean;
};

/** ---------------------------------------------------------
 * * ***Type guard: `isNumber`.***
 * ----------------------------------------------------------
 * **Checks if a value is of type **`number`**.**
 *
 * ---
 * - #### *Behavior:*
 *      - Uses `typeof value === "number"`.
 *      - By default, excludes **`NaN`**.
 *      - If `options.includeNaN` is `true`, then **`NaN`** is also considered valid.
 *      - Still considers `Infinity` and `-Infinity` as **numbers** (consistent with JavaScript).
 *
 * ---
 * - #### *Note:*
 *      - To exclude `Infinity` and `-Infinity`, use **{@link isFinite | `isFinite`}** instead.
 *
 * ---
 * @param {*} value - The value to check.
 * @param {IsNumberOptions} [options] - Optional settings.
 * @param {boolean} [options.includeNaN=false]  If `true`, `NaN` will be considered a valid number, defaults to `false`, which excludes `NaN`.
 *
 * ---
 * @returns {boolean} Returns `true` if the value is a number (and depending on `includeNaN`, `NaN` is included or excluded).
 *
 * ---
 * @example
 * isNumber(42);
 * // ➔ true
 * isNumber(Infinity);
 * // ➔ true
 * isNumber(-Infinity);
 * // ➔ true
 * isNumber(NaN);
 * // ➔ false (default)
 * isNumber(NaN, { includeNaN: true });
 * // ➔ true
 * isNumber("42");
 * // ➔ false
 */
export const isNumber = (
  value: unknown,
  options: IsNumberOptions = {}
): value is number => {
  if (!isPlainObject(options)) options = {};

  const includeNaN =
    isPlainObject(options) && isBoolean(options.includeNaN)
      ? options.includeNaN
      : false;

  assertIsBoolean(includeNaN, {
    message: ({ currentType, validType }) =>
      errorMsg(
        `Parameter \`includeNaN\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      )
  });

  const aNumber = typeof value === "number";
  return includeNaN ? aNumber : aNumber && !Number.isNaN(value);
};

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("isNumber", msg);
