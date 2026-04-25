import { defineConfig, globalIgnores } from "eslint/config";
import { config } from "@workspace/eslint-config/base";

export default defineConfig([
  ...config,
  globalIgnores([
    "dist/**/*",
    "**/dist",
    "**/dev",
    "node_modules/**/*",
    "docs/**/*",
    "deprecated/**/*"
  ])
]);
