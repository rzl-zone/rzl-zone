/** ----------------------------------------------------------
 * * ***Converts a union type into an intersection type.***
 * ----------------------------------------------------------
 * @template U - The union type to be converted.
 */
export type UnionToIntersectionStrict<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

/** ----------------------------------------------------------
 * * ***Converts a union type into a tuple type.***
 * ----------------------------------------------------------
 * @template T - The union type to be converted.
 */
export type UnionToTupleStrict<T> =
  UnionToIntersectionStrict<T extends never ? never : (t: T) => T> extends (
    _: never
  ) => infer W
    ? [...UnionToTupleStrict<Exclude<T, W>>, W]
    : [];
