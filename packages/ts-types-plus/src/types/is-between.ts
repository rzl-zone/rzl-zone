import type { And } from "./and";
import type { IsEqual } from "./equal";
import type { IsGreaterThan } from "./greater-than";
import type { IsLowerThan } from "./lower-than";

/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link IsBetween | `IsBetween`}.***
 * ---------------------------------------------------------------------------
 * **Options to configure whether the borders of the interval are included
 * when using {@link IsBetween | **`IsBetween`**}.**
 */
export type IsBetweenOptions = {
  /** * ***Whether to include the lower border (`Min`) in the comparison.***
   *
   * - `true` ➔ include `Min` (**default**).
   * - `false` ➔ exclude `Min`.
   *
   * @default true
   */
  minIncluded?: boolean;

  /** * ***Whether to include the upper border (`Max`) in the comparison.***
   *
   * - `true` ➔ include `Max` (**default**).
   * - `false` ➔ exclude `Max`.
   *
   * @default true
   */
  maxIncluded?: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `IsBetween`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the first integer argument is between the second and the third integer argument, by default, borders of the interval are included, which can be modified by the second argument.**
 * - **Behavior:**
 *      - `minIncluded`, `maxIncluded` options show whether to include the lower and the higher borders
 *         respectively.
 *      - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * type Case1 = IsBetween<1, 1, 10>;
 * // ➔ true
 * type Case2 = IsBetween<1, 1, 10, {minIncluded: false}>;
 * // ➔ false
 * type Case3 = IsBetween<10, 1, 10, {maxIncluded: false}>;
 * // ➔ false
 */
export type IsBetween<
  Num extends number,
  Min extends number,
  Max extends number,
  Options extends IsBetweenOptions = {
    minIncluded: true;
    maxIncluded: true;
  }
> =
  IsEqual<Num, Min> extends true
    ? Options["minIncluded"]
    : IsEqual<Num, Max> extends true
      ? Options["maxIncluded"]
      : And<IsGreaterThan<Num, Min>, IsLowerThan<Num, Max>>;
