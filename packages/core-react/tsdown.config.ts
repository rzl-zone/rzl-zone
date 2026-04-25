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
  applyWarningFilter();

  return {
    entry: ["src/**/*"],
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
        removeAdjacentEmptyLines: true
      });

      await injectDirective("dist/**/*.cjs", ["use strict"], {
        logLevel: "error"
      });

      await generateReferenceIndex(
        ["dist/context/index.d.ts", "dist/hooks/index.d.ts", "dist/utils/*.ts"],
        { logLevel: "error" }
      );
      await generateReferenceIndex(
        [
          "dist/context/index.d.cts",
          "dist/hooks/index.d.cts",
          "dist/utils/*.cts"
        ],
        { logLevel: "error", outFileName: "index.d.cts" }
      );

      await ensureFinalNewline(["dist/**"], { logLevel: "error" });
    }
  };
});
