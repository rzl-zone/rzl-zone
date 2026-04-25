/** --------------------------------------------------------------------------
 * * ***Supported value types for code block meta attributes.***
 * --------------------------------------------------------------------------
 *
 * - ***What this type represents:***
 *    - All allowed runtime values for parsed code block attributes.
 *    - Used as the canonical value union across meta parsing utilities.
 *
 * ---
 *
 * ℹ️ ***Why this exists:***
 * - Code block meta attributes are string-based by default.
 * - This type reflects post-parsing + casting results.
 *
 * ---
 *
 * 🧩 ***Supported values:***
 * - `string` — default literal values
 * - `boolean` — parsed from flags or `"true"` / `"false"`
 * - `number` — numeric strings (`"1"`, `"3.14"`)
 * - `null` — literal `"null"`
 * - `undefined` — literal `"undefined"` or omitted values
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - `undefined` may represent an explicitly parsed value,
 *   not just an absent property.
 * - Consumers should handle all union members defensively.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Fumadocs meta parsing
 *    - Shiki / rehype transformers
 *    - MDX documentation pipelines
 */
type AttrValue = string | boolean | number | null | undefined;

/** --------------------------------------------------------------------------
 * * ***Result structure for parsed code block attributes.***
 * --------------------------------------------------------------------------
 *
 * - ***What this type represents:***
 *    - The normalized output of `parseCodeBlockAttributes`.
 *    - Separates extracted attributes from remaining meta content.
 *
 * ---
 *
 * ℹ️ ***Structure overview:***
 * - `attributes`
 *    - Key-value map of parsed attributes.
 *    - Values are already cast to runtime-safe types.
 * - `rest`
 *    - Remaining meta string after attribute extraction.
 *    - Whitespace-normalized and safe for reuse.
 *
 * ---
 *
 * 🧩 ***Generic behavior:***
 * - `Name` constrains allowed attribute keys.
 * - Enables strong typing when using whitelists.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - `rest` preserves unknown or intentionally ignored attributes.
 * - Attribute order is not guaranteed.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Code block meta parsing
 *    - MDX remark plugins
 *    - Documentation tooling with strict typing
 *
 * @template Name - Allowed attribute name union.
 */
type CodeBlockAttributes<Name extends string = string> = {
  attributes: Record<Name, AttrValue>;
  rest: string;
};

/** --------------------------------------------------------------------------
 * * ***Parse Fumadocs-style code block attributes from meta strings.***
 * --------------------------------------------------------------------------
 *
 * - ***What this function does:***
 *    - Parses attribute-like tokens from a code block meta string.
 *    - Supports quoted, braced, bare, and boolean flag values.
 *    - Preserves unconsumed meta content as `rest`.
 *
 * ---
 *
 * ⚙️ ***Supported syntaxes:***
 * - Quoted values:
 *   ```ts
 *   title="Hello World"
 *   ```
 * - Braced values (with nesting support):
 *   ```ts
 *   props={{ foo: { bar: 1 } }}
 *   ```
 * - Bare values:
 *   ```ts
 *   tab="ts"
 *   ```
 * - Boolean flags:
 *   ```ts
 *   persist
 *   ```
 *
 * ---
 *
 * ℹ️ ***Value casting rules:***
 * - `"true"` ➔ `true`
 * - `"false"` ➔ `false`
 * - `"null"` ➔ `null`
 * - `"undefined"` ➔ `undefined`
 * - Numeric strings ➔ `number`
 * - Otherwise ➔ `string`
 *
 * ---
 *
 * 🧩 ***Filtering behavior:***
 * - If `allowedNames` is provided:
 *    - Only listed attributes are extracted.
 *    - Others remain in `rest`.
 *
 * ---
 *
 * ⚠️ ***Important notes:***
 * - Parsing is whitespace-tolerant.
 * - Malformed values are consumed defensively.
 * - Attribute ranges are removed precisely using index tracking.
 *
 * ---
 *
 * - ***Designed for:***
 *    - Fumadocs / MDX code block meta parsing
 *    - Shiki & rehype transformers
 *    - Advanced documentation pipelines
 *
 * @param meta - Raw code block meta string.
 * @param allowedNames - Optional whitelist of allowed attribute names.
 *
 * @returns
 * An object containing:
 * - `attributes`: Parsed and casted attributes.
 * - `rest`: Remaining unparsed meta string.
 *
 * @example
 * ```ts
 * parseCodeBlockAttributes('tab="ts" persist title="Example"', ["tab", "persist"]);
 * // {
 * //   attributes: { tab: "ts", persist: true },
 * //   rest: 'title="Example"'
 * // }
 * ```
 */
export function parseCodeBlockAttributes<Name extends string = string>(
  meta: string,
  allowedNames?: Name[]
): CodeBlockAttributes<Name> {
  const attrs: Record<string, AttrValue> = {};
  const metaLen = meta.length;
  let i = 0;

  const consumedRanges: Array<[number, number]> = [];

  function skipSpaces() {
    while (i < metaLen && /\s/.test(meta[i]!)) i++;
  }

  function markConsumed(start: number, end: number) {
    // push inclusive-exclusive range [start, end)
    consumedRanges.push([start, end]);
  }

  function readName(): { name: string; start: number; end: number } | null {
    skipSpaces();
    const start = i;
    // Accept letters, digits, _, -, :, .
    while (i < metaLen && /[A-Za-z0-9:_\-.]/.test(meta[i]!)) i++;
    if (i === start) return null;
    return { name: meta.slice(start, i), start, end: i };
  }

  function readQuotedValue(openQuoteIdx: number) {
    const quoteChar = meta[openQuoteIdx];
    let out = "";
    let j = openQuoteIdx + 1;
    while (j < metaLen) {
      const ch = meta[j];
      if (ch === "\\") {
        // include escape next char verbatim
        if (j + 1 < metaLen) {
          out += meta[j + 1];
          j += 2;
          continue;
        } else {
          // dangling backslash
          j++;
          continue;
        }
      }
      if (ch === quoteChar) {
        // return { value, endIndexAfterClosingQuote }
        return { value: out, end: j + 1 };
      }
      out += ch;
      j++;
    }
    // no closing quote; consume until end
    return { value: out, end: j };
  }

  function readBracedValue(openBraceIdx: number) {
    // consumes nested braces; returns inner content (without outer braces) and end index after closing brace
    let depth = 0;
    let out = "";
    let j = openBraceIdx;
    while (j < metaLen) {
      const ch = meta[j];
      if (ch === "{") {
        depth++;
        if (depth > 1) out += ch;
        j++;
        continue;
      }
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          // end, return inner and index after closing brace
          return { value: out, end: j + 1 };
        } else {
          out += ch;
          j++;
          continue;
        }
      }
      out += ch;
      j++;
    }
    // not closed properly ➔ return what we have and position at end
    return { value: out, end: j };
  }

  function readBareValue(startIdx: number) {
    let j = startIdx;
    while (j < metaLen && !/\s/.test(meta[j]!)) j++;
    return { value: meta.slice(startIdx, j), end: j };
  }

  function castValue(raw: AttrValue): AttrValue {
    if (raw === true || raw === false) return raw;
    if (raw === "true") return true;
    if (raw === "false") return false;
    if (raw === "null") return null;
    if (raw === "undefined") return undefined;
    if (typeof raw === "string" && /^[-]?\d+(\.\d+)?$/.test(raw))
      return Number(raw);
    return raw;
  }

  while (i < metaLen) {
    const prePos = i;
    const nameRes = readName();
    if (!nameRes) {
      // nothing recognizable: advance by one char
      i = prePos + 1;
      continue;
    }

    const { name, start: nameStart, end: nameEnd } = nameRes;
    skipSpaces();

    if (i < metaLen && meta[i] === "=") {
      // we will consume from nameStart to after the value
      // const eqIdx = i;
      i++; // skip '='
      skipSpaces();

      // eslint-disable-next-line quotes
      if (i < metaLen && (meta[i] === '"' || meta[i] === "'")) {
        // quoted
        const { value, end } = readQuotedValue(i);
        const tokenStart = nameStart;
        const tokenEnd = end;
        // only record consumed if allowed or no allowedNames
        if (!allowedNames || allowedNames.includes(name as Name)) {
          attrs[name] = castValue(value);
          markConsumed(tokenStart, tokenEnd);
        }
        i = end;
        continue;
      } else if (i < metaLen && meta[i] === "{") {
        // braced (handle nested)
        const { value, end } = readBracedValue(i);
        const tokenStart = nameStart;
        const tokenEnd = end;
        if (!allowedNames || allowedNames.includes(name as Name)) {
          attrs[name] = castValue(value.trim());
          markConsumed(tokenStart, tokenEnd);
        }
        i = end;
        continue;
      } else {
        // bare unquoted value
        const { value, end } = readBareValue(i);
        const tokenStart = nameStart;
        const tokenEnd = end;
        if (!allowedNames || allowedNames.includes(name as Name)) {
          attrs[name] = castValue(value);
          markConsumed(tokenStart, tokenEnd);
        }
        i = end;
        continue;
      }
    } else {
      // boolean flag (no '=')
      const tokenStart = nameStart;
      const tokenEnd = nameEnd;
      if (!allowedNames || allowedNames.includes(name as Name)) {
        attrs[name] = true;
        // attrs[name] = true;
        markConsumed(tokenStart, tokenEnd);
      }
      i = nameEnd;
      continue;
    }
  }

  // Build rest by removing consumed ranges. Merge overlapping ranges first.
  if (consumedRanges.length === 0) {
    return {
      rest: meta.trim(),
      attributes: attrs
    };
  }

  consumedRanges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const r of consumedRanges) {
    if (merged.length === 0) {
      merged.push(r);
      continue;
    }
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) {
      // overlap or contiguous
      last[1] = Math.max(last[1], r[1]);
    } else {
      merged.push(r);
    }
  }

  let rest = "";
  let cursor = 0;
  for (const [start, end] of merged) {
    if (cursor < start) rest += meta.slice(cursor, start);
    cursor = end;
  }
  if (cursor < meta.length) rest += meta.slice(cursor);

  rest = rest.replace(/\s+/g, " ").trim();

  return { rest, attributes: attrs };
}
