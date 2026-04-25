import { defineConfig } from "eslint/config";
import { config } from "@workspace/eslint-config/base";

export default defineConfig([
  ...config,
  {
    rules: {}
  }
]);
