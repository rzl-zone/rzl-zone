import type { AnyStringRecord } from "./record";

/** -------------------------------------------------------
 * * ***Utility Type: `LooseLiteral`.***
 * -------------------------------------------------------
 * **Improves the autocompletion and inference of **loose literal types**.**
 * @description
 * Ensures that specified literal types are preserved while still
 * allowing assignment of a broader base type.
 * - **Useful in scenarios where:**
 *      - You want to accept **specific literal values** but still allow
 *        any value of a base type (like `string` or `number`).
 *      - You want stricter typing in generics while preserving literals.
 * @template Literal - The literal type(s) to preserve.
 * @template BaseType - The base type to extend when not matching literal.
 * @example
 * ```ts
 * type T0 = LooseLiteral<"a" | "b" | "c", string>;
 * // ➔ "a" | "b" | "c" | (string & {})
 *
 * declare function acceptsLoose<T extends LooseLiteral<"x" | "y", string>>(value: T): T;
 * const a = acceptsLoose("x");
 * // ➔ "x"
 * const b = acceptsLoose("any string");
 * // ➔ string
 * ```
 */
export type LooseLiteral<Literal, BaseType> =
  | Literal
  | (BaseType & AnyStringRecord);
