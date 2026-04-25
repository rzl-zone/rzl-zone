import type { And } from "./and";
import type { DigitsTuple } from "./digits-tuple";
import type { EndsWith } from "./ends-with";
import type { IsEqual } from "./equal";
import type { IfLowerThan } from "./lower-than";
import type { Mod } from "./mod";
import type { Abs, IsEven } from "./number";
import type { Stringify } from "./stringify";
import type { SumArr } from "./sum";

/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByTwo`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by two.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByTwo<4>;  // ➔ true
 * type Case2 = IsDivisibleByTwo<-6>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByTwo<3>;  // ➔ false
 * type Case4 = IsDivisibleByTwo<-5>; // ➔ false
 */
export type IsDivisibleByTwo<T extends number> = IsEven<T>;

type DivisibleByThreeMap = {
  3: true;
  6: true;
  9: true;
};

type _IsDivisibleByThree<T extends number> = DigitsTuple<
  Abs<T>
>["digits"] extends infer Digits extends readonly number[]
  ? IsEqual<Digits["length"], 1> extends true
    ? Digits[0] extends keyof DivisibleByThreeMap
      ? true
      : false
    : SumArr<Digits> extends infer DigitsSum extends number
      ? IfLowerThan<DigitsSum, 3> extends true
        ? false
        : _IsDivisibleByThree<DigitsSum>
      : never
  : never;

/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByThree`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by three.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByThree<123>;  // ➔ true
 * type Case2 = IsDivisibleByThree<-126>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByThree<124>;  // ➔ false
 * type Case4 = IsDivisibleByThree<-128>; // ➔ false
 */
export type IsDivisibleByThree<T extends number> = _IsDivisibleByThree<T>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByFive`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by five.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByFive<125>;  // ➔ true
 * type Case2 = IsDivisibleByFive<-115>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByFive<13>;  // ➔ false
 * type Case4 = IsDivisibleByFive<-17>; // ➔ false
 */
export type IsDivisibleByFive<T extends number> = EndsWith<
  Stringify<T>,
  "0" | "5"
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleBySix`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by six.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleBySix<126>;  // ➔ true
 * type Case2 = IsDivisibleBySix<-156>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleBySix<124>;  // ➔ false
 * type Case4 = IsDivisibleBySix<-139>; // ➔ false
 */
export type IsDivisibleBySix<T extends number> = And<
  IsDivisibleByTwo<T>,
  IsDivisibleByThree<T>
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByTen`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by ten.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByTen<100>; // ➔ true
 * type Case2 = IsDivisibleByTen<-80>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByTen<101>; // ➔ false
 * type Case4 = IsDivisibleByTen<-72>; // ➔ false
 */
export type IsDivisibleByTen<T extends number> = EndsWith<Stringify<T>, "0">;

/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisibleByHundred`.***
 * -------------------------------------------------------
 * **Accepts an integer argument and returns a boolean whether it is divisible by hundred.**
 *  - Range: `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 * @example
 * // truthy
 * type Case1 = IsDivisibleByHundred<100>;  // ➔ true
 * type Case2 = IsDivisibleByHundred<-300>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisibleByHundred<101>;  // ➔ false
 * type Case4 = IsDivisibleByHundred<-210>; // ➔ false
 */
export type IsDivisibleByHundred<T extends number> = EndsWith<
  Stringify<T>,
  "00"
>;

/** -------------------------------------------------------
 * * ***Utility Type: `IsDivisible`.***
 * -------------------------------------------------------
 * **Returns a boolean whether the first integer argument is divisible by the
 * second integer argument.**
 * @example
 * // truthy
 * type Case1 = IsDivisible<1024, 2>; // ➔ true
 * type Case2 = IsDivisible<2034, 3>; // ➔ true
 *
 * // falsy
 * type Case3 = IsDivisible<1023, 2>; // ➔ false
 * type Case4 = IsDivisible<3034, 3>; // ➔ false
 */
export type IsDivisible<
  Dividend extends number,
  Divisor extends number
> = IsEqual<Mod<Dividend, Divisor>, 0>;
