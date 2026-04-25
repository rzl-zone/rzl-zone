import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
// import typescript from "rollup-plugin-typescript2";
import esbuild from "rollup-plugin-esbuild";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import _preserveDirectives from "rollup-plugin-preserve-directives";
import {
  cleanJsBuildArtifacts,
  ensureCssImport,
  copyFileToDest,
  ensureFinalNewline,
  generatePackageBanner,
  injectDirective,
  injectBanner
} from "@rzl-zone/build-tools";

import _terser from "@rollup/plugin-terser";
import { buildStage } from "./scripts/rollup.mjs";

/** @typedef {import("rollup").Plugin} Plugin */
/** @returns {Plugin} */
function onSuccessPlugin() {
  let isWatch = false;

  return {
    name: "on-success",
    buildStart() {
      isWatch = this.meta.watchMode;
    },
    async closeBundle() {
      console.log(isWatch ? "♻️  Rebuild success" : "✅ Build success");

      await cleanJsBuildArtifacts(["dist/**"], {
        logLevel: "error",
        removeAdjacentEmptyLines: true
      });

      await ensureCssImport("dist/index.{cjs,js}", {
        logLevel: "error",
        minify: true,
        cssImportPath: ["./main.css"]
      });

      await injectDirective("dist/**/*.cjs", ["use strict"], {
        logLevel: "error"
      });
      await injectDirective("dist/index.{js,cjs}", ["use client"], {
        logLevel: "error"
      });

      await copyFileToDest([
        { source: "./dist/index.d.ts", target: ".", fileName: "index.d.cts" }
      ]);

      await injectBanner(["dist/**"], [await generatePackageBanner()], {
        logLevel: "error"
      });

      await ensureFinalNewline(["dist/*"], { logLevel: "error" });
    }
  };
}

export default defineConfig([
  buildStage(del({ targets: "./dist" + "/*" }), {
    clean: true,
    silent: true
  }),
  {
    input: "./src/index.tsx",
    output: [
      {
        dir: "./dist",
        format: "esm",
        sourcemap: true,
        preserveModules: true,
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        plugins: [
          _terser({
            format: {
              comments: /^!/, // keep banner
              preserve_annotations: true
            }
          })
        ],
        banner: await generatePackageBanner()
      },
      {
        dir: "./dist",
        format: "cjs",
        sourcemap: true,
        preserveModules: true,
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name].cjs",
        plugins: [
          _terser({
            format: {
              comments: /^!/, // keep banner
              preserve_annotations: true
            }
          })
        ],
        banner: await generatePackageBanner()
      }
    ],
    watch: {
      onInvalidate: async () => {
        console.log("🔄 Rebuilding...");
      }
    },
    onwarn(warning, warn) {
      if (
        warning?.code === "MODULE_LEVEL_DIRECTIVE" &&
        warning?.message?.includes?.("use client")
      ) {
        return; // Silent
      }
      warn(warning);
    },
    external: ["react", "react-dom"],
    plugins: [
      peerDepsExternal(),
      esbuild({
        jsx: "automatic",
        tsconfig: "tsconfig.json"
      }),
      postcss({
        extract: "main.css",
        modules: false
      }),
      resolve(),
      // typescript({
      //   tsconfigOverride: {
      //     compilerOptions: {
      //       declaration: true
      //     }
      //   }
      // }),
      commonjs()
    ]
  },
  {
    input: "./src/index.tsx",
    output: {
      file: "./dist/index.d.cts",
      format: "cjs",
      banner: await generatePackageBanner()
    },
    plugins: [dts()]
  },
  {
    input: "./src/index.tsx",
    output: {
      file: "./dist/index.d.ts",
      format: "es",
      banner: await generatePackageBanner()
    },
    plugins: [dts()]
  },
  buildStage(onSuccessPlugin())
]);
