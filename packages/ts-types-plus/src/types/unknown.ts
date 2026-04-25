import type { IsAny } from "./any";
import type { If } from "./if";

/** -------------------------------------------------------
 * * ***Utility Type: `IsUnknown`.***
 * -------------------------------------------------------
 * **Returns a boolean indicating whether the given type `T` is `unknown`.**
 * @template T - The type to check.
 * @example
 * ```ts
 * type TrueResult = IsUnknown<unknown>;  // ➔ true
 * type FalseResult1 = IsUnknown<any>;    // ➔ false
 * type FalseResult2 = IsUnknown<string>; // ➔ false
 * ```
 */
export type IsUnknown<T> =
  IsAny<T> extends true ? false : [unknown] extends [T] ? true : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IfUnknown`.***
 * -------------------------------------------------------
 * - **Conditional type:**
 *      - Returns `IfTrue` if `T` is `unknown`, otherwise returns `IfFalse`.
 * @template T - The type to check.
 * @template IfTrue - The type returned if `T` is `unknown` (default: `true`).
 * @template IfFalse - The type returned if `T` is not `unknown` (default: `false`).
 * @example
 * ```ts
 * type Result1 = IfUnknown<unknown, "foo", "bar">; // ➔ "foo"
 * type Result2 = IfUnknown<string, "foo", "bar">;  // ➔ "bar"
 * ```
 */
export type IfUnknown<T, IfTrue = true, IfFalse = false> = If<
  IsUnknown<T>,
  IfTrue,
  IfFalse
>;

/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link UnknownifyProperties | `UnknownifyProperties`}.***
 * ---------------------------------------------------------------------------
 * @property makeOptional - If `true`, all properties become optional.
 */
export type UnknownifyPropertiesOptions = {
  /**
   * If `true`, all properties of the object become optional.
   *
   * DefaultValue: `false`.
   *
   * @default false
   * @example
   * ```ts
   * type A = { a: string; b: number };
   * type B = UnknownifyProperties<A, { makeOptional: true }>;
   * // ➔ { a?: unknown; b?: unknown }
   * ```
   */
  makeOptional: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `UnknownifyProperties`.***
 * -------------------------------------------------------
 * **Transforms all properties of an object type `T` to `unknown`.**
 * @description Optionally, makes all properties optional based on `Options`.
 * @template T - The object type to transform.
 * @template Options - Configuration options (default: `{ makeOptional: false }`).
 *
 * @example
 * ```ts
 * type A = { a: string; b: number };
 * type Result1 = UnknownifyProperties<A>;
 * // ➔ { a: unknown; b: unknown }
 * type Result2 = UnknownifyProperties<A, { makeOptional: true }>;
 * // ➔ { a?: unknown; b?: unknown }
 * ```
 */
export type UnknownifyProperties<
  T extends object,
  Options extends UnknownifyPropertiesOptions = { makeOptional: false }
> = {
  [K in keyof T]: unknown;
} extends infer Result
  ? If<Options["makeOptional"], Partial<Result>, Result>
  : never;
