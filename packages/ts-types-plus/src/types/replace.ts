import type { Identity } from "./identity";

/** -------------------------------------------------------
 * * ***Utility Type: `Replace`.***
 * -------------------------------------------------------
 * **Replaces the **first occurrence** of a substring (`Pivot`)
 * inside a string (`T`) with another substring (`ReplaceBy`).**
 * @template T - The source string.
 * @template Pivot - The substring to replace.
 * @template ReplaceBy - The substring that replaces `Pivot`.
 * @example
 * ```ts
 * type Case1 = Replace<'remove me me', 'me', 'him'>;
 * // ➔ 'remove him me'
 * type Case2 = Replace<'remove me me', 'us', 'him'>;
 * // ➔ 'remove me me'
 * type Case3 = Replace<'aaaa', 'a', 'b'>;
 * // ➔ 'baaa'
 * type Case4 = Replace<'hello', 'x', 'y'>;
 * // ➔ 'hello' (no match found)
 * ```
 */
export type Replace<
  T extends string,
  Pivot extends string,
  ReplaceBy extends string
> = T extends `${infer A}${Pivot}${infer B}` ? `${A}${ReplaceBy}${B}` : T;

/** --------------------------------------------------
 * * ***Utility Type: `ReplaceToPartial`.***
 * --------------------------------------------------
 * **Replaces specified keys in a type with a new value type, making them optional.**
 * - ✅ Useful when certain properties in a type should allow partial overrides
 *   while keeping the rest of the structure intact.
 * @template TypeToBeChecked - The original object type.
 * @template KeyToBeReplaced - The keys in the original type to be replaced.
 * @template NewValueToUse - The new type to assign to the replaced keys.
 * @example
 * ```ts
 * type A = { name: string; age: number };
 * type B = ReplaceToPartial<A, 'age', string>;
 * // ➔ { name: string; age?: string }
 * ```
 */
export type ReplaceToPartial<
  TypeToBeChecked,
  KeyToBeReplaced extends keyof TypeToBeChecked,
  NewValueToUse
> = Identity<
  Pick<TypeToBeChecked, Exclude<keyof TypeToBeChecked, KeyToBeReplaced>> & {
    [P in KeyToBeReplaced]?: NewValueToUse;
  }
>;

/** --------------------------------------------------
 * * ***Utility Type: `ReplaceToRequired`.***
 * --------------------------------------------------
 * **Replaces specified keys in a type with a new value type, making them required.**
 * - ✅ Useful when redefining a property’s type while ensuring it's required.
 * @template TypeToBeChecked - The original object type.
 * @template KeyToBeReplaced - The keys in the original type to be replaced.
 * @template NewValueToUse - The new type to assign to the replaced keys.
 * @example
 * ```ts
 * type A = { name?: string | string[]; age: number };
 * type B = ReplaceToRequired<A, 'name', string>;
 * // ➔ { name: string; age: number }
 * ```
 */
export type ReplaceToRequired<
  TypeToBeChecked,
  KeyToBeReplaced extends keyof TypeToBeChecked,
  NewValueToUse
> = Identity<
  Pick<TypeToBeChecked, Exclude<keyof TypeToBeChecked, KeyToBeReplaced>> & {
    [P in KeyToBeReplaced]: NewValueToUse;
  }
>;
