import {
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  copyFileToDest,
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
    entry: [
      // extra
      "src/extra/*.ts",
      "src/extra/*.tsx",
      "!src/extra/tests/*",

      // hoc
      "src/hoc/*.{ts,tsx}",

      // themes
      "src/themes/index.{ts,tsx}",
      "src/themes/app.{ts,tsx}",
      "src/themes/pages.{ts,tsx}",

      // progress-bar
      "src/progress-bar/index.{ts,tsx}",
      "src/progress-bar/app.{ts,tsx}",
      "src/progress-bar/pages.{ts,tsx}",

      // utils
      "src/utils/index.ts",

      // types
      "src/types/index.ts",

      // "src/**/*.{ts,tsx}",
      "!src/extra/tests/*",
      "!src/_private/*"
    ],
    async onSuccess() {
      await stripJsComments(["dist/**"], {
        logLevel: "error"
      });

      await cleanJsBuildArtifacts(["dist/**"], {
        logLevel: "error"
      });
      await cleanTypesBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeSourceMap: true,
        removeAdjacentEmptyLines: true
      });

      await generateReferenceIndex(
        [
          "dist/extra/*.d.ts",
          "dist/hoc/*.d.ts",
          "dist/progress-bar/*.d.ts",
          "dist/themes/*.d.ts",
          "dist/utils/index.d.ts"
        ],
        {
          logLevel: "error"
        }
      );
      await generateReferenceIndex(
        [
          "dist/extra/*.d.cts",
          "dist/hoc/*.d.cts",
          "dist/progress-bar/*.d.cts",
          "dist/themes/*.d.cts",
          "dist/utils/index.d.cts"
        ],
        {
          logLevel: "error",
          outFileName: "index.d.cts"
        }
      );

      await copyFileToDest(
        {
          source: "src/progress-bar/css/default.css",
          target: "progress-bar"
        },
        {
          logLevel: "error"
        }
      );

      await injectDirective("dist/**/*.cjs", ["use strict"], {
        logLevel: "error"
      });

      await runCommand("del-cli", [
        // eslint-disable-next-line quotes
        '"dist/types/index.{js,mjs,js.map,cjs,cjs.map}"'
      ]);

      await ensureFinalNewline(["dist/**"], {
        logLevel: "error"
      });
    }
  };
});
