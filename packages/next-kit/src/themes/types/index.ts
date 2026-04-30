import type {
  DetailedHTMLProps,
  Dispatch,
  ReactNode,
  ScriptHTMLAttributes,
  SetStateAction
} from "react";

import type { AnyString as AnyThemeAsString } from "@rzl-zone/ts-types-plus";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { useTheme } from "../index";
import { defaultThemes } from "../configs";

/** * The default themes fetched from the main config.
 *
 */
type _DefaultThemes = typeof defaultThemes;

type ValueObject = {
  [themeName: string]: string;
};
type DataAttribute = `data-${string}`;
export type Attribute = DataAttribute | "class";

export interface ScriptPropsThemes extends DetailedHTMLProps<
  ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
> {
  [dataAttribute: DataAttribute]: string | undefined;
}

/** ------------------------------------------------------------
 * * ***An empty interface meant to be augmented to override theme configuration.***
 * ------------------------------------------------------------
 *
 * Users can extend this interface with a `themes` property as a readonly array literal
 * to customize the valid themes list.
 *
 * Usage example to override the themes:
 *
 * ```ts
 * import "@rzl-zone/next-kit/themes";
 *
 * declare module "@rzl-zone/next-kit/themes" {
 *   interface ThemeOverrideConfig {
 *     // Required override: themes must be exactly these strings
 *     themes: ["pink", "blue", "green"];
 *   }
 * }
 * ```
 *
 * Or optionally override:
 *
 * ```ts
 * import "@rzl-zone/next-kit/themes";
 *
 * declare module "@rzl-zone/next-kit/themes" {
 *   interface ThemeOverrideConfig {
 *     // Optional override: themes can be these strings or undefined
 *     themes?: ["pink", "blue", "green"];
 *   }
 * }
 * ```
 *
 * If no override is provided, default themes from defaultTheme will be used.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThemeOverrideConfig {}
// eslint-enable-next-line @typescript-eslint/no-empty-object-type

/** ------------------------------------------------------------
 * * ***Represents the list of theme modes used in the app.***
 * ------------------------------------------------------------
 *
 * Logic:
 * - If `ThemeOverrideConfig` contains a required `themes` property,
 *   and it is a readonly array literal, use that.
 * - If `ThemeOverrideConfig` contains an optional `themes` property,
 *   and it is a readonly array literal, use that plus `undefined`.
 * - Otherwise, fallback to the default `["dark", "light", "system"]`.
 *
 * Example results:
 * - Required override `themes: ["pink", "blue"]` ➔ `readonly ["pink", "blue"]`
 * - Optional override `themes?: ["pink", "blue"]` ➔ `readonly ("pink" | "blue" | undefined)[]`
 * - No override ➔ `["dark", "light", "system"]`
 */
type ThemesMode = ThemeOverrideConfig extends { themes: infer T }
  ? T extends readonly (infer U)[]
    ? readonly U[]
    : _DefaultThemes
  : ThemeOverrideConfig extends { themes?: infer T }
    ? T extends readonly (infer U)[]
      ? readonly (U | undefined)[]
      : _DefaultThemes
    : _DefaultThemes;

/** ------------------------------------------------------------
 * * ***Represents the valid individual theme mode, extracted from the {@link ThemesMode | `ThemesMode`} array.***
 * ------------------------------------------------------------
 * **This can be a string literal type like `"dark" | "light" | "pink" | "blue"`, or `undefined` if `themes` is optional.**
 */
export type ThemeMode = ThemesMode extends readonly (infer T)[] ? T : undefined;

/** ------------------------------------------------------------
 * * ***Props accepted by `<RzlThemeAppProvider />` and `<RzlThemePagesProvider />`, used to configure how theming behaves on the page.***
 * ------------------------------------------------------------
 * **You usually place this provider at the root of your application (e.g. in `app/layout.tsx`, or in `pages/_app.tsx`).**
 */
export type RzlThemeProviderProps<EnabledSystem extends boolean = true> = {
  /** ***Children React Node.***
   *
   * - **Default value:** `undefined`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if the value is `not valid React Children` (except when it is `undefined` or `null`).**
   */
  children: ReactNode;

  /** ***List of all available theme names.***
   *
   * - **Default value:**
   *     - If **`enableSystem`** is **true**, then **`["dark", "light", "system"]`**.
   *     - If **`enableSystem`** is **false**, then **`["dark", "light"]`**.
   *
   * - **⚠️ Note:**
   *     - If **`enableSystem`** is **false** and your `themes` array includes `"system"`,
   *       it will be removed automatically.
   *
   * - **ℹ️ Tip ***(Recommended)***:**
   *    - If you pass custom themes (e.g. `themes={["pink","blue"]}`),
   *      remember to add a corresponding override for type-safety:
   *      ```ts
   *
   *      import "@rzl-zone/next-kit/themes";
   *
   *      declare module "@rzl-zone/next-kit/themes" {
   *        interface ThemeOverrideConfig {
   *          themes: ["pink", "blue"]; // or themes?: [...];
   *        }
   *      }
   *      ```
   */
  themes?: string[];

  /** ***Forced theme name for the current page.***
   *
   * - **Default value:** `undefined`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string`.**
   */
  forcedTheme?: string;

  /** ***Whether to switch between dark and light themes based on prefers-color-scheme.***
   *
   * - **Default value:** `true`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if the value is not a boolean (except when it is `undefined`).**
   */
  enableSystem?: EnabledSystem;

  /** ***Disable all CSS transitions when switching themes.***
   *
   * - **Default value:** `true`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if the value is not a boolean (except when it is `undefined`).**
   */
  disableTransitionOnChange?: boolean;

  /** ***Whether to indicate to browsers which color scheme (dark or light) should be used
   * for built-in UI elements such as inputs, buttons, scrollbars, and form controls.***
   *
   * When enabled, this setting will inject the `color-scheme` style into either the
   * `html` or `body` element.
   *
   * - **Default value:** `"html"`.
   *
   * - ***⚠️ Warning:***
   *    - If you use `"html"`, you must apply `suppressHydrationWarning` on the `<html>` element.
   *    - If you use `"body"`, you must apply `suppressHydrationWarning` on the `<body>` element.
   *    - **A `TypeError` will be thrown if the value is not `undefined`, `false`, or one of the valid strings: `"html"` or `"body"`.**
   *
   * - **ℹ️ Note:**
   *    This feature only applies when the active theme is `"dark"`, `"light"`, or `"system"`.
   *    If the theme is a custom variant (e.g., `"pink"`, `"blue"`, `"dracula"`), the `color-scheme`
   *    style will *not* be applied, and any previously injected `color-scheme` value will be removed
   *    to avoid inconsistent browser UI styling.
   */
  enableColorScheme?: "html" | "body" | false;

  /** ***Whether to indicate to browsers which color scheme in meta head, is used (dark or light) for built-in UI like inputs and buttons.***
   *
   * - **Default value:** `true`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if the value is not a boolean (except when it is `undefined`).**
   */
  enableMetaColorScheme?: boolean;

  /** ***Optional custom values for the `<meta name="theme-color">` tag.***
   *
   * This setting allows you to explicitly define the `theme-color` value
   * injected into the document `<head>` for both light and dark modes.
   *
   * When provided, these values override the automatically resolved
   * theme color that would normally be derived from the active theme.
   *
   * Structure:
   * ```ts
   * metaColorSchemeValue?: {
   *   light?: string;
   *   dark?: string;
   * }
   * ```
   *
   * - **Behavior when `enableSystem` is active:**
   *    - If `enableSystem` is enabled and current theme is `"system"`, both `light` and `dark` values
   *      are provided, will inject **two** separate `<meta name="theme-color">` tags
   *      using `media="(prefers-color-scheme: light)"` and `media="(prefers-color-scheme: dark)"`.
   *    - If the current `theme` is set to `"system"`, and `enableSystem` is `true`,
   *      these two meta tags will always be injected to allow the browser/OS
   *      to automatically pick the correct one based on the user's preferences.
   *    - You can disable this behavior entirely by setting
   *      **`enableMetaColorScheme: false`**.
   *
   *    - light: The `theme-color` value used when the active theme resolves
   *      to light mode.
   *
   *    - dark: The `theme-color` value used when the active theme resolves
   *      to dark mode.
   *
   * - **Default behavior:**
   *    - If both values are omitted, no override is applied and the system
   *      falls back to the default theme-color resolution logic.
   *
   * - **Warning:**
   *    - Ensure that the provided values are valid CSS color strings such as
   *      hex (`#000000`), rgb, hsl, or any valid color keyword.
   *    - Supplying invalid color values may cause inconsistent UI styling
   *      across browsers, especially on mobile where `theme-color` affects
   *      system UI bars.
   *    - **`metaColorSchemeValue` must be a plain object.**
   *      If a non-object value is supplied (e.g., array, null, boolean, number, etc.),
   *      a `TypeError` will be thrown.
   *    - **`light` and `dark` must be valid non-empty strings when provided.**
   *      If either field is defined but not a string, or is an empty string,
   *      a `TypeError` will be thrown.
   *
   * - **Notes:**
   *    - These values only apply when the theme resolves to either `"light"`
   *      or `"dark"`. Custom themes that do not map to these modes will not
   *      use the override.
   *    - When `enableSystem` is `false`, only a **single** theme-color meta tag
   *      will be injected based on the currently active theme.
   *    - This setting does **not** affect color-scheme behavior; it only manages
   *      the injected `<meta name="theme-color">` tags.
   *
   * @example
   * metaColorSchemeValue: {
   *   light: "#ffffff",
   *   dark: "#0d0d0d"
   * }
   */
  metaColorSchemeValue?: {
    /** ***The `theme-color` value applied when the resolved theme is in light mode.***
     *
     * - **Default:** `"#ffffff"` (commonly used light background surface)
     *
     * - Must be a valid CSS color string, such as:
     *    - Hex: `#ffffff`
     *    - RGB: `rgb(255 255 255)`
     *    - HSL: `hsl(0 0% 100%)`
     *    - Oklch: `oklch(1 0.0214 261.692)`
     *    - Color keyword: `white`
     *
     * - **Behavior:**
     *    - When `enableSystem` is enabled and current theme is `"system"`, this value is assigned to:
     *      `<meta name="theme-color" content="..." media="(prefers-color-scheme: light)" />`, otherwise `<meta name="theme-color" content="..." />`
     *    - If the current theme is `"system"` and the OS/browser resolves to light mode,
     *      this becomes the active theme-color value.
     *    - If omitted, the system falls back to its internal light-mode theme-color.
     *
     * - **Warnings:**
     *    - **Must be a non-empty string.**
     *      If `light` is provided but:
     *        - is not a string, or
     *        - is an empty string,
     *      a **TypeError will be thrown**.
     *
     *    - **Must be a valid CSS color.**
     *      - Invalid color values can cause inconsistent behavior across browsers,
     *        especially on mobile devices where the system UI depends on `theme-color`.
     *
     *    - **The parent object (`metaColorSchemeValue`) must be a plain object.**
     *       - Providing arrays, numbers, booleans, `null`, or any non-object value
     *         will result in a `TypeError`.
     *
     * @example
     * light: "#fafafa"
     */
    light?: string;

    /** ***The `theme-color` value applied when the resolved theme is in dark mode.***
     *
     * - **Default:**
     *    - `"oklch(.13 .028 261.692)"` (a safe, modern dark-surface color)
     *
     * - Must be a valid CSS color string, such as:
     *    - Hex: `#000000`
     *    - RGB: `rgb(0 0 0)`
     *    - HSL: `hsl(0 0% 0%)`
     *    - Oklch: `oklch(0.0912 0 261.692)`
     *    - Color keyword: `black`
     *
     * - **Behavior:**
     *    - When `enableSystem` is enabled and current theme is `"system"`, this value is assigned to:
     *      `<meta name="theme-color" content="..." media="(prefers-color-scheme: dark)" />`, otherwise `<meta name="theme-color" content="..." />`
     *    - If the current theme is `"system"` and the OS/browser resolves to dark mode,
     *      this becomes the active theme-color value.
     *    - If omitted, the system falls back to its internal dark-mode theme-color.
     *
     * - **Warnings:**
     *    - **Must be a non-empty string.**
     *      If `dark` is provided but:
     *        - is not a string, or
     *        - is an empty string,
     *      a **TypeError will be thrown**.
     *
     *    - **Must be a valid CSS color.**
     *      - Invalid color values can cause inconsistent behavior across browsers,
     *        especially on mobile devices where the system UI depends on `theme-color`.
     *
     *    - **The parent object (`metaColorSchemeValue`) must be a plain object.**
     *       - Providing arrays, numbers, booleans, `null`, or any non-object value
     *         will result in a `TypeError`.
     *
     * @example
     * dark: "#0d0d0d"
     */
    dark?: string;
  };

  /** ***Key used to store theme setting in localStorage.***
   *
   * - **Default value:** `"rzl-theme"`
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string` and value `is empty-string`**
   */
  storageKey?: string;

  /** ***Default theme.***
   *
   * - **Default value:**
   *    - If `enableSystem` is `true` then `system` otherwise `light`.
   * - **ℹ️ Note:**
   *    - If you set this value, value must be one of `themes` property value, otherwise will keep to default value.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string`.**
   */
  defaultTheme?: EnabledSystem extends true
    ? Exclude<ThemeMode, "system"> | "system"
    : Exclude<ThemeMode, "system">;

  /** ***HTML attribute modified based on the active theme.***
   *
   * - **Default value:** `"data-theme"`
   * - **Accepts:**
   *    - `"class"`.
   *    - `"data-*"` (any data attribute, e.g., `"data-mode"`, `"data-color"`, etc.).
   *    - An array including any combination of the above.
   *
   * - ⚠️ **Warning:**
   *      - ***This will throw a `TypeError` if:***
   *         - The value is not `undefined` **and**
   *         - The value is not a string **or**
   *         - The value is an empty string `""` **or**
   *         - The value is an array that contains elements not matching `"class"` or `"data-*"`.
   */
  attribute?: Attribute | Attribute[];

  /** ***Mapping of theme name to HTML attribute value.***
   *
   * - **Type:** {@link ValueObject | **`ValueObject`**} | `undefined`
   * - **Structure:** An object where each key is a theme name (`string`) and the value is a string representing the attribute value.
   *
   * - ⚠️ **Warning:**
   *      - This will throw a `TypeError` if the value is not `undefined` **and**:
   *         - It is not a plain object, or
   *         - Any of the object values is not a string or a empty-string
   *
   * @example
   * // Valid
   * value = {
   *   light: "data-light",
   *   dark: "data-dark"
   * }
   *
   * // Invalid
   * value = "string"          // TypeError
   * value = { light: 123 }    // TypeError
   */
  value?: ValueObject;

  /** ***Nonce string to pass to the inline script and style elements for CSP headers.***
   *
   * - **Default value:** `undefined`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string`.**
   */
  nonce?: string;

  /** ***Props to pass the inline script.***
   *
   * @default undefined
   */
  scriptProps?: ScriptPropsThemes;
};

/** ------------------------------------------------------------
 * * ***Value returned by `useTheme` hook.***
 * ------------------------------------------------------------
 * **Contains the current theme information and helper utilities for manually
 * updating the active theme, including support for system-based themes.**
 */
export type ThemeCtx = {
  /** ***List of all available theme names.***
   *
   */
  themes: Array<AnyThemeAsString | ThemeMode>;
  /** ***Forced theme name for the current page.***
   *
   */
  forcedTheme?: AnyThemeAsString | ThemeMode;
  /** ***Update the theme.***
   *
   */
  setTheme: Dispatch<SetStateAction<AnyThemeAsString | ThemeMode>>;
  /** ***Active theme name.***
   *
   */
  theme?: AnyThemeAsString | ThemeMode;
  /** ***If `enableSystem` is `true` and the active theme is `"system"`, this returns whether the system preference resolved to` "dark" or "light"`. Otherwise, identical to `theme`.***
   *
   */
  resolvedTheme?:
    | AnyThemeAsString
    | Exclude<ThemeMode, "system">
    | "dark"
    | "light";
  /** ***If enableSystem is true, returns the System theme preference (`"dark"` or `"light"`), regardless what the active theme is.***
   *
   */
  systemTheme?:
    | AnyThemeAsString
    | Exclude<ThemeMode, "system">
    | "dark"
    | "light";
};
