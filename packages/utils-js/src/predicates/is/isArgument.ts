/** -------------------
 * * ***Type guard: `isArguments`.***
 * -------------------
 * **Checks if `value` is likely an `arguments` object.**
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an ***[`IArguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)*** object, else `false`.
 * @example
 * isArguments(function() { return arguments; }());
 * // ➔ true
 * isArguments([1, 2, 3]);
 * // ➔ false
 */
export const isArguments = (value: unknown): value is IArguments => {
  return Object.prototype.toString.call(value) === "[object Arguments]";
};
