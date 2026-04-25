"use client";

import { useEffect, useState } from "react";

/** --------------------------------------------------------------------------
 * * ***React hook for tracking CSS media query matches.***
 * --------------------------------------------------------------------------
 *
 * - ***Primary purpose:***
 *    - Observes a CSS media query using `window.matchMedia`.
 *    - Reactively updates when the media query match state changes.
 *
 * - ***Return behavior:***
 *    - `true`  ➔ media query **matches**
 *    - `false` ➔ media query **does not match**
 *    - `null`  ➔ state not yet evaluated (initial / disabled)
 *
 * - ⚠️ ***Important behavior:***
 *    - This hook is **client-only** (`"use client"`).
 *    - The initial value is **`null`** to avoid:
 *        - SSR hydration mismatches
 *        - Accessing `window` during render
 *
 * ---
 *
 * - ***Disabled mode:***
 *    - When `disabled === true`:
 *        - No `matchMedia` listener is registered.
 *        - No state updates occur.
 *        - The hook always returns `null`.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Responsive UI logic.
 *    - Conditional rendering based on viewport size.
 *    - Feature toggles tied to media queries.
 *
 * - ❌ **Not intended for:**
 *    - Server Components.
 *    - Layout decisions that must be static during SSR.
 *
 * @param query - A valid CSS media query string.
 * @param disabled - Disables the media query listener when `true`.
 *
 * @returns
 * - `boolean` ➔ when the query has been evaluated.
 * - `null` ➔ before first evaluation or when disabled.
 *
 * @example
 * **Basic usage.**
 * ```tsx
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 *
 * if (isDesktop === null) return null;
 *
 * return <div>{isDesktop ? "Desktop" : "Mobile"}</div>;
 * ```
 *
 * @example
 * **Conditional logic with null guard.**
 * ```tsx
 * const isDark = useMediaQuery("(prefers-color-scheme: dark)");
 *
 * useEffect(() => {
 *   if (isDark === true) enableDarkMode();
 *   if (isDark === false) enableLightMode();
 * }, [isDark]);
 * ```
 *
 * @example
 * **Disabled dynamically.**
 * ```tsx
 * const isMobile = useMediaQuery(
 *   "(max-width: 640px)",
 *   isPreviewMode
 * );
 * ```
 */
export function useMediaQuery(query: string, disabled = false): boolean | null {
  const [isMatch, setMatch] = useState<boolean | null>(null);

  useEffect(() => {
    if (disabled) return;
    const mediaQueryList = window.matchMedia(query);

    const handleChange = () => {
      setMatch(mediaQueryList.matches);
    };
    handleChange();
    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [disabled, query]);

  return isMatch;
}
