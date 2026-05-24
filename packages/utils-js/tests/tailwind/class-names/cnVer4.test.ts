import { describe, it, expect } from "vitest";
import { cnVer4 } from "@/tailwind/class-names/cn";

describe("cnVer4 (default)", () => {
  it("should merge basic Tailwind classes", () => {
    const result = cnVer4("p-2 p-4");
    expect(result).toBe("p-4");
  });

  it("should merge cx arrays", () => {
    const result = cnVer4(["p-2", "p-4"], ["m-1", "m-3"]);
    expect(result).toBe("p-4 m-3");
  });

  it("should merge cx objects", () => {
    const result = cnVer4(
      { "text-red-500": true, "text-blue-500": false },
      "text-green-500"
    );
    expect(result).toBe("text-green-500");
  });

  it("should merge nested arrays and falsy values", () => {
    const result = cnVer4(["p-2", ["p-4", undefined]], null, false, "p-6");
    expect(result).toBe("p-6");
  });
});
