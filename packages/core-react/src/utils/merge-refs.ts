import type { Ref, RefCallback } from "react";

/** -------------------------------------------------------------------
 * * ***Merges multiple React refs into a single ref callback,
 * allowing them to be assigned simultaneously.***
 * --------------------------------------------------------------------
 *
 * This utility enables safe composition of refs when multiple components,
 * hooks, or consumers need access to the same underlying DOM element
 * or component instance.
 *
 * It supports both:
 * - **Callback refs**.
 * - **Mutable object refs** (`RefObject`).
 *
 * - **Behavior:**
 *    - Invokes all function refs with the provided value.
 *    - Assigns the value to `.current` for object refs.
 *    - Safely ignores `undefined` refs.
 *    - Preserves invocation order from left to right.
 *
 * This is especially useful in **React** when combining forwarded refs
 * with internal refs.
 *
 * @typeParam T - The type of the ref value (e.g. `HTMLDivElement`).
 * @param inputRefs - A list of refs to merge. Each ref may be a callback,
 * a ref object, or `undefined`.
 *
 * @returns A single `RefCallback` that updates all provided refs.
 *
 * @example
 * ```tsx
 * const localRef = useRef<HTMLDivElement>(null);
 *
 * function Component(props: { ref?: Ref<HTMLDivElement> }) {
 *   return (
 *     <div ref={mergeRefs(localRef, props.ref)} />
 *   );
 * }
 * ```
 */
export function mergeRefs<T>(
  ...inputRefs: (Ref<T> | undefined)[]
): Ref<T> | RefCallback<T> {
  // 1. Filter out falsy values (null, undefined, false)
  const filteredInputRefs = inputRefs.filter(Boolean);

  // 2. Early return optimization: if 0 or 1 ref is provided, return it directly
  if (filteredInputRefs.length <= 1) {
    return filteredInputRefs[0] || null;
  }

  // 3. If multiple refs are provided, merge them into a single callback function
  return function mergedRefs(value: T | null) {
    for (const inputRef of filteredInputRefs) {
      if (typeof inputRef === "function") {
        inputRef(value);
      } else if (inputRef) {
        inputRef.current = value;
      }
    }
  };
}

/** -------------------------------------------------------------------
 * * ***Merges multiple React refs into a single ref callback,
 * allowing them to be assigned simultaneously.***
 * --------------------------------------------------------------------
 *
 * @deprecated use `mergeRefs` instead.
 */
export function mergeRefsDeprecated<T>(
  ...refs: (Ref<T> | undefined)[]
): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
  };
}
