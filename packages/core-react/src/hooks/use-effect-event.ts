"use client";

import * as React from "react";

type UseEffectEvent = <F extends (...params: never[]) => unknown>(
  callback: F
) => F;

/** --------------------------------------------------------------------------
 * * ***Stable event callback hook (React 19 `useEffectEvent` polyfill).***
 * --------------------------------------------------------------------------
 *
 * - ***Primary purpose:***
 *    - Provides a **stable function reference** whose implementation
 *      always reflects the **latest callback**.
 *    - Prevents stale-closure issues in effects, subscriptions,
 *      event listeners, and external APIs.
 *
 * - ***Behavior guarantees:***
 *    - The returned function identity is **stable** across renders.
 *    - The callback logic is **always up-to-date**.
 *    - Does **not** cause re-subscriptions or effect re-runs.
 *
 * ---
 *
 * - ***React version support:***
 *    - **React ≥ 19.2.x**
 *        ➔ Delegates directly to `React.useEffectEvent`.
 *    - **React < 19**
 *        ➔ Uses a safe fallback implementation based on:
 *          - `useRef` for mutable callback storage
 *          - `useCallback` for stable identity
 *
 * ---
 *
 * - ⚠️ ***Important behavior:***
 *    - This hook is **client-only**.
 *    - The returned function **must not** be used during render
 *      for reading reactive values.
 *    - Intended for **event handlers**, not render logic.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Event listeners (`addEventListener`)
 *    - Subscriptions (WebSocket, observers, stores)
 *    - Imperative APIs requiring stable callbacks
 *    - Avoiding dependency explosion in `useEffect`
 *
 * - ❌ ***Not intended for:***
 *    - Rendering-time computations
 *    - Derived state
 *    - Server Components
 *
 * @template F - Any function type with arbitrary parameters and return value.
 *
 * @param callback - The callback whose latest version should always be invoked.
 *
 * @returns
 * A **stable function reference** that always calls the latest callback.
 *
 * @example
 * **Event listener without re-subscription.**
 * ```tsx
 * const onResize = useEffectEvent(() => {
 *   console.log(window.innerWidth);
 * });
 *
 * useEffect(() => {
 *   window.addEventListener("resize", onResize);
 *   return () => window.removeEventListener("resize", onResize);
 * }, []);
 * ```
 *
 * @example
 * **Safe usage inside effects.**
 * ```tsx
 * const onMessage = useEffectEvent((msg: Message) => {
 *   setMessages(m => [...m, msg]);
 * });
 *
 * useEffect(() => {
 *   socket.subscribe(onMessage);
 *   return () => socket.unsubscribe(onMessage);
 * }, []);
 * ```
 */
export const useEffectEvent: UseEffectEvent =
  "useEffectEvent" in React
    ? { ...React }.useEffectEvent
    : <F extends (...params: never[]) => unknown>(callback: F) => {
        const ref = React.useRef(callback);
        ref.current = callback;

        return React.useCallback(
          ((...params) => ref.current(...params)) as F,
          []
        );
      };

/** --------------------------------------------------------------------------
 * * ***Legacy fallback for `useEffectEvent` (DEPRECATED).***
 * --------------------------------------------------------------------------
 *
 * ⚠️ **Deprecated**
 * - Use `useEffectEvent` from `@rzl-zone/core-react/hooks` instead.
 *
 * ---
 *
 * - ***Why this exists:***
 *    - Supports older React versions where `useEffectEvent`
 *      is not available.
 *    - Uses `useEffect` to sync the callback reference.
 *
 * ---
 *
 * - ***Key differences from React's implementation:***
 *    - Callback updates happen **after render**.
 *    - Slightly higher overhead due to `useEffect`.
 *    - Still guarantees a **stable function identity**.
 *
 * ---
 *
 * - ***Behavior guarantees:***
 *    - Returned function identity is stable.
 *    - Always invokes the latest callback.
 *    - Safe for effects and event handlers.
 *
 * ---
 *
 * - ❌ ***Limitations:***
 *    - Not concurrent-safe like the native hook.
 *    - Not recommended for new code.
 *
 * @template F - Function type to stabilize.
 *
 * @param callback - Callback whose latest version should be invoked.
 *
 * @returns
 * A stable function reference invoking the latest callback.
 *
 * @deprecated Use `useEffectEvent` from `@rzl-zone/core-react/hooks` instead.
 */
export function useEffectEventCustom<F extends (...args: never[]) => unknown>(
  callback: F
): F {
  // const ref = useRef(callback);
  // ref.current = callback;

  // return useCallback(((...params) => ref.current(...params)) as F, []);

  const ref = React.useRef(callback);

  React.useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const fn = React.useCallback((...args: never[]) => {
    return ref.current(...args) as F;
  }, []);

  return fn as F;
}
