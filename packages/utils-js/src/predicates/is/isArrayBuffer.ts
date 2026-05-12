/** ----------------------------------------------------
 * * ***Type guard: `isArrayBuffer`.***
 * ----------------------------------------------------
 * **Checks if `value` is classified as an `ArrayBuffer` object.**
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is instance of ***[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)***, else `false`.
 * @example
 * isArrayBuffer(new ArrayBuffer(2));
 * // ➔ true
 * isArrayBuffer(new Array(2));
 * // ➔ false
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}
