/** @internal */
export const initialScriptTheme = (
  storageKey: string,
  attribute: string | string[],
  defaultTheme: string,
  forcedTheme: string | null | undefined,
  themes: string[],
  value: { [x: string]: string },
  enableSystem: boolean | undefined,
  metaColorSchemeValue: {
    light: string;
    dark: string;
  },
  enableColorScheme?: "html" | "body" | false | undefined,
  enableMetaColorScheme?: boolean | undefined
) => {
  const docEl = document.documentElement;
  const bodyEl = document.body;

  const updateDOM = (theme: string) => {
    const attributes = Array.isArray(attribute) ? attribute : [attribute];

    attributes.forEach((attr) => {
      const isClass = attr === "class";
      const classes =
        isClass && value ? themes.map((t) => value[t] || t) : themes;
      if (isClass) {
        if (classes.length > 0) docEl.classList.remove(...classes);
        docEl.classList.add(value && value[theme] ? value[theme] : theme);
      } else {
        docEl.setAttribute(attr, theme);
      }
    });

    setColorScheme(theme, enableColorScheme);
    updateMetaThemeColor({
      theme,
      enableMetaColorScheme,
      metaColorSchemeValue
    });
  };

  const updateMetaThemeColor = ({
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
  }) => {
    if (typeof document !== "undefined" && enableMetaColorScheme === true) {
      document
        // eslint-disable-next-line quotes
        .querySelectorAll('meta[name="theme-color"][data-rzl-theme]')
        .forEach((el) => el.remove());

      if (theme === "dark" && metaColorSchemeValue.dark) {
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = metaColorSchemeValue.dark;
        meta.setAttribute("data-rzl-theme", "dark");
        document.head.appendChild(meta);
      } else if (theme === "light" && metaColorSchemeValue.light) {
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = metaColorSchemeValue.light;
        meta.setAttribute("data-rzl-theme", "light");
        document.head.appendChild(meta);
      } else {
        if (metaColorSchemeValue.dark) {
          const meta1 = document.createElement("meta");
          meta1.name = "theme-color";
          meta1.content = metaColorSchemeValue.dark;
          meta1.media = "(prefers-color-scheme: dark)";
          meta1.setAttribute("data-rzl-theme", "dark");
          document.head.appendChild(meta1);
        }

        if (metaColorSchemeValue.light) {
          const meta2 = document.createElement("meta");
          meta2.name = "theme-color";
          meta2.content = metaColorSchemeValue.light;
          meta2.media = "(prefers-color-scheme: light)";
          meta2.setAttribute("data-rzl-theme", "light");
          document.head.appendChild(meta2);
        }
      }
    }
  };

  const setColorScheme = (
    theme: string,
    enableColorScheme?: "html" | "body" | false | undefined
  ) => {
    if (enableColorScheme !== false) {
      const defaultColorSchemes = ["light", "dark"];

      const fallback = defaultColorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;
      let colorScheme = defaultColorSchemes.includes(theme) ? theme : fallback;
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

  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  if (typeof forcedTheme === "string" && storageKey.trim().length) {
    updateDOM(forcedTheme);
  } else {
    try {
      const storedTheme =
        typeof storageKey === "string" && storageKey.trim().length
          ? localStorage.getItem(storageKey)
          : null;
      const themeName =
        storedTheme && themes.includes(storedTheme)
          ? storedTheme
          : defaultTheme;
      const isSystem = enableSystem && themeName === "system";
      const theme = isSystem ? getSystemTheme() : themeName;
      updateDOM(theme);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // mean is not support, so const skip.
    }
  }
};
