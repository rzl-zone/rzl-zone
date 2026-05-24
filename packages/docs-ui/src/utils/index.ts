import {
  customCnV4,
  cx,
  twMergeDefaultV3,
  type ClassValues
} from "@rzl-zone/utils-js/tailwind";

export {
  default as scrollIntoView,
  type CustomBehaviorOptions,
  type CustomScrollBehaviorCallback,
  type Options,
  type StandardBehaviorOptions
} from "scroll-into-view-if-needed";
export {
  type CxOptions,
  type CxReturn,
  type VariantProps,
  cva
} from "class-variance-authority";

import { twMerge } from "tailwind-merge";

/** -------------------------------------------------------------------
 * * ***Combines and merges Tailwind CSS class values into a single
 * normalized string with conflict resolution.***
 * --------------------------------------------------------------------
 *
 * This utility composes `cx` and `twMerge`:
 *
 * - `cx` handles flexible class inputs (like `clsx`)
 * - `twMerge` resolves Tailwind CSS utility conflicts
 *
 * This provides a complete solution for conditional class composition
 * with deterministic Tailwind merging.
 *
 * - **Behavior:**
 *    - Accepts strings, numbers, arrays, and objects
 *    - Supports deeply nested class structures
 *    - Ignores falsy values (`false`, `null`, `undefined`, `""`, `0`)
 *    - Includes object keys with truthy values (including inherited keys)
 *    - Unwraps boxed primitives (`new String()`, etc.)
 *    - Resolves Tailwind utility conflicts deterministically
 *    - Keeps the last conflicting class based on input order
 *    - Produces a clean, space-normalized class string
 *
 * This utility is a drop-in replacement for `clsx` or `classnames`
 * with built-in Tailwind conflict resolution.
 *
 * @param values - A list of mixed class values including strings,
 * numbers, arrays, objects, and conditional expressions.
 *
 * @returns A merged and normalized CSS class string.
 *
 * @example
 * ```ts
 * cn(
 *   "p-2",
 *   isActive && "bg-blue-500",
 *   ["text-sm", { "font-bold": isBold }],
 *   null,
 *   0
 * );
 * // => "p-2 bg-blue-500 text-sm font-bold"
 * ```
 *
 * @example
 * ```ts
 * cn("p-2 p-4", { "text-sm": true, "text-lg": true });
 * // => "p-4 text-lg"
 * ```
 */
export const cn = (...values: ClassValues) => twMerge(cx(...values));

/** -------------------------------------------------------------------
 * * ***Combines multiple CSS class values into a single normalized string
 * with Tailwind CSS conflict resolution using `tw-merge` v4.***
 * --------------------------------------------------------------------
 *
 * This function is a thin wrapper around `customCnV4` and always applies
 * the default Tailwind merge configuration via `twMergeDefaultV3()`,
 * ensuring consistent class-merging behavior across the codebase.
 *
 * - **Behavior:**
 *    - Ignores falsy conditional values (`false`, `null`, `undefined`)
 *    - Supports nested arrays of class values
 *    - Resolves Tailwind CSS utility conflicts deterministically
 *    - Preserves class order before merge resolution
 *    - Produces a clean, space-normalized class string
 *
 * This utility is commonly used as a drop-in replacement for `clsx`
 * or `classnames` with built-in Tailwind conflict handling.
 *
 * @param classes - A list of class values including strings, arrays,
 * and conditional expressions.
 *
 * @returns A merged and normalized CSS class string.
 *
 * @example
 * ```ts
 * cn(
 *   "p-2",
 *   isActive && "bg-blue-500",
 *   ["text-sm", "font-medium"],
 *   undefined,
 *   false
 * );
 * // => "p-2 bg-blue-500 text-sm font-medium"
 * ```
 *
 * @deprecated Performance issue because bug at core `@rzl-zone/utils-js/tailwind`, better use `cn` internally using `twMerge` from `tailwind-merge` or use `cn`.
 */
export const cnDeprecated = (...classes: ClassValues) => {
  return customCnV4(twMergeDefaultV3({}), ...classes);
};
