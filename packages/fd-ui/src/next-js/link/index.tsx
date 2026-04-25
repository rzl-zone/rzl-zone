"use client";

import React from "react";
import { slug } from "github-slugger";
import { usePathname, useRouter } from "next/navigation";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import {
  getPreciseType,
  isEmptyString,
  isNonEmptyString,
  isPlainObject,
  isString,
  isURL
} from "@rzl-zone/utils-js/predicates";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import { isProdEnv } from "@rzl-zone/core/env/node";
import { logErrorOnce } from "@rzl-zone/core/logging/once";
import {
  formatStringOrUrl,
  formatWithValidation,
  getSafeUrl
} from "@rzl-zone/core/url";

import { useMainRzlFumadocs } from "@/providers/main-rzl-fumadocs";

export type FumaNextLinkType = Omit<
  React.ComponentPropsWithRef<typeof NextLink>,
  "prefetch"
> & {
  /** If the href is an external URL
   *
   * automatically determined by default
   */
  external?: boolean;
  /** If the href is a hash-only URL
   *
   * automatically determined by default
   */
  toHashOnly?: boolean;

  /** Automatically generate GitHub-style slug for hash-only links (`#heading-text`)
   * when the raw hash is not slugified.
   *
   * Useful for MDX/Markdown heading anchors.
   *
   * @default true
   */
  withAutoSlugger?: boolean;

  /** Prefetch the page in the background.
   * Any `<Link />` that is in the viewport (initially or through scroll) will be prefetched.
   * Prefetch can be disabled by passing `prefetch={false}`. Prefetching is only enabled in production.
   *
   * In App Router:
   * - `"auto"`, `null`, `undefined` (**default**): For statically generated pages, this will prefetch the full React Server Component data. For dynamic pages, this will prefetch up to the nearest route segment with a [`loading.js`](https://nextjs.org/docs/app/api-reference/file-conventions/loading) file. If there is no loading file, it will not fetch the full tree to avoid fetching too much data.
   * - `true`: This will prefetch the full React Server Component data for all route segments, regardless of whether they contain a segment with `loading.js`.
   * - `false`: This will not prefetch any data, even on hover.
   * - `"onHover"`:
   *   - Disables viewport-based prefetching.
   *   - Prefetching will only be triggered when the user **hovers** over the link.
   *   - Useful for reducing background network usage while still keeping navigation responsive.
   *
   * In Pages Router:
   * - `true` (default): The full route & its data will be prefetched.
   * - `false`: Prefetching will not happen when entering the viewport, but will still happen on hover.
   * - `"onHover"`:
   *   - Disables viewport-based prefetching.
   *   - Prefetching will only be triggered when the user **hovers** over the link.
   *   - Useful for reducing background network usage while still keeping navigation responsive.
   *
   * @default `true` (pages router) or `null` (app router)
   */
  prefetch?: NextLinkProps["prefetch"] | "onHover";
  /** @default "https://github.com/rzl-zone" */
  defaultUrlOnInvalid?: string;
  /** @default -1 */
  tabIndex?: number;
};

const isProd = isProdEnv();
const prefetchedCache = new Set<string>();

/** ----------------------------------------------------------
 * * ***Component: `FumaNextLink`.***
 * ----------------------------------------------------------
 * **Extended wrapper around Next.js
 *   **[`next/link`](https://nextjs.org/docs/api-reference/next/link)** component.**
 *
 * Provides enhanced control over prefetch behavior, safe navigation
 * handling, and documentation-oriented defaults for internal, hash-only,
 * and external links.
 *
 * ---
 *
 * ***✨ Features***
 *
 * - **Centralized default prefetch configuration**
 *   via `MainRzlFumadocsProvider`.
 * - **Explicit `"onHover"` prefetch mode**
 *   with manual throttling and request deduplication.
 * - **Safe handling of navigation edge cases**, including:
 *    - External URLs.
 *    - Hash-only (`#anchor`) links.
 * - **Optional GitHub-style slug generation**
 *   for hash anchors (useful for MDX / Markdown headings).
 *
 * ---
 *
 * ***🚀 Prefetch Behavior***
 *
 * This component supports all native Next.js prefetch modes:
 * `true`, `false`, `"auto"`, and introduces a custom **`"onHover"`** mode.
 *
 * - **Default behavior**
 *   follows Next.js semantics (viewport-based prefetching in production).
 *
 * - **When `prefetch="onHover"`:**
 *    - Viewport-based prefetching is **disabled**.
 *    - Prefetching is triggered **only on hover events**.
 *    - Prefetch requests are **throttled and deduplicated**
 *      to avoid redundant network calls.
 *    - Prefetching runs **only in production**,
 *      matching Next.js default behavior.
 *
 * > **Important:**
 * > User-provided `onMouseEnter` handlers are **always executed**,
 * > but **cannot cancel or override** the `"onHover"` prefetch logic.
 * > To change this behavior, the `prefetch` prop itself must be updated.
 *
 * ---
 *
 * ***🔗 Hash-only Navigation***
 *
 * - Hash-only links (e.g. `#section`) **do not trigger route navigation**.
 * - Scrolling is handled manually using scroll behavior settings
 *   provided by `MainRzlFumadocsProvider`.
 * - Optional automatic slug generation ensures consistent
 *   and predictable anchor IDs.
 *
 * ---
 *
 * ***🌍 External Links***
 *
 * - External URLs are automatically detected
 *   unless explicitly overridden via props.
 * - Opened in a new tab with safe defaults:
 *    - `target="_blank"`
 *    - `rel="noopener noreferrer"`
 *
 * ---
 *
 * ***📚 Intended Usage***
 *
 * Designed as a **drop-in replacement for `next/link`**
 * in documentation-heavy or navigation-dense applications,
 * where **explicit prefetch control** and **predictable navigation
 * semantics** are required.
 */
export const FumaNextLink: React.FC<FumaNextLinkType> = ({
  href: rawHref,
  withAutoSlugger = true,
  prefetch: overridePrefetch,
  external,
  toHashOnly,
  onClick: userOnClick,
  onMouseEnter: userOnMouseEnter,
  children,
  defaultUrlOnInvalid = "https://github.com/rzl-zone",
  tabIndex = -1,
  ...props
}: FumaNextLinkType) => {
  const router = useRouter();
  const pathname = usePathname();
  const { link, scrollBehavior } = useMainRzlFumadocs();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const resolvedHref = React.useMemo(() => {
    if (!isString(rawHref) && !isPlainObject(rawHref) && !isProd) {
      logErrorOnce(
        `Component <FumaNextLink /> property \`href\` in page \`${pathname}\` is required must be as a string or UrlObject, but received type: \`${getPreciseType(
          rawHref
        )}\`, with value: \`${safeStableStringify(rawHref, { keepUndefined: true })}\`.`
      );
    }

    if (isString(rawHref) && isEmptyString(rawHref) && !isProd) {
      logErrorOnce(
        `Component <FumaNextLink /> property \`href\` \`${pathname}\` is required and cant be empty string if is as a string, but received value: \`${safeStableStringify(
          rawHref,
          { keepUndefined: true }
        )}\`.`
      );
    } else if (isPlainObject(rawHref) && !isProd) {
      return formatWithValidation(rawHref, {
        currentPathname: pathname,
        componentName: "FumaNextLink"
      });
    }

    return formatStringOrUrl(rawHref);
  }, [rawHref, pathname, isProd]);

  const isExternal =
    external ?? /^[a-z][a-z0-9+.-]*:|^\/\//i.test(resolvedHref);

  const isHashOnly =
    toHashOnly ?? (resolvedHref.startsWith("#") && !/^\w+:/.test(resolvedHref));

  const finalPrefetchMode = overridePrefetch ?? link.prefetch;

  // optional: generate slug if needed
  const finalHref = React.useMemo(() => {
    if (withAutoSlugger && isHashOnly) {
      const rawHash = resolvedHref.startsWith("#")
        ? resolvedHref.slice(1)
        : resolvedHref;
      return `#${slug(rawHash, false)}`;
    }
    return resolvedHref;
  }, [resolvedHref, withAutoSlugger, isHashOnly]);

  // Merge Next.js prefetch + manual fallback prefetch on hover with throttle
  const handleMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const isOnHover = finalPrefetchMode === "onHover";

      if (isOnHover && isProd) {
        try {
          if (finalHref.startsWith("/") && !prefetchedCache.has(finalHref)) {
            prefetchedCache.add(finalHref);

            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }

            timerRef.current = setTimeout(() => {
              router.prefetch(finalHref);
            }, 300);
          }
        } catch {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      }

      userOnMouseEnter?.(e);
    },
    [finalPrefetchMode, finalHref, userOnMouseEnter, router]
  );

  // Internal link with optional hash scroll
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      userOnClick?.(e);

      const hrefStr = finalHref;
      const url = getSafeUrl(hrefStr);
      const hashUrl = url?.hash;

      if (!isExternal && (isHashOnly || (hashUrl && hashUrl.length > 1))) {
        e.preventDefault();
        window.history.pushState(null, "", hashUrl);

        const target = hashUrl
          ? document.getElementById(hashUrl.slice(1))
          : null;
        if (target) {
          target.scrollIntoView(scrollBehavior.intoView);
        }
      }
    },
    [finalHref, isHashOnly, userOnClick, scrollBehavior.intoView, isExternal]
  );

  // clean-up timeRef
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Handle external link
  if (isExternal) {
    const urlObj = getSafeUrl(finalHref);

    const hrefSafe = isNonEmptyString(finalHref)
      ? finalHref
      : isPlainObject(finalHref) && isURL(urlObj)
        ? urlObj.toString()
        : defaultUrlOnInvalid;

    return (
      <a
        {...props}
        href={hrefSafe}
        target="_blank"
        tabIndex={tabIndex}
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={userOnMouseEnter}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      {...props}
      href={finalHref}
      onMouseEnter={handleMouseEnter}
      prefetch={
        /* handled manually by `handleMouseEnter` */
        finalPrefetchMode === "onHover" ? false : finalPrefetchMode
      }
      onClick={handleClick}
      tabIndex={tabIndex}
    >
      {children}
    </NextLink>
  );
};
