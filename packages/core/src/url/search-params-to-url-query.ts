import type { ParsedUrlQuery } from "./format";

import { isArray, isUndefined } from "@rzl-zone/utils-js/predicates";

/** -------------------------------------------------------------------
 * * ***Converts a `URLSearchParams` instance into a Node.js-compatible
 * `ParsedUrlQuery` object.***
 * --------------------------------------------------------------------
 *
 * This utility transforms URL search parameters into a structure that is
 * compatible with Node.js and Next.js routing APIs.
 *
 * It correctly handles duplicate keys by aggregating them into arrays,
 * while preserving single values as strings.
 *
 * - **Behavior:**
 *    - Iterates through all entries in `URLSearchParams`
 *    - Assigns the first occurrence of a key as a string value
 *    - Aggregates duplicate keys into an array of strings
 *    - Preserves parameter insertion order
 *    - Produces output compatible with `ParsedUrlQuery`
 *
 * This is useful when bridging between browser APIs (`URLSearchParams`)
 * and server-side or routing utilities expecting `ParsedUrlQuery`.
 *
 * @param searchParams - The `URLSearchParams` instance to convert.
 *
 * @returns A `ParsedUrlQuery` object representing the same parameters.
 *
 * @example
 * ```ts
 * const params = new URLSearchParams("a=1&b=2&a=3");
 *
 * searchParamsToUrlQuery(params);
 * // => { a: ["1", "3"], b: "2" }
 * ```
 */
export function searchParamsToUrlQuery(
  searchParams: URLSearchParams
): ParsedUrlQuery {
  const query: ParsedUrlQuery = {};
  for (const [key, value] of searchParams.entries()) {
    const existing = query[key];
    if (isUndefined(existing)) {
      query[key] = value;
    } else if (isArray(existing)) {
      existing.push(value);
    } else {
      query[key] = [existing, value];
    }
  }
  return query;
}
