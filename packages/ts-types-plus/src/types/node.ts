/** --------------------------------------------------
 * * ***Utility Type: `NodeBuiltins`.***
 * --------------------------------------------------
 * **Represents Node.js built-in core objects.**
 * @description
 * Includes commonly used Node.js core classes/objects that are not plain objects.
 * - **Examples:**
 *      - `Buffer`.
 *      - `EventEmitter`.
 *      - `Stream`.
 *      - `URL`.
 *      - `process`.
 * - ❌ Excludes plain objects (`{}`) and primitives.
 * - ⚠️ Note:
 *      - This is **not exhaustive** because Node.js has
 *        many built-in modules, but it covers the main
 *        runtime objects often encountered.
 */
export type NodeBuiltins =
  | Buffer
  | NodeJS.EventEmitter
  | NodeJS.ReadableStream
  | NodeJS.WritableStream
  | NodeJS.Process
  | URL;
