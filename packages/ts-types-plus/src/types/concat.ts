/** -------------------------------------------------------
 * * ***Utility Type: `Concat`.***
 * -------------------------------------------------------
 * **A type-level utility that concatenates `two arrays` into `one`.**
 * @template T - The first array type.
 * @template U - The second array type, or a single element.
 * @example
 * ```ts
 * type A = Concat<[number, number], [string, string]>;
 * // ➔ [number, number, string, string]
 * type B = Concat<[], [1, 2]>;
 * // ➔ [1, 2]
 * type C = Concat<[1, 2], 3>;
 * // ➔ [1, 2, 3]
 * type D = Concat<[], 5>;
 * // ➔ [5]
 * type E = Concat<[1, 2], []>;
 * // ➔ [1, 2]
 * ```
 */
export type Concat<T extends readonly unknown[], U> = [
  ...T,
  ...(U extends readonly unknown[] ? U : [U])
];
