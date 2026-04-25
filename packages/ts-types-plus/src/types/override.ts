import type { OmitStrict } from "./omit";

import type {
  PrettifyOptions as PrettifyOpts,
  DefaultPrettifyOptions,
  Prettify
} from "./prettify";

/** ----------------------------------------------------------------
 * * ***Options for {@link OverrideTypes | `OverrideTypes`}.***
 * ----------------------------------------------------------------
 * Configuration options controlling how overriding behaves.
 */
export type OverrideTypesOptions = {
  /** * ***Whether overriding keys must exist in the base type `T`.***
   *
   * - If `true`, all keys of `U` must exist in `T`.
   * - If `false`, additional keys from `U` are allowed and will be added
   *   to the resulting type.
   *
   * @default true
   */
  strictKeys: boolean;

  /** * ***Options forwarded to {@link Prettify | `Prettify`}.***
   *
   * Controls how the resulting type is normalized.
   */
  prettifyOptions?: PrettifyOpts;
};

type StrictOverrideConstraint<
  T,
  U,
  Strict extends boolean
> = Strict extends true
  ? { [K in keyof U]: K extends keyof T ? unknown : never }
  : unknown;

type ResolvePrettifyOptions<O extends OverrideTypesOptions> =
  O["prettifyOptions"] extends PrettifyOpts
    ? O["prettifyOptions"]
    : DefaultPrettifyOptions;

/** --------------------------------------------------
 * * ***Utility Type: `OverrideTypes`.***
 * --------------------------------------------------
 * Overrides properties in type `T` using properties from type `U`.
 *
 * Keys that exist in both `T` and `U` will take the value type from `U`,
 * while all other properties from `T` remain unchanged.
 *
 * The behavior can be configured using {@link OverrideTypesOptions}.
 *
 * @template T - The base object type whose properties will be overridden.
 * @template U - The object type providing overriding property types.
 * @template Options - Configuration controlling override behavior.
 *
 * @remarks
 * - When `Options["strictKeys"]` is `true` (default), all keys in `U`
 *   **must already exist in `T`**.
 * - When `strictKeys` is `false`, `U` may introduce **additional keys**
 *   which will be added to the resulting type.
 * - The resulting type is normalized using {@link Prettify}.
 *
 * @example
 * // Basic override
 * type A = { a: number; b: string };
 * type B = { b: boolean };
 * type C = OverrideTypes<A, B>;
 * // Result:
 * // {
 * //   a: number;
 * //   b: boolean;
 * // }
 *
 * @example
 * // Strict key enforcement (default)
 * type A = { a: number; b: string };
 * type B = { x: string[]; b: boolean };
 * // @ts-expect-error
 * type C = OverrideTypes<A, B>;
 * // Error: "x" is not assignable to keyof A
 *
 * @example
 * // Allow additional keys
 * type A = { a: number; b: string };
 * type B = { x: string[]; b: boolean };
 * type C = OverrideTypes<A, B, { strictKeys: false }>;
 * // Result:
 * // {
 * //   a: number;
 * //   b: boolean;
 * //   x: string[];
 * // }
 *
 * @example
 * // Custom Prettify options
 * type A = { a: number; b: string };
 * type B = { b: boolean };
 * type C = OverrideTypes<
 *   A,
 *   B,
 *   {
 *     strictKeys: true;
 *     prettifyOptions: { skipPrettify: true };
 *   }
 * >;
 */
export type OverrideTypes<
  T,
  U extends StrictOverrideConstraint<T, U, Options["strictKeys"]>,
  Options extends OverrideTypesOptions = {
    strictKeys: true;
    prettifyOptions: DefaultPrettifyOptions;
  }
> = Options["strictKeys"] extends true
  ? Exclude<keyof U, keyof T> extends never
    ? Prettify<
        OmitStrict<
          T,
          Extract<keyof U, keyof T>,
          ResolvePrettifyOptions<Options>
        > &
          U,
        ResolvePrettifyOptions<Options>
      >
    : never
  : Prettify<
      OmitStrict<
        T,
        Extract<keyof U, keyof T>,
        ResolvePrettifyOptions<Options>
      > & {
        [K in keyof U]: U[K];
      },
      ResolvePrettifyOptions<Options>
    >;
