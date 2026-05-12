import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getBeApiUrl } from "@/next/getBeApiUrl";

const originalEnv = process.env;

describe("getBeApiUrl", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should use NEXT_PUBLIC_BACKEND_API_URL directly if set with port", () => {
    process.env.NEXT_PUBLIC_BACKEND_API_URL = "https://api.example.com:4000";
    expect(getBeApiUrl()).toBe("https://api.example.com:4000/");
  });

  it("should append NEXT_PUBLIC_PORT_BE if BACKEND_API_URL has no port", () => {
    process.env.NEXT_PUBLIC_BACKEND_API_URL = "https://api.example.com";
    process.env.NEXT_PUBLIC_PORT_BE = "5000";
    expect(getBeApiUrl()).toBe("https://api.example.com:5000/");
  });

  it("should default to http://localhost:8000 if BACKEND_API_URL is not set", () => {
    delete process.env.NEXT_PUBLIC_BACKEND_API_URL;
    expect(getBeApiUrl()).toBe("http://localhost:8000/");
  });

  it("should append port from NEXT_PUBLIC_PORT_BE on default localhost", () => {
    delete process.env.NEXT_PUBLIC_BACKEND_API_URL;
    process.env.NEXT_PUBLIC_PORT_BE = "8080";
    expect(getBeApiUrl()).toBe("http://localhost:8080/");
  });

  it("should normalize and remove trailing slashes from suffix", () => {
    process.env.NEXT_PUBLIC_BACKEND_API_URL = "https://api.example.com/";
    expect(getBeApiUrl({ suffix: "/api///" })).toBe(
      "https://api.example.com/api"
    );
  });

  it("should handle suffix without leading slash", () => {
    process.env.NEXT_PUBLIC_BACKEND_API_URL = "https://api.example.com";
    expect(getBeApiUrl({ suffix: "api" })).toBe("https://api.example.com/api");
  });

  it("should fallback to just `/` if suffix is empty string", () => {
    process.env.NEXT_PUBLIC_BACKEND_API_URL = "https://api.example.com";
    expect(getBeApiUrl({ suffix: "" })).toBe("https://api.example.com/");
  });

  it("should throw error for non-string suffix", () => {
    // @ts-expect-error testing type safety
    expect(() => getBeApiUrl({ suffix: 123 })).toThrow(
      "Parameter `suffix` property of the first parameter must be of type `string`, but received: `number`."
    );
  });

  it("should throw error for malformed BACKEND_API_URL", () => {
    process.env.NEXT_PUBLIC_BACKEND_API_URL = "not a url";
    expect(() => getBeApiUrl()).toThrow(
      "Invalid `NEXT_PUBLIC_BACKEND_API_URL`, failed to generate from `getBeApiUrl()`"
    );
  });
});
