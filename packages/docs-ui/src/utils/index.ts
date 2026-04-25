import {
  customCnV4,
  twMergeDefaultV4,
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
  cva,
  cx
} from "class-variance-authority";

/** -------------------------------------------------------------------
 * * ***Combines multiple CSS class values into a single normalized string
 * with Tailwind CSS conflict resolution using `tw-merge` v4.***
 * --------------------------------------------------------------------
 *
 * This function is a thin wrapper around `customCnV4` and always applies
 * the default Tailwind merge configuration via `twMergeDefaultV4()`,
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
 */
export const cn = (...classes: ClassValues) => {
  return customCnV4(twMergeDefaultV4({}), ...classes);
};
