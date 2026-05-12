import { describe, it, expect } from "vitest";
import { toNumberArrayUnRecursive } from "@/conversions/arrays/casts/toNumberArrayUnRecursive";

describe("toNumberArrayUnRecursive", () => {
  it("should convert string numbers to numbers", () => {
    expect(toNumberArrayUnRecursive(["1", "2", "3"])).toEqual([1, 2, 3]);
    expect(
      toNumberArrayUnRecursive(["1", "2", "3"], {
        removeInvalidValueNumber: false
      })
    ).toEqual([1, 2, 3]);
  });

  it("should convert mix string and numbers", () => {
    expect(toNumberArrayUnRecursive(["4", 5, "6"])).toEqual([4, 5, 6]);
    expect(
      toNumberArrayUnRecursive(["4", 5, "6"], {
        removeInvalidValueNumber: false
      })
    ).toEqual([4, 5, 6]);
  });

  it("should handle empty array", () => {
    expect(toNumberArrayUnRecursive([])).toEqual([]);
    expect(
      toNumberArrayUnRecursive([], { removeInvalidValueNumber: false })
    ).toEqual([]);
  });

  it("should remove invalid by default", () => {
    expect(
      toNumberArrayUnRecursive(["1", "abc", null, undefined, "7"])
    ).toEqual([1, 7]);
  });

  it("should keep invalid (undefined) if removeInvalidValueNumber is false", () => {
    expect(
      toNumberArrayUnRecursive(["1", "abc", null, undefined, "8"], {
        removeInvalidValueNumber: false
      })
    ).toEqual([1, undefined, null, undefined, 8]);
  });

  it("should parse partial strings as per parseInt", () => {
    expect(toNumberArrayUnRecursive(["12abc", "34def"])).toEqual([12, 34]);
    expect(toNumberArrayUnRecursive(["te1818st", "test1888"])).toEqual([
      1818, 1888
    ]);
    expect(
      toNumberArrayUnRecursive(["12abc", "34def"], {
        removeInvalidValueNumber: false
      })
    ).toEqual([12, 34]);
    expect(
      toNumberArrayUnRecursive(["te1818st", "test1888"], {
        removeInvalidValueNumber: false
      })
    ).toEqual([1818, 1888]);
  });

  it("should fail on fully invalid strings", () => {
    expect(toNumberArrayUnRecursive(["abc", ""])).toEqual([]);
  });

  it("should keep undefined for fully invalid if flag is false", () => {
    expect(
      toNumberArrayUnRecursive(["abc", ""], { removeInvalidValueNumber: false })
    ).toEqual([undefined, undefined]);
  });

  it("should handle mixed array with only null and undefined", () => {
    expect(toNumberArrayUnRecursive([{ anyKey: 123 }, 1, "2"])).toEqual([1, 2]);

    expect(toNumberArrayUnRecursive([{ anyKey: 123 }])).toEqual([]);
    expect(toNumberArrayUnRecursive([() => {}])).toEqual([]);
    expect(toNumberArrayUnRecursive([() => {}, null])).toEqual([]);
    expect(toNumberArrayUnRecursive([() => {}, undefined])).toEqual([]);

    expect(
      toNumberArrayUnRecursive([{ anyKey: 123 }], {
        removeInvalidValueNumber: false
      })
    ).toEqual([undefined]);
    expect(
      toNumberArrayUnRecursive([() => {}], { removeInvalidValueNumber: false })
    ).toEqual([undefined]);
    expect(
      toNumberArrayUnRecursive([() => {}, null], {
        removeInvalidValueNumber: false
      })
    ).toEqual([undefined, null]);
    expect(
      toNumberArrayUnRecursive([() => {}, undefined], {
        removeInvalidValueNumber: false
      })
    ).toEqual([undefined, undefined]);

    expect(
      toNumberArrayUnRecursive(["1", "2", 3, () => {}, { anyKey: 123 }], {
        removeInvalidValueNumber: false
      })
    ).toEqual([1, 2, 3, undefined, undefined]);
    expect(
      toNumberArrayUnRecursive(["1", "2", 3, () => {}, { anyKey: 123 }, null], {
        removeInvalidValueNumber: false
      })
    ).toEqual([1, 2, 3, undefined, undefined, null]);
    expect(
      toNumberArrayUnRecursive(
        ["1", "2", 3, () => {}, { anyKey: 123 }, undefined],
        {
          removeInvalidValueNumber: false
        }
      )
    ).toEqual([1, 2, 3, undefined, undefined, undefined]);
    expect(
      toNumberArrayUnRecursive(
        ["1", "2", 3, () => {}, { anyKey: 123 }, undefined, null],
        {
          removeInvalidValueNumber: false
        }
      )
    ).toEqual([1, 2, 3, undefined, undefined, undefined, null]);
  });

  it("should handle array of only null and undefined", () => {
    expect(toNumberArrayUnRecursive([null])).toEqual([]);
    expect(toNumberArrayUnRecursive([null])).toEqual([]);
    expect(toNumberArrayUnRecursive([undefined])).toEqual([]);
    expect(toNumberArrayUnRecursive([null, undefined])).toEqual([]);

    expect(
      toNumberArrayUnRecursive([null], {
        removeInvalidValueNumber: false
      })
    ).toEqual([null]);
    expect(
      toNumberArrayUnRecursive([undefined], {
        removeInvalidValueNumber: false
      })
    ).toEqual([undefined]);
    expect(
      toNumberArrayUnRecursive([null, undefined], {
        removeInvalidValueNumber: false
      })
    ).toEqual([null, undefined]);
  });

  it("should return undefined if input is undefined, null or not an array", () => {
    expect(toNumberArrayUnRecursive(1)).toBeUndefined();
    expect(toNumberArrayUnRecursive({})).toBeUndefined();
    expect(toNumberArrayUnRecursive(null)).toBeUndefined();
    expect(toNumberArrayUnRecursive(undefined)).toBeUndefined();
  });

  it("should throw if options is not object or options.removeInvalidValueNumber is not a boolean", () => {
    expect(() =>
      // @ts-expect-error Invalid type prop for test only
      toNumberArrayUnRecursive([1, 2], { removeInvalidValueNumber: "false" })
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error Invalid type prop for test only
      toNumberArrayUnRecursive([1, 2], { removeInvalidValueNumber: null })
    ).toThrow(TypeError);
    // @ts-expect-error Invalid type prop for test only
    expect(() => toNumberArrayUnRecursive(["1", "2"], "bad")).toThrow(
      TypeError
    );
  });
});

describe("toNumberArrayUnRecursive - boolean & bigint", () => {
  it("should convert boolean to undefined", () => {
    const input = [true, false, null, undefined] as const;
    const input2 = [true, false, null] as const;
    const input3 = [true, false, undefined] as const;

    const result1 = toNumberArrayUnRecursive(input, {
      removeInvalidValueNumber: false
    });
    expect(result1).toEqual([undefined, undefined, null, undefined]);

    const result2 = toNumberArrayUnRecursive(input, {
      removeInvalidValueNumber: true
    });
    expect(result2).toEqual([]);

    const result3 = toNumberArrayUnRecursive(input2, {
      removeInvalidValueNumber: false
    });
    expect(result3).toEqual([undefined, undefined, null]);

    const result4 = toNumberArrayUnRecursive(input2, {
      removeInvalidValueNumber: true
    });
    expect(result4).toEqual([]);

    const result5 = toNumberArrayUnRecursive(input3, {
      removeInvalidValueNumber: false
    });
    expect(result5).toEqual([undefined, undefined, undefined]);

    const result6 = toNumberArrayUnRecursive(input3, {
      removeInvalidValueNumber: true
    });
    expect(result6).toEqual([]);
  });

  it("should convert bigint to number", () => {
    const input = [1n, 0n, null, undefined] as const;
    const input2 = [1n, 0n, null] as const;
    const input3 = [1n, 0n, undefined] as const;

    const result1 = toNumberArrayUnRecursive(input, {
      removeInvalidValueNumber: false
    });
    expect(result1).toEqual([1, 0, null, undefined]);

    const result2 = toNumberArrayUnRecursive(input, {
      removeInvalidValueNumber: true
    });
    expect(result2).toEqual([1, 0]);

    const result3 = toNumberArrayUnRecursive(input2, {
      removeInvalidValueNumber: false
    });
    expect(result3).toEqual([1, 0, null]);

    const result4 = toNumberArrayUnRecursive(input2, {
      removeInvalidValueNumber: true
    });
    expect(result4).toEqual([1, 0]);

    const result5 = toNumberArrayUnRecursive(input3, {
      removeInvalidValueNumber: false
    });
    expect(result5).toEqual([1, 0, undefined]);

    const result6 = toNumberArrayUnRecursive(input3, {
      removeInvalidValueNumber: true
    });
    expect(result6).toEqual([1, 0]);
  });

  it("should convert bigint and boolean to number", () => {
    const input = [1n, 0n, true, false, null, undefined] as const;
    const input2 = [1n, 0n, true, false, null] as const;
    const input3 = [1n, 0n, true, false, undefined] as const;

    const result1 = toNumberArrayUnRecursive(input, {
      removeInvalidValueNumber: false
    });
    expect(result1).toEqual([1, 0, undefined, undefined, null, undefined]);

    const result2 = toNumberArrayUnRecursive(input, {
      removeInvalidValueNumber: true
    });
    expect(result2).toEqual([1, 0]);

    const result3 = toNumberArrayUnRecursive(input2, {
      removeInvalidValueNumber: false
    });
    expect(result3).toEqual([1, 0, undefined, undefined, null]);

    const result4 = toNumberArrayUnRecursive(input2, {
      removeInvalidValueNumber: true
    });
    expect(result4).toEqual([1, 0]);

    const result5 = toNumberArrayUnRecursive(input3, {
      removeInvalidValueNumber: false
    });
    expect(result5).toEqual([1, 0, undefined, undefined, undefined]);

    const result6 = toNumberArrayUnRecursive(input3, {
      removeInvalidValueNumber: true
    });
    expect(result6).toEqual([1, 0]);
  });
});
