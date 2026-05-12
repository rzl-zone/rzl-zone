/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment node

import { describe, it, expect } from "vitest";
import { isServer } from "@/predicates/is/isServer";

describe("isServer", () => {
  it("should return true if window is undefined (server-side)", () => {
    expect(isServer()).toBe(true);
  });

  it("should return false if window and document are defined (client-side)", () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;

    globalThis.window = {} as Window & typeof globalThis;
    globalThis.document = {} as Document;

    expect(isServer()).toBe(false);

    // Cleanup
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalDocument === undefined) {
      delete (globalThis as any).document;
    } else {
      globalThis.document = originalDocument;
    }
  });
});
