/** -------------------------------------------------------------------
 * * ***Customizer function for `isEqualWith`.***
 * -------------------------------------------------------------------
 * **Allows customizing how two values are compared for deep equality.**
 * @param value
 * - The current value being compared.
 * @param other
 * - The corresponding value from the other object.
 * @param indexOrKey
 * - The property key (for objects) or index (for arrays) of the current value.
 * @param parent
 * - The parent object or array containing `value`.
 * @param otherParent
 * - The parent object or array containing `other`.
 * @param stack
 * - WeakMap or tracking structure for already visited objects to handle circular references.
 * @returns
 * - `true`  → Treat the values as equal.
 * - `false` → Treat the values as unequal.
 * - `undefined` → Fallback to default deep equality comparison.
 * @example
 * ```ts
 * const customizer: CustomizerIsEqualWith = (value, other, key) => {
 *   if (typeof value === "string" && typeof other === "string") {
 *     return value.toLowerCase() === other.toLowerCase();
 *   }
 *   return undefined;
 * };
 *
 * baseDeepEqual({ name: "Alice" }, { name: "alice" }, customizer);
 * // returns true
 * ```
 */
export type CustomizerIsEqualWith = (
  /** * ***The current value being compared.*** */
  value: unknown,
  /** * ***The corresponding value from the other object.*** */
  other: unknown,
  /** * ***Property key (for objects) or index (for arrays) of the current value.*** */
  indexOrKey: PropertyKey,
  /** * ***Parent object or array containing `value`.*** */
  parent: unknown,
  /** * ***Parent object or array containing `other`.*** */
  otherParent: unknown,
  /** * ***WeakMap or tracking structure for visited objects to handle circular references.*** */
  stack: unknown
) => boolean | undefined;
