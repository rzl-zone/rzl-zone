import { describe, it, expect } from "vitest";
import { cnV3 } from "@/tailwind/class-names/cn";

describe("cnV3 (default cnV3 with twMergeDefault)", () => {
  it("should merge basic Tailwind classes", () => {
    const result = cnV3("p-2 p-4");
    expect(result).toBe("p-4");
  });

  it("should merge cx arrays", () => {
    const result = cnV3(["p-2", "p-4"], ["m-1", "m-3"]);
    expect(result).toBe("p-4 m-3");
  });

  it("should merge cx objects", () => {
    const result = cnV3(
      { "text-red-500": true, "text-blue-500": false },
      "text-green-500"
    );
    expect(result).toBe("text-green-500");
  });

  it("should merge nested arrays and falsy values", () => {
    const result = cnV3(["p-2", ["p-4", undefined]], null, false, "p-6");
    expect(result).toBe("p-6");
  });

  it("should include default extended text-shadow classes", () => {
    const result = cnV3("text-shadow text-shadow-lg");
    expect(result).toBe("text-shadow-lg");
  });
});
