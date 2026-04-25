type FilterByType<T extends readonly unknown[], U> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? Head extends U
    ? [Head, ...FilterByType<Tail, U>]
    : FilterByType<Tail, U>
  : [];

type GroupedKeys<T extends readonly PropertyKey[]> = [
  ...FilterByType<T, symbol>,
  ...FilterByType<T, string>,
  ...FilterByType<T, number>
];

/** -------------------------------------------------------
 * * ***Utility Type: `TupleToObject`.***
 * -------------------------------------------------------
 * **Accepts a tuple of `string`, `number`, or `symbol` and returns an object type
 * where each key **and its value** are the elements of the tuple.**
 * - **Behavior:**
 *     - Tuple elements must extend `PropertyKey` (`string | number | symbol`).
 *     - The resulting object has keys and values identical to the tuple elements.
 * @template T - The tuple of property keys.
 * @example
 * ```ts
 * // Tuple of strings
 * type T0 = TupleToObject<['foo', 'bar']>;
 * // ➔ { foo: 'foo'; bar: 'bar' }
 *
 * // Tuple of numbers
 * type T1 = TupleToObject<[1, 2, 3]>;
 * // ➔ { 1: 1; 2: 2; 3: 3 }
 *
 * // Tuple of mixed property keys
 * type T2 = TupleToObject<['a', 0, symbol]>;
 * // ➔ { [x: symbol]: symbol; 0: 0; a: 'a'; }
 * ```
 */
export type TupleToObject<T extends readonly PropertyKey[]> = {
  [K in GroupedKeys<T>[number]]: K;
};
