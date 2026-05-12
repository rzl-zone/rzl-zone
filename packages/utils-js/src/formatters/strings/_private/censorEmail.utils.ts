// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { censorEmail } from "../censorEmail";
import { isUndefined } from "@/predicates/is/isUndefined";

/** ***Util helper for {@link censorEmail}.***
 *
 * @internal
 */
export const hashSeedGenerate = (mode: "random" | "fixed", email: string) => {
  const generateSeed = () => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = (hash << 5) - hash + email.charCodeAt(i);
      hash |= 0; // Convert to 32bit int
    }
    return Math.abs(hash);
  };

  return mode === "fixed" ? generateSeed() : undefined;
};

/** ----------------------------------------------------------
 *  * ***Internal Randomly replaces characters in a string with "\*".***
 * ----------------------------------------------------------
 *
 * @param {string} str - The string to censor.
 * @param {number} minCensor - Minimum number of characters to censor.
 * @param {number} maxPercentage - Maximum percentage of characters to censor.
 * @returns {string} - Censored string.
 *
 * @internal ***Util helper for {@link censorEmail}.***
 */
export const _censor = (
  str: string,
  minCensor: number,
  maxPercentage: number,
  hashSeed: number | undefined
): string => {
  if (str.length <= minCensor) return "*".repeat(str.length);

  const strArr = str.split("");
  const totalCensor = Math.max(
    minCensor,
    Math.ceil(str.length * maxPercentage)
  );
  const indexes = new Set<number>();

  let i = 0;
  while (indexes.size < totalCensor) {
    const idx = !isUndefined(hashSeed)
      ? (hashSeed + str.length + i * 31) % str.length
      : Math.floor(Math.random() * str.length);
    indexes.add(idx);
    i++;
  }

  for (const index of indexes) {
    strArr[index] = "*";
  }

  return strArr.join("");
};
