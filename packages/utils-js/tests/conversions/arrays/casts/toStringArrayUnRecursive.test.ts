import { describe, it, expect } from "vitest";
import { toStringArrayUnRecursive } from "@/conversions/arrays/casts/toStringArrayUnRecursive";

describe("toStringArrayUnRecursive", () => {
  it("should convert numbers and strings to strings", () => {
    expect(toStringArrayUnRecursive([1, "2", 3])).toEqual(["1", "2", "3"]);
    expect(
      toStringArrayUnRecursive([1, "2", 3], { removeInvalidValue: false })
    ).toEqual(["1", "2", "3"]);
  });

  it("should handle empty array", () => {
    expect(toStringArrayUnRecursive([])).toEqual([]);
    expect(toStringArrayUnRecursive([], { removeInvalidValue: false })).toEqual(
      []
    );
  });

  it("should remove null and undefined by default", () => {
    expect(toStringArrayUnRecursive([1, null, undefined, "abc"])).toEqual([
      "1",
      "abc"
    ]);
    expect(
      toStringArrayUnRecursive([1, null, undefined, "abc"], {
        removeInvalidValue: false
      })
    ).toEqual(["1", null, undefined, "abc"]);
  });

  it("should keep null and undefined if removeInvalidValue is false", () => {
    expect(
      toStringArrayUnRecursive([1, null, "abc"], {
        removeInvalidValue: false
      })
    ).toEqual(["1", null, "abc"]);
    expect(
      toStringArrayUnRecursive([1, undefined, "abc"], {
        removeInvalidValue: false
      })
    ).toEqual(["1", undefined, "abc"]);
    expect(
      toStringArrayUnRecursive([1, null, undefined, "abc"], {
        removeInvalidValue: false
      })
    ).toEqual(["1", null, undefined, "abc"]);
  });

  it("should handle mixed array with only null and undefined", () => {
    expect(toStringArrayUnRecursive([{ anyKey: 123 }, 1, "2"])).toEqual([
      "1",
      "2"
    ]);

    expect(toStringArrayUnRecursive([{ anyKey: 123 }])).toEqual([]);
    expect(toStringArrayUnRecursive([() => {}])).toEqual([]);
    expect(toStringArrayUnRecursive([() => {}, null])).toEqual([]);
    expect(toStringArrayUnRecursive([() => {}, undefined])).toEqual([]);

    expect(
      toStringArrayUnRecursive([{ anyKey: 123 }], { removeInvalidValue: false })
    ).toEqual([undefined]);
    expect(
      toStringArrayUnRecursive([() => {}], { removeInvalidValue: false })
    ).toEqual([undefined]);
    expect(
      toStringArrayUnRecursive([() => {}, null], { removeInvalidValue: false })
    ).toEqual([undefined, null]);
    expect(
      toStringArrayUnRecursive([() => {}, undefined], {
        removeInvalidValue: false
      })
    ).toEqual([undefined, undefined]);

    expect(
      toStringArrayUnRecursive(["1", "2", 3, () => {}, { anyKey: 123 }], {
        removeInvalidValue: false
      })
    ).toEqual(["1", "2", "3", undefined, undefined]);
    expect(
      toStringArrayUnRecursive(["1", "2", 3, () => {}, { anyKey: 123 }, null], {
        removeInvalidValue: false
      })
    ).toEqual(["1", "2", "3", undefined, undefined, null]);
    expect(
      toStringArrayUnRecursive(
        ["1", "2", 3, () => {}, { anyKey: 123 }, undefined],
        {
          removeInvalidValue: false
        }
      )
    ).toEqual(["1", "2", "3", undefined, undefined, undefined]);
    expect(
      toStringArrayUnRecursive(
        ["1", "2", 3, () => {}, { anyKey: 123 }, undefined, null],
        {
          removeInvalidValue: false
        }
      )
    ).toEqual(["1", "2", "3", undefined, undefined, undefined, null]);
  });

  it("should handle array of only null, undefined or not valid", () => {
    expect(toStringArrayUnRecursive([null])).toEqual([]);
    expect(toStringArrayUnRecursive([undefined])).toEqual([]);
    expect(toStringArrayUnRecursive([null, undefined])).toEqual([]);

    expect(
      toStringArrayUnRecursive([null], { removeInvalidValue: false })
    ).toEqual([null]);
    expect(
      toStringArrayUnRecursive([undefined], { removeInvalidValue: false })
    ).toEqual([undefined]);
    expect(
      toStringArrayUnRecursive([null, undefined], { removeInvalidValue: false })
    ).toEqual([null, undefined]);
  });

  it("should handle strings with spaces or empty string", () => {
    expect(toStringArrayUnRecursive([" ", ""])).toEqual([" ", ""]);
  });

  it("should return undefined if input is undefined, null or not an array", () => {
    expect(toStringArrayUnRecursive(1)).toBeUndefined();
    expect(toStringArrayUnRecursive({})).toBeUndefined();
    expect(toStringArrayUnRecursive(null)).toBeUndefined();
    expect(toStringArrayUnRecursive(undefined)).toBeUndefined();
  });

  it("should set back to default and not throw if options is not object or options.removeInvalidValue is not a boolean (except null|undefined)", () => {
    expect(
      // @ts-expect-error Invalid type option for test only
      () => toStringArrayUnRecursive([1, 2], { removeInvalidValue: "false" })
    ).toThrow();
    expect(
      // @ts-expect-error Invalid type option for test only
      () => toStringArrayUnRecursive([1, 2], { removeInvalidValue: null })
    ).not.toThrow();
    // @ts-expect-error Invalid type option for test only
    expect(() => toStringArrayUnRecursive([1, 2], "bad")).not.toThrow();
  });
});

describe("toStringArrayUnRecursive - boolean & bigint", () => {
  it("should convert boolean to string", () => {
    const input = [true, false, null, undefined] as const;
    const input2 = [true, false, null] as const;
    const input3 = [true, false, undefined] as const;

    const result1 = toStringArrayUnRecursive(input, {
      removeInvalidValue: false
    });
    expect(result1).toEqual(["true", "false", null, undefined]);

    const result2 = toStringArrayUnRecursive(input, {
      removeInvalidValue: true
    });
    expect(result2).toEqual(["true", "false"]);

    const result3 = toStringArrayUnRecursive(input2, {
      removeInvalidValue: false
    });
    expect(result3).toEqual(["true", "false", null]);

    const result4 = toStringArrayUnRecursive(input2, {
      removeInvalidValue: true
    });
    expect(result4).toEqual(["true", "false"]);

    const result5 = toStringArrayUnRecursive(input3, {
      removeInvalidValue: false
    });
    expect(result5).toEqual(["true", "false", undefined]);

    const result6 = toStringArrayUnRecursive(input3, {
      removeInvalidValue: true
    });
    expect(result6).toEqual(["true", "false"]);
  });

  it("should convert bigint to string", () => {
    const input = [1n, 0n, null, undefined] as const;
    const input2 = [1n, 0n, null] as const;
    const input3 = [1n, 0n, undefined] as const;

    const result1 = toStringArrayUnRecursive(input, {
      removeInvalidValue: false
    });
    expect(result1).toEqual(["1", "0", null, undefined]);

    const result2 = toStringArrayUnRecursive(input, {
      removeInvalidValue: true
    });
    expect(result2).toEqual(["1", "0"]);

    const result3 = toStringArrayUnRecursive(input2, {
      removeInvalidValue: false
    });
    expect(result3).toEqual(["1", "0", null]);

    const result4 = toStringArrayUnRecursive(input2, {
      removeInvalidValue: true
    });
    expect(result4).toEqual(["1", "0"]);

    const result5 = toStringArrayUnRecursive(input3, {
      removeInvalidValue: false
    });
    expect(result5).toEqual(["1", "0", undefined]);

    const result6 = toStringArrayUnRecursive(input3, {
      removeInvalidValue: true
    });
    expect(result6).toEqual(["1", "0"]);
  });

  it("should convert bigint and boolean to string", () => {
    const input = [1n, 0n, true, false, null, undefined] as const;
    const input2 = [1n, 0n, true, false, null] as const;
    const input3 = [1n, 0n, true, false, undefined] as const;

    const result1 = toStringArrayUnRecursive(input, {
      removeInvalidValue: false
    });
    expect(result1).toEqual(["1", "0", "true", "false", null, undefined]);

    const result2 = toStringArrayUnRecursive(input, {
      removeInvalidValue: true
    });
    expect(result2).toEqual(["1", "0", "true", "false"]);

    const result3 = toStringArrayUnRecursive(input2, {
      removeInvalidValue: false
    });
    expect(result3).toEqual(["1", "0", "true", "false", null]);

    const result4 = toStringArrayUnRecursive(input2, {
      removeInvalidValue: true
    });
    expect(result4).toEqual(["1", "0", "true", "false"]);

    const result5 = toStringArrayUnRecursive(input3, {
      removeInvalidValue: false
    });
    expect(result5).toEqual(["1", "0", "true", "false", undefined]);

    const result6 = toStringArrayUnRecursive(input3, {
      removeInvalidValue: true
    });
    expect(result6).toEqual(["1", "0", "true", "false"]);
  });
});
