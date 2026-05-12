/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */
import { describe, it, expect } from "vitest";
import {
  type ExtractRouteParams,
  type HasDynamicSegments,
  generateRoute
} from "@/next/generateRoute";

const notAllowedTextError = `These characters are not allowed because they could cause issues in URL structure. The following characters are forbidden in route parameters: (\`?\`, \`&\`, \`#\`, \`=\`, \`/\`, \`'\`, \`"\`, \`(\`, \`)\`, \`+\`, \`;\`, \`%\`, \`@\`, \`:\`, \`white-space(s)\`).`;

describe("generateRoute", () => {
  it("should replace dynamic segments correctly", () => {
    const result = generateRoute("/user/[id]/[name]", {
      id: "123",
      // test: 123
      name: "john"
    });
    expect(result).toBe("/user/123/john");
  });

  it("should replace multiple dynamic segments", () => {
    const result = generateRoute("/post/[category]/[slug]", {
      category: "tech",
      slug: "new-laptop"
    });
    expect(result).toBe("/post/tech/new-laptop");
  });

  it("should handle leading/trailing slashes in param values", () => {
    expect(() =>
      generateRoute("/blog/[category]/[slug]", {
        category: "/news",
        slug: "/latest-update/test/"
      })
    ).toThrow(
      `❌ 'generateRoute' Failed cause in route "/blog/[category]/[slug]":\n- Parameter "category" contains invalid characters (\`/\`). ${notAllowedTextError}\n- Parameter "slug" contains invalid characters (\`/\`). ${notAllowedTextError}`
    );
  });

  it("should throw error if contain slash", () => {
    expect(() =>
      generateRoute("/files/[folder]/[file]", {
        folder: "/docs//",
        file: "///readme//test//"
      })
    ).toThrow(
      `❌ 'generateRoute' Failed cause in route "/files/[folder]/[file]":\n- Parameter "folder" contains invalid characters (\`/\`). ${notAllowedTextError}\n- Parameter "file" contains invalid characters (\`/\`). ${notAllowedTextError}`
    );
  });

  it("should return static route unchanged if no dynamic segments", () => {
    expect(generateRoute("/dashboard")).toBe("/dashboard");
  });

  it("should throw error if param missing", () => {
    // @ts-expect-error Invalid type props for test only
    expect(() => generateRoute("/profile/[username]", {})).toThrow(
      `❌ 'generateRoute' Failed cause in route "/profile/[username]":\n- Invalid parameter: "username" must be of type \`string\`, but received: \`undefined\`.`
    );
  });

  it("should throw error if param value is empty", () => {
    expect(() =>
      generateRoute("/post/[category]/[slug]", { category: "", slug: "" })
    ).toThrow(
      `❌ 'generateRoute' Failed cause in route "/post/[category]/[slug]":\n- Parameter "category" cannot be empty string.\n- Parameter "slug" cannot be empty string.`
    );
  });

  it("should throw error for invalid characters in param", () => {
    expect(() =>
      generateRoute("/search/[query]", { query: "h?o`w  to?learn:" })
    ).toThrow(
      `❌ 'generateRoute' Failed cause in route "/search/[query]":\n- Parameter "query" contains invalid characters (\`?\`, \`:\`, \`white-space(s)\`). ${notAllowedTextError}`
    );
  });

  it("should throw error if route is not string", () => {
    expect(() => generateRoute([])).toThrow(/Invalid 'route'/);
  });

  it("should throw error if params is not object", () => {
    expect(() => generateRoute("/user/[id]", undefined as any)).toThrow(
      /Missing or invalid parameters `plain-object`/
    );
    expect(() => generateRoute("/user/[id]", [] as any)).toThrow(
      /Missing or invalid parameters `plain-object`/
    );
  });

  it("should handle case with dynamic segments but missing params entirely", () => {
    expect(() => (generateRoute as any)("/user/[id]")).toThrow(
      /Missing or invalid parameters `plain-object`/
    );
  });

  it("should allow route with no dynamic segments and missing params", () => {
    expect(generateRoute("/about")).toBe("/about");
  });

  it("should enforce HasDynamicSegments type - TS only", () => {
    // purely compile-time, no runtime test
    type _Case1 = HasDynamicSegments<"/user/[id]">; // true
    type _Case2 = HasDynamicSegments<"/settings">; // false
    type _Case3 = ExtractRouteParams<"/post/[slug]/comment/[id]">;
    // Expect: { slug: string; id: string }
    const params: _Case3 = { slug: "a", id: "b" };
    expect(params).toEqual({ slug: "a", id: "b" });
  });
});
