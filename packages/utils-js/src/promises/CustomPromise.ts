import type { CustomPromiseType } from "@rzl-zone/ts-types-plus";

export type { CustomPromiseType };

/** -------------------------------------------------------------
 * * ***Utility Class: `CustomPromise`.***
 * -------------------------------------------------------------
 * **A strongly typed extension of the native {@link Promise | **`Promise`**}.**
 *  1. **Behaves exactly like a normal Promise** for `then`/`catch`
 *      and `await` semantics.
 *  2. **Stores the final resolution or rejection internally** so
 *      it can be retrieved by a custom `finish` handler.
 *  3. **Adds a `finish` method** which runs once after settlement
 *      with access to both the fulfilled value *and* the rejection
 *      reason (only one will be defined).
 * - **Key Differences from a Native `Promise`:**
 *    - Every call to `then`/`catch` returns **`CustomPromise`**
 *      again, so the `finish` method remains available on the
 *      entire chain.
 *    - `finish` provides a tuple-like callback:
 *      - `val`  → defined when fulfilled.
 *      - `err`  → defined when rejected.
 * @template Success  Type of the resolved value.
 * @template Error    Type of the rejection reason (default `unknown`).
 * @example
 * ```ts
 * import { CustomPromise, type CustomPromiseType } from "@rzl-zone/utils-js/promises";
 *
 * type User = { id: number; name: string };
 * type ApiError = { message: string };
 *
 * function fetchUser(): CustomPromiseType<User, ApiError> {
 *   return new CustomPromise<User, ApiError>((resolve, reject) => {
 *     setTimeout(
 *       () =>
 *         void (Math.random() > 0.5
 *           ? resolve({ id: 1, name: "Alice" })
 *           : reject({ message: "Random failure" })),
 *       500
 *     );
 *   });
 * }
 *
 * fetchUser()
 *   .then(user => {
 *      console.log("SUCCESS:", user);
 *      return user;
 *    })
 *   .catch(err => {
 *      console.error("ERROR:", err);
 *      throw err;
 *    })
 *   .finish((val, err) => {
 *     // Runs once after settle, regardless of outcome
 *     console.log("FINISH:", { val, err });
 *   });
 * ```
 * ---
 * - **Implementation Notes:**
 *    - Uses `Object.setPrototypeOf` to preserve the prototype chain
 *      for environments targeting ES5 or when subclassing Promise.
 *    - Internal `_value` and `_error` are updated as soon as the
 *      executor resolves or rejects, guaranteeing `finish` receives
 *      the final state even when added after settlement.
 */
export class CustomPromise<Success, Error = unknown>
  extends Promise<Success>
  implements CustomPromiseType<Success, Error>
{
  private _value?: Success;
  private _error?: Error;
  private _finish: Array<(v?: Success, e?: Error) => void> = [];

  constructor(
    executor: (
      resolve: (v: Success) => void,
      reject: (e: Error) => void
    ) => void
  ) {
    let resolveOuter!: (v: Success) => void;
    let rejectOuter!: (e: Error) => void;

    super((resolve, reject) => {
      resolveOuter = resolve;
      rejectOuter = reject;
    });

    executor(
      (v) => {
        this._value = v;
        resolveOuter(v);
        this._finish.forEach((f) => f(v, undefined));
      },
      (e) => {
        this._error = e;
        rejectOuter(e);
        this._finish.forEach((f) => f(undefined, e));
      }
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }

  override then<TResult1 = Success, TResult2 = never>(
    onfulfilled?: ((value: Success) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: Error) => TResult2 | PromiseLike<TResult2>) | null
  ): CustomPromise<TResult1 | TResult2, Error> {
    return super.then(onfulfilled, onrejected) as unknown as CustomPromise<
      TResult1 | TResult2,
      Error
    >;
  }

  override catch<TResult = never>(
    onrejected?: ((reason: Error) => TResult | PromiseLike<TResult>) | null
  ): CustomPromise<Success | TResult, Error> {
    return super.catch(onrejected) as unknown as CustomPromise<
      Success | TResult,
      Error
    >;
  }

  /**
   * Registers a callback to be invoked **exactly once** when the
   * promise settles, with access to both the resolved value and
   * the rejection reason.
   *
   * If the promise is already settled when `finish` is called,
   * the callback executes immediately on the same tick.
   *
   * @param cb Callback receiving the final `(value, error)`.
   * @returns `this` for fluent chaining.
   */
  finish(cb: (val?: Success, err?: Error) => void): this {
    if (this._value !== undefined || this._error !== undefined) {
      cb(this._value, this._error);
    } else {
      this._finish.push(cb);
    }
    return this;
  }
}
