import { describe, it, expect } from "vitest";
import { customCnV4 } from "@/tailwind/class-names/customCn";
import { twMergeDefaultV4 } from "@/tailwind/tw-merge/v4/twMergeDefault";

describe("customCn with twMergeDefaultV4", () => {
  const twMerge = twMergeDefaultV4();

  it("should merge basic Tailwind classes", () => {
    const result = customCnV4(twMerge, "p-2 p-4");
    expect(result).toBe("p-4");
  });

  it("should merge extended class groups", () => {
    const twMergeExtended = twMergeDefaultV4({
      extend: {
        classGroups: {
          shadow: ["shadow-soft", "shadow-hard"]
        }
      }
    });
    const result = customCnV4(twMergeExtended, "shadow-soft shadow-hard");
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
    const twMergeWithConfig = twMergeDefaultV4({ config: customConfig });
    const result = customCnV4(twMergeWithConfig, "text-base text-xxs text-xxl");
    expect(result).toBe("text-xxl");
  });

  it("should include default extended text-shadow classes", () => {
    const result = customCnV4(twMerge, "text-shadow text-shadow-lg");
    expect(result).toBe("text-shadow-lg");
  });

  it("should handle cx array/object/falsy values", () => {
    const result = customCnV4(
      twMerge,
      ["p-2", "p-4"],
      { hidden: false, "text-bold": true },
      undefined
    );
    expect(result).toBe("p-4 text-bold");
  });
});
