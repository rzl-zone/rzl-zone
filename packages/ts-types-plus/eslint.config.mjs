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
    ],
    rules: {
      "prefer-const": "warn",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
]);
