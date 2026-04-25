import { nextJsConfig } from "@workspace/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];
