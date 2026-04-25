/* eslint-disable no-useless-escape */

/** --------------------------------------------------------------------------
 * * ***Options for `normalizeContentAndQuery`.***
 * --------------------------------------------------------------------------
 *
 * - ***Controls what characters are preserved during normalization.***
 *
 * ---
 *
 * ⚠️ ***Important behavior:***
 * - These options affect **matching behavior**, not display output.
 * - Changing these options may significantly impact fuzzy results.
 */
export type NormalizeContentOptions = {
  /**
   * Preserve numeric characters (`0-9`) during normalization.
   *
   * @default true
   */
  keepNumbers?: boolean;

  /**
   * Preserve Unicode letters using `\p{L}`.
   *
   * When `false`, only ASCII letters (`a-z`) are allowed.
   *
   * @default true
   */
  keepUnicodeLetters?: boolean;
};

/** --------------------------------------------------------------------------
 * * ***Normalize text for consistent fuzzy / text matching.***
 * --------------------------------------------------------------------------
 *
 * - ***What this does:***
 *    - Lowercases the input.
 *    - Removes diacritics (`é` ➔ `e`).
 *    - Normalizes punctuation and symbols.
 *    - Joins common word connectors (e.g. `"Node.js"` ➔ `"nodejs"`).
 *
 * - ***Preserved connectors:***
 *    - `.`, `_`, `-`, `+`, `/`
 *
 * - ***Configurable behavior:***
 *    - Keep or remove numbers.
 *    - Use Unicode-aware letter matching (`\p{L}`) or ASCII-only.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Non-string or empty input returns an empty string.
 * - This function is optimized for **search & fuzzy matching**, not display.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Fuzzy search
 *    - Text indexing
 *    - Keyword matching
 *
 * @param str - Input string to normalize.
 * @param options - Normalization options.
 * @param options.keepNumbers - Preserve numeric characters (`0-9`).
 * @param options.keepUnicodeLetters - Preserve Unicode letters using `\p{L}`.
 *
 * @returns A normalized string suitable for fuzzy matching.
 *
 * @example
 * ```ts
 * normalizeContentAndQuery("Node.js v18");
 * // ➔ "nodejs v18"
 *
 * normalizeContentAndQuery("Café-au-lait");
 * // ➔ "cafeaulait"
 *
 * normalizeContentAndQuery("Version 2.0", { keepNumbers: false });
 * // ➔ "version"
 * ```
 */
export function normalizeContentAndQuery(
  str: string | undefined,
  options: NormalizeContentOptions = {}
): string {
  const { keepNumbers = true, keepUnicodeLetters = true } = options;

  if (typeof str !== "string" || !str.trim()) return "";

  let normalized = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove diacritics (é -> e)

  // keep word connectors but remove other punctuation
  const connectorChars = "._\\-+/";
  const pattern = keepUnicodeLetters
    ? keepNumbers
      ? new RegExp(`[^\\p{L}\\p{N}${connectorChars}]+`, "gu")
      : new RegExp(`[^\\p{L}${connectorChars}]+`, "gu")
    : keepNumbers
      ? new RegExp(`[^a-z0-9${connectorChars}]+`, "gi")
      : new RegExp(`[^a-z${connectorChars}]+`, "gi");

  normalized = normalized
    .replace(pattern, " ") // replace invalid with space
    .replace(/[_\-\+/]+/g, "") // remove connectors entirely (join words)
    .replace(/\s+/g, " ") // normalize multiple spaces
    .trim();

  return normalized;
}

/** --------------------------------------------------------------------------
 * * ***Compute Levenshtein (edit) distance between two strings.***
 * --------------------------------------------------------------------------
 *
 * - ***What this measures:***
 *    - The minimum number of single-character edits required to
 *      transform one string into another.
 *
 * - ***Supported operations:***
 *    - Insertion
 *    - Deletion
 *    - Substitution
 *
 * ---
 *
 * ⚙️ ***Implementation details:***
 * - Uses a two-row dynamic programming approach.
 * - Reuses buffers by swapping references for better performance.
 * - Uses `Uint32Array` to safely support longer strings.
 *
 * ---
 *
 * ⚠️ ***Notes:***
 * - Time complexity: **O(n × m)**
 * - Space complexity: **O(m)**
 *
 * ---
 *
 * - ***Designed for:***
 *    - Fuzzy matching
 *    - Search ranking
 *    - Similarity comparison
 *
 * @param a - First string.
 * @param b - Second string.
 *
 * @returns The Levenshtein distance (0 = exact match).
 *
 * @example
 * ```ts
 * levenshtein("kitten", "sitting"); // 3
 * levenshtein("book", "back");     // 2
 * levenshtein("test", "test");     // 0
 * ```
 */
export function levenshtein(a: string, b: string): number {
  const lenA = a.length;
  const lenB = b.length;

  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;

  // Uint32Array to be safe for longer strings (Uint16 might overflow)
  let prev = new Uint32Array(lenB + 1);
  let curr = new Uint32Array(lenB + 1);

  for (let j = 0; j <= lenB; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= lenA; i++) {
    curr[0] = i;
    const ai = a.charCodeAt(i - 1);

    for (let j = 1; j <= lenB; j++) {
      const bj = b.charCodeAt(j - 1);
      const cost = ai === bj ? 0 : 1;

      const deletion = prev[j]! + 1; // <— add !
      const insertion = curr[j - 1]! + 1;
      const substitution = prev[j - 1]! + cost;

      // manual min for small perf win
      let min = deletion;
      if (insertion < min) min = insertion;
      if (substitution < min) min = substitution;

      curr[j] = min;
    }

    // swap rows (prev <- curr, curr <- prev)
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }

  return prev[lenB]!;
}

/** --------------------------------------------------------------------------
 * * ***Perform fuzzy matching with multi-word support.***
 * --------------------------------------------------------------------------
 *
 * - ***Matching strategy:***
 *    - Normalizes both content and query.
 *    - Splits query into unique words.
 *    - Matches if **ANY** query word:
 *       - Exists literally in content, OR
 *       - Matches approximately via Levenshtein distance.
 *
 * ---
 *
 * ⚙️ ***Fast paths:***
 * - Direct substring match is checked first.
 * - Exact literal matches short-circuit further checks.
 *
 * ---
 *
 * ⚠️ ***Important behavior:***
 * - Returns `false` for empty or invalid inputs.
 * - Designed for loose matching, **not strict equality**.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Search inputs
 *    - Autocomplete
 *    - Filtering lists
 *
 * @param content - Text content to search within.
 * @param query - User query to match.
 * @param threshold - Maximum allowed edit distance, defaultValue: `1`.
 *
 * @returns `true` if any query word fuzzily matches the content.
 *
 * @example
 * ```ts
 * isFuzzyMatch("Node.js runtime", "node");      // true
 * isFuzzyMatch("JavaScript", "Javascrpt");      // true
 * isFuzzyMatch("React framework", "vue");       // false
 * isFuzzyMatch("Version 2.0", "verzion", 2);    // true
 * ```
 */
export function isFuzzyMatch(
  content: string | undefined,
  query: string | undefined,
  threshold = 1
): boolean {
  const normalizedContent = normalizeContentAndQuery(content);
  const normalizedQuery = normalizeContentAndQuery(query);

  if (!normalizedQuery || !normalizedContent) return false;

  // Split query to unique word
  const queryWords = [...new Set(normalizedQuery.split(/\s+/).filter(Boolean))];
  if (queryWords.length === 0) return false;

  // Fast track: if all query words are found directly in the content literally
  const allFoundLiteral = queryWords.every((w) =>
    normalizedContent.includes(w)
  );
  if (allFoundLiteral) return true;

  // Split content to words
  const words = normalizedContent.split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;

  // check query every words
  for (const q of queryWords) {
    for (const w of words) {
      if (w.includes(q)) return true;
      if (levenshtein(w, q) <= threshold) return true;
    }
  }

  return false;
}
