/** -------------------------------------------------------
 * * ***Utility Type: `If`.***
 * -------------------------------------------------------
 * - **Conditional:**
 *      - Returns the second argument if the first argument is `true`, otherwise
 *        returns the third argument.
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template Condition - The boolean condition to check.
 * @template IfTrue - The branch type if condition is `true`. (default: `true`).
 * @template IfFalse - The branch type if condition is `false`. (default: `false`).
 * @example
 * ```ts
 * type A = If<true, "valid">;
 * // ➔ "valid"
 * type B = If<false, "valid", "invalid">;
 * // ➔ "invalid"
 * ```
 */
export type If<
  Condition,
  IfTrue = true,
  IfFalse = false
> = Condition extends true ? IfTrue : IfFalse;
