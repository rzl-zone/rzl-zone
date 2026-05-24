/* eslint-disable @typescript-eslint/no-unused-vars */
import type { isNaN as rzlIsNaN } from "../src/predicates/is/isNaN.ts";
import type { isFinite as rzlIsFinite } from "../src/predicates/is/isFinite.ts";

// We used this for safe internally environment only (not export at build mean is no public).
declare global {
  /**
   * @deprecated ***Use {@link rzlIsFinite | `rzlIsFinite`} instead.***
   * @param value The number to check.
   * @returns true if the value is a finite number.
   */
  function isFinite(value: unknown): boolean;

  /**
   * @deprecated ***Use {@link rzlIsNaN | `rzlIsNaN`} instead.***
   * @param value The value to check.
   * @returns true if the value is NaN.
   */
  function isNaN(value: unknown): boolean;
}
