// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NumberRangeLimit } from "./NumberRangeLimit";

/** --------------------------------------------------
 * * ***Internal Utility Type for: {@link NumberRangeUnion | `NumberRangeUnion`}.***
 * --------------------------------------------------
 * @template N - Starting/Ending number of the range (inclusive).
 * @template Acc - Internal accumulator for recursion (do not set manually).
 */
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

/** --------------------------------------------------
 * * ***Utility Type: `NumberRangeUnion`.***
 * --------------------------------------------------
 * **Generate a union type of numbers from `From` to `To` using enumeration.**
 * @description
 * Produces a **numeric union type** from `From` to `To` (inclusive),
 * using a simpler approach based on `Enumerate<N>` helper type.
 * - ✅ Straightforward & easy to reason about.
 * - ⚠️ Still limited by TypeScript recursion depth (safe up to `999`).
 * - ⚙️ Best used for **smaller ranges** (`≤ 100`) or when readability matters.
 * - ℹ️ For **larger ranges** (`≥ 101`) use {@link NumberRangeLimit | `NumberRangeLimit`} instead.
 * @template From - Starting number of the range (inclusive).
 * @template To - Ending number of the range (inclusive).
 * @example
 * ```ts
 * type RangeA = NumberRangeUnion<3, 6>;
 * // ➔ 3 | 4 | 5 | 6
 * type RangeB = NumberRangeUnion<0, 2>;
 * // ➔ 0 | 1 | 2
 * type RangeC = NumberRangeUnion<8, 8>;
 * // ➔ 8
 * type RangeD = NumberRangeUnion<20, 10>;
 * // ➔ 10
 * ```
 */
export type NumberRangeUnion<
  From extends number,
  To extends number
> = From extends To
  ? From
  : Exclude<Enumerate<To>, Enumerate<From>> extends never
    ? To
    : Exclude<Enumerate<To>, Enumerate<From>> | To;
