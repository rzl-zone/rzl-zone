import { type Ref, type RefCallback } from "react";
import { isFunction } from "@rzl-zone/utils-js/predicates";

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
 * - **Callback refs**
 * - **Mutable object refs** (`RefObject`)
 *
 * - **Behavior:**
 *    - Invokes all function refs with the provided value
 *    - Assigns the value to `.current` for object refs
 *    - Safely ignores `undefined` refs
 *    - Preserves invocation order from left to right
 *
 * This is especially useful in **React** when combining forwarded refs
 * with internal refs.
 *
 * @typeParam T - The type of the ref value (e.g. `HTMLDivElement`).
 * @param refs - A list of refs to merge. Each ref may be a callback,
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
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (isFunction(ref)) {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
  };
}
