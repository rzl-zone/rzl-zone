import { describe, expect, it } from "vitest";
import { isArguments } from "@/predicates/is/isArgument";

describe("isArguments", () => {
  it("should return true for the arguments object", () => {
    const result = (function () {
      // eslint-disable-next-line prefer-rest-params
      return isArguments(arguments);
    })();
    expect(result).toBe(true);
  });

  it("should return false for arrays", () => {
    expect(isArguments([1, 2, 3])).toBe(false);
  });

  it("should return false for plain objects", () => {
    expect(isArguments({ 0: "a", length: 1 })).toBe(false);
  });

  it("should return false for null and undefined", () => {
    expect(isArguments(null)).toBe(false);
    expect(isArguments(undefined)).toBe(false);
  });

  it("should return false for strings", () => {
    expect(isArguments("arguments")).toBe(false);
  });

  it("should return false for functions", () => {
    expect(
      isArguments(function () {
        return "not arguments";
      })
    ).toBe(false);
  });

  it("should return false for object mimicking arguments", () => {
    const fakeArguments = {
      length: 2,
      callee: function () {},
      0: "a",
      1: "b"
    };
    expect(isArguments(fakeArguments)).toBe(false);
  });
});
