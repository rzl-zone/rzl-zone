import { nextJsConfig } from "@workspace/eslint-config/next-js";
import { globalIgnores } from "eslint/config";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,

  globalIgnores([
    ".next/**/*",
    ".source/**/*",
    ".turbo/**/*",
    "_deprecated/**/*",
    "deprecated/**/*",
    "data/cache/**/*",
    "node_modules/**/*"
  ]),

  {
    rules: {
      "react-hooks/set-state-in-effect": "warn"
    }
  }
];
