import type { OverrideTypes, Prettify } from "@rzl-zone/ts-types-plus";

import { createMessage } from "@/_private/logger";

import { isSet } from "@/predicates/is/isSet";
import { isNil } from "@/predicates/is/isNil";
import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isError } from "@/predicates/is/isError";
import { isString } from "@/predicates/is/isString";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isValidDomain } from "@/predicates/is/isValidDomain";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";

import { removeSpaces } from "@/strings/sanitizations/removeSpaces";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { NormalizePathnameError } from "../_private/NormalizePathnameError";

/** --------------------------------------------------------
 * * ***Options when `keepNullable` is false (default).***
 * ---------------------------------------------------------
 * Returns `defaultPath` if `pathname` is empty or invalid.
 */
type UnKeepNullableOptions = {
  /** --------------------------------------------------------
   *  * ***Fallback value returned if `pathname` is empty-string or invalid.***
   * ---------------------------------------------------------
   * Must be a **`non-empty string`**, defaultValue: `"/"`.
   *
   * ---
   * @default "/"
   */
  defaultPath?: string;

  /** --------------------------------------------------------
   * * ***Whether to preserve `null` or `undefined`, defaultValue: `false`.***
   * ---------------------------------------------------------
   *
   * - ***⚠️ Warning:***
   *      - Non-boolean values will throw `TypeError`.
   * ---
   * @default false
   */
  keepNullable?: false;
};

/** --------------------------------------------------------
 * * ***Options when `keepNullable` is true.***
 * ---------------------------------------------------------
 *
 * Preserves `null` or `undefined` instead of returning `defaultPath`.
 */
type KeepNullableOptions = {
  /** --------------------------------------------------------
   * * ***Fallback path is ignored when `keepNullable` is true **(except if
   * `pathname` is empty-string or invalid, even this `true`)**,
   * defaultValue: `"/"`.***
   * --------------------------------------------------------
   *
   * @default "/"
   */
  defaultPath?: string;

  /** --------------------------------------------------------
   *  * ***Preserve `null` or `undefined` as-is if `true` (defaultValue: `false`).***
   * --------------------------------------------------------
   *
   * - ***⚠️ Warning:***
   *      - Keeps returning `defaultPath` when `pathname` is an empty string, even if enabled.
   *      - Non-boolean values will throw `TypeError`.
   * ---
   * **Must be `true` in this type.**
   *
   * ---
   *
   * @default false
   */
  keepNullable?: true;
};

type MainNormalizePathnameOptions = {
  /** --------------------------------------------------------
   * * ***Preserve trailing slash at the end of the normalized pathname, defaultValue: `false`.***
   * ---------------------------------------------------------
   *
   * - ***⚠️ Warning:***
   *      - Non-boolean values will throw `TypeError`.
   * ---
   *
   * @default false
   *
   */
  keepTrailingSlash?: boolean;

  /** --------------------------------------------------------
   * * ***Allow special localhost domain at the beginning of the pathname.***
   * ---------------------------------------------------------
   * @description
   * If `true`, the first segment of the pathname that is `/localhost` or `localhost`
   * (with or without a port, e.g., `localhost:3000`) will be treated as a special domain
   * and **removed** from the normalized pathname.
   *
   * ---
   * - **Examples (`localhostDomain: true`)**:
   *      - `"/localhost/path"` ➔ `"/path"`.
   *      - `"localhost:3000/path"` ➔ `"/path"`.
   *      - `"localhost"` ➔ `"/"` (**entire path removed**).
   * ---
   * - Only the **first path segment** is affected. Any subsequent occurrences of `"localhost"`
   *   will remain intact.
   * ---
   * - ***⚠️ Warning:***
   *      - Non-boolean values will throw `TypeError`.
   *
   * @default false
   */
  localhostDomain?: boolean;

  /** --------------------------------------------------------
   * * ***Custom list of file extensions that prevent the first path segment from being treated as a domain.***
   * --------------------------------------------------------
   *
   * - **Behavior:**
   *     - The first segment of a pathname is often interpreted as a domain (e.g., `example.com`).
   *     - If this first segment ends with any of the extensions listed here, it will **not** be considered a domain,
   *       and will instead be preserved as part of the relative path.
   *     - This is useful for cases where filenames appear at the start of a path and you want them treated as relative paths,
   *       such as `"image.png?version=2"` or `"archive.tar.gz#download"`.
   *     - Only the **first path segment** is affected; all other segments are processed normally.
   *     - **Ignored** if:
   *         1. The pathname starts with a full URL protocol (`http://` or `https://`), e.g., `"https://example.com/file.png"`.
   *         2. The first path segment is already a valid domain, e.g., `"example.com/image.png"`.
   * ---
   * - **Type & Validation:**
   *     - Must be a `Set<string>` or `string[]`.
   *     - Each string **must include the leading dot**, e.g., `.png`, `.tar.gz`.
   *     - Multi-part extensions (like `.tar.gz`, `.tar.bz`) are supported.
   *     - Throws a **TypeError** if:
   *        1. The type is not a `Set<string>` or `string[]`.
   *        2. Any string in the array/set is empty.
   *        3. Any string does not start with a dot (`.`).
   * ---
   * - **Usage Notes:**
   *     - Only applied when the first segment is otherwise domain-like **and** pathname is relative or domain-like without protocol.
   *     - Query strings (`?x=1`) and hash fragments (`#section`) are preserved.
   *
   * ---
   * @example
   *
   * 1.  #### Examples (relative paths, option active):
   *     ```ts
   *     normalizePathname("image.png?version=2", {
   *       ignoreDomainExtensions: [".png", ".jpg"]
   *     });
   *     // ➔ "/image.png?version=2"
   *
   *     normalizePathname("archive.tar.gz#download", {
   *       ignoreDomainExtensions: new Set([".tar.gz"])
   *     });
   *     // ➔ "/archive.tar.gz#download"
   *
   *     normalizePathname("script.js?module=true#top", {
   *       ignoreDomainExtensions: [".js"]
   *     });
   *     // ➔ "/script.js?module=true#top"
   *     ```
   *     ---
   * 2.  #### Examples (full URL or explicit domain - option ignored):
   *     ```ts
   *     normalizePathname("https://example.com/image.png?version=2", {
   *       ignoreDomainExtensions: [".png"]
   *     });
   *     // ➔ "/image.png?version=2"  // URL is parsed normally; ignoreDomainExtensions has no effect
   *
   *     normalizePathname("example.com/script.js?module=true#top", {
   *       ignoreDomainExtensions: [".js"]
   *     });
   *     // ➔ "/script.js?module=true#top"  // domain recognized; option ignored
   *     ```
   * ---
   * @notes
   * - Only the **first path segment** is checked.
   * - Prevents false-positive domain stripping for filenames that look like domains.
   * - Throws **TypeError** if invalid type or invalid string is provided.
   *
   * @default undefined // (feature inactive if not provided)
   */
  ignoreDomainExtensions?: Set<string> | string[];
};

/** --------------------------------------------------------
 * * ***Options for main `normalizePathname`.***
 * ---------------------------------------------------------
 *
 * *Combines `UnKeepNullableOptions` or `KeepNullableOptions` with trailing slash control.*
 */
type NormalizePathnameOptions = Prettify<
  MainNormalizePathnameOptions & (UnKeepNullableOptions | KeepNullableOptions)
>;

type NormalizePathnameOptionsKeepNullableTrue = MainNormalizePathnameOptions &
  KeepNullableOptions;
type NormalizePathnameOptionsKeepNullableFalse = MainNormalizePathnameOptions &
  UnKeepNullableOptions;

type ResUnKeepNullable<T> = T extends undefined
  ? string
  : T extends null
    ? string
    : T extends null | undefined
      ? string
      : string;

type ResKeepNullable<T> = T extends string
  ? string
  : T extends undefined
    ? undefined
    : T extends null
      ? null
      : T extends null | undefined
        ? null | undefined
        : string | null | undefined;

/** --------------------------------------------------------
 * * ***Utility: `normalizePathname`.***
 * --------------------------------------------------------
 *
 * **Normalizes any pathname or URL string to a clean, predictable format, useful for routing, file paths, and URL handling.**
 *
 * ---
 * - **Handles:**
 *     - Leading/trailing spaces.
 *     - Internal spaces in path segments.
 *     - Redundant slashes (`//`).
 *     - Full URLs vs relative paths.
 *     - Query (`?`) and hash (`#`) preservation.
 *     - Unicode & emoji characters.
 *     - Optional nullable preservation (`keepNullable`).
 *     - Optional trailing slash preservation (`keepTrailingSlash`).
 *     - Optional removal of localhost first segment (`localhostDomain`).
 *     - Prevention of false-positive domain stripping (`ignoreDomainExtensions`).
 * ---
 * - **Key Steps Internally:**
 *      1. Validate `options` (plain object, correct types).
 *      2. Validate `defaultPath` (non-empty string if `keepNullable` is false).
 *      3. Validate `ignoreDomainExtensions` (Set<string> | string[], each starts with `.`).
 *      4. Handle nullable:
 *         - Returns `null` / `undefined` if `keepNullable: true`.
 *         - Otherwise uses `defaultPath`.
 *      5. Trim spaces, remove internal spaces.
 *      6. If full URL: parse using `URL` constructor.
 *      7. If relative path or domain-like:
 *         - Remove `localhost`/`localhost:port` if `localhostDomain`.
 *         - Remove first segment if domain-like and **not** in `ignoreDomainExtensions`.
 *      8. Normalize slashes.
 *      9. Ensure leading slash.
 *      10. Handle trailing slash.
 *      11. Decode Unicode safely.
 *      12. Return normalized pathname + search + hash.
 * ---
 * - **Error Handling:**
 *     - ***TypeError***:
 *          - `defaultPath` invalid (non-string or empty) when `keepNullable: false`.
 *          - `keepNullable`, `keepTrailingSlash`, `localhostDomain` not boolean.
 *          - `ignoreDomainExtensions` invalid.
 *     - ***NormalizePathnameError*** (extends ***Error***):
 *          - Invalid URL parsing.
 *          - Unexpected normalization errors.
 * ---
 * - **Options:**
 *      ```ts
 *      {
 *        // fallback if invalid path, default: "/"
 *        defaultPath?: string;
 *        // preserve null/undefined, default: false
 *        keepNullable?: boolean;
 *        // preserve trailing slash, default: false
 *        keepTrailingSlash?: boolean;
 *        // remove localhost:port first segment, default: false
 *        localhostDomain?: boolean;
 *        // prevent domain stripping, default: undefined
 *        ignoreDomainExtensions?: Set<string> | string[];
 *      }
 *      ```
 *
 * ---
 *
 * @example
 * 1.  #### Basic path cleaning:
 *     ```ts
 *     normalizePathname("   /foo//bar  ");
 *     // ➔ "/foo/bar"
 *     ```
 *     ---
 * 2.  #### Trailing slash control:
 *     ```ts
 *     normalizePathname("/api//v1//user//", { keepTrailingSlash: true });
 *     // ➔ "/api/v1/user/"
 *     normalizePathname("/api//v1//user//", { keepTrailingSlash: false });
 *     // ➔ "/api/v1/user"
 *     ```
 *     ---
 * 3.  #### Full URL normalization:
 *     ```ts
 *     normalizePathname("https://example.com//path///to/resource?x=1#hash");
 *     // ➔ "/path/to/resource?x=1#hash"
 *     ```
 *     ---
 * 4.  #### Null/undefined preservation:
 *     ```ts
 *     normalizePathname(null, { keepNullable: true });
 *     // ➔ null
 *     normalizePathname(undefined, { keepNullable: true });
 *     // ➔ undefined
 *     ```
 *     ---
 * 5.  #### Default fallback:
 *     ```ts
 *     normalizePathname("", { defaultPath: "/home" });
 *     // ➔ "/home"
 *     ```
 *     ---
 * 6.  #### Localhost removal:
 *     ```ts
 *     normalizePathname("localhost:3000/path/to/resource", { localhostDomain: true });
 *     // ➔ "/path/to/resource"
 *     ```
 *     ---
 * 7.  #### Prevent false-positive domain stripping:
 *     ```ts
 *     normalizePathname("archive.tar.gz#download", { ignoreDomainExtensions: [".tar.gz"] });
 *     // ➔ "/archive.tar.gz#download"
 *     normalizePathname("image.png?version=2", { ignoreDomainExtensions: [".png"] });
 *     // ➔ "/image.png?version=2"
 *     ```
 *     ---
 * 8.  #### Emojis and Unicode:
 *     ```ts
 *     normalizePathname("🔥//deep//path///🚀");
 *     // ➔ "/🔥/deep/path/🚀"
 *     ```
 *     ---
 * 9.  #### Query-only or hash-only:
 *     ```ts
 *     normalizePathname("?page=2");
 *     // ➔ "/?page=2"
 *     normalizePathname("#section3");
 *     // ➔ "/#section3"
 *     ```
 *     ---
 * 10. #### Complex nested paths:
 *     ```ts
 *     normalizePathname("   //nested///folder//file.txt  ");
 *     // ➔ "/nested/folder/file.txt"
 *     ```
 *     ---
 * 11. #### Invalid URL triggers error:
 *     ```ts
 *     try {
 *       normalizePathname("http://");
 *     } catch (e) {
 *       // console.log(e);
 *     }
 *     ```
 *     ---
 * 12. #### First segment is domain but ignored due to extension:
 *     ```ts
 *     normalizePathname("example.tar.bz/file", { ignoreDomainExtensions: [".tar.bz"] });
 *     // ➔ "/example.tar.bz/file"
 *     ```
 */
export function normalizePathname<T>(
  pathname: T,
  options?: NormalizePathnameOptionsKeepNullableFalse
): ResUnKeepNullable<T>;
export function normalizePathname<T>(
  pathname: T,
  options?: NormalizePathnameOptionsKeepNullableTrue
): ResKeepNullable<T>;
export function normalizePathname(
  pathname: unknown,
  options: NormalizePathnameOptions = {}
): string | null | undefined {
  assertIsPlainObject(options, {
    message({ currentType, validType }) {
      return errorMsg(
        `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      );
    }
  });

  let {
    defaultPath = "/",
    keepNullable = false,
    keepTrailingSlash = false,
    localhostDomain = false,
    ignoreDomainExtensions = undefined
  } = options;

  // Validate defaultPath
  if (!isNonEmptyString(defaultPath)) {
    throw new TypeError(
      errorMsg(
        `Parameter \`defaultPath\` property of the \`options\` (second parameter) must be of type \`string\` and not empty-string, but received: \`${getPreciseType(
          defaultPath
        )}\`, with value: \`${safeStableStringify(defaultPath, {
          keepUndefined: true
        })}\`.`
      )
    );
  }

  assertIsBoolean(keepNullable, {
    message({ currentType, validType }) {
      return errorMsg(
        `Parameter \`keepNullable\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      );
    }
  });
  assertIsBoolean(keepTrailingSlash, {
    message({ currentType, validType }) {
      return errorMsg(
        `Parameter \`keepTrailingSlash\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      );
    }
  });
  assertIsBoolean(localhostDomain, {
    message({ currentType, validType }) {
      return errorMsg(
        `Parameter \`localhostDomain\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
      );
    }
  });

  let ignoreDomainExtsSet: Set<string> | undefined;

  if (!isUndefined(ignoreDomainExtensions)) {
    if (!isSet(ignoreDomainExtensions) && !isArray(ignoreDomainExtensions)) {
      throw new TypeError(
        errorMsg(
          `Parameter \`ignoreDomainExtensions\` must be of type a \`Set<string>\` or \`string[]\`, but received: \`${getPreciseType(
            ignoreDomainExtensions
          )}\`.`
        )
      );
    }

    ignoreDomainExtsSet = isSet(ignoreDomainExtensions)
      ? ignoreDomainExtensions
      : new Set(ignoreDomainExtensions);

    // validation every ext
    let idx = 0;
    for (const ext of ignoreDomainExtsSet) {
      if (!isNonEmptyString(ext)) {
        throw new TypeError(
          errorMsg(
            `Parameter \`ignoreDomainExtensions[${idx}]\` must be a \`string\` and \`non-empty string\`, but received: \`${safeStableStringify(
              ext,
              { keepUndefined: true }
            )}\`.`
          )
        );
      }
      if (!ext.startsWith(".")) {
        throw new TypeError(
          errorMsg(
            `Parameter \`ignoreDomainExtensions[${idx}]\` must start with a dot (.), but received: ${safeStableStringify(
              ext,
              { keepUndefined: true }
            )}`
          )
        );
      }
      idx++;
    }
  }

  try {
    if (keepNullable && (isNil(pathname) || !isString(pathname))) {
      if (isNull(pathname)) return null;
      return undefined;
    }

    // If the pathname is invalid (null, undefined, or an empty string), return the default value, only if `keepNullable` is false
    let currentPathName: string = isNonEmptyString(pathname)
      ? pathname
      : defaultPath;

    // Trim spaces from the string (only trim leading and trailing spaces)
    currentPathName = removeSpaces(currentPathName, { trimOnly: true }).replace(
      /\s+/g,
      ""
    ); // remove all space

    currentPathName = stripLeadingDomain(currentPathName, {
      keepTrailingSlash,
      localhostDomain,
      ignoreDomainExtensions: ignoreDomainExtsSet
    });

    let _pathName: string = currentPathName;
    let search = "";
    let hash = "";

    // relative path: extract search/hash manually
    const searchIndex = currentPathName.indexOf("?");
    const hashIndex = currentPathName.indexOf("#");

    if (searchIndex !== -1) {
      search = currentPathName.slice(
        searchIndex,
        hashIndex !== -1 ? hashIndex : undefined
      );
    }
    if (hashIndex !== -1) {
      hash = currentPathName.slice(hashIndex);
    }

    const endIndex = Math.min(
      searchIndex !== -1 ? searchIndex : currentPathName.length,
      hashIndex !== -1 ? hashIndex : currentPathName.length
    );
    _pathName = currentPathName.slice(0, endIndex);

    // Normalize slashes
    _pathName = "/" + _pathName.replace(/^\/+/, "").replace(/\/{2,}/g, "/");

    // Trailing slash
    if (!keepTrailingSlash && _pathName !== "/") {
      _pathName = _pathName.replace(/\/+$/, "");
    }

    // Decode Unicode safely
    _pathName = decodeUnicodeSequences(_pathName);
    search = decodeUnicodeSequences(search);
    hash = decodeUnicodeSequences(hash);

    return _pathName + search + hash;
  } catch (error) {
    // Handle any errors that occur during processing
    throwError(error);
  }
}

// --- Internal Helper Utils ----

/**
 * @internal ***`Not part of the public API.`***
 */
const errorMsg = (msg: string) => createMessage("normalizePathname", msg);

/**
 * @internal ***`Not part of the public API.`***
 */
const decodeUnicodeSequences = (str: string): string => {
  return str.replace(/(?:%(?:[0-9A-F]{2})){2,}/gi, (match) => {
    try {
      const decoded = decodeURIComponent(match);
      // eslint-disable-next-line no-control-regex
      if (/^[\u0000-\u007F]+$/.test(decoded)) return match;
      // eslint-enable-next-line no-control-regex
      return decoded;
    } catch {
      return match;
    }
  });
};

/**
 * @internal ***`Not part of the public API.`***
 */
const stripLeadingDomain = (
  path: string,
  options: OverrideTypes<
    MainNormalizePathnameOptions,
    { ignoreDomainExtensions?: Set<string> }
  >
): string => {
  let currentPath = path;

  const { ignoreDomainExtensions, localhostDomain } = options;

  // Full URL (protocol) -> only normalize path, ignore ignoreDomainExtensions
  if (/^https?:\/\//i.test(currentPath)) {
    try {
      const url = new URL(currentPath);
      currentPath =
        url.pathname.replace(/^\/+/, "").replace(/\/{2,}/g, "/") +
        url.search +
        url.hash;

      return ensureLeadingSlash(currentPath);
    } catch (error) {
      // fallback: keep as-is
      // Handle any errors that occur during processing
      throwError(error);
    }
  }

  // relative path: remove leading slash
  if (currentPath.startsWith("/")) {
    currentPath = currentPath.replace(/\/{2,}/g, "/").slice(1);
  }

  // take first segment
  const segments = currentPath.split("/");
  const firstPart = segments[0];
  const domainPart = firstPart?.split(":")[0];

  const isDomain = isValidDomain(domainPart, {
    subdomain: true,
    allowUnicode: true,
    wildcard: true,
    allowLocalhost: localhostDomain,
    allowPort: true,
    allowProtocol: true,
    topLevel: false
  });

  // ignoreDomainExtensions only applies for relative/non-protocol paths
  let hasIgnoredExtension = false;
  if (ignoreDomainExtensions) {
    for (const ext of ignoreDomainExtensions) {
      if (firstPart?.endsWith(ext)) {
        hasIgnoredExtension = true;
        break;
      }
    }
  }

  if (isDomain && !hasIgnoredExtension) {
    segments.shift(); // remove first segment
  }

  return ensureLeadingSlash(segments.join("/"));
};

/**
 * @internal ***`Not part of the public API.`***
 */
const ensureLeadingSlash = (path: string): string => {
  if (!path.startsWith("/")) path = "/" + path;
  return path;
};

/**
 * @internal ***`Not part of the public API.`***
 */
const throwError = (error: unknown): never => {
  // Handle any errors that occur during processing
  const originalError = isError(error) ? error : new Error(String(error));

  throw new NormalizePathnameError(
    errorMsg(`Failed to normalize pathname: ${originalError.message}`),
    originalError
  );
};
