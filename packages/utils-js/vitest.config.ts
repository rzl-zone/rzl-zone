import path from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src"),
      tests: path.resolve(__dirname, "tests")
    },
    extensions: [".js", ".ts", ".json"]
  },
  test: {
    setupFiles: ["./tests/vitest.setup.ts"],
    exclude: [
      ...configDefaults.exclude,
      "**/*deprecated*/**",
      "**/*deprecated*.test.ts"
    ]
  }
});
