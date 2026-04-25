import {
  getPreciseType,
  isNonEmptyString,
  isPlainObject
} from "@rzl-zone/utils-js/predicates";

import { isDevEnv } from "@/env/node";
import { logErrorOnce, logWarnOnce } from "@/logging/once";

import { SLASHED_PROTOCOL_URL, URL_OBJECT_KEYS } from "./constants";
import { urlQueryToSearchParams } from "./url-query-to-search-params";

type QueryPrimitive = string | number | boolean | bigint;
type QueryValue = QueryPrimitive | ReadonlyArray<QueryPrimitive> | null;
export type QueryParams = Record<string, QueryValue | undefined>;
export type ParsedUrlQuery = Record<string, string | string[] | undefined>;

export type UrlObjectLike = {
  auth?: string | null | undefined;
  hash?: string | null | undefined;
  host?: string | null | undefined;
  hostname?: string | null | undefined;
  href?: string | null | undefined;
  pathname?: string | null | undefined;
  protocol?: string | null | undefined;
  search?: string | null | undefined;
  slashes?: boolean | null | undefined;
  port?: string | number | null | undefined;
  query?: string | null | QueryParams | undefined;
};

/** -------------------------------------------------------------------
 * * ***Formats a URL-like object into a normalized URL string.***
 * --------------------------------------------------------------------
 *
 * This function constructs a URL string from a plain object
 * representing URL components (protocol, host, pathname, query, etc).
 *
 * It follows `url.format()`-style semantics and performs low-level URL
 * assembly without relying on Node.js or WHATWG `URL` APIs.
 *
 * - **Behavior:**
 *      - Appends `:` to `protocol` when missing
 *      - Encodes authentication credentials by escaping `@` only
 *      - Resolves `host` with precedence over `hostname` and `port`
 *      - Wraps IPv6 hostnames in brackets (`[::1]`)
 *      - Serializes object-based `query` values into search params
 *      - Applies `//` when `slashes` is enabled or required by protocol
 *      - Ensures proper prefixing for `pathname`, `search`, and `hash`
 *      - Escapes `?` and `#` characters appearing inside `pathname`
 *      - Escapes `#` characters appearing inside `search`
 *
 * @param urlObj - A URL-like object describing the target URL.
 *
 * @returns A formatted URL string.
 *
 * @example
 * ```ts
 * // pathname + query object
 * formatUrl({
 *   pathname: "/search",
 *   query: { q: "test" }
 * });
 * // => "/search?q=test"
 *
 * // full URL with protocol, auth, hostname, and port
 * formatUrl({
 *   protocol: "https",
 *   auth: "user:pass",
 *   hostname: "example.com",
 *   port: 8080,
 *   pathname: "/api",
 *   query: { page: 1 }
 * });
 * // => "https://user:pass@example.com:8080/api?page=1"
 *
 * // IPv6 hostname handling
 * formatUrl({
 *   protocol: "http",
 *   hostname: "2001:db8::1",
 *   pathname: "/"
 * });
 * // => "http://[2001:db8::1]/"
 *
 * // explicit search and hash normalization
 * formatUrl({
 *   pathname: "/docs",
 *   search: "a=1",
 *   hash: "top"
 * });
 * // => "/docs?a=1#top"
 *
 * // protocol-relative URL via slashes
 * formatUrl({
 *   slashes: true,
 *   hostname: "example.com",
 *   pathname: "path"
 * });
 * // => "//example.com/path"
 * ```
 */
export function formatUrl(urlObj?: UrlObjectLike) {
  let auth = urlObj?.auth?.trim();
  let search = urlObj?.search?.trim();
  let hostname = urlObj?.hostname?.trim();

  let protocol = urlObj?.protocol?.trim() || "";
  let pathname = urlObj?.pathname?.trim() || "";
  let hash = urlObj?.hash?.trim() || "";
  let query = urlObj?.query || "";
  let host: string | false = false;

  // auth = isNonEmptyString(auth)
  //   ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@"
  //   : "";
  auth = isNonEmptyString(auth) ? auth.replace(/@/g, "%40") + "@" : "";

  if (isNonEmptyString(urlObj?.host)) {
    host = auth + urlObj.host;
  } else if (isNonEmptyString(hostname)) {
    host = auth + (~hostname.indexOf(":") ? `[${hostname}]` : hostname);
    if (urlObj?.port && isNonEmptyString(String(urlObj.port))) {
      host += ":" + urlObj.port.toString();
    }
  }

  if (isPlainObject(query)) {
    query = String(urlQueryToSearchParams(query as ParsedUrlQuery)).trim();
  }

  search = search || (query && `?${query}`) || "";

  if (isNonEmptyString(protocol) && !protocol.endsWith(":")) protocol += ":";

  if (
    urlObj?.slashes ||
    ((!isNonEmptyString(protocol) || SLASHED_PROTOCOL_URL.test(protocol)) &&
      host !== false)
  ) {
    host = "//" + (host || "");
    if (pathname && pathname[0] !== "/") pathname = "/" + pathname;
  } else if (!host) {
    host = "";
  }

  if (hash && hash[0] !== "#") hash = "#" + hash;
  if (search && search[0] !== "?") search = "?" + search;

  pathname = pathname.replace(/[?#]/g, (c) => encodeURIComponent(c));
  search = search.replace(/#/g, "%23");

  return `${protocol}${host}${pathname}${search}${hash}`;
}

/** -------------------------------------------------------------------
 * * ***Formats a `UrlObjectLike` into a URL string with optional
 * development-time validation.***
 * --------------------------------------------------------------------
 *
 * In development environments, this function validates the shape
 * and contents of the provided `UrlObjectLike` and logs helpful
 * warnings or errors for invalid usage.
 *
 * Validation includes:
 * - Ensuring the input is a plain object
 * - Warning on unknown or unsupported URL object keys
 *
 * In production environments, all validation logic is skipped
 * entirely and no logs are emitted.
 *
 * - **Behavior:**
 *      - Logs errors for non-plain-object URL inputs (dev only)
 *      - Logs warnings for unknown URL object keys (dev only)
 *      - Supports validation-only mode without formatting
 *      - Delegates final URL string construction to `formatUrl`
 *
 * @param url - A Node.js legacy `UrlObjectLike` to validate and/or format.
 *
 * @param options - Optional configuration.
 *
 * @param options.validationOnly - When `true`, performs validation
 * only and skips URL formatting.
 *
 * @param options.currentPathname - Optional page pathname used
 * to improve the clarity of debug messages.
 *
 * @param options.componentName - Optional component name used
 * to improve the clarity of debug messages.
 *
 * @returns A formatted URL string when `validationOnly` is `false`,
 * otherwise returns `void`.
 *
 * @example
 * ```ts
 * // normal formatting with validation in development
 * formatWithValidation(
 *   { pathname: "/dashboard", query: { page: "1" } },
 *   { currentPathname: "/home" }
 * );
 * // => "/dashboard?page=1"
 *
 * // validation-only mode (no return value)
 * formatWithValidation(
 *   { pathname: "/settings", foo: "bar" } as any,
 *   { validationOnly: true, componentName: "SettingsLink" }
 * );
 * // => void (logs warning in dev for unknown key "foo")
 *
 * // invalid input (dev only)
 * formatWithValidation(
 *   "/invalid" as any,
 *   { componentName: "NavLink" }
 * );
 * // => "/" (logs error in dev, still delegates to formatUrl)
 * ```
 */
export function formatWithValidation(
  url?: UrlObjectLike,
  options?: {
    validationOnly?: false;
    currentPathname?: string;
    componentName?: string;
  }
): string;
export function formatWithValidation(
  url?: UrlObjectLike,
  options?: {
    validationOnly?: true;
    currentPathname?: string;
    componentName?: string;
  }
): void;
export function formatWithValidation(
  url?: UrlObjectLike,
  {
    validationOnly = false,
    currentPathname,
    componentName
  }: {
    validationOnly?: boolean;
    currentPathname?: string;
    componentName?: string;
  } = {}
) {
  const theComponentName = isNonEmptyString(componentName)
    ? ` at \`${componentName}\``
    : "";
  const theCurrentPathname = isNonEmptyString(currentPathname)
    ? ` in page \`${currentPathname}\``
    : "";

  if (isDevEnv()) {
    if (!isPlainObject(url)) {
      logErrorOnce(
        `Error: Invalid parameter passed via urlObjectLike into url.format${theComponentName}${theCurrentPathname}, the parameter must be type of \`plain-object\`, but received: \`${getPreciseType(
          url
        )}\`.`
      );
    }

    Object.keys(url || {}).forEach((key) => {
      if (
        !URL_OBJECT_KEYS.includes(
          key as unknown as (typeof URL_OBJECT_KEYS)[number]
        )
      ) {
        logWarnOnce(
          `Warning: Unknown key (\`${key}\`) passed via urlObjectLike into url.format${theComponentName}${theCurrentPathname}.`
        );
      }
    });
  }

  if (validationOnly === false) return formatUrl(url);
}

/** --------------------------------------------------------------------
 * * ***Normalizes a flexible URL input into a predictable URL string.***
 * --------------------------------------------------------------------
 *
 * This helper accepts either a raw URL string or a URL-like object
 * and guarantees a predictable string output.
 *
 * - **Behavior:**
 *      - Returns a **non-empty string** input as-is
 *      - Returns `defaultUrl` for **empty strings** or **invalid values**
 *      - Formats a **plain `UrlObjectLike`** via {@link formatUrl | **`formatUrl`**}
 *
 * This utility is useful for APIs that accept mixed URL inputs
 * from user-land, configuration files, or framework internals.
 *
 * @param urlObjOrString - A URL value represented as either:
 *   - a non-empty URL string, or
 *   - a URL-like object
 *
 * @param defaultUrl - A fallback URL string returned when the input
 *   is empty, invalid, or undefined. Defaults to `/`.
 *
 * @returns A normalized URL string.
 *
 * @example
 * ```ts
 * // non-empty string ➔ returned as-is
 * formatStringOrUrl("/about");
 * // => "/about"
 *
 * // empty string ➔ fallback
 * formatStringOrUrl("");
 * // => "/"
 *
 * // empty string with custom fallback
 * formatStringOrUrl("", "/home");
 * // => "/home"
 *
 * // UrlObjectLike ➔ formatted
 * formatStringOrUrl({
 *   pathname: "/search",
 *   query: { q: "test" }
 * });
 * // => "/search?q=test"
 *
 * // undefined ➔ fallback
 * formatStringOrUrl(undefined);
 * // => "/"
 *
 * // invalid input ➔ fallback
 * formatStringOrUrl(123 as any, "/fallback");
 * // => "/fallback"
 * ```
 */
export function formatStringOrUrl(
  urlObjOrString?: UrlObjectLike | string,
  defaultUrl: string = "/"
): string {
  if (!isPlainObject(urlObjOrString) && !isNonEmptyString(urlObjOrString)) {
    return defaultUrl;
  }

  return isNonEmptyString(urlObjOrString)
    ? urlObjOrString
    : formatUrl(urlObjOrString);
}
