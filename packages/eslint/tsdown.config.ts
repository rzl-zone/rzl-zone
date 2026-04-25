import {
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  ensureFinalNewline,
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
    unbundle: true,
    outputOptions: { exports: "named" },
    target: "node14",
    async onSuccess() {
      await stripJsComments(["dist/**"], {
        logLevel: "error"
      });

      await cleanJsBuildArtifacts(["dist/**"], { logLevel: "error" });
      await cleanTypesBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeAdjacentEmptyLines: true,
        removeSourceMap: true
      });

      await injectDirective("dist/**/*.cjs", ["use strict"], {
        logLevel: "error"
      });

      await ensureFinalNewline(["dist/**"], { logLevel: "error" });
    }
  };
});
