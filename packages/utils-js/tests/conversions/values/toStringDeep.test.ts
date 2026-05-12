import { describe, it, expect } from "vitest";
import { toStringDeep } from "@/conversions/values/toStringDeep";

describe("toStringDeep - tests", () => {
  it("should return unknown for unknown", () => {
    expect(toStringDeep("")).toBe("");
  });
  it("should return empty-string for empty-string", () => {
    expect(toStringDeep("")).toBe("");
  });
  it("should return undefined for null or undefined", () => {
    expect(toStringDeep(null)).toBeUndefined();
    expect(toStringDeep(undefined)).toBeUndefined();
  });

  it("should convert top-level numbers, boolean and strings to string", () => {
    expect(toStringDeep(123)).toBe("123");
    expect(toStringDeep(true)).toBe("true");
    expect(toStringDeep(false)).toBe("false");
    expect(toStringDeep("hello")).toBe("hello");
  });

  it("should process arrays of numbers and strings to strings", () => {
    expect(toStringDeep([1, "2", 3])).toEqual(["1", "2", "3"]);
  });

  it("should remove undefined values inside array", () => {
    expect(toStringDeep([1, undefined, "2"])).toEqual(["1", "2"]);
  });

  it("should process deeply nested arrays", () => {
    const input = [1, ["2", [3, [null, "4", true, false]]]];
    expect(toStringDeep(input)).toEqual([
      "1",
      ["2", ["3", ["4", "true", "false"]]]
    ]);
  });

  it("should process objects with boolean, number or string values", () => {
    const input = { a: 1, b: "2", c: null, d: undefined, e: false };
    expect(toStringDeep(input)).toEqual({ a: "1", b: "2", e: "false" });
  });

  it("should process deeply nested objects", () => {
    const input = {
      u: new Number(NaN),
      x: 1,
      y: {
        z: [2, { w: 3, t: true }, null]
      }
    };
    expect(toStringDeep(input)).toEqual({
      x: "1",
      y: {
        z: ["2", { w: "3", t: "true" }]
      }
    });
  });

  it("should preserve empty objects and arrays when flags are false", () => {
    const input = { a: {}, b: [] };
    expect(
      toStringDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      })
    ).toEqual({ a: {}, b: [] });
  });

  it("should remove empty arrays but keep empty objects", () => {
    const date = new Date();
    expect(
      toStringDeep(
        {
          inner: {
            a: new RegExp(""),
            b: [Buffer.from(""), 123]
          },
          a: {},
          b: new Set([1]),
          c: new Float32Array(1),
          d: date,
          e: new RegExp("123")
        },
        { removeEmptyObjects: false, removeEmptyArrays: true }
      )
    ).toEqual({
      a: {},
      b: ["1"],
      c: ["0"],
      d: date.toISOString(),
      e: "/123/",
      inner: {
        a: "/(?:)/",
        b: ["123"]
      }
    });
  });

  it("should remove empty objects if removeEmptyObjects=true", () => {
    const input = { a: {}, b: "1" };
    expect(
      toStringDeep(input, {
        removeEmptyObjects: true,
        removeEmptyArrays: false
      })
    ).toEqual({ b: "1" });
  });

  it("should remove empty arrays if removeEmptyArrays=true", () => {
    const input = ["1", [], { a: [] }];
    expect(
      toStringDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: true
      })
    ).toEqual(["1", {}]);
  });

  it("should remove both empty objects and arrays deeply", () => {
    const input = {
      a: {},
      b: [],
      c: [{ d: {}, e: [] }, "1"]
    };
    expect(
      toStringDeep(input, { removeEmptyObjects: true, removeEmptyArrays: true })
    ).toEqual({
      c: ["1"]
    });
  });

  it("should handle mixed nested structure with flags", () => {
    const input = [{ a: {}, b: ["1", [], { c: {} }, true, false] }];
    expect(
      toStringDeep(input, { removeEmptyObjects: true, removeEmptyArrays: true })
    ).toEqual([{ b: ["1", "true", "false"] }]);
  });

  it("should remove array if empty after processing when removeEmptyArrays=true", () => {
    expect(
      toStringDeep([null, undefined, {}], {
        removeEmptyObjects: true,
        removeEmptyArrays: true
      })
    ).toBeUndefined();
  });

  it("should remove object if empty after processing when removeEmptyObjects=true", () => {
    expect(
      toStringDeep(
        { a: null, b: undefined },
        { removeEmptyObjects: true, removeEmptyArrays: true }
      )
    ).toEqual({});
  });

  it("should process special types as removed (function, symbol, bigint)", () => {
    const sym = Symbol("sym");
    const fn = () => {};
    const big = BigInt(10);
    const num = new Set([new Number(NaN)]);
    const input = ["1", sym, fn, big, num];
    expect(toStringDeep(input)).toEqual(["1", []]);
  });

  it("should throw if flags are not boolean", () => {
    // @ts-expect-error intentional wrong type
    expect(() => toStringDeep([1], "true")).toThrow(TypeError);
    // @ts-expect-error intentional wrong type
    expect(() => toStringDeep([1], false, "false")).toThrow(TypeError);
  });

  it("Mixed", () => {
    expect(
      toStringDeep([null, undefined, { nan: NaN }], {
        removeEmptyObjects: true,
        removeEmptyArrays: true
      })
    ).toEqual(undefined);
  });
});

describe("toStringDeep - wrapper objects with options", () => {
  it("should process boxed wrapper numbers and strings to strings", () => {
    expect(toStringDeep(new Number(123))).toEqual("123");
    expect(toStringDeep(new Number("123"))).toEqual("123");
    expect(toStringDeep(new Number(null))).toEqual("0");
    expect(toStringDeep(new Number(undefined))).toBeUndefined();
    expect(toStringDeep(new Number(NaN))).toBeUndefined();
    expect(toStringDeep(new Number(Infinity))).toBeUndefined();
    expect(toStringDeep(new Number(-Infinity))).toBeUndefined();

    expect(toStringDeep(new String(123))).toEqual("123");
    expect(toStringDeep(new String("123"))).toEqual("123");
    expect(toStringDeep(new String(null))).toEqual("null");
    expect(toStringDeep(new String(undefined))).toEqual("undefined");
    expect(toStringDeep(new String(NaN))).toEqual("NaN");
    expect(toStringDeep(new String(Infinity))).toEqual("Infinity");
    expect(toStringDeep(new String(-Infinity))).toEqual("-Infinity");

    expect(toStringDeep(new Boolean(123))).toEqual("true");
    expect(toStringDeep(new Boolean("123"))).toEqual("true");
    expect(toStringDeep(new Boolean(null))).toEqual("false");
    expect(toStringDeep(new Boolean(undefined))).toEqual("false");
    expect(toStringDeep(new Boolean(NaN))).toEqual("false");
    expect(toStringDeep(new Boolean(Infinity))).toEqual("true");
    expect(toStringDeep(new Boolean(-Infinity))).toEqual("true");
  });

  it("should process array include deeply boxed wrapper numbers and strings to strings", () => {
    expect(
      toStringDeep([
        new String(123),
        new String("123"),
        new String(null),
        new String(undefined),
        new String(NaN),
        new String(Infinity),
        new String(-Infinity),
        [
          new String(123),
          new String("123"),
          new String(null),
          new String(undefined),
          new String(NaN),
          new String(Infinity),
          new String(-Infinity)
        ]
      ])
    ).toEqual([
      "123",
      "123",
      "null",
      "undefined",
      "NaN",
      "Infinity",
      "-Infinity",
      ["123", "123", "null", "undefined", "NaN", "Infinity", "-Infinity"]
    ]);

    expect(
      toStringDeep([
        new Number(123),
        new Number("123"),
        new Number(null),
        new Number(undefined),
        new Number(NaN),
        new Number(Infinity),
        new Number(-Infinity),
        [
          new Number(123),
          new Number("123"),
          new Number(null),
          new Number(undefined),
          new Number(NaN),
          new Number(Infinity),
          new Number(-Infinity)
        ]
      ])
    ).toEqual(["123", "123", "0", ["123", "123", "0"]]);

    expect(
      toStringDeep([
        new Boolean(123),
        new Boolean("123"),
        new Boolean(null),
        new Boolean(undefined),
        new Boolean(NaN),
        new Boolean(Infinity),
        new Boolean(-Infinity),
        [
          new Boolean(123),
          new Boolean("123"),
          new Boolean(null),
          new Boolean(undefined),
          new Boolean(NaN),
          new Boolean(Infinity),
          new Boolean(-Infinity)
        ]
      ])
    ).toEqual([
      "true",
      "true",
      "false",
      "false",
      "false",
      "true",
      "true",
      ["true", "true", "false", "false", "false", "true", "true"]
    ]);
  });

  it("test handle undefined array", () => {
    expect(
      toStringDeep([new Number(NaN)]).map((e) => e.toLocaleLowerCase())
    ).toEqual([]);
    expect(
      toStringDeep([new Number(Infinity)]).map((e) => e.toLocaleLowerCase())
    ).toEqual([]);
    expect(
      toStringDeep([new Number(-Infinity)]).map((e) => e.toLocaleLowerCase())
    ).toEqual([]);
  });

  it("should process wrapper values inside object", () => {
    const input = {
      a: new Number(123),
      b: new Number("123"),
      c: new Number(null),
      d: new Number(undefined),
      e: new Number(NaN),
      f: new Number(Infinity),
      g: new Number(-Infinity),
      h: new String("test"),
      i: new Boolean(true),
      j: new Boolean(null)
    };
    expect(toStringDeep(input)).toEqual({
      a: "123",
      b: "123",
      c: "0",
      h: "test",
      i: "true",
      j: "false"
    });
  });

  it("should remove undefined values from wrapper Numbers inside object", () => {
    const input = {
      a: new Number(undefined),
      b: new Number(NaN),
      c: new Number(Infinity),
      d: new Number(-Infinity)
    };
    expect(toStringDeep(input)).toEqual({});
  });

  it("should respect removeEmptyObjects flag when wrappers result in empty object", () => {
    const input = {
      a: {
        inner: {
          xF: () => {},
          xaInner: "xaIn",
          x: new Number(undefined),
          y: 1
        },
        xa: "xa"
      },
      b: {
        x: "s"
      }
    };
    // removeEmptyObjects=false (keep empty)
    expect(
      toStringDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      })
    ).toEqual({
      a: { inner: { xaInner: "xaIn", y: "1" }, xa: "xa" },
      b: { x: "s" }
    });

    // removeEmptyObjects=true (drop empty)
    expect(
      toStringDeep(input, {
        removeEmptyObjects: true,
        removeEmptyArrays: false
      })
    ).toEqual({
      a: { inner: { xaInner: "xaIn", y: "1" }, xa: "xa" },
      b: { x: "s" }
    });
  });

  it("should respect removeEmptyArrays flag when wrappers produce arrays with undefined", () => {
    const input = {
      a: [
        new Number(1),
        new Number(undefined),
        new Number(NaN),
        new Number(Infinity),
        new Number(-Infinity)
      ],
      b: []
    };

    // removeEmptyArrays=false (keep empty arrays)
    expect(
      toStringDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      })
    ).toEqual({ a: ["1"], b: [] });

    // removeEmptyArrays=true (drop empty arrays)
    expect(
      toStringDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: true
      })
    ).toEqual({ a: ["1"] });
  });

  it("should remove deeply nested wrappers if they resolve to empty object", () => {
    const input = {
      nested: {
        arr: [
          {
            deeper: {
              val: new Date(Infinity)
            }
          }
        ]
      }
    };
    expect(
      toStringDeep(input, {
        removeEmptyObjects: true,
        removeEmptyArrays: false
      })
    ).toEqual({
      nested: {
        arr: [
          {
            deeper: {
              val: "Invalid Date"
            }
          }
        ]
      }
    });
  });

  it("should test narrowing only", () => {
    const input = [{ a: { b: new Number("NaN") } }, NaN];
    expect(
      toStringDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      }).map((m) => (typeof m != "string" ? m : m.toLowerCase()))
    ).toEqual([{ a: {} }]);
  });
});
