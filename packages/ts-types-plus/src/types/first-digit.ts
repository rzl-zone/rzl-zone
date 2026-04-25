import type { DigitsTuple } from "./digits-tuple";
import type { Negate } from "./number";

/** -------------------------------------------------------
 * * ***Utility Type: `FirstDigit`.***
 * -------------------------------------------------------
 * **Extracts the **first digit** of a given number `T`.**
 * - **Behavior:**
 *      - Works with integers and decimals.
 *      - Handles negative numbers (`-123` ➔ `-1`).
 *      - Handles `0` and `-0` correctly (always returns `0`).
 *      - Works with bigint literals too.
 * @template T - A number or bigint to extract the first digit from.
 * @template Options - Optional settings.
 * - `alwaysPositive?: boolean` (default: `false`)
 *   If `true`, the result is always positive regardless of the sign.
 * @example
 * ```ts
 * type A = FirstDigit<0>;      // ➔ 0
 * type B = FirstDigit<-0>;     // ➔ 0
 * type C = FirstDigit<123>;    // ➔ 1
 * type D = FirstDigit<-123>;   // ➔ -1
 * type E = FirstDigit<0.123>;  // ➔ 0
 * type F = FirstDigit<-0.123>; // ➔ 0
 * type G = FirstDigit<98765>;  // ➔ 9
 * type H = FirstDigit<-98765>; // ➔ -9
 * type I = FirstDigit<-98765, {alwaysPositive:true}>; // ➔ 9
 * ```
 */
export type FirstDigit<
  T extends number | bigint,
  Options extends {
    /**
     * If `true`, the result is always positive regardless of the sign, defaultValue: `false`.
     * @example
     * type I = FirstDigit<-98765, {alwaysPositive:true}>;
     * // ➔ 9
     *
     * @default false
     */
    alwaysPositive?: boolean;
  } = { alwaysPositive: false }
> = DigitsTuple<T>["digits"] extends readonly [
  infer First extends number,
  ...unknown[]
]
  ? Options["alwaysPositive"] extends true
    ? First
    : DigitsTuple<T>["negative"] extends true
      ? Negate<First>
      : First
  : never;
