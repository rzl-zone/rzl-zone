import { describe, it, expect } from "vitest";
import { isNull } from "@/predicates/is/isNull";
import { isUndefined } from "@/predicates/is/isUndefined";
import { cleanParsedData } from "@/conversions/json/cleanParsedData";

describe("cleanParsedData", () => {
  it("should remove null values if removeNulls is true", () => {
    expect(
      cleanParsedData({ a: null, b: "test" }, { removeNulls: true })
    ).toEqual({
      b: "test"
    });
  });

  it("should remove undefined values if removeUndefined is true", () => {
    expect(
      cleanParsedData({ a: undefined, b: "test" }, { removeUndefined: true })
    ).toEqual({ b: "test" });
  });

  it("should convert string numbers if convertNumbers is true", () => {
    expect(cleanParsedData({ age: "25" }, { convertNumbers: true })).toEqual({
      age: 25
    });
  });

  it("should convert string booleans if convertBooleans is true", () => {
    expect(
      cleanParsedData(
        { active: "true", disabled: "false" },
        { convertBooleans: true }
      )
    ).toEqual({ active: true, disabled: false });
  });

  it("should convert ISO date strings if convertDates is true", () => {
    const result = cleanParsedData<{ createdAt: unknown }>(
      { createdAt: "2025-01-01T00:00:00.000Z" },
      { convertDates: true }
    );

    if (!isNull(result) && !isUndefined(result)) {
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.createdAt instanceof Date).toBe(true);

      if (result.createdAt instanceof Date) {
        expect(result.createdAt.toISOString()).toBe("2025-01-01T00:00:00.000Z");
      }
    }
  });

  it("should remove empty arrays if removeEmptyArrays is true", () => {
    expect(cleanParsedData({ items: [] }, { removeEmptyArrays: true })).toEqual(
      {}
    );
  });

  it("should remove empty objects if removeEmptyObjects is true", () => {
    expect(cleanParsedData({ info: {} }, { removeEmptyObjects: true })).toEqual(
      undefined
    );
  });

  it("should fully remove if structure ends up empty", () => {
    expect(
      cleanParsedData(
        { a: null, b: undefined, c: [] },
        { removeNulls: true, removeUndefined: true, removeEmptyArrays: true }
      )
    ).toEqual({});
  });

  it("should return undefined if strictMode is true and value is invalid", () => {
    expect(cleanParsedData("  ", { strictMode: true })).toBeUndefined();
    expect(cleanParsedData(123, { strictMode: true })).toBeUndefined();
  });

  it("should deeply clean nested structures", () => {
    const data = {
      user: {
        age: "30",
        isActive: "true",
        meta: { notes: null }
      },
      tags: ["tag1", "2"]
    };
    const result = cleanParsedData(data, {
      convertNumbers: true,
      convertBooleans: true,
      removeNulls: true
    });
    expect(result).toEqual({
      user: { age: 30, isActive: true, meta: {} },
      tags: ["tag1", 2]
    });
  });

  it("should set back to default and not throw if options is not an object", () => {
    // @ts-expect-error intentionally wrong
    expect(() => cleanParsedData({}, "invalid")).not.toThrow();
  });
});
