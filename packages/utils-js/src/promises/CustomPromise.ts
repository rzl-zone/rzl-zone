import type { CustomPromiseType } from "@rzl-zone/ts-types-plus";

export type { CustomPromiseType };

/** -------------------------------------------------------------
 * * ***Utility Class: `CustomPromise`.***
 * --------------------------------------------------------------
 * **A strongly typed extension of the native {@link Promise | **`Promise`**}.**
 *
 * ---
 *  1. **Behaves exactly like a normal Promise** for `then`/`catch`
 *      and `await` semantics.
 *  2. **Stores the final resolution or rejection internally** so
 *      it can be retrieved by a custom `finish` handler.
 *  3. **Adds a `finish` method** which runs once after settlement
 *      with access to both the fulfilled value *and* the rejection
 *      reason (only one will be defined).
 *
 * ---
 * - **Key Differences from a Native `Promise`:**
 *     - Every call to `then`/`catch` returns **`CustomPromise`**
 *       again, so the `finish` method remains available on the
 *       entire chain.
 *     - `finish` provides a tuple-like callback:
 *        - `val`  ➔ defined when fulfilled.
 *        - `err`  ➔ defined when rejected.
 *
 * ---
 * @template Success  Type of the resolved value.
 * @template Error    Type of the rejection reason (default `unknown`).
 *
 * ---
 * @example
 *  ```ts
 *  import { CustomPromise, type CustomPromiseType } from "@rzl-zone/utils-js/promises";
 *
 *  type User = { id: number; name: string };
 *  type ApiError = { message: string };
 *
 *  function fetchUser(): CustomPromiseType<User, ApiError> {
 *    return new CustomPromise<User, ApiError>((resolve, reject) => {
 *      setTimeout(
 *        () =>
 *          void (Math.random() > 0.5
 *            ? resolve({ id: 1, name: "Alice" })
 *            : reject({ message: "Random failure" })),
 *        500
 *      );
 *    });
 *  }
 *
 *  fetchUser()
 *    .then(user => {
 *       console.log("SUCCESS:", user);
 *       return user;
 *     })
 *    .catch(err => {
 *       console.error("ERROR:", err);
 *       throw err;
 *     })
 *    .finish((val, err) => {
 *      // Runs once after settle, regardless of outcome
 *      console.log("FINISH:", { val, err });
 *    });
 *  ```
 * ---
 * - **Implementation Notes:**
 *     - Uses `Object.setPrototypeOf` to preserve the prototype chain
 *       for environments targeting ES5 or when subclassing Promise.
 *     - Internal settlement state is tracked automatically,
 *       allowing `finish` to access the final result even
 *       when registered after settlement.
 */
export class CustomPromise<Success, Failure = unknown>
  extends Promise<Success>
  implements CustomPromiseType<Success, Failure>
{
  /** ------------------------------------------------------------
   *
   * @internal
   * Stores the resolved value after promise settlement.
   *
   * -------------------------------------------------------------
   */
  private _value?: Success;
  /** ------------------------------------------------------------
   *
   * @internal
   * Stores the rejection reason after promise settlement.
   *
   * -------------------------------------------------------------
   */
  private _error?: Failure;
  /** ------------------------------------------------------------
   *
   * @internal
   * Stores registered `finish` callbacks until the
   * promise settles.
   *
   * -------------------------------------------------------------
   */
  private _finish: Array<(v?: Success, e?: Failure) => void> = [];

  /** ------------------------------------------------------------
   * * ***Constructor: `CustomPromise`.***
   * -------------------------------------------------------------
   * **Creates a new `CustomPromise` instance using a custom executor.**
   *
   * ---
   * - **Behavior:**
   *     - Behaves similarly to the native
   *       ***`Promise`*** constructor.
   *     - Receives custom `resolve` and `reject`
   *       functions through the executor callback.
   *     - Stores the resolved value or rejection reason
   *       internally for use by `finish`.
   *     - Preserves the `CustomPromise` prototype chain
   *       for subclassed promise behavior.
   *     - Ensures chained `then` and `catch`
   *       operations continue returning
   *       ***`CustomPromise`*** instances.
   *
   * ---
   * @param {(resolve, reject) => void} executor
   * ***Executor function responsible for controlling the asynchronous operation lifecycle.***
   *
   * @param {(value: Success) => void} executor.resolve
   * ***Function used to resolve the promise with a value.***
   *
   * @param {(error: Error) => void} executor.reject
   * ***Function used to reject the promise with an error.***
   *
   * ---
   * @throws **{@link Error | `Error`}**
   * Any uncaught exception thrown inside the executor
   * automatically rejects the promise.
   *
   * ---
   * @example
   * ```ts
   * const promise = new CustomPromise<string>(
   *   (resolve) => {
   *     setTimeout(
   *       () => resolve("Done"),
   *       1000
   *     );
   *   }
   * );
   * ```
   * ---
   * @example
   * ```ts
   * const promise = new CustomPromise<
   *   string,
   *   Error
   * >((resolve, reject) => {
   *   Math.random() > 0.5
   *     ? resolve("Success")
   *     : reject(
   *         new Error("Failed")
   *       );
   * });
   * ```
   */
  constructor(
    executor: (
      /**
       * * ***Function used to resolve the promise with a value.***
       */
      resolve: (value: Success) => void,

      /**
       * * ***Function used to reject the promise with an error.***
       */
      reject: (error: Failure) => void
    ) => void
  ) {
    let resolveOuter: (v: Success) => void;
    let rejectOuter: (e: Failure) => void;

    super((resolve, reject) => {
      resolveOuter = resolve;
      rejectOuter = reject;
    });

    executor(
      async (val) => {
        this._value = await val;
        resolveOuter(val);
        this._finish.forEach(async (fn) => fn(await val, undefined));
      },
      async (err) => {
        this._error = await err;
        rejectOuter(err);
        this._finish.forEach(async (fn) => fn(undefined, await err));
      }
    );

    Object.setPrototypeOf(this, new.target.prototype);
  }

  /** ---------------------------------------------------------------
   * * ***Overrides `Promise.then()` while preserving the
   * `CustomPromise` prototype chain.***
   * ----------------------------------------------------------------
   * **Registers callbacks for both fulfillment and rejection.**
   *
   * ---
   * Unlike the native `Promise`, this override ensures the returned
   * value remains a ***`CustomPromise`*** so additional methods
   * such as `finish()` continue to be available throughout the chain.
   *
   * ---
   * @template TResult1
   * ***Result type returned by the fulfillment handler.***
   *
   * @template TResult2
   * ***Result type returned by the rejection handler.***
   *
   * ---
   * @param onfulfilled
   * ***Callback executed when the promise resolves successfully.***
   *
   * @param onfulfilled.value
   * ***Resolved value from the current promise.***
   *
   * @param onrejected
   * ***Callback executed when the promise is rejected.***
   *
   * @param onrejected.reason
   * ***Rejection reason from the current promise.***
   *
   * ---
   * @returns A new ***`CustomPromise`*** containing the transformed result.
   */
  override then<TResult1 = Success, TResult2 = never>(
    onfulfilled?:
      | ((
          /**
           * * ***Resolved value from the current promise.***
           */
          value: Success
        ) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?:
      | ((
          /**
           * * ***Rejection reason from the current promise.***
           */
          reason: Failure
        ) => TResult2 | PromiseLike<TResult2>)
      | null
  ): CustomPromise<TResult1 | TResult2, Failure> {
    return super.then(onfulfilled, onrejected) as unknown as CustomPromise<
      TResult1 | TResult2,
      Failure
    >;
  }

  /** ---------------------------------------------------------------
   * * ***Overrides `Promise.catch()` while preserving the
   * `CustomPromise` prototype chain.***
   * ----------------------------------------------------------------
   * **Registers a callback for promise rejection handling.**
   *
   * ---
   * Unlike the native `Promise`, this override ensures the returned
   * value remains a ***`CustomPromise`*** so additional methods
   * such as `finish()` continue to be available throughout the chain.
   *
   * ---
   * @template TResult
   * ***Result type returned by the rejection handler.***
   *
   * ---
   * @param onrejected
   * ***Callback executed when the promise is rejected.***
   *
   * @param onrejected.reason
   * ***Rejection reason from the current promise.***
   *
   * ---
   * @returns A new ***`CustomPromise`*** containing either the
   * original success value or the transformed rejection result.
   */
  override catch<TResult = never>(
    onrejected?:
      | ((
          /**
           * * ***Rejection reason from the current promise.***
           */
          reason: Failure
        ) => TResult | PromiseLike<TResult>)
      | null
  ): CustomPromise<Success | TResult, Failure> {
    return super.catch(onrejected) as unknown as CustomPromise<
      Success | TResult,
      Failure
    >;
  }

  /** ---------------------------------------------------------------
   * * ***Registers a callback to be invoked exactly once when the
   * promise settles.***
   * ----------------------------------------------------------------
   * *If the promise is already settled when `finish()` is called,
   * the callback executes immediately on the same tick.*
   *
   * ---
   * @param callback
   * ***Callback receiving the final settlement result.***
   *
   * @param callback.value
   * ***Resolved value when the promise is fulfilled.***
   *
   * @param callback.error
   * ***Rejection reason when the promise is rejected.***
   *
   * ---
   * @returns `this` for fluent chaining.
   */
  finish(
    callback: (
      /**
       * * ***Resolved value when the promise is fulfilled.***
       */
      value?: Success,

      /**
       * * ***Rejection reason when the promise is rejected.***
       */
      error?: Failure
    ) => void
  ): this {
    if (this._value !== undefined || this._error !== undefined) {
      callback(this._value, this._error);
    } else {
      this._finish.push(callback);
    }
    return this;
  }
}
