import {
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  ensureFinalNewline,
  generateReferenceIndex,
  injectDirective,
  stripJsComments
} from "@rzl-zone/build-tools";
import {
  applyWarningFilter,
  resolveDefaultConfig
} from "@rzl-zone/build-tools/bundler/tsdown";

export default resolveDefaultConfig(() => {
  applyWarningFilter(["[EMPTY_IMPORT_META] Warning"]);

  return {
    entry: [
      "src/comparison/*",
      "src/env/*",
      "src/errors/*",
      "src/logging/*",
      "src/minifier/*",
      "src/node/fs/index.ts",
      "src/node/fs/index.ts",
      "src/props/*",
      "src/refs/*",
      "src/url/index.ts"
    ],
    async onSuccess() {
      await stripJsComments(["dist/**"], {
        logLevel: "error"
      });

      await cleanJsBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeAdjacentEmptyLines: true
      });
      await cleanTypesBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeSourceMap: true,
        removeAdjacentEmptyLines: false
      });

      await injectDirective("dist/**/*.cjs", ["use strict"], {
        logLevel: "error"
      });

      await generateReferenceIndex(["dist/**/*.ts"], { logLevel: "error" });
      await generateReferenceIndex(["dist/**/*.cts"], {
        logLevel: "error",
        outFileName: "index.d.cts"
      });

      await ensureFinalNewline(["dist/**"], { logLevel: "error" });
    }
  };
});
