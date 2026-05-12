/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageChannel, MessagePort } from "node:worker_threads";

if (typeof global.MessageChannel === "undefined") {
  (global as any).MessageChannel = MessageChannel;
  (global as any).MessagePort = MessagePort;
}

// Utility factory
const makeTagged = (name: string) =>
  class {
    static [Symbol.toStringTag] = name;
    [Symbol.toStringTag] = name;
  };

// ---- Event / FormData ----
if (typeof FormDataEvent === "undefined") {
  globalThis.FormDataEvent = class FormDataEvent extends Event {
    formData: FormData | null;
    static [Symbol.toStringTag] = "FormDataEvent";
    constructor(type: string, init?: any) {
      super(type, init);
      this.formData = init?.formData ?? null;
    }
  } as any;
}

if (typeof CustomEvent === "undefined") {
  globalThis.CustomEvent = class CustomEvent extends Event {
    static [Symbol.toStringTag] = "CustomEvent";
    [Symbol.toStringTag] = "CustomEvent";
    constructor(type: string, init?: any) {
      super(type, init);
    }
  } as any;
}

// ---- IndexedDB mocks ----
globalThis.indexedDB = {} as any;
(globalThis as any).IDBRequest = makeTagged("IDBRequest");
(globalThis as any).IDBTransaction = makeTagged("IDBTransaction");
(globalThis as any).IDBObjectStore = makeTagged("IDBObjectStore");
(globalThis as any).IDBCursor = makeTagged("IDBCursor");
(globalThis as any).IDBIndex = makeTagged("IDBIndex");

// ---- Notification ----
(globalThis as any).Notification = class Notification {
  static [Symbol.toStringTag] = "Notification";
  [Symbol.toStringTag] = "Notification";
  constructor(public title?: string) {}
};

// ---- Navigator ----
// globalThis.navigator = {
//   geolocation: { [Symbol.toStringTag]: "Geolocation" },
//   clipboard: { [Symbol.toStringTag]: "Clipboard" }
// } as any;

// ---- DOM / Canvas ----
(globalThis as any).DOMRect = makeTagged("DOMRect");
(globalThis as any).DOMPoint = makeTagged("DOMPoint");
(globalThis as any).DOMParser = makeTagged("DOMParser");
(globalThis as any).DOMMatrix = makeTagged("DOMMatrix");

if (typeof document !== "undefined") {
  const origCreateElement = document.createElement.bind(document);
  (document as any).createElement = (tag: string) => {
    if (tag === "canvas") {
      return {
        nodeName: "CANVAS",
        [Symbol.toStringTag]: "HTMLCanvasElement",
        getContext: () => ({
          [Symbol.toStringTag]: "CanvasRenderingContext2D"
        })
      };
    }
    return origCreateElement(tag);
  };

  Object.defineProperty(document, "doctype", {
    value: { name: "html", [Symbol.toStringTag]: "DocumentType" }
  });

  // Fix Comment/Text
  const CommentProto = (document.createComment("") as any).__proto__;
  Object.defineProperty(CommentProto, Symbol.toStringTag, {
    value: "Comment",
    configurable: true
  });

  const TextProto = (document.createTextNode("") as any).__proto__;
  Object.defineProperty(TextProto, Symbol.toStringTag, {
    value: "Text",
    configurable: true
  });

  // Mock CDATASection (HTML doc doesn't support it)
  if (typeof CDATASection === "undefined") {
    globalThis.CDATASection = class CDATASection extends Text {
      static [Symbol.toStringTag] = "CDATASection";
      [Symbol.toStringTag] = "CDATASection";
    };
  }

  // Add tags for form and input elements
  const tagNames: [string, string][] = [
    ["form", "HTMLFormElement"],
    ["input", "HTMLInputElement"]
  ];
  for (const [tag, name] of tagNames) {
    const proto = (document.createElement(tag) as any).__proto__;
    Object.defineProperty(proto, Symbol.toStringTag, {
      value: name,
      configurable: true
    });
  }
}

// ---- Storage ----
if (typeof localStorage !== "undefined") {
  Object.defineProperty(localStorage, Symbol.toStringTag, {
    value: "LocalStorage",
    configurable: true
  });
}
if (typeof sessionStorage !== "undefined") {
  Object.defineProperty(sessionStorage, Symbol.toStringTag, {
    value: "SessionStorage",
    configurable: true
  });
}

// ---- Media ----
(globalThis as any).MediaStream = makeTagged("MediaStream");
(globalThis as any).MediaStreamTrack = makeTagged("MediaStreamTrack");
(globalThis as any).AudioContext = makeTagged("AudioContext");
(globalThis as any).AudioBuffer = makeTagged("AudioBuffer");
(globalThis as any).AudioWorklet = makeTagged("AudioWorklet");
(globalThis as any).MediaRecorder = makeTagged("MediaRecorder");

// ---- Workers ----
(globalThis as any).Worker = makeTagged("Worker");
(globalThis as any).SharedWorker = makeTagged("SharedWorker");
(globalThis as any).ServiceWorker = makeTagged("ServiceWorker");

// WorkerGlobalScope mock (for self)
if (typeof self === "undefined" || (self as any) === globalThis) {
  (globalThis as any).self = { [Symbol.toStringTag]: "WorkerGlobalScope" };
}

// ---- WebAssembly minimal module ----
(globalThis as any).minimalWasm = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00
]);

// ---- StructuredCloneError ----
(globalThis as any).StructuredCloneError = class StructuredCloneError extends (
  Error
) {
  static [Symbol.toStringTag] = "StructuredCloneError";
  [Symbol.toStringTag] = "StructuredCloneError";
};

// ---- WeakMap.keys() safe mock ----
(WeakMap.prototype as any).keys = function () {
  return {
    [Symbol.toStringTag]: "WeakMap Iterator",
    next: () => ({ done: true })
  };
};

// ---- EventSource mock ----
if (typeof globalThis.EventSource === "undefined") {
  class EventSourceMock {
    static [Symbol.toStringTag] = "EventSource";
    [Symbol.toStringTag] = "EventSource";
    constructor(url: string) {
      (this as any).url = url;
    }
  }
  globalThis.EventSource = EventSourceMock as any;
}

if (typeof globalThis.WebSocket === "undefined") {
  class WebSocketMock {
    static [Symbol.toStringTag] = "WebSocket";
    [Symbol.toStringTag] = "WebSocket";
    constructor(url: string) {
      (this as any).url = url;
    }
  }
  globalThis.WebSocket = WebSocketMock as any;
}
