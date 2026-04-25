import type { IsAny } from "./any";

/** -------------------------------------------------------
 * * ***Utility Type: `IsExactly`.***
 * -------------------------------------------------------
 * **A strict equality check between two types `A` and `B`
 * that does **not** collapse when one of them is `any`.**
 * - **Behavior:**
 *      - Returns `true` only if `A` and `B` are **mutually assignable**.
 *      - Returns `false` if either `A` or `B` is `any`.
 * @template A - The first type to compare.
 * @template B - The second type to compare.
 * @example
 * ```ts
 * type A = IsExactly<string, string>; // ➔ true
 * type B = IsExactly<string, any>;    // ➔ false
 * type C = IsExactly<42, number>;     // ➔ false
 * type D = IsExactly<never, never>;   // ➔ true
 * type E = IsExactly<any, any>;       // ➔ false
 * ```
 */
export type IsExactly<A, B> =
  IsAny<A> extends true
    ? false
    : IsAny<B> extends true
      ? false
      : (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
        ? (<T>() => T extends B ? 1 : 2) extends <T>() => T extends A ? 1 : 2
          ? true
          : false
        : false;
