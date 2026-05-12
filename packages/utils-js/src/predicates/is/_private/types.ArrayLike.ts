/**
 * -------------------------------------------------------------------
 * * ***Array-like structure interface.***
 * -------------------------------------------------------------------
 * **Represents objects with indexed elements and a `length` property,
 * similar to arrays, but not necessarily full Array instances.**
 * @template T The type of elements stored in the array-like object.
 * @example
 * ```ts
 * function logArrayLike<T>(items: ArrayLike<T>) {
 *   for (let i = 0; i < items.length; i++) {
 *     console.log(items[i]);
 *   }
 * }
 *
 * const myNodeList: ArrayLike<Element> = document.querySelectorAll("div");
 * logArrayLike(myNodeList);
 * ```
 */
export interface ArrayLike<T> {
  /** * ***Number of elements in the array-like object.*** */
  readonly length: number;
  /** * ***Indexed access to elements.*** */
  readonly [n: number]: T;
}
