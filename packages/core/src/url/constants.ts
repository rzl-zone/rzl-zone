/** -------------------------------------------------------------------
 * * ***Matches URL protocols that are followed by slashes,
 * such as `http`, `https`, `ftp`, `gopher`, and `file`.***
 * --------------------------------------------------------------------
 *
 * This regular expression is used internally to detect URL protocols
 * that typically appear in slashed URL formats (e.g. `https://`).
 *
 * It is primarily intended for low-level URL parsing or normalization
 * logic and is **not** a full URL validator.
 *
 * - **Behavior:**
 *      - Matches common slashed URL protocols
 *      - Does not validate the full URL structure
 *      - Intended for internal parsing heuristics only
 *
 * @internal
 */
export const SLASHED_PROTOCOL_URL = /https?|ftp|gopher|file/;

/** -------------------------------------------------------------------
 * * ***Defines the canonical list of URL object property keys
 * commonly used by URL parsing implementations.***
 * --------------------------------------------------------------------
 *
 * This constant represents a readonly list of keys that describe
 * the typical shape of a parsed URL object.
 *
 * It is useful for:
 * - Iterating over known URL fields
 * - Normalizing or serializing URL-like objects
 * - Type-safe key access via `as const`
 *
 * - **Behavior:**
 *      - Provides a stable, ordered list of URL-related keys
 *      - Enforces literal typing via `as const`
 *      - Intended for internal or low-level utilities
 */
export const URL_OBJECT_KEYS = [
  "auth",
  "hash",
  "host",
  "hostname",
  "href",
  "path",
  "pathname",
  "port",
  "protocol",
  "query",
  "search",
  "slashes"
] as const;
