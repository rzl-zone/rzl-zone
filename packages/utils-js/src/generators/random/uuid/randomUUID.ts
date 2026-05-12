import { isBoolean } from "@/predicates/is/isBoolean";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

/**
 * Configuration options for `randomUUID()`.
 */
type OptionsRandomUUID = {
  /**
   * Specifies which UUID version to generate.
   *
   * - `"v4"` — Fully random UUID (RFC 4122). No timestamp, no ordering guarantees.
   * - `"v7"` — Time-ordered UUID (RFC 9562). Uses Unix timestamp + randomness.
   *
   * @default "v4"
   *
   * @example
   * // Random v4 UUID
   * randomUUID({ version: "v4" }); // ➔ "3ec0de5a-b8a9-4ffb-a62a-fcc76851e9c2"
   *
   * @example
   * // Time-ordered v7 UUID
   * randomUUID({ version: "v7" }); // ➔ "0199f3f6-3c5e-744b-affa-46b2cfd496f8"
   */
  version?: "v4" | "v7";

  /**
   * Enables monotonic sequencing for UUID v7.
   *
   * - Guarantees that multiple UUIDs generated within the same millisecond
   *   are strictly non-decreasing (lexicographically and timestamp-wise).
   * - Only valid when `version === "v7"`. Using with `v4` will throw a `TypeError`.
   * - Useful for database inserts, logs, or any system where order matters.
   *
   * @default false
   *
   * @example
   * // Monotonic v7 UUIDs
   * const a = randomUUID({ version: "v7", monotonic: true });
   * const b = randomUUID({ version: "v7", monotonic: true });
   * console.log(a < b); // true, guaranteed
   */
  monotonic?: boolean;
};

/** -----------------------------------------------------------------------
 * * ***Utility: `randomUUID`.***
 * ------------------------------------------------------------------------
 * **Generates a UUID string according to the specified version and options.**
 *
 * - **Supported versions**:
 *    - **`"v4"` (default)** ➔ Fully random UUID, RFC 4122 compliant.
 *        - Uses `crypto.randomUUID()` if available.
 *        - Falls back to `crypto.getRandomValues()` or `Math.random()`
 *          if needed.
 *    - **`"v7"`** ➔ Time-ordered UUID, RFC 9562 compliant.
 *        - Timestamp (Unix ms, 48 bits) + 80 bits randomness.
 *        - Good for database indexing / sorting.
 *    - **`"v7"` + `monotonic: true`** ➔ Ensures strictly non-decreasing UUIDs
 *      for multiple calls in the same millisecond (per-process).
 *
 * - **Behavior / Safety Notes**:
 *    - **v4**: Fully random; probability of duplicates is astronomically low.
 *    - **v7**: Time-ordered; collisions extremely unlikely unless same ms + random repeat.
 *    - **Monotonic v7**: Guaranteed ordering per-process if multiple UUIDs are generated
 *      in the same millisecond.
 *    - **All versions**: Fallback safely if `crypto` APIs are unavailable.
 *
 * @param {object} [options] - Optional settings object.
 * @param {"v4" | "v7"} [options.version="v4"] - UUID version to generate.
 * @param {boolean} [options.monotonic=false] - For v7 only: generate monotonic UUIDs
 *                                              to maintain strict lexicographic order
 *                                              when generating multiple UUIDs within the same ms.
 *
 * @returns {string} A 36-character UUID string compliant with the selected version.
 *
 * @throws **{@link TypeError | `TypeError`}** if:
 * - `options` is not a plain object.
 * - `options.version` is provided but not a string.
 * - `options.monotonic` is provided but not a boolean.
 * - `monotonic: true` is used with `version` other than `"v7"`.
 * @throws **{@link RangeError | `RangeError`}** if `options.version` is provided but not `"v4"` or `"v7"`.
 *
 * @example
 * // Default (v4)
 * const id = randomUUID();
 * // ➔ "3b12f1df-5232-4804-897e-917bf397618a"
 *
 * @example
 * // Explicit v4
 * const id4 = randomUUID({ version: "v4" });
 *
 * @example
 * // Time-ordered v7
 * const id7 = randomUUID({ version: "v7" });
 * // ➔ "018f48d2-84c1-7ccd-b5a3-2f9463b3a889"
 *
 * @example
 * // Monotonic v7
 * const a = randomUUID({ version: "v7", monotonic: true });
 * const b = randomUUID({ version: "v7", monotonic: true });
 * // a < b lexicographically (guaranteed)
 *
 * @example
 * // Throws TypeError
 * randomUUID("v4" as any); // options must be object
 * randomUUID({ version: 123 as any }); // version must be string
 * randomUUID({ version: "v4", monotonic: true } as any); // monotonic only for v7
 *
 * @example
 * // Throws RangeError
 * randomUUID({ version: "v1" as any }); // unsupported version
 */
export function randomUUID(options: OptionsRandomUUID = {}): string {
  // Validate options is a plain object if provided
  if (!isPlainObject(options)) {
    throw new TypeError(
      `First parameter (\`options\`) must be a plain object with optional properties \`version\` and \`monotonic\`, but received: \`${getPreciseType(
        options
      )}\` - (with value: \`${safeStableStringify(options, { keepUndefined: true })}\`).`
    );
  }

  const { version = "v4", monotonic = false } = options;

  // Validate version type
  if (!isNonEmptyString(version)) {
    throw new TypeError(
      `Parameter \`version\` property of the \`options\` (first parameter) must be a \`string\` of either "v4" or "v7", but received type: \`${getPreciseType(
        version
      )}\` - (with value: \`${safeStableStringify(version, { keepUndefined: true })}\`).`
    );
  }

  if (version !== "v4" && version !== "v7") {
    throw new RangeError(
      `Unsupported UUID version. Allowed values are "v4" or "v7". (received: \`${safeStableStringify(
        version,
        {
          keepUndefined: true
        }
      )}\`).`
    );
  }

  // Validate monotonic type
  if (!isBoolean(monotonic)) {
    throw new TypeError(
      `Parameter \`monotonic\` property of the \`options\` (first parameter) must be a \`boolean\` when provided, but received type: \`${getPreciseType(
        monotonic
      )}\` - (with value: \`${safeStableStringify(monotonic, {
        keepUndefined: true
      })}\`).`
    );
  }

  // monotonic only allowed with v7
  if (monotonic && version !== "v7") {
    throw new TypeError(
      `Parameter \`monotonic\` property of the \`options\` (first parameter) is only supported for version "v7". Received: version=${safeStableStringify(
        version,
        { keepUndefined: true }
      )}.`
    );
  }

  if (version === "v4") {
    return generateUUIDv4();
  }

  // version === "v7"
  return generateUUIDv7({ monotonic });
}

//todo: Helpers & Implementations

function hasCryptoGetRandomValues(): boolean {
  return (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  );
}

function hasCryptoRandomUUID(): boolean {
  return (
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
  );
}

function getRandomBytes(len: number): Uint8Array {
  if (hasCryptoGetRandomValues()) {
    return crypto.getRandomValues(new Uint8Array(len));
  }
  // Fallback: not cryptographically secure, but avoids crash
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
}

const byteToHex: string[] = (() => {
  const arr: string[] = [];
  for (let i = 0; i < 256; ++i) {
    arr.push((i + 0x100).toString(16).substring(1));
  }
  return arr;
})();

function generateUUIDv4(): string {
  // Prefer native if available
  if (hasCryptoRandomUUID()) {
    return crypto.randomUUID();
  }

  // If crypto.getRandomValues available, use it for 16 bytes
  if (hasCryptoGetRandomValues()) {
    const rnd = crypto.getRandomValues(new Uint8Array(16));
    // Per RFC 4122: set version and variant
    rnd[6] = (rnd[6] & 0x0f) | 0x40; // version 4
    rnd[8] = (rnd[8] & 0x3f) | 0x80; // variant 10xx

    return (
      byteToHex[rnd[0]] +
      byteToHex[rnd[1]] +
      byteToHex[rnd[2]] +
      byteToHex[rnd[3]] +
      "-" +
      byteToHex[rnd[4]] +
      byteToHex[rnd[5]] +
      "-" +
      byteToHex[rnd[6]] +
      byteToHex[rnd[7]] +
      "-" +
      byteToHex[rnd[8]] +
      byteToHex[rnd[9]] +
      "-" +
      byteToHex[rnd[10]] +
      byteToHex[rnd[11]] +
      byteToHex[rnd[12]] +
      byteToHex[rnd[13]] +
      byteToHex[rnd[14]] +
      byteToHex[rnd[15]]
    );
  }

  // Last-resort fallback using Math.random (not crypto-secure)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ---------------------------
   Monotonic state (singleton per-process)
   --------------------------- */

/**
 * Internal monotonic state:
 * - lastTimestampMs: last generated timestamp (ms)
 * - lastRand: last random 10-byte block used for v7 (used to increment on same ms)
 */
const monotonicState: {
  lastTimestampMs: number;
  lastRand: Uint8Array | null;
} = {
  lastTimestampMs: -1,
  lastRand: null
};

function incrementUint8ArrayBigEndian(arr: Uint8Array): boolean {
  // Increment arr in big-endian order. Return true if overflowed back to zero.
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === 0xff) {
      arr[i] = 0x00;
      continue;
    }
    arr[i] = (arr[i] + 1) & 0xff;
    return false; // no overflow
  }
  // overflowed (wrapped to zero)
  return true;
}

function generateUUIDv7({
  monotonic = false
}: { monotonic?: boolean } = {}): string {
  const nowMs = Date.now();
  const tsHex = BigInt(nowMs).toString(16).padStart(12, "0"); // 48 bits ➔ 12 hex chars

  // We'll use 10 random bytes (80 bits)
  let rand = getRandomBytes(10);

  if (monotonic) {
    // ensure monotonicState is consistent per-process
    if (monotonicState.lastTimestampMs === nowMs && monotonicState.lastRand) {
      // We are in the same ms bucket — increment lastRand (big-endian)
      const copy = new Uint8Array(monotonicState.lastRand); // copy for use
      const overflow = incrementUint8ArrayBigEndian(copy);
      if (overflow) {
        // Practically impossible (2^80 increments in 1ms). Throw to be safe.
        throw new RangeError(
          "Monotonic UUID sequence overflow: too many UUIDs generated within the same millisecond."
        );
      }
      // use incremented copy as rand
      rand = copy;
      // update state
      monotonicState.lastRand = copy;
    } else {
      // New ms: generate fresh randomness and store
      const fresh = getRandomBytes(10);
      monotonicState.lastRand = new Uint8Array(fresh);
      monotonicState.lastTimestampMs = nowMs;
      rand = fresh;
    }
  }

  // If not monotonic, rand remains randomly generated above.

  // Now set version & variant bits into proper positions.
  // For v7 layout we used: timestamp (48 bits) + rand[0..9] (80 bits)
  // We must set version nibble into high nibble of rand[0] (time_hi_and_version)
  // and set variant bits into rand[2]'s high bits (clock_seq_hi_and_reserved)
  rand[0] = (rand[0] & 0x0f) | 0x70; // version 7 (0x7 << 4)
  rand[2] = (rand[2] & 0x3f) | 0x80; // variant 10xx

  const randHex = Array.from(rand, (b) => byteToHex[b]).join("");

  // Assemble UUID groups:
  // - 8 hex (timestamp[0..7])
  // - 4 hex (timestamp[8..11])
  // - 4 hex (rand[0..1]) ➔ contains version in high nibble of rand[0]
  // - 4 hex (rand[2..3]) ➔ contains variant in high bits of rand[2]
  // - 12 hex (rand[4..9])
  const part1 = tsHex.slice(0, 8);
  const part2 = tsHex.slice(8, 12);
  const part3 = randHex.slice(0, 4);
  const part4 = randHex.slice(4, 8);
  const part5 = randHex.slice(8, 20);

  return [part1, part2, part3, part4, part5].join("-");
}
