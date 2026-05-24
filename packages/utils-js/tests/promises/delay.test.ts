import { delay } from "@/promises/delay";
import { describe, it, expect, vi } from "vitest";

describe("delay", () => {
  it("should resolve after the specified time (fake timers)", async () => {
    vi.useFakeTimers();
    const promise = delay(200);
    vi.advanceTimersByTime(200);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("should default to 1000ms if no parameter is provided", async () => {
    vi.useFakeTimers();
    const promise = delay();
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("should throw if milliSeconds is not a number or invalid", () => {
    expect(() => delay(NaN)).toThrow(
      "First parameter (`milliSeconds`) must be of type `number` and value must be a `non-zero`, `non-NaN`, `non-negative`, and `integer-number`, but received: `NaN`, with value: `null`."
    );
    expect(() => delay(0)).toThrow(
      "First parameter (`milliSeconds`) must be of type `number` and value must be a `non-zero`, `non-NaN`, `non-negative`, and `integer-number`, but received: `number`, with value: `0`."
    );
    expect(() => delay(-1)).toThrow(
      "First parameter (`milliSeconds`) must be of type `number` and value must be a `non-zero`, `non-NaN`, `non-negative`, and `integer-number`, but received: `number`, with value: `-1`."
    );
    expect(() => delay(Number.POSITIVE_INFINITY)).toThrow(
      "First parameter (`milliSeconds`) must be of type `number` and value must be a `non-zero`, `non-NaN`, `non-negative`, and `integer-number`, but received: `Infinity`, with value: `null`."
    );
    // @ts-expect-error invalid type for test only
    expect(() => delay("2000")).toThrow(
      // eslint-disable-next-line quotes
      'First parameter (`milliSeconds`) must be of type `number` and value must be a `non-zero`, `non-NaN`, `non-negative`, and `integer-number`, but received: `string`, with value: `"2000"`.'
    );
    // @ts-expect-error invalid type for test only
    expect(() => delay(null)).toThrow(
      "First parameter (`milliSeconds`) must be of type `number` and value must be a `non-zero`, `non-NaN`, `non-negative`, and `integer-number`, but received: `null`, with value: `null`."
    );
  });

  it("should throw if signal is not an AbortSignal", () => {
    // @ts-expect-error invalid type for test only
    expect(() => delay(100, {})).toThrow(
      "Second parameter (`signal`) must be an `instance of AbortSignal` if provided."
    );
    // @ts-expect-error invalid type for test only
    expect(() => delay(100, null)).toThrow(
      "Second parameter (`signal`) must be an `instance of AbortSignal` if provided."
    );
  });

  it("should reject immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(delay(5000, controller.signal)).rejects.toHaveProperty(
      "name",
      "AbortError:['@rzl-zone/utils-js/promises:delay']"
    );
  });

  it("should reject if signal is aborted before timeout completes", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const promise = delay(5000, controller.signal);

    vi.advanceTimersByTime(1000);
    controller.abort();
    await expect(promise).rejects.toHaveProperty(
      "name",
      "AbortError:['@rzl-zone/utils-js/promises:delay']"
    );
    vi.useRealTimers();
  });

  it("should resolve if signal is not aborted", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const promise = delay(2000, controller.signal);

    vi.advanceTimersByTime(2000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
