/* eslint-disable quotes */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { safeJsonParse } from "../../safeJsonParse";

/** * ***Util Helper for {@link safeJsonParse | `safeJsonParse`}.***  */
export function fixSingleQuotesEscapeBackslash(input: string): string {
  const validEscapes = new Set(["\\", '"', "/", "b", "f", "n", "r", "t", "u"]);

  let output = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escapeNext = false;

  for (let i = 0; i < input.length; i++) {
    const c = input[i] || "";

    if (escapeNext) {
      if (inSingleQuote) {
        if (c === "'") {
          output += "'";
        } else if (validEscapes.has(c)) {
          if (c === "\\") {
            output += "\\\\";
          } else if (c === '"') {
            output += '\\"';
          } else {
            output += "\\" + c;
          }
        } else {
          output += "\\\\" + c;
        }
      } else if (inDoubleQuote) {
        if (c === '"') {
          output += '\\"';
        } else if (validEscapes.has(c)) {
          output += "\\" + c;
        } else {
          output += "\\\\" + c;
        }
      } else {
        output += "\\" + c;
      }
      escapeNext = false;
      continue;
    }

    if (c === "\\") {
      escapeNext = true;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote) {
      if (c === "'") {
        output += '"';
        inSingleQuote = true;
        continue;
      }
      if (c === '"') {
        output += '"';
        inDoubleQuote = true;
        continue;
      }
    } else if (inSingleQuote) {
      if (c === "'") {
        output += '"';
        inSingleQuote = false;
        continue;
      }
    } else if (inDoubleQuote) {
      if (c === '"') {
        output += '"';
        inDoubleQuote = false;
        continue;
      }
    }

    output += c;
  }

  return output;
}
