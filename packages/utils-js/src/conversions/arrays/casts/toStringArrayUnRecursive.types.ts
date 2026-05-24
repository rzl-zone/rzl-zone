import type { KeepNull, KeepUndef, Nullish } from "@rzl-zone/ts-types-plus";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { toStringArrayUnRecursive } from "./toStringArrayUnRecursive";

// ===================================================================================
// Helper types for inferring the return type of toNumberArrayUnRecursive
// ===================================================================================

/**
 * * ***Union of primitive types that can be safely converted to string.***
 */
type AllowedToString = string | number | boolean | bigint;

/** ---------------------------------------------------------
 * * ***Checks whether `T` contains any type that is allowed for conversion to string.***
 * ----------------------------------------------------------
 *
 * - Returns `true` if `T` contains `string`, `number`, `boolean`, or `bigint`.
 * - Otherwise returns `false`.
 *
 * @template T Input type to check.
 */
type HasAllowed<T> = [Extract<T, AllowedToString>] extends [never]
  ? false
  : true;

/** ---------------------------------------------------------
 * * ***Checks whether `T` contains any non-nullish value that is disallowed for conversion.***
 * ----------------------------------------------------------
 *
 * - Disallowed non-nullish types include `objects`, `arrays`, `symbols`, `functions`, `etc`.
 * - Returns `true` if such types exist, otherwise `false`.
 * @template T Input type to check.
 */
type HasDisallowedNonNullish<T> = [
  Exclude<T, AllowedToString | Nullish>
] extends [never]
  ? false
  : true;

// ===================================================================================
// Return type calculator
// ===================================================================================

/** ----------------------------------------------------------------------------------
 * * ***Computes the return type
 *   of {@link toStringArrayUnRecursive|`toStringArrayUnRecursive`}
 *   based on input type `T` and option `R`.***
 * -----------------------------------------------------------------------------------
 *
 * -  **Behavior:**
 *        - If `R = true` (`removeInvalidValue = true`):
 *          - If `T` contains any allowed values ➔ `string[]`.
 *          - If `T` contains only nullish or disallowed types ➔ `[]`.
 *
 *        - If `R = false` (`removeInvalidValue = false`):
 *          - Include `string` if `T` has allowed values.
 *          - Include `undefined` if `T` has disallowed non-nullish values.
 *          - Preserve `null` and `undefined` from original `T`.
 *
 * ---
 * @template T Input element type.
 * @template R Flag indicating whether invalid values should be removed (`true`) or
 *             kept (`false`).
 */
export type ToStringArrayUnRecursiveReturn<
  T,
  R extends boolean
> = R extends true
  ? // removeInvalidValue = true:
    // - If T has any allowed values ➔ string[]
    // - If T is only null/undefined or only disallowed types ➔ []
    HasAllowed<T> extends true
    ? string[]
    : []
  : // removeInvalidValue = false:
    // - Include `string` only if T has allowed values
    // - Include `undefined` if T contains any disallowed non-nullish (they map to undefined)
    // - Preserve null/undefined if T includes them
    Array<
      | (HasAllowed<T> extends true ? string : never)
      | (HasDisallowedNonNullish<T> extends true ? undefined : never)
      | KeepNull<T>
      | KeepUndef<T>
    >;

/** ----------------------------------------------------------------------------------
 * * ***Options for {@link toStringArrayUnRecursive|`toStringArrayUnRecursive`}.***
 * -----------------------------------------------------------------------------------
 *
 * @template T Flag indicating whether invalid values should be removed.
 */
export type ToStringArrayUnRecursiveOptions<T extends boolean> = {
  /** ---------------------------------------------------------
   * * ***If true, removes invalid values (`null` and `undefined`) from
   * the output, defaultValue: `true`.***
   * ----------------------------------------------------------
   *
   * @default true
   */
  removeInvalidValue?: T;
};
