import type { If } from "./if";

/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link FirstCharacter | `FirstCharacter`}.***
 * ---------------------------------------------------------------------------
 * **Configuration options for the {@link FirstCharacter | `FirstCharacter`} type-level utility.**
 */
export type FirstCharacterOptions = {
  /** * ***Whether to include the rest of the string in the result tuple.***
   *
   * - **Behavior:**
   *      - `true` ➔ returns `[first character, rest of string]`.
   *      - `false` ➔ returns only the first character.
   * @default false
   * @example
   * ```ts
   * type Opt = { includeRest: true };
   * type R = FirstCharacter<"abc", Opt>; // ➔ ["a", "bc"]
   * ```
   */
  includeRest: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `FirstCharacter`.***
 * -------------------------------------------------------
 * **Accepts a string literal and returns its first character.**
 * - **Behavior:**
 *      - If `Options["includeRest"]` is `true`, it returns a
 *        tuple: `[first character, rest of string]`.
 *      - Otherwise, it returns only the first character.
 * @template T - The string literal to process.
 * @template Options - Configuration options (default: `{ includeRest: false }`).
 *   - `includeRest: boolean` — Whether to include the rest of the string in a tuple.
 * @example
 * ```ts
 * type A = FirstCharacter<"abc">;
 * // ➔ "a"
 * type B = FirstCharacter<"abc", { includeRest: true }>;
 * // ➔ ["a", "bc"]
 * type C = FirstCharacter<"">;
 * // ➔ never
 * type D = FirstCharacter<string>;
 * // ➔ never
 * ```
 */
export type FirstCharacter<
  T extends string,
  Options extends FirstCharacterOptions = { includeRest: false }
> = T extends `${infer First extends string}${infer Rest extends string}`
  ? If<Options["includeRest"], [First, Rest], First>
  : never;
