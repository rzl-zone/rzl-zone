import type {
  AnyFunction,
  Prettify,
  NumberRangeUnion,
  Trim,
  CharAt,
  IsStringLiteral,
  Extends,
  ParseNumber,
  IsPositive,
  IsEmptyString,
  AnyString
} from "@rzl-zone/ts-types-plus";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { hasOwnProp } from "./hasOwnProp";

// ------------------- HELPER TYPES -------------------

/** Restrict array indices to a fixed numeric range (1–25). */
type ArrayIndex = NumberRangeUnion<1, 25>;

/** Remove `undefined` from a type. */
type NonUndef<T> = T extends undefined ? never : T;

/** Remove `null` from a type. */
type NonNull<T> = T extends null ? never : T;

/** Convert optional boolean for "discard undefined" to actual boolean. */
type EffectiveDiscardUndefined<O extends boolean | undefined> =
  O extends boolean ? O : true;

/** Convert optional boolean for "discard null" to actual boolean. */
type EffectiveDiscardNull<O extends boolean | undefined> = O extends boolean
  ? O
  : false;

/** Unwrap array type. */
type UnwrapArray<T> = T extends (infer U)[]
  ? U
  : T extends readonly (infer U)[]
    ? U
    : T;

/** Force symbol key to be deep required. */
type IsOptionalKey<T, K extends keyof T> =
  Record<never, never> extends Pick<T, K> ? true : false;

// ------------------- NESTED KEYS OF OBJECT -------------------

/** * ***Returns numeric keys of an object.***
 *
 * @private ***types for {@link hasOwnProp}.***
 */
export type NumericKeyOfHasOwnProp<Obj> = Extract<keyof Obj, number>;

/** * ***Generate all nested keys of an object or array in dot/bracket notation.***
 *
 * @private ***types for {@link hasOwnProp}.***
 *
 * Example:
 * ```ts
 * type Keys = NestedKeyOfHasOwnProp<{ users: { name: string }[] }>
 * // Keys = "users" | "users.[number]" | "users.[number].name"
 * ```
 */
export type NestedKeyOfHasOwnProp<T> = T extends readonly (infer U)[]
  ? `[${number}]` | `[${number}].${NestedKeyOfHasOwnProp<U>}`
  : T extends object
    ? {
        [K in keyof T & (string | number)]: K extends string | number
          ? NonNullable<T[K]> extends readonly unknown[]
            ?
                | `${K}`
                | `${K}.[${ArrayIndex}]`
                | `${K}.[${ArrayIndex}].${NestedKeyOfHasOwnProp<UnwrapArray<T[K]>>}`
            : NonNullable<T[K]> extends object
              ? `${K}` | `${K}.${NestedKeyOfHasOwnProp<NonNullable<T[K]>>}`
              : `${K}`
          : never;
      }[keyof T & (string | number)]
    : never;

// ------------------- PARSE / NARROW PATH TYPES -------------------

/** Apply discard rules to the last key of a path.
 *
 * Rules:
 * - If discardUndefined=true -> remove `undefined` from value
 * - If discardNull=true -> remove `null` from value
 *
 * Order: first strip undefined (if requested), then strip null (if requested)
 */
type ApplyLastRulesHasOwnProp<
  V,
  DiscardU extends boolean,
  DiscardN extends boolean
> = DiscardU extends true
  ? DiscardN extends true
    ? NonNull<NonUndef<V>>
    : NonUndef<V>
  : DiscardN extends true
    ? NonNull<V>
    : V | Extract<V, undefined>; // <- keep undefined if not discarded

/** Force an array index N to type U. */
type RefineArrayAtIndex<
  T extends readonly unknown[],
  N extends number,
  U
> = T & {
  [K in N]: U;
};

/** Narrow object/array type based on a path string.
 *
 * @template T - object type to narrow
 * @template P - path string like "user.addresses.[2].zip"
 * @template DU - discard undefined
 * @template DN - discard null
 */
type NarrowByPathHasOwnProp<
  T,
  P extends string,
  DU extends boolean = true,
  DN extends boolean = false
> = P extends `${infer Head}.${infer Rest}`
  ? Head extends `[${infer N extends number}]`
    ? T extends readonly (infer U)[]
      ? RefineArrayAtIndex<T, N, NarrowByPathHasOwnProp<U, Rest, DU, DN>>
      : T
    : Head extends keyof T
      ? Rest extends `[${infer M extends number}]${infer R}`
        ? M extends R
          ? {
              [K in keyof T]-?: NarrowByPathHasOwnProp<
                EffectiveDiscardUndefined<DU> extends true
                  ? NonUndef<T[K]>
                  : EffectiveDiscardNull<DN> extends true
                    ? NonNull<T[K]>
                    : T[K],
                Rest,
                DU,
                DN
              >;
            } // ✅ delete optional parent cause index match
          : EffectiveDiscardUndefined<DU> extends true
            ? {
                [K in keyof T]-?: K extends Head
                  ? Exclude<
                      NarrowByPathHasOwnProp<
                        EffectiveDiscardNull<DN> extends true
                          ? Exclude<T[K], null>
                          : EffectiveDiscardUndefined<DU> extends true
                            ? Exclude<T[K], undefined>
                            : T[K],
                        Rest,
                        DU,
                        DN
                      >,
                      undefined
                    >
                  : EffectiveDiscardNull<DN> extends true
                    ? Exclude<T[K], null>
                    : EffectiveDiscardUndefined<DU> extends true
                      ? Exclude<T[K], undefined>
                      : T[K];
              }
            : {
                [K in keyof T]: K extends Head
                  ? NarrowByPathHasOwnProp<
                      EffectiveDiscardNull<DN> extends true
                        ? Exclude<T[K], null>
                        : EffectiveDiscardUndefined<DU> extends true
                          ? Exclude<T[K], undefined>
                          : T[K],
                      Rest,
                      DU,
                      DN
                    >
                  : EffectiveDiscardNull<DN> extends true
                    ? Exclude<T[K], null>
                    : EffectiveDiscardUndefined<DU> extends true
                      ? Exclude<T[K], undefined>
                      : T[K];
              } // ❌ not optional cause diff index parent
        : {
            [K in keyof T]: K extends Head
              ? NarrowByPathHasOwnProp<NonNullable<T[K]>, Rest, DU, DN>
              : T[K];
          } & {
            [K in Head]-?: NarrowByPathHasOwnProp<
              NonNullable<T[K]>,
              Rest,
              DU,
              DN
            >;
          } // ✅ delete optional leaf
      : T
  : P extends `[${infer N extends number}]`
    ? T extends readonly (infer U)[]
      ? RefineArrayAtIndex<
          T,
          N,
          ApplyLastRulesHasOwnProp<NonNullable<U>, DU, DN>
        >
      : T
    : P extends keyof T
      ? DU extends true
        ? {
            [K in keyof T]: K extends P
              ? ApplyLastRulesHasOwnProp<T[K], DU, DN>
              : T[K];
          } & {
            [K in P]-?: ApplyLastRulesHasOwnProp<T[P], DU, DN>;
          }
        : {
            [K in keyof T]: K extends P
              ? ApplyLastRulesHasOwnProp<T[K], DU, DN>
              : T[K];
          }
      : T;

// ------------------- DOT TO NESTED SPECIAL SMART DETECT -------------------

/** * ***Expand an array/string/function into a nested type according
 * to a dot/bracket path.***
 * @private ***types for {@link hasOwnProp}.***
 */
export type SmartDetectStringHasOwnProp<
  Obj extends string | undefined | null,
  Key extends string | number
> = Obj extends undefined
  ? undefined
  : Obj extends null
    ? null
    : IsPositive<ParseNumber<Key>> extends true
      ? Extends<IsStringLiteral<Obj>, true> extends true
        ? CharAt<Exclude<Obj, null | undefined>, ParseNumber<Key>>
        : string | undefined | null
      : IsPositive<ParseNumber<Key>> extends true
        ? string | undefined | null
        : AnyString | undefined | null;
// : Prettify<DotToNestedSpecialSmartDetect<Key>, { recursive: true }>;

/** @private ***types for {@link hasOwnProp}.*** */
export type SmartDetectArrayFuncHasOwnProp<
  Obj extends unknown[] | AnyFunction,
  Key extends PropertyKey
> = Prettify<
  Obj &
    DotToNestedSpecialSmartDetect<Key> & {
      length: number;
    },
  { recursive: false }
>;

/** * ***Smartly detect nested path keys of an unknown object or function,
 * falls-back to inferred nested structure when path is not valid.***
 *
 * @private ***types for {@link hasOwnProp}.***
 */
export type SmartDetectUnknownKeyHasOwnProp<
  Obj extends unknown | AnyFunction,
  Key extends PropertyKey,
  DiscardUndefined extends boolean = true,
  DiscardNull extends boolean = false
> =
  Trim<Key> extends ""
    ? Obj
    : Prettify<
        Obj &
          (Key extends NestedKeyOfHasOwnProp<Obj>
            ? GuardedHasOwnProp<Obj, Key, DiscardUndefined, DiscardNull>
            : DotToNestedSpecialSmartDetect<Key>),
        { recursive: true }
      >;

/** Convert dot/bracket path string to nested object type with leaf value.
 * Path not found in object key ➔ return unknown.
 */
type DotToNestedSpecialSmartDetect<Path extends PropertyKey, Value = unknown> =
  IsEmptyString<Extract<Path, string>> extends true
    ? undefined
    : Path extends `${infer Head}.${infer Rest}`
      ? Head extends `[${number}]`
        ? DotToNestedSpecialSmartDetect<Rest, Value>[]
        : { [Key in Head]: DotToNestedSpecialSmartDetect<Rest, Value> }
      : Path extends `[${number}]`
        ? Value[]
        : { [Key in Path]: Value };

// ------------------- GUARDED RESULT -------------------

/** * ***Guarded wrapper for `NarrowByPathHasOwnProp` with `Prettify`.***
 * @private ***types for {@link hasOwnProp}.***
 */
export type GuardedHasOwnProp<
  Obj,
  Key extends NestedKeyOfHasOwnProp<Obj>,
  DiscardUndefined extends boolean | undefined,
  DiscardNull extends boolean | undefined
> = Prettify<
  Obj &
    NarrowByPathHasOwnProp<
      Obj,
      Key & string,
      EffectiveDiscardUndefined<DiscardUndefined>,
      EffectiveDiscardNull<DiscardNull>
    >,
  { recursive: true }
>;

// ------------------- DeepRequiredHasOwnProp -------------------

/** * ***Make a specific symbol key deeply required in an object symbols.***
 * **Used internally to enforce stronger type narrowing.**
 * @private ***types for {@link hasOwnProp}.***
 */
export type DeepRequiredSymbolHasOwnProp<
  Obj,
  Sym extends symbol,
  DU extends boolean = true,
  DN extends boolean = false
> = Prettify<
  Obj &
    ({
      [K in keyof Obj & Sym as DU extends true ? K : never]-?: DN extends true
        ? NonNull<NonUndef<Obj[K]>>
        : NonUndef<Obj[K]>;
    } & {
      [K in keyof Obj & Sym as DU extends true ? never : K]?: DN extends true
        ? NonNull<Obj[K]>
        : Obj[K];
    }),
  { recursive: true }
>;

/** * ***Apply discard rules to numeric keys in an object type.***
 *
 * - If `discardUndefined = true` ➔ undefined removed, key required
 * - If `discardNull = true` ➔ null removed
 *
 * @private ***types for {@link hasOwnProp}.***
 */
export type NumericKeyHasOwnPropMapped<
  Obj extends object,
  K extends NumericKeyOfHasOwnProp<Obj>,
  DU extends boolean,
  DN extends boolean
> = Prettify<
  Obj &
    (IsOptionalKey<Obj, K> extends true
      ? {
          [P in K]?: DN extends true ? NonNull<Obj[K]> : Obj[K]; // optional key keep optional, but null is deleted if DN=true
        } & (DU extends true
          ? { [P in K]-?: NonUndef<Obj[K]> } // If DU=true ➔ required, undefined deleted
          : Record<never, never>)
      : {
          [P in K]-?: DN extends true ? NonNull<Obj[K]> : Obj[K];
        } & (DU extends true
          ? { [P in K]-?: NonUndef<Obj[K]> }
          : Record<never, never>)),
  { recursive: true }
>;

// ------------------- OPTIONS -------------------

/** * ***Options to control `hasOwnProp` behavior.***
 * @private ***types options for {@link hasOwnProp}.***
 */
export type HasOwnPropOptions<
  DiscardUndefined extends boolean = true,
  DiscardNull extends boolean = false
> = {
  /** If `true` ***(default)***, properties with `undefined` values are treated as non-existent.
   *
   * - **Effects:**
   *    - **Runtime:** `hasOwnProp(obj, key)` returns `false` if the property exists but its value is `undefined`.
   *    - **TypeScript narrowing:** The property's type is narrowed to exclude `undefined`.
   * - **Example:**
   * ```ts
   *     const obj = { a: undefined, b: 123 };
   *     hasOwnProp(obj, "a"); // ➔ false
   *     hasOwnProp(obj, "a", { discardUndefined: false }); // ➔ true
   * ```
   */
  discardUndefined?: DiscardUndefined;

  /** If `true` ***(default: `false`)***, properties with `null` values are treated as non-existent.
   *
   * - **Effects:**
   *    - **Runtime:** `hasOwnProp(obj, key)` returns `false` if the property exists but its value is `null`.
   *    - **TypeScript narrowing:** The property's type is narrowed to exclude `null`.
   * - **Example:**
   * ```ts
   *     const obj = { a: null, b: 123 };
   *     hasOwnProp(obj, "a"); // ➔ true (default discardNull = false)
   *     hasOwnProp(obj, "a", { discardNull: true }); // ➔ false
   * ```
   */
  discardNull?: DiscardNull;
};
