import type {
  ConvertedDeepNumber,
  ToNumberDeepOptions
} from "./_private/toNumberDeep.types";

import { createMessage } from "@/_private/logger";

import { isNaN } from "@/predicates/is/isNaN";
import { isSet } from "@/predicates/is/isSet";
import { isMap } from "@/predicates/is/isMap";
import { isNil } from "@/predicates/is/isNil";
import { isDate } from "@/predicates/is/isDate";
import { isArray } from "@/predicates/is/isArray";
import { isBuffer } from "@/predicates/is/isBuffer";
import { isNumber } from "@/predicates/is/isNumber";
import { isRegExp } from "@/predicates/is/isRegExp";
import { isObject } from "@/predicates/is/isObject";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isTypedArray } from "@/predicates/is/isTypedArray";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isEmptyObject } from "@/predicates/is/isEmptyObject";
import { isNumberObject } from "@/predicates/is/isNumberObject";
import { isStringObject } from "@/predicates/is/isStringObject";
import { isBooleanObject } from "@/predicates/is/isBooleanObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isInfinityNumber } from "@/predicates/is/isInfinityNumber";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** --------------------------------------------------------------------------------------------------------------------------
 * * ***Utility: `toNumberDeep`.***
 * ---------------------------------------------------------------------------------------------------------------------------
 * **Converts deeply nested arrays, objects, buffers, sets, maps, or typed arrays into numbers while preserving structure.**
 *
 * ---
 * - **Features:**
 *     - Converts numeric strings, number to numbers:
 *       - `3.5` ➔ `3.5`.
 *       - `"3.5"` ➔ `3.5`.
 *     - Converts boolean to number:
 *       - `true` ➔ `1`.
 *       - `false` ➔ `0`.
 *     - Converts Date to getTime (timestamp) `Date ➔ number`, if invalid Date value will return `0`:
 *       - `new Date("invalid")` ➔ `0`.
 *       - `new Date("11-09-2025 22:04:11")` ➔ `1762700651000`.
 *     - Converts `Buffer`, `TypedArray`, `Set`, `Map`, and `arrays` recursively to `arrays of numbers`.
 *     - Converts boxed primitives box into their primitive equivalents then convert to number:
 *       - For `new String` we convert everything to number (behavior JS of new String):
 *         - `new String(123)` ➔ `.valueOf()` ➔ `"123"` ➔ `Number("123")` ➔ `123`.
 *         - `new String("123")` ➔ `.valueOf()` ➔ `"123"` ➔ `Number("123")` ➔ `123`.
 *         - `new String(true)` ➔ `.valueOf()` ➔ `"true"` ➔ `Number(true)` ➔ `1`.
 *         - `new String(false)` ➔ `.valueOf()` ➔ `"false"` ➔ `Number(false)` ➔ `0`.
 *         - If result from `valueOf()` is `NaN` or `Infinity` ***(will removing)***:
 *           - `new String("hi")` ➔ `.valueOf()` ➔ `"hi"` ➔ `Number("hi")` ➔ `NaN` ***(remove)***.
 *           - `new String(()=>{})` ➔ `.valueOf()` ➔ `"()=>{}"` ➔ `Number("()=>{}")` ➔ `NaN` ***(remove)***.
 *       - For `new Boolean` we convert to boolean (behavior JS of new Boolean) then convert to number:
 *         - `new Boolean(true)` ➔ `.valueOf()` ➔ `true` ➔ `Number(true)` ➔ `1`.
 *         - `new Boolean(false)` ➔ `.valueOf()` ➔ `false` ➔ `Number(false)` ➔ `0`.
 *         - Special behavior JS of new Boolean, return `false` **(convert to number: `0`)**
 *           for `false`, (`0` / `-0`), `""` (empty-string),
 *           `null`, `undefined`, `NaN`, otherwise `true` **(convert to number: `1`)**.
 *       - For `new Number`:
 *         - `new Number(42)` ➔ `.valueOf()` ➔ `42`.
 *         - `new Number("42")` ➔ `.valueOf()` ➔ `42`.
 *         - `new Number(null)` ➔ `.valueOf()` ➔ `0` (`null` is `0` behavior JS of new Number).
 *         - If result from `valueOf()` is `NaN` or `Infinity` ***(will removing)***:
 *           - `new Number(NaN)` ➔ `.valueOf()` ➔ `NaN` ***(remove)***.
 *           - `new Number(undefined)` ➔ `.valueOf()` ➔ `NaN` ***(remove)***.
 *           - `new Number(Infinity)` ➔ `.valueOf()` ➔ `Infinity` ***(remove)***.
 *           - `new Number(-Infinity)` ➔ `.valueOf()` ➔ `-Infinity` ***(remove)***.
 *     - Recursively processes `nested objects`, `arrays`, `buffers`, `sets`, `maps`, and `typed arrays`.
 *     - Removes `empty-string`, `non-numeric strings`.
 *     - Removes `null`, `undefined`, `NaN`, `Infinity`, `-Infinity`.
 *     - Removes `unsupported` types like `functions` , `RegExp`, `symbols`, and `BigInt`.
 *     - Can optionally remove empty arrays (`[]`) and/or empty objects (`{}`) **recursively**.
 *
 * ---
 * @template T - The input type.
 * @template RemoveEmptyObjects - Whether to remove empty objects.
 * @template RemoveEmptyArrays - Whether to remove empty arrays.
 *
 * ---
 * @param {*} input - The input value to convert.
 * @param {ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>} [options] - Conversion options.
 *
 * ---
 * @returns {ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>|undefined} The converted value, return `undefined` if the input is entirely empty or filtered out by options.
 *
 * ---
 * @example
 * ```ts
 * toNumberDeep("123");
 * // ➔ 123
 * toNumberDeep("abc");
 * // ➔ undefined
 * toNumberDeep([NaN, "10", "xyz"]);
 * // ➔ [10]
 * toNumberDeep({ a: "1", b: [null, "2"] });
 * // ➔ { a: 1, b: [2] }
 * toNumberDeep(Buffer.from([0, 1, 2]));
 * // ➔ [0, 1, 2]
 * toNumberDeep(new Set(["1", "2"]));
 * // ➔ [1, 2]
 * toNumberDeep(new Map([["a", "1"], ["b", "2"]]));
 * // ➔ [["a", 1], ["b", 2]]
 * toNumberDeep(new Int16Array([1, 2, 3]));
 * // ➔ [1, 2, 3]
 * toNumberDeep(new Date("2025-08-16T00:00:00Z"));
 * // ➔ 1755552000000
 * toNumberDeep({ a: {}, b: [] }, { removeEmptyObjects: true });
 * // ➔ { b: [] }
 * toNumberDeep({ a: {}, b: [] }, { removeEmptyArrays: true });
 * // ➔ { a: {} }
 * toNumberDeep({ x: {}, y: [], z: [{ a: {}, b: [] }] }, {
 *    removeEmptyObjects: true, removeEmptyArrays: true
 * });
 * // ➔ { z: [] }
 * ```
 */
export function toNumberDeep(
  input?: null | undefined,
  options?: ToNumberDeepOptions<boolean, boolean>
): undefined;
export function toNumberDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  options?: ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
): ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
export function toNumberDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  options?: ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
) {
  if (!isPlainObject(options)) options = {};

  const removeEmptyObjects = options.removeEmptyObjects ?? false;
  const removeEmptyArrays = options.removeEmptyArrays ?? false;

  function _internal<
    T,
    RemoveEmptyObjects extends boolean,
    RemoveEmptyArrays extends boolean
  >(
    input: T,
    options: Required<
      ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
    > & {
      isRoot: boolean;
    }
  ): unknown {
    if (isNil(input) || isRegExp(input)) return undefined;

    const { removeEmptyArrays, removeEmptyObjects, isRoot } = options;

    if (!isBoolean(removeEmptyObjects) || !isBoolean(removeEmptyArrays)) {
      throw new TypeError(
        createMessage(
          "toNumberDeep",
          `Parameters \`removeEmptyObjects\` and \`removeEmptyArrays\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: ['removeEmptyObjects': \`${getPreciseType(
            removeEmptyObjects
          )}\`, 'removeEmptyArrays': \`${getPreciseType(removeEmptyArrays)}\`].`
        )
      );
    }

    // primitive boolean, numbers, or numeric strings
    if (isNumber(input) || isBoolean(input) || isNonEmptyString(input)) {
      const num = Number(input);
      return isInfinityNumber(num) || isNaN(num) ? undefined : num;
    }

    if (
      isNumberObject(input) ||
      isStringObject(input) ||
      isBooleanObject(input)
    ) {
      const valOf = Number(input.valueOf());
      return isInfinityNumber(valOf) || isNaN(valOf) ? undefined : valOf;
    }

    if (isDate(input, { skipInvalidDate: true })) {
      try {
        return !isNaN(input.getTime()) ? input.getTime() : 0;
      } catch {
        return 0;
      }
    }

    if (isBuffer(input)) {
      const arr = Array.from(input)
        .map((n) =>
          _internal(n, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));
      if (removeEmptyArrays && isEmptyArray(arr)) return undefined;
      return arr;
    }

    if (isTypedArray(input)) {
      // If BigInt TypedArray
      if (input instanceof BigInt64Array || input instanceof BigUint64Array) {
        const newArray = Array.from(input)
          .map((item) =>
            _internal(item, {
              removeEmptyObjects,
              removeEmptyArrays,
              isRoot: false
            })
          )
          .filter((item) => !isUndefined(item));

        if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
        return newArray;
      } else {
        // All TypedArray based of number
        const newArray = Array.from(input)
          .map((item) =>
            _internal(item, {
              removeEmptyObjects,
              removeEmptyArrays,
              isRoot: false
            })
          )
          .filter((item) => !isUndefined(item));

        if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
        return newArray;
      }
    }

    if (isSet(input)) {
      const newArray = Array.from(input)
        .map((item) =>
          _internal(item, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
      return newArray;
    }

    if (isMap(input)) {
      let newArray = Array.from(input.entries())
        .map(([k, v]) => {
          const key = _internal(k, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          });
          const value = _internal(v, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          });
          return !isUndefined(key) && !isUndefined(value)
            ? [key, value]
            : undefined;
        })
        .filter((item) => !isUndefined(item));

      // remove empty arrays recursively
      if (removeEmptyArrays) {
        newArray = newArray.filter((v) => !isEmptyArray(v));
      }

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
      return newArray;
    }

    if (isArray(input)) {
      const newArray = input
        .map((item) =>
          _internal(item, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
      return newArray;
    }

    if (isObject(input)) {
      const newObject: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(input)) {
        const convertedValue = _internal(value, {
          removeEmptyObjects,
          removeEmptyArrays,
          isRoot: false
        });
        if (!isUndefined(convertedValue)) {
          newObject[key] = convertedValue;
        }
      }

      if (removeEmptyObjects && isEmptyObject(newObject)) {
        return isRoot ? {} : undefined;
      }

      return newObject;
    }

    return undefined;
  }

  return _internal(input, {
    removeEmptyObjects,
    removeEmptyArrays,
    isRoot: true
  });
}
