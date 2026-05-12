import type { AnyFunction } from "@rzl-zone/ts-types-plus";

/** ----------------------------------------------------------
 * * ***Type guard: `isFunction`.***
 * -----------------------------------------------------------
 * **Checks if a value is a function.**
 * - **Behavior:**
 *    - Uses `typeof value === "function"` for strict type checking.
 *    - Safe alternative to `Function` type (doesn't trigger ESLint warning).
 *    - Supports TypeScript type narrowing with `value is (...args: any[]) => any`.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if the value is a function.
 * @example
 * isFunction(() => {});
 * // ➔ true
 * isFunction(async () => {});
 * // ➔ true
 * isFunction(null);
 * // ➔ false
 * isFunction({});
 * // ➔ false
 */
export const isFunction = (value: unknown): value is AnyFunction => {
  return typeof value === "function";
};
