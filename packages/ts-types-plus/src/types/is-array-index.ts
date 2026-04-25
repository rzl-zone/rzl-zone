import type { And } from "./and";
import type { IsGreaterOrEqual } from "./greater-than";
import type { IsNever } from "./never";
import type { Not } from "./not";
import type { IsInteger, ParseNumber } from "./number";

/** -------------------------------------------------------
 * * ***Utility Type: `IsArrayIndex`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the passed argument is a valid array index.**
 * @example
 * ```ts
 * type Case1 = IsArrayIndex<1>;   // ➔ true
 * type Case2 = IsArrayIndex<'1'>; // ➔ true
 * type Case3 = IsArrayIndex<-1>;  // ➔ false
 * type Case4 = IsArrayIndex<"a">; // ➔ false
 * ```
 */
export type IsArrayIndex<T> = T extends number
  ? And<IsInteger<T>, IsGreaterOrEqual<T, 0>>
  : T extends string
    ? ParseNumber<T> extends infer NumT extends number
      ? Not<IsNever<NumT>> extends true
        ? And<IsInteger<NumT>, IsGreaterOrEqual<NumT, 0>>
        : false
      : false
    : never;
