"use client";

import {
  type Dispatch,
  memo,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { useRouter } from "next/router";

import { isProdEnv } from "@rzl-zone/core/env/node";
import { minifyInnerHTMLScript } from "@rzl-zone/core/minifier/minify-script-inline";
import { isReactNode } from "@rzl-zone/core-react/utils/react-node";
import { assertIsPlainObject } from "@rzl-zone/utils-js/assertions";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";
import { isFunction, isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import type { RzlThemeProviderProps, ThemeCtx } from "../../types";

import {
  disableAnimation,
  getSystemTheme,
  getTheme,
  handlingApplyTheme,
  normalizeThemes,
  saveToLS,
  setMetaColorSchemeValue,
  updateMetaThemeColor
} from "../../utils/internal";
import { ThemeContext } from "../../contexts/ThemeContext";
import { defaultMetaColorSchemeValue, MEDIA_SCHEME_THEME } from "../../configs";

import { initialScriptTheme } from "../initial-script-theme";
// import { validateProps } from "../helper";
import { validateProps } from "../helper";

export const ContainerPagesDirTheme = <EnablingSystem extends boolean = true>(
  props: RzlThemeProviderProps<EnablingSystem>
) => {
  assertIsPlainObject(props, {
    message({ currentType, validType }) {
      return `Props 'RzlThemePagesProvider' must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  const { children, ..._restProps } = props;

  if (!isReactNode(children)) {
    throw new Error("Props children is required as ReactNode type!!!");
  }

  const context = useContext(ThemeContext.Context);

  // Ignore nested context providers, just passthrough children
  if (context) return children;

  return (
    <InternalPagesDirTheme<EnablingSystem> {..._restProps}>
      {children}
    </InternalPagesDirTheme>
  );
};

const InternalPagesDirTheme = <EnablingSystem extends boolean = true>(
  props: RzlThemeProviderProps<EnablingSystem>
) => {
  const {
    forcedTheme,
    disableTransitionOnChange,
    enableSystem,
    enableColorScheme,
    enableMetaColorScheme,
    storageKey,
    themes: _themes,
    defaultTheme: _defaultTheme,
    attribute,
    value,
    children,
    nonce,
    scriptProps,
    metaColorSchemeValue
  } = validateProps({ ...props, dir: "pages" });

  const themes = normalizeThemes(_themes, enableSystem);

  // Set Default Props Values;
  const defaultTheme =
    _defaultTheme && themes.includes(_defaultTheme)
      ? _defaultTheme
      : enableSystem
        ? "system"
        : "light";

  const [themeState, setThemeState] = useState<ThemeCtx["theme"]>(() =>
    getTheme(storageKey, themes, defaultTheme)
  );

  const [resolvedTheme, setResolvedTheme] = useState<
    Exclude<ThemeCtx["theme"], "system">
  >(() => (themeState === "system" ? getSystemTheme() : themeState));

  const attrs = useMemo(
    () => (!value ? themes : Object.values(value)),
    [value, themes]
  );

  const applyTheme = useCallback(
    (theme?: string) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === "system") {
        resolved = enableSystem ? getSystemTheme() : defaultTheme;
      }

      const name = value && value[resolved] ? value[resolved] : resolved;
      const disablingAnimation = disableTransitionOnChange
        ? disableAnimation(nonce)
        : null;

      handlingApplyTheme({
        theme: themeState,
        attribute,
        attributes: attrs,
        defaultTheme:
          defaultTheme === "system" ? getSystemTheme() : defaultTheme,
        enableColorScheme,
        name,
        resolved
      });

      updateMetaThemeColor({
        theme,
        enableMetaColorScheme,
        metaColorSchemeValue: setMetaColorSchemeValue(metaColorSchemeValue)
      });
      disablingAnimation?.();
    },
    [
      nonce,
      attrs,
      value,
      attribute,
      themeState,
      defaultTheme,
      enableSystem,
      enableColorScheme,
      metaColorSchemeValue,
      enableMetaColorScheme,
      disableTransitionOnChange
    ]
  );

  const setTheme = useCallback(
    (value: SetStateAction<NonNullable<ThemeCtx["theme"]>>) => {
      if (isFunction(value)) {
        setThemeState((prevTheme) => {
          const prev = isNonEmptyString(prevTheme) ? prevTheme : defaultTheme;
          const candidate = value(prev);

          if (!isNonEmptyString(candidate) || !themes.includes(candidate)) {
            // invalid value -> keep previous theme
            return prevTheme;
          }
          const newTheme = candidate;
          saveToLS(storageKey, newTheme);
          return newTheme;
        });
      } else if (isNonEmptyString(value)) {
        const validValue = themes.includes(value) ? value : defaultTheme;
        setThemeState(validValue);
        saveToLS(storageKey, validValue);
      }
    },
    [themes, storageKey, defaultTheme]
  );

  const resolvingTheme = (resolved: ReturnType<typeof getSystemTheme>) => {
    setResolvedTheme(resolved);
  };

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);

      resolvingTheme(resolved);

      if (themeState === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [themeState, forcedTheme, applyTheme, enableSystem, resolvedTheme]
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA_SCHEME_THEME);

    if (isFunction(media.addEventListener)) {
      media.addEventListener("change", handleMediaQuery);
    } else {
      // Intentionally use deprecated listener methods to support iOS & old browsers
      media.addListener(handleMediaQuery);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleMediaQuery(media);

    return () => {
      if (isFunction(media.removeEventListener)) {
        media.removeEventListener("change", handleMediaQuery);
      } else {
        media.removeListener(handleMediaQuery);
      }
    };
  }, [handleMediaQuery]);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      if (!e.newValue) {
        setTheme(defaultTheme);
        return;
      }

      // validate stored theme is allowed
      if (themes.includes(e.newValue)) {
        // update directly to avoid saving again to localStorage loop
        setThemeState(e.newValue);
      } else {
        // fallback to default
        setTheme(defaultTheme);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, themes, setTheme, defaultTheme]);

  // Whenever theme or forcedTheme changes, apply it
  useEffect(() => {
    applyTheme(forcedTheme ?? themeState);
  }, [forcedTheme, themeState, applyTheme]);

  const providerValue: ThemeCtx = useMemo(
    () => ({
      theme: themeState,
      themes,
      setTheme,
      forcedTheme,
      systemTheme: enableSystem ? resolvedTheme : undefined,
      resolvedTheme: themeState === "system" ? resolvedTheme : themeState
    }),
    [themeState, setTheme, forcedTheme, resolvedTheme, enableSystem, themes]
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScriptPagesDir
        {...{
          forcedTheme,
          storageKey,
          attribute,
          enableSystem,
          enableColorScheme,
          enableMetaColorScheme,
          defaultTheme,
          value,
          themes,
          nonce,
          scriptProps,
          metaColorSchemeValue: setMetaColorSchemeValue(metaColorSchemeValue)
        }}
      />

      <LsRefresherThemePagesDir
        storageKey={storageKey}
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        theme={providerValue.theme}
        themes={providerValue.themes}
        setTheme={providerValue.setTheme}
      />

      {children}
    </ThemeContext.Provider>
  );
};

const ThemeScriptPagesDir = memo(
  <EnablingSystem extends boolean = true>({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    themes,
    nonce,
    scriptProps,
    enableMetaColorScheme,
    metaColorSchemeValue = defaultMetaColorSchemeValue
  }: Omit<
    RzlThemeProviderProps<EnablingSystem>,
    "children" | "metaColorSchemeValue"
  > &
    Required<
      NonNullable<Pick<RzlThemeProviderProps, "metaColorSchemeValue">>
    >) => {
    const scriptArgs = useMemo(() => {
      return safeStableStringify([
        storageKey,
        attribute,
        defaultTheme,
        forcedTheme,
        themes,
        value,
        enableSystem,
        setMetaColorSchemeValue(metaColorSchemeValue),
        enableColorScheme,
        enableMetaColorScheme
      ]).slice(1, -1);
    }, [
      storageKey,
      attribute,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      metaColorSchemeValue,
      enableColorScheme,
      enableMetaColorScheme
    ]);

    const inlineScript = useMemo(() => {
      const raw = `(${initialScriptTheme.toString()})(${scriptArgs})`;

      const minified = minifyInnerHTMLScript(raw, { mangle: false });

      return minified || raw;
    }, [scriptArgs]);

    return (
      <script
        {...scriptProps}
        {...(nonce ? { nonce } : {})}
        data-script="rzlzone-themes"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: inlineScript
          // __html: `(${minifyInnerHTMLScriptInternalOnly(initialScriptTheme)})(${scriptArgs})`
        }}
      />
    );
  }
);

ThemeScriptPagesDir.displayName = isProdEnv()
  ? undefined
  : "ThemeScriptPagesDir(RzlzoneThemes)";

const LsRefresherThemePagesDir = ({
  theme,
  themes,
  setTheme,
  defaultTheme,
  enableSystem = true,
  storageKey = "rzl-theme"
}: {
  storageKey: string | undefined;
  defaultTheme: NonNullable<ThemeCtx["theme"]>;
  enableSystem: boolean | undefined;
  themes: string[];
  setTheme: Dispatch<SetStateAction<NonNullable<ThemeCtx["theme"]>>>;
  theme: string | undefined;
}) => {
  const router = useRouter();

  const storageRefresher = useCallback(() => {
    const getCurrentStorageTheme = (): ThemeCtx["theme"] | null => {
      return localStorage.getItem(storageKey);
    };

    const LocalStorageTheme = getCurrentStorageTheme();

    if (!theme) {
      if (LocalStorageTheme?.trim() === "") {
        return localStorage.removeItem(storageKey);
      }
      return;
    }

    const validValTheme = themes.includes(theme) ? theme : defaultTheme;

    if (!enableSystem && LocalStorageTheme === "system") {
      localStorage.setItem(
        storageKey,
        theme === "system" ? defaultTheme : validValTheme
      );
      return setTheme(theme === "system" ? defaultTheme : validValTheme);
    }

    if (
      !LocalStorageTheme ||
      LocalStorageTheme !== theme ||
      !themes?.includes(LocalStorageTheme)
    ) {
      localStorage.setItem(storageKey, validValTheme);
      return setTheme(validValTheme);
    }
  }, [themes, theme, defaultTheme, setTheme, storageKey, enableSystem]);

  useEffect(() => {
    storageRefresher();
  }, [router.pathname]);

  return null;
};

export default ContainerPagesDirTheme;
