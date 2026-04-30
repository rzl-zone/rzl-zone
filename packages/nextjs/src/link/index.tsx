"use client";

import React from "react";
import { slug } from "github-slugger";
import { usePathname, useRouter } from "next/navigation";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";

import { isDevEnv } from "@rzl-zone/core/env/node";
import { logErrorOnce } from "@rzl-zone/core/logging/once";
import {
  formatStringOrUrl,
  formatWithValidation,
  getSafeUrl
} from "@rzl-zone/core/url";

import {
  getPreciseType,
  isEmptyString,
  isNonEmptyString,
  isPlainObject,
  isString,
  isURL
} from "@rzl-zone/utils-js/predicates";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

export type LinkCustomType = Omit<
  React.ComponentPropsWithRef<typeof NextLink>,
  "prefetch"
> & {
  /**
   * If the href is an external URL
   *
   * automatically determined by default
   */
  external?: boolean;
  /**
   * If the href is a hash-only URL
   *
   * automatically determined by default
   */
  toHashOnly?: boolean;

  /**
   * Automatically generate GitHub-style slug for hash-only links (`#heading-text`)
   * when the raw hash is not slugified.
   *
   * Useful for MDX/Markdown heading anchors.
   *
   * @default true
   */
  withAutoSlugger?: boolean;

  /**
   * Prefetch the page in the background.
   * Any `<Link />` that is in the viewport (initially or through scroll) will be prefetched.
   * Prefetch can be disabled by passing `prefetch={false}`. Prefetching is only enabled in production.
   *
   * In App Router:
   * - "auto", null, undefined (default): For statically generated pages, this will prefetch the full React Server Component data. For dynamic pages, this will prefetch up to the nearest route segment with a [`loading.js`](https://nextjs.org/docs/app/api-reference/file-conventions/loading) file. If there is no loading file, it will not fetch the full tree to avoid fetching too much data.
   * - `true`: This will prefetch the full React Server Component data for all route segments, regardless of whether they contain a segment with `loading.js`.
   * - `false`: This will not prefetch any data, even on hover.
   *
   * In Pages Router:
   * - `true` (default): The full route & its data will be prefetched.
   * - `false`: Prefetching will not happen when entering the viewport, but will still happen on hover.
   * @default `true` (pages router) or `null` (app router)
   */
  prefetch?: NextLinkProps["prefetch"] | "onHover";
  /**
   * @default "https://github.com/rzl-zone"
   */
  defaultUrlOnInvalid?: string;

  scrollBehavior?: {
    intoView: ScrollIntoViewOptions;
  };
};

const isDev = isDevEnv();
const prefetchedCache = new Set<string>();

/** Extends Link from next/link with default prefetch from context */
export const LinkCustom: React.FC<LinkCustomType> = ({
  href: rawHref,
  withAutoSlugger = true,
  prefetch: overridePrefetch,
  external,
  toHashOnly,
  onClick: userOnClick,
  onMouseEnter: userOnMouseEnter,
  children,
  scrollBehavior,
  defaultUrlOnInvalid = "https://github.com/rzl-zone",
  ...props
}: LinkCustomType) => {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const resolvedHref = React.useMemo(() => {
    if (!isString(rawHref) && !isPlainObject(rawHref) && isDev) {
      logErrorOnce(
        `Component <LinkCustom /> property \`href\` in page \`${pathname}\` is required must be as a string or UrlObject, but received type: \`${getPreciseType(
          rawHref
        )}\`, with value: \`${safeStableStringify(rawHref, { keepUndefined: true })}\`.`
      );
    }

    if (isString(rawHref) && isEmptyString(rawHref) && isDev) {
      logErrorOnce(
        `Component <LinkCustom /> property \`href\` \`${pathname}\` is required and cant be empty string if is as a string, but received value: \`${safeStableStringify(
          rawHref,
          { keepUndefined: true }
        )}\`.`
      );
    } else if (isPlainObject(rawHref) && isDev) {
      return formatWithValidation(rawHref, {
        currentPathname: pathname,
        componentName: "LinkCustom"
      });
    }

    return formatStringOrUrl(rawHref);
  }, [rawHref, pathname, isDev]);

  const isExternal =
    external ?? /^[a-z][a-z0-9+.-]*:|^\/\//i.test(resolvedHref);

  const isHashOnly =
    toHashOnly ?? (resolvedHref.startsWith("#") && !/^\w+:/.test(resolvedHref));

  const finalPrefetch = overridePrefetch;

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
      userOnMouseEnter?.(e);

      if (!finalPrefetch || finalPrefetch !== "onHover") return;

      try {
        const hrefStr = finalHref;
        if (!hrefStr.startsWith("/")) return;

        // Small delay to avoid spam on rapid hover
        if (!prefetchedCache.has(hrefStr)) {
          prefetchedCache.add(hrefStr);
          timerRef.current = setTimeout(() => {
            router.prefetch(hrefStr);
          }, 300);
        }
      } catch {
        /* ignore invalid */
      }
    },
    [finalPrefetch, finalHref, userOnMouseEnter, router]
  );

  // Internal link with optional hash scroll
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      userOnClick?.(e);

      const hrefStr = finalHref;
      const url = getSafeUrl(hrefStr);
      const hashUrl = url?.hash;

      if (isHashOnly || (hashUrl && hashUrl.length > 1)) {
        e.preventDefault();
        window.history.pushState(null, "", hashUrl);

        const target = hashUrl
          ? document.getElementById(hashUrl.slice(1))
          : null;
        if (target) {
          target.scrollIntoView(scrollBehavior?.intoView);
        }
      }
    },
    [finalHref, isHashOnly, userOnClick, scrollBehavior?.intoView]
  );

  // clean-up timeRef
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (isDevEnv()) prefetchedCache.clear();
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
        finalPrefetch === "onHover" ? false : finalPrefetch
      }
      onClick={handleClick}
    >
      {children}
    </NextLink>
  );
};
