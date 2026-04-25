"use client";

import { useState } from "react";

/** --------------------------------------------------------------------------
 * * ***Performs a shallow-to-recursive difference check between two values.***
 * --------------------------------------------------------------------------
 *
 * - ***Primary purpose:***
 *    - Detects whether two values are **different**.
 *    - Designed as a **lightweight comparator** for state-change detection.
 *
 * - ***Comparison behavior:***
 *    - Uses **strict inequality (`!==`)** for non-array values.
 *    - Recursively compares **arrays by index and length**.
 *
 * - ⚠️ ***Important limitations:***
 *    - ❌ Does **NOT** perform deep object comparison.
 *    - ❌ Plain objects are compared by **reference**, not by structure.
 *    - ❌ Functions, Maps, Sets, Dates, etc. are compared by reference.
 *
 * - ✅ **Safe for:**
 *    - Primitive values (`string`, `number`, `boolean`, `null`, `undefined`)
 *    - Arrays of primitives
 *    - Nested arrays (recursive)
 *
 * ---
 *
 * ℹ️ This function is intentionally simple and predictable.
 * If you need structural deep equality, use a dedicated deep-compare utility.
 *
 * ---
 *
 * - ***Common use cases:***
 *    - Detecting state changes in custom React hooks.
 *    - Lightweight comparison for dependency tracking.
 *    - Guarding side-effects against unnecessary executions.
 *
 * @param a - Previous value to compare.
 * @param b - Current value to compare.
 *
 * @returns
 * - `true`  ➔ values are different
 * - `false` ➔ values are considered equal
 *
 * @example
 * **Primitive comparison.**
 * ```ts
 * isDifferent(1, 1);        // false
 * isDifferent(1, 2);        // true
 * isDifferent("a", "a");    // false
 * isDifferent("a", "b");    // true
 * ```
 *
 * @example
 * **Array comparison.**
 * ```ts
 * isDifferent([1, 2], [1, 2]);       // false
 * isDifferent([1, 2], [2, 1]);       // true
 * isDifferent([1, 2], [1, 2, 3]);    // true
 * ```
 *
 * @example
 * **Nested arrays.**
 * ```ts
 * isDifferent([[1], [2]], [[1], [2]]); // false
 * isDifferent([[1], [2]], [[1], [3]]); // true
 * ```
 *
 * @example
 * **Object references.**
 * ```ts
 * isDifferent({ a: 1 }, { a: 1 }); // true (different references)
 *
 * const obj = { a: 1 };
 * isDifferent(obj, obj);           // false
 * ```
 *
 * @internal
 */
function isDifferent(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.length !== a.length || a.some((v, i) => isDifferent(v, b[i]));
  }

  return a !== b;
}

/** --------------------------------------------------------------------------
 * * ***Run a side-effect when a value changes (manual change detection).***
 * --------------------------------------------------------------------------
 *
 * A lightweight hook to detect changes between renders and execute
 * a callback **only when the value is considered "updated"**.
 *
 * ---
 *
 * - ***Core behavior:***
 *    - Stores the previous value internally.
 *    - Compares `previous` and `current` values on every render.
 *    - Executes `onChange(current, previous)` **synchronously**
 *      when `isUpdated(previous, current)` returns `true`.
 *
 * ---
 *
 * - ⚠️ ***Important notes:***
 *    - This hook **does NOT use `useEffect`**.
 *    - The comparison and callback run during render.
 *    - Make sure `onChange` does **not cause infinite re-renders**.
 *
 * ---
 *
 * - ***Default comparison strategy:***
 *    - Uses a shallow `!==` comparison.
 *    - Supports basic deep comparison for arrays.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Lightweight change tracking.
 *    - Controlled state synchronization.
 *    - Custom state diffing logic without `useEffect`.
 *
 * ---
 *
 * @template T - The watched value type.
 *
 * @param value
 * The current value to observe.
 *
 * @param onChange
 * Callback invoked when the value is considered changed.
 *
 * Receives:
 * - `current` — the new value.
 * - `previous` — the previous value.
 *
 * @param isUpdated
 * Optional custom comparison function.
 *
 * Determines whether the value has changed.
 * Defaults to a shallow comparison with array support.
 *
 * ---
 *
 * @example
 * **1. Detect primitive value changes.**
 * ```tsx
 * const [count, setCount] = useState(0);
 *
 * useOnChange(count, (current, prev) => {
 *   console.log("Count changed:", prev, "➔", current);
 * });
 * ```
 *
 * @example
 * **2. Detect object changes with custom comparator.**
 * ```tsx
 * type User = { id: number; name: string };
 *
 * useOnChange(
 *   user,
 *   (current, prev) => {
 *     console.log("User updated", prev, current);
 *   },
 *   (prev, current) => prev.id !== current.id
 * );
 * ```
 *
 * @example
 * **3. Sync external state without `useEffect`.**
 * ```tsx
 * useOnChange(value, (current) => {
 *   localStorage.setItem("value", JSON.stringify(current));
 * });
 * ```
 */
export function useOnChange<T>(
  value: T,
  onChange: (current: T, previous: T) => void,
  isUpdated: (prev: T, current: T) => boolean = isDifferent
): void {
  const [prev, setPrev] = useState<T>(value);

  if (isUpdated(prev, value)) {
    onChange(value, prev);
    setPrev(value);
  }
}
