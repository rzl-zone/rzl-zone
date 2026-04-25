import {
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  ensureCssImport,
  ensureFinalNewline,
  generateReferenceIndex,
  runCommand,
  stripJsComments
} from "@rzl-zone/build-tools";
import {
  applyWarningFilter,
  resolveDefaultConfig
} from "@rzl-zone/build-tools/bundler/tsdown";

export default resolveDefaultConfig(() => {
  applyWarningFilter();

  return {
    banner: false,
    unbundle: true,
    format: ["esm"],
    deps: {
      neverBundle: ["next", "react", "react-dom"]
    },
    entry: ["./src/**/*", "!src/_private/*", "!src/types"],
    async onSuccess() {
      await stripJsComments(["dist/**"], {
        logLevel: "error"
      });

      await cleanJsBuildArtifacts(["dist/**"], { logLevel: "error" });
      await cleanTypesBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeSourceMap: true,
        removeAdjacentEmptyLines: true
      });

      await generateReferenceIndex(["dist/**/*.ts"], { logLevel: "error" });

      await runCommand("pnpm", ["build:tailwind"]);

      await ensureCssImport("dist/components/image-zoom.js", {
        logLevel: "error",
        cssImportPath: "./image-zoom.css"
      });

      await ensureFinalNewline(["dist/**"], { logLevel: "error" });
    }
  };
});
