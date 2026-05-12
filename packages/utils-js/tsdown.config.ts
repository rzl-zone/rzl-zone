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

  return [
    {
      entry: { "rzl-utils": "src/browser.ts" },
      format: ["iife"],
      globalName: "RzlUtilsJs",
      platform: "browser",
      outputOptions: {
        comments: {
          legal: false
        },
        entryFileNames: "[name].global.js"
      },
      minify: true,
      treeshake: true,
      splitting: false,
      sourcemap: false,
      dts: false,
      deps: {
        onlyBundle: false,
        alwaysBundle: ["libphonenumber-js/max", "date-fns", "date-fns/locale"]
      }
    },

    {
      entry: [
        "src/index.ts",
        "src/*/index.{ts,tsx}",

        "!src/browser.ts",
        "!src/types/private",
        "!src/**/*.types.*",
        "!src/types",
        "!src/**/types.{ts,tsx}",
        "!src/**/*.types.{ts,tsx}",
        "!src/*.types.{ts,tsx}"
      ],
      dts: { oxc: true },
      deps: {
        neverBundle: [
          "next",
          "react",
          "react-dom",
          "next/server",
          "date-fns",
          "server-only",
          "libphonenumber-js",
          "tailwindcss",
          "tailwind-merge-v3",
          "tailwind-merge-v4"
        ]
      },
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
          ["dist/**/index.d.ts", "!dist/index.d.ts"],
          {
            logLevel: "error"
          }
        );
        await generateReferenceIndex(
          ["dist/**/index.d.cts", "!dist/index.d.cts"],
          {
            logLevel: "error",
            outFileName: "index.d.cts"
          }
        );

        await injectDirective("dist/**/*.cjs", ["use strict"], {
          logLevel: "error"
        });

        await runCommand("del-cli", [
          // eslint-disable-next-line quotes
          '"dist/types/index.{js,mjs,js.map,cjs,cjs.map}"',
          // eslint-disable-next-line quotes
          '"dist/index.{js,mjs,js.map,cjs,cjs.map}"',
          // eslint-disable-next-line quotes
          '"dist/index.d.{ts,cts,mts,esm}"'
        ]);

        await ensureFinalNewline(["dist/**"], {
          logLevel: "error"
        });
      }
    }
  ];
});
