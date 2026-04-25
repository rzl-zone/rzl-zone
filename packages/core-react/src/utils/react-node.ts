import { isValidElement, type ReactNode } from "react";

const PORTAL_KEY = "$$typeof" as const;
const REACT_PORTAL_TYPE = Symbol.for("react.portal");

/** ---------------------------------------------------------
 * * **Utility: `isReactNode`**
 * ----------------------------------------------------------
 * **Determines whether a given value is a valid**
 * **[`ReactNode`](https://react-typescript-cheatsheet.netlify.app/docs/react-types/reactnode/)** **and therefore safely render-able by React.**
 *
 * - **ReactNode includes:**
 *    - `null` and `undefined`
 *    - Primitive renderables: `string`, `number`, `boolean`
 *      (booleans are ignored by React but allowed as children)
 *    - Any valid `ReactElement` (JSX, Fragment, memo, forwardRef, etc.)
 *    - React Portals
 *    - Arrays of ReactNode (nested arbitrarily deep)
 *    - Generic **iterables** whose elements are ReactNode
 *      (e.g. `Set`, `Map.values()`, generators)
 *
 * - **❌ Values that are **NOT** valid ReactNode:**
 *    - `bigint`, `symbol`, `function` (including async components as raw functions)
 *    - Plain objects (`{}`), unless they are valid ReactElement
 *    - `Date`, `RegExp`, `Promise`, `Map`, `WeakMap`, `WeakSet`
 *    - Any iterable whose items contain invalid ReactNode entries
 *
 * - **✔️ Behavior:**
 *    - Performs **deep recursive** validation for arrays and nested iterables.
 *    - Detects React portals via the internal `$$typeof` symbol.
 *    - Gracefully handles iteration errors—if iteration fails, returns `false`.
 *    - Fully compatible with **React 18 & 19** (including concurrent & streaming mode).
 *
 * @param {unknown} value - The input to test for ReactNode compatibility.
 *
 * @returns {boolean} - `true` if the value can be safely rendered by React, otherwise `false`.
 *
 * @example
 * isReactNode(null);                // ➔ true
 * isReactNode(undefined);           // ➔ true
 * isReactNode(<></>);               // ➔ true
 * isReactNode("hello");             // ➔ true
 * isReactNode(123);                 // ➔ true
 * isReactNode(<div />);             // ➔ true
 * isReactNode([<span key="1" />]);  // ➔ true
 * isReactNode(new Set(["a", "b"])); // ➔ true
 *
 * @example
 * isReactNode({});                  // ➔ false
 * isReactNode(Symbol("x"));         // ➔ false
 * isReactNode(() => <div />);       // ➔ false (functions are not nodes)
 * isReactNode(async () => <div />); // ➔ false (async components are functions)
 * isReactNode(new Date());          // ➔ false
 * isReactNode(Promise.resolve(1));  // ➔ false
 *
 * @example
 * // Iterable example:
 * const items = {
 *   *[Symbol.iterator]() {
 *     yield "a";
 *     yield <div />;
 *   }
 * };
 * isReactNode(items); // ➔ true
 */
export function isReactNode(value: unknown): value is ReactNode {
  return baseIsReactNode(value, new WeakSet());
}

/** @internal */
function baseIsReactNode(value: unknown, cache: WeakSet<object>): boolean {
  // null / undefined
  if (value == null) return true;

  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return true;

    // Explicit invalid primitives
    case "bigint":
    case "symbol":
    case "function":
      return false;

    case "object":
      break;
  }

  // ReactElement
  if (isValidElement(value)) return true;

  const obj = value as Record<string, unknown>;

  // Avoid re-processing (cycles)
  if (cache.has(obj)) return true;
  cache.add(obj);

  // React Portal
  if (obj?.[PORTAL_KEY] === REACT_PORTAL_TYPE) return true;

  // Non-renderable instances
  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Promise ||
    value instanceof Map ||
    value instanceof WeakMap ||
    value instanceof WeakSet
  ) {
    return false;
  }

  // Array
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!baseIsReactNode(item, cache)) return false;
    }
    return true;
  }

  // Iterable (exclude string — already handled earlier)
  const iterator = (value as { [Symbol.iterator]?: unknown })?.[
    Symbol.iterator
  ];
  if (typeof iterator === "function") {
    try {
      for (const item of value as Iterable<unknown>) {
        if (!baseIsReactNode(item, cache)) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
