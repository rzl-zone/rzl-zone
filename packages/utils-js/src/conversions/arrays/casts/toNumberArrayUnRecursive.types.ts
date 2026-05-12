import type { KeepNull, KeepUndef, Nullish } from "@rzl-zone/ts-types-plus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { toNumberArrayUnRecursive } from "./toNumberArrayUnRecursive";

// ============================================================
// Helper types for inferring the return type of toNumberArrayUnRecursive
// ============================================================

export type NormalizeInputToNumberArrayUnRecursive<T> = T extends
  | string
  | bigint
  | boolean
  | number
  | Nullish
  ? T
  : HasNonNumberLikeNonNullish<T>;

/** Detects whether `T` contains any number-like type (`string | number | bigint`).
 *
 * @template T Input type.
 * @returns `true` if `T` contains number-like, otherwise `false`.
 */
type HasNumberLike<T> = [Extract<T, string | bigint | number>] extends [never]
  ? false
  : true;

/** Detects whether `T` contains a string type.
 *
 * - Useful for identifying values that may fail parsing to number (`undefined` when `R=false`).
 *
 * @template T Input type.
 * @returns `true` if `T` contains `string`, otherwise `false`.
 */
type HasString<T> = [Extract<T, string>] extends [never] ? false : true;

/** Detects whether `T` contains non-number-like, non-nullish values (`objects`, `arrays`, `symbols`, `functions`, `etc`.).
 *
 * @template T Input type.
 * @returns `true` if such types exist, otherwise `false`.
 */
type HasNonNumberLikeNonNullish<T> = [
  Exclude<T, string | bigint | number | Nullish>
] extends [never]
  ? false
  : true;

// ============================================================
// Return type calculator
// ============================================================

/** -------------------------------------------------------
 * * ***Computes the return type of {@link toNumberArrayUnRecursive|`toNumberArrayUnRecursive`}
 *   based on input type `T` and option `R`.***
 * -------------------------------------------------------
 *
 * **Behavior:**
 * - If `R = true` (`removeInvalidValueNumber: true`):
 *    - If `T` is only `null | undefined` ➔ returns `[]`.
 *    - If `T` contains number-like (`string | number | bigint`) ➔ returns `number[]`.
 *    - Otherwise ➔ returns `[]`.
 * - If `R = false` (`removeInvalidValueNumber: false`):
 *    - Preserves `null[]` or `undefined[]` if input is purely nullish.
 *    - Otherwise returns an array of:
 *      - `number` if `T` includes number-like.
 *      - `undefined` if parsing fails (string or invalid non-number-like).
 *      - Original `null` / `undefined` from input.
 * @template T Input element type.
 * @template R Flag indicating whether invalid values should be removed (`true`) or kept (`false`).
 *
 */
export type ToNumberArrayUnRecursiveReturn<
  T,
  R extends boolean
> = R extends true
  ? // ✅ Special case: when R=true and T is only nullish ➔ empty []
    [Exclude<T, null | undefined>] extends [never]
    ? []
    : HasNumberLike<T> extends true
      ? number[]
      : []
  : // ✅ R=false ➔ preserve null[] / undefined[]
    [Exclude<T, null>] extends [never]
    ? null[]
    : [Exclude<T, undefined>] extends [never]
      ? undefined[]
      : Array<
          // include number if T has number-like
          | (HasNumberLike<T> extends true ? number : never)
          // include undefined for failed parsing
          | (HasString<T> extends true ? undefined : never)
          | (HasNonNumberLikeNonNullish<T> extends true ? undefined : never)
          // preserve null and undefined from original T
          | KeepNull<T>
          | KeepUndef<T>
        >;

/** -------------------------------------------------------
 * * ***Options for {@link toNumberArrayUnRecursive|`toNumberArrayUnRecursive`}.***
 * -------------------------------------------------------
 *
 * @template T Flag indicating whether invalid values should be removed.
 */
export type ToNumberArrayUnRecursiveOptions<T extends boolean> = {
  /** If true, removes invalid number values (`NaN`, non-numeric strings, `null`, `undefined`) from the result, defaultValue: `true`.
   *
   * @default true
   */
  removeInvalidValueNumber?: T;
};
