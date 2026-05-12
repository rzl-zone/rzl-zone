import type { TwMergeDefaultFnV3 } from "../tw-merge/v3/_private/types";
import type { TwMergeDefaultFnV4 } from "../tw-merge/v4/_private/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV3 } from "../tw-merge/v3/twMergeDefault";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV4 } from "../tw-merge/v4/twMergeDefault";

import { isFunction } from "@/predicates/is/isFunction";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { cx, type ClassValues } from "./cx";

export type { ClassValues };

/** -------------------------------------------------------------
 * * ***Factory utility for building a custom `cn` helper (Tailwind `v3`).***
 * -------------------------------------------------------------
 * **Wraps internally function to combines class-name values and applies the provided
 * Tailwind merge function (from {@link twMergeDefaultV3 | `twMergeDefaultV3`}).**
 * - 🔑 **When to use it?**
 *      - Your project uses **Tailwind v3**.
 *      - You extend Tailwind merge rules (`classGroups`, `tailwind.config`).
 *      - You need multiple `cn*` variants across apps/packages.
 * @param {TwMergeDefaultFnV3} customTwMergeV3 - Merge function created via {@link twMergeDefaultV3 | `twMergeDefaultV3`}.
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 * @returns {string} Merged Tailwind class string.
 * @example
 * ```ts
 * import tailwindConfig from "../tailwind.config";
 * import { twMergeDefaultV3, customCnV3, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * // 1. Create a custom merge function
 * const myCustomTwMerge = twMergeDefaultV3({
 *   config: tailwindConfig,
 *   extend: {
 *     classGroups: {
 *       "text-shadow": ["text-shadow", "text-shadow-sm", "text-shadow-md"],
 *     },
 *   },
 * });
 *
 * // 2. Build your helper using `customCnV3`
 * export const cnApp = (...classes: ClassValues) => {
 *   return customCnV3(myCustomTwMerge, ...classes);
 * };
 * // ✅ Usage
 * cnApp("p-2", "p-4");             // ➔ "p-4"
 * cnApp("shadow-sm shadow-md");    // ➔ "shadow-md"
 * cnApp("text-base text-xxs");     // ➔ "text-xxs" (resolved from config)
 * ```
 */
export const customCnV3 = (
  customTwMergeV3: TwMergeDefaultFnV3,
  ...classes: ClassValues
): string => {
  if (!isFunction(customTwMergeV3)) {
    throw new TypeError(
      `first Parameter (\`customTwMergeV3\`) must be of type \`function\`, but received: \`${getPreciseType(
        customTwMergeV3
      )}\`.`
    );
  }

  return customTwMergeV3(cx(...classes));
};

/** -------------------------------------------------------------
 * * ***Factory utility for building a custom `cn` helper (Tailwind `v4`).***
 * -------------------------------------------------------------
 * **Wraps internally function to combines class-name values and applies the provided
 * Tailwind merge function (from {@link twMergeDefaultV4 | `twMergeDefaultV4`}).**
 * - 🔑 **When to use it?**
 *      - Your project uses **Tailwind v4**.
 *      - You extend Tailwind merge rules (`classGroups`, `tailwind.config`).
 *      - You need multiple `cn*` variants across apps/packages.
 * @param {TwMergeDefaultFnV4} customTwMergeV4 - Merge function created via {@link twMergeDefaultV4 | `twMergeDefaultV4`}.
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 * @returns {string} Merged Tailwind class string.
 * @example
 * ```ts
 * import tailwindConfig from "../tailwind.config";
 * import { twMergeDefaultV4, customCnV4, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * // 1. Create a custom merge function
 * const myCustomTwMerge = twMergeDefaultV4({
 *   config: tailwindConfig,
 *   extend: {
 *     classGroups: {
 *       "text-shadow": ["text-shadow", "text-shadow-sm", "text-shadow-md"],
 *     },
 *   },
 * });
 *
 * // 2. Build your helper using `customCnV4`
 * export const cnApp = (...classes: ClassValues) => {
 *   return customCnV4(myCustomTwMerge, ...classes);
 * };
 *
 * // ✅ Usage
 * cnApp("p-2", "p-4");             // ➔ "p-4"
 * cnApp("shadow-sm shadow-md");    // ➔ "shadow-md"
 * cnApp("text-base text-xxs");     // ➔ "text-xxs" (resolved from config)
 * ```
 */
export const customCnV4 = (
  customTwMergeV4: TwMergeDefaultFnV4,
  ...classes: ClassValues
): string => {
  if (!isFunction(customTwMergeV4)) {
    throw new TypeError(
      `first Parameter (\`customTwMergeV4\`) must be of type \`function\`, but received: \`${getPreciseType(
        customTwMergeV4
      )}\`.`
    );
  }

  return customTwMergeV4(cx(...classes));
};
