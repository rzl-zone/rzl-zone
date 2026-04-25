import { flatConfigs } from "@rzl-zone/eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { config } from "@workspace/eslint-config/react-internal";

export default defineConfig([
  ...config,
  flatConfigs.recommended,
  {
    files: [
      "src/**/*.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}",
      "*.*.*js",
      "*.*.*ts"
    ],
    plugins: {},
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/preserve-manual-memoization": "off",
      "@typescript-eslint/no-unused-expressions": "off"
    }
  },
  globalIgnores([
    "dist/**/*",
    "**/dist",
    "**/dev",
    "node_modules/**/*",
    "docs/**/*",
    "deprecated/**/*"
  ])
]);
