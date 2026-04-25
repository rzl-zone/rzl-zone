/** -------------------------------------------------------------------
 * * ***Parses a full path string into pathname, query, and hash segments.***
 * --------------------------------------------------------------------
 *
 * This utility is useful for client-side routing scenarios where a full
 * path string needs to be split into its logical components.
 *
 * - **Behavior:**
 *      - Extracts `pathname` before `?` or `#`
 *      - Extracts `query` including the leading `?` (if present)
 *      - Extracts `hash` including the leading `#` (if present)
 *      - Returns empty strings for missing segments
 *
 * @param path - A full path string to parse (e.g. `/foo/bar?id=1#hash`).
 *
 * @returns An object containing `pathname`, `query`, and `hash`.
 *
 * @example
 * ```ts
 * parsePath("/docs/getting-started?page=1#intro");
 * // => {
 * //   pathname: "/docs/getting-started",
 * //   query: "?page=1",
 * //   hash: "#intro"
 * // }
 * ```
 */
export function parsePath(path: string) {
  const hashIndex = path.indexOf("#");
  const queryIndex = path.indexOf("?");
  const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);

  if (hasQuery || hashIndex > -1) {
    return {
      pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
      query: hasQuery
        ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined)
        : "",
      hash: hashIndex > -1 ? path.slice(hashIndex) : ""
    };
  }

  return { pathname: path, query: "", hash: "" };
}

/** -------------------------------------------------------------------
 * * ***Checks whether a given path matches a specific prefix exactly
 * or as a parent route.***
 * --------------------------------------------------------------------
 *
 * This function ensures strict prefix matching suitable for routing
 * use cases.
 *
 * For example, a prefix of `/docs`:
 * - ✅ matches `/docs`, `/docs/`, `/docs/a`
 * - ❌ does NOT match `/docsss`
 *
 * - **Behavior:**
 *      - Ignores query strings and hash fragments
 *      - Matches exact prefix or prefix followed by `/`
 *      - Returns `false` for non-string paths
 *
 * @param path - The path to check.
 * @param prefix - The prefix to test against.
 *
 * @returns `true` if the path matches the prefix, otherwise `false`.
 *
 * @example
 * ```ts
 * pathHasPrefix("/docs/a", "/docs"); // true
 * pathHasPrefix("/docsss", "/docs"); // false
 * ```
 */
export function pathHasPrefix(path: string, prefix: string) {
  if (typeof path !== "string") {
    return false;
  }

  const { pathname } = parsePath(path);
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;

/** -------------------------------------------------------------------
 * * ***Detects whether a given URL string is absolute.***
 * --------------------------------------------------------------------
 *
 * This check is based purely on URL scheme syntax and does not validate
 * the full URL structure.
 *
 * - **Behavior:**
 *      - Returns `true` for URLs starting with a valid scheme (e.g. `http:`)
 *      - Returns `false` for relative URLs
 *
 * @param url - The URL string to test.
 *
 * @returns `true` if the URL is absolute, otherwise `false`.
 */
export const isAbsoluteUrl = (url: string) => ABSOLUTE_URL_REGEX.test(url);

/** -------------------------------------------------------------------
 * * ***Returns the current browser origin as a string.***
 * --------------------------------------------------------------------
 *
 * This helper reconstructs the origin from `window.location`,
 * including the port when present.
 *
 * - **Behavior:**
 *      - Includes protocol, hostname, and port
 *      - Omits the port when not explicitly defined
 *
 * @returns The current location origin (e.g. `https://example.com:3000`).
 */
export function getLocationOrigin() {
  if (typeof window === "undefined") return "";

  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? ":" + port : ""}`;
}

/** -------------------------------------------------------------------
 * * ***Checks whether a given path matches a specified base path
 * or is a subpath of it.***
 * --------------------------------------------------------------------
 *
 * This utility is useful for routing systems where paths need to be
 * validated against a base path prefix.
 *
 * - **Behavior:**
 *      - Returns `true` if no base path is provided
 *      - Matches exact base path or base path followed by `/`
 *      - Delegates matching logic to `pathHasPrefix`
 *
 * @param path - The path to check.
 * @param basePath - The base path to match against (optional).
 *
 * @returns `true` if the path matches the base path or no base path is set,
 * otherwise `false`.
 *
 * @example
 * ```ts
 * hasBasePath("/docs/a", "/docs"); // true
 * hasBasePath("/about", "/docs"); // false
 * hasBasePath("/anything"); // true
 * ```
 */
export function hasBasePath(path: string, basePath: string = ""): boolean {
  if (!basePath) return true;
  return pathHasPrefix(path, basePath);
}

/** -------------------------------------------------------------------
 * * ***Determines whether a given URL is local (same-origin) and
 * optionally matches a specified base path.***
 * --------------------------------------------------------------------
 *
 * This function is framework-agnostic and can be used in both browser
 * and server environments to distinguish between local and external URLs.
 *
 * - **Behavior:**
 *      - Treats relative URLs as local
 *      - Resolves absolute URLs against a provided or inferred origin
 *      - Ensures the resolved URL matches the origin (same-origin check)
 *      - Optionally validates the pathname against a base path
 *      - Returns `false` if origin cannot be determined or URL is invalid
 *
 * @param url - The URL string to evaluate.
 * @param options - Optional configuration:
 *      - `origin`: The base origin to resolve against (e.g. `https://example.com`)
 *      - `basePath`: A base path to validate against (e.g. `/docs`)
 *
 * @returns `true` if the URL is local and matches the base path (if provided),
 * otherwise `false`.
 *
 * @example
 * ```ts
 * isLocalURL("/about"); // true
 *
 * isLocalURL("https://example.com/docs", {
 *   origin: "https://example.com",
 *   basePath: "/docs"
 * }); // true
 *
 * isLocalURL("https://external.com"); // false
 * ```
 */
export function isLocalURL(
  url: string,
  options?: {
    basePath?: string;
    origin?: string;
  }
): boolean {
  if (!isAbsoluteUrl(url)) return true;

  try {
    const locationOrigin = options?.origin ?? getLocationOrigin();

    if (!locationOrigin) return false;

    const resolved = new URL(url, locationOrigin);

    if (resolved.origin !== locationOrigin) return false;

    if (options?.basePath) {
      return pathHasPrefix(resolved.pathname, options.basePath);
    }

    return true;
  } catch {
    return false;
  }
}
