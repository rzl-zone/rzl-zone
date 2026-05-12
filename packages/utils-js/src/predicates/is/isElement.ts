import { isPlainObject } from "./isPlainObject";

/** ----------------------------------------------------
 * * ***Type guard: `isElement`.***
 * ----------------------------------------------------------
 * **Checks if `value` is likely a
 *   **[`DOM Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element)**.**
 * @template T - The type of the value being checked.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is extends instance of **[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element)**, else `false`.
 * @example
 * isElement(document.body);
 * // ➔ true
 * isElement(document.createElement("div"));
 * // ➔ true
 * isElement('<body>');
 * // ➔ false
 * isElement(document);
 * // ➔ false
 * isElement({ tagName: "DIV" });
 * // ➔ false
 */
export function isElement(value: []): value is [];
export function isElement<T extends Element>(value: T): value is T;
export function isElement(value: unknown): value is Element;
export function isElement(value: unknown) {
  return (
    !!value &&
    typeof value === "object" &&
    (value as Element)?.nodeType === 1 &&
    !isPlainObject(value)
  );
  // return typeof Element === "function" && value instanceof Element;
}
