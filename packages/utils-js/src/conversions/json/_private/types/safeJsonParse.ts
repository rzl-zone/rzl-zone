import type { IfExtends, IfNotExtends, IsAny } from "@rzl-zone/ts-types-plus";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { safeJsonParse } from "../../safeJsonParse";

type NonJsonParsableType = Omit<
  Exclude<unknown, string | null | undefined>,
  string
>;

type Contains<T, U> = [Extract<T, U>] extends [never] ? false : true;

/**
 * * ***The value type for the overload function {@link safeJsonParse | `safeJsonParse`}.***
 */
export type UnknownValue = { undefined: true };

/**
 * * ***The narrows type result for {@link safeJsonParse | `safeJsonParse`}.***
 */
export type SafeJsonParseResult<TData, T> =
  IfNotExtends<T, NonJsonParsableType> extends true
    ? T extends never
      ? undefined
      : T extends void
        ? undefined
        : T extends number
          ? undefined
          : Contains<T, string> extends true
            ? Contains<T, null & string> extends true
              ? TData | null | undefined
              : TData | undefined
            : IfExtends<T, null> extends true
              ? null
              : IfNotExtends<T, NonJsonParsableType> extends true
                ? TData | null | undefined
                : undefined
    : Contains<T, string> extends true
      ? IsAny<T> extends true
        ? TData | undefined | null
        : TData | undefined
      : undefined;
