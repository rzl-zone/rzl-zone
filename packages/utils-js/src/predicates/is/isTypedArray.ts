import type { TypedArray } from "@rzl-zone/ts-types-plus";

const typedArrayTags = new Set([
  "[object Int8Array]",
  "[object Uint8Array]",
  "[object Uint8ClampedArray]",
  "[object Int16Array]",
  "[object Uint16Array]",
  "[object Int32Array]",
  "[object Uint32Array]",
  "[object Float32Array]",
  "[object Float64Array]",
  "[object BigInt64Array]",
  "[object BigUint64Array]"
]);

/** --------------------------------------------------
 * * ***Type guard: `isTypedArray`.***
 * ----------------------------------------------------------
 * **Checks if `value` is classified as a
 * **[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)**.**
 * - **Behavior:**
 *    - Validates that `value` is a non-null object.
 *    - Uses `Object.prototype.toString` tag matching against known typed array tags.
 *    - Narrows type to **{@link TypedArray | `TypedArray`}** when true.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a typed array, otherwise `false`.
 * @example
 * isTypedArray(new Uint8Array);          // ➔ true
 * isTypedArray(new Uint8Array());        // ➔ true
 * isTypedArray(new Float32Array());      // ➔ true
 * isTypedArray(new Uint8ClampedArray()); // ➔ true
 * isTypedArray([]);                      // ➔ false
 * isTypedArray(Buffer.from("hi"));       // ➔ false
 */
export function isTypedArray(value: unknown): value is TypedArray {
  return (
    value != null &&
    typeof value === "object" &&
    typedArrayTags.has(Object.prototype.toString.call(value))
  );
}
