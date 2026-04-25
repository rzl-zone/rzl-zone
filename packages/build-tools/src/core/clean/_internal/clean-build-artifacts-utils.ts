import "@rzl-zone/node-only";

import type { CleanCoreOptions } from "./clean-build-artifacts-types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanJsBuildArtifacts } from "../clean-js-build-artifacts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanTypesBuildArtifacts } from "../clean-types-build-artifacts";

import {
  EMPTY_LINE_RE,
  isAdjacentToTarget,
  isTargetComment
} from "@/_internal/utils/source";

/** @internal Util for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`} and {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}. */
export function stripLineArtifacts(line: string, options: CleanCoreOptions) {
  let out = line
    // remove source path comments
    .replace(
      /^[ \t]*\/\/\s*(?:\.\.\/|\.\/)*[^ \n]*?(?:src|node_modules)\/[^\n]*\n?/gm,
      ""
    )
    // remove eslint comments
    .replace(/\/\/\s*eslint[^\n]*/g, "");

  if (options.removeSourceMap) {
    // Remove all `sourceMappingURL` comments.
    out = out.replace(
      /^[ \t]*\/\/[#@]\s*sourceMappingURL\s*=\s*\S+/gm,
      // /\/\/[#@]\s*sourceMappingURL=[^\n]*/g,
      ""
    );
  }

  // Collapse duplicate `sourceMappingURL` comments into a single one.
  out = out.replace(
    /(^[ \t]*\/\/[#@]\s*sourceMappingURL\s*=\s*\S+)(?:\r?\n\1)+/gm,
    // /(\/\/[#@]\s*sourceMappingURL=[^\r\n]*)(?:\r?\n\1)+/g,
    "$1"
  );

  return out;
}

/** @internal Util for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`} and {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}. */
export function splitLines(content: string) {
  return content.split(/\r\n|\n/);
}

/** @internal Util for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`} and {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}. */
export function fileHasTarget(lines: string[], options: CleanCoreOptions) {
  return lines.some((line, i, arr) => {
    if (isTargetComment(line, options)) return true;

    if (
      options.removeAdjacentEmptyLines &&
      EMPTY_LINE_RE.test(line) &&
      isAdjacentToTarget(arr, i, options)
    ) {
      return true;
    }

    return false;
  });
}
