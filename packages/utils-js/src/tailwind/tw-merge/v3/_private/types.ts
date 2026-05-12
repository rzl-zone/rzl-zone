import type { TailwindConfig } from "../../_private/validate-props";
import type { ClassNameValue, ConfigExtension } from "tailwind-merge-v3";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { twMergeDefaultV4 } from "../../v4/twMergeDefault";

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
   * import { twMergeDefaultV3 } from "@rzl-zone/utils-js/tailwind";
   *
   * const myCustomTwCls = twMergeDefaultV3({
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
   *    - Configure in `tailwind.config.js`, e.g. `prefix: 'tw-'`.
   *    - Variants first; negative utilities: `-mt-8` ➔ `-tw-mt-8`.
   *    - Reference:
   *      [**`Tailwind v3 using prefix docs`**](https://v3.tailwindcss.com/docs/configuration#prefix).
   * - **Tailwind v4**:
   *    - Use {@link twMergeDefaultV4 | **`twMergeDefaultV4`**} instead.
   *    - Reference:
   *      [**`Tailwind v4 using prefix docs`**](https://tailwindcss.com/docs/upgrade-guide#using-a-prefix).
   * - **ℹ️ Notes**:
   *    - Tailwind v3: use hyphenated prefix (`tw-`).
   *    - Fallback order:
   *      1. `prefix` option
   *      2. `config.prefix` (if defined)
   *      3. `undefined`
   *    - Tailwind v4:
   *      - Use {@link twMergeDefaultV4 | **`twMergeDefaultV4`**} instead.
   * @example
   * - Tailwind version 3 (`tailwind.config.ts`):
   * ```ts
   *   import type { Config } from "tailwindcss";
   *
   *   const config: Config = {
   *     prefix: 'tw-',
   *     // ... other config
   *   };
   *
   *   export default config;
   * ```
   */
  prefix?: string;
};

/** * ***Options type for Tailwind Merge v3 wrapper.*** */
export type OptionsMergeTwClsV3 = Omit<TwMergeConfigExt, "prefix"> &
  OptionsConfigMergeTwCn;

/** * ***Tailwind Merge function Version 3 signature (same as twMerge).*** */
export type TwMergeDefaultFnV3 = (...classLists: ClassNameValue[]) => string;
