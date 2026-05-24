import type {
  FixNeverArrayRecursive,
  NormalizeEmptyArraysRecursive,
  RemoveEmptyArrayElements
} from "@rzl-zone/ts-types-plus";

type ExcludeNil<T> = Exclude<T, null | undefined>;

/** -------------------------------------------------------------------------------
 *  * ***Element extractor***
 * --------------------------------------------------------------------------------
 */
type ElementOf<A extends readonly unknown[]> = A extends readonly (infer U)[]
  ? U
  : never;

/** -------------------------------------------------------------------------------
 * * ***Compute `FilterNilArray`***
 * --------------------------------------------------------------------------------
 *
 * *For a tuple/array A by using the element type (without null|undefined).*
 */
export type FilterNilArrayFromTuple<A extends readonly unknown[]> =
  FilterNilArray<ExcludeNil<ElementOf<A>>>;

/** -------------------------------------------------------------------------------
 * * ***Preserve `mutability`: if A is mutable (extends unknown[]), keep B;
 * otherwise make B readonly***.
 * --------------------------------------------------------------------------------
 */
export type PreserveMutability<
  A extends readonly unknown[],
  B
> = A extends unknown[] ? B : Readonly<B>;

type IsDeepEmptyArray<T> = T extends readonly []
  ? true
  : T extends readonly (infer U)[]
    ? IsDeepEmptyArray<U>
    : false;

type FilterNilRecursive<T> = T extends readonly (infer U)[]
  ? T extends (infer U)[]
    ? FilterNilRecursive<ExcludeEmptyArray<U>>[]
    : readonly FilterNilRecursive<ExcludeEmptyArray<U>>[]
  : Exclude<T, null | undefined>;
type ExcludeEmptyArray<T> = T extends [] ? never : T;

type NormalizerArrays<T> = NormalizeEmptyArraysRecursive<
  RemoveEmptyArrayElements<FilterNilRecursive<T[]>>
>;
export type FilterNilArray<T> =
  IsDeepEmptyArray<NormalizerArrays<T>> extends true
    ? []
    : FixNeverArrayRecursive<NormalizerArrays<T>>;
