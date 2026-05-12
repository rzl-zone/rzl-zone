import { describe, it, expect } from "vitest";
import { toNumberDeep } from "@/conversions/values/toNumberDeep";

describe("toNumberDeep - additional tests", () => {
  it("should handle top-level empty-string, null or undefined", () => {
    expect(toNumberDeep("")).toBeUndefined();
    expect(toNumberDeep("")).toBeUndefined();
    expect(toNumberDeep(null)).toBeUndefined();
    expect(toNumberDeep(undefined)).toBeUndefined();
  });

  it("should handle top-level numbers and numeric strings", () => {
    expect(toNumberDeep("123")).toBe(123);
    expect(toNumberDeep(456)).toBe(456);
    expect(toNumberDeep("12.34")).toBe(12.34);
    expect(toNumberDeep("not number")).toBeUndefined();
  });

  it("should remove NaN and Infinity even at top level array", () => {
    expect(toNumberDeep([NaN, Infinity, -Infinity, 10, [""]])).toEqual([
      10,
      []
    ]);
  });

  it("should preserve empty objects and arrays when flags are false", () => {
    expect(
      toNumberDeep(
        { a: {}, b: [] },
        { removeEmptyObjects: false, removeEmptyArrays: false }
      )
    ).toEqual({
      a: {},
      b: []
    });
    expect(
      toNumberDeep(["1", { a: {} }], { removeEmptyObjects: false })
    ).toEqual([1, { a: {} }]);
    expect(
      toNumberDeep(["1", [], { a: [] }], {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      })
    ).toEqual([1, [], { a: [] }]);
  });

  it("should remove empty objects but keep empty object", () => {
    expect(
      toNumberDeep(["1", { a: {} }], { removeEmptyObjects: true })
    ).toEqual([1]);
  });
  it("should remove empty objects but keep empty arrays", () => {
    expect(
      toNumberDeep(
        { a: {}, b: [] },
        { removeEmptyObjects: true, removeEmptyArrays: false }
      )
    ).toEqual({
      b: []
    });
  });

  it("should remove empty arrays but keep empty objects", () => {
    const date = new Date();
    expect(
      toNumberDeep(
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
      b: [1],
      c: [0],
      d: date.getTime(),
      inner: {
        b: [123]
      }
    });
  });

  it("should fully clean deeply empty structures with both flags", () => {
    expect(
      toNumberDeep(
        { a: {}, b: [null, undefined, {}], c: { d: [] } },
        { removeEmptyObjects: true, removeEmptyArrays: true }
      )
    ).toEqual({});
  });

  it("should process deeply nested object mixed with valid and invalid numbers", () => {
    const input = {
      a: "1",
      b: {
        c: "not num",
        d: ["2", "3.5", null, { e: "4.4", f: "invalid" }],
        e: new Number(NaN)
      },
      g: []
    };
    expect(toNumberDeep(input)).toEqual({
      a: 1,
      b: {
        d: [2, 3.5, { e: 4.4 }]
      },
      g: []
    });
  });

  it("should respect both removeEmptyObjects and removeEmptyArrays deeply", () => {
    const input = {
      x: {},
      y: [],
      z: [{ a: {}, b: [] }]
    };
    expect(
      toNumberDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: true
      })
    ).toEqual({
      x: {},
      z: [{ a: {} }]
    });
  });

  it("should respect removeEmptyObjects true and removeEmptyArrays false deeply", () => {
    const input = {
      x: {},
      y: [],
      z: [{ a: {}, b: [] }]
    };
    expect(
      toNumberDeep(input, {
        removeEmptyObjects: true,
        removeEmptyArrays: false
      })
    ).toEqual({
      y: [],
      z: [{ b: [] }]
    });
  });

  it("should respect both removeEmptyObjects and removeEmptyArrays as true deeply", () => {
    const input = toNumberDeep(
      {
        x: {},
        y: [],
        z: [{ a: {}, b: [], c: "3" }, { d: "4.5" }]
      },
      { removeEmptyObjects: true, removeEmptyArrays: true }
    );
    expect(input).toEqual({ z: [{ c: 3 }, { d: 4.5 }] });
    expect(
      toNumberDeep([[[[[["1"]]], null]], "2", "abc"], {
        removeEmptyObjects: false,
        removeEmptyArrays: true
      })
    ).toEqual([[[[[[1]]]]], 2]);
  });

  it("should handle array with nested empty containers and remove appropriately", () => {
    const input = ["1", {}, [], ["2", {}, []]] as const;
    expect(
      toNumberDeep(input, { removeEmptyObjects: true, removeEmptyArrays: true })
    ).toEqual([1, [2]]);
  });

  it("should process weird types inside array like functions or symbols as removed", () => {
    const sym = Symbol("wow");
    const num = new Set([new Number(NaN)]);
    const arr = ["1", () => {}, sym, "2", num];
    expect(toNumberDeep(arr)).toEqual([1, 2, []]);
  });

  it("should keep nested empty object if parent removal not requested", () => {
    expect(
      toNumberDeep(
        { a: { b: {} } },
        { removeEmptyObjects: false, removeEmptyArrays: true }
      )
    ).toEqual({
      a: { b: {} }
    });
  });

  it("should clean nested object if removeEmptyObjects=true even inside array", () => {
    const input = [
      "1",
      { a: { b: NaN, c: { cInside: Infinity } } },
      undefined,
      ""
    ];
    expect(toNumberDeep(input, { removeEmptyObjects: true })).toEqual([1]);
  });

  it("should still keep empty objects if removeEmptyObjects=false", () => {
    const input = [
      "1",
      { a: { b: NaN, c: { cInside: Infinity } } },
      undefined,
      ""
    ];
    expect(toNumberDeep(input, { removeEmptyObjects: false })).toEqual([
      1,
      { a: { c: {} } }
    ]);
  });

  it("should still keep empty arrays if removeEmptyArrays=false", () => {
    const input = ["1", [], { a: [] }];
    expect(
      toNumberDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      })
    ).toEqual([1, [], { a: [] }]);
  });
});

describe("toNumberDeep - wrapper objects with options", () => {
  it("should process boxed wrapper numbers and strings to number", () => {
    expect(toNumberDeep(new Number(123))).toEqual(123);
    expect(toNumberDeep(new Number("123"))).toEqual(123);
    expect(toNumberDeep(new Number(null))).toEqual(0);
    expect(toNumberDeep(new Number(undefined))).toBeUndefined();
    expect(toNumberDeep(new Number(NaN))).toBeUndefined();
    expect(toNumberDeep(new Number(Infinity))).toBeUndefined();
    expect(toNumberDeep(new Number(-Infinity))).toBeUndefined();

    expect(toNumberDeep(new String(123))).toEqual(123);
    expect(toNumberDeep(new String("123"))).toEqual(123);
    expect(toNumberDeep(new String(null))).toBeUndefined();
    expect(toNumberDeep(new String(undefined))).toBeUndefined();
    expect(toNumberDeep(new String(NaN))).toBeUndefined();
    expect(toNumberDeep(new String(Infinity))).toBeUndefined();
    expect(toNumberDeep(new String(-Infinity))).toBeUndefined();

    expect(toNumberDeep(new Boolean(123))).toEqual(1);
    expect(toNumberDeep(new Boolean("123"))).toEqual(1);
    expect(toNumberDeep(new Boolean(null))).toEqual(0);
    expect(toNumberDeep(new Boolean(undefined))).toEqual(0);
    expect(toNumberDeep(new Boolean(NaN))).toEqual(0);
    expect(toNumberDeep(new Boolean(Infinity))).toEqual(1);
    expect(toNumberDeep(new Boolean(-Infinity))).toEqual(1);
  });

  it("should process array include deeply boxed wrapper numbers and strings to number", () => {
    expect(
      toNumberDeep([
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
    ).toEqual([123, 123, [123, 123]]);

    expect(
      toNumberDeep([
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
    ).toEqual([123, 123, 0, [123, 123, 0]]);

    expect(
      toNumberDeep([
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
    ).toEqual([1, 1, 0, 0, 0, 1, 1, [1, 1, 0, 0, 0, 1, 1]]);
  });

  it("test handle undefined array", () => {
    expect(
      toNumberDeep([new Number(NaN)]).map((e) => e.toExponential())
    ).toEqual([]);
    expect(
      toNumberDeep([new Number(Infinity)]).map((e) => e.toExponential())
    ).toEqual([]);
    expect(
      toNumberDeep([new Number(-Infinity)]).map((e) => e.toExponential())
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
    expect(toNumberDeep(input)).toEqual({
      a: 123,
      b: 123,
      c: 0,
      i: 1,
      j: 0
    });
  });

  it("should remove undefined values from wrapper Numbers inside object", () => {
    const input = {
      a: new Number(undefined),
      b: new Number(NaN),
      c: new Number(Infinity),
      d: new Number(-Infinity)
    };
    expect(toNumberDeep(input)).toEqual({});
  });

  it("should respect removeEmptyObjects flag when wrappers result in empty object", () => {
    const input = {
      a: {
        inner: {
          xF: () => {},
          xaInner: "xaIn",
          x: new Number(undefined),
          y: NaN
        },
        xa: "Null"
      },
      b: {
        valDate: new Date(Infinity),
        nm: 1,
        objNum: new Number(1),
        x: "s"
      }
    };
    // removeEmptyObjects=false (keep empty)
    expect(
      toNumberDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      })
    ).toEqual({
      a: { inner: {} },
      b: {
        valDate: 0,
        nm: 1,
        objNum: 1
      }
    });

    // removeEmptyObjects=true (drop empty)
    expect(
      toNumberDeep(input, {
        removeEmptyObjects: true,
        removeEmptyArrays: false
      })
    ).toEqual({
      b: {
        valDate: 0,
        nm: 1,
        objNum: 1
      }
    });
  });

  it("should remove deeply nested wrappers if they resolve to empty object", () => {
    const input = {
      nested: {
        arr: [
          {
            deeper: {
              // valDate: new Date(),
              // valBool: new Boolean(),
              valNumber: new Number(NaN)
            }
          }
        ]
      }
    };
    expect(
      toNumberDeep(input, {
        removeEmptyObjects: true,
        removeEmptyArrays: false
      })
    ).toEqual({
      nested: {
        arr: []
      }
    });
  });

  it("should test narrowing only", () => {
    const input = [{ a: { b: new Number("NaN") } }, NaN];
    expect(
      toNumberDeep(input, {
        removeEmptyObjects: false,
        removeEmptyArrays: false
      }).map((m) => (typeof m == "number" ? m : m))
    ).toEqual([{ a: {} }]);
  });
});
