import {
  cleanJsBuildArtifacts,
  cleanTypesBuildArtifacts,
  ensureFinalNewline,
  generatePackageBanner,
  generateReferenceIndex,
  injectBanner,
  injectDirective,
  stripJsComments
} from "@/index";

import { nodeExternalPatterns } from "@/bundler/utils";
import { externalEsmRequirePlugin } from "@/bundler/rolldown";
import { type ConfigOptions, resolveDefaultConfig } from "@/bundler/tsdown";

const _browserBuild: ConfigOptions = () => {
  return {
    entry: { browser: "src/browser.ts" },
    outputOptions: {
      name: "rzlBuildTools"
    },
    format: "umd",
    minify: true,
    platform: "browser",
    sourcemap: false,
    dts: false,
    plugins: [externalEsmRequirePlugin()],
    deps: {
      // alwaysBundle: ["picocolors"],
      neverBundle: nodeExternalPatterns
    }
  };
};

export default resolveDefaultConfig(() => {
  // applyWarningFilter();

  return [
    {
      entry: {
        index: "src/index.ts",
        "utils/server": "src/utils/server.ts",
        "utils/client": "src/utils/client.ts",
        "bundler/rolldown": "src/bundler/rolldown.ts",
        "bundler/tsdown": "src/bundler/tsdown.ts",
        "bundler/utils": "src/bundler/utils.ts",
        "commander-kit/index": "src/commander-kit/public/index.ts"
      },
      dts: { oxc: true },

      async onSuccess() {
        // await runCommandCapture("pnpm", ["build:types"]);
        await stripJsComments(["dist/**"], {
          logLevel: "error"
        });

        await cleanJsBuildArtifacts(["dist/**"], {
          logLevel: "error"
        });

        await cleanTypesBuildArtifacts(["dist/**"], {
          logLevel: "error"
        });

        await injectDirective(["dist/**", "!dist/browser.*"], ["use strict"], {
          logLevel: "error"
        });

        await generateReferenceIndex(
          [
            "dist/index.d.ts",
            "dist/bundler/*.d.ts",
            "dist/commander-kit/index.d.ts",
            "dist/utils/{server,client}.d.ts"
          ],
          {
            logLevel: "error"
          }
        );

        await generateReferenceIndex(
          [
            "dist/index.d.cts",
            "dist/commander-kit/index.d.cts",
            "dist/bundler/*.d.cts",
            "dist/utils/{server,client}.d.cts"
          ],
          {
            outFileName: "index.d.cts",
            logLevel: "error"
          }
        );

        await injectBanner(["dist/**"], [await generatePackageBanner()], {
          logLevel: "error"
        });

        await ensureFinalNewline(["dist/**"], { logLevel: "error" });
      }
    }
  ];
});
