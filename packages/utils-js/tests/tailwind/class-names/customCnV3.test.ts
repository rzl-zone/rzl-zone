import { describe, it, expect } from "vitest";
import { customCnV3 } from "@/tailwind/class-names/customCn";
import { twMergeDefaultV2 } from "@/tailwind/tw-merge/v2/twMergeDefault";

describe("customCn with twMergeDefaultV2", () => {
  const twMerge = twMergeDefaultV2();

  it("should merge basic Tailwind classes", () => {
    const result = customCnV3(twMerge, "p-2 p-4");
    expect(result).toBe("p-4");
  });

  it("should merge extended class groups", () => {
    const twMergeExtended = twMergeDefaultV2({
      extend: {
        classGroups: {
          shadow: ["shadow-soft", "shadow-hard"]
        }
      }
    });
    const result = customCnV3(twMergeExtended, "shadow-soft shadow-hard");
    expect(result).toBe("shadow-hard");
  });

  it("should respect custom Tailwind config fontSize", () => {
    const customConfig = {
      theme: {
        extend: {
          fontSize: {
            xxs: "0.5rem",
            xxl: "2rem"
          }
        }
      }
    };
    const twMergeWithConfig = twMergeDefaultV2({ config: customConfig });
    const result = customCnV3(twMergeWithConfig, "text-base text-xxs text-xxl");
    expect(result).toBe("text-xxl");
  });

  it("should include default extended text-shadow classes", () => {
    const result = customCnV3(twMerge, "text-shadow text-shadow-lg");
    expect(result).toBe("text-shadow-lg");
  });

  it("should handle cx array/object/falsy values", () => {
    const result = customCnV3(
      twMerge,
      ["p-2", "p-4"],
      { hidden: false, "text-bold": true },
      undefined
    );
    expect(result).toBe("p-4 text-bold");
  });
});
