// tests/next/createBeApiUrl.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBeApiUrl } from "@/next/createBeApiUrl";

// Mock dependencies
import * as getBeApiUrlModule from "@/next/getBeApiUrl";
import * as urlModule from "@/urls/pathname/normalizePathname";

describe("createBeApiUrl", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return full API URL with default prefix", () => {
    // vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
    //   "http://localhost:8000/v1"
    // );
    // vi.spyOn(urlModule, "normalizePathname").mockImplementation(
    //   (p) => p?.toString() || ""
    // );

    const result = createBeApiUrl("/users", { prefix: "v1" });
    expect(result).toBe("http://localhost:8000/v1/users");
  });

  it("should return API URL without origin when withOrigin=false", () => {
    const result = createBeApiUrl("///users", { withOrigin: false });
    expect(result).toBe("/api/users");
  });

  it("should return API URL without origin when withOrigin=false", () => {
    const result = createBeApiUrl("///v22//users//test//", {
      withOrigin: false,
      prefix: "v2"
    });
    expect(result).toBe("/v2/v22/users/test");

    expect(
      createBeApiUrl("///v2//users//test//", {
        withOrigin: false,
        prefix: "be"
      })
    ).toBe("/be/v2/users/test");
  });

  it("should handle custom prefix", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/v1"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString() || ""
    );

    const result = createBeApiUrl("/v1/posts", { prefix: "/v1" });
    expect(result).toBe("http://localhost:8000/v1/posts");
  });

  it("should remove duplicate prefix from pathname", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString() || ""
    );

    const result = createBeApiUrl("/api/posts", { prefix: "/api" });
    expect(result).toBe("http://localhost:8000/api/posts");
  });

  it("should trim trailing slashes", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api/"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString() || ""
    );

    const result = createBeApiUrl("/posts/");
    expect(result).toBe("http://localhost:8000/api/posts");
  });

  it("should throw TypeError for non-string pathname", () => {
    // @ts-expect-error intentionally wrong
    expect(() => createBeApiUrl(123)).toThrow(
      "First parameter (`pathname`) must be of type `string`, but received: `number`."
    );
  });

  it("should throw TypeError for non-string prefix", () => {
    // @ts-expect-error intentionally wrong
    expect(() => createBeApiUrl("/users", { prefix: 123 })).toThrow(
      "Parameter `prefix` property of the `options` (second parameter) must be of type `string`, but received: `number`."
    );
  });

  it("should throw TypeError for non-boolean withOrigin", () => {
    expect(() =>
      // @ts-expect-error intentionally wrong
      createBeApiUrl("/users", { withOrigin: "yes" })
    ).toThrow(
      "Parameter `withOrigin` property of the `options` (second parameter) must be of type `boolean`, but received: `string`."
    );
  });

  it("should use default prefix when empty prefix passed", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString() || ""
    );

    const result = createBeApiUrl("/users", { prefix: "" });
    expect(result).toBe("http://localhost:8000/api/users");
  });

  it("should return base URL only when pathname is empty", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString() || ""
    );

    const result = createBeApiUrl("");
    expect(result).toBe("http://localhost:8000/api");
  });

  it("should collapse multiple slashes in pathname and prefix", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api/"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString().replace(/\/+/g, "/") || ""
    );

    const result = createBeApiUrl("//posts//", { prefix: "//api//" });
    expect(result).toBe("http://localhost:8000/api/posts");
  });

  it("should handle pathname with duplicate prefix even if malformed", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api/"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString().replace(/\/+/g, "/") || ""
    );

    const result = createBeApiUrl("/api////users", { prefix: "/api" });
    expect(result).toBe("http://localhost:8000/api/users");
  });

  it("should return just prefix if pathname is root-slash", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString().replace(/\/+/g, "/") || ""
    );

    const result = createBeApiUrl("/", { prefix: "/api" });
    expect(result).toBe("http://localhost:8000/api");
  });

  it("should handle full URL prefix with trailing slash", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/v1/"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString().replace(/\/+/g, "/") || ""
    );

    const result = createBeApiUrl("/v1/posts", { prefix: "/v1/" });
    expect(result).toBe("http://localhost:8000/v1/posts");
  });

  it("should work correctly if pathname equals prefix", () => {
    vi.spyOn(getBeApiUrlModule, "getBeApiUrl").mockReturnValue(
      "http://localhost:8000/api"
    );
    vi.spyOn(urlModule, "normalizePathname").mockImplementation(
      (p) => p?.toString().replace(/\/+/g, "/") || ""
    );

    const result = createBeApiUrl("/api", { prefix: "/api" });
    expect(result).toBe("http://localhost:8000/api");
  });
});
