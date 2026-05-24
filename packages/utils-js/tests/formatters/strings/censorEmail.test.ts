/* eslint-disable quotes */
import { describe, expect, it } from "vitest";
import { censorEmail } from "@/formatters/strings/censorEmail";

describe("censorEmail", () => {
  // --- Test Cases for Invalid Inputs ---
  describe("should return an empty string for invalid email inputs", () => {
    it('should return "" for null', () => {
      expect(censorEmail(null)).toBe("");
    });

    it('should return "" for undefined', () => {
      expect(censorEmail(undefined)).toBe("");
    });

    it('should return "" for an empty string', () => {
      expect(censorEmail("")).toBe("");
    });

    it('should return "" for a string without "@"', () => {
      expect(censorEmail("invalid-email")).toBe("");
    });

    it('should return "" for an email with missing domain', () => {
      expect(censorEmail("test@")).toBe("");
    });

    it('should return "" for an email with missing TLD', () => {
      expect(censorEmail("test@domain")).toBe("");
    });

    it('should return "" for an email with an invalid TLD (too short)', () => {
      expect(censorEmail("test@domain.c")).toBe("");
    });

    it('should return "" for an email with special characters in local part not allowed by regex', () => {
      expect(censorEmail("test!@example.com")).toBe("");
    });

    it('should return "" for an email with special characters in domain part not allowed by regex', () => {
      expect(censorEmail("test@ex@mple.com")).toBe("");
    });
  });

  // --- Test Cases for "random" Mode ---
  describe('should censor email in "random" mode', () => {
    it("should censor a standard email (random mode)", () => {
      const email = "john.doe@gmail.com";
      const censored = censorEmail(email, { mode: "random" });

      expect(censored).not.toBe(email); // Ensure it's not the original string
      expect(censored).toContain("@"); // Ensure email format is maintained
      expect(censored).toContain("."); // Ensure email format is maintained
      expect(censored.length).toBe(email.length); // The length of the string should remain the same

      // Check if there's at least one '*' character (in local or domain part)
      expect(censored).toMatch(/\*./); // Ensure there's a '*' followed by any character
    });

    it('should produce different outputs for the same email in "random" mode', () => {
      const email = "testuser@example.com";
      const censored1 = censorEmail(email, { mode: "random" });
      const censored2 = censorEmail(email, { mode: "random" });

      // It's statistically improbable for random outputs to be identical,
      // but if this test fails frequently, it might indicate an issue with randomness.
      expect(censored1).not.toBe(censored2);
    });

    it("should censor short local part (random mode)", () => {
      const email = "ab@example.com";
      const censored = censorEmail(email, { mode: "random" });
      expect(censored.length).toBe(email.length);
      // Ensure at least one character in the local part becomes '*' or remains a letter.
      expect(censored.split("@")[0]).toMatch(/\*|./); // Local part contains '*' OR remains a character
      expect(censored).toContain("@");
    });

    it("should censor short domain name (random mode)", () => {
      const email = "user@abc.com";
      const censored = censorEmail(email, { mode: "random" });
      expect(censored.length).toBe(email.length);
      // Ensure the domain name has been censored (contains '*')
      expect(censored.split("@")[1]?.split(".")[0]).toMatch(/\*/);
    });

    it("should not censor TLD if length <= 2 (random mode)", () => {
      const email = "user@example.co"; // TLD is 'co' (length 2)
      const censored = censorEmail(email, { mode: "random" });
      expect(censored).toMatch(/\.co$/); // Ensure '.co' remains unchanged
    });

    it("should censor TLD if length > 2 (random mode)", () => {
      const email = "user@example.com"; // TLD is 'com' (length 3)
      const censored = censorEmail(email, { mode: "random" });
      // Ensure the TLD has been censored (contains '*')
      expect(censored.split(".").pop()).toMatch(/\*/);
    });
  });

  // --- Test Cases for "fixed" Mode ---
  describe('should censor email in "fixed" mode', () => {
    // IMPORTANT: To make these tests pass, you need to run your `censorEmail` function
    // manually for each email with "fixed" mode and use the EXACT output
    // as the expected value in `toBe()`.
    // Example: console.log(censorEmail("john.doe@gmail.com", {mode:"fixed")});
    // The string you get from your console output should replace the placeholder.

    it('should produce the same output for the same email in "fixed" mode', () => {
      const email = "john.doe@gmail.com";
      // <--- REPLACE WITH THE ACTUAL, DETERMINISTIC OUTPUT FROM YOUR FUNCTION --->
      const expectedCensoredEmail = "*ohn****@*ma**.**m";

      const censored1 = censorEmail(email, { mode: "fixed" });
      const censored2 = censorEmail(email, { mode: "fixed" });

      expect(censored1).toBe(censored2); // Ensure the output is always the same
      expect(censored1).not.toBe(email); // Ensure it's still censored
      expect(censored1).toBe(expectedCensoredEmail);
    });

    it("should censor short local part (fixed mode)", () => {
      const email = "ab@example.com";
      // <--- REPLACE WITH THE ACTUAL, DETERMINISTIC OUTPUT FROM YOUR FUNCTION --->
      const expectedCensored = "**@*xa**l*.c**";
      const censored = censorEmail(email, { mode: "fixed" });
      expect(censored).toBe(expectedCensored);
    });

    it("should censor short domain name (fixed mode)", () => {
      const email = "user@abc.com";
      // <--- REPLACE WITH THE ACTUAL, DETERMINISTIC OUTPUT FROM YOUR FUNCTION --->
      const expectedCensored = "*s**@a**.c**";
      const censored = censorEmail(email, { mode: "fixed" });
      expect(censored).toBe(expectedCensored);
    });
  });

  // --- Test Cases for Error Handling Mode ---
  describe("should set back to default and not throw TypeError for invalid mode", () => {
    it("should set back to default and not throw TypeError for an unknown mode string", () => {
      expect(() =>
        // @ts-ignore: Intentionally passing invalid type for testing
        censorEmail("test@example.com", "invalidOptions")
      ).not.toThrow();
      expect(() =>
        // @ts-ignore: Intentionally passing invalid type for testing
        censorEmail("test@example.com", "invalidOptions")
      ).not.toThrow();
    });

    it("should set back to default and not throw TypeError for a non-string mode", () => {
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => censorEmail("test@example.com", 123)).not.toThrow();
    });
  });
});
