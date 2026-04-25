import type {
  AnObjectNonArray,
  AnyFunction,
  Arrayable,
  Extends,
  IsArray,
  IsNever,
  NonPlainObject,
  OrArr,
  ReadonlyDeep
} from "@/_internal/types/extra";

// ----------------------------------------------------------------

/** @internal */
export function deepFreeze<T>(value: T): ReadonlyDeep<T> {
  if (typeof value !== "object" || value === null) {
    return value as ReadonlyDeep<T>;
  }

  const seen = new WeakSet<object>();
  const stack: object[] = [value as object];

  while (stack.length) {
    const obj = stack.pop()!;

    if (seen.has(obj) || Object.isFrozen(obj)) continue;

    seen.add(obj);

    // Map
    if (isMap(obj)) {
      for (const [k, v] of obj) {
        if (typeof k === "object" && k !== null) stack.push(k);
        if (typeof v === "object" && v !== null) stack.push(v);
      }
    }

    // Set
    else if (isSet(obj)) {
      for (const v of obj) {
        if (typeof v === "object" && v !== null) stack.push(v);
      }
    }

    // Fast path Array
    else if (isArray(obj)) {
      for (const v of obj) {
        if (typeof v === "object" && v !== null) stack.push(v);
      }
    } else {
      const record = obj as Record<PropertyKey, unknown>;

      for (const key of Reflect.ownKeys(record)) {
        const v = record[key];
        if (typeof v === "object" && v !== null) stack.push(v);
      }

      // const descriptors = Object.getOwnPropertyDescriptors(obj);

      // for (const key of Reflect.ownKeys(descriptors)) {
      //   const desc = descriptors[key as keyof typeof descriptors];
      //   if (!desc) continue;

      //   if ("value" in desc) {
      //     const v = desc.value;
      //     if (typeof v === "object" && v !== null) stack.push(v);
      //   }
      // }
    }

    Object.freeze(obj);
  }

  return value as ReadonlyDeep<T>;
}
// ----------------------------------------------------------------

/** @internal */
export function isObjectLoose<T>(
  value: T
): value is Extract<T, object | AnyFunction> {
  return !isNil(value) && (isObjectOrArray(value) || isFunction(value));
}

export function isObjectLike<T>(value: T): value is Extract<T, object> {
  return !isFunction(value) && isObjectLoose(value);
}
// ----------------------------------------------------------------

/** ----------------------------------------------------------------
 * * ***Check whether a value is thenable (Promise-like).***
 * ----------------------------------------------------------------
 *
 * Determines whether a value implements a `.then()` method and can be
 * treated as a **thenable** object.
 *
 * This includes:
 * - Native `Promise`.
 * - Promise-like objects returned by libraries.
 * - Custom objects implementing `.then()`.
 *
 * ----------------------------------------------------------------
 *
 * @typeParam T
 * The resolved value type of the thenable.
 *
 * @param v
 * The value to check.
 *
 * @returns
 * `true` if the value is thenable, otherwise `false`.
 *
 * When `true`, the value is narrowed to `PromiseLike<T>`.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * isThenable(Promise.resolve(1));
 * // ➔ true
 *
 * isThenable({ then: () => {} });
 * // ➔ true
 *
 * isThenable(123);
 * // ➔ false
 * ```
 *
 * @example
 * ```ts
 * async function unwrap<T>(value: T | Promise<T>) {
 *   if (isThenable<T>(value)) {
 *     return await value;
 *   }
 *
 *   return value;
 * }
 * ```
 *
 * @remarks
 * Thenables are typically resolved before function execution to support async config factories without enforcing `Promise` instances.
 * - This function checks **behavior**, not identity.
 * - The value does **not** have to be an instance of `Promise`.
 * - Useful for async utilities, lazy evaluation, and hybrid sync/async APIs.
 *
 * @internal
 */
export const isThenable = <T = unknown>(v: unknown): v is PromiseLike<T> =>
  v != null &&
  (typeof v === "object" || typeof v === "function") &&
  typeof (v as PromiseLike<T>).then === "function";

// ----------------------------------------------------------------

/** @internal */
export const isRegExp = (value: unknown): value is RegExp => {
  return value instanceof RegExp;
};

// ----------------------------------------------------------------

/** @internal */
export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

// ----------------------------------------------------------------

/** @internal */
export function isSet<T = unknown>(value: Set<T>): value is Set<T>;
export function isSet(value: unknown): value is Set<unknown>;
export function isSet(value: unknown): boolean {
  return (
    Object.prototype.toString.call(value) === "[object Set]" ||
    value instanceof Set
  );
}

// ----------------------------------------------------------------

/** @internal */
export function isMap<K = unknown, V = unknown>(
  value: Map<K, V>
): value is Map<K, V>;
export function isMap(value: unknown): value is Map<unknown, unknown>;
export function isMap(value: unknown): boolean {
  return (
    Object.prototype.toString.call(value) === "[object Map]" ||
    value instanceof Map
  );
}

// ----------------------------------------------------------------

/** @internal */
type ArrayFallback<T> =
  IsNever<Extract<T, unknown[] | readonly unknown[]>> extends true
    ? unknown[] & T
    : Extract<T, unknown[] | readonly unknown[]>;

/** @internal */
export function isArray<T>(value: T): value is ArrayFallback<T>;
// export function isArray<T>(value: T): value is IsNever<Extract<T, unknown[]>> extends true ? unknown[]: Extract<T, unknown[]>;
export function isArray(value: unknown): value is unknown[];
export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

// ----------------------------------------------------------------

/** @internal */
export const isNull = (val: unknown): val is null => val === null;

// ----------------------------------------------------------------

/** @internal */
type IsPlainObjectResult<T> = unknown extends T
  ? Record<PropertyKey, unknown> & T
  : T extends object
    ? T extends NonPlainObject
      ? never
      : IsHasKeysObject<T> extends false
        ? Record<PropertyKey, unknown> & T
        : T
    : Extract<T, Record<PropertyKey, unknown>>;

/** @internal */
export function isPlainObject<T>(value: T): value is IsPlainObjectResult<T>;
export function isPlainObject<T>(
  value: T
): value is NonNullable<Extract<T, Record<PropertyKey, unknown>>>;
export function isPlainObject(value: unknown) {
  if (!isObject(value)) return false;

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

// ----------------------------------------------------------------

/** @internal */
type IsObject<T> = unknown extends T
  ? T & Record<PropertyKey, unknown>
  : T extends object
    ? T extends AnObjectNonArray
      ? T
      : IsHasKeysObject<T> extends false
        ? T & Record<PropertyKey, unknown>
        : IsArray<T> extends true
          ? Exclude<T, unknown[]>
          : T
    : never;

/** @internal */
export function isObject<T extends object>(value: T): value is IsObject<T>;
export function isObject(value: unknown): value is Record<PropertyKey, unknown>;
export function isObject(value: unknown): boolean {
  return typeof value === "object" && !isNil(value) && !isArray(value);
}

// ----------------------------------------------------------------

/** @internal */
type IsHasKeysObject<T> = keyof T extends never ? false : true;

// ----------------------------------------------------------------

/** @internal */
type IsObjectOrArray<T> =
  OrArr<
    [IsNever<T>, Extends<T, Record<PropertyKey, unknown>>, Extends<unknown, T>]
  > extends true
    ? T & Record<PropertyKey, unknown> & unknown[]
    : T extends object
      ? T extends unknown[]
        ? T
        : T extends AnObjectNonArray
          ? T
          : IsHasKeysObject<T> extends false
            ? T & Record<PropertyKey, unknown>
            : T
      : Extract<T, Record<PropertyKey, unknown> & unknown[]>;

/** @internal */
export function isObjectOrArray(value: []): value is [];
export function isObjectOrArray<T>(value: T): value is IsObjectOrArray<T>;
export function isObjectOrArray<T>(value: T): boolean {
  return isArray(value) || isObject(value);
}

// ----------------------------------------------------------------

/** @internal */
export const isNil = (value: unknown): value is null | undefined => {
  return value == null;
};

// ----------------------------------------------------------------

/** @internal */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

// ----------------------------------------------------------------

/** @internal */
export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === "undefined";
};

// ----------------------------------------------------------------

/** @internal */
export const isFunction = (value: unknown): value is AnyFunction => {
  return typeof value === "function";
};

// ----------------------------------------------------------------

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export const isNumberObject = (value: unknown): value is Number => {
  return (
    isObject(value) &&
    Object.prototype.toString.call(value) === "[object Number]"
  );
};

// ----------------------------------------------------------------

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export const isStringObject = (value: unknown): value is String => {
  return (
    isObject(value) &&
    Object.prototype.toString.call(value) === "[object String]"
  );
};

// ----------------------------------------------------------------

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export const isBooleanObject = (value: unknown): value is Boolean => {
  return (
    isObject(value) &&
    Object.prototype.toString.call(value) === "[object Boolean]"
  );
};

// ----------------------------------------------------------------

/** @internal */
export const isInfinityNumber = (value: unknown): boolean => {
  if (typeof value === "number" || isNumberObject(value)) {
    const num = Number(value);
    return num === Infinity || num === -Infinity;
  }
  return false;
};

// ----------------------------------------------------------------

/** @internal */
export const isSymbol = (value: unknown): value is symbol => {
  return typeof value === "symbol";
};

// ----------------------------------------------------------------

/** @internal */
export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === "bigint";
};

// ----------------------------------------------------------------

/** @internal */
export const isNaN = (value: unknown): boolean => {
  return typeof value === "number"
    ? Number.isNaN(value)
    : isNumberObject(value) && Number.isNaN(value.valueOf());
};

// ----------------------------------------------------------------

/** @internal */
type IsNonEmptyStringOptions = {
  /** Whether to trim the string before checking, defaultValue: `true`.
   *
   * @default true */
  trim?: boolean;
};

/** @internal */
export const isNonEmptyString = (
  value: unknown,
  options: IsNonEmptyStringOptions = {}
): value is string => {
  if (!isString(value)) return false;

  const trim = options.trim ?? true;

  const str = trim ? value.trim() : value;

  return str.length > 0;
};

// ----------------------------------------------------------------

/** @internal */
type IsNumberOptions = {
  /** If set to `true`, `NaN` will be considered a valid number, defaultValue: `false`.
   *
   * @default false
   */
  includeNaN?: boolean;
};

/** @internal */
export const isNumber = (
  value: unknown,
  options: IsNumberOptions = {}
): value is number => {
  const includeNaN =
    isPlainObject(options) && isBoolean(options.includeNaN)
      ? options.includeNaN
      : false;

  const aNumber = typeof value === "number";
  return includeNaN ? aNumber : aNumber && !Number.isNaN(value);
};

// ----------------------------------------------------------------

/** @internal */
export const isError = (error: unknown): error is Error => {
  return (
    Object.prototype.toString.call(error) === "[object Error]" ||
    error instanceof Error
  );
};
// ----------------------------------------------------------------

/** @internal */
type isDateOptions = {
  /** * ***Skip the validity check (`!isNaN(date.getTime())`).***
   *
   * When `true`, the function only checks that the value is an
   * instance of `Date` without verifying that it represents a valid
   * date value, default: `false`.
   *
   * @default false
   */
  skipInvalidDate?: boolean;
};

/** @internal */
export const isDate = (
  value: unknown,
  options: isDateOptions = {}
): value is Date => {
  const skipInvalidDate =
    isPlainObject(options) && isBoolean(options.skipInvalidDate)
      ? options.skipInvalidDate
      : false;

  const instanceDate = value instanceof Date;

  if (skipInvalidDate) return instanceDate;
  return instanceDate && !isNaN(value.getTime());
};

// ----------------------------------------------------------------

/** @internal */
export type SafeStableStringifyOptions = {
  /** -------------------------------------------------
   * * ***Whether to sort **object keys** alphabetically (recursively).***
   * -------------------------------------------------
   *
   * - `true` (default): object keys are sorted to ensure stable output.
   * - `false`: preserves original insertion order of keys.
   *
   * @default true
   */
  sortKeys?: boolean;
  /** -------------------------------------------------
   * * ***Whether to sort **primitive values inside arrays**.***
   * -------------------------------------------------
   *
   * - `true`: primitive values in arrays are sorted to ensure stable output.
   * - `false` (default): arrays retain their original order; objects and nested arrays are not reordered.
   *
   * @default false
   */
  sortArray?: boolean;
  /** -------------------------------------------------
   * * ***Whether to pretty-print JSON output with 2-space indentation.***
   * -------------------------------------------------
   *
   * - `true`: output is formatted with indentation and newlines.
   * - `false` (default): produces compact single-line JSON.
   *
   * @default false
   */
  pretty?: boolean;
  /** -------------------------------------------------
   * * ***Preserve `undefined` values instead of converting them to `null`.***
   * -------------------------------------------------
   * **Controls how the internal `deepProcess` step rewrites values
   * **before** the final `JSON.stringify` call.**
   * - **Default (`false`):**
   *     * Every `undefined` value (object properties **and** array elements)
   *       is replaced with `null` **before** serialization, because this happens
   *       first, the key is **not removed** by `JSON.stringify`.
   * - **`true`** – Leaves `undefined` untouched so the final
   *   `JSON.stringify` call behaves natively:
   *     * Object properties with `undefined` are **removed**.
   *     * Array elements that are `undefined` become `null`.
   * @default false
   * @example
   * // ✅ keepUndefined = true: behaves like native JSON.stringify
   * safeStableStringify({ a: undefined }, { keepUndefined: true });
   * // ➔ '{}' // key removed
   *
   * // ✅ Default (false): convert undefined to null, key kept
   * safeStableStringify({ a: undefined });
   * // ➔ '{"a":null}' // key present, value null
   *
   * // Arrays
   * safeStableStringify([undefined]);
   * // ➔ '[null]' // same, but via pre-replacement
   * safeStableStringify([undefined], { keepUndefined: true });
   * // ➔ '[null]' // element becomes null
   */
  keepUndefined?: boolean;
};

/** @internal */
export const safeStableStringify = (
  value: unknown,
  options: SafeStableStringifyOptions = {}
): string => {
  const pretty = options.pretty ?? false;
  const sortKeys = options.sortKeys ?? true;
  const sortArray = options.sortArray ?? false;
  const keepUndefined = options.keepUndefined ?? false;

  if (isUndefined(value)) {
    return keepUndefined ? "undefined" : "null";
  }

  const seen = new WeakSet();

  const isPrimitive = (val: unknown): boolean =>
    isNull(val) || (!isObjectOrArray(val) && !isFunction(val));

  const deepProcess = (val: unknown): unknown => {
    if (isNumberObject(val)) {
      const valOf = val.valueOf();
      return isNaN(valOf) || isInfinityNumber(valOf) ? null : valOf;
    }
    if (isStringObject(val)) return val.valueOf();
    if (isBooleanObject(val)) return val.valueOf();
    if (isFunction(val) || isSymbol(val)) return undefined;
    if (isBigInt(val)) return val.toString();
    if (isNaN(val) || isInfinityNumber(val)) return null;
    if (isUndefined(val)) {
      return keepUndefined ? undefined : null;
    }

    if (isObjectOrArray(val)) {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);

      if (isDate(val)) return val.toISOString();
      if (isMap(val)) {
        return {
          map: Array.from(val.entries()).map(([k, v]) => [k, deepProcess(v)])
        };
      }
      if (isSet(val)) return { set: Array.from(val.values()).map(deepProcess) };

      if (isArray(val)) {
        const processedArr = val.map(deepProcess);
        if (sortArray) {
          const primitives: unknown[] = [];
          const nonPrimitives: unknown[] = [];

          for (const item of processedArr) {
            if (isPrimitive(item)) primitives.push(item);
            else nonPrimitives.push(item);
          }
          primitives.sort((a, b) => {
            if (isNumber(a) && isNumber(b)) return a - b;
            return String(a).localeCompare(String(b));
          });
          return [...primitives, ...nonPrimitives];
        }
        return processedArr;
      }

      const keys = Object.keys(val);
      if (sortKeys) {
        keys.sort((a, b) => {
          const na = Number(a);
          const nb = Number(b);
          if (!isNaN(na) && !isNaN(nb)) return na - nb;
          return a.localeCompare(b);
        });
      }

      const result: Record<string, unknown> = {};

      if (isObject(val)) {
        for (const k of keys) {
          const v = deepProcess(val[k]);
          if (!isUndefined(v)) result[k] = v;
        }
      }

      return result;
    }

    return val;
  };

  try {
    return JSON.stringify(deepProcess(value), null, pretty ? 2 : 0);
  } catch (err) {
    console.warn("Error in safeStableStringify:", err);
    return "{}";
  }
};

// ----------------------------------------------------------------

/** @internal */
type NormalizeSpacesOptions = {
  /** If `true`, skips normalization and only trims whitespace from start & end, defaultValue: `false`.
   *
   * @default false
   */
  trimOnly?: boolean;
  /** If `false`, skips trimming value, defaultValue: `true`.
   *
   * @default true
   */
  withTrim?: boolean;
};

/** @internal */
export const normalizeSpaces = (
  value: string | null | undefined,
  options: NormalizeSpacesOptions = {
    withTrim: true,
    trimOnly: false
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  if (!isPlainObject(options)) {
    options = {};
  }

  const { trimOnly = false, withTrim = true } = options;

  if (trimOnly) return value.trim();

  if (withTrim) {
    value = value.trim();
  }

  // Remove all duplicate spaces (including tabs, newlines, etc.)
  return value.replace(/\s+/g, " ");
};

// ----------------------------------------------------------------

/** ----------------------------------------------------------------
 * * ***Checks whether a value is an array of strings.***
 * ----------------------------------------------------------------
 *
 * Type guard that validates the input is an `Array` where **all**
 * elements are strings.
 *
 * @param {unknown} v - The value to test.
 *
 * @returns {boolean} `true` if the value is a `string[]`.
 *
 * @internal
 */
export const isStringArray = (v: unknown): v is string[] =>
  isArray(v) && v.every((i) => isString(i));

/** ----------------------------------------------------------------
 * * ***Checks whether a value is a Set of strings.***
 * ----------------------------------------------------------------
 *
 * Type guard that validates the input is a `Set` where **all**
 * entries are strings.
 *
 * @param {unknown} v - The value to test.
 *
 * @returns {boolean} `true` if the value is a `Set<string>`.
 *
 * @internal
 */
export const isStringSet = (v: unknown): v is Set<string> =>
  isSet(v) && [...v].every((i) => isString(i));

/** ----------------------------------------------------------------
 * * ***Asserts that a value is a valid pattern input.***
 * ----------------------------------------------------------------
 *
 * Runtime assertion that validates the provided value is one of the
 * supported pattern types:
 * - `string`.
 * - `string[]`.
 * - `Set<string>`.
 *
 * This function is intended to be used at API boundaries to ensure
 * type safety before further processing.
 *
 * @param {unknown} v - The value to validate.
 * @param {string|undefined} parameterKey - The key parameter to identity which is invalid, default `"pattern"`.
 *
 * @throws {TypeError} If the value is not a valid pattern input.
 *
 * @example
 * ```ts
 * assertValidatePatternArgs(pattern);
 * // pattern is now typed as:
 * // string | string[] | Set<string>
 * ```
 *
 * @internal
 */
export const assertValidatePatternArgs: (
  v: unknown,
  parameterKey?: string
) => asserts v is string | string[] | Set<string> = (
  v: unknown,
  parameterKey: string = "pattern"
) => {
  if (!isString(v) && !isStringArray(v) && !isStringSet(v)) {
    throw new TypeError(
      `The \`${parameterKey}\` argument must be a string, string[] or Set<string>.`
    );
  }
};

/** ----------------------------------------------------------------
 * * ***Flattens nested arrays and extracts string values only.***
 * ----------------------------------------------------------------
 *
 * Recursively flattens an input array to **infinite depth** and
 * filters out all non-string values.
 *
 * - *Normalization rules:*
 *    - Nested arrays are flattened using `Array.prototype.flat(Infinity)`.
 *    - Only values with `typeof === "string"` are kept.
 *    - Non-string values are discarded.
 *
 * The returned array is always a **new instance** and does not mutate
 * the original input.
 *
 * @param {readonly unknown[]} input - Arbitrary nested array input.
 *
 * @returns {string[]} A flat array containing only string values.
 *
 * @example
 * ```ts
 * flattenStrings(["a", ["b", ["c"]], 1, null]);
 * // ➔ ["a", "b", "c"]
 * ```
 *
 * @internal
 */
export const flattenStrings = (input: readonly unknown[]): string[] => {
  return input.flat(Infinity).filter((v): v is string => typeof v === "string");
};

/** ----------------------------------------------------------------
 * * ***Normalizes pattern input into a new `Set<string>` instance.***
 * ----------------------------------------------------------------
 *
 * Converts a pattern value into a deduplicated `Set<string>` for
 * consistent internal handling.
 *
 * #### Normalization behavior
 * - `string` ➔ wrapped into a `Set`.
 * - `string[]` ➔ converted into a `Set` (duplicates removed).
 * - `Set<string>` ➔ cloned into a new `Set`.
 *
 * The returned set is **always a new instance** and the original
 * input is never mutated.
 *
 * #### Validation
 * When `withValidationType` is `true` (default), the input will be
 * validated before normalization.
 *
 * If the provided `pattern` is not one of the supported types,
 * a `TypeError` will be thrown.
 *
 * @param pattern - Pattern value to normalize.
 * @param options - Optional configuration object.
 * @param options.withValidationType - Whether to validate the input
 * before normalization. Defaults to `true`.
 * @param options.parameterKey - The key parameter to identity which is invalid, default `"pattern"`.
 *
 * @returns A new deduplicated `Set<string>` instance.
 *
 * @throws {TypeError}
 * Thrown when `pattern` is not a `string`, `string[]`, or `Set<string>`
 * and validation is enabled.
 *
 * @example
 * ```ts
 * toStringSet("a");
 * // ➔ Set { "a" }
 * ```
 *
 * @example
 * ```ts
 * toStringSet(["a", "b", "a"]);
 * // ➔ Set { "a", "b" }
 * ```
 *
 * @example
 * ```ts
 * toStringSet(new Set(["x", "y"]));
 * // ➔ Set { "x", "y" }
 * ```
 *
 * @example
 * ```ts
 * toStringSet(123 as any);
 * // ❌ Throws TypeError
 * ```
 *
 * @example
 * ```ts
 * // Disable validation (use cautiously)
 * toStringSet("a", { withValidationType: false });
 * toStringSet(123 as any, { withValidationType: false });
 * ```
 *
 * @internal
 */
export const toStringSet = (
  pattern: string | string[] | Set<string>,
  options: {
    withValidationType?: boolean;
    /**
     * The key parameter to identity which is invalid.
     *
     * @default "pattern"
     */
    parameterKey?: string;
  } = {}
): Set<string> => {
  const { withValidationType = true, parameterKey = "pattern" } = options;
  if (withValidationType) assertValidatePatternArgs(pattern, parameterKey);

  return toObjectSet(pattern);
};

/** ----------------------------------------------------------------
 * * ***Normalizes a value into a deduplicated `Set`.***
 * ----------------------------------------------------------------
 *
 * Converts a single value, array, or existing `Set` into a `Set<T>`
 * for consistent internal handling.
 *
 * - *Normalization rules:*
 *    - `T` ➔ wrapped in a `Set`.
 *    - `T[]` ➔ converted to a `Set` (duplicates removed).
 *    - `Set<T>` ➔ returned as-is.
 *
 * The returned `Set` is **not mutated** internally by this function.
 * If an existing `Set` is provided, it will be reused.
 *
 * @typeParam T - Value type stored in the set.
 *
 * @param {T | T[] | Set<T>} value - Value to normalize.
 *
 * @returns {Set<T>} A deduplicated set of values.
 *
 * @example
 * ```ts
 * toObjectSet(1);
 * // ➔ Set { 1 }
 * ```
 *
 * @example
 * ```ts
 * toObjectSet([1, 2, 1]);
 * // ➔ Set { 1, 2 }
 * ```
 *
 * @example
 * ```ts
 * toObjectSet(new Set([1, 2]));
 * // ➔ Set { 1, 2 }
 * ```
 *
 * @internal
 */
export const toObjectSet = <T>(value: T | T[] | Set<T>): Set<T> => {
  if (isSet(value)) return value;

  return new Set(isArray(value) ? value : [value]);
};

/** ----------------------------------------------------------------
 * * ***Normalize a value into an array.***
 * ----------------------------------------------------------------
 *
 * Converts a single value or an array-like value into a **new array**
 * with consistent typing.
 *
 * - If `value` is already an array ➔ returned as-is.
 * - If `value` is a single item ➔ wrapped in an array.
 *
 * This utility is useful for APIs or configs that accept
 * either a single value or multiple values.
 *
 * ----------------------------------------------------------------
 *
 * @typeParam T
 * The element type of the resulting array.
 *
 * @param value
 * A value or array of values.
 *
 * @returns
 * A normalized array of type `T[]`.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * toArray(1);
 * // ➔ [1]
 *
 * toArray("hello");
 * // ➔ ["hello"]
 *
 * toArray([1, 2, 3]);
 * // ➔ [1, 2, 3]
 * ```
 *
 * @example
 * ```ts
 * type User = { id: number };
 *
 * toArray<User>({ id: 1 });
 * // ➔ [{ id: 1 }]
 *
 * toArray<User>([{ id: 1 }, { id: 2 }]);
 * // ➔ [{ id: 1 }, { id: 2 }]
 * ```
 *
 * @remarks
 * This function does **not** flatten nested arrays.
 * If `value` is already an array, the original reference is preserved.
 *
 * @internal
 */
export const toArray = <T>(value: Arrayable<T>): T[] => {
  return isArray(value) ? value : [value];
};
