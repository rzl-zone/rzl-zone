/**
 * --------------------------------------------------
 * * ***Utility: `noop`.***
 * --------------------------------------------------
 * **A no-operation function that performs no action.**
 *
 * @description
 * Commonly used as a **placeholder**, **default callback**, or **stub function**.
 *
 * - **Behavior**:
 *    - Does not return any meaningful value (`void`).
 *    - Safely callable in any context without side effects.
 *
 * @remarks
 * Although this function returns `void`, it implicitly results in `undefined`,
 * but the return value should never be relied upon.
 *
 * @example
 * **1. Basic usage** — does nothing and returns undefined implicitly:
 * ```
 * import { noop } from "@rzl-zone/utils-js/generators";
 *
 * noop(); // ➔ no effect (void)
 * ```
 * @example
 * **2. Using with type-checking helpers:**
 * ```ts
 * import { noop } from "@rzl-zone/utils-js/generators";
 * import { isFunction, isUndefined } from "@rzl-zone/utils-js/predicates";
 *
 * isFunction(noop);    // ➔ true  — `noop` is a function
 * isUndefined(noop()); // ➔ true  — calling `noop()` returns `undefined`
 * isFunction(noop());  // ➔ false — the return value is `undefined`, not a function
 * ```
 * @example
 * **3. As a default callback:**
 * ```ts
 * import { noop } from "@rzl-zone/utils-js/generators";
 *
 * const callback = noop;
 * callback(); // ➔ no effect (void)
 * ```
 */
export const noop = (): void => {};
