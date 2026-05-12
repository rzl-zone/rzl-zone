import { describe, it, expect } from "vitest";
import {
  constructURL,
  type QueryParamPairs
} from "@/urls/builders/constructURL";

describe("constructURL", () => {
  it("should construct a URL with just the base string", () => {
    const result = constructURL("https://example.com");
    expect(result.href).toBe("https://example.com/");
  });

  it("should construct a URL from a URL instance", () => {
    const base = new URL("https://example.com/test");
    const result = constructURL(base);
    expect(result.href).toBe("https://example.com/test");
  });

  it("should append query parameters from iterable", () => {
    const params = new URLSearchParams({ foo: "1", bar: "2" }).entries();
    const result = constructURL("https://example.com", params);
    expect(result.href).toBe("https://example.com/?foo=1&bar=2");
  });

  it("should remove specified query parameters with entries() and arrays key-pairs", () => {
    const params = new URLSearchParams({
      foo: "1",
      bar: "2",
      baz: "3"
    }).entries();

    const params2: QueryParamPairs = [
      ["foo", 1],
      ["bar", 2],
      ["baz", 3]
    ];

    const result = constructURL("https://example.com", params, ["bar"]);
    const result2 = constructURL("https://example.com", params2, ["bar"]);

    expect(result.href).toBe("https://example.com/?foo=1&baz=3");
    expect(result2.href).toBe("https://example.com/?foo=1&baz=3");
  });

  it("should remove existing query parameters in URL even without extra queryParams", () => {
    const base = "https://example.com/path?foo=1&bar=2";
    const result = constructURL(base, undefined, ["bar"]);
    expect(result.href).toBe("https://example.com/path?foo=1");
  });

  it("should append and also remove specified query parameters simultaneously", () => {
    const base = "https://example.com/path?foo=1&bar=2";
    const params = new URLSearchParams({
      qux: "9",
      bar: "should-be-removed"
    }).entries();
    const result = constructURL(base, params, ["bar"]);
    expect(result.href).toBe("https://example.com/path?foo=1&qux=9");
  });

  it("should handle empty queryParams iterable", () => {
    // @ts-expect-error ignore for test only
    const result = constructURL("https://example.com", [].entries());
    expect(result.href).toBe("https://example.com/");
  });

  it("should throw on empty baseUrl string", () => {
    expect(() => constructURL("")).toThrow(
      "First parameter (`baseUrl`) cannot be an empty-string."
    );
  });

  it("should throw on non-string, non-URL baseUrl", () => {
    // @ts-expect-error testing runtime
    expect(() => constructURL(123)).toThrow(
      "First parameter (`baseUrl`) must be of type an URL instance or a `string` and a non empty-string, but received: `number`, with current value: `123`."
    );
  });

  it("should throw on invalid queryParams that is not iterable", () => {
    // @ts-expect-error testing runtime
    expect(() => constructURL("https://example.com", 123)).toThrow(
      "must be iterable"
    );
  });

  it("should throw on invalid removeParams type", () => {
    expect(() =>
      // @ts-expect-error testing runtime
      constructURL("https://example.com", undefined, "not-array")
    ).toThrow(
      "Third parameter (`removeParams`) must be of type `array of strings`, but received: `string`."
    );
  });

  it("should throw on invalid removeParams content", () => {
    expect(() =>
      // @ts-expect-error testing runtime
      constructURL("https://example.com", undefined, [123])
    ).toThrow(
      "Third parameter (`removeParams`) must be of type `array` and contains `string` only and non empty-string."
    );
  });
});
