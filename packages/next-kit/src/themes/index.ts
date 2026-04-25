export type {
  ThemeCtx,
  RzlThemeProviderProps,
  ThemeMode,
  ThemeOverrideConfig
} from "./types";

export { useTheme } from "./hooks/index";
export { defaultThemes } from "./configs";
import { ThemeContext as __ThemeContext } from "./contexts/ThemeContext";

export const ThemeContext = __ThemeContext.Context;
