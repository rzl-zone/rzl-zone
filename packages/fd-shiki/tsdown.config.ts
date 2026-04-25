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
    entry: {
      "shiki/index": "./src/shiki/index.ts",
      "plugins/index": "./src/plugins/index.ts",
      "rehype/index": "./src/rehype/index.ts"
    },
    banner: false,
    format: ["esm"],
    deps: {
      neverBundle: ["next", "react", "react-dom", "hash"]
    },
    async onSuccess() {
      await stripJsComments(["dist/**"], {
        logLevel: "error"
      });

      await injectDirective(
        ["./dist/context/index.*", "./dist/hooks/index.*"],
        ["use client"],
        { logLevel: "error" }
      );

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
