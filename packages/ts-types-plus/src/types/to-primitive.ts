/** -------------------------------------------------------
 * * ***Utility Type: `ToPrimitive`.***
 * -------------------------------------------------------
 * **Converts a literal type to its corresponding primitive type.**
 * - **Behavior:**
 *      - `string literal` ➔ `string`.
 *      - `number literal` ➔ `number`.
 *      - `boolean literal` ➔ `boolean`.
 *      - `bigint literal` ➔ `bigint`.
 *      - `symbol literal` ➔ `symbol`.
 *      - `null` ➔ `null`.
 *      - `undefined` ➔ `undefined`.
 *      - Objects ➔ recursively converts all properties to their primitive types.
 * @template T - The literal type to convert to a primitive type.
 * @example
 * ```ts
 * // Number literal
 * type Case1 = ToPrimitive<1>;
 * // ➔ number
 *
 * // String literal
 * type Case2 = ToPrimitive<'1'>;
 * // ➔ string
 *
 * // Boolean literal
 * type Case3 = ToPrimitive<true>;
 * // ➔ boolean
 *
 * // BigInt literal
 * type Case4 = ToPrimitive<123n>;
 * // ➔ bigint
 *
 * // Symbol literal
 * type Case5 = ToPrimitive<symbol>;
 * // ➔ symbol
 *
 * // Null and undefined
 * type Case6 = ToPrimitive<null>;
 * // ➔ null
 * type Case7 = ToPrimitive<undefined>;
 * // ➔ undefined
 *
 * // Object with literal properties
 * type Case8 = ToPrimitive<{ a: 1; b: 's'; c: true }>;
 * // ➔ { a: number; b: string; c: boolean }
 * ```
 */
export type ToPrimitive<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends null
      ? null
      : T extends undefined
        ? undefined
        : T extends boolean
          ? boolean
          : T extends bigint
            ? bigint
            : T extends symbol
              ? symbol
              : {
                  [K in keyof T]: ToPrimitive<T[K]>;
                };
