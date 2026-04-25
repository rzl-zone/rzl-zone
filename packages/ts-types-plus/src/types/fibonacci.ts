import type { Decrement } from "./decrement";
import type { IsLowerThan } from "./lower-than";
import type { IsNegative } from "./number";
import type { Sub } from "./sub";
import type { Sum } from "./sum";

/** -------------------------------------------------------
 * * ***Utility Type: `Fibonacci`.***
 * -------------------------------------------------------
 * **A type-level utility that computes the ***Fibonacci number*** at a given
 * index `T`.**
 * - **Behavior:**
 *      - Returns `never` for negative numbers.
 *      - Supports indices in the range `[0, 78]` due to TypeScript recursion limits.
 * @template T - The index of the Fibonacci sequence.
 * @example
 * ```ts
 * type A = Fibonacci<0>;  // ➔ 0
 * type B = Fibonacci<1>;  // ➔ 1
 * type C = Fibonacci<4>;  // ➔ 3
 * type D = Fibonacci<10>; // ➔ 55
 * type E = Fibonacci<40>; // ➔ 102334155
 * type D = Fibonacci<number>; // ➔ never
 * ```
 */
export type Fibonacci<T extends number> =
  IsNegative<T> extends true
    ? never
    : IsLowerThan<T, 2> extends true
      ? T
      : Fibonacci<Decrement<T>> extends infer NMinusOne extends number
        ? Fibonacci<Sub<T, 2>> extends infer NMinusTwo extends number
          ? Sum<NMinusOne, NMinusTwo>
          : never
        : never;
