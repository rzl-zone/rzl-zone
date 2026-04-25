/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

function pushProp(
  target: { [key: string]: any },
  key: string,
  value: unknown[]
): void {
  if (key === "className") {
    target.className = [target.className, value].join(" ").trim();
  } else if (key === "style") {
    target.style = { ...target.style, ...value };
  } else if (typeof value === "function") {
    const oldFn = target[key] as Function | undefined;
    target[key] = oldFn
      ? (...args: unknown[]) => {
          oldFn(...args);
          (value as Function)(...args);
        }
      : value;
  } else if (
    // skip merging undefined values
    value === undefined ||
    // skip if both value are the same primitive value
    (typeof value !== "object" && value === target[key])
  ) {
    return;
  } else if (!(key in target)) {
    target[key] = value;
  } else {
    throw new Error(
      `Didn’t know how to merge prop '${key}'. ` +
        `Only 'className', 'style', and event handlers are supported`
    );
  }
}

type MergedProps<T extends object[]> = {
  [K in keyof UnionToIntersection<T[number]>]: K extends "className"
    ? string
    : K extends "style"
      ? UnionToIntersection<T[number]>[K]
      : Exclude<Extract<T[number], { [Q in K]: unknown }>[K], undefined>;
};

/** -------------------------------------------------------------------
 * * ***Merges multiple props objects into a single props object with
 * predictable and React-friendly merging behavior.***
 * --------------------------------------------------------------------
 *
 * This utility is designed to safely merge component props where certain
 * keys require special handling instead of simple overwrites.
 *
 * - **Behavior:**
 *    - Concatenates duplicate `className` values with a single space
 *    - Shallow-merges duplicate `style` objects (later props take precedence)
 *    - Chains duplicate function values (commonly event handlers),
 *      executing them from left to right
 *    - Skips merging `undefined` values
 *    - Preserves identical primitive values without reassigning
 *    - Throws an error for unsupported duplicate keys
 *
 * Later props in the argument list always have higher precedence
 * when conflicts occur.
 *
 * This makes the function especially suitable for **React / JSX props
 * composition**, such as combining props from hooks, components,
 * and user overrides.
 *
 * @typeParam T - A tuple of props object types to be merged.
 * @param props - One or more props objects. Later objects override
 * earlier ones when applicable.
 *
 * @returns A single merged props object with correctly inferred types,
 * including special handling for `className` and `style`.
 *
 * @throws {Error} If duplicate keys other than `className`, `style`,
 * or function values are encountered.
 *
 * @example
 * ```ts
 * mergeProps(
 *   { className: "btn", onClick: () => console.log("a") },
 *   { className: "btn-primary", onClick: () => console.log("b") }
 * );
 * // => {
 * //   className: "btn btn-primary",
 * //   onClick: () => { a(); b(); }
 * // }
 * ```
 *
 * @example
 * ```ts
 * mergeProps(
 *   { style: { color: "red", fontSize: 12 } },
 *   { style: { fontSize: 14 } }
 * );
 * // => { style: { color: "red", fontSize: 14 } }
 * ```
 */
export function mergeProps<T extends object[]>(...props: T): MergedProps<T> {
  if (props.length === 1) {
    return props[0] as MergedProps<T>;
  }

  return props.reduce((merged, ps: { [key: string]: any }) => {
    for (const key in ps) {
      pushProp(merged, key, ps[key]);
    }
    return merged;
  }, {}) as MergedProps<T>;
}
