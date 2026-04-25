import "@rzl-zone/node-only";

import type { CleanCoreOptions } from "./clean-build-artifacts-types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanJsBuildArtifacts } from "../clean-js-build-artifacts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { cleanTypesBuildArtifacts } from "../clean-types-build-artifacts";

import {
  EMPTY_LINE_RE,
  isAdjacentToTarget,
  isTargetComment,
  REGION_RE,
  SOURCE_MAP_RE
} from "@/_internal/utils/source";

import { stripLineArtifacts } from "./clean-build-artifacts-utils";

/** @internal Core for {@link cleanJsBuildArtifacts | `clean-js-build-artifacts`} and {@link cleanTypesBuildArtifacts | `clean-types-build-artifacts`}. */
export function cleanBuildArtifactsCore(
  lines: string[],
  options: CleanCoreOptions
) {
  const seenSourceMap = new Set<string>();

  return lines
    .filter((line, i, arr) => {
      if (SOURCE_MAP_RE.test(line)) {
        const key = line.trim();
        if (seenSourceMap.has(key)) return false;
        seenSourceMap.add(key);
        if (options.removeSourceMap) return false;

        return true;
      }

      if (options.removeRegion && REGION_RE.test(line)) return false;

      if (isTargetComment(line, options)) return false;

      if (
        options.removeAdjacentEmptyLines &&
        EMPTY_LINE_RE.test(line) &&
        isAdjacentToTarget(arr, i, options)
      ) {
        return false;
      }

      return true;
    })
    .map((line) => stripLineArtifacts(line, options));
}
