/** ------------------------------------------
 * * **Utility: `shallowCompareProps`.**
 * -------------------------------------------
 * Performs a **shallow comparison** between two sets of props
 * to determine whether a React component should re-render.
 *
 * - Only compares **own enumerable keys**.
 * - Allows ignoring specific keys via `ignoreKeys`.
 * - Returns `true` if props are **equal** (skip re-render),
 *   or `false` if props differ (trigger re-render).
 *
 * @template T - The props object type.
 *
 * @param prevProps - Previous props received by the component.
 * @param nextProps - Next props received by the component.
 * @param [ignoreKeys=[]] - List of prop keys to exclude from comparison.
 *
 * @returns `true` if props are equal (shallow), otherwise `false`.
 *
 * @example
 * shallowCompareProps({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * shallowCompareProps({ a: 1 }, { a: 2 }); // false
 * shallowCompareProps({ a: 1, skip: 10 }, { a: 1, skip: 20 }, ["skip"]); // true
 */
export function shallowCompareProps<T extends object>(
  prevProps: T,
  nextProps: T,
  ignoreKeys: string[] = []
): boolean {
  const prevKeys = Object.keys(prevProps).filter(
    (key) => !ignoreKeys.includes(key)
  );
  const nextKeys = Object.keys(nextProps).filter(
    (key) => !ignoreKeys.includes(key)
  );

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key as keyof T] !== nextProps[key as keyof T]) {
      return false;
    }
  }
  return true;
}
