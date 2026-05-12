import type { ClassValues } from "./cx";

import { cx } from "./cx";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customCnV3, customCnV4 } from "./customCn";
import { twMergeDefaultV3 } from "../tw-merge/v3/twMergeDefault";
import { twMergeDefaultV4 } from "../tw-merge/v4/twMergeDefault";

const defaultTwMergeV3 = twMergeDefaultV3();
const defaultTwMergeV4 = twMergeDefaultV4();

/** -------------------------------------------------------------
 * * ***Default `cnV3` utility (Tailwind v3).***
 * -------------------------------------------------------------
 * **Combines class-name values and then deduplicates/resolves
 * conflicts using {@link twMergeDefaultV3 | `twMergeDefaultV3`}
 * with **Tailwind v3 default config only**.**
 * - ✅ **Use this when:**
 *    - Your project uses **Tailwind v3**.
 *    - You need a simple `cn` that works out of the box without a custom config.
 * - ⚡ **Need custom rules?**
 *    - Create a project-wide helper using
 *      {@link twMergeDefaultV3 | `twMergeDefaultV3`} +
 *      {@link customCnV3 | `customCnV3`} (see Example 2).
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 * @returns {string} Merged Tailwind class string.
 * @example
 * #### Example 1: ✅ Default usage (Tailwind v3).
 * ```ts
 * cnV3("p-2", "p-4");
 * // ➔ "p-4"
 *
 * cnV3("text-red-500", { "text-blue-500": true });
 * // ➔ "text-blue-500"
 *
 * cnV3(["m-2", ["m-4"]], "m-8");
 * // ➔ "m-8"
 * ```
 * #### Example 2: ⚡ Custom project-wide usage with Tailwind config.
 * ```ts
 * import tailwindConfig from "../tailwind.config";
 * import { twMergeDefaultV3, customCnV3, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * const cnApp = (...classes: ClassValues) => {
 *   return customCnV3(
 *     twMergeDefaultV3({
 *       config: tailwindConfig,
 *       extend: {
 *         classGroups: {
 *           "text-shadow": [
 *             "text-shadow",
 *             "text-shadow-sm",
 *             "text-shadow-md",
 *           ],
 *         },
 *       },
 *     }),
 *     // ...other options classes,
 *   );
 * };
 *
 * cnApp("p-2 p-4");             // ➔ "p-4"
 * cnApp("shadow-sm shadow-md"); // ➔ "shadow-md"
 * cnApp("text-base text-xxs");  // ➔ "text-xxs" (resolved from config)
 * ```
 */
export const cnV3 = (...classes: ClassValues): string => {
  return defaultTwMergeV3(cx(...classes));
};

/** -------------------------------------------------------------
 * * ***Default `cnV4` utility (Tailwind v4).***
 * -------------------------------------------------------------
 * **Combines class-name values and then deduplicates/resolves
 * conflicts using {@link twMergeDefaultV4 | `twMergeDefaultV4`}
 * with **Tailwind v4 default config only**.**
 * - ✅ **Use this when:**
 *    - Your project uses **Tailwind v4**.
 *    - You need a simple `cn` that works out of the box without a custom config.
 * - ⚡ **Need custom rules?**
 *    - Create a project-wide helper using
 *      {@link twMergeDefaultV4 | `twMergeDefaultV4`} +
 *      {@link customCnV4 | `customCnV4`} (see Example 2).
 * @param {ClassValues} classes - Class values (`string`, `array`, `object`, `etc`).
 * @returns {string} Merged Tailwind class string.
 * @example
 * #### Example 1: ✅ Default usage (Tailwind v4).
 * ```ts
 * cnV4("p-2", "p-4");
 * // ➔ "p-4"
 *
 * cnV4("text-red-500", { "text-blue-500": true });
 * // ➔ "text-blue-500"
 *
 * cnV4(["m-2", ["m-4"]], "m-8");
 * // ➔ "m-8"
 * ```
 * #### Example 2: ⚡ Custom project-wide usage with Tailwind config.
 * ```ts
 * import tailwindConfig from "../tailwind.config";
 * import { twMergeDefaultV4, customCnV4, type ClassValues } from "@rzl-zone/utils-js/tailwind";
 *
 * const cnApp = (...classes: ClassValues) => {
 *   return customCnV4(
 *     twMergeDefaultV4({
 *       config: tailwindConfig,
 *       extend: {
 *         classGroups: {
 *           "text-shadow": [
 *             "text-shadow",
 *             "text-shadow-sm",
 *             "text-shadow-md",
 *           ],
 *         },
 *       },
 *     }),
 *     // ...other options classes,
 *   );
 * };
 *
 * cnApp("p-2 p-4");             // ➔ "p-4"
 * cnApp("shadow-sm shadow-md"); // ➔ "shadow-md"
 * cnApp("text-base text-xxs");  // ➔ "text-xxs" (resolved from config)
 * ```
 */
export const cnV4 = (...classes: ClassValues): string => {
  return defaultTwMergeV4(cx(...classes));
};
