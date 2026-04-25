import "@rzl-zone/node-only";

import _fsExtra from "fs-extra";
import _fastGlob from "fast-glob";

export { ICONS } from "@/utils/helper/icons";

/** ----------------------------------------------------------------
 * * ***Node.js–only filesystem utilities (fs-extra).***
 * ----------------------------------------------------------------
 *
 * This export is a **thin re-export** of the `fs-extra` package,
 * intended for **server-side / Node.js environments only**.
 *
 * ⚠️ **DO NOT import this in browser or client-side code.**
 * The underlying implementation depends on Node.js built-in
 * modules such as `fs`, `path`, and `process`.
 *
 * - *Typical use cases:*
 *     - CLI tools.
 *     - Build scripts.
 *     - File system manipulation on the server.
 *
 * @see {@link https://github.com/jprichardson/node-fs-extra | **`https://github.com/jprichardson/node-fs-extra`**}.
 * @environment node
 */
export const fsExtra: typeof _fsExtra = _fsExtra;

/** ----------------------------------------------------------------
 * * ***High-performance file system globbing utility (fast-glob).***
 * ----------------------------------------------------------------
 *
 * This export re-exports the default export of `fast-glob`,
 * which is implemented using **CommonJS `export =` semantics**.
 *
 * Due to its reliance on Node.js APIs, this module is
 * **server-side only** and must not be bundled for the browser.
 *
 * - *Typical use cases:*
 *     - Resolving file patterns in build tools.
 *     - Scanning project directories.
 *     - CLI and automation scripts.
 *
 * @see {@link https://github.com/mrmlnc/fast-glob | **`https://github.com/mrmlnc/fast-glob`**}.
 * @environment node
 */
export const fastGlob: typeof _fastGlob = _fastGlob;

export {
  defaultPatternOptions,
  type PatternConfig,
  type PatternOptions
} from "@/_internal/libs/fast-globe-options";
