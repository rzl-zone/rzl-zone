/** ----------------------------------------------------
 * * ***Type guard: `isBuffer`.***
 * ----------------------------------------------------------
 * **Checks if a value is a *****{@link Buffer | `Node.js - Buffer`}***** instance.**
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a `Buffer`, else `false`.
 * @example
 * isBuffer(new Buffer(2));
 * // ➔ true
 * isBuffer(Buffer.alloc(10));
 * // ➔ true
 * isBuffer(Buffer.from('foo'));
 * // ➔ true
 * isBuffer([]);
 * // ➔ false
 * isBuffer('a string');
 * // ➔ false
 * isBuffer(new Uint8Array(1024));
 * // ➔ false
 */
export const isBuffer = (value: unknown): value is Buffer => {
  return (
    typeof Buffer !== "undefined" &&
    typeof Buffer.isBuffer === "function" &&
    Buffer.isBuffer(value)
  );
};
