import type { If } from "./if";
import type { IsArrayOrTuple } from "./is-array-or-tuple";
import type { IsConstructor } from "./is-constructor";
import type { IsFunction } from "./is-function";
import type { IsPrimitive } from "./primitive";
import type { NonPlainObject } from "./type-data";

/** * Applies readonly behavior according to mode. */
type ApplyReadonlyMode<
  T,
  Mode extends PrettifyOptions["readonlyMode"]
> = Mode extends "remove"
  ? { -readonly [K in keyof T]: T[K] }
  : Mode extends "preserve"
    ? { readonly [K in keyof T]: T[K] }
    : { [K in keyof T]: T[K] }; // auto ➔  keep original modifiers

/** ---------------------------------------------------------------------------
 * * ***Options for {@link Prettify|`Prettify`}.***
 * ---------------------------------------------------------------------------
 * **Options for customizing the behavior of the {@link Prettify | **`Prettify`**} type utility.**
 */
export type PrettifyOptions = {
  /** -------------------------------------------------------
   * * ***recursive***
   * -------------------------------------------------------
   * **Enables **deep prettification** of types when set to `true`.**
   * @description
   * By default (`false`), {@link Prettify | **`Prettify`**} only flattens the **top-level shape**
   * of objects and intersections. Nested objects, arrays, and tuples remain as-is
   * unless this option is enabled.
   * - ***Behavior when `true`:***
   *      - **Plain objects**: Nested intersections are expanded recursively.
   *      - **Arrays & tuples**: Each element type is recursively prettified.
   *      - **Readonly handling**: Nested properties respect the `readonlyMode` option.
   *      - **Functions, constructors, and built-in objects** (Set, Map, Date, Promise, etc.)
   *        are **not** affected or expanded.
   *      - **Nested intersections**: Combined properties are flattened recursively.
   * - ⚠️ ***Notes:***
   *      - Recursive mode only applies to **plain objects**, **arrays**, and **tuples**.
   *      - Readonly modifiers on nested properties follow the `readonlyMode` rules:
   *        - `"auto"` ➔ keep as-is
   *        - `"remove"` ➔ strip readonly
   *        - `"preserve"` ➔ make readonly
   *      - Arrays and tuples maintain `readonly` if the original type is `readonly` and `readonlyMode` is `"auto"` or `"preserve"`.
   * @default false
   * @example
   * ```ts
   * type Nested = {
   *   a: {
   *       readonly b: { c: number } & { d: string }
   *   } & { e: boolean };
   *   list: readonly ({ id: number } & { name: string })[];
   *   set: Set<{ x: number } & { y: string }>;
   * };
   *
   * // Top-level only (default)
   * type Shallow = Prettify<Nested>;
   * // ➔ {
   * //      a: { readonly b: { c: number } & { d: string } } & { e: boolean };
   * //      list: readonly ({ id: number } & { name: string })[];
   * //      set: Set<{ x: number } & { y: string }>;
   * //    }
   *
   * // Fully recursive flatten
   * type Deep = Prettify<Nested, { recursive: true }>;
   * // ➔ {
   * //      a: { readonly b: { c: number; d: string }; e: boolean };
   * //      list: readonly { id: number; name: string }[];
   * //      set: Set<{ x: number } & { y: string }>; // built-in ignored
   * //    }
   * ```
   */
  recursive?: boolean;

  /** -------------------------------------------------------
   * * ***readonlyMode***
   * -------------------------------------------------------
   * **Determines how `readonly` modifiers are applied to properties
   * when using {@link Prettify}.**
   * - **Modes:**
   *      - `"auto"` ➔ Keep `readonly` exactly as in the original type (default).
   *      - `"remove"` ➔ Remove all `readonly` modifiers.
   *      - `"preserve"` ➔ Make all properties `readonly`.
   * - **Behavior:**
   *      - Applies to both **top-level** and **nested properties** (if `recursive` is `true`).
   *      - Arrays and tuples preserve or adjust `readonly` according to the selected mode:
   *        - `"auto"` ➔ preserve array/tuple readonly as-is.
   *        - `"remove"` ➔ array/tuple becomes mutable.
   *        - `"preserve"` ➔ array/tuple becomes readonly.
   *      - Functions, constructors, and built-in objects (Set, Map, Date, Promise, etc.) are **not affected**.
   *      - Nested intersections respect `readonlyMode` recursively if `recursive` is enabled.
   * - ⚠️ ***Notes:***
   *      - For nested objects, `readonly` behavior only changes if `recursive: true`.
   *      - `readonlyMode` does **not** override `readonly` on function parameters, methods, or constructors.
   * @default "auto"
   * @example
   * ```ts
   * type T = { readonly a: number; b: string };
   *
   * // Default: auto
   * type Auto = Prettify<T, { readonlyMode: "auto" }>;
   * // ➔ { readonly a: number; b: string }
   *
   * // Remove readonly
   * type Remove = Prettify<T, { readonlyMode: "remove" }>;
   * // ➔ { a: number; b: string }
   *
   * // Force all readonly
   * type Preserve = Prettify<T, { readonlyMode: "preserve" }>;
   * // ➔ { readonly a: number; readonly b: string }
   *
   * // Recursive + preserve
   * type Nested = {
   *   config: { readonly port: number } & { host: string }
   * };
   * type RecursivePreserve = Prettify<Nested, { recursive: true; readonlyMode: "preserve" }>;
   * // ➔ { readonly config: { readonly port: number; readonly host: string } }
   * ```
   */
  readonlyMode?: Extract<"auto" | "remove" | "preserve", string>;

  /** ---------------------------------
   * * ***Skips applying the prettify transformation.***
   * ---------------------------------
   *
   * When enabled, the output will be returned as-is without running the
   * prettify step.
   *
   * @default false
   *
   */
  skipPrettify?: boolean;
};

/** -------------------------------------------------------
 * * ***DefaultPrettifyOptions***
 * -------------------------------------------------------
 * **Default options {@link Prettify | **`Prettify`**} used when no custom options are provided.**
 */
export type DefaultPrettifyOptions = {
  skipPrettify: false;
  recursive: false;
  readonlyMode: "auto";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MergeReadonlyIntersection<T> = T extends readonly any[]
  ? T
  : T extends object
    ? {
        [K in keyof T]: T[K];
      }
    : T;

/** -------------------------------------------------------
 * * ***Utility Type: `Prettify`.***
 * -------------------------------------------------------
 * **Flattens and simplifies complex TypeScript types into a more
 * human-readable form, by forcing the compiler to expand intersections.**
 * @description
 * By default, only the **top-level shape** of an object is flattened.
 * To also prettify **nested objects**, set the `recursive` option.
 * - ⚠️ ***Note:***
 *      - `recursive: true` only affects **plain objects** and **arrays/tuples**.
 *      - Built-in objects like `Set`, `Map`, `Date`, `Promise`, etc.
 *        will **not** be recursively prettified.
 *      - `readonly` handling is controlled via the `readonlyMode` option.
 * - **ℹ️ Options:**
 *      - `recursive?: boolean` (default: `false`):
 *        - Whether to recursively expand nested objects and intersections.
 *      - `readonlyMode?: "auto" | "remove" | "preserve"` (default: `"auto"`):
 *        - How `readonly` modifiers are treated:
 *          - `"auto"`     ➔ preserve `readonly` as-is (**default**).
 *          - `"remove"`   ➔ strip all `readonly`.
 *          - `"preserve"` ➔ enforce `readonly` everywhere.
 * @template T - The type to prettify.
 * @template Options - Configuration options.
 * @example
 * ```ts
 * // --- Top-level only (default) ---
 * type T0 = Prettify<{ a: number } & { b: string }>;
 * // ➔ { a: number; b: string }
 *
 * // --- Recursive expansion of nested objects ---
 * type T1 = Prettify<
 *   { a: { x: number } & { y: string } } & { b: boolean },
 *   { recursive: true }
 * >;
 * // ➔ { a: { x: number; y: string }; b: boolean }
 *
 * // --- Readonly handling modes ---
 * type T2 = { readonly id: number; name: string };
 *
 * type R1 = Prettify<T2>;
 * // (default: readonlyMode = "auto")
 * // ➔ { readonly id: number; name: string }
 *
 * type R2 = Prettify<T2, { readonlyMode: "remove" }>;
 * // ➔ { id: number; name: string }
 *
 * type R3 = Prettify<T2, { readonlyMode: "preserve" }>;
 * // ➔ { readonly id: number; readonly name: string }
 *
 * // --- Readonly + mutable intersection ---
 * type T3 = Prettify<{ readonly a: number } & { a: number; b: boolean }>;
 * // ➔ { a: number; b: boolean }
 * // (in "auto" mode, readonly lose over mutable)
 *
 * // --- Nested readonly with recursive ---
 * type T4 = Prettify<
 *   { config: { readonly port: number } & { host: string } },
 *   { recursive: true }
 * >;
 * // ➔ { config: { readonly port: number; host: string } }
 *
 * // --- Arrays with readonly ---
 * type T5 = Prettify<
 *   { list: readonly ({ id: number } & { name: string })[] },
 *   { recursive: true }
 * >;
 * // (readonly on array is preserved in "auto" mode)
 * // ➔ { list: readonly { id: number; name: string }[] }
 *
 * type T6 = Prettify<
 *   { list: readonly ({ id: number } & { name: string })[] },
 *   { recursive: true; readonlyMode: "remove" }
 * >;
 * // ➔ { list: { id: number; name: string }[] }
 *
 * // --- Built-in objects are ignored (not expanded) ---
 * type T7 = Prettify<
 *   { s: Set<{ a: number } & { b: string }> },
 *   { recursive: true }
 * >;
 * // ➔ { s: Set<{ a: number } & { b: string }> }
 * ```
 */
export type Prettify<
  T,
  Options extends PrettifyOptions = DefaultPrettifyOptions
> = Options["skipPrettify"] extends true
  ? T
  : // Skip primitives
    IsPrimitive<T> extends true
    ? T
    : // Skip functions
      IsFunction<T> extends true
      ? T
      : // Skip constructors
        IsConstructor<T> extends true
        ? T
        : // Arrays & tuples
          IsArrayOrTuple<T> extends true
          ? ApplyReadonlyMode<
              {
                [K in keyof T]: If<
                  Options["recursive"],
                  Prettify<T[K], Options>,
                  T[K]
                >;
              },
              Options["readonlyMode"]
            >
          : // Built-in non-plain objects
            T extends NonPlainObject
            ? T
            : // Plain object
              T extends object
              ? ApplyReadonlyMode<
                  MergeReadonlyIntersection<{
                    [K in keyof T]: If<
                      Options["recursive"],
                      Prettify<T[K], Options>,
                      T[K]
                    >;
                  }>,
                  Options["readonlyMode"]
                >
              : T;

/** * ***Accepts a type and returns its simplified version for better readability. Transforms interface to type, simplifies intersections. If `recursive` option is `true` transforms the children object properties as well.***
 * @example
 * ```ts
 * // { a: string; b: string }
 * type Case1 = Prettify<{ a: string } & { b: string }
 * ```
 *
 * @deprecated use {@link Prettify | **`Prettify`**} instead.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PrettifyDeprecated<
  T,
  Options extends PrettifyOptions = { recursive: false }
> = T extends infer R
  ? {
      [K in keyof R]: If<Options["recursive"], Prettify<R[K], Options>, R[K]>;
    }
  : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PrettifyDeprecatedNew<
  T,
  Options extends PrettifyOptions = DefaultPrettifyOptions
> = Options["skipPrettify"] extends true
  ? T
  : // Skip primitives
    IsPrimitive<T> extends true
    ? T
    : // Skip functions
      IsFunction<T> extends true
      ? T
      : // Skip constructors
        IsConstructor<T> extends true
        ? T
        : // Skip arrays & tuples
          IsArrayOrTuple<T> extends true
          ? {
              [K in keyof T]: If<
                Options["recursive"],
                Prettify<T[K], Options>,
                T[K]
              >;
            }
          : // Skip built-in objects
            T extends NonPlainObject
            ? T
            : // Normal object mapping
              T extends object
              ? ApplyReadonlyMode<
                  {
                    [K in keyof T]: If<
                      Options["recursive"],
                      Prettify<T[K], Options>,
                      T[K]
                    >;
                  },
                  Options["readonlyMode"]
                >
              : T;

/** --------------------------------------------------
 * * ***PrettifyOld.***
 * --------------------------------------------------
 * **Helper type that recursively resolves and flattens the structure of a given type,
 * making it easier to read in IDE tooltips or inline inspections.**
 * @deprecated  ⚠️ Deprecated — use {@link Prettify | **`Prettify`**} instead.
 * @template T - The type or interface to prettify.
 * @example
 * ```ts
 * // Without Prettify:
 * type Result = A & B & { extra: string };
 *
 * // With Prettify:
 * type Result = PrettifyOld<A & B & { extra: string }>;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PrettifyOld<T> = {
  [K in keyof T]: T[K] extends object ? PrettifyOld<T[K]> : T[K];
} & {};
