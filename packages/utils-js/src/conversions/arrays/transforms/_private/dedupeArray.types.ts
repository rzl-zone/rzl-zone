import type { AnyFunction } from "@rzl-zone/ts-types-plus";

type ResUnFTN<
  Force extends false | "stringOrNumber" | "primitives" | "all" = false
> = Force extends "all"
  ? Array<unknown[] | Record<string, unknown> | string>
  : Force extends "stringOrNumber"
    ? Array<
        | string
        | boolean
        | bigint
        | symbol
        | null
        | undefined
        | Record<string, unknown>
        | AnyFunction
        | unknown[]
        | Date
        | RegExp
        | Map<unknown, unknown>
        | Set<unknown>
        | Promise<unknown>
      >
    : Force extends "primitives"
      ? Array<
          | string
          | symbol
          | Record<string, unknown>
          | AnyFunction
          | unknown[]
          | Date
          | RegExp
          | Map<unknown, unknown>
          | Set<unknown>
          | Promise<unknown>
        >
      : Force extends false
        ? Array<
            | string
            | number
            | bigint
            | boolean
            | symbol
            | RegExp
            | Record<string, unknown>
            | AnyFunction
            | Date
            | Map<unknown, unknown>
            | Set<unknown>
            | Promise<unknown>
            | unknown[]
            | null
            | undefined
          >
        : unknown[];

type ResFTN<
  Force extends false | "stringOrNumber" | "primitives" | "all" = false
> = Force extends "all"
  ? Array<string | Record<string, unknown>>
  : Force extends "stringOrNumber"
    ? Array<
        | string
        | boolean
        | bigint
        | symbol
        | null
        | undefined
        | Record<string, unknown>
        | AnyFunction
        | Date
        | RegExp
        | Promise<unknown>
      >
    : Force extends "primitives"
      ? Array<
          | string
          | symbol
          | RegExp
          | Record<string, unknown>
          | AnyFunction
          | Date
          | Promise<unknown>
        >
      : Force extends false
        ? Array<
            | string
            | number
            | bigint
            | boolean
            | symbol
            | RegExp
            | Record<string, unknown>
            | AnyFunction
            | Date
            | Promise<unknown>
            | null
            | undefined
          >
        : unknown[];

export type DedupeResult<
  Force extends ForceToStringOptions = false,
  FTN extends boolean = false
> = FTN extends false ? ResUnFTN<Force> : ResFTN<Force>;
export type ForceToStringOptions =
  | false
  | "stringOrNumber"
  | "primitives"
  | "all";
export type DedupeArrayOptions<
  F extends ForceToStringOptions,
  Fl extends boolean
> = {
  /** ---------------------------------------------------------
   * * ***Enables string conversion for comparison, default is `false`.***
   * ----------------------------------------------------------
   *
   * @default false
   */
  forceToString?: F;
  /** ---------------------------------------------------------
   * * ***If true, deeply flattens `Arrays`, `Maps`, and `Sets` before deduplication, default is `false`.***
   * ----------------------------------------------------------
   *
   * @default false
   */
  flatten?: Fl;
};
