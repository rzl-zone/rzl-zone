"use client";

import { useEffect, useRef, useState } from "react";
import {} from "@rzl-zone/core-react/hooks";

/** ------------------------------------------------------------
 * * ***Debounces a value with optional delay control.***
 * ------------------------------------------------------------
 *
 * This hook returns a debounced version of the provided `value`.
 * The value will only update after the specified delay has passed
 * without further changes.
 *
 * When `delayMs` is less than or equal to `0`, debouncing is skipped
 * entirely and the original value is returned immediately.
 *
 * @param value - The input value to debounce.
 * @param delayMs - Delay in milliseconds before updating the debounced value.
 * @defaultValue `1000`
 *
 * @returns The debounced value:
 * - If `delayMs > 0` → delayed update
 * - If `delayMs <= 0` → immediate value (no debounce)
 *
 * @remarks
 * - Internally uses `setTimeout` to schedule updates.
 * - Clears previous timers on value or delay change.
 * - Avoids unnecessary state updates when debounce is disabled.
 *
 * @example
 * ```ts
 * const debounced = useDebounce(search, 500);
 * ```
 *
 * @example
 * ```ts
 * // Disable debounce
 * const immediate = useDebounce(value, 0);
 * ```
 */
export function useDebounce<T>(value: T, delayMs = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (delayMs <= 0) return;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, delayMs]);

  // bypass state if no debounce
  return delayMs <= 0 ? value : debouncedValue;
}
