/** -------------------------------------------------------------------
 * * ***Ensures that a given path string starts with a leading slash (`/`).***
 * --------------------------------------------------------------------
 *
 * This utility normalizes page or route paths by guaranteeing
 * a leading slash.
 *
 * If the provided path already starts with `/`, it is returned
 * unchanged. Otherwise, a leading slash is prepended.
 *
 * - **Behavior:**
 *      - Returns the original path if it already starts with `/`
 *      - Prepends `/` when the path is missing a leading slash
 *      - Does not modify any other part of the path
 *
 * @param path - The page or route path to normalize.
 *
 * @returns A normalized path string that always starts with `/`.
 *
 * @example
 * ```ts
 * ensureLeadingSlash("dashboard");
 * // => "/dashboard"
 *
 * ensureLeadingSlash("/settings");
 * // => "/settings"
 * ```
 */
export function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
