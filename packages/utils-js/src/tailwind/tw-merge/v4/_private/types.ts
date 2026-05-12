import type { TailwindConfig } from "../../_private/validate-props";
import type { ClassNameValue, ConfigExtension } from "tailwind-merge-v4";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV3 } from "../../v3/twMergeDefault";

/** Tailwind Merge config extension type */
type TwMergeConfigExt = ConfigExtension<string, string>;

/** * ***Extra options for customized Tailwind class merge.***  */
type OptionsConfigMergeTwCn = {
  /** ----------------------------------------------------------
   * * ***Optional Tailwind CSS configuration object.***
   * ----------------------------------------------------------
   * - **Pass your project’s `tailwind.config.ts` if you want to:**
   *    - Respect custom theme values (`colors`, `fontSize`, `spacing`, `etc`.)
   *    - Enable/disable `corePlugins`
   *    - Register `plugins`
   *    - Extend class groups (e.g., `text-shadow`)
   * - **If omitted, the **default Tailwind config** is used.**
   * @example
   * ```ts
   * import tailwindConfig from "../tailwind.config";
   * import { twMergeDefaultV4 } from "@rzl-zone/utils-js/tailwind";
   *
   * const myCustomTwCls = twMergeDefaultV4({
   *   config: tailwindConfig,
   * });
   *
   * myCustomTwCls("text-primary text-secondary");
   * // => "text-secondary" (resolved from your theme config)
   * ```
   */
  config?: TailwindConfig;
  /** ----------------------------------------------------------
   * * ***Prefix added to Tailwind-generated classes.***
   * ----------------------------------------------------------
   * - **Tailwind v3**:
   *    - Use {@link twMergeDefaultV3 | **`twMergeDefaultV3`**} instead.
   *    - Reference:
   *      [**`Tailwind v3 using prefix docs`**](https://v3.tailwindcss.com/docs/configuration#prefix).
   *
   * - **Tailwind v4**:
   *    - Configure in your CSS import, e.g. `@import "tailwindcss" prefix(tw);`
   *    - The prefix appears like a variant at the start of the class, e.g. `tw:flex`,
   *      `tw:bg-red-500`, `tw:hover:bg-red-600`.
   *    - Reference:
   *      [**`Tailwind v4 using prefix docs`**](https://tailwindcss.com/docs/upgrade-guide#using-a-prefix).
   *
   * - **ℹ️ Notes**:
   *    - Tailwind v3:
   *      - Use {@link twMergeDefaultV3 | **`twMergeDefaultV3`**} instead.
   *    - Tailwind v4: prefer identifier (e.g. `tw`) without `-`.
   *    - Fallback order:
   *      1. `prefix` option
   *      2. `config.prefix` (if defined)
   *      3. `undefined`
   *
   * @example
   * - Tailwind version 4 (in CSS entry only):
   *    - CSS files:
   *      ```css
   *      `@import "tailwindcss" prefix(tw);`
   *      ```
   *    - Your custom TwMerge file:
   *      ```ts
   *      import { twMergeDefaultV4 } from "@rzl-zone/utils-js/tailwind";
   *
   *      const twMergeV3 = twMergeDefaultV4({
   *        prefix: "tw",
   *        // ... other config
   *      });
   *      ```
   * - Tailwind version 4 (with `tailwind.config.{js,ts,mjs,...etc}`):
   *      - Reference:
   *        [**`Tailwind v4 using @config docs`**](https://tailwindcss.com/docs/functions-and-directives#config-directive).
   *      - CSS files:
   *        ```css
   *        `@import "tailwindcss";`
   *        `@config "./tailwind.config.ts";`
   *        ```
   *      - Config files:
   *        ```ts
   *        import type { Config } from "tailwindcss";
   *
   *        const config: Config = {
   *          prefix: 'tw-',
   *          // ... other config
   *        };
   *
   *        export default config;
   *        ```
   *      - Your custom TwMerge file:
   *        ```ts
   *        import config from "../tailwind.config";
   *        import { twMergeDefaultV4 } from "@rzl-zone/utils-js/tailwind";
   *
   *        const twMergeV4 = twMergeDefaultV4({ config });
   *        // now without passing `prefix` options, will use automatic from config.
   *        ```
   */
  prefix?: string;
};

/** * ***Options type for Tailwind Merge v4 wrapper.*** */
export type OptionsMergeTwClsV4 = Omit<TwMergeConfigExt, "prefix"> &
  OptionsConfigMergeTwCn;

/** * ***Tailwind Merge function Version 4 signature (same as twMerge).*** */
export type TwMergeDefaultFnV4 = (...classLists: ClassNameValue[]) => string;
