import type { TwMergeDefaultFnV2 } from "../tw-merge/v2/_private/types";
import type { TwMergeDefaultFnV3 } from "../tw-merge/v3/_private/types";

import { twMerge as twMergeV2 } from "tailwind-merge-v2";
import { twMerge as twMergeV3 } from "tailwind-merge-v3";

import { createMessage } from "@/_private/logger";

import { isFunction } from "@/predicates/is/isFunction";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { cx, type ClassValues } from "./cx";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV2 } from "../tw-merge/v2/twMergeDefault";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV3 } from "../tw-merge/v3/twMergeDefault";

export type { ClassValues };

/** -------------------------------------------------------------
 * * ***High-performance `cn` factory utility (Tailwind `v3`).***
 * -------------------------------------------------------------
 * **Combines class-name values and applies the provided Tailwind merge
 * function using the native [`twMerge`](https://github.com/dcastil/tailwind-merge/tree/v2.6.0) implementation
 * from `tailwind-merge` version 2 for `tailwind version 3`.**
 *
 * ---
 * *This utility is the recommended replacement for deprecated (`customCnV3`) extended
 * runtime merge helpers because it provides significantly better hydration
 * and runtime performance.*
 *
 * ---
 * - **Recommended when:**
 *     - Your project uses **Tailwind v3**.
 *     - You want the fastest possible `cn` utility.
 *     - You need reusable project-wide `cn*` helpers.
 *     - You want predictable Tailwind conflict resolution with minimal overhead.
 *
 * ---
 * - **Performance note:**
 *     - Uses the native `twMergeV2` implementation directly.
 *     - Faster than deprecated extended merge utilities.
 *     - Better suited for SSR and hydration-heavy applications.
 *
 * ---
 * @param {TwMergeDefaultFnV2} customTwMergeV2 - Merge function created via [`twMerge`](https://github.com/dcastil/tailwind-merge/tree/v2.6.0).
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 *
 * ---
 * @returns {string} Merged Tailwind class string.
 *
 * ---
 * @example
 * ```ts
 * import { twMerge as twMergeV2 } from "tailwind-merge"; // tw-merge (v2) for tailwind version 3
 * import { customCnVer3, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * // 1. Create app-level helper
 * export const cnApp = (...classes: ClassValues) => {
 *   return customCnVer3(twMergeV2, ...classes);
 * };
 *
 * // Usage
 * cnApp("p-2", "p-4");
 * // ➔ "p-4"
 * cnApp("text-sm text-lg");
 * // ➔ "text-lg"
 * cnApp("shadow-sm shadow-md");
 * // ➔ "shadow-md"
 * ```
 */
export const customCnVer3 = (
  customTwMergeV2: TwMergeDefaultFnV2 = twMergeV2,
  ...classes: ClassValues
): string => {
  if (!isFunction(customTwMergeV2)) {
    throw new TypeError(
      createMessage(
        "customCnVer3",
        `first Parameter (\`customTwMergeV2\`) must be of type \`function\`, but received: \`${getPreciseType(
          customTwMergeV2
        )}\`.`
      )
    );
  }

  return customTwMergeV2(cx(...classes));
};

/** -------------------------------------------------------------
 * * ***High-performance `cn` factory utility (Tailwind `v4`).***
 * -------------------------------------------------------------
 * **Combines class-name values and applies the provided Tailwind merge
 * function using the native [`twMerge`](https://github.com/dcastil/tailwind-merge/tree/v3.6.0) implementation
 * from `tailwind-merge` version 3 for `tailwind version 4`.**
 *
 * ---
 * *This utility is the recommended replacement for deprecated (`customCnV4`) extended
 * runtime merge helpers because it provides significantly better hydration
 * and runtime performance.*
 *
 * ---
 * - **Recommended when:**
 *     - Your project uses **Tailwind v4**.
 *     - You want the fastest possible `cn` utility.
 *     - You need reusable project-wide `cn*` helpers.
 *     - You want predictable Tailwind conflict resolution with minimal overhead.
 *
 * ---
 * - **Performance note:**
 *     - Uses the native `twMergeV3` implementation directly.
 *     - Faster than deprecated extended merge utilities.
 *     - Better suited for SSR and hydration-heavy applications.
 *
 * ---
 * @param {TwMergeDefaultFnV3} customTwMergeV3 - Merge function created via [`twMerge`](https://github.com/dcastil/tailwind-merge/tree/v3.6.0).
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 *
 * ---
 * @returns {string} Merged Tailwind class string.
 *
 * ---
 * @example
 * ```ts
 * import { twMerge as twMergeV3 } from "tailwind-merge"; // tw-merge (v3) for tailwind version 4
 * import { customCnVer4, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * // 1. Create app-level helper
 * export const cnApp = (...classes: ClassValues) => {
 *   return customCnVer4(twMergeV3, ...classes);
 * };
 *
 * // Usage
 * cnApp("p-2", "p-4");
 * // ➔ "p-4"
 * cnApp("text-sm text-lg");
 * // ➔ "text-lg"
 * cnApp("shadow-sm shadow-md");
 * // ➔ "shadow-md"
 * ```
 */
export const customCnVer4 = (
  customTwMergeV3: TwMergeDefaultFnV3 = twMergeV3,
  ...classes: ClassValues
): string => {
  if (!isFunction(customTwMergeV3)) {
    throw new TypeError(
      createMessage(
        "customCnVer4",
        `first Parameter (\`customTwMergeV3\`) must be of type \`function\`, but received: \`${getPreciseType(
          customTwMergeV3
        )}\`.`
      )
    );
  }

  return customTwMergeV3(cx(...classes));
};

/** -------------------------------------------------------------
 * * ***Factory utility for building a custom `cn` helper (Tailwind `v3`).***
 * -------------------------------------------------------------
 * **Wraps internally function to combines class-name values and applies the provided
 * Tailwind merge function (from {@link twMergeDefaultV2 | `twMergeDefaultV2`}).**
 *
 * ---
 * - **When to use it?**
 *     - Your project uses **Tailwind v3**.
 *     - You extend Tailwind merge rules (`classGroups`, `tailwind.config`).
 *     - You need multiple `cn*` variants across apps/packages.
 *
 * ---
 * @deprecated ***Still supported, but slower during SSR and hydration because it relies on extended runtime merge logic,
 * prefer {@link customCnVer3 | `customCnVer3`}for better performance, this utility may be removed in a future release.***
 *
 * ---
 * @param {TwMergeDefaultFnV2} customTwMergeV2 - Merge function created via {@link twMergeDefaultV2 | `twMergeDefaultV2`}.
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 *
 * ---
 * @returns {string} Merged Tailwind class string.
 *
 * ---
 * @example
 * ```ts
 * import tailwindConfig from "../tailwind.config";
 * import { twMergeDefaultV2, customCnV3, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * // 1. Create a custom merge function.
 * const myCustomTwMerge = twMergeDefaultV2({
 *   config: tailwindConfig,
 *   extend: {
 *     classGroups: {
 *       "text-shadow": ["text-shadow", "text-shadow-sm", "text-shadow-md"],
 *     },
 *   },
 * });
 *
 * // 2. Build your helper using `customCnV3`.
 * export const cnApp = (...classes: ClassValues) => {
 *   return customCnV3(myCustomTwMerge, ...classes);
 * };
 * // Usage
 * cnApp("p-2", "p-4");
 * // ➔ "p-4"
 * cnApp("shadow-sm shadow-md");
 * // ➔ "shadow-md"
 * cnApp("text-base text-xxs");
 * // ➔ "text-xxs" (resolved from config)
 * ```
 */
export const customCnV3 = (
  customTwMergeV2: TwMergeDefaultFnV2,
  ...classes: ClassValues
): string => {
  if (!isFunction(customTwMergeV2)) {
    throw new TypeError(
      createMessage(
        "customCnV3",
        `first Parameter (\`customTwMergeV2\`) must be of type \`function\`, but received: \`${getPreciseType(
          customTwMergeV2
        )}\`.`
      )
    );
  }

  return customTwMergeV2(cx(...classes));
};

/** -------------------------------------------------------------
 * * ***Factory utility for building a custom `cn` helper (Tailwind `v4`).***
 * -------------------------------------------------------------
 * **Wraps internally function to combines class-name values and applies the provided
 * Tailwind merge function (from {@link twMergeDefaultV3 | `twMergeDefaultV3`}).**
 *
 * ---
 * - **When to use it?**
 *     - Your project uses **Tailwind v4**.
 *     - You extend Tailwind merge rules (`classGroups`, `tailwind.config`).
 *     - You need multiple `cn*` variants across apps/packages.
 *
 * ---
 * @deprecated ***Still supported, but slower during SSR and hydration because it relies on extended runtime merge logic,
 * prefer {@link customCnVer4 | `customCnVer4`}for better performance, this utility may be removed in a future release.***
 *
 * ---
 * @param {TwMergeDefaultFnV3} customTwMergeV3 - Merge function created via {@link twMergeDefaultV3 | `twMergeDefaultV3`}.
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 *
 * ---
 * @returns {string} Merged Tailwind class string.
 *
 * ---
 * @example
 * ```ts
 * import tailwindConfig from "../tailwind.config";
 * import { twMergeDefaultV3, customCnV4, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * // 1. Create a custom merge function.
 * const myCustomTwMerge = twMergeDefaultV3({
 *   config: tailwindConfig,
 *   extend: {
 *     classGroups: {
 *       "text-shadow": ["text-shadow", "text-shadow-sm", "text-shadow-md"],
 *     },
 *   },
 * });
 *
 * // 2. Build your helper using `customCnV4`.
 * export const cnApp = (...classes: ClassValues) => {
 *   return customCnV4(myCustomTwMerge, ...classes);
 * };
 *
 * // Usage
 * cnApp("p-2", "p-4");
 * // ➔ "p-4"
 * cnApp("shadow-sm shadow-md");
 * // ➔ "shadow-md"
 * cnApp("text-base text-xxs");
 * // ➔ "text-xxs" (resolved from config)
 * ```
 */
export const customCnV4 = (
  customTwMergeV3: TwMergeDefaultFnV3,
  ...classes: ClassValues
): string => {
  if (!isFunction(customTwMergeV3)) {
    throw new TypeError(
      createMessage(
        "customCnV4",
        `first Parameter (\`customTwMergeV3\`) must be of type \`function\`, but received: \`${getPreciseType(
          customTwMergeV3
        )}\`.`
      )
    );
  }

  return customTwMergeV3(cx(...classes));
};
