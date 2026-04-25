import type {
  DefaultPrettifyOptions,
  Prettify,
  PrettifyOptions as PrettifyOpts
} from "./prettify";

/** --------------------------------------------------
 * * ***Utility Type: `OmitStrict`.***
 * --------------------------------------------------
 * **Strictly omits keys `K` from type `T`, with optional flattening for readability using `Prettify`.**
 * - **Behavior:**
 *      - ✅ Enhances autocomplete and type inspection clarity in editors.
 *      - ✅ Optionally flattens nested intersections or mapped types into a cleaner shape.
 * @template T - The original object type.
 * @template K - The keys to omit from `T`.
 * @template PrettifyOptions - Options controlling whether the resulting
 * type should be normalized using the `Prettify` helper.
 * @example
 * ```ts
 * type A = { a: number; b: string; c: boolean };
 * type B = OmitStrict<A, 'b'>;
 * // ➔ { a: number; c: boolean }
 *
 * type C = OmitStrict<A, 'b', { skipPrettify: true }>;
 * // ➔ Omit without prettifying, keeps intersection structure
 *
 * type D = OmitStrict<A, 'b', true, { recursive: false }>;
 * // ➔ Prettifies only top level, does not recurse into nested objects
 * ```
 */
export type OmitStrict<
  T,
  K extends keyof T,
  PrettifyOptions extends PrettifyOpts = DefaultPrettifyOptions
> = Prettify<Omit<T, K>, PrettifyOptions>;
