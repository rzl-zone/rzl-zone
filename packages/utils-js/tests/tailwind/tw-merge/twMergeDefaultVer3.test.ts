import type { Config } from "tailwindcss";
import { describe, it, expect } from "vitest";
import { twMergeDefaultV3 } from "@/tailwind/tw-merge/v3/twMergeDefault";

describe("twMergeDefaultV3", () => {
  it("should return a function", () => {
    const twMerge = twMergeDefaultV3();
    expect(typeof twMerge).toBe("function");
  });

  it("should merge basic Tailwind classes", () => {
    const twMerge = twMergeDefaultV3();
    const result = twMerge("p-2 p-4");
    expect(result).toBe("p-4");
  });

  it("should extend class groups", () => {
    const twMerge = twMergeDefaultV3({
      extend: {
        classGroups: {
          shadow: ["shadow-soft", "shadow-hard"]
        }
      }
    });
    const result = twMerge("shadow-soft shadow-hard");
    expect(result).toBe("shadow-hard");
  });

  it("should respect custom Tailwind config fontSize", () => {
    const customConfig: Config = {
      theme: {
        extend: {
          fontSize: {
            xxs: "0.5rem",
            xxl: "2rem"
          }
        }
      }
    };
    const twMerge = twMergeDefaultV3({ config: customConfig });
    const result = twMerge("text-base text-xxs text-xxl");
    expect(result).toBe("text-xxl");
  });

  it("should accept optional parameters like prefix, cacheSize, experimentalParseClassName", () => {
    const twMerge = twMergeDefaultV3({
      prefix: "tw-",
      cacheSize: 500,
      experimentalParseClassName: ({ className }) => ({
        baseClassName: className,
        modifiers: [],
        hasImportantModifier: false,
        maybePostfixModifierPosition: undefined
      })
    });

    const result = twMerge("p-2 p-4");
    expect(result).toBe("p-4");
  });

  it("should include default extended text-shadow classes", () => {
    const twMerge = twMergeDefaultV3();
    const result = twMerge("text-shadow text-shadow-lg");
    expect(result).toBe("text-shadow-lg");
  });

  it("should respect order-sensitive modifiers when extended", () => {
    const twMerge = twMergeDefaultV3({
      extend: {
        orderSensitiveModifiers: ["hover"]
      }
    });
    const result = twMerge("hover:p-2 p-4");
    expect(result).toBe("hover:p-2 p-4");
  });

  it("should respect prefix option", () => {
    const twMerge = twMergeDefaultV3({
      prefix: "tw-",
      extend: {
        classGroups: {
          p: ["p-0", "p-1", "p-2", "p-4", "p-8"]
        },
        conflictingClassGroups: {
          p: ["p-0", "p-1", "p-2", "p-4", "p-8"]
        }
      }
    });

    const result = twMerge("tw-:p-2 tw-:p-4");
    expect(result).toBe("tw-:p-4");
  });
});
