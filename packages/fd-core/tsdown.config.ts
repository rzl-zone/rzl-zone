import {
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  ensureFinalNewline,
  generateReferenceIndex,
  stripJsComments
} from "@rzl-zone/build-tools";
import {
  applyWarningFilter,
  resolveDefaultConfig
} from "@rzl-zone/build-tools/bundler/tsdown";

export default resolveDefaultConfig(() => {
  applyWarningFilter();

  return {
    entry: ["./src/**/*", "!src/_private/*", "!src/types"],
    banner: undefined,
    unbundle: true,
    format: ["esm"],
    deps: {
      // neverBundle: ["next", "react", "react-dom", "@workspace/fd-shiki"]
    },
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

      await generateReferenceIndex(["dist/**/*.ts"], { logLevel: "error" });
      await ensureFinalNewline(["dist/**"], { logLevel: "error" });
    }
  };
});
