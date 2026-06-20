import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";
import _commonjs from "@rollup/plugin-commonjs";
import _resolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import _preserveDirectives from "rollup-plugin-preserve-directives";
import {
  cleanJsBuildArtifacts,
  copyFileToDest,
  ensureFinalNewline,
  generatePackageBanner,
  stripJsComments,
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

      await injectDirective("dist/index.{js,cjs}", ["use client"], {
        logLevel: "error"
      });

      await copyFileToDest(
        [
          {
            source: "./dist/index.d.ts",
            target: ".",
            fileName: "index.d.cts"
          }
        ],
        {
          logLevel: "error"
        }
      );

      await injectBanner(["dist/**"], [await generatePackageBanner()], {
        logLevel: "error"
      });

      await stripJsComments("dist/*.{js}", {
        logLevel: "error",
        sourceType: "module"
      });
      await stripJsComments("dist/*.{cjs}", {
        logLevel: "error",
        sourceType: "commonjs"
      });

      await ensureFinalNewline(["dist/*"], { logLevel: "error" });
    }
  };
}

/** @typedef {import("rollup-plugin-esbuild").Options["format"]} EsbuildFormat  */
/** @param {EsbuildFormat} esbuildFormat  */
const getSharedPlugins = (esbuildFormat) => [
  peerDepsExternal(),
  esbuild({
    tsconfig: "tsconfig.json",
    target: "es2015",
    minifySyntax: true,
    minifyIdentifiers: false,
    minifyWhitespace: false,
    treeShaking: true,
    legalComments: "none",
    format: esbuildFormat
  }),
  _commonjs(),
  _resolve(),
  postcss({
    extract: "main.css"
  })
];

export default defineConfig([
  buildStage(del({ targets: "./dist" + "/*" }), {
    clean: true,
    silent: true
  }),

  // ESM
  {
    input: "./src/index.tsx",
    output: {
      dir: "./dist",
      format: "esm",
      sourcemap: true,
      preserveModules: false,
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js",
      banner: await generatePackageBanner()
    },
    watch: {
      onInvalidate: async () => {
        console.log("🔄 Rebuilding...");
      }
    },
    plugins: getSharedPlugins("esm")
  },

  // CJS
  {
    input: "./src/index.tsx",
    output: {
      dir: "./dist",
      format: "commonjs",
      sourcemap: true,
      preserveModules: false,
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name].cjs",
      banner: await generatePackageBanner()
    },
    watch: {
      onInvalidate: async () => {
        console.log("🔄 Rebuilding...");
      }
    },
    plugins: getSharedPlugins("cjs")
  },

  // types
  {
    input: "./src/index.tsx",
    output: {
      file: "./dist/index.d.ts",
      format: "esm",
      banner: await generatePackageBanner()
    },
    plugins: [dts()]
  },

  buildStage(onSuccessPlugin())
]);
