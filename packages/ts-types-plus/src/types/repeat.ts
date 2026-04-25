import type { Push } from "./push";

type _Repeat<
  T extends string,
  Count extends number,
  Result extends string = "",
  Iteration extends unknown[] = []
> = Iteration["length"] extends Count
  ? Result
  : _Repeat<T, Count, `${T}${Result}`, Push<Iteration, unknown>>;

/** -------------------------------------------------------
 * * ***Utility Type: `Repeat`.***
 * -------------------------------------------------------
 * **Repeats a string literal type `T` a specified number of times `Count`.**
 * - **Behavior:**
 *      - Supports a range of `[0, 999]` due to TypeScript recursion limits.
 *      - If `Count > 999`, it is automatically to `any` because error `Type instantiation is excessively deep and possibly infinite.ts(2589)`.
 * @template T - The string literal to repeat.
 * @template Count - Number of times to repeat.
 * @example
 * ```ts
 * type Case0 = Repeat<'x', 0>;  // ➔ ''
 * type Case1 = Repeat<'x', 1>;  // ➔ 'x'
 * type Case2 = Repeat<'x', 5>;  // ➔ 'xxxxx'
 * type Case3 = Repeat<'ab', 3>; // ➔ 'ababab'
 *
 * // ❌ Invalid:
 * type Case1000 = Repeat<'x', 1000>;
 * // ➔ same as any (because: TypeScript recursion limits)
 * ```
 */
export type Repeat<T extends string, Count extends number> = _Repeat<T, Count>;
