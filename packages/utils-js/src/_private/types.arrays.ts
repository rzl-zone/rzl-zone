import type { IsNever } from "@rzl-zone/ts-types-plus";

export type ArrayFallback<T> =
  IsNever<Extract<T, unknown[] | readonly unknown[]>> extends true
    ? T & unknown[]
    : Extract<T, unknown[] | readonly unknown[]>;
