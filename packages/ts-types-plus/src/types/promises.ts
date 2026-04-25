/** --------------------------------------------------
 * * ***Utility Type: `Awaitable`.***
 * --------------------------------------------------
 * **Represents a type that can be awaited:**
 *   - Either a plain value `T` or a `PromiseLike<T>`.
 * @template T - The inner value type.
 * @example
 * ```ts
 * async function wrap<T>(v: Awaitable<T>): Promise<T> {
 *   return await v;
 * }
 *
 * const a = wrap(42);           // Promise<number>
 * const b = wrap(Promise.resolve("hi")); // Promise<string>
 * ```
 */
export type Awaitable<T> = T | PromiseLike<T>;

/** --------------------------------------------------
 * * ***Utility Type: `StrictAwaitable`.***
 * --------------------------------------------------
 * **Represents a value that may be synchronous or a
 * native `Promise`.**
 *
 * Unlike {@link Awaitable | `Awaitable`}, this type **does not accept
 * arbitrary thenables (`PromiseLike`)** and only allows
 * real `Promise` instances.
 *
 * This is sometimes preferred for **tooling APIs or
 * controlled async flows** where supporting generic
 * thenables is unnecessary or undesirable.
 *
 * --------------------------------------------------
 * @template T - The inner value type.
 *
 * @example
 * ```ts
 * function maybeAsync<T>(v: StrictAwaitable<T>): Promise<T> {
 *   return Promise.resolve(v);
 * }
 *
 * maybeAsync(123); // Promise<number>
 * maybeAsync(Promise.resolve("ok")); // Promise<string>
 * ```
 */
export type StrictAwaitable<T> = T | Promise<T>;

interface CustomPromiseLike<OnSuccess, OnError> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = OnSuccess, TResult2 = never>(
    onfulfilled?:
      | ((value: OnSuccess) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: OnError) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): CustomPromiseType<TResult1 | TResult2, OnError>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?:
      | ((reason: OnError) => TResult | PromiseLike<TResult>)
      | null
      | undefined
  ): CustomPromiseType<OnSuccess | TResult, OnError>;

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
  finish(
    cb: (value: OnSuccess | undefined, error: OnError | undefined) => void
  ): CustomPromiseType<OnSuccess, OnError>;
}

/** --------------------------------------------------
 * * ***Utility Type: `CustomPromiseType`.***
 * --------------------------------------------------
 * **Extends the native `Promise` type to provide explicit typing
 * for both the resolved (`onSuccess`) and rejected (`onError`) values,
 * plus an optional `finish` hook.**
 * - **Behavior:**
 *      - ✅ **Strongly types** `success`, `error`, and `finish` handlers.
 *      - ⚙️ `finish` runs exactly once after the promise settles (similar to `finish`).
 * @template OnSuccess - The type of the fulfilled value.
 * @template OnError   - The type of the rejection reason, defaults to `unknown`.
 * @example
 * ```ts
 * import type { CustomPromiseType } from "@rzl-zone/ts-types-plus";
 * import { CustomPromise } from "@rzl-zone/utils-js/promises";
 *
 * const fetchUser = (): CustomPromiseType<User, ApiError> =>
 *   CustomsPromise<User, ApiError>((resolve, reject) => {
 *      apiCall().then(resolve).catch(reject);
 *   });
 *
 * fetchUser()
 *   .then(user => console.log(user))
 *   .catch(err => console.error(err))
 *   .finish((result, error) => {
 *      console.log("always runs", { result, error });
 *   });
 * ```
 */
export type CustomPromiseType<OnSuccess, OnError = unknown> = CustomPromiseLike<
  OnSuccess,
  OnError
>;
