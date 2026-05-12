import type {
  DedupeArrayOptions,
  DedupeResult,
  ForceToStringOptions
} from "./_private/dedupeArray.types";

import { isSet } from "@/predicates/is/isSet";
import { isMap } from "@/predicates/is/isMap";
import { isArray } from "@/predicates/is/isArray";
import { isEqual } from "@/predicates/is/isEqual";

import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { assertIsArray } from "@/assertions/objects/assertIsArray";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { toStringDeepForce } from "@/conversions/values/toStringDeepForce";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

/** ----------------------------------------------------------
 * * ***Utility: `dedupeArray`.***
 * ---------------------------------------------
 * **Deduplicates values in an array (with optional flattening and deep stringification).**
 * - Supports various modes for converting values to strings before deduplication:
 *    - `"stringOrNumber"`: Converts strings and numbers to strings.
 *    - `"primitives"`: Converts all primitives (string, number, boolean, bigint, null, undefined, NaN) to strings.
 *    - `"all"`: Converts all values (primitives, objects, Maps, Sets, Symbols, RegExp, Dates, Errors, Promises, functions)
 *   to strings, including nested object properties.
 *    - `false` (default): No conversion applied.
 * - Options:
 *    - `forceToString`: Enables string conversion for comparison, default is `false`.
 *    - `flatten`: If true, deeply flattens arrays, Maps, and Sets before deduplication, default is `false`.
 * @template ForceToString - `forceToString` mode.
 * @template Flattening - `flatten` mode.
 * @param {unknown[]} inputArray - The array to deduplicate, can be deeply nested and contain any mix of types.
 * @param {DedupeArrayOptions<ForceToString, Flattening>|undefined} [options] - Options to control string conversion.
 * @returns {DedupeResult<ForceToString, Flattening>} Deduplicated array with optional transformations.
 * @throws **{@link TypeError | `TypeError`}** if the input is not an array, or options is not an object, or if `forceToString` is invalid.
 * @example
 * ```ts
 * dedupeArray(["apple", "banana", "apple"]);
 * // ➔ ["apple", "banana"]
 * dedupeArray([[1, 2], [1, 2]], { flatten: true });
 * // ➔ [1, 2]
 * dedupeArray([new Set([1, 2]), new Set([2, 3])], { flatten: true });
 * // ➔ [1, 2, 3]
 * dedupeArray([1, "1", 2, "2"], {
 *    forceToString: "stringOrNumber"
 * }); // ➔ ["1", "2"]
 * dedupeArray([true, "true", false, undefined], {
 *    forceToString: "primitives"
 * }); // ➔ ["true", "false", "undefined"]
 * dedupeArray([1, "1", { a: 1 }], {
 *    forceToString: "all"
 * }); // ➔ ["1", { a: "1" }]
 * dedupeArray([1, 1, [2, 2, [3, 3]]]);
 * // ➔ [1, [2, [3]]]
 * dedupeArray([null, undefined, null]);
 * // ➔ [null, undefined]
 * dedupeArray([[], [[]], [[[]]], [[]], [[[]]]]);
 * // ➔ [[], [[]], [[[]]]]
 * const fn = () => 1;
 * dedupeArray([fn, fn, () => 1]);
 * // ➔ [fn, () => 1] cause: ref () => 1 and fn is different but ref const `fn` and `fn` is same ref.
 * dedupeArray([Symbol("x"), Symbol("x")]);
 * // ➔ [Symbol("x")] (symbols are same by identity, so dedupe
 * dedupeArray([NaN, NaN, 1, "1"]);
 * // ➔ [NaN, 1, "1"]
 * dedupeArray([NaN, NaN, 1, "1"], {
 *    forceToString: "primitives"
 * }); // ➔ ["NaN", "1"]
 * dedupeArray([new Date("2025-01-01"), new Date("2025-01-01")]);
 * // ➔ [Date("2025-01-01")] (same time, deduped)
 * dedupeArray([new Date("2025-01-01"), new Date("2025-01-01")], {
 *    forceToString: "all"
 * }); // ➔ ["2025-01-01T00:00:00.000Z"]
 * dedupeArray([/abc/, /abc/], {
 *    forceToString: "all"
 * }); // ➔ ["/abc/"]
 * dedupeArray([new Map(), new Set(), new Error("err")], {
 *    forceToString: "all"
 * }); // ➔ ["[object Map]", "[object Set]", "Error: err"]
 * dedupeArray([Promise.resolve(1), Promise.resolve(1)], {
 *    forceToString: "all"
 * }); // ➔ ["[object Promise]"]
 * dedupeArray([{ a: 1 }, { a: 1 }, { a: 2 }], {
 *    forceToString: "primitives"
 * }); // ➔ [{ a: "1" }, { a: "2" }]
 * dedupeArray([{ a: { b: 1 } }, { a: { b: 1 } }], {
 *    forceToString: "all"
 * }); // ➔ [{ a: { b: "1" } }]
 * dedupeArray("not an array");
 * // ➔ Throws TypeError
 * dedupeArray([1, 2, 3], {
 *    forceToString: "invalid"
 * }); // ➔ Throws TypeError
 * ```
 */
export const dedupeArray = <
  ForceToString extends ForceToStringOptions = false,
  Flattening extends boolean = false
>(
  inputArray: unknown[],
  options: DedupeArrayOptions<ForceToString, Flattening> = {}
): DedupeResult<ForceToString, Flattening> => {
  assertIsArray(inputArray, {
    message: ({ currentType, validType }) =>
      `First parameter (\`inputArray\`) must be of type \`${validType}\` (array literal or instance), but received: \`${currentType}\`.`
  });

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const flatten = hasOwnProp(options, "flatten") ? options.flatten : false;
  const forceToString = hasOwnProp(options, "forceToString")
    ? options.forceToString
    : false;

  if (
    !(
      forceToString === false ||
      forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
    )
  ) {
    throw new TypeError(
      `Parameter \`forceToString\` property of the \`options\` (second parameter) must be of type \`false\` or \`string\` with value one of "stringOrNumber" | "primitives" | "all", but received: \`${getPreciseType(
        forceToString
      )}\`, with value: \`${safeStableStringify(forceToString, {
        keepUndefined: true
      })}\`.`
    );
  }

  assertIsBoolean(flatten, {
    message: ({ currentType, validType }) =>
      `Parameter \`flatten\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const process = (arr: unknown[]): unknown[] => {
    const seen: unknown[] = [];
    return arr.reduce<unknown[]>((acc, item) => {
      const value = isArray(item)
        ? process(item)
        : toStringDeepForce(item, forceToString);

      if (!seen.some((s) => isEqual(s, value))) {
        seen.push(value);
        acc.push(value);
      }
      return acc;
    }, []);
  };

  const deepFlatten = (value: unknown): unknown[] => {
    if (isArray(value)) {
      return value.flatMap(deepFlatten);
    }

    if (isSet(value)) {
      return [...value].flatMap(deepFlatten);
    }

    if (isMap(value)) {
      return [...value.values()].flatMap(deepFlatten);
    }

    return [value];
  };

  return (
    flatten ? process(deepFlatten(inputArray)) : process(inputArray)
  ) as DedupeResult<ForceToString, Flattening>;
};
