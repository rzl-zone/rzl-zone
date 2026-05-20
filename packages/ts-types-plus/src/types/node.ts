/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface EventEmitter {}
    interface ReadableStream {}
    interface WritableStream {}
    interface Process {}
  }

  interface Buffer {}
}

type Global<K extends PropertyKey> = K extends keyof typeof globalThis
  ? (typeof globalThis)[K]
  : never;

type Empty<T> = keyof T extends never ? never : T;

/** --------------------------------------------------
 * * ***Utility Type: `NodeBuiltins`.***
 * --------------------------------------------------
 * Represents commonly used Node.js runtime objects
 * when Node.js type definitions are available.
 *
 * @description
 * Includes frequently encountered Node.js core objects
 * and runtime-related built-ins.
 *
 * - **Examples:**
 *      - `Buffer`
 *      - `EventEmitter`
 *      - `ReadableStream`
 *      - `WritableStream`
 *      - `process`
 *      - `URL`
 *
 * - ❌ Excludes:
 *      - Plain objects (`{}`)
 *      - Primitive values
 *      - Most Node.js modules/classes
 *
 * - ⚠️ Notes:
 *      - This type is intentionally **not exhaustive**.
 *      - Missing Node.js types automatically resolve to `never`.
 *      - `URL` is always included because it exists in both
 *        browser and Node.js environments.
 */
export type NodeBuiltins =
  | Empty<Global<"Buffer">>
  | Empty<NodeJS.EventEmitter>
  | Empty<NodeJS.ReadableStream>
  | Empty<NodeJS.WritableStream>
  | Empty<NodeJS.Process>
  | URL;
