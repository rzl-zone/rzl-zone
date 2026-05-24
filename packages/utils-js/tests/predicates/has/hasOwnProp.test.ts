/* eslint-disable @typescript-eslint/no-explicit-any */
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { describe, it, expect } from "vitest";

interface Data {
  user?: null | {
    name?: string | null;
    nullable: string | null;
    undefinedable?: string;
    nillable?: string | null;
    age?: number | null;
    requiredButNill: number | null | undefined;
    addresses:
      | undefined
      | {
          street?: string | null;
          zip?: number | null;
        }[];
    nullableArray?: null | undefined | string[];
  };
  tags?: string[] | null;
}

const data: Data = {
  user: {
    name: "Alice",
    age: 30,
    nullable: null,
    undefinedable: undefined,
    requiredButNill: undefined,
    nullableArray: null,
    addresses: [{ street: "Main St" }, { street: "Second St", zip: 12345 }]
  },
  tags: ["admin", "editor"]
};

describe("hasOwnProp", () => {
  it("detects top-level existing property", () => {
    expect(hasOwnProp(data, "user")).toBe(true);
    expect(hasOwnProp(data, "tags")).toBe(true);
  });

  it("detects nested property object keys", () => {
    expect(hasOwnProp(data, "user.name")).toBe(true);
    expect(hasOwnProp(data, "user.name", { discardNull: true })).toBe(true);
    expect(
      hasOwnProp(data, "user.name", {
        discardUndefined: false,
        discardNull: true
      })
    ).toBe(true);
    expect(
      hasOwnProp(data, "user.name", {
        discardUndefined: false,
        discardNull: false
      })
    ).toBe(true);

    expect(hasOwnProp(data, "user.age")).toBe(true);
    expect(hasOwnProp(data, "user.age", { discardNull: true })).toBe(true);
    expect(
      hasOwnProp(data, "user.age", {
        discardUndefined: false,
        discardNull: true
      })
    ).toBe(true);
    expect(
      hasOwnProp(data, "user.age", {
        discardUndefined: false,
        discardNull: false
      })
    ).toBe(true);

    expect(hasOwnProp(data, "user.requiredButNill")).toBe(false);
    expect(
      hasOwnProp(data, "user.requiredButNill", { discardNull: true })
    ).toBe(false);
    expect(
      hasOwnProp(data, "user.requiredButNill", {
        discardUndefined: false,
        discardNull: true
      })
    ).toBe(true);
    expect(
      hasOwnProp(data, "user.requiredButNill", {
        discardUndefined: false,
        discardNull: false
      })
    ).toBe(true);
  });

  it("respects discardUndefined and discardNull option", () => {
    expect(hasOwnProp(data, "user.nillable")).toBe(false);
    expect(hasOwnProp(data, "user.nillable", { discardNull: true })).toBe(
      false
    );
    expect(
      hasOwnProp(data, "user.nillable", {
        discardUndefined: false,
        discardNull: true
      })
    ).toBe(false);
    expect(
      hasOwnProp(data, "user.nillable", {
        discardUndefined: false,
        discardNull: false
      })
    ).toBe(false);

    expect(hasOwnProp(data, "user.nullable")).toBe(true);
    expect(hasOwnProp(data, "user.nullable", { discardNull: true })).toBe(
      false
    );
    expect(
      hasOwnProp(data, "user.nullable", {
        discardUndefined: false,
        discardNull: true
      })
    ).toBe(false);
    expect(
      hasOwnProp(data, "user.nullable", {
        discardUndefined: false,
        discardNull: false
      })
    ).toBe(true);

    expect(hasOwnProp(data, "user.undefinedable")).toBe(false);
    expect(
      hasOwnProp(data, "user.undefinedable", { discardUndefined: false })
    ).toBe(true);
  });

  it("detects array indices with bracket syntax", () => {
    expect(
      hasOwnProp(data, "user.addresses.[9]", {
        discardUndefined: true,
        discardNull: true
      })
    ).toBe(false);
    expect(hasOwnProp(data, "user.addresses.[1].street")).toBe(true);
    expect(hasOwnProp(data, "user.addresses.[1].zip")).toBe(true);
    expect(hasOwnProp(data, "user.addresses.[2].zip")).toBe(false);
  });

  it("fails for nonexistent array indices", () => {
    expect(hasOwnProp(data, "user.addresses.[5].street")).toBe(false);
  });

  it("fails for nonexistent nested keys", () => {
    expect(hasOwnProp(data, "user.nonexistent")).toBe(false);
    expect(hasOwnProp(data, "user.addresses.[1].nonexistent")).toBe(false);
  });

  it("infers types correctly", () => {
    const test = hasOwnProp(data, "user.nullableArray");
    //TODO: ⚠️ TS infers number match index but still get bug => data.user.nullableArray <- still NonNullable.
    expect(test).toBe(true);
    if (hasOwnProp(data, "user.nullableArray", { discardNull: false })) {
      const zip: string[] | null = data.user.nullableArray;
      expect(zip).toBe(null);
    }
    if (hasOwnProp(data, "user.addresses.[2].zip", { discardNull: true })) {
      const zip: number = data.user.addresses[2].zip; //? ✅ TS infers number match index
      expect(zip).toBe(12345);
    }
    if (hasOwnProp(data, "user.addresses.[2].zip")) {
      const zip: number | null | undefined = data.user.addresses[1]?.zip;
      //! DIFF INDEX MUST BE OPTIONAL PURE LIKE INPUT MUS BE -> data.user.addresses?.[1].zip but still ACCESS ABLE (MIGHT ERROR)!
      expect(zip).toBe(12345);
    }
  });

  it("should correctly check for own properties with numeric keys", () => {
    const obj: { 0?: string | null; 1?: null | string } = {
      0: "zero",
      1: "one"
    };

    expect(hasOwnProp(obj, 1)).toBe(true);
    expect(hasOwnProp(obj, 1, { discardNull: true })).toBe(true);
    expect(hasOwnProp(obj, 1, { discardUndefined: false })).toBe(true);
    expect(
      hasOwnProp(obj, 1, { discardUndefined: false, discardNull: true })
    ).toBe(true);
    expect(hasOwnProp(obj, 2, { discardUndefined: false })).toBe(false);
    expect(
      hasOwnProp(obj, 2, { discardUndefined: false, discardNull: true })
    ).toBe(false);
  });

  it("works with discardUndefined false on nullable values", () => {
    if (hasOwnProp(data, "user.age")) {
      const age: number | null = data.user.age;
      expect(age).toBe(30);
    }
    if (hasOwnProp(data, "user.age", { discardUndefined: false })) {
      const age: number | null | undefined = data.user.age;
      expect(age).toBe(30);
    }
  });

  it("should return false for keys on arrays that are not own properties", () => {
    const arr = [1, 2, 3];
    expect(hasOwnProp(arr, "length")).toBe(true); // length is own property
    expect(hasOwnProp(arr, "push")).toBe(false); // inherited method
  });
});

describe("hasOwnProp with arrays", () => {
  it("detects top-level array indices", () => {
    const arr = ["zero", "one", "two"];
    expect(hasOwnProp(arr, 0)).toBe(true);
    expect(hasOwnProp(arr, 1)).toBe(true);
    expect(hasOwnProp(arr, 2)).toBe(true);
    expect(hasOwnProp(arr, 3)).toBe(false); // index tidak ada
  });

  it("detects nested array indices using dot/bracket notation", () => {
    const nested = [
      ["a", "b"],
      ["c", "d"]
    ] as const;
    expect(hasOwnProp(nested, "0.0")).toBe(true); // "a"
    expect(hasOwnProp(nested, "0.1")).toBe(true); // "b"
    expect(hasOwnProp(nested, "1.1")).toBe(true); // "d"
    expect(hasOwnProp(nested, "1.2")).toBe(false); // tidak ada
  });

  it("works with mixed object/array", () => {
    const mixed = { items: ["x", "y"] as const };
    expect(hasOwnProp(mixed, "items.[0]")).toBe(true); // "x"
    expect(hasOwnProp(mixed, "items.[1]")).toBe(true); // "y"
    expect(hasOwnProp(mixed, "items.[2]")).toBe(false);
  });
});

describe("hasOwnProp with function and mixed", () => {
  it("should distinguish own properties from inherited properties", () => {
    class Parent {
      parentProp = "parent"; // own property on instance
      inheritedMethod() {}
    }
    class Child extends Parent {
      childProp = "child";
    }
    const instance = new Child();

    expect(hasOwnProp(instance, "childProp")).toBe(true); // own property
    expect(hasOwnProp(instance, "parentProp")).toBe(true); // own property, not inherited
    expect(hasOwnProp(instance, "inheritedMethod")).toBe(false); // prototype inherited method
  });

  it("should detect own properties on functions but not inherited methods", () => {
    function fn() {}
    (fn as any).customProp = "value";

    expect(hasOwnProp(fn, "customProp")).toBe(true);
    expect(hasOwnProp(fn, "apply")).toBe(false);
    expect(hasOwnProp(fn, "call")).toBe(false);
  });

  it("should return true for symbol own properties", () => {
    const sym = Symbol("mySymbol");
    type OBJ = {
      [sym]?: number | null;
    };
    const obj: OBJ = { [sym]: 42 };

    expect(hasOwnProp(obj, sym)).toBe(true);
    expect(hasOwnProp(obj, sym, { discardUndefined: false })).toBe(true);
    expect(
      hasOwnProp(obj, sym, { discardUndefined: false, discardNull: true })
    ).toBe(true);
    expect(
      hasOwnProp(obj, sym, { discardUndefined: true, discardNull: false })
    ).toBe(true);
    expect(
      hasOwnProp(obj, sym, { discardUndefined: false, discardNull: false })
    ).toBe(true);
  });

  it("should return false for symbol inherited properties", () => {
    const sym = Symbol("sym");
    class Base {
      [sym]() {}
    }
    class Derived extends Base {}
    const instance = new Derived();

    expect(hasOwnProp(instance, sym)).toBe(false);
  });

  it("should return false for keys on arrays that are not own properties", () => {
    const arr = [1, 2, 3];
    expect(hasOwnProp(arr, "length")).toBe(true); // length is own property
    expect(hasOwnProp(arr, "push")).toBe(false); // inherited method
  });

  it("should handle objects created with Object.create(null) correctly", () => {
    const obj = Object.create(null);
    obj.foo = "bar";
    expect(hasOwnProp(obj, "foo")).toBe(true);
    expect(hasOwnProp(obj, "toString")).toBe(false);
  });

  it("should return false when key is symbol but object is null or undefined", () => {
    const sym = Symbol("test");
    expect(hasOwnProp(null, sym)).toBe(false);
    expect(hasOwnProp(undefined, sym)).toBe(false);
  });

  it("should return false for keys on frozen or sealed objects when key does not exist", () => {
    const obj = Object.freeze({ a: 1 });
    expect(hasOwnProp(obj, "b")).toBe(false);

    const sealedObj = Object.seal({ a: 1 });
    expect(hasOwnProp(sealedObj, "b")).toBe(false);
  });

  it("should handle NaN as a property key", () => {
    const obj: any = {};
    obj[NaN] = "nan value";
    expect(hasOwnProp(obj, NaN)).toBe(true);
  });
});

describe("hasOwnProp with Symbol keys", () => {
  const symId = Symbol.for("id");
  const symName = Symbol("name");

  const obj = {
    [symId]: 42,
    [symName]: { nested: "hello" }
  };

  it("detects top-level Symbol key", () => {
    expect(hasOwnProp(obj, symId)).toBe(true);
    expect(hasOwnProp(obj, Symbol.for("nonexistent"))).toBe(false);
  });

  it("detects nested property via Symbol key", () => {
    expect(hasOwnProp(obj, "Symbol(name).nested")).toBe(true);
    expect(hasOwnProp(obj, "Symbol(name).missing")).toBe(false);
  });

  it("respects discardUndefined,discardNull option for Symbol key", () => {
    const obj2: Record<symbol, string | null> = { [symId]: null };
    expect(hasOwnProp(obj2, symId, { discardNull: true })).toBe(false);
    expect(hasOwnProp(obj2, symId, { discardNull: false })).toBe(true);
  });
});

describe("hasOwnProp handle errors", () => {
  it("should return false if object is null", () => {
    expect(hasOwnProp(null, "key")).toBe(false);
  });

  it("should return false if object is undefined", () => {
    expect(hasOwnProp(undefined, "key")).toBe(false);
  });

  it("should return false if key is empty string", () => {
    const obj = { a: 1 };
    expect(hasOwnProp(obj, "")).toBe(false);
  });

  it("should return false if key path does not exist", () => {
    const obj = { a: { b: 1 } };
    expect(hasOwnProp(obj, "a.c")).toBe(false);
  });

  it("should return false if accessing nested on non-object", () => {
    const obj = { a: 123 };
    expect(hasOwnProp(obj, "a.b")).toBe(false);
  });

  it("should return false if object is not actually an object (number)", () => {
    expect(hasOwnProp(123, "toString")).toBe(false);
  });

  it("should check hasOwnProperty on string", () => {
    const strings = "hello";
    expect(hasOwnProp(strings, "length")).toBe(true);
    expect(hasOwnProp(strings, "toLowerCase")).toBe(false);
  });

  it("should return false if object is not actually an string, object or array", () => {
    expect(hasOwnProp(1, "length")).toBe(false);
    expect(hasOwnProp(true, "length")).toBe(false);
  });

  it("should return false if object is an array but invalid index", () => {
    const arr = [10, 20, 30];
    expect(hasOwnProp(arr, "length")).toBe(true);

    expect(hasOwnProp(arr, "2")).toBe(true);
    expect(hasOwnProp(arr, "5")).toBe(false);
  });

  it("should handle NaN key safely and not throw", () => {
    const obj: Record<string, string> = {};
    obj["NaN"] = "nan value";
    expect(() => hasOwnProp(obj, NaN)).not.toThrow();
    expect(hasOwnProp(obj, NaN)).toBe(true);
  });

  it("should handle symbol key safely and not throw", () => {
    const sym = Symbol("test");
    const obj = { [sym]: 42 };
    expect(() => hasOwnProp(obj, sym)).not.toThrow();
    expect(hasOwnProp(obj, sym)).toBe(true);
  });
});

describe("hasOwnProp handle TypeError", () => {
  const obj = { a: 1 };

  it("should not throw TypeError if options is not a plain object", () => {
    expect(hasOwnProp(obj, "a", null as any)).toBe(true);
    expect(hasOwnProp(obj, "a", [] as any)).toBe(true);
    expect(hasOwnProp(obj, "a", "invalid" as any)).toBe(true);
    expect(hasOwnProp(obj, "a", 123 as any)).toBe(true);
  });

  it("should throw TypeError if options.discardUndefined is not a boolean", () => {
    expect(() =>
      hasOwnProp(obj, "a", { discardUndefined: "yes" as any })
    ).toThrow(TypeError);
    expect(() => hasOwnProp(obj, "a", { discardUndefined: 1 as any })).toThrow(
      TypeError
    );
    expect(() => hasOwnProp(obj, "a", { discardUndefined: {} as any })).toThrow(
      TypeError
    );
    expect(() => hasOwnProp(obj, "a", { discardUndefined: [] as any })).toThrow(
      TypeError
    );
  });
});
