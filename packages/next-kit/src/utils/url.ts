import {
  getLocationOrigin,
  isAbsoluteUrl,
  pathHasPrefix
} from "@rzl-zone/core/url";

const basePath = (process.env.__NEXT_ROUTER_BASEPATH as string) || "";

/** -------------------------------------------------------------------
 * * ***Checks whether a given path is within the configured Next.js
 * router base path.***
 * --------------------------------------------------------------------
 *
 * This utility is typically used internally by the router to ensure
 * that navigation targets respect the configured base path.
 *
 * - **Behavior:**
 *      - Delegates prefix matching to `pathHasPrefix`
 *      - Uses the runtime router base path
 *
 * @param path - The path to check.
 *
 * @returns `true` if the path includes the base path, otherwise `false`.
 */
export function hasBasePathNextJs(path: string): boolean {
  return pathHasPrefix(path, basePath);
}

/** -------------------------------------------------------------------
 * * ***Determines whether a given URL is routable by the Next.js router
 * in the browser.***
 * --------------------------------------------------------------------
 *
 * This function distinguishes between local (same-origin) URLs and
 * external URLs, ensuring compatibility with Next.js client-side routing.
 *
 * - **Behavior:**
 *      - Treats relative URLs as local
 *      - Resolves absolute URLs against the current origin
 *      - Ensures the resolved URL matches the current origin
 *      - Ensures the pathname respects the configured base path
 *      - Returns `false` for invalid URLs
 *
 * @param url - The URL string to evaluate.
 *
 * @returns `true` if the URL is local and routable, otherwise `false`.
 *
 * @example
 * ```ts
 * isLocalURLNextJs("/about"); // true
 * isLocalURLNextJs("https://external.com"); // false
 * ```
 */
export function isLocalURLNextJs(url: string): boolean {
  if (!isAbsoluteUrl(url)) return true;

  try {
    const locationOrigin = getLocationOrigin();
    const resolved = new URL(url, locationOrigin);

    return (
      resolved.origin === locationOrigin && hasBasePathNextJs(resolved.pathname)
    );
  } catch {
    return false;
  }
}
