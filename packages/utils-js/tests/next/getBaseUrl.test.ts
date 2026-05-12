import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getBaseUrl } from "@/next/getBaseUrl";

const originalEnv = process.env;

describe("getBaseUrl", () => {
  beforeEach(() => {
    process.env = { ...originalEnv }; // Clone
  });

  afterEach(() => {
    process.env = originalEnv; // Restore
  });

  it("should use NEXT_PUBLIC_BASE_URL directly if set with port", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://myapp.com:4000";
    expect(getBaseUrl()).toBe("https://myapp.com:4000");
  });

  it("should append NEXT_PUBLIC_PORT_FE if NEXT_PUBLIC_BASE_URL has no port", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://myapp.com";
    process.env.NEXT_PUBLIC_PORT_FE = "5000";
    expect(getBaseUrl()).toBe("https://myapp.com:5000");
  });

  it("should default to localhost:3000 if NEXT_PUBLIC_BASE_URL is not set", () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });

  it("should append port from NEXT_PUBLIC_PORT_FE on default localhost", () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    process.env.NEXT_PUBLIC_PORT_FE = "8080";
    expect(getBaseUrl()).toBe("http://localhost:8080");
  });

  it("should normalize by removing trailing slashes", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://myapp.com/";
    process.env.NEXT_PUBLIC_PORT_FE = ":6000";
    expect(getBaseUrl()).toBe("https://myapp.com:6000");
  });

  it("should throw error for malformed URL", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "not a url";
    expect(() => getBaseUrl()).toThrow(
      "Invalid `NEXT_PUBLIC_BASE_URL`, failed to generate from `getBaseUrl()`"
    );
  });
});
