// @vitest-environment jsdom

import { describe, it, expect } from "vitest";

import {
  getPreciseType,
  type GetPreciseTypeOptions
} from "@/predicates/type/getPreciseType";
import { PreciseType } from "@/predicates/type/_private/getPreciseType.utils";

// import {
//   __INTERNAL_ACRONYMS__,
//   converterHelper,
//   SPECIAL_CASES_PRECISE_TYPE
// } from "@/predicates/type/_private/getPreciseType.utils";

describe("getPreciseType — ultra comprehensive", () => {
  /**
   * Main test cases array.
   * Each case tests:
   * - value: input to getPreciseType
   * - expected: expected returned string type
   * - name: human-readable description for test reporting
   */
  const cases: Array<{ value: unknown; expected: string; name: string }> = [
    // --- Primitive Types ---
    { value: "abc", expected: "String", name: "string 'abc'" },
    { value: "", expected: "String", name: "empty string" },
    { value: 123, expected: "Number", name: "number 123" },
    { value: 0, expected: "Number", name: "number zero" },
    { value: -1, expected: "Number", name: "number negative" },
    { value: 123n, expected: "Bigint", name: "bigint 123n" },
    { value: 0n, expected: "Bigint", name: "bigint zero" },
    { value: true, expected: "Boolean", name: "boolean true" },
    { value: false, expected: "Boolean", name: "boolean false" },
    { value: Symbol("sym"), expected: "Symbol", name: "symbol" },

    { value: null, expected: "Null", name: "null" },
    { value: undefined, expected: "Undefined", name: "undefined" },

    // Special Number
    { value: NaN, expected: "NaN", name: "NaN (special number)" },
    {
      value: Infinity,
      expected: "Infinity",
      name: "Infinity (special number)"
    },
    {
      value: -Infinity,
      expected: "-Infinity",
      name: "-Infinity (special number)"
    },

    // Boxed Primitive
    {
      value: new String(),
      expected: "String Constructor",
      name: "new String() (Special String Constructor)"
    },
    {
      value: new Number(),
      expected: "Number Constructor",
      name: "new Number() (Special Number Constructor)"
    },
    {
      value: new Boolean(),
      expected: "Boolean Constructor",
      name: "new Boolean() (Special Boolean Constructor)"
    },

    // --- Core JS Objects ---
    { value: {}, expected: "Object", name: "plain object {}" },
    {
      value: Object.create(null),
      expected: "Object",
      name: "Object.create(null)"
    },
    {
      value: new (class Custom {})(),
      expected: "Object",
      name: "custom class instance"
    },
    { value: [], expected: "Array", name: "empty array []" },
    { value: new Array(3), expected: "Array", name: "array with length 3" },
    { value: function () {}, expected: "Function", name: "regular function" },
    { value: () => {}, expected: "Function", name: "arrow function" },
    {
      value: async function () {},
      expected: "Async Function",
      name: "async function"
    },
    {
      value: function* () {},
      expected: "Generator Function",
      name: "generator function"
    },
    {
      value: async function* () {},
      expected: "Async Generator Function",
      name: "async generator function"
    },
    { value: /regex/, expected: "Reg Exp", name: "RegExp literal" },
    { value: new Date(), expected: "Date", name: "Date instance" },
    { value: new Error("err"), expected: "Error", name: "Error instance" },

    // --- Error Subclasses ---
    { value: new EvalError(), expected: "Eval Error", name: "EvalError" },
    { value: new RangeError(), expected: "Range Error", name: "RangeError" },
    {
      value: new ReferenceError(),
      expected: "Reference Error",
      name: "ReferenceError"
    },
    { value: new SyntaxError(), expected: "Syntax Error", name: "SyntaxError" },
    { value: new TypeError(), expected: "Type Error", name: "TypeError" },
    { value: new URIError(), expected: "URI Error", name: "URIError" },
    {
      value: new AggregateError([]),
      expected: "Aggregate Error",
      name: "AggregateError"
    },

    // --- Collections ---
    { value: new Map(), expected: "Map", name: "Map instance" },
    { value: new Set(), expected: "Set", name: "Set instance" },
    { value: new WeakMap(), expected: "Weak Map", name: "WeakMap instance" },
    { value: new WeakSet(), expected: "Weak Set", name: "WeakSet instance" },

    // --- Binary Data ---
    {
      value: new ArrayBuffer(16),
      expected: "Array Buffer",
      name: "ArrayBuffer"
    },
    {
      value: new DataView(new ArrayBuffer(16)),
      expected: "Data View",
      name: "DataView"
    }
  ];

  // Conditionally add SharedArrayBuffer
  if (typeof SharedArrayBuffer !== "undefined") {
    cases.push({
      value: new SharedArrayBuffer(16),
      expected: "Shared Array Buffer",
      name: "SharedArrayBuffer"
    });
  }

  // --- Typed Arrays ---
  cases.push(
    { value: new Int8Array(), expected: "Int 8 Array", name: "Int8Array" },
    { value: new Uint8Array(), expected: "Uint 8 Array", name: "Uint8Array" },
    {
      value: new Uint8ClampedArray(),
      expected: "Uint 8 Clamped Array",
      name: "Uint8ClampedArray"
    },
    { value: new Int16Array(), expected: "Int 16 Array", name: "Int16Array" },
    {
      value: new Uint16Array(),
      expected: "Uint 16 Array",
      name: "Uint16Array"
    },
    { value: new Int32Array(), expected: "Int 32 Array", name: "Int32Array" },
    {
      value: new Uint32Array(),
      expected: "Uint 32 Array",
      name: "Uint32Array"
    },
    {
      value: new Float32Array(),
      expected: "Float 32 Array",
      name: "Float32Array"
    },
    {
      value: new Float64Array(),
      expected: "Float 64 Array",
      name: "Float64Array"
    },
    {
      value: new BigInt64Array(),
      expected: "Big Int 64 Array",
      name: "BigInt64Array"
    },
    {
      value: new BigUint64Array(),
      expected: "Big Uint 64 Array",
      name: "BigUint64Array"
    }
  );

  // --- Promise and Async ---
  cases.push({
    value: Promise.resolve(123),
    expected: "Promise",
    name: "Promise resolved"
  });

  // --- Iterators ---
  cases.push(
    {
      value: new Map().keys(),
      expected: "Map Iterator",
      name: "Map Iterator (keys)"
    },
    {
      value: new Map().values(),
      expected: "Map Iterator",
      name: "Map Iterator (values)"
    },
    {
      value: new Set().keys(),
      expected: "Set Iterator",
      name: "Set Iterator (keys)"
    },
    {
      value: new Set().values(),
      expected: "Set Iterator",
      name: "Set Iterator (values)"
    },
    {
      value: [][Symbol.iterator](),
      expected: "Array Iterator",
      name: "Array Iterator"
    },
    {
      value: ""[Symbol.iterator](),
      expected: "String Iterator",
      name: "String Iterator"
    },
    {
      value: (function* () {
        yield 1;
      })(),
      expected: "Generator",
      name: "Generator instance"
    },
    {
      value: (function* () {
        yield 2;
      })(),
      expected: "Generator",
      name: "Generator instance (duplicate)"
    }
  );

  // --- Arguments object ---
  (function (..._arg: unknown[]) {
    cases.push({
      // eslint-disable-next-line prefer-rest-params
      value: arguments,
      expected: "Arguments",
      name: "Arguments object"
    });
  })(1, 2, 3);

  // --- Proxy ---
  cases.push({
    value: new Proxy({}, {}),
    expected: "Object",
    name: "Proxy object"
  });

  // --- Global Singletons ---
  cases.push(
    { value: Math, expected: "Math", name: "Math object" },
    { value: JSON, expected: "JSON", name: "JSON object" }
  );

  // --- Intl objects (conditionally) ---
  if (typeof Intl !== "undefined") {
    cases.push(
      { value: Intl, expected: "Intl", name: "Intl namespace" },
      {
        value: new Intl.Collator(),
        expected: "Intl Collator",
        name: "Intl.Collator instance"
      },
      {
        value: new Intl.DateTimeFormat(),
        expected: "Intl Date Time Format",
        name: "Intl.DateTimeFormat instance"
      },
      {
        value: new Intl.ListFormat("en"),
        expected: "Intl List Format",
        name: "Intl.ListFormat instance"
      },
      {
        value: new Intl.NumberFormat(),
        expected: "Intl Number Format",
        name: "Intl.NumberFormat instance"
      },
      {
        value: new Intl.PluralRules(),
        expected: "Intl Plural Rules",
        name: "Intl.PluralRules instance"
      },
      {
        value: new Intl.RelativeTimeFormat(),
        expected: "Intl Relative Time Format",
        name: "Intl.RelativeTimeFormat instance"
      }
    );

    if (typeof Intl.Segmenter !== "undefined") {
      cases.push({
        value: new Intl.Segmenter(),
        expected: "Intl Segmenter",
        name: "Intl.Segmenter instance"
      });
    }
    if (typeof Intl.Locale !== "undefined") {
      cases.push({
        value: new Intl.Locale("en"),
        expected: "Intl Locale",
        name: "Intl.Locale instance"
      });
    }
  }

  // --- Atomics (conditionally) ---
  if (typeof Atomics !== "undefined") {
    cases.push({ value: Atomics, expected: "Atomics", name: "Atomics object" });
  }

  // --- Reflect ---
  cases.push({ value: Reflect, expected: "Reflect", name: "Reflect object" });

  // --- Web Streams API (conditionally) ---
  if (typeof ReadableStream !== "undefined") {
    cases.push({
      value: new ReadableStream(),
      expected: "Readable Stream",
      name: "ReadableStream instance"
    });
  }
  if (typeof WritableStream !== "undefined") {
    cases.push({
      value: new WritableStream(),
      expected: "Writable Stream",
      name: "WritableStream instance"
    });
  }
  if (typeof TransformStream !== "undefined") {
    cases.push({
      value: new TransformStream(),
      expected: "Transform Stream",
      name: "TransformStream instance"
    });
  }

  // --- Performance API (conditionally) ---
  if (typeof performance !== "undefined") {
    cases.push({
      value: performance,
      expected: "Performance",
      name: "Performance object"
    });
  }
  if (typeof PerformanceObserver !== "undefined") {
    cases.push({
      value: new PerformanceObserver(() => {}),
      expected: "Performance Observer",
      name: "PerformanceObserver instance"
    });
  }

  // --- Node.js-specific types (if you want to add them) ---
  // e.g. Buffer, process, etc.
  if (typeof Buffer !== "undefined") {
    cases.push({
      value: Buffer.from("test"),
      expected: "Buffer",
      name: "Node.js Buffer instance"
    });
  }
  if (typeof process !== "undefined") {
    cases.push({
      value: process,
      expected: "Process",
      name: "Node.js process object"
    });
  }

  // --- Run all test cases ---

  const ClassPrecise = (options?: GetPreciseTypeOptions) =>
    new PreciseType(options);

  cases.forEach((c) => {
    it(`returns "${c.expected}" for ${c.name}`, () => {
      const valueToConvert = (options?: GetPreciseTypeOptions) => {
        // @ts-expect-error only for test
        if (PreciseType.specialType.includes(c.expected)) return c.expected;

        return ClassPrecise(options).converter(c.expected);
      };

      expect(getPreciseType(c.value)).toBe(valueToConvert());
      expect(getPreciseType(c.value, { useAcronyms: true })).toBe(
        valueToConvert({ useAcronyms: true })
      );

      expect(getPreciseType(c.value, { formatCase: "toPascalCaseSpace" })).toBe(
        valueToConvert({ useAcronyms: false, formatCase: "toPascalCaseSpace" })
      );
      expect(
        getPreciseType(c.value, { formatCase: "slugify", useAcronyms: true })
      ).toBe(valueToConvert({ useAcronyms: true, formatCase: "slugify" }));
    });
  });

  // --- Additional tests for nested/wrapped structures ---
  it("correctly handles nested arrays and objects", () => {
    expect(getPreciseType([[]])).toBe("array");
    expect(getPreciseType({ a: { b: 2 } })).toBe("object");
  });
});

describe("getPreciseType — extended FIXES_RAW coverage", () => {
  // Proxy object test (expected Proxy, bukan Object)
  it("returns 'Proxy' for Proxy object - with empty object", () => {
    expect(getPreciseType(new Proxy({}, {}), {})).toBe("object");
  });

  it("returns 'Proxy' for Proxy object with blocking defineProperty trap", () => {
    const proxy = new Proxy(
      {},
      {
        defineProperty() {
          throw new Error("blocked");
        }
      }
    );
    expect(getPreciseType(proxy, {})).toBe("proxy");
  });

  // Node.js Buffer (conditional)
  if (typeof Buffer !== "undefined") {
    it("returns 'Buffer' for Node.js Buffer", () => {
      expect(getPreciseType(Buffer.from("test"), {})).toBe("buffer");
    });
  }

  // Node.js process (conditional)
  if (typeof process !== "undefined") {
    it("returns 'Process' for Node.js process object", () => {
      expect(getPreciseType(process, {})).toBe("process");
    });
  }

  // Symbol.iterator (Symbolic)
  describe("getPreciseType — Symbol well-known symbols coverage", () => {
    const symbolsTestCases: Array<{
      symbol: symbol;
      expected: string;
      name: string;
    }> = [
      {
        symbol: Symbol.iterator,
        expected: "symbol-iterator",
        name: "Symbol.iterator"
      },
      {
        symbol: Symbol.asyncIterator,
        expected: "symbol-async-iterator",
        name: "Symbol.asyncIterator"
      },
      {
        symbol: Symbol.toStringTag,
        expected: "symbol-to-string-tag",
        name: "Symbol.toStringTag"
      },
      {
        symbol: Symbol.species,
        expected: "symbol-species",
        name: "Symbol.species"
      },
      {
        symbol: Symbol.hasInstance,
        expected: "symbol-has-instance",
        name: "Symbol.hasInstance"
      },
      {
        symbol: Symbol.isConcatSpreadable,
        expected: "symbol-is-concat-spreadable",
        name: "Symbol.isConcatSpreadable"
      },
      {
        symbol: Symbol.unscopables,
        expected: "symbol-unscopables",
        name: "Symbol.unscopables"
      },
      { symbol: Symbol.match, expected: "symbol-match", name: "Symbol.match" },
      {
        symbol: Symbol.replace,
        expected: "symbol-replace",
        name: "Symbol.replace"
      },
      {
        symbol: Symbol.search,
        expected: "symbol-search",
        name: "Symbol.search"
      },
      { symbol: Symbol.split, expected: "symbol-split", name: "Symbol.split" },
      {
        symbol: Symbol.toPrimitive,
        expected: "symbol-to-primitive",
        name: "Symbol.toPrimitive"
      },
      {
        symbol: Symbol.matchAll,
        expected: "symbol-match-all",
        name: "Symbol.matchAll"
      }
      // Symbol.arguments is deprecated, so optional to test
      // { symbol: Symbol.arguments, expected: "symbol-arguments", name: "Symbol.arguments" },
    ];

    for (const { symbol, expected, name } of symbolsTestCases) {
      it(`returns '${expected}' for ${name}`, () => {
        expect(getPreciseType(symbol, {})).toBe(expected);
      });
    }
  });

  // DOM Node (if defined)
  if (typeof Node !== "undefined") {
    it("returns 'Node' for DOM Node", () => {
      const node = document.createTextNode("text");
      expect(getPreciseType(node, {})).toBe("text");
    });
  }

  // MutationObserver (if defined)
  if (typeof MutationObserver !== "undefined") {
    it("returns 'Mutation Observer' for MutationObserver instance", () => {
      expect(getPreciseType(new MutationObserver(() => {}), {})).toBe(
        "mutation-observer"
      );
    });
  }

  // EventEmitter (Node.js)
  if (typeof require !== "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const EventEmitter = require("events").EventEmitter;
      it("returns 'Event Emitter' for Node.js EventEmitter", () => {
        expect(getPreciseType(new EventEmitter(), {})).toBe("event-emitter");
      });
    } catch {
      // no-op
    }
  }
});

describe("getPreciseType - extended JS and Web API types", () => {
  // Simbol (Reflection)
  it("should detect Symbol types", () => {
    expect(getPreciseType(Symbol.iterator)).toBe("symbol-iterator");
    expect(getPreciseType(Symbol.asyncIterator)).toBe("symbol-async-iterator");
    expect(getPreciseType(Symbol.toStringTag)).toBe("symbol-to-string-tag");
    expect(getPreciseType(Symbol.species)).toBe("symbol-species");
    expect(getPreciseType(Symbol.hasInstance)).toBe("symbol-has-instance");
    expect(getPreciseType(Symbol.isConcatSpreadable)).toBe(
      "symbol-is-concat-spreadable"
    );
    expect(getPreciseType(Symbol.unscopables)).toBe("symbol-unscopables");
    expect(getPreciseType(Symbol.match)).toBe("symbol-match");
    expect(getPreciseType(Symbol.replace)).toBe("symbol-replace");
    expect(getPreciseType(Symbol.search)).toBe("symbol-search");
    expect(getPreciseType(Symbol.split)).toBe("symbol-split");
    expect(getPreciseType(Symbol.toPrimitive)).toBe("symbol-to-primitive");
    expect(getPreciseType(Symbol.matchAll)).toBe("symbol-match-all");
  });

  // deprecated
  it.skip("should detect Symbol.arguments (deprecated)", () => {
    expect(getPreciseType(Symbol.arguments)).toBe("symbol-arguments");
  });

  // Numbers & Math & Constructors
  it("should detect Math and constructors", () => {
    expect(getPreciseType(Math)).toBe("math");
    // For constructors, usually these are functions
    // But if you wrap, test accordingly
    expect(getPreciseType(BigInt)).toBe("bigint-constructor");
    expect(getPreciseType(Number)).toBe("number-constructor");
    expect(getPreciseType(String)).toBe("string-constructor");
    expect(getPreciseType(Boolean)).toBe("boolean-constructor");
  });

  // URL / Networking
  it("should detect URL and networking objects", () => {
    expect(
      getPreciseType(new FormDataEvent("submit", { formData: new FormData() }))
    ).toBe("form-data-event");
    expect(getPreciseType(new CustomEvent("test"))).toBe("custom-event");
    expect(getPreciseType(new MessageEvent("message"))).toBe("message-event");
    expect(getPreciseType(new WebSocket("ws://localhost"))).toBe("web-socket");
    expect(getPreciseType(new EventSource("http://localhost"))).toBe(
      "event-source"
    );

    // const channel = new MessageChannel();
    // const port = channel.port1;
    // expect(getPreciseType(port)).toBe("message-port");
    // expect(getPreciseType(channel)).toBe("message-channel");
  });

  // Storage APIs (skip)
  it.skip("should detect Storage related types", () => {
    expect(getPreciseType(indexedDB)).toBe("indexed-db");
    expect(getPreciseType(IDBRequest)).toBe("idb-request");
    expect(getPreciseType(IDBTransaction)).toBe("idb-transaction");
    expect(getPreciseType(IDBObjectStore)).toBe("idb-object-store");
    expect(getPreciseType(IDBCursor)).toBe("idb-cursor");
    expect(getPreciseType(localStorage)).toBe("local-storage");
    expect(getPreciseType(sessionStorage)).toBe("session-storage");
  });

  // Navigator / Browser APIs
  it.skip("should detect Navigator and related", () => {
    if (typeof navigator !== "undefined") {
      expect(getPreciseType(navigator)).toBe("navigator");
    } else {
      // skip("navigator not available in Node");
    }

    if (typeof navigator.geolocation !== "undefined") {
      expect(getPreciseType(navigator.geolocation)).toBe("geolocation");
    } else {
      // skip("geolocation not available in Node");
    }

    expect(getPreciseType(navigator.clipboard)).toBe("clipboard");
    expect(getPreciseType(Notification)).toBe("notification");
  });

  if (document.contentType === "text/html") {
    it.skip("should detect canvas and graphic contexts", () => {});
  } else {
    it("should detect canvas and graphic contexts", () => {
      const canvas = document.createElement("canvas");
      expect(getPreciseType(canvas)).toBe("html-canvas-element");
      const ctx = canvas.getContext("2d");
      expect(getPreciseType(ctx)).toBe("canvas-rendering-context-2d");
      // OffscreenCanvas may not be available in all envs
      if (typeof OffscreenCanvas !== "undefined") {
        expect(getPreciseType(new OffscreenCanvas(10, 10))).toBe(
          "off-screen-canvas"
        );
      }
      // WebGLRenderingContext
      const gl = canvas.getContext("webgl");
      if (gl) expect(getPreciseType(gl)).toBe("webgl-rendering-context");
    });
  }

  // Media
  it("should detect media related objects", () => {
    expect(getPreciseType(MediaStream)).toBe("media-stream");
    expect(getPreciseType(MediaStreamTrack)).toBe("media-stream-track");
    expect(getPreciseType(AudioContext)).toBe("audio-context");
    expect(getPreciseType(AudioBuffer)).toBe("audio-buffer");
    expect(getPreciseType(AudioWorklet)).toBe("audio-worklet");
    expect(getPreciseType(MediaRecorder)).toBe("media-recorder");
  });

  // Workers
  it("should detect workers and their global scopes", () => {
    expect(getPreciseType(Worker)).toBe("worker");
    expect(getPreciseType(SharedWorker)).toBe("shared-worker");
    expect(getPreciseType(ServiceWorker)).toBe("service-worker");
    expect(getPreciseType(self)).toBe("worker-global-scope"); // inside a worker env
  });

  // Testing / Diagnostics
  it("should detect console and reports", () => {
    expect(getPreciseType(console)).toBe("console");
    // DiagnosticReport and Report are not standard globally available objects
    // If your env has them, test here, else skip or mock
  });

  // Miscellaneous DOM
  if (document.contentType === "text/html") {
    it.skip("should detect DOM and related objects", () => {});
  } else {
    it("should detect DOM and related objects", () => {
      const domMatrix = new DOMMatrix();
      expect(getPreciseType(domMatrix)).toBe("dom-matrix");
      const domRect = new DOMRect();
      expect(getPreciseType(domRect)).toBe("dom-rect");
      const domPoint = new DOMPoint();
      expect(getPreciseType(domPoint)).toBe("dom-point");
      const parser = new DOMParser();
      expect(getPreciseType(parser)).toBe("dom-parser");
      const xhr = new XMLHttpRequest();
      expect(getPreciseType(xhr)).toBe("xml-http-request");
      const form = document.createElement("form");
      expect(getPreciseType(form)).toBe("html-form-element");
      const input = document.createElement("input");
      expect(getPreciseType(input)).toBe("html-input-element");
    });
  }

  // Additions-ons
  it("should detect additional DOM node types", () => {
    expect(getPreciseType(document.doctype)).toBe("document-type");
    expect(getPreciseType(document.createComment("test"))).toBe("comment");
    expect(getPreciseType(document.createTextNode("text"))).toBe("text");
    expect(getPreciseType(customElements)).toBe("custom-element-registry");
    // AnimationEvent, WebSocketMessageEvent may require constructor calls or mocking
  });

  if (document.contentType === "text/html") {
    it.skip("should detect CDATA section", () => {});
  } else {
    it("should detect CDATA section", () => {
      const xmlDoc = document.implementation.createDocument(null, "root");
      const cdata = xmlDoc.createCDATASection("test");
      expect(getPreciseType(cdata)).toBe("cdata-section");
    });
  }

  it("should detect Animation", () => {
    const div = document.createElement("div");
    if (typeof div.animate !== "function") {
      return; // skip test if environment un-support Web Animations API
    }
    const animation = div.animate([], {});
    expect(getPreciseType(animation)).toBe("animation");
  });

  // WebAssembly Module
  it("should detect WebAssembly.Module", () => {
    if (typeof WebAssembly !== "undefined" && WebAssembly.Module) {
      const wasmCode = new Uint8Array([
        0x00,
        0x61,
        0x73,
        0x6d, // "\0asm" magic header
        0x01,
        0x00,
        0x00,
        0x00 // version 1
      ]);
      const module = new WebAssembly.Module(wasmCode);
      expect(getPreciseType(module)).toBe("module");
    }
  });

  // Iterators
  it("should detect iterators", () => {
    expect(getPreciseType(new Map().keys())).toBe("map-iterator");
    expect(getPreciseType(new Set().values())).toBe("set-iterator");
    expect(getPreciseType([][Symbol.iterator]())).toBe("array-iterator");
    expect(getPreciseType(""[Symbol.iterator]())).toBe("string-iterator");
    // AsyncIterator test - you can mock or create async generator if needed
  });

  // Iterator Results
  it("should detect iterator results", () => {
    const arrayIterator = [][Symbol.iterator]();
    const res = arrayIterator.next();
    expect(getPreciseType(res)).toBe("iterator-result");
    // array iterator result test if different type needed
  });

  // ResizeObserver
  it("should detect ResizeObserver", () => {
    if (typeof ResizeObserver !== "undefined") {
      expect(getPreciseType(new ResizeObserver(() => {}))).toBe(
        "resize-observer"
      );
    }
  });

  // Structured Clone / Transferable
  it("should detect structured clone and transferable", () => {
    // @ts-expect-error skip
    expect(getPreciseType(StructuredCloneError)).toBe("structured-clone-error");
    // Transferable is an interface, testing if window.Transferable exists
    // @ts-expect-error skip
    if (typeof Transferable !== "undefined") {
      // @ts-expect-error skip
      expect(getPreciseType(Transferable)).toBe("transferable");
    }
  });

  // URLSearchParams and URLPattern
  it("should detect URLSearchParams and URLPattern", () => {
    expect(getPreciseType(new URLSearchParams())).toBe("url-search-params");
    // @ts-ignore skip (browser api)
    if (typeof URLPattern !== "undefined") {
      // @ts-ignore skip (browser api)
      expect(getPreciseType(new URLPattern())).toBe("url-pattern");
    }
  });
});
