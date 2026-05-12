import type {
  Extends,
  FixNeverArrayRecursive,
  IfNonEmptyArray,
  NullToUndefined
} from "@rzl-zone/ts-types-plus";

import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";

/** ---------------------------------
 * * ***Utility: `getRandomItem`.***
 * ---------------------------------
 * **Function to get a random element from a given array.**
 * @template T - The type of the input array.
 * @param {*} array - The input array, can be `null`, `undefined`, or an empty array.
 * @returns
 * - If `array` is a non-empty tuple, returns one of its elements.
 * - If `array` is empty, `null`, or `undefined`, returns `undefined`.
 * @example
 * getRandomItem([]);
 * // ➔ undefined
 * getRandomItem(null);
 * // ➔ undefined
 * getRandomItem(undefined);
 * // ➔ undefined
 * getRandomItem([1, 2, 3, 4]);
 * // ➔ number
 * getRandomItem(["apple", "banana", "cherry"]);
 * // ➔ string
 * getRandomItem(["apple", 123, true]);
 * // ➔ string | number | boolean
 * getRandomItem(["apple", 123, true, null]);
 * // ➔ string | number | boolean | undefined
 * getRandomItem(["apple", 123, true, undefined]);
 * // ➔ string | number | boolean | undefined
 *
 * // Tuple example:
 * const tuple = [1, "two", true] as const;
 * getRandomItem(tuple); // 1 | "two" | true
 */
export function getRandomItem(array: undefined): undefined;
export function getRandomItem(array: []): undefined;
export function getRandomItem<T extends readonly unknown[]>(
  array: T
): T extends never[][]
  ? undefined
  : number extends T["length"]
    ? NullToUndefined<FixNeverArrayRecursive<T[number]>>
    : IfNonEmptyArray<
        T,
        NullToUndefined<FixNeverArrayRecursive<T[number]>>,
        undefined
      >;
export function getRandomItem<T extends readonly unknown[] | undefined | null>(
  array: T
): T extends readonly unknown[]
  ? NullToUndefined<FixNeverArrayRecursive<T[number]>> | undefined
  : undefined;
export function getRandomItem<T>(array: T): unknown extends T
  ? unknown
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Extends<any[] | readonly any[], T> extends true
    ? Extract<T, unknown[] | readonly unknown[]>[number] | undefined
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Extends<any[], T> extends true
      ? Extract<T, unknown[] | readonly unknown[]>[number] | undefined
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Extends<readonly any[], T> extends true
        ? Extract<T, unknown[] | readonly unknown[]>[number] | undefined
        : undefined;
export function getRandomItem(array: unknown): unknown {
  if (!isNonEmptyArray(array)) return undefined;

  const randomIndex = Math.floor(Math.random() * (array.length || 0));
  return array[randomIndex];
}
