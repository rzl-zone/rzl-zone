import type { TailwindConfig } from "../../_private/validate-props";
import type { ClassNameValue, ConfigExtension } from "tailwind-merge-v3";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV2 } from "../../v2/twMergeDefault";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV3 } from "../twMergeDefault";

/**
 * * ***Tailwind Merge config extension type.***
 */
type TwMergeConfigExt = ConfigExtension<string, string>;

/**
 * * ***Extra options for customized Tailwind class merge.***
 */
type OptionsConfigMergeTwCnV3 = {
  /** ----------------------------------------------------------
   * * ***Optional Tailwind CSS configuration object.***
   * ----------------------------------------------------------
   * - **Pass your project’s `tailwind.config.ts` if you want to:**
   *     - Respect custom theme values (`colors`, `fontSize`, `spacing`, `etc`.).
   *     - Enable/disable `corePlugins`.
   *     - Register `plugins`.
   *     - Extend class groups (e.g., `text-shadow`).
   * ---
   * - **If omitted, the **default Tailwind config** is used.**
   *
   * ---
   * @example
   * ```ts
   * import tailwindConfig from "../tailwind.config";
   * import { twMergeDefaultV3 } from "@rzl-zone/utils-js/tailwind";
   *
   * const myCustomTwCls = twMergeDefaultV3({
   *   config: tailwindConfig,
   * });
   *
   * myCustomTwCls("text-primary text-secondary");
   * // ➔ "text-secondary" (resolved from your theme config)
   * ```
   */
  config?: TailwindConfig;

  /** ----------------------------------------------------------
   * * ***Prefix added to Tailwind-generated classes.***
   * ----------------------------------------------------------
   * - **Tailwind v3**:
   *     - Use {@link twMergeDefaultV2 | **`twMergeDefaultV2`**} instead.
   *     - Reference:
   *       [**`Tailwind v3 using prefix docs`**](https://v3.tailwindcss.com/docs/configuration#prefix).
   *
   * ---
   * - **Tailwind v4**:
   *     - Configure in your CSS import, e.g. `@import "tailwindcss" prefix(tw);`
   *     - The prefix appears like a variant at the start of the class, e.g. `tw:flex`,
   *       `tw:bg-red-500`, `tw:hover:bg-red-600`.
   *     - Reference:
   *       [**`Tailwind v4 using prefix docs`**](https://tailwindcss.com/docs/upgrade-guide#using-a-prefix).
   *
   * ---
   * - **Notes**:
   *     - Tailwind v3:
   *        - Use {@link twMergeDefaultV2 | **`twMergeDefaultV2`**} instead.
   *     - Tailwind v4: prefer identifier (e.g. `tw`) without `-`.
   *     - Fallback order:
   *        1. `prefix` option.
   *        2. `config.prefix` (if defined).
   *        3. `undefined`.
   *
   * ---
   * @example
   * 1. #### Tailwind version 4 (in CSS entry only):
   *       - CSS files:
   *         ```css
   *         `@import "tailwindcss" prefix(tw);`
   *         ```
   *       - Your custom TwMerge file:
   *         ```ts
   *         import { twMergeDefaultV3 } from "@rzl-zone/utils-js/tailwind";
   *
   *         const twMergeV3 = twMergeDefaultV3({
   *           prefix: "tw",
   *           // ... other config
   *         });
   *         ```
   *         ---
   * 2. #### Tailwind version 4 (with `tailwind.config.{js,ts,mjs,...etc}`):
   *       - Reference:
   *         [**`Tailwind v4 using @config docs`**](https://tailwindcss.com/docs/functions-and-directives#config-directive).
   *       - CSS files:
   *         ```css
   *         `@import "tailwindcss";`
   *         `@config "./tailwind.config.ts";`
   *         ```
   *       - Config files:
   *         ```ts
   *         import type { Config } from "tailwindcss";
   *
   *         const config: Config = {
   *           prefix: 'tw-',
   *           // ... other config
   *         };
   *
   *         export default config;
   *         ```
   *       - Your custom TwMerge file:
   *         ```ts
   *         import config from "../tailwind.config";
   *         import { twMergeDefaultV3 } from "@rzl-zone/utils-js/tailwind";
   *
   *         const twMergeV3 = twMergeDefaultV3({ config });
   *         // now without passing `prefix` options, will use automatic from config.
   *         ```
   */
  prefix?: string;
};

/**
 * * ***Options type for Tailwind Merge v3 wrapper.***
 */
export type OptionsMergeTwClsV3 = Omit<TwMergeConfigExt, "prefix"> &
  OptionsConfigMergeTwCnV3;

/**
 * * ***Tailwind Merge function Version 3 signature (same as twMerge).***
 */
export type TwMergeDefaultFnV3 = (...classLists: ClassNameValue[]) => string;
