/** -------------------------------------------------------
 * * ***Utility Type: `Stringify`.***
 * -------------------------------------------------------
 * **Converts a value of type `number`, `boolean`, `string`, `bigint`, `undefined`, or `null` into a string literal type.**
 * - **Behavior:**
 *      - `number` ➔ string representation (e.g., `123` ➔ `"123"`)
 *      - `boolean` ➔ `"true"` or `"false"`
 *      - `string` ➔ itself
 *      - `bigint` ➔ string representation with `"n"` suffix (e.g., `123n` ➔ `"123n"`)
 *      - `undefined` ➔ `"undefined"`
 *      - `null` ➔ `"null"`
 *      - Other types ➔ `never`
 * @template T - The value type to stringify.
 * @example
 * ```ts
 * // Boolean
 * type Result1 = Stringify<true>;
 * // ➔ "true"
 *
 * // Number
 * type Result2 = Stringify<123>;
 * // ➔ "123"
 *
 * // BigInt
 * type Result3 = Stringify<123n>;
 * // ➔ "123n"
 *
 * // String
 * type Result4 = Stringify<"hello">;
 * // ➔ "hello"
 *
 * // Undefined
 * type Result5 = Stringify<undefined>;
 * // ➔ "undefined"
 *
 * // Null
 * type Result6 = Stringify<null>;
 * // ➔ "null"
 *
 * // Other type
 * type Result7 = Stringify<{}>;
 * // ➔ never
 * ```
 */
export type Stringify<T> = T extends
  | number
  | boolean
  | string
  | bigint
  | undefined
  | null
  ? T extends bigint
    ? `${T}n`
    : `${T}`
  : never;
