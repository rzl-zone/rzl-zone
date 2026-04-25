import { createRequiredContext } from "@rzl-zone/core-react/context";

import type { ThemeCtx } from "../types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { useTheme } from "../hooks";

/** ------------------------------------------------------------
 * * ***React context for the app themes system.***
 * ------------------------------------------------------------
 * **Holds the current theme state and updater function, including
 * support for system-level theme preference.**
 *
 * ⚠️ ***Access this context only via `useTheme()` or within a
 * `<RzlThemeAppProvider>` or `<RzlThemePagesProvider>` tree.***, directly calling `React.useContext(ThemeContext)` outside the provider
 * will return `undefined`.
 *
 * @remarks
 * This context is intentionally exported to support advanced use-cases
 * (e.g., custom hooks), prefer the `useTheme()` hook for typical usage.
 * @see ***{@link useTheme | `useTheme()`}.***
 */
export const ThemeContext = createRequiredContext<ThemeCtx | undefined>(
  "RzlzoneNextThemeContext"
);
