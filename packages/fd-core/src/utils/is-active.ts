import { type UrlObject } from "url";
import { formatStringOrUrl } from "@rzl-zone/core/url";
import { normalizePathname } from "@rzl-zone/utils-js/urls";

import { type SidebarTab } from "./get-sidebar-tabs";

// function normalize(url: UrlObject | string) {
//   url = formatStringOrUrl(url);
//   if (url.length > 1 && url.endsWith("/")) return url.slice(0, -1);
//   return url;
// }

/** --------------------------------------------------------------------------
 * * ***Check whether a URL is active against a given pathname.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Normalizes both `url` and `pathname`.
 *    - Compares the normalized values for equality.
 *    - Optionally checks nested path matching.
 *
 * ---
 *
 * ⚙️ ***Matching behavior:***
 * - Returns `true` if the normalized URL equals the pathname.
 * - If `nested` is enabled, returns `true` when the pathname
 *   starts with the URL followed by a slash.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Trailing slashes are normalized before comparison.
 * - Matching is case-insensitive after normalization.
 * - Designed for routing and navigation state detection.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Active link detection
 *    - Sidebar and navigation logic
 *    - Nested route matching
 *
 * @param url - Target URL to compare.
 * @param pathname - Current pathname.
 * @param nested - Whether nested routes should be considered active, default: `true`.
 *
 * @returns
 * `true` if the URL is considered active, otherwise `false`.
 *
 * @example
 * ```ts
 * isActive("/docs", "/docs/getting-started");
 * ```
 *
 * @example
 * ```ts
 * isActive("/docs", "/docs", false);
 * ```
 */
export function isActive(
  url: UrlObject | string,
  pathname: string,
  nested = true
): boolean {
  url = normalizePathname(formatStringOrUrl(url));
  pathname = normalizePathname(formatStringOrUrl(pathname));

  return url === pathname || (nested && pathname.startsWith(`${url}/`));
}

/** --------------------------------------------------------------------------
 * * ***Determine whether a sidebar tab is active.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Checks active state based on a predefined set of URLs.
 *    - Falls back to direct URL comparison when no URL set exists.
 *
 * ---
 *
 * ⚙️ ***Matching behavior:***
 * - If `tab.urls` is provided, checks membership against the normalized pathname.
 * - Otherwise, delegates matching logic to {@link isActive | **`isActive`**}.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Pathname normalization is applied before matching.
 * - Supports nested route detection.
 * - Intended for sidebar navigation state only.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Sidebar tab highlighting
 *    - Navigation state resolution
 *    - Documentation menus
 *
 * @param tab - Sidebar tab configuration.
 * @param pathname - Current pathname.
 *
 * @returns
 * `true` if the tab is considered active, otherwise `false`.
 *
 * @example
 * ```ts
 * isTabActive(tab, "/docs/api");
 * ```
 */
export function isTabActive(tab: SidebarTab, pathname: string) {
  if (tab.urls)
    return tab.urls.has(normalizePathname(formatStringOrUrl(pathname)));

  return isActive(tab.url, pathname, true);
}
