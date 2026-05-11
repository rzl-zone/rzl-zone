"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

type Options = {
  /** Scroll behavior when navigating.
   *
   * @default "auto"
   */
  behavior?: ScrollBehavior;

  /** If true, prevents scrolling when URL contains a hash (#anchor).
   *
   * @default true
   */
  skipHash?: boolean;

  /** Custom pathname override.
   *
   * If not provided, will use Next.js `usePathname()`.
   */
  pathname?: string;
};

/** ------------------------------------------------------------
 * * ***Scrolls window to the top on route (pathname) change.***
 * ------------------------------------------------------------
 *
 * This hook scrolls the window to the top whenever the route changes.
 *
 * By default, it uses Next.js `usePathname()` as the source of truth,
 * but you can override it by providing a custom `pathname`.
 *
 * Behavior:
 * - Skips the first render to avoid scrolling on initial page load
 * - Optionally ignores navigation when a URL hash (#anchor) is present
 * - Triggers on `pathname` changes only
 *
 * @param options - Optional configuration.
 * @param options.pathname - Custom pathname to watch. Defaults to Next.js `usePathname()`.
 * @param options.behavior - Scroll behavior passed to `window.scrollTo`.
 * @defaultValue `"auto"`
 * @param options.skipHash - Prevent scroll when URL contains a hash.
 * @defaultValue `true`
 *
 * @remarks
 * - Relies on `useEffect`, so it runs after render on the client.
 * - Only reacts to pathname changes, not query string changes.
 * - Uses a ref to skip execution on initial mount.
 *
 * @example
 * ```ts
 * useScrollTopOnRouteChange();
 * ```
 *
 * @example
 * ```ts
 * useScrollTopOnRouteChange({
 *   behavior: "smooth"
 * });
 * ```
 *
 * @example
 * ```ts
 * useScrollTopOnRouteChange({
 *   pathname: customPathname,
 *   skipHash: false
 * });
 * ```
 */
export function useScrollTopOnRouteChange(options?: Options) {
  const nextPathname = usePathname();
  const isFirstRender = useRef(true);

  const {
    behavior = "auto",
    skipHash = true,
    pathname = nextPathname
  } = options || {};

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (skipHash && isNonEmptyString(window.location.hash)) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, [pathname, behavior, skipHash]);
}
