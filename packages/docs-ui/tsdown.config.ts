import {
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  ensureFinalNewline,
  generateReferenceIndex,
  injectDirective,
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
    entry: ["src/**/*.{ts,tsx}", "!src/cli/*", "!src/types", "!src/_private/*"],
    async onSuccess() {
      await stripJsComments(["dist/**"], {
        logLevel: "error"
      });

      await cleanJsBuildArtifacts(["dist/**"], { logLevel: "error" });
      await cleanTypesBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeAdjacentEmptyLines: true
      });

      await injectDirective("dist/**/*.cjs", ["use strict"], {
        logLevel: "error"
      });

      await generateReferenceIndex(["dist/**/*.ts"], { logLevel: "error" });
      await generateReferenceIndex(["dist/**/*.cts"], {
        logLevel: "error",
        outFileName: "index.d.cts"
      });

      await runCommand("pnpm", ["build:tailwind"], {
        stdio: "inherit"
      });

      await ensureFinalNewline(["dist/**"], { logLevel: "error" });
    }
  };
});
