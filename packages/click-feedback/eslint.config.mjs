import { flatConfigs } from "@rzl-zone/eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { config } from "@workspace/eslint-config/react-internal";

export default defineConfig([
  ...config,
  flatConfigs.recommended,
  {
    files: [
      "src/*.{ts,tsx}",
      "src/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}",
      "*.*.*js",
      "*.*.*ts"
    ],
    plugins: {},
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/preserve-manual-memoization": "off"
    }
  },
  globalIgnores(["dist/**/*", "node_modules/**/*", "deprecated/**/*"])
]);
