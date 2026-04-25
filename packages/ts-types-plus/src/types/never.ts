import type { If } from "./if";

/** -------------------------------------------------------
 * * ***Utility Type: `IsNever`.***
 * -------------------------------------------------------
 * ****Conditional**: returns `true` if `T` is `never`, otherwise `false`.**
 * @template T - Type to check.
 * @example
 * ```ts
 * type A = IsNever<never>; // ➔ true
 * type B = IsNever<true>;  // ➔ false
 * ```
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IfNever`.***
 * -------------------------------------------------------
 * **Conditional**: Selects one of two branches depending on whether `T` is `never`.**
 * - Defaults: `IfTrue = true`, `IfFalse = false`.
 * @template T - Type to check.
 * @template IfTrue - The branch type if `T` is `never`, (default: `true`).
 * @template IfFalse - The branch type if `T` is not `never`, (default: `false`).
 * @example
 * ```ts
 * type A = IfNever<never>;
 * // ➔ true
 * type B = IfNever<string>;
 * // ➔ false
 * type C = IfNever<never, 'valid', 'no'>;
 * // ➔ 'valid'
 * type D = IfNever<string, 'valid', 'no'>;
 * // ➔ 'no'
 * ```
 */
export type IfNever<T, IfTrue = true, IfFalse = false> = If<
  IsNever<T>,
  IfTrue,
  IfFalse
>;

/** -------------------------------------------------------
 * * ***Utility Type: `NeverifyPropertiesOptions`.***
 * -------------------------------------------------------
 * **Configuration options for the ***{@link NeverifyProperties | `NeverifyProperties`}*** type utility.**
 * @example
 * ```ts
 * type Opt1 = NeverifyPropertiesOptions;
 * // ➔ { makeOptional: boolean }
 * ```
 */
export type NeverifyPropertiesOptions = {
  /** * ***Whether to make all properties optional, defaultValue: `false`.***
   *
   * @default false
   */
  makeOptional: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `NeverifyProperties`.***
 * -------------------------------------------------------
 * **Turns all properties of an object to type `never`.**
 * - If `Options["makeOptional"]` is `true`, properties will be optional.
 * @template T - Object type to transform.
 * @template Options - Configuration options (default: `{ makeOptional: false }`).
 * @example
 * ```ts
 * type A = NeverifyProperties<{ a: string; b: string }>;
 * // ➔ { a: never; b: never }
 * type B = NeverifyProperties<{ a: string; b: string }, { makeOptional: true }>;
 * // ➔ { a?: never; b?: never }
 * ```
 */
export type NeverifyProperties<
  T extends object,
  Options extends NeverifyPropertiesOptions = { makeOptional: false }
> = {
  [K in keyof T]: never;
} extends infer Result
  ? If<Options["makeOptional"], Partial<Result>, Result>
  : never;
