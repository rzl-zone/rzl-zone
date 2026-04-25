import type { RzlThemeProviderProps } from "../types";

/** @deprecated It used for internal-only, use `defaultThemes` directly.
 *
 * @internal
 */
const CONFIG_THEME = {
  themes: ["dark", "light", "system"]
} as const satisfies Pick<RzlThemeProviderProps, "themes">;

export const defaultThemes = CONFIG_THEME.themes;
/** @internal */
export const defaultColorSchemes = ["light", "dark"];
/** @internal */
export const MEDIA_SCHEME_THEME = "(prefers-color-scheme: dark)";

/** @internal */
export const defaultMetaColorSchemeValue = {
  light: "#ffffff",
  dark: "oklch(.13 .028 261.692)"
};
