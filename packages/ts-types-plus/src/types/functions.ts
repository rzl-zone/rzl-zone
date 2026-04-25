/** --------------------------------------------------
 * * ***Utility Type: `AnyFunction`.***
 * --------------------------------------------------
 * **A generic type representing **any function** with
 * any arguments and any return type.**
 * @example
 * const fn: AnyFunction = (a, b) => a + b;
 * console.log(fn(1, 2)); // ➔ 3
 *
 * const fn2: AnyFunction = (x, y, z) => x + y - z;
 * console.log(fn2(10, 20, 5)); // ➔ 25
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;
