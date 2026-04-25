import type { Sum } from "../sum";
import type { IsGreaterThan } from "../greater-than";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NumberRangeUnion } from "./NumberRangeUnion";

/** --------------------------------------------------
 * * ***Internal Utility Type for: {@link NumberRangeLimit | `NumberRangeLimit`}.***
 * --------------------------------------------------
 * @template From - Starting number of the range (inclusive).
 * @template To - Ending number of the range (inclusive).
 * @template Result - Internal accumulator for recursion (do not set manually).
 */
type _NumberRangeLimit<
  From extends number,
  To extends number,
  Result extends number[] = [From]
> =
  IsGreaterThan<From, To> extends true
    ? [...Result, To][number] extends infer R extends number
      ? R extends R
        ? IsGreaterThan<R, To> extends true
          ? never
          : R
        : never
      : never
    : _NumberRangeLimit<
        Sum<From, 7>,
        To,
        [
          ...Result,
          From,
          Sum<From, 1>,
          Sum<From, 2>,
          Sum<From, 3>,
          Sum<From, 4>,
          Sum<From, 5>,
          Sum<From, 6>
        ]
      >;

/** --------------------------------------------------
 * * ***Utility Type: `NumberRangeLimit`.***
 * --------------------------------------------------
 * **Generate a union type of numbers within a specified range (optimized recursive batching).**
 * @description
 * Produces a **numeric union type** from `From` to `To` (inclusive),
 * using ***batched recursive expansion*** (**adds up to `7` numbers at a time**).
 *
 * This batching allows generating **larger ranges** (`≥ 101`) efficiently without
 * hitting TypeScript’s recursion limits too quickly.
 * - ✅ Optimized for **performance** (fewer recursive steps).
 * - ⚠️ Supports up to `To = 999` safely.
 * - ⚙️ Best used for **larger ranges** (`≥ 101`) or when you need **arbitrary ranges** within `0–999`.
 * - ℹ️ For **smaller ranges** (`≤ 100`) or when readability matters use {@link NumberRangeUnion | **`NumberRangeUnion`**} instead.
 * @template From - Starting number of the range (inclusive).
 * @template To - Ending number of the range (inclusive).
 * @example
 * ```ts
 * type RangeA = NumberRangeLimit<5, 8>;
 * // ➔ 5 | 6 | 7 | 8
 * type RangeB = NumberRangeLimit<10, 15>;
 * // ➔ 10 | 11 | 12 | 13 | 14 | 15
 * type RangeC = NumberRangeLimit<8, 8>;
 * // ➔ 8
 * type RangeD = NumberRangeLimit<20, 10>;
 * // ➔ 10
 * ```
 */
export type NumberRangeLimit<
  From extends number,
  To extends number
> = _NumberRangeLimit<From, To>;
