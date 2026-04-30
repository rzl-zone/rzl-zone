import { flatConfigs } from "@rzl-zone/eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { nextJsConfig } from "@workspace/eslint-config/next-js";

export default defineConfig([
  ...nextJsConfig,

  globalIgnores([
    "dist/**/*",
    "**/dist",
    "**/dev",
    "node_modules/**/*",
    "docs/**/*",
    "deprecated/**/*"
  ]),
  {
    ...flatConfigs.recommended,
    files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}"]
  },
  {
    files: [
      "src/**/*.{ts,tsx}",
      "tests/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}",
      "*.*.*js",
      "*.*.*ts",
      "internal-global.d.ts"
    ],
    rules: {
      "no-useless-assignment": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/preserve-manual-memoization": "off",
      "@typescript-eslint/no-unused-expressions": "off"
    }
  },
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  }
]);
