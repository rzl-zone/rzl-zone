"use client";

import { ThemeContext } from "../contexts/ThemeContext";

import type { ThemeCtx } from "../types";

/** ------------------------------------------------------------
 * * ***React hook for accessing the theme context (`App Router` or `Pages Router`).***
 * ------------------------------------------------------------
 * **Provides information about the currently active theme and utilities for
 * switching themes, including system-level theme support.**
 *
 * ⚠️ ***Must be used inside `<RzlThemeAppProvider>` for (`App Router`) or `<RzlThemePagesProvider>` for (`Pages Router`), or it will throw.***
 * @throws If the hook is called outside of the **`<RzlThemeAppProvider>`** or **`<RzlThemePagesProvider>`** component, will throw {@link Error | **`Error`**} .
 * @returns {ThemeCtx} Object containing current theme data and setter.
 */
export const useTheme = (): ThemeCtx => {
  const themeContext = ThemeContext.use(
    "The `useTheme` hook must be wrapped with either `RzlThemeAppProvider` or `RzlThemePagesProvider`."
  );

  return themeContext;
};
