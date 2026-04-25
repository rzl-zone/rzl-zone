import {
  isArray,
  isNonEmptyString,
  isString,
  isServer,
  isBoolean
} from "@rzl-zone/utils-js/predicates";

import type { Attribute, RzlThemeProviderProps, ThemeCtx } from "../types";
import {
  defaultColorSchemes,
  defaultMetaColorSchemeValue,
  MEDIA_SCHEME_THEME
} from "../configs";

/** @internal */
export const saveToLS = (storageKey: string, value?: string): void => {
  if (isServer()) return undefined;
  // Save to storage
  if (isNonEmptyString(storageKey) && isNonEmptyString(value)) {
    try {
      localStorage.setItem(storageKey, value);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Unsupported
    }
  }
};

/** @internal */
export const getTheme = (
  key: string,
  validTheme: ThemeCtx["themes"],
  fallback?: ThemeCtx["theme"]
): ThemeCtx["theme"] => {
  if (isServer()) return undefined;

  let theme: ThemeCtx["theme"] | undefined;
  try {
    const stored = localStorage.getItem(key);
    theme = stored && validTheme.includes(stored) ? stored : fallback;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Unsupported
  }

  return theme ?? fallback;
};

/** @internal */
export const disableAnimation = (nonce?: string): VoidFunction | undefined => {
  if (isServer()) return undefined;

  const css = document.createElement("style");
  if (isNonEmptyString(nonce)) css.setAttribute("nonce", nonce);
  css.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

/** @internal */
export const getSystemTheme = (mql?: MediaQueryList | MediaQueryListEvent) => {
  if (!mql) mql = window?.matchMedia(MEDIA_SCHEME_THEME);
  return mql?.matches ? "dark" : "light";
};

/** @internal */
export const updateMetaThemeColor = ({
  theme,
  enableMetaColorScheme,
  metaColorSchemeValue
}: {
  theme: string | undefined;
  enableMetaColorScheme: boolean | undefined;
  metaColorSchemeValue: {
    light: string;
    dark: string;
  };
}): void => {
  if (
    !isServer() &&
    isString(theme) &&
    isBoolean(enableMetaColorScheme) &&
    enableMetaColorScheme === true
  ) {
    document
      // eslint-disable-next-line quotes
      .querySelectorAll('meta[name="theme-color"][data-rzl-theme]')
      .forEach((el) => el.remove());

    if (theme === "dark") {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = metaColorSchemeValue.dark;
      meta.setAttribute("data-rzl-theme", "dark");
      document.head.appendChild(meta);
    } else if (theme === "light") {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = metaColorSchemeValue.light;
      meta.setAttribute("data-rzl-theme", "light");
      document.head.appendChild(meta);
    } else {
      const meta1 = document.createElement("meta");
      meta1.name = "theme-color";
      meta1.content = metaColorSchemeValue.dark;
      meta1.media = "(prefers-color-scheme: dark)";
      meta1.setAttribute("data-rzl-theme", "dark");
      document.head.appendChild(meta1);

      const meta2 = document.createElement("meta");
      meta2.name = "theme-color";
      meta2.content = metaColorSchemeValue.light;
      meta2.media = "(prefers-color-scheme: light)";
      meta2.setAttribute("data-rzl-theme", "light");
      document.head.appendChild(meta2);
    }
  }
};

/** @internal */
type NonUndefRzlThemeProviderProps = Required<RzlThemeProviderProps>;

/** @internal */
export const handlingApplyTheme = ({
  attribute,
  attributes,
  theme,
  defaultTheme,
  enableColorScheme,
  name,
  resolved
}: {
  name: string | undefined;
  resolved: string;
  theme: string | undefined;
  defaultTheme: string;
  attributes: string[];
  attribute: NonUndefRzlThemeProviderProps["attribute"];
  enableColorScheme: NonUndefRzlThemeProviderProps["enableColorScheme"];
}): void => {
  if (isServer()) return undefined;

  const docEl = document.documentElement;
  const bodyEl = document.body;

  const handleAttribute = (attr: Attribute) => {
    if (attr === "class") {
      if (attributes.length > 0) docEl.classList.remove(...attributes);
      if (name) docEl.classList.add(name);
    } else if (attr.startsWith("data-")) {
      if (name) {
        docEl.setAttribute(attr, name);
      } else {
        docEl.removeAttribute(attr);
      }
    }
  };

  if (isArray(attribute)) {
    attribute.forEach(handleAttribute);
  } else {
    handleAttribute(attribute);
  }

  if (enableColorScheme !== false) {
    const fallback = defaultColorSchemes.includes(defaultTheme)
      ? defaultTheme
      : null;
    let colorScheme = defaultColorSchemes.includes(resolved)
      ? resolved
      : fallback;
    if (colorScheme) {
      const defaultValidColorScheme = ["light", "dark", "system"];

      if (colorScheme === "system") colorScheme = getSystemTheme();

      if (enableColorScheme === "body") {
        if (theme && defaultValidColorScheme.includes(theme)) {
          bodyEl.style.colorScheme = colorScheme;
        } else {
          bodyEl.style.removeProperty("color-scheme");

          if (bodyEl.getAttribute("style")?.trim() === "") {
            bodyEl.removeAttribute("style");
          }
        }
      } else if (enableColorScheme === "html") {
        if (theme && defaultValidColorScheme.includes(theme)) {
          docEl.style.colorScheme = colorScheme;
        } else {
          docEl.style.removeProperty("color-scheme");

          if (docEl.getAttribute("style")?.trim() === "") {
            docEl.removeAttribute("style");
          }
        }
      }
    }
  }
};

/** @internal */
export function normalizeThemes<T extends unknown[]>(
  themes: T,
  enableSystem: boolean
): T {
  const cleaned = themes.filter((t) => t !== "system");

  const set = new Set(cleaned);

  if (enableSystem) set.add("system");
  else set.delete("system");

  return Array.from(set) as T;
}

/** @internal */
export const setMetaColorSchemeValue = (
  metaColorSchemeValue?: RzlThemeProviderProps["metaColorSchemeValue"]
) => {
  return {
    ...defaultMetaColorSchemeValue,
    ...metaColorSchemeValue
  };
};
