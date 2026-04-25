import {
  cleanTypesBuildArtifacts,
  copyFileToDest,
  createCopyFileToDestParameterSet,
  ensureFinalNewline,
  runCommand,
  stripJsComments
} from "@rzl-zone/build-tools";

import {
  applyWarningFilter,
  resolveDefaultConfig
} from "@rzl-zone/build-tools/bundler/tsdown";

export default resolveDefaultConfig((ic) => {
  applyWarningFilter();

  return {
    entry: "src/index.ts",
    format: ["esm"],
    // dts: { oxc: true },
    target: "node18",
    logLevel: "silent",
    async onSuccess() {
      // await ensureCssImport("dist/**", { cssImportPath: "css.css" });

      await stripJsComments(["dist/**"], {
        logLevel: "error"
      });

      await cleanTypesBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeSourceMap: true,
        removeAdjacentEmptyLines: true
      });

      await copyFileToDest(
        createCopyFileToDestParameterSet([
          {
            source: "dist/index.d.ts",
            target: "dist",
            absoluteTarget: true,
            fileName: "index.ts",
            ignoreMissingSourceError: !!ic.watch
          }
        ]),
        {
          logLevel: "info"
        }
      );

      await runCommand("del-cli", ["dist/index.{js,mjs,js.map,cjs,cjs.map}"]);

      await ensureFinalNewline(["dist/**"], { logLevel: "error" });
    }
  };
});
