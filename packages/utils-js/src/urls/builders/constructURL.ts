import { isURL } from "@/predicates/is/isURL";
import { isError } from "@/predicates/is/isError";
import { isNumber } from "@/predicates/is/isNumber";
import { isString } from "@/predicates/is/isString";
import { isFunction } from "@/predicates/is/isFunction";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyValue } from "@/predicates/is/isEmptyValue";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { normalizeString } from "@/strings/sanitizations/normalizeString";

import { assertIsArray } from "@/assertions/objects/assertIsArray";

import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";
import { toStringArrayUnRecursive } from "@/conversions/arrays/casts/toStringArrayUnRecursive";

/** ----------------------------------------------------------
 * * ***Type-Utility: `QueryParamPairs`.***
 * ----------------------------------------------------------
 * **Represents a non-empty array of key–value pairs.**
 * @description
 * Type for `queryParams` parameter, the second parameter of ***`constructURL` utility function***.
 * - **Behavior:**
 *    - Each inner tuple strictly follows the `[string, string | number]` shape.
 *    - Ensures the outer array contains **at least one pair** (non-empty).
 *    - Commonly used for URL construction parameters,
 *      query string segments, or other key–value structured data.
 * @example
 * // ✅ valid usage
 * const params: QueryParamPairs = [
 *   ["foo", 1],
 *   ["bar", "baz"]
 * ];
 * constructURL("https://example.com", params);
 *
 * // ❌ invalid: must contain at least one item
 * const empty: QueryParamPairs = [];
 *
 * // ❌ invalid: key without value pairs.
 * const empty2: QueryParamPairs = [["key"]];
 */
export type QueryParamPairs = [
  [string, string | number],
  ...[string, string | number][]
];

/** ---------------------------------
 * * ***Utility: `constructURL`.***
 * ---------------------------------
 * **Constructs a valid URL with optional query parameters and allows selective removal of duplicate parameters.**
 * @param {string | URL} baseUrl The base URL to build upon. Must include protocol (e.g., `"https://"`), `domain`, and may include port and existing query parameters.
 * @param {Iterable<[string, string]> | URLSearchParamsIterator<[string, string]> | QueryParamPairs} [queryParams]
 *   Additional query parameters to append or overwrite on the URL.
 *   - Accepts any iterable of key-value pairs (like `new URLSearchParams().entries()` and `[[string, string | number]...]`).
 * @param {string[]} [removeParams]
 *   A list of query parameter keys to remove from the final URL, whether they were in the base URL or provided queryParams.
 * @returns {URL} A new URL object representing the constructed URL with merged and cleaned query parameters.
 * @throws **{@link TypeError | `TypeError`}** if `baseUrl` is not a valid non-empty string or URL object, or if `queryParams` is not iterable, or if `removeParams` is not an array of strings.
 * @example
 *    1. #### Basic Usage:
 * ```ts
 *   constructURL(
 *     "https://example.com/path",
 *     new URLSearchParams({ a: "1", b: "2" }).entries()
 *   );
 *   // ➔ URL { href: "https://example.com/path?a=1&b=2", ... }
 * ```
 *    2. #### Remove parameters from Base and Added:
 * ```ts
 *   // with new URLSearchParams({ ... }).entries();
 *   constructURL(
 *     "https://example.com/path?foo=1&bar=2",
 *     new URLSearchParams({ bar: "ignored", baz: "3" }).entries(),
 *     ["bar"]
 *   );
 *   // ➔ URL { href: "https://example.com/path?foo=1&baz=3", ... }
 *
 *   // with [[string, string | number]...]
 *   constructURL(
 *     "https://example.com/path?foo=1&bar=2",
 *     [["bar", "ignored"],["baz", 3]],
 *     ["bar"]
 *   );
 *   // ➔ URL { href: "https://example.com/path?foo=1&baz=3", ... }
 *
 *   const params: QueryParamPairs = [
 *     ["foo", 1],
 *     ["bar", 2],
 *     ["baz", 3]
 *   ];
 *
 *   constructURL("https://example.com", params, ["bar"]);
 *   // ➔ URL { href: "https://example.com/?foo=1&baz=3", ... }
 * ```
 */
export const constructURL = (
  baseUrl: string | URL,
  queryParams?:
    | URLSearchParamsIterator<[string, string | number]>
    | QueryParamPairs,
  removeParams?: string[]
): URL => {
  if (isString(baseUrl)) {
    if (isEmptyString(baseUrl)) {
      throw new TypeError(
        "First parameter (`baseUrl`) cannot be an empty-string."
      );
    }
    baseUrl = normalizeString(baseUrl);
  } else if (!isURL(baseUrl)) {
    throw new TypeError(
      `First parameter (\`baseUrl\`) must be of type an URL instance or a \`string\` and a non empty-string, but received: \`${getPreciseType(
        baseUrl
      )}\`, with current value: \`${safeStableStringify(baseUrl, {
        keepUndefined: true
      })}\`.`
    );
  }

  // Check removeParams
  if (!isUndefined(removeParams)) {
    assertIsArray(removeParams, {
      message: ({ currentType, validType }) =>
        `Third parameter (\`removeParams\`) must be of type \`${validType} of strings\`, but received: \`${currentType}\`.`
    });

    if (!removeParams.every((param) => isNonEmptyString(param))) {
      throw new TypeError(
        "Third parameter (`removeParams`) must be of type `array` and contains `string` only and non empty-string."
      );
    }
  }

  try {
    // Check queryParams
    if (
      !isUndefined(queryParams) &&
      !isFunction(queryParams[Symbol.iterator])
    ) {
      throw new TypeError(
        `Second parameter (\`queryParams\`) must be iterable (like URLSearchParams.entries() or an array of [[string, string | number]...]), but received: \`${getPreciseType(
          queryParams
        )}\`, with value: \`${safeStableStringify(queryParams, {
          keepUndefined: true
        })}\`.`
      );
    }

    const urlInstance = new URL(baseUrl);

    // Add query parameters if provided
    if (!isUndefined(queryParams)) {
      const paramObject = Object.fromEntries(queryParams);

      if (!isEmptyValue(paramObject)) {
        // existing params
        const mergedParams = new URLSearchParams(urlInstance.search);

        // add / overwrite from queryParams
        for (const [key, value] of Object.entries(paramObject)) {
          if (
            !isNonEmptyString(value) &&
            !isNumber(value, { includeNaN: true })
          ) {
            throw new TypeError(
              `Second parameter (\`queryParams\`) must be iterable (like URLSearchParams.entries() or an array of [[string, string | number]...]), but received: \`${getPreciseType(
                queryParams
              )}\`, with value: \`${safeStableStringify(queryParams, {
                keepUndefined: true
              })}\`.`
            );
          }

          mergedParams.set(key, String(value));
        }

        // Remove specific query parameters if needed
        if (removeParams?.length) {
          toStringArrayUnRecursive(removeParams).map((paramKey) => {
            mergedParams.delete(paramKey);
          });
        }

        urlInstance.search = mergedParams.toString();
      }
    }

    // Remove query parameters directly from URL if needed
    removeParams?.forEach((param) => urlInstance.searchParams.delete(param));

    return urlInstance;
  } catch (error) {
    if (isError(error)) throw error;

    throw new Error(
      "Failed to construct a valid URL in `constructURL()`, Error:" + error,
      { cause: error }
    );
  }
};
