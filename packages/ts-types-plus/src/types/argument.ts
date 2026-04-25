import type { AnyFunction } from "./functions";

/** --------------------------------------------------
 * * ***Utility Type: `ArgumentTypes`.***
 * --------------------------------------------------
 * **Extracts the **argument types** of a given function type `F`.**
 * - ✅ Useful when you need to infer or reuse the parameter types
 *    from an existing function signature.
 * @template F - A function type from which to extract argument types.
 * @example
 * ```ts
 * type Args = ArgumentTypes<(a: number, b: string) => void>;
 * // ➔ [number, string]
 * ```
 */
export type ArgumentTypes<F extends AnyFunction> = F extends (
  ...args: infer A
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any
  ? A
  : never;
