import { describe, it, expect } from "vitest";
import { formatPhoneNumber } from "@/formatters/phones/formatPhoneNumber";

describe("formatPhoneNumber", () => {
  it("should format to default phone string", () => {
    expect(formatPhoneNumber("+6281234567890")).toBe("+62 812 3456 7890");
    expect(formatPhoneNumber("6281234567890")).toBe("");
  });

  it("should take only numbers", () => {
    expect(
      formatPhoneNumber("(0812) 3456-7890", {
        takeNumberOnly: true,
        defaultCountry: "ID"
      })
    ).toBe("081234567890");
    expect(
      formatPhoneNumber("+1 (800) 555-0123", { takeNumberOnly: true })
    ).toBe("8005550123");
    expect(
      formatPhoneNumber("(63) 4567-8901", {
        takeNumberOnly: true,
        defaultCountry: "PH"
      })
    ).toBe("");
    expect(
      formatPhoneNumber("(63) 917 123 4567", { takeNumberOnly: true })
    ).toBe("");
    expect(
      formatPhoneNumber("(63) 917 123 4567", {
        takeNumberOnly: true,
        defaultCountry: "PH"
      })
    ).toBe("09171234567");
  });

  it("should validate as true for valid phone", () => {
    expect(
      formatPhoneNumber("(0812) 3456-7890", {
        checkValidOnly: true,
        defaultCountry: "ID"
      })
    ).toBe(true);
  });

  it("should validate as true for valid phone", () => {
    expect(formatPhoneNumber("+6281234567890", { checkValidOnly: true })).toBe(
      true
    );
  });
  describe("formatPhoneNumber checkValidOnly", () => {
    it("should accept international format with plus", () => {
      expect(
        formatPhoneNumber("+6281234567890", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("+1 (800) 555-0123", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("+44 20 7946 0958", { checkValidOnly: true })
      ).toBe(true);
    });

    it("should accept local format without plus", () => {
      expect(
        formatPhoneNumber("0812-3456-7890", {
          checkValidOnly: true,
          defaultCountry: "ID"
        })
      ).toBe(true);
      expect(
        formatPhoneNumber("(0812) 3456 7890", {
          checkValidOnly: true,
          defaultCountry: "ID"
        })
      ).toBe(true);
      expect(
        formatPhoneNumber("0812 3456 7890", {
          checkValidOnly: true,
          defaultCountry: "ID"
        })
      ).toBe(true);
    });

    it("should reject string with letters", () => {
      expect(formatPhoneNumber("+62abc123", { checkValidOnly: true })).toBe(
        false
      );
      expect(
        formatPhoneNumber("0812-3456-hello", { checkValidOnly: true })
      ).toBe(false);
    });

    it("should reject if too long", () => {
      expect(
        formatPhoneNumber("+62 123456789012345678901234", {
          checkValidOnly: true
        })
      ).toBe(false);
      expect(
        formatPhoneNumber("+62 123456789012345", {
          checkValidOnly: true
        })
      ).toBe(false);
    });

    it("should reject multiple plus signs", () => {
      expect(
        formatPhoneNumber("++6281234567890", { checkValidOnly: true })
      ).toBe(false);
    });

    it("should accept slightly unusual separators", () => {
      expect(
        formatPhoneNumber("+62.812.3456.7890", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("+62(812)3456-7890", { checkValidOnly: true })
      ).toBe(true);
    });
  });

  it("should validate as false for invalid phone", () => {
    expect(formatPhoneNumber("invalid@@@", { checkValidOnly: true })).toBe(
      false
    );
  });

  it("should return throws", () => {
    expect(() =>
      formatPhoneNumber("invalid@@@", {
        // @ts-expect-error Invalid type props for test only
        prependPlusCountryCode: "+"
      })
    ).toThrow(TypeError);
    expect(() =>
      formatPhoneNumber("invalid@@@", {
        // @ts-expect-error Invalid type props for test only
        outputFormat: "+"
      })
    ).toThrow(TypeError);
    expect(() =>
      formatPhoneNumber("invalid@@@", {
        // @ts-expect-error Invalid type props for test only
        defaultCountry: "+"
      })
    ).toThrow(TypeError);

    expect(() =>
      formatPhoneNumber("invalid@@@", {
        // @ts-expect-error Invalid type props for test only
        checkValidOnly: 1
      })
    ).toThrow(TypeError);

    expect(() =>
      formatPhoneNumber("invalid@@@", {
        // @ts-expect-error Invalid type props for test only
        separator: 1
      })
    ).toThrow(TypeError);
  });

  it("should allow customization of separator and country format", () => {
    expect(
      formatPhoneNumber("(151) 2345-6789", {
        separator: "-",
        defaultCountry: "DE",
        openingNumberCountry: "(",
        closingNumberCountry: ")"
      })
    ).toBe("(+49) 1512-3456789");

    expect(
      formatPhoneNumber("081234567890", {
        separator: "-",
        defaultCountry: "ID",
        prependPlusCountryCode: false,
        openingNumberCountry: "(",
        closingNumberCountry: ")"
      })
    ).toBe("(62) 812-3456-7890");

    expect(
      formatPhoneNumber("09171234567", {
        defaultCountry: "PH",
        prependPlusCountryCode: false
      })
    ).toBe("63 917 123 4567");
  });
});

describe("formatPhoneNumber – checkValidOnly option", () => {
  describe("accepts many valid international numbers", () => {
    it("accepts many valid international numbers: 1-digit country codes", () => {
      // Bermuda
      expect(formatPhoneNumber("+14417079876", { checkValidOnly: true })).toBe(
        true
      );
      // Guam
      expect(formatPhoneNumber("+16505550123", { checkValidOnly: true })).toBe(
        true
      );
      // Virgin Islands (US)
      expect(formatPhoneNumber("+17875550123", { checkValidOnly: true })).toBe(
        true
      );
      // Bahamas
      expect(formatPhoneNumber("+12424279876", { checkValidOnly: true })).toBe(
        true
      );
      // USA
      expect(formatPhoneNumber("+12025550123", { checkValidOnly: true })).toBe(
        true
      );
    });

    it("accepts many valid international numbers: 2-digit country codes", () => {
      // United Kingdom
      expect(formatPhoneNumber("+441234567890", { checkValidOnly: true })).toBe(
        true
      );
      // France
      expect(formatPhoneNumber("+33123456789", { checkValidOnly: true })).toBe(
        true
      );
      // Italy
      expect(formatPhoneNumber("+393471234567", { checkValidOnly: true })).toBe(
        true
      );
      // Germany
      expect(
        formatPhoneNumber("+4915123456789", { checkValidOnly: true })
      ).toBe(true);
      // Mexico
      expect(
        formatPhoneNumber("+525512345678 ", { checkValidOnly: true })
      ).toBe(true);
      // Australia
      expect(
        formatPhoneNumber("+61412 345 678", { checkValidOnly: true })
      ).toBe(true);
      // South Korea
      expect(formatPhoneNumber("+821012345678", { checkValidOnly: true })).toBe(
        true
      );
      // Brazil
      expect(
        formatPhoneNumber("+5511987654321", { checkValidOnly: true })
      ).toBe(true);
      // South Africa
      expect(formatPhoneNumber("+27123456789", { checkValidOnly: true })).toBe(
        true
      );
      // Spain
      expect(
        formatPhoneNumber("+34612 345 678", { checkValidOnly: true })
      ).toBe(true);
      // Indonesia
      expect(formatPhoneNumber("+628234567890", { checkValidOnly: true })).toBe(
        true
      );
      // Singapore
      expect(formatPhoneNumber("+65 6123 4567", { checkValidOnly: true })).toBe(
        true
      );
    });

    it("accepts many valid international numbers: 3-digit country codes", () => {
      // Samoa
      expect(formatPhoneNumber("+6857212345", { checkValidOnly: true })).toBe(
        true
      );
      // Tonga
      expect(formatPhoneNumber("+6767012345", { checkValidOnly: true })).toBe(
        true
      );
      // French Polynesia
      expect(formatPhoneNumber("+68987123456", { checkValidOnly: true })).toBe(
        true
      );
      // Fiji
      expect(formatPhoneNumber("+6797012345", { checkValidOnly: true })).toBe(
        true
      );
      // Jordan
      expect(formatPhoneNumber("+962790123456", { checkValidOnly: true })).toBe(
        true
      );
      // Iraq
      expect(
        formatPhoneNumber("+9647701234567", { checkValidOnly: true })
      ).toBe(true);
      // Oman
      expect(formatPhoneNumber("+96890123456", { checkValidOnly: true })).toBe(
        true
      );
      // Qatar
      expect(formatPhoneNumber("+97450123456", { checkValidOnly: true })).toBe(
        true
      );
      // Hong Kong
      expect(formatPhoneNumber("+85251234567", { checkValidOnly: true })).toBe(
        true
      );
      // Brunei
      expect(formatPhoneNumber("+6737123456", { checkValidOnly: true })).toBe(
        true
      );
      // Macau
      expect(formatPhoneNumber("+85362123456", { checkValidOnly: true })).toBe(
        true
      );
      // Cambodia
      expect(formatPhoneNumber("+85512345678", { checkValidOnly: true })).toBe(
        true
      );
      // Laos
      expect(
        formatPhoneNumber("+8562099123456", { checkValidOnly: true })
      ).toBe(true);
      // UAE
      expect(formatPhoneNumber("+971501234567", { checkValidOnly: true })).toBe(
        true
      );
      // Israel
      expect(formatPhoneNumber("+972529876543", { checkValidOnly: true })).toBe(
        true
      );
      // Ukraine
      expect(formatPhoneNumber("+380501234567", { checkValidOnly: true })).toBe(
        true
      );
      // Uzbekistan
      expect(formatPhoneNumber("+998901234567", { checkValidOnly: true })).toBe(
        true
      );
      // Maldives
      expect(formatPhoneNumber("+9607712345", { checkValidOnly: true })).toBe(
        true
      );
    });
  });

  describe("accepts slightly unusual separators across countries", () => {
    it("accepts slightly unusual separators across countries Indonesian", () => {
      expect(
        formatPhoneNumber("+62.812.3456.7890", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Indonesian, parentheses + dash", () => {
      expect(
        formatPhoneNumber("+62(812)3456-7890", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries US, spaces", () => {
      expect(
        formatPhoneNumber("+1 415 555 2671", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries UK, parentheses + dash", () => {
      expect(
        formatPhoneNumber("+44 (7911) 123-456", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Brazil, dashes", () => {
      expect(
        formatPhoneNumber("+55-11-98765-4321", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Japan, parentheses + dash", () => {
      expect(
        formatPhoneNumber("+81(3)1234-5678", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries France, spaces", () => {
      expect(
        formatPhoneNumber("+33 1 23 45 67 89", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Australia, dashes", () => {
      expect(
        formatPhoneNumber("+61-4-1234-5678", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Germany, parentheses + spaces", () => {
      expect(
        formatPhoneNumber("+49 (151) 2345 6789", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries UAE, dashes", () => {
      expect(
        formatPhoneNumber("+971-50-123-4567", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Ukraine, mixed", () => {
      expect(
        formatPhoneNumber("+380 (50) 123 45 67", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Hong Kong, spaces", () => {
      expect(
        formatPhoneNumber("+852 5123 4567", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Jordan, dashes", () => {
      expect(
        formatPhoneNumber("+962-79-012-3456", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Iraq, parentheses + dash", () => {
      expect(
        formatPhoneNumber("+964 (770) 123-4567", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Brunei, spaces", () => {
      expect(
        formatPhoneNumber("+673 7 123 456", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Laos, dashes", () => {
      expect(
        formatPhoneNumber("+856 20 99 123 456", { checkValidOnly: true })
      ).toBe(true);
    });
    it("accepts slightly unusual separators across countries Samoa, spaces", () => {
      expect(formatPhoneNumber("+685 721 2345", { checkValidOnly: true })).toBe(
        true
      );
    });
  });

  it("rejects numbers exceeding 15 digits", () => {
    // 16 total digits (not allowed by E.164)
    expect(
      formatPhoneNumber("+9991234567890123", { checkValidOnly: true })
    ).toBe(false);
  });

  it("rejects invalid characters or missing country code", () => {
    expect(formatPhoneNumber("+44-79AB-123456", { checkValidOnly: true })).toBe(
      false
    ); // letters
    expect(formatPhoneNumber("+62_8123*5678", { checkValidOnly: true })).toBe(
      false
    ); // symbols
    expect(formatPhoneNumber("+33/12/34/56/78", { checkValidOnly: true })).toBe(
      false
    ); // slashes
  });
});
