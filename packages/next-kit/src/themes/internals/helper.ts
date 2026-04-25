import {
  assertIsBoolean,
  assertIsPlainObject,
  assertIsString
} from "@rzl-zone/utils-js/assertions";
import {
  getPreciseType,
  isArray,
  isBoolean,
  isNil,
  isNonEmptyString,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import { type RzlThemeProviderProps } from "..";
import { setMetaColorSchemeValue } from "../utils/internal";
import { defaultMetaColorSchemeValue, defaultThemes } from "../configs";

import type { Attribute } from "../types";

/** @internal */
export function minifyInnerHTMLScriptInternalOnly<T>(script: T): string {
  if (isNil(script)) return "";

  return (
    String(script)
      .replace(/\/\/.*(?=[\n\r])/g, "") // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
      .replace(/(?<=\S)[ \t]{2,}(?=\S)/g, " ") // Remove extra spaces/tabs between words
      // eslint-disable-next-line no-useless-escape
      .replace(/\s*([\(\)\{\};,?:=<>!&|+\-*\/])\s*/g, "$1") // Remove spaces before & after operators and punctuation
      .replace(/\[\s*([^\]]*?)\s*\]/g, "[$1]") // Remove spaces inside arrays without touching strings inside
      .replace(/\s*(=>|===|!==|==|!=|>=|<=|\+|-|\*|\/|&&|\|\|)\s*/g, "$1") // Remove spaces around operators
      .replace(
        /\b(return|if|else|for|while|do|try|catch|finally|switch|case|default|break|continue|throw|typeof|instanceof|in|void|yield|async|await|new|delete|import|export|class|extends|static|get|set)\s+/g,
        "$1 "
      ) // Ensure one space after important keywords
      .replace(/\b(var|let|const|function)\s+/g, "$1 ") // Ensure one space after variable & function declarations
      .replace(/\b(\d+)\s+([a-zA-Z_$])/g, "$1$2") // Remove space between number and letter (e.g., 100 px -> 100px)
      .replace(/([a-zA-Z_$])\s*\(\s*/g, "$1(") // Remove spaces before/after opening parentheses in function calls
      .replace(/\)\s*\{\s*/g, "){") // Remove spaces before/after `{` following `)`
      .replace(/;}/g, "}") // Remove `;` before `}`
      .replace(/([{[])\s*,/g, "$1") // Remove commas right after { or [
      .replace(/,(\s*[}\]])/g, "$1") // Remove commas before } or ]
      .replace(/(["'`])\s*\+\s*(["'`])/g, "$1$2") // Remove unnecessary `+` in string concatenation
      .replace(/\bconsole\.log\s*\(.*?\);?/g, "") // Remove all console.log()
      .replace(/\bconsole\.info\s*\(.*?\);?/g, "") // Remove all console.info()
      .replace(/\bconsole\.warn\s*\(.*?\);?/g, "") // Remove all console.warn()
      .replace(/\bconsole\.error\s*\(.*?\);?/g, "") // Remove all console.error()
      .replace(/\bconsole\.debug\s*\(.*?\);?/g, "") // Remove all console.debug()
      .replace(/\bconsole\.trace\s*\(.*?\);?/g, "") // Remove all console.trace()
      .replace(/\bconsole\.assert\s*\(.*?\);?/g, "") // Remove all console.assert()
      .replace(/\bconsole\.time\s*\(.*?\);?/g, "") // Remove all console.time()
      .replace(/\bconsole\.timeEnd\s*\(.*?\);?/g, "") // Remove all console.timeEnd()
      .replace(/\bconsole\.timeLog\s*\(.*?\);?/g, "") // Remove all console.timeLog()
      .replace(/\bconsole\.count\s*\(.*?\);?/g, "") // Remove all console.count()
      .replace(/\bconsole\.countReset\s*\(.*?\);?/g, "") // Remove all console.countReset()
      .replace(/\s{2,}/g, " ") // Remove remaining excessive spaces
      .trim()
  );
}

/** @internal */
export const validateAttributeProps = (
  attr: Attribute | Attribute[]
): void | never => {
  if (!isNonEmptyString(attr)) {
    throw new TypeError(
      `Props \`attribute\` must be of type \`string\` or \`undefined\` and value can't be empty-string, but received: \`${getPreciseType(
        attr
      )}\`.`
    );
  }
  if (attr !== "class" && !attr.startsWith("data-")) {
    throw new TypeError(
      `Props \`attribute\` must be \`"class"\` or start with \`"data-"\`, but received value: \`${safeStableStringify(
        attr,
        { keepUndefined: true }
      )}\`.`
    );
  }
};

/** @internal */
export const validateProps = <EnablingSystem extends boolean = true>(
  props: RzlThemeProviderProps<EnablingSystem> & { dir: "app" | "pages" }
) => {
  const {
    forcedTheme,
    disableTransitionOnChange = true,
    enableSystem = true,
    enableColorScheme = "html",
    enableMetaColorScheme = true,
    storageKey = "rzl-theme",
    defaultTheme: _defaultTheme,
    attribute = "data-theme",
    value,
    children,
    nonce,
    scriptProps,
    themes = defaultThemes
  } = props;

  let { metaColorSchemeValue = defaultMetaColorSchemeValue } = props;

  const providerName =
    props.dir === "app" ? "RzlThemeAppProvider" : "RzlThemePagesProvider";

  if (!isUndefined(nonce)) {
    assertIsString(nonce, {
      message({ currentType, validType }) {
        return `Props \`nonce\` at '${providerName}', must be of type \`${validType}\`, but received: \`${currentType}\`.`;
      }
    });
  }

  if (!isUndefined(value)) {
    assertIsPlainObject(value, {
      message({ currentType, validType }) {
        return `Props \`value\` must be a \`${validType}\`, but received: \`${currentType}\`.`;
      }
    });

    for (const [themeName, themeValue] of Object.entries(value)) {
      if (!isNonEmptyString(themeName)) {
        throw new TypeError(
          `Props \`value\` at '${providerName}', the key name theme "${themeName}" must be of type a \`string\` and \`non-empty string\`, but received: \`${getPreciseType(
            themeName
          )}\`, with current value: \`${safeStableStringify(themeName, {
            keepUndefined: true
          })}\`.`
        );
      }
      if (!isNonEmptyString(themeValue)) {
        throw new TypeError(
          `Props \`value\` at '${providerName}', the value for theme key "${themeName}" must be of type a \`string\` and \`non-empty string\`, but received: \`${getPreciseType(
            themeValue
          )}\`, with current value: \`${safeStableStringify(themeValue, {
            keepUndefined: true
          })}\`.`
        );
      }
    }
  }

  if (!isUndefined(attribute)) {
    if (isArray(attribute)) {
      attribute.forEach(validateAttributeProps);
    } else {
      validateAttributeProps(attribute);
    }
  }

  if (!isUndefined(_defaultTheme) && !isNonEmptyString(_defaultTheme)) {
    throw new TypeError(
      `Props \`defaultTheme\` at '${providerName}', must be of type a \`string\` and \`non-empty string\`, but received: \`${getPreciseType(
        _defaultTheme
      )}\`.`
    );
  }
  if (!isUndefined(storageKey) && !isNonEmptyString(storageKey)) {
    throw new TypeError(
      `Props \`storageKey\` at '${providerName}', must be of type \`string\` and value cant be \`empty-string\`, but received: \`${getPreciseType(
        storageKey
      )}\`.`
    );
  }

  if (
    (isBoolean(enableColorScheme) && enableColorScheme !== false) ||
    (isString(enableColorScheme) &&
      !["html", "body"].includes(enableColorScheme))
  ) {
    throw new TypeError(
      `Props \`enableColorScheme\` at '${providerName}', must be of type \`string\`, \`boolean\` and if value is a string must one of ("body" or "html") if \`boolean\` valid value only \`false\`, but received: \`${getPreciseType(
        enableColorScheme
      )}\`, with current value: \`${safeStableStringify(enableColorScheme, {
        keepUndefined: true
      })}\`.`
    );
  }

  if (!isUndefined(forcedTheme) && !isString(forcedTheme)) {
    throw new TypeError(
      `Props \`forcedTheme\` at '${providerName}', must be of type \`string\`, but received: \`${getPreciseType(
        forcedTheme
      )}\`.`
    );
  }

  if (!isUndefined(metaColorSchemeValue)) {
    assertIsPlainObject(metaColorSchemeValue, {
      message({ currentType, validType }) {
        return `Props \`metaColorSchemeValue\` at '${providerName}', must be a \`${validType}\`, but received: \`${currentType}\`.`;
      }
    });

    metaColorSchemeValue = setMetaColorSchemeValue(metaColorSchemeValue);

    if (!isNonEmptyString(metaColorSchemeValue.light)) {
      throw new TypeError(
        `Props \`metaColorSchemeValue.light\` at '${providerName}', must be of type \`string\`, but received: \`${getPreciseType(
          metaColorSchemeValue.light
        )}\`.`
      );
    }

    if (!isNonEmptyString(metaColorSchemeValue.dark)) {
      throw new TypeError(
        `Props \`metaColorSchemeValue.dark\` at '${providerName}', must be of type \`string\`, but received: \`${getPreciseType(
          metaColorSchemeValue.dark
        )}\`.`
      );
    }
  }

  assertIsBoolean(enableSystem, {
    message({ currentType, validType }) {
      return `Props \`enableSystem\` at '${providerName}', must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });
  assertIsBoolean(enableMetaColorScheme, {
    message({ currentType, validType }) {
      return `Props \`enableMetaColorScheme\` at '${providerName}', must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });
  assertIsBoolean(disableTransitionOnChange, {
    message({ currentType, validType }) {
      return `Props \`disableTransitionOnChange\` at '${providerName}', must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  return {
    forcedTheme,
    disableTransitionOnChange,
    enableSystem,
    enableColorScheme,
    enableMetaColorScheme,
    storageKey,
    defaultTheme: _defaultTheme,
    attribute,
    value,
    children,
    nonce,
    scriptProps,
    metaColorSchemeValue,
    themes
  };
};
