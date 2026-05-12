import type { NumberRangeUnion } from "@rzl-zone/ts-types-plus";

import { findDuplicates } from "./findDuplicates";

import { isNaN } from "@/predicates/is/isNaN";
import { isArray } from "@/predicates/is/isArray";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";

import { assertIsArray } from "@/assertions/objects/assertIsArray";

import { safeJsonParse } from "@/conversions/json/safeJsonParse";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

type IndexArray = NumberRangeUnion<0, 30>;
type DotPath<T, Prev extends string = ""> =
  T extends Array<infer U>
    ? DotPath<U, `${Prev}${Prev extends "" ? "" : "."}${IndexArray}`>
    : T extends object
      ? {
          [K in keyof T & string]:
            | `${Prev}${Prev extends "" ? "" : "."}${K}`
            | DotPath<T[K], `${Prev}${Prev extends "" ? "" : "."}${K}`>;
        }[keyof T & string]
      : never;

/** ------------------------------------------------------
 * * ***Utility: `omitKeysDeep`.***
 * ------------------------------------------------------
 * **Recursively omits properties from an object using dot notation paths.**
 * - **Behavior:**
 *    - Removes resulting empty objects (`{}`) and arrays (`[]`), cascading upwards
 *      to remove empty parents until root if needed.
 * - **⚠️ Be careful:**
 *    - If after omission an object or array becomes empty, it will be removed entirely
 *      including all the way up to the root if necessary, resulting in `{}`.
 * - **ℹ️ Note:**
 *    - For array indices, TypeScript autocomplete only suggests `0`–`30`
 *      (to prevent editor lag on large unions).
 *      However, higher indices are still fully supported at runtime — you can
 *      manually type `"arr.99.key"` and it will work the same.
 * @template I - Type of the input object
 * @param {I} object
 *  The object to process, should be a plain nested object or array structure.
 * @param {DotPath<I>[]} keysToOmit
 *  An array of string paths in dot notation indicating the properties to remove, paths
 *  can include numeric indices to target array elements, e.g. `"arr.0.x"` to
 *  remove `x` from the first object inside the `arr` array.
 * @returns {Partial<I>}
 *  A new deeply cloned object with the specified keys omitted, with resulting
 *  empty objects or arrays fully removed (even if it collapses to `{}`).
 * @throws **{@link TypeError | `TypeError`}** if `keysToOmit` is not an array.
 * @throws **{@link Error | `Error`}** if `keysToOmit` contains duplicate paths.
 * @example
 * omitKeysDeep({ arr: [{ a: 1 }] }, ["arr.0.a"]);
 * // ➔ {} (array becomes empty and removed)
 * omitKeysDeep({ a: { b: { c: 1 }, d: 2 }, e: 3 }, ["a.b.c"]);
 * // ➔ { a: { d: 2 }, e: 3 }
 * omitKeysDeep({ a: [{ b: 1 }, { c: 2 }] }, ["a.0.b"]);
 * // ➔ { a: [{ c: 2 }] }
 * omitKeysDeep({ a: [{ b: 1 }] }, ["a.0.b"]);
 * // ➔ {} (array becomes empty and removed)
 * omitKeysDeep({ complex: [{ deep: [{ x: 1, y: 2 }] }] }, ["complex.0.deep.0.x"]);
 * // ➔ { complex: [{ deep: [{ y: 2 }] }] }
 * omitKeysDeep({ complex: [{ deep: [{ x: 1 }] }] }, ["complex.0.deep.0.x"]);
 * // ➔ {} (deep chain emptied and collapsed)
 * omitKeysDeep({ data: [[{ foo: 1, bar: 2 }]] }, ["data.0.0.foo"]);
 * // ➔ { data: [[{ bar: 2 }]] }
 * omitKeysDeep({ data: [[{ foo: 1 }]] }, ["data.0.0.foo"]);
 * // ➔ {} (nested arrays emptied completely)
 * omitKeysDeep({ x: [{ y: [{ z: 1 }, { w: 2 }] }] }, ["x.0.y.0.z"]);
 * // ➔ { x: [{ y: [{ w: 2 }] }] }
 * omitKeysDeep({ x: [{ y: [{ z: 1 }] }] }, ["x.0.y.0.z"]);
 * // ➔ {} (entire nested arrays removed)
 * omitKeysDeep({ p: { q: { r: 5 } }, s: 6 }, ["p.q.r"]);
 * // ➔ { s: 6 } (`p` removed because it becomes empty)
 * omitKeysDeep({ arr: [{ a: 1, b: 2 }, { c: 3 }] }, ["arr.0.a"]);
 * // ➔ { arr: [{ b: 2 }, { c: 3 }] }
 * omitKeysDeep({ root: [{ sub: [{ leaf: 10 }] }] }, ["root.0.sub.0.leaf"]);
 * // ➔ {} (deep nested arrays emptied to root)
 * omitKeysDeep({ meta: { tags: ["x", "y"], count: 2 } }, ["meta.count"]);
 * // ➔ { meta: { tags: ["x", "y"] } }
 * omitKeysDeep({ arr: [[{ a: 1 }, { b: 2 }]] }, ["arr.0.0.a"]);
 * // ➔ { arr: [[{ b: 2 }]] }
 * omitKeysDeep({ arr: [[{ a: 1 }]] }, ["arr.0.0.a"]);
 * // ➔ {} (double nested emptied)
 * omitKeysDeep({ nested: [{ list: [{ id: 1, val: 2 }] }] }, ["nested.0.list.0.val"]);
 * // ➔ { nested: [{ list: [{ id: 1 }] }] }
 * omitKeysDeep({ nested: [{ list: [{ id: 1 }] }] }, ["nested.0.list.0.id"]);
 * // ➔ {} (full collapse to empty)
 * omitKeysDeep({ mixed: { a: [1, 2, 3], b: { c: 4 } } }, ["mixed.b.c"]);
 * // ➔ { mixed: { a: [1, 2, 3] } }
 */
export const omitKeysDeep = <I extends Record<string, unknown>>(
  object: I,
  keysToOmit: DotPath<I>[]
): Partial<I> => {
  if (!isPlainObject(object)) return {} as Partial<I>;

  assertIsArray(keysToOmit, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`keysToOmit\`) must be of type \`${validType}\` (array literal or instance), but received: \`${currentType}\`.`
  });

  const duplicates = findDuplicates(keysToOmit);
  if (isNonEmptyArray(duplicates)) {
    throw new Error(
      `Function "omitKeysDeep" Error: Duplicate keys detected - \`${safeStableStringify(
        duplicates,
        {
          keepUndefined: true
        }
      )}\`.`
    );
  }

  const omitAtPath = (obj: unknown, pathParts: string[]) => {
    if (!isObjectOrArray(obj)) return obj;

    const [current, ...rest] = pathParts;

    if (isEmptyArray(rest)) {
      if (isArray(obj)) {
        // Support numeric index
        const index = parseInt(current);
        if (!isNaN(index) && index in obj) {
          obj.splice(index, 1);
        }
      } else {
        delete obj[current];
      }
    } else {
      const next = obj[current];
      if (isObjectOrArray(next)) {
        obj[current] = omitAtPath(next, rest);
      }
    }
    return obj;
  };

  const deepRemoveEmptyObjects = (obj: unknown): unknown => {
    if (isArray(obj)) {
      return obj
        .map(deepRemoveEmptyObjects)
        .filter(
          (item) => !(isObjectOrArray(item) && Object.keys(item).length === 0)
        );
    }
    if (isObjectOrArray(obj)) {
      const cleaned = Object.fromEntries(
        Object.entries(obj)
          .map(([k, v]) => [k, deepRemoveEmptyObjects(v)])
          .filter(
            ([, v]) =>
              !isUndefined(v) &&
              !(isObjectOrArray(v) && Object.keys(v).length === 0)
          )
      );
      return cleaned;
    }
    return obj;
  };

  const result = safeJsonParse(safeStableStringify(object)); // clone deep to avoid mutating original
  for (const key of keysToOmit) {
    const parts = key.split(".");
    omitAtPath(result, parts);
  }

  return deepRemoveEmptyObjects(result) as Partial<I>;
};
