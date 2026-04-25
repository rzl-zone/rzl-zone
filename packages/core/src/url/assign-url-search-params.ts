/** -------------------------------------------------------------------
 * * ***Assigns multiple `URLSearchParams` into a target instance,
 * replacing existing keys and preserving value order.***
 * --------------------------------------------------------------------
 *
 * This utility mutates the target `URLSearchParams` by sequentially
 * applying other `URLSearchParams` objects.
 *
 * For each provided source:
 * - Existing keys in the target are removed
 * - All entries from the source are appended
 *
 * This ensures predictable overwrite behavior while still supporting
 * multiple values per key.
 *
 * - **Behavior:**
 *      - Mutates the `target` instance in-place
 *      - Deletes existing keys before appending new values
 *      - Preserves entry order from each source
 *      - Supports duplicate keys with multiple values
 *      - Applies sources from left to right (later sources take precedence)
 *
 * This is useful when composing query parameters from multiple sources
 * such as defaults, overrides, and user input.
 *
 * @param target - The `URLSearchParams` instance to be mutated.
 * @param searchParamsList - One or more `URLSearchParams` instances
 * whose entries will be assigned to the target.
 *
 * @returns The same `target` instance after assignment.
 *
 * @example
 * ```ts
 * const base = new URLSearchParams("page=1&sort=asc");
 * const override = new URLSearchParams("page=2&filter=active");
 *
 * assignUrlSearchParams(base, override);
 * // => "page=2&filter=active&sort=asc"
 * ```
 */
export function assignUrlSearchParams(
  target: URLSearchParams,
  ...searchParamsList: URLSearchParams[]
): URLSearchParams {
  for (const searchParams of searchParamsList) {
    for (const key of searchParams.keys()) {
      target.delete(key);
    }

    for (const [key, value] of searchParams.entries()) {
      target.append(key, value);
    }
  }

  return target;
}
