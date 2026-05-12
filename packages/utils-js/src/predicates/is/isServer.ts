/** ---------------------------------------------------------
 * * ***Environment Predicate: `isServer`.***
 * ---------------------------------------------------------
 * **Detects whether the current code is executing in a
 * **non-browser JavaScript runtime** (server-side) rather
 * than in a web browser.**
 * @description
 * It simply checks for the absence of key browser globals like
 * [**`window`**](https://developer.mozilla.org/docs/Web/API/Window/window) and
 * [**`document`**](https://developer.mozilla.org/docs/Web/API/Window/document).
 *  - *If those globals aren’t present, we treat the runtime as a server environment.*
 * @returns {boolean}
 *  * ***true**  – Code is executing on the `server`.*
 *  * ***false** – Code is executing in a `browser`.*
 * @example
 * if (isServer()) {
 *   console.log("Running on a server-side runtime");
 * } else {
 *   console.log("Running in a browser");
 * }
 */
export const isServer = (): boolean => {
  return typeof window === "undefined" || typeof document === "undefined";
};
