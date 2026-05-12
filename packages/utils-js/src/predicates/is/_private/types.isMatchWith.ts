/** -------------------------------------------------------------------
 * * ***Customizer function for `isMatchWith`.***
 * -------------------------------------------------------------------
 * **Allows customizing how two values are compared for partial/object match.**
 * @param value
 * - The current value from the object being tested.
 * @param other
 * - The corresponding value from the source object.
 * @param indexOrKey
 * - The property key (for objects) or index (for arrays) of the current value.
 * @param object
 * - The parent object containing `value`.
 * @param source
 * - The parent source object containing `other`.
 * @returns
 * - `true`  → Treat the values as matching.
 * - `false` → Treat the values as not matching.
 * - `undefined` → Fallback to default match comparison.
 * @example
 * ```ts
 * const customizer: CustomizerIsMatchWith = (value, other) => {
 *   if (typeof value === "string" && typeof other === "string") {
 *     return value.toLowerCase() === other.toLowerCase();
 *   }
 *   return undefined;
 * };
 *
 * baseIsMatch({ name: "Alice" }, { name: "alice" }, customizer);
 * // returns true
 * ```
 */
export type CustomizerIsMatchWith = (
  /** * ***Current value from the object being tested.*** */
  value: unknown,
  /** * ***Corresponding value from the source object.*** */
  other: unknown,
  /** * ***Property key (objects) or index (arrays) of the current value.*** */
  indexOrKey: PropertyKey,
  /** * ***Parent object containing `value`.*** */
  object: object,
  /** * ***Parent source object containing `other`.*** */
  source: object
) => boolean | undefined;
