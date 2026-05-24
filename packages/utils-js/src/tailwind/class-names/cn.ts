import { twMerge as twMergeV2 } from "tailwind-merge-v2";
import { twMerge as twMergeV3 } from "tailwind-merge-v3";

import { cx, type ClassValues } from "./cx";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customCnV3, customCnV4 } from "./customCn";
import { twMergeDefaultV2 } from "../tw-merge/v2/twMergeDefault";
import { twMergeDefaultV3 } from "../tw-merge/v3/twMergeDefault";

/** -------------------------------------------------------------------
 * * ***Combines and merges class utility values into a single normalized
 * string with `Tailwind CSS v3` conflict resolution.***
 * --------------------------------------------------------------------
 * This utility composes {@link cx | `cx`} and [`twMerge`](https://github.com/dcastil/tailwind-merge/tree/v2.6.0) version **2** for ***`tailwind version 3`***:
 * - `cx` handles flexible class inputs (like `clsx`).
 * - `twMerge` resolves Tailwind CSS utility conflicts.
 *
 * ---
 * This provides a complete solution for conditional class composition
 * with deterministic Tailwind merging.
 *
 * ---
 * - **Behavior:**
 *     - Accepts strings, numbers, arrays, and objects.
 *     - Supports deeply nested class structures.
 *     - Ignores falsy values (`false`, `null`, `undefined`, `""`, `0`).
 *     - Includes object keys with truthy values (including inherited keys).
 *     - Unwraps boxed primitives (`new String()`, etc.).
 *     - Resolves Tailwind utility conflicts deterministically.
 *     - Keeps the last conflicting class based on input order.
 *     - Produces a clean, space-normalized class string.
 *
 * ---
 * This utility is a drop-in replacement for `clsx` or `classnames`
 * with built-in Tailwind conflict resolution.
 *
 * ----
 * @param values - A list of mixed class values including strings,
 * numbers, arrays, objects, and conditional expressions.
 *
 * ---
 * @returns A merged and normalized CSS class string.
 *
 * ---
 * @example
 * ```ts
 * cn(
 *   "p-2",
 *   isActive && "bg-blue-500",
 *   ["text-sm", { "font-bold": isBold }],
 *   null,
 *   0
 * );
 * // ➔ "p-2 bg-blue-500 text-sm font-bold"
 * ```
 *
 * ---
 * @example
 * ```ts
 * cn("p-2 p-4", { "text-sm": true, "text-lg": true });
 * // ➔ "p-4 text-lg"
 * ```
 */
export const cnVer3 = (...values: ClassValues): string => {
  return twMergeV2(cx(...values));
};

/** -------------------------------------------------------------------
 * * ***Combines and merges class utility values into a single normalized
 * string with `Tailwind CSS v4` conflict resolution.***
 * --------------------------------------------------------------------
 * This utility composes {@link cx | `cx`} and [`twMerge`](https://github.com/dcastil/tailwind-merge/tree/v3.6.0) version **3** for ***`tailwind version 4`***:
 * - `cx` handles flexible class inputs (like `clsx`).
 * - `twMerge` resolves Tailwind CSS utility conflicts.
 *
 * ---
 * This provides a complete solution for conditional class composition
 * with deterministic Tailwind merging.
 *
 * ---
 * - **Behavior:**
 *     - Accepts strings, numbers, arrays, and objects.
 *     - Supports deeply nested class structures.
 *     - Ignores falsy values (`false`, `null`, `undefined`, `""`, `0`).
 *     - Includes object keys with truthy values (including inherited keys).
 *     - Unwraps boxed primitives (`new String()`, etc.).
 *     - Resolves Tailwind utility conflicts deterministically.
 *     - Keeps the last conflicting class based on input order.
 *     - Produces a clean, space-normalized class string.
 *
 * ---
 * This utility is a drop-in replacement for `clsx` or `classnames`
 * with built-in Tailwind conflict resolution.
 *
 * ---
 * @param values - A list of mixed class values including strings,
 * numbers, arrays, objects, and conditional expressions.
 *
 * ---
 * @returns A merged and normalized CSS class string.
 *
 * ---
 * @example
 * ```ts
 * cn(
 *   "p-2",
 *   isActive && "bg-blue-500",
 *   ["text-sm", { "font-bold": isBold }],
 *   null,
 *   0
 * );
 * // ➔ "p-2 bg-blue-500 text-sm font-bold"
 * ```
 *
 * @example
 * ```ts
 * cn("p-2 p-4", { "text-sm": true, "text-lg": true });
 * // ➔ "p-4 text-lg"
 * ```
 */
export const cnVer4 = (...values: ClassValues): string => {
  return twMergeV3(cx(...values));
};

const defaultTwMergeV2 = twMergeDefaultV2();
const defaultTwMergeV3 = twMergeDefaultV3();

/** -------------------------------------------------------------
 * * ***Default `cnV3` utility (Tailwind v3).***
 * --------------------------------------------------------------
 * **Combines class-name values and then deduplicates/resolves
 * conflicts using {@link twMergeDefaultV2 | `twMergeDefaultV2`}
 * with **Tailwind v3 default config only**.**
 *
 * ---
 * - **Use this when:**
 *     - Your project uses **Tailwind v3**.
 *     - You need a simple `cn` that works out of the box without a custom config.
 *
 * ---
 * - **Need custom rules?**
 *     - Create a project-wide helper using
 *       {@link twMergeDefaultV2 | `twMergeDefaultV2`} +
 *       {@link customCnV3 | `customCnV3`} (see Example 2).
 *
 * ---
 * @deprecated ***Still supported, but significantly slower during hydration because it uses extended runtime merge logic, prefer {@link cnVer3 | `cnVer3`} for
 * better performance, this utility may be removed in a future release.***
 *
 * ---
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 *
 * ---
 * @returns {string} Merged Tailwind class string.
 *
 * ---
 * @example
 * 1. #### Default usage (Tailwind v3):
 *      ```ts
 *      cnV3("p-2", "p-4");
 *      // ➔ "p-4"
 *
 *      cnV3("text-red-500", { "text-blue-500": true });
 *      // ➔ "text-blue-500"
 *
 *      cnV3(["m-2", ["m-4"]], "m-8");
 *      // ➔ "m-8"
 *      ```
 *      ---
 * 2. #### Custom project-wide usage with Tailwind config:
 *      ```ts
 *      import tailwindConfig from "../tailwind.config";
 *      import { twMergeDefaultV2, customCnV3, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 *      const cnApp = (...classes: ClassValues) => {
 *        return customCnV3(
 *          twMergeDefaultV2({
 *            config: tailwindConfig,
 *            extend: {
 *              classGroups: {
 *                "text-shadow": [
 *                  "text-shadow",
 *                  "text-shadow-sm",
 *                  "text-shadow-md",
 *                ],
 *              },
 *            },
 *          }),
 *          // ...other options classes,
 *        );
 *      };
 *
 *      cnApp("p-2 p-4");
 *      // ➔ "p-4"
 *      cnApp("shadow-sm shadow-md");
 *      // ➔ "shadow-md"
 *      cnApp("text-base text-xxs");
 *      // ➔ "text-xxs" (resolved from config)
 *      ```
 */
export const cnV3 = (...classes: ClassValues): string => {
  return defaultTwMergeV2(cx(...classes));
};

/** -------------------------------------------------------------
 * * ***Default `cnV4` utility (Tailwind v4).***
 * --------------------------------------------------------------
 * **Combines class-name values and then deduplicates/resolves
 * conflicts using {@link twMergeDefaultV3 | `twMergeDefaultV3`}
 * with **Tailwind v4 default config only**.**
 *
 * ---
 * - **Use this when:**
 *     - Your project uses **Tailwind v4**.
 *     - You need a simple `cn` that works out of the box without a custom config.
 *
 * ---
 * - **Need custom rules?**
 *     - Create a project-wide helper using
 *       {@link twMergeDefaultV3 | `twMergeDefaultV3`} +
 *       {@link customCnV4 | `customCnV4`} (see Example 2).
 *
 * ---
 * @deprecated ***Still supported, but significantly slower during hydration because it uses extended runtime merge logic, prefer {@link cnVer4 | `cnVer4`} for
 * better performance, this utility may be removed in a future release.***
 *
 * ---
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 *
 * ---
 * @returns {string} Merged Tailwind class string.
 *
 * ---
 * @example
 * 1. #### Default usage (Tailwind v4):
 *      ```ts
 *      cnV4("p-2", "p-4");
 *      // ➔ "p-4"
 *
 *      cnV4("text-red-500", { "text-blue-500": true });
 *      // ➔ "text-blue-500"
 *
 *      cnV4(["m-2", ["m-4"]], "m-8");
 *      // ➔ "m-8"
 *      ```
 *      ---
 * 2. #### Custom project-wide usage with Tailwind config:
 *      ```ts
 *      import tailwindConfig from "../tailwind.config";
 *      import { twMergeDefaultV3, customCnV4, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 *      const cnApp = (...classes: ClassValues) => {
 *        return customCnV4(
 *          twMergeDefaultV3({
 *            config: tailwindConfig,
 *            extend: {
 *              classGroups: {
 *                "text-shadow": [
 *                  "text-shadow",
 *                  "text-shadow-sm",
 *                  "text-shadow-md",
 *                ],
 *              },
 *            },
 *          }),
 *          // ...other options classes,
 *        );
 *      };
 *
 *      cnApp("p-2 p-4");
 *      // ➔ "p-4"
 *      cnApp("shadow-sm shadow-md");
 *      // ➔ "shadow-md"
 *      cnApp("text-base text-xxs");
 *      // ➔ "text-xxs" (resolved from config)
 *      ```
 */
export const cnV4 = (...classes: ClassValues): string => {
  return defaultTwMergeV3(cx(...classes));
};
