import type { IsNever } from "./never";

/** -------------------------------------------------------
 * * ***Utility Type: `Primitive`.***
 * -------------------------------------------------------
 * **Represents **all primitive types in JavaScript/TypeScript**,
 * including their literal variants.**
 * - **This type matches:**
 *      - Core primitive types:
 *        - `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`.
 *      - Literal counterparts:
 *        - `"foo"`, `42`, `true`, etc.
 * - ⚠️ ***Note:***
 *      - Unlike some definitions, this does **not** include `void` or `never`,
 *        since they are TypeScript-specific keywords, not runtime primitives.
 * @example
 * ```ts
 * type A = Primitive;
 * // ➔ any strict primitive type
 * type B = "hello" extends Primitive ? true : false;
 * // ➔ true
 * type C = void extends Primitive ? true : false;
 * // ➔ false
 * ```
 */
export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

/** -------------------------------------------------------
 * * ***Utility Type: `IsPrimitive`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is a **strict primitive type** in JavaScript/TypeScript,
 * including literal variants.**
 * - **Behavior:**
 *      - ***Includes:***
 *          - `string`, `number`, `bigint`, `boolean`, `symbol`, `null`, `undefined`.
 *          - Literal types like: `"foo"`, `42`, `true`.
 *      - ***Excludes:***
 *          - `void` (absence of value).
 *          - `never` (impossible type).
 *          - `object`, `unknown`, `Date`, `arrays`, `functions`, etc.
 * @template T - The type to check
 * @example
 * ```ts
 * type A = IsPrimitive<"foo">;      // ➔ true
 * type B = IsPrimitive<null>;       // ➔ true
 * type C = IsPrimitive<number>;     // ➔ true
 * type D = IsPrimitive<undefined>;  // ➔ true
 * type E = IsPrimitive<{}>;         // ➔ false
 * type F = IsPrimitive<void>;       // ➔ false
 * type G = IsPrimitive<never>;      // ➔ false
 * type H = IsPrimitive<unknown>;    // ➔ false
 * type I = IsPrimitive<object>;     // ➔ false
 * type J = IsPrimitive<Date>;       // ➔ false
 * type K = IsPrimitive<[]>;         // ➔ false
 * type L = IsPrimitive<() => void>; // ➔ false
 * ```
 */
export type IsPrimitive<T> =
  IsNever<T> extends true ? false : T extends Primitive ? true : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IsRealPrimitive`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is a **real primitive type** in JavaScript/TypeScript,
 * based on runtime behavior, **excluding `null`** but including `undefined`.**
 * - **Behavior:**
 *      - ***Includes:***
 *          - `string`, `number`, `bigint`, `boolean`, `symbol`, `undefined`.
 *          - Literal types like: `"foo"`, `42`, `true`.
 *      - ***Excludes:***
 *          - `null`.
 *          - `never` (impossible type).
 *          - Objects, arrays, functions, `Date`, `unknown`, etc.
 * - ⚠️ ***Note:***
 *      - This aligns with runtime `typeof` checks in JS:
 *         - `typeof null === "object"`,
 *            so `null` is excluded from **“real primitives”**.
 * @template T - The type to check.
 * @example
 * ```ts
 * type A = IsRealPrimitive<42>;         // ➔ true
 * type B = IsRealPrimitive<string>;     // ➔ true
 * type C = IsRealPrimitive<boolean>;    // ➔ true
 * type D = IsRealPrimitive<undefined>;  // ➔ true
 * type E = IsRealPrimitive<{}>;         // ➔ false
 * type F = IsRealPrimitive<[]>;         // ➔ false
 * type G = IsRealPrimitive<null>;       // ➔ false
 * type H = IsRealPrimitive<Date>;       // ➔ false
 * type I = IsRealPrimitive<() => void>; // ➔ false
 * ```
 */
export type IsRealPrimitive<T> =
  T extends Exclude<Primitive, null> ? true : false;
