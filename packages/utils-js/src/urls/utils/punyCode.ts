/** ---------------------------------------------------------
 * * ***Constants for `Punycode-UtilsJS` algorithm.***
 * ---------------------------------------------------------
 * These constants are used internally for encoding and decoding.
 *
 * Unicode domain names to ASCII (`Punycode-UtilsJS`) and vice versa.
 */

import { getPreciseType } from "@/predicates/type/getPreciseType";
import { assertIsString } from "@/assertions/strings/assertIsString";

/**
 * Constant `maxInt` for validate.
 */
const maxInt = 2147483647;

/**
 * Bootstring parameters for `Punycode-UtilsJS`.
 */
const base = 36,
  tMin = 1,
  tMax = 26,
  skew = 38,
  damp = 700;

/**
 * Initial bias and code point.
 */
const initialBias = 72,
  initialN = 128,
  delimiter = "-";

/**
 * Regular expressions used internally.
 * Matches `Punycode-UtilsJS` prefix.
 */
const regexPunycode = /^xn--/;
/**
 * Regular expressions used internally.
 * Matches non-ASCII chars.
 */
const regexNonASCII = /[^\0-\x7F]/;
/**
 * Regular expressions used internally.
 * Matches domain label separators.
 */
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;

/**
 * Error messages used internally.
 */
const errors: Record<string, string> = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
};

/**
 * Aliases of `Math.floor`.
 */
const floor = Math.floor;
/** 
 * Aliases of `String.fromCharCode`.

*/
const stringFromCharCode = String.fromCharCode;

/** ---------------------------------------------------------
 * * ***Throws a RangeError with a predefined error message.***
 * ---------------------------------------------------------
 *
 * @param type - Key of the error type to throw.
 */
function error(type: keyof typeof errors): never {
  throw new RangeError(errors[type]);
}

/** ---------------------------------------------------------
 * * ***Maps an array using a callback function.***
 * ---------------------------------------------------------
 *
 * @param array - Array to transform.
 * @param fn - Function to apply to each element.
 * @returns Transformed array.
 */
function map<T, U>(array: T[], fn: (v: T) => U): U[] {
  const result: U[] = [];
  let length = array.length;
  while (length--) {
    if (array[length]) {
      result[length] = fn(array[length]!);
    }
  }
  return result;
}

/** ---------------------------------------------------------
 * * ***Maps a domain name using a callback on each label.***
 * ---------------------------------------------------------
 *
 * Handles email-like domains (local@domain).
 * @param domain - Domain string to process.
 * @param fn - Function applied to each domain label.
 * @returns Transformed domain string.
 */
function mapDomain(domain: string, fn: (v: string) => string): string {
  const parts = domain.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    if (parts[1]) domain = parts[1];
  }
  domain = domain.replace(regexSeparators, "\x2E");
  const labels = domain.split(".");
  return result + map(labels, fn).join(".");
}

/** ---------------------------------------------------------
 * * ***Converts a UCS-2 encoded string to an array of Unicode code points.***
 * ---------------------------------------------------------
 *
 * @param input - String to decode.
 * @returns Array of Unicode code points.
 */
function ucs2decode(input: string): number[] {
  assertIsString(input, {
    message: ({ currentType, validType }) =>
      `Utils \`punycodeUtilsJS.ucs2.decode\`, parameter \`input\` must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const output: number[] = [];
  let counter = 0;
  const length = input.length;
  while (counter < length) {
    const value = input.charCodeAt(counter++);
    if (value >= 0xd800 && value <= 0xdbff && counter < length) {
      const extra = input.charCodeAt(counter++);
      if ((extra & 0xfc00) === 0xdc00)
        output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
      else {
        output.push(value);
        counter--;
      }
    } else output.push(value);
  }
  return output;
}

/** ---------------------------------------------------------
 * * ***Encodes an array of Unicode code points to a string.***
 * ---------------------------------------------------------
 *
 * @param points - Array of Unicode code points.
 * @returns Encoded string.
 */
const ucs2encode = (points: number[]): string => {
  if (
    !Array.isArray(points) ||
    !points.every((p) => typeof p === "number" && Number.isFinite(p))
  ) {
    throw new TypeError(
      `Utils \`punycodeUtilsJS.ucs2.encode\`, parameter \`points\` must be an array of numbers, but received: \`${getPreciseType(
        points
      )}\`.`
    );
  }

  return String.fromCodePoint(...points);
};

/** ---------------------------------------------------------
 * * ***Converts a basic code point to its digit value for `Punycode-UtilsJS`.***
 * ---------------------------------------------------------
 *
 * @param codePoint - Unicode code point.
 * @returns Digit value.
 */
function basicToDigit(codePoint: number): number {
  if (codePoint >= 0x30 && codePoint < 0x3a) return 26 + (codePoint - 0x30);
  if (codePoint >= 0x41 && codePoint < 0x5b) return codePoint - 0x41;
  if (codePoint >= 0x61 && codePoint < 0x7b) return codePoint - 0x61;
  return base;
}

/** ---------------------------------------------------------
 * * ***Converts a digit to a basic code point for `Punycode-UtilsJS`.***
 * ---------------------------------------------------------
 *
 * @param digit - Numeric value.
 * @param flag - Bias flag (0 or 1).
 * @returns Code point.
 */
function digitToBasic(digit: number, flag: number): number {
  return digit + 22 + 75 * (digit < 26 ? 1 : 0) - Number(flag !== 0) * 32;
}

/** ---------------------------------------------------------
 * * ***Bias adaptation function for `Punycode-UtilsJS` encoding/decoding.***
 * ---------------------------------------------------------
 *
 * @param delta - Delta value.
 * @param numPoints - Number of code points.
 * @param firstTime - Indicates first adaptation.
 * @returns Adapted bias.
 */
function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  while (delta > ((base - tMin) * tMax) >> 1) {
    delta = floor(delta / (base - tMin));
    k += base;
  }
  return floor(k + ((base - tMin + 1) * delta) / (delta + skew));
}

/** ---------------------------------------------------------
 * * ***Decodes a `Punycode-UtilsJS` string to Unicode.***
 * ---------------------------------------------------------
 *
 * @param input - `Punycode-UtilsJS` string.
 * @returns Decoded Unicode string.
 */
function decode(input: string): string {
  assertIsString(input, {
    message: ({ currentType, validType }) =>
      `Utils \`punycodeUtilsJS.decode\`, parameter \`input\` must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const output: number[] = [];
  const inputLength = input.length;
  let i = 0,
    n = initialN,
    bias = initialBias;

  let basic = input.lastIndexOf(delimiter);
  if (basic < 0) basic = 0;

  for (let j = 0; j < basic; j++) {
    if (input.charCodeAt(j) >= 0x80) error("not-basic");
    output.push(input.charCodeAt(j));
  }

  for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
    const oldi = i;
    let w = 1;
    for (let k = base; ; k += base) {
      if (index >= inputLength) error("invalid-input");
      const digit = basicToDigit(input.charCodeAt(index++));
      if (digit >= base) error("invalid-input");
      if (digit > floor((maxInt - i) / w)) error("overflow");
      i += digit * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (digit < t) break;
      const baseMinusT = base - t;
      if (w > floor(maxInt / baseMinusT)) error("overflow");
      w *= baseMinusT;
    }
    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi === 0);
    if (floor(i / out) > maxInt - n) error("overflow");
    n += floor(i / out);
    i %= out;
    output.splice(i++, 0, n);
  }
  return String.fromCodePoint(...output);
}

/** ---------------------------------------------------------
 * * ***Encodes a Unicode string to `Punycode-UtilsJS`.***
 * ---------------------------------------------------------
 *
 * @param input - Unicode string.
 * @returns `Punycode-UtilsJS` string.
 */
function encode(input: string): string {
  assertIsString(input, {
    message: ({ currentType, validType }) =>
      `Utils \`punycodeUtilsJS.encode\`, parameter \`input\` must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const output: string[] = [];
  const points = ucs2decode(input);
  const inputLength = points.length;
  let n = initialN,
    delta = 0,
    bias = initialBias;

  for (const cp of points) if (cp < 0x80) output.push(stringFromCharCode(cp));
  const basicLength = output.length;
  let handledCPCount = basicLength;
  if (basicLength) output.push(delimiter);

  while (handledCPCount < inputLength) {
    let m = maxInt;
    for (const cp of points) if (cp >= n && cp < m) m = cp;

    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne))
      error("overflow");
    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (const cp of points) {
      if (cp < n) delta++;
      if (cp === n) {
        let q = delta;
        for (let k = base; ; k += base) {
          const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) break;
          output.push(
            stringFromCharCode(digitToBasic(t + ((q - t) % (base - t)), 0))
          );
          q = floor((q - t) / (base - t));
        }
        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(
          delta,
          handledCPCountPlusOne,
          handledCPCount === basicLength
        );
        delta = 0;
        handledCPCount++;
      }
    }
    delta++;
    n++;
  }

  return output.join("");
}

/** ---------------------------------------------------------
 * * ***Converts `Punycode-UtilsJS` to Unicode for domain names.***
 * ---------------------------------------------------------
 *
 * @param input - Domain or label.
 * @returns Unicode string.
 */
function toUnicode(input: string): string {
  assertIsString(input, {
    message: ({ currentType, validType }) =>
      `Utils \`punycodeUtilsJS.toUnicode\`, parameter \`input\` must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  return mapDomain(input, (str) =>
    regexPunycode.test(str) ? decode(str.slice(4).toLowerCase()) : str
  );
}

/** ---------------------------------------------------------
 * * ***Converts Unicode to ASCII (`Punycode-UtilsJS`) for domain names.***
 * ---------------------------------------------------------
 *
 * @param input - Domain or label.
 * @returns ASCII string.
 */
function toASCII(input: string): string {
  assertIsString(input, {
    message: ({ currentType, validType }) =>
      `Utils \`punycodeUtilsJS.toASCII\`, parameter \`input\` must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  return mapDomain(input, (str) =>
    regexNonASCII.test(str) ? "xn--" + encode(str) : str
  );
}

type PunycodeUtilsJS = {
  /** ---------------------------------------------------------
   * * ***Version of the `Punycode-UtilsJS` implementation.***
   * ---------------------------------------------------------
   *
   * @example
   * console.log(punycodeUtilsJS.version); // "1.0.0"
   */
  version: string;
  /** ---------------------------------------------------------
   * * ***UCS-2 utility functions.***
   * ---------------------------------------------------------
   */
  ucs2: {
    /** ---------------------------------------------------------
     * * ***Decodes a UCS-2 encoded string to an array of Unicode code points.***
     * ---------------------------------------------------------
     *
     * @param input - The UCS-2 string to decode.
     * @returns Array of Unicode code points.
     * @example
     * punycodeUtilsJS.ucs2.decode("𐍈");
     * // ➔ [66376]
     */
    decode: (input: string) => number[];
    /** ---------------------------------------------------------
     * * ***Encodes an array of Unicode code points to a UCS-2 string.***
     * ---------------------------------------------------------
     *
     * @param points - Array of Unicode code points.
     * @returns Encoded string.
     * @example
     * punycodeUtilsJS.ucs2.encode([66376]);
     * // ➔ "𐍈"
     */
    encode: (points: number[]) => string;
  };
  /** ---------------------------------------------------------
   * * ***Decodes a `Punycode-UtilsJS` string to a Unicode string.***
   * ---------------------------------------------------------
   *
   * @param input - The `Punycode-UtilsJS` string to decode.
   * @returns Decoded Unicode string.
   * @example
   * punycodeUtilsJS.decode("xn--fsq");
   * // ➔ "ü"
   */
  decode: (input: string) => string;
  /** ---------------------------------------------------------
   * * ***Encodes a Unicode string to `Punycode-UtilsJS`.***
   * ---------------------------------------------------------
   *
   * @param input - Unicode string to encode.
   * @returns `Punycode-UtilsJS` string.
   * @example
   * punycodeUtilsJS.encode("ü");
   * // ➔ "xn--fsq"
   */
  encode: (input: string) => string;
  /** ---------------------------------------------------------
   * * ***Converts a Unicode domain or label to ASCII (`Punycode-UtilsJS`).***
   * ---------------------------------------------------------
   *
   * @param input - Domain or label string.
   * @returns ASCII string suitable for DNS.
   * @example
   * punycodeUtilsJS.toASCII("пример.рф");
   * // ➔ "xn--e1afmkfd.xn--p1ai"
   */
  toASCII: (input: string) => string;
  /** ---------------------------------------------------------
   * * ***Converts an ASCII (`Punycode-UtilsJS`) domain or label to Unicode.***
   * ---------------------------------------------------------
   *
   * @param input - ASCII string (with xn-- prefix if needed).
   * @returns Unicode string.
   * @example
   * punycodeUtilsJS.toUnicode("xn--e1afmkfd.xn--p1ai");
   * // ➔ "пример.рф"
   */
  toUnicode: (input: string) => string;
};

/** ---------------------------------------------------------
 * * ***`Punycode-UtilsJS` object exposing all API functions and version.***
 * ---------------------------------------------------------
 * Provides encoding and decoding of Unicode domain names to ASCII (`Punycode-UtilsJS`)
 * and vice versa.
 *
 * - Useful for IDN (Internationalized Domain Names) support.
 */
const punycodeUtilsJS: PunycodeUtilsJS = {
  version: "1.0.0",
  ucs2: {
    decode: ucs2decode,
    encode: ucs2encode
  },
  decode: decode,
  encode: encode,
  toASCII: toASCII,
  toUnicode: toUnicode
};

/**
 * Export individual functions.
 */
export { punycodeUtilsJS };
