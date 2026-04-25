import type { If } from "./if";

/** -------------------------------------------------------
 * * ***Utility Type: `IfNot`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the second argument if the first argument is `false`, otherwise returns the third argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template Condition - The boolean condition to check.
 * @template IfTrue - The branch type if condition is `false`. (default: `true`).
 * @template IfFalse - The branch type if condition is `true`. (default: `false`).
 * @example
 * ```ts
 * type A = IfNot<false, "valid">;
 * // ➔ "valid"
 * type B = IfNot<false, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
export type IfNot<Condition, IfTrue = true, IfFalse = false> = If<
  Condition,
  IfFalse,
  IfTrue
>;
