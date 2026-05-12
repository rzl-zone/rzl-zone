// import js from "@eslint/js";
// import tsEslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { config } from "@workspace/eslint-config/base";

export default defineConfig([
  ...config,
  globalIgnores([
    "dist/**/*",
    "dist/**/*",
    "**/dist",
    "**/dev",
    "node_modules/**/*",
    "docs/**/*",
    "deprecated/**/*",
    "_deprecated/**/*"
  ]),
  {
    files: [
      "src/**/*.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}",
      "*.config.{ts,js,*js}",
      "internal-global.d.ts"
    ]
  }
]);
