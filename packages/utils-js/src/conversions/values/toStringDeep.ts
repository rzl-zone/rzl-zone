import type {
  ConvertedDeepString,
  ToStringDeepOptions
} from "./_private/toStringDeep.types";

import { createMessage } from "@/_private/logger";

import { isNaN } from "@/predicates/is/isNaN";
import { isNil } from "@/predicates/is/isNil";
import { isSet } from "@/predicates/is/isSet";
import { isMap } from "@/predicates/is/isMap";
import { isDate } from "@/predicates/is/isDate";
import { isArray } from "@/predicates/is/isArray";
import { isBuffer } from "@/predicates/is/isBuffer";
import { isObject } from "@/predicates/is/isObject";
import { isRegExp } from "@/predicates/is/isRegExp";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isTypedArray } from "@/predicates/is/isTypedArray";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNumberObject } from "@/predicates/is/isNumberObject";
import { isStringObject } from "@/predicates/is/isStringObject";
import { isBooleanObject } from "@/predicates/is/isBooleanObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isInfinityNumber } from "@/predicates/is/isInfinityNumber";

/** ---------------------------------------------------------------------------------------------------
 * * ***Utility: `toStringDeep`.***
 * ----------------------------------------------------------------------------------------------------
 * **Converts all values in an array, object, Set, Map, or deeply nested structure to string.**
 *
 * ---
 * - **Features:**
 *      - Converts numbers and strings to string:
 *        - `3.5` ➔ `"3.5"`.
 *        - `"3.5"` ➔ `"3.5"`.
 *      - Converts boolean to string:
 *        - `true` ➔ `"true"`.
 *        - `false` ➔ `"false"`.
 *      - Converts Date to ISO string (`Date ➔ string`).
 *      - Converts RegExp to string (e.g., `/abc/ ➔ "/abc/"`).
 *      - Converts `Buffer`, `TypedArray`, `Set`, `Map`, and `arrays` recursively to `arrays of strings`.
 *      - Converts boxed primitives box into their primitive equivalents then convert to string:
 *        - For `new String` we convert everything to string (behavior JS of new String):
 *          - `new String("hi")` ➔ `.valueOf()` ➔ `"hi"`.
 *          - `new String(true)` ➔ `.valueOf()` ➔ `"true"`.
 *        - For `new Boolean` we convert to boolean (behavior JS of new Boolean) then convert to string:
 *          - `new Boolean(true)` ➔ `.valueOf()` ➔ `true` ➔ `true.toString()` ➔ `"true"`.
 *          - Special behavior JS of new Boolean, return `false` **(convert to string: `"false"`)**
 *            for `false`, (`0` / `-0`), `""` (empty-string), `null`, `undefined`, `NaN`, otherwise
 *            `true` **(convert to string: `"true"`)**.
 *        - For `new Number`:
 *          - `new Number(42)` ➔ `.valueOf()` ➔ `42` ➔ `42.toString()` ➔ `"42"`.
 *          - `new Number("42")` ➔ `.valueOf()` ➔ `42` ➔ `42.toString()` ➔ `"42"`.
 *          - `new Number(null)` ➔ `.valueOf()` ➔ `0` (`null` is `0` behavior JS of new Number) ➔ `0.toString()` ➔ `"0"`.
 *          - If result from `valueOf()` is `NaN` or `Infinity` ***(will removing)***:
 *            - `new Number(NaN)` ➔ `.valueOf()` ➔ `NaN` ***(remove)***.
 *            - `new Number("abc")` ➔ `.valueOf()` ➔ `NaN`  ***(remove)***.
 *            - `new Number(undefined)` ➔ `.valueOf()` ➔ `NaN` ***(remove)***.
 *            - `new Number(Infinity)` ➔ `.valueOf()` ➔ `Infinity` ***(remove)***.
 *            - `new Number(-Infinity)` ➔ `.valueOf()` ➔ `-Infinity` ***(remove)***.
 *      - Recursively processes `nested objects`, `arrays`, `buffers`, `sets`, `maps`, and `typed arrays`.
 *      - Removes `null`, `undefined`, `NaN`, `Infinity`, `-Infinity`.
 *      - Removes `unsupported` types like `functions`, `symbols`, and `BigInt`.
 *      - Can optionally remove empty arrays (`[]`) and/or empty objects (`{}`) **recursively**.
 *
 * ---
 * @template T - The input data type (`primitive`, `object`, `array`, `Set`, `Map`, or `any nested combination`).
 * @template RemoveEmptyObjects - If `true`, empty objects `{}` will be removed recursively.
 * @template RemoveEmptyArrays - If `true`, empty arrays `[]` will be removed recursively (including arrays nested in `objects` / `arrays` / `Sets` / `Maps`).
 *
 * ---
 * @param {*} input - The data to convert.
 * @param {ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>} [options] - Conversion options.
 *
 * ---
 * @returns {ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>|undefined}
 * The transformed data, or `undefined` if the entire structure becomes empty after processing.
 *
 * ---
 * @example
 *
 * 1. #### Simple array conversion:
 *    ```ts
 *    toStringDeep([1, "2", 3]);
 *    // ➔ ["1", "2", "3"]
 *    ```
 *    ---
 * 2. #### Simple top-level conversion:
 *    ```ts
 *    toStringDeep(123);
 *    // ➔ "123"
 *
 *    toStringDeep("123");
 *    // ➔ "123"
 *
 *    toStringDeep(true);
 *    // ➔ "true"
 *
 *    toStringDeep(false);
 *    // ➔ "false"
 *    ```
 *    ---
 * 3. #### Nested arrays:
 *    ```ts
 *    toStringDeep([
 *      1,
 *      ["2", [3, [null, "4", true, false]]]
 *    ]);
 *    // ➔ ["1", ["2", ["3", ["4", "true", "false"]]]]
 *    ```
 *    ---
 * 4. #### Object with nested values:
 *    ```ts
 *    toStringDeep({
 *      a: 1,
 *      b: "2",
 *      c: {
 *        d: 3,
 *        e: null,
 *        f: true,
 *        g: false
 *      }
 *    });
 *    // ➔ {
 *    //      a: "1",
 *    //      b: "2",
 *    //      c: {
 *    //        d: "3",
 *    //        f: "true",
 *    //        g: "false"
 *    //      }
 *    //    }
 *    ```
 *    ---
 * 5. #### Remove empty objects:
 *    ```ts
 *    toStringDeep(
 *      { a: {}, b: "1" },
 *      { removeEmptyObjects: true }
 *    );
 *    // ➔ { b: "1" }
 *    ```
 *    ---
 * 6. #### Remove empty arrays recursively:
 *    ```ts
 *    toStringDeep(
 *      ["1", [], { a: [] }],
 *      { removeEmptyArrays: true }
 *    );
 *    // ➔ ["1", { a: [] }]
 *    ```
 *    ---
 * 7. #### Remove empty objects and arrays recursively:
 *    ```ts
 *    toStringDeep(
 *      {
 *        a: {},
 *        b: [],
 *        c: [{ d: {}, e: [] }, "1"]
 *      },
 *      {
 *        removeEmptyObjects: true,
 *        removeEmptyArrays: true
 *      }
 *    );
 *    // ➔ { c: ["1"] }
 *    ```
 *    ---
 * 8. #### Fully empty structure returns undefined:
 *    ```ts
 *    toStringDeep(
 *      [null, undefined, {}],
 *      {
 *        removeEmptyObjects: true,
 *        removeEmptyArrays: true
 *      }
 *    );
 *    // ➔ undefined
 *    ```
 */
export function toStringDeep(
  input?: null | undefined,
  options?: ToStringDeepOptions<boolean, boolean>
): undefined;
export function toStringDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  options?: ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
): ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
export function toStringDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  options?: ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
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
      ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
    > & {
      isRoot: boolean;
    }
  ): unknown {
    if (isNil(input) || isInfinityNumber(input)) return undefined;

    const { removeEmptyArrays, removeEmptyObjects, isRoot } = options;

    if (!isBoolean(removeEmptyObjects) || !isBoolean(removeEmptyArrays)) {
      throw new TypeError(
        createMessage(
          "toStringDeep",
          `Parameters \`removeEmptyObjects\` and \`removeEmptyArrays\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: ['removeEmptyObjects': \`${getPreciseType(
            removeEmptyObjects
          )}\`, 'removeEmptyArrays': \`${getPreciseType(removeEmptyArrays)}\`].`
        )
      );
    }

    if (isNumber(input) || isString(input) || isBoolean(input))
      return String(input);

    if (isNumberObject(input)) {
      const valOf = input.valueOf();
      return isInfinityNumber(valOf) || isNaN(valOf)
        ? undefined
        : valOf.toString();
    }
    if (isStringObject(input)) return input.valueOf();
    if (isBooleanObject(input)) return input.valueOf().toString();

    if (isDate(input, { skipInvalidDate: true })) {
      try {
        return input.toISOString();
      } catch {
        return input.toString();
      }
    }

    if (isRegExp(input)) return input.toString();

    if (isBuffer(input)) {
      return Array.from(input)
        .map((v) => String(v))
        .filter((v) => !isUndefined(v));
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
          .map((v) => String(v))
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
          .map((v) => String(v))
          .filter((item) => !isUndefined(item));

        if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
        return newArray;
      }
    }

    if (isSet(input)) {
      const arr = Array.from(input)
        .map((v) =>
          _internal(v, { removeEmptyObjects, removeEmptyArrays, isRoot: false })
        )
        .filter((v) => !isUndefined(v));
      if (removeEmptyArrays && isEmptyArray(arr)) return undefined;
      return arr;
    }

    // Map ➔ array of [key, value]
    if (isMap(input)) {
      const arr = Array.from(input.entries())
        .map(([k, v]) => [
          _internal(k, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          }),
          _internal(v, { removeEmptyObjects, removeEmptyArrays, isRoot: false })
        ])
        .filter(([k, v]) => !isUndefined(k) && !isUndefined(v));
      if (removeEmptyArrays && isEmptyArray(arr)) return undefined;
      return arr;
    }

    if (isArray(input)) {
      let newArray = input
        .map((item) =>
          _internal(item, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));

      // remove empty arrays recursively
      if (removeEmptyArrays) {
        newArray = newArray.filter((v) => !(isArray(v) && v.length === 0));
      }

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
        } else if (isArray(value) && !removeEmptyArrays) {
          // preserve empty array property
          newObject[key] = [];
        }
      }

      if (removeEmptyObjects && Object.keys(newObject).length === 0) {
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
