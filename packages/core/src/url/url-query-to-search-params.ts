// import { type ParsedUrlQuery } from "node:querystring";
import type { ParsedUrlQuery } from "./format";

import { isArray } from "@rzl-zone/utils-js/predicates";
import { stringifyUrlQueryParam } from "./stringify-url-query-param";

/** -------------------------------------------------------------------
 * * ***Converts a Node.js `ParsedUrlQuery` object into a `URLSearchParams`
 * instance.***
 * --------------------------------------------------------------------
 *
 * This utility normalizes a query object—commonly produced by Node.js or
 * Next.js routing—into a `URLSearchParams` structure suitable for URL
 * serialization.
 *
 * It supports both single and repeated query keys, ensuring correct
 * handling of array values.
 *
 * - **Behavior:**
 *    - Iterates over all entries in the query object
 *    - Appends multiple values when a key maps to an array
 *    - Uses `stringifyUrlQueryParam` to safely normalize each value
 *    - Overwrites existing keys when the value is not an array
 *
 * This function is useful when bridging between Node-style query objects
 * and Web-standard URL APIs.
 *
 * @param query - A parsed URL query object (`ParsedUrlQuery`)
 * containing string or array-based values.
 *
 * @returns A `URLSearchParams` instance representing the same query data.
 *
 * @example
 * ```ts
 * urlQueryToSearchParams({
 *   page: "1",
 *   filter: ["active", "new"]
 * });
 * // => URLSearchParams("page=1&filter=active&filter=new")
 * ```
 */
export function urlQueryToSearchParams(query: ParsedUrlQuery): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (isArray(value)) {
      for (const item of value) {
        searchParams.append(key, stringifyUrlQueryParam(item));
      }
    } else {
      searchParams.set(key, stringifyUrlQueryParam(value));
    }
  }

  return searchParams;
}
