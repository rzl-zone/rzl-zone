"use client";

import { ThemeContext } from "../contexts/ThemeContext";

import type { ThemeCtx } from "../types";

/** ------------------------------------------------------------
 * * ***React hook for accessing the theme context (`App Router` or `Pages Router`).***
 * ------------------------------------------------------------
 * **Provides information about the currently active theme and utilities for
 * switching themes, including system-level theme support.**
 *
 * ⚠️ ***Must be used within the React component tree wrapped by `<RzlThemeAppProvider>` (`App Router`) or `<RzlThemePagesProvider>` (`Pages Router`).***
 *
 * @throws If called outside the provider hierarchy (i.e., not a descendant of **`<RzlThemeAppProvider>`** or **`<RzlThemePagesProvider>`** in the React tree).
 * @returns {ThemeCtx} Object containing current theme data and setter.
 */
export const useTheme = (): ThemeCtx => {
  const themeContext = ThemeContext.use(
    "The `useTheme` hook must be wrapped with either `RzlThemeAppProvider` or `RzlThemePagesProvider`."
  );

  return themeContext;
};
