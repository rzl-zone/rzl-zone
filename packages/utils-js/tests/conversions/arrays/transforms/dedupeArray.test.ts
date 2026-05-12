/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { dedupeArray } from "@/conversions/arrays/transforms/dedupeArray";

describe("dedupeArray with options object", () => {
  it("should dedupe globally without forceToString", () => {
    const input = [1, 1, 2, 2, 3, 3];
    const result = dedupeArray(input);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should dedupe string/number globally with forceToString", () => {
    const input = [1, "1", 2, "2", 3, "3"];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual(["1", "2", "3"]);
  });

  it("should keep non-string/number values intact when using forceToString 'stringOrNumber'", () => {
    const obj = { test: true };
    const fn = () => 123;
    const input = ["100", 100, obj, fn, "200", 200, [obj, fn, "100", 100]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual([
      "100",
      { test: true },
      fn,
      "200",
      [{ test: true }, fn, "100"]
    ]);
  });

  it("should convert booleans, bigint, undefined etc. when using forceToString 'primitives'", () => {
    const input = [true, "true", false, undefined, "undefined"];
    const result = dedupeArray(input, { forceToString: "primitives" });
    expect(result).toEqual(["true", "false", "undefined"]);
  });

  it("should convert null booleans, bigint, undefined etc. when using forceToString 'primitives'", () => {
    const input = [true, "true", false, undefined, null, "undefined"];
    const result = dedupeArray(input, { forceToString: "all" });
    expect(result).toEqual(["true", "false", "undefined", "null"]);
  });

  it("should dedupe separately inside each nested array", () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const input = [1, "1", [2, "2", obj1, obj2, [3, "3", obj1, obj2]]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual([
      "1",
      ["2", { a: "1" }, { b: "2" }, ["3", { a: "1" }, { b: "2" }]]
    ]);
  });

  it("should handle deeply mixed structures with 'all'", () => {
    const obj = { a: 1 };
    const fn = () => 1;
    const input = [1, "1", obj, fn, [2, "2", obj, fn, [3, "3", obj, fn]]];
    const result = dedupeArray(input, { forceToString: "all" });
    expect(result).toEqual([
      "1",
      { a: "1" },
      "() => 1",
      ["2", { a: "1" }, "() => 1", ["3", { a: "1" }, "() => 1"]]
    ]);
  });

  describe("should handle deeply mixed structures with forceToString: 'all' and flatten: true", () => {
    it("test 1", () => {
      const obj = { a: 1 };
      const fn = () => 1;
      const input = [
        1,
        "1",
        fn,
        [2, "2", fn, [3, "3", fn]],
        [
          true,
          false,
          [
            null,
            [
              new Date("2025-07-29T08:15:44.908Z"),
              obj,
              Symbol("x"),
              new Set([Symbol("x"), new Map([Symbol("x")].entries())])
            ]
          ],
          undefined
        ]
      ];
      const result = dedupeArray(input, {
        forceToString: "all",
        flatten: true
      });
      expect(result).toEqual([
        "1",
        "() => 1",
        "2",
        "3",
        "true",
        "false",
        "null",
        "2025-07-29T08:15:44.908Z",
        { a: "1" },
        "Symbol(x)",
        "undefined"
      ]);
    });

    it("test 2", () => {
      const obj = { a: 1 };
      const fn = () => 1;
      const symbolX = Symbol("x");
      const symbolB = Symbol("b");
      const symbolC = Symbol("c");
      const map = new Map([[symbolX, [undefined, symbolC]]]);
      const set = new Set([symbolX, symbolB, map]);
      const date = new Date("2025-07-29T08:15:44.908Z");
      const regex = new RegExp(/test/g);
      const asyncFunc = async () => {};

      const input = [
        [
          true,
          false,
          [
            null,
            date,
            [NaN, regex, set, obj, set, regex, [asyncFunc], asyncFunc]
          ],
          undefined
        ],
        1,
        "1",
        fn,
        [2, "2", fn, [3, "3", fn]]
      ];

      const result = dedupeArray(input, {
        forceToString: "all",
        flatten: true
      });

      expect(result).toEqual([
        "true",
        "false",
        "null",
        "2025-07-29T08:15:44.908Z",
        "NaN",
        regex.toString(),
        symbolX.toString(),
        symbolB.toString(),
        "undefined",
        symbolC.toString(),
        { a: "1" },
        asyncFunc.toString(),
        "1",
        fn.toString(),
        "2",
        "3"
      ]);
    });
  });

  it("should handle deeply mixed structures with forceToString: 'stringOrNumber' and flatten: true", () => {
    const obj = { a: 1 };
    const fn = () => 1;
    const symbolX = Symbol("x");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const map = new Map([[symbolX, [undefined, symbolC]]]);
    const set = new Set([symbolX, symbolB, map]);
    const date = new Date("2025-07-29T08:15:44.908Z");
    const regex = new RegExp(/test/g);
    const asyncFunc = async () => {};

    const input = [
      [
        true,
        false,
        [
          null,
          date,
          [NaN, regex, set, obj, set, regex, [asyncFunc], asyncFunc]
        ],
        undefined
      ],
      [true, false, [null, date, [set, obj, [regex, [asyncFunc]]]], undefined],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ];

    const result = dedupeArray(input, {
      forceToString: "stringOrNumber",
      flatten: true
    });

    expect(result).toEqual([
      true,
      false,
      null,
      date,
      NaN,
      regex,
      symbolX,
      symbolB,
      undefined,
      symbolC,
      { a: "1" },
      asyncFunc,
      "1",
      fn,
      "2",
      "3"
    ]);
  });

  it("should handle deeply mixed structures with forceToString: 'primitives' and flatten: true", () => {
    const obj = { a: 1 };
    const fn = () => 1;
    const symbolX = Symbol("x");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const map = new Map([[symbolX, [undefined, symbolC, undefined]]]);
    const set = new Set([symbolX, symbolB, map]);
    const date = new Date("2025-07-29T08:15:44.908Z");
    const regex = new RegExp(/test/g);
    const asyncFunc = async () => {};

    const input = [
      [
        true,
        false,
        [null, date, [NaN, regex, set, set, obj, [asyncFunc]]],
        undefined
      ],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ];

    const result = dedupeArray(input, {
      forceToString: "primitives",
      flatten: true
    });

    expect(result).toEqual([
      "true",
      "false",
      "null",
      date,
      "NaN",
      regex,
      symbolX,
      symbolB,
      "undefined",
      symbolC,
      { a: "1" },
      asyncFunc,
      "1",
      fn,
      "2",
      "3"
    ]);
  });

  it("should handle deeply mixed structures with forceToString: false and flatten: true", () => {
    const obj = { a: 1 };
    const fn = () => 1;
    const symbolX = Symbol("x");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const map = new Map([[symbolX, [undefined, symbolC, undefined]]]);
    const set = new Set([symbolX, symbolB, map]);
    const date = new Date("2025-07-29T08:15:44.908Z");
    const regex = new RegExp(/test/g);
    const asyncFunc = async () => {};

    const input = [
      [
        true,
        false,
        [null, date, [NaN, regex, set, set, obj, [asyncFunc]]],
        undefined
      ],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ];

    const result = dedupeArray(input, {
      forceToString: false,
      flatten: true
    });

    expect(result).toEqual([
      true,
      false,
      null,
      date,
      NaN,
      regex,
      symbolX,
      symbolB,
      undefined,
      symbolC,
      { a: 1 },
      asyncFunc,
      1,
      "1",
      fn,
      2,
      "2",
      3,
      "3"
    ]);
  });

  it("should handle deeply mixed structures with forceToString: 'all' and flatten: false", () => {
    const obj = { a: 1 };
    const objString = { a: "1" };
    const fn = () => 1;
    const symbolX = Symbol("x");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const symbolStringX = Symbol("x").toString();
    const symbolStringB = Symbol("b").toString();
    const symbolStringC = Symbol("c").toString();
    const map = new Map([[symbolX, [undefined, symbolC]]]);
    const set = new Set([symbolX, symbolB, map]);
    const mapString = [[symbolStringX, ["undefined", symbolStringC]]];
    const setString = [symbolStringX, symbolStringB, mapString];
    const date = new Date("2025-07-29T08:15:44.908Z");
    const regex = new RegExp(/test/g);
    const regexString = new RegExp(/test/g).toString();
    const asyncFunc = async () => {};

    const input = [
      [
        true,
        false,
        [null, date, [NaN, regex, set, obj, set, [asyncFunc, asyncFunc]]],
        undefined
      ],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ];

    const result = dedupeArray(input, {
      forceToString: "all"
    });

    expect(result).toEqual([
      [
        "true",
        "false",
        [
          "null",
          "2025-07-29T08:15:44.908Z",
          ["NaN", regexString, setString, objString, [asyncFunc.toString()]]
        ],
        "undefined"
      ],
      "1",
      fn.toString(),
      ["2", fn.toString(), ["3", fn.toString()]]
    ]);
  });

  it("should handle deeply mixed structures with forceToString: 'stringOrNumber' and flatten: false", () => {
    const obj = { a: 1 };
    const objString = { a: "1" };
    const fn = () => 1;
    const symbolX = Symbol("x");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const map = new Map([[symbolX, [undefined, symbolC]]]);
    const set = new Set([symbolX, symbolB, map]);
    const date = new Date("2025-07-29T08:15:44.908Z");
    const regex = new RegExp(/test/g);
    const asyncFunc = async () => {};

    const input = [
      [
        true,
        false,
        [null, date, [NaN, regex, set, obj, set, [asyncFunc, asyncFunc]]],
        undefined
      ],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ];

    const result = dedupeArray(input, {
      forceToString: "stringOrNumber"
    });

    expect(result).toEqual([
      [
        true,
        false,
        [null, date, [NaN, regex, set, objString, [asyncFunc]]],
        undefined
      ],
      "1",
      fn,
      ["2", fn, ["3", fn]]
    ]);
  });

  it("should handle deeply mixed structures with forceToString: 'primitives' and flatten: false", () => {
    const obj = { a: 1 };
    const objString = { a: "1" };
    const fn = () => 1;
    const symbolX = Symbol("x");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const map = new Map([[symbolX, [undefined, symbolC]]]);
    const set = new Set([symbolX, symbolB, map]);
    const date = new Date("2025-07-29T08:15:44.908Z");
    const regex = new RegExp(/test/g);
    const asyncFunc = async () => {};

    const input = [
      [
        true,
        false,
        [null, date, [NaN, regex, set, obj, set, [asyncFunc, asyncFunc]]],
        undefined
      ],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ];

    const result = dedupeArray(input, {
      forceToString: "primitives"
    });

    expect(result).toEqual([
      [
        "true",
        "false",
        ["null", date, ["NaN", regex, set, objString, [asyncFunc]]],
        "undefined"
      ],
      "1",
      fn,
      ["2", fn, ["3", fn]]
    ]);
  });

  it("should handle deeply mixed structures with forceToString: false and flatten: false", () => {
    const obj = { a: 1 };
    const fn = () => 1;
    const symbolX = Symbol("x");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const map = new Map([[symbolX, [undefined, symbolC]]]);
    const set = new Set([symbolX, symbolB, map]);
    const date = new Date("2025-07-29T08:15:44.908Z");
    const regex = new RegExp(/test/g);
    const asyncFunc = async () => {};

    const input = [
      [
        true,
        false,
        [null, date, [NaN, regex, set, obj, [asyncFunc]]],
        undefined
      ],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ];

    const result = dedupeArray(input, {
      forceToString: false,
      flatten: false
    });

    expect(result).toEqual([
      [
        true,
        false,
        [null, date, [NaN, regex, set, obj, [asyncFunc]]],
        undefined
      ],
      1,
      "1",
      fn,
      [2, "2", fn, [3, "3", fn]]
    ]);
  });

  it("should stringify RegExp when forceToString is 'all'", () => {
    const input = [/test/g, /test/g];
    const result = dedupeArray(input, { forceToString: "all", flatten: true });
    expect(result).toEqual(["/test/g"]);
  });

  it("should handle deeply nested identical numbers with forceToString 'stringOrNumber'", () => {
    const input = [1, [1, [1, [1]]]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual(["1", ["1", ["1", ["1"]]]]);
  });

  it("should handle nested empty arrays", () => {
    const input = [[], [[]], [[[]]], [[]], [[[]]]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual([[], [[]], [[[]]]]);
  });

  it("should keep different type values separate when forceToString is false", () => {
    const input = [1, "1", [1, "1", [1, "1"], [1, "1"]]];
    const result = dedupeArray(input, { forceToString: false });
    expect(result).toEqual([1, "1", [1, "1", [1, "1"]]]);
  });

  describe("type errors", () => {
    it("should throw TypeError if inputArray is not an array", () => {
      expect(() => dedupeArray("not-an-array" as any, {})).toThrow(TypeError);
      expect(() => dedupeArray(123 as any, {})).toThrow(TypeError);
      expect(() => dedupeArray(null as any, {})).toThrow(TypeError);
    });

    it("should throw TypeError if options is not an object", () => {
      expect(() => dedupeArray([1, 2, 3], null as any)).toThrow(TypeError);
      expect(() => dedupeArray([1, 2, 3], "string" as any)).toThrow(TypeError);
      expect(() => dedupeArray([1, 2, 3], 123 as any)).toThrow(TypeError);
    });

    it("should throw TypeError if forceToString is an invalid value", () => {
      expect(() =>
        dedupeArray([1, 2, 3], { forceToString: "invalid" as any })
      ).toThrow(TypeError);
      expect(() =>
        dedupeArray([1, 2, 3], { forceToString: 123 as any })
      ).toThrow(TypeError);
      expect(() =>
        dedupeArray([1, 2, 3], { forceToString: [] as any })
      ).toThrow(TypeError);
    });
  });
});
