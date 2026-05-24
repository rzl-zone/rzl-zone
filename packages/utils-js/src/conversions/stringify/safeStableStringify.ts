import { createMessage } from "@/_private/logger";

import { isSet } from "@/predicates/is/isSet";
import { isMap } from "@/predicates/is/isMap";
import { isNaN } from "@/predicates/is/isNaN";
import { isDate } from "@/predicates/is/isDate";
import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isSymbol } from "@/predicates/is/isSymbol";
import { isNumber } from "@/predicates/is/isNumber";
import { isObject } from "@/predicates/is/isObject";
import { isBigInt } from "@/predicates/is/isBigInt";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isFunction } from "@/predicates/is/isFunction";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNumberObject } from "@/predicates/is/isNumberObject";
import { isStringObject } from "@/predicates/is/isStringObject";
import { isBooleanObject } from "@/predicates/is/isBooleanObject";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isInfinityNumber } from "@/predicates/is/isInfinityNumber";

/** ------------------------------------------------------------------------------------
 * * ***Type Options for **{@link safeStableStringify | `safeStableStringify`}**.***
 * -------------------------------------------------------------------------------------
 */
type SafeStableStringifyOptions = {
  /** ----------------------------------------------------------------------------------
   * * ***Whether to sort **object keys** alphabetically (recursively).***
   * -----------------------------------------------------------------------------------
   *
   * - `true` ***(default)***: object keys are sorted to ensure stable output.
   * - `false`: preserves original insertion order of keys.
   *
   * ---
   * @default true
   */
  sortKeys?: boolean;
  /** ----------------------------------------------------------------------------------
   * * ***Whether to sort **primitive values inside arrays**.***
   * -----------------------------------------------------------------------------------
   *
   * - `true`: primitive values in arrays are sorted to ensure stable output.
   * - `false` ***(default)***: arrays retain their original order; objects and nested arrays
   *    are not reordered.
   *
   * ---
   * @default false
   */
  sortArray?: boolean;
  /** ----------------------------------------------------------------------------------
   * * ***Whether to pretty-print JSON output with 2-space indentation.***
   * -----------------------------------------------------------------------------------
   *
   * - `true`: output is formatted with indentation and newlines.
   * - `false` ***(default)***: produces compact single-line JSON.
   *
   * ---
   * @default false
   */
  pretty?: boolean;
  /** ----------------------------------------------------------------------------------
   * * ***Preserve `undefined` values instead of converting them to `null`.***
   * -----------------------------------------------------------------------------------
   * **Controls how the internal `deepProcess` step rewrites values
   * **before** the final `JSON.stringify` call.**
   *
   * - **Default (`false`):**
   *      - Every `undefined` value (object properties **and** array elements)
   *        is replaced with `null` **before** serialization, because this happens
   *        first, the key is **not removed** by `JSON.stringify`.
   * - **`true`** – Leaves `undefined` untouched so the final
   *   `JSON.stringify` call behaves natively:
   *      - Object properties with `undefined` are **removed**.
   *      - Array elements that are `undefined` become `null`.
   *
   * ---
   * @default
   * ```ts
   * false
   * ```
   *
   * ---
   * @example
   * 1. #### keepUndefined = true: behaves like native JSON.stringify:
   *    ```ts
   *    safeStableStringify({ a: undefined }, { keepUndefined: true });
   *    // ➔ '{}' (key removed)
   *    ```
   *    ---
   * 2. #### Default (false) - convert undefined to null, key kept:
   *    ```ts
   *    safeStableStringify({ a: undefined });
   *    // ➔ '{"a":null}' (key present, value null)
   *    ```
   *    ---
   * 3. #### Arrays:
   *    ```ts
   *    safeStableStringify([undefined]);
   *    // ➔ '[null]' (same, but via pre-replacement)
   *    safeStableStringify([undefined], { keepUndefined: true });
   *    // ➔ '[null]' (element becomes null)
   *    ```
   */
  keepUndefined?: boolean;
};

/** ---------------------------------------------------------------------------------------------------------------
 * * ***Utility: `safeStableStringify`.***
 * ----------------------------------------------------------------------------------------------------------------
 * **Safely converts a JavaScript value into a stable, JSON-compatible string.**
 *
 * ---
 * - **This function is an enhanced version of `JSON.stringify` with additional guarantees:**
 *      - ***Features:***
 *           - Recursively sorts object keys **only if** `sortKeys` is `true` (default: `true`), to ensure stable
 *             key order.
 *               - If `sortKeys` is `false`, preserves the original insertion order of object keys.
 *           - Optionally sorts array primitive values **only if** `sortArray` is `true` (default: `false`).
 *           - Only primitive values in arrays are sorted.
 *           - Objects and nested arrays keep their original position and are appended after sorted primitives.
 *           - If `sortArray` is `false`, arrays retain their original order.
 *           - Converts JavaScript special values for JSON safety:
 *               - `undefined`, `NaN`, `Infinity`, `-Infinity` ➔ `null`.
 *               - `BigInt` ➔ string (JSON does not support BigInt).
 *           - Converts boxed primitives box into their primitive equivalents:
 *               - `new Number(42)` ➔ `Number(42)` ➔ `42`.
 *               - `new String("hi")` ➔ `String("hi")` ➔ `"hi"`.
 *               - `new Boolean(true)` ➔ `Boolean(true)` ➔ `true`.
 *           - Functions and Symbols are removed.
 *           - Circular references are replaced with the string `"[Circular]"`.
 *           - Serializes:
 *               - `Date` ➔ ISO string (`date.toISOString()`).
 *               - `Set` ➔ `{ set: [values...] }` (values are recursively processed).
 *               - `Map` ➔ `{ map: [ [key, value], ... ] }` (values are recursively processed).
 *           - Compared to `JSON.stringify`, this ensures **stable output**:
 *               - Same object structure always produces the same string.
 *               - Useful for deep equality checks, hashing, caching keys, or snapshot tests.
 *           - Controls how `undefined` is handled **before** the final `JSON.stringify` call, by `keepUndefined`
 *             options, default: `false`.
 *               - **false**: All `undefined` values (object properties and array elements) are replaced
 *               with `null`, so object keys remain.
 *               - **true**: Leaves `undefined` values as-is, and handling by native `JSON.stringify` then:
 *                    1. Removes object properties that are `undefined`.
 *                    2. Converts `undefined` array elements to `null`.
 *               - Use `true` when you need native removal of keys or to preserve sparse arrays
 *                 exactly as `JSON.stringify` would.
 *
 * ---
 * @param {*} value
 *   ***Any JavaScript value to serialize, can be:***
 *      - Primitives (`number`, `string`, `boolean`, `bigint`, `null`, `undefined`).
 *      - Boxed primitives (`new Number()`, `new String()`, `new Boolean()`).
 *      - Arrays, plain objects, nested structures.
 *      - Date, Map, Set.
 *      - Circular structures.
 * @param {SafeStableStringifyOptions} [options]
 *   ***Configuration options for `safeStableStringify`:***
 *      - `keepUndefined` ***(boolean)*** – Control how `undefined` is handled **before** the final `JSON.stringify`
 *         call, default: `false`.
 *      - `sortKeys` ***(boolean)*** – Whether to sort object keys alphabetically (recursively), default: `true`.
 *      - `sortArray` ***(boolean)*** – Whether to sort primitive values inside arrays, default: `false`.
 *      - `pretty` ***(boolean)*** – Whether to pretty-print JSON output with 2-space indentation, default: `false`.
 *
 * ---
 * @throws **{@link TypeError | `TypeError`}** if `sortKeys`, `sortArray`, or `pretty` are not strictly boolean.
 *
 * ---
 * @returns {string}
 *   A stable JSON string representation of the input value.
 *
 * ---
 * @example
 * 1. #### Basic object key sorting:
 *    ```ts
 *    safeStableStringify({
 *      b: 2,
 *      a: 1
 *    });
 *    // ➔ '{"a":1,"b":2}'
 *    ```
 *    ---
 * 2. #### Disable key sorting:
 *    ```ts
 *    safeStableStringify(
 *      {
 *        b: 2,
 *        a: 1
 *      },
 *      {
 *        sortKeys: false
 *      }
 *    );
 *    // ➔ '{"b":2,"a":1}'
 *    ```
 *    ---
 * 3. #### Sort array values:
 *    ```ts
 *    safeStableStringify(
 *      [3, 1, 2],
 *      {
 *        sortArray: true
 *      }
 *    );
 *    // ➔ '[1,2,3]'
 *    ```
 *    ---
 * 4. #### keepUndefined enabled:
 *    ```ts
 *    safeStableStringify(
 *      { a: undefined },
 *      {
 *        keepUndefined: true
 *      }
 *    );
 *    // ➔ '{}'
 *    ```
 *    ---
 * 5. #### Default keepUndefined behavior:
 *    ```ts
 *    safeStableStringify({
 *      a: undefined
 *    });
 *    // ➔ '{"a":null}'
 *    ```
 *    ---
 * 6. #### Nested object with sorted arrays:
 *    ```ts
 *    safeStableStringify(
 *      {
 *        z: [3, 1, 2],
 *        x: {
 *          d: 4,
 *          c: 3
 *        }
 *      },
 *      {
 *        sortKeys: true,
 *        sortArray: true
 *      }
 *    );
 *    // ➔ '{"x":{"c":3,"d":4},"z":[1,2,3]}'
 *    ```
 *    ---
 * 7. #### Disable key sorting but keep array sorting:
 *    ```ts
 *    safeStableStringify(
 *      {
 *        z: [3, 1, 2],
 *        x: {
 *          d: 4,
 *          c: 3
 *        }
 *      },
 *      {
 *        sortKeys: false,
 *        sortArray: true
 *      }
 *    );
 *    // ➔ '{"z":[1,2,3],"x":{"d":4,"c":3}}'
 *    ```
 *    ---
 * 8. #### Pretty print output:
 *    ```ts
 *    safeStableStringify(
 *      [3, 1, 2],
 *      {
 *        sortArray: true,
 *        pretty: true
 *      }
 *    );
 *    // ➔ [
 *    //      1,
 *    //      2,
 *    //      3
 *    //    ]
 *    ```
 *    ---
 * 9. #### Boxed primitives converted to primitive values:
 *    ```ts
 *    safeStableStringify({
 *      n: new Number(42),
 *      s: new String("hi"),
 *      b: new Boolean(true)
 *    });
 *    // ➔ '{"n":42,"s":"hi","b":true}'
 *    ```
 *    ---
 * 10. #### Handles Date, BigInt, Map, and Set:
 *     ```ts
 *     safeStableStringify({
 *       time: new Date("2025-01-01"),
 *       big: BigInt(9007199254740991),
 *       data: new Map([
 *         ["key", new Set([1, 2])]
 *       ])
 *     });
 *     // ➔ '{"big":"9007199254740991","data":{"map":[["key",{"set":[1,2]}]]},"time":"2025-01-01T00:00:00.000Z"}'
 *     ```
 *     ---
 * 11. #### Remove functions and symbols:
 *     ```ts
 *     safeStableStringify({
 *       f: () => {},
 *       s: Symbol("wow")
 *     });
 *     // ➔ '{}'
 *     ```
 *     ---
 * 12. #### Convert undefined, NaN, and Infinity:
 *     ```ts
 *     safeStableStringify([
 *       undefined,
 *       NaN,
 *       Infinity,
 *       -Infinity
 *     ]);
 *     // ➔ '[null,null,null,null]'
 *     ```
 *     ---
 * 13. #### Handle circular references:
 *     ```ts
 *     const obj = {
 *       name: "A"
 *     };
 *
 *     obj.self = obj;
 *
 *     safeStableStringify(obj);
 *     // ➔ '{"name":"A","self":"[Circular]"}'
 *     ```
 *     ---
 * 14. #### Complex nested array sorting:
 *     ```ts
 *     const arr = [
 *       9,
 *       7,
 *       [4, 2, 3],
 *       { z: [5, 1, 6] }
 *     ];
 *
 *     safeStableStringify(arr, {
 *       sortArray: true,
 *       sortKeys: true
 *     });
 *
 *     // ➔ '[7,9,[2,3,4],{"z":[1,5,6]}]'
 *     ```
 */
export const safeStableStringify = (
  value: unknown,
  options: SafeStableStringifyOptions = {}
): string => {
  if (!isPlainObject(options)) options = {};

  const pretty = options.pretty ?? false;
  const sortKeys = options.sortKeys ?? true;
  const sortArray = options.sortArray ?? false;
  const keepUndefined = options.keepUndefined ?? false;

  if (
    !isBoolean(sortKeys) ||
    !isBoolean(sortArray) ||
    !isBoolean(pretty) ||
    !isBoolean(keepUndefined)
  ) {
    throw new TypeError(
      createMessage(
        "safeStableStringify",
        `Parameters \`sortKeys\`, \`sortArray\`, \`keepUndefined\` and \`pretty\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: "['sortKeys': \`${getPreciseType(
          sortKeys
        )}\`, 'sortArray': \`${getPreciseType(
          sortArray
        )}\`, 'keepUndefined': \`${getPreciseType(
          keepUndefined
        )}\`, 'pretty': \`${getPreciseType(pretty)}\`]".`
      )
    );
  }

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
    console.warn(createMessage("safeStableStringify", String(err)));
    return "{}";
  }
};
