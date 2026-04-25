import js from "@eslint/js";
import tseslint from "typescript-eslint";
import turboPlugin from "eslint-plugin-turbo";
import eslintConfigPrettier from "eslint-config-prettier";
// import onlyWarn from "eslint-plugin-only-warn";

/** A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn"
    }
  },
  {
    rules: {
      semi: "warn",
      quotes: "warn",
      "comma-dangle": [
        "warn",
        {
          arrays: "never",
          objects: "never",
          imports: "never",
          exports: "never",
          functions: "never"
        }
      ],
      "prefer-const": "off",
      "no-unreachable": "warn",
      "no-useless-escape": "warn",
      "import/no-anonymous-default-export": "off"
    }
  },
  {
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          "ts-check": "allow-with-description",
          minimumDescriptionLength: 3
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    ignores: ["dist/**"]
  }
];
