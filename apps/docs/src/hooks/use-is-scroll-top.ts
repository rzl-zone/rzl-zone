"use client";

import { useEffect, useState } from "react";

/** ------------------------------------------------------------
 * * ***Detects whether the window is near the top of the page.***
 * ------------------------------------------------------------
 *
 * This hook listens to the window scroll position and determines
 * whether the user is currently near the top of the page.
 *
 * A threshold of `10px` is used to account for minor offsets.
 *
 * @param params - Configuration object.
 * @param params.enabled - Whether the scroll listener is active.
 * @defaultValue `true`
 *
 * @returns
 * - `true` → when `window.scrollY < 10`
 * - `false` → when scrolled beyond threshold
 * - `undefined` → before initial calculation or when disabled
 *
 * @remarks
 * - Attaches a `scroll` event listener to `window`.
 * - Invokes the listener immediately to set initial state.
 * - Returns `undefined` if `enabled` is `false` or before mount.
 * - Intended for client-side usage only.
 *
 * @example
 * ```ts
 * const isTop = useIsScrollTop({});
 *
 * if (isTop) {
 *   // user is at top
 * }
 * ```
 *
 * @example
 * ```ts
 * const isTop = useIsScrollTop({ enabled: isActive });
 * ```
 */
export function useIsScrollTop({ enabled = true }: { enabled?: boolean }) {
  const [isTop, setIsTop] = useState<boolean | undefined>();

  useEffect(() => {
    if (!enabled) return;

    const listener = () => {
      setIsTop(window.scrollY < 10);
    };

    listener();
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [enabled]);

  return isTop;
}
